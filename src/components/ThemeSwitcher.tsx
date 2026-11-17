import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  ABOUT_STYLES,
  CARD_STYLES,
  CONTACT_STYLES,
  DETAIL_STYLES,
  FONTS,
  FOOTER_STYLES,
  GALLERY_STYLES,
  INTRO_STYLES,
  REVIEW_STYLES,
  THEMES,
  applyAboutStyle,
  applyCardStyle,
  applyContactStyle,
  applyDetailStyle,
  applyFooterStyle,
  applyGalleryStyle,
  applyIntroStyle,
  applyReviewStyle,
  applyFont,
  applyTheme,
  getStoredFont,
  getStoredTheme,
} from "@/lib/themes";
import { useAboutStyle } from "@/hooks/use-about-style";
import { useCardStyle } from "@/hooks/use-card-style";
import { useContactStyle } from "@/hooks/use-contact-style";
import { useDetailStyle } from "@/hooks/use-detail-style";
import { useFooterStyle } from "@/hooks/use-footer-style";
import { useGalleryStyle } from "@/hooks/use-gallery-style";
import { useIntroStyle } from "@/hooks/use-intro-style";
import { DEMO_REVIEWS_AVAILABLE, setDemoReviews, useDemoReviews } from "@/hooks/use-demo-reviews";
import { useReviewStyle } from "@/hooks/use-review-style";

const THEME_EVENT = "los-theme-change";

function useSiteTheme() {
  const [themeId, setThemeId] = useState(getStoredTheme);

  useEffect(() => {
    const sync = () => setThemeId(getStoredTheme());
    window.addEventListener(THEME_EVENT, sync);
    return () => window.removeEventListener(THEME_EVENT, sync);
  }, []);

  const select = (id: string) => {
    applyTheme(id);
    setThemeId(id);
    window.dispatchEvent(new Event(THEME_EVENT));
  };

  return [themeId, select] as const;
}

function useSiteFont() {
  const [fontId, setFontId] = useState(getStoredFont);
  const select = (id: string) => {
    applyFont(id);
    setFontId(id);
  };
  return [fontId, select] as const;
}

/** Artist's palette whose paint dots always show the active theme's colours. */
function PaletteIcon({ colors }: { colors: string[] }) {
  const dots: [number, number][] = [
    [8.2, 7.6],
    [13.4, 6.6],
    [17.4, 10.6],
    [6.6, 12.6],
  ];
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
      {dots.map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r="1.55"
          fill={colors[i % colors.length]}
          stroke="currentColor"
          strokeOpacity="0.45"
          strokeWidth="0.6"
        />
      ))}
    </svg>
  );
}

/** Tiny wireframe of each trip-card design for the picker. */
function CardThumb({ id }: { id: string }) {
  const photo = "bg-gradient-to-br from-neutral-400 to-neutral-600";
  return (
    <span className="relative flex h-10 w-12 shrink-0 overflow-hidden rounded-md border border-black/10 bg-paper" aria-hidden>
      {id === "frame" ? (
        <span className="m-[2px] flex flex-1 flex-col gap-[2px] rounded-[3px] border border-black/20 p-[2px]">
          <span className={`h-[18px] rounded-[2px] ${photo}`} />
          <span className="mx-auto h-[2px] w-1/2 rounded bg-neutral-500" />
        </span>
      ) : id === "editorial" || id === "caption" ? (
        <span className="flex w-full flex-col gap-[2px] p-[3px]">
          <span className={`h-[22px] rounded-[2px] ${photo}`} />
          <span className="h-[2px] w-3/4 rounded bg-neutral-500" />
          <span className="h-[2px] w-1/2 rounded bg-neutral-300" />
        </span>
      ) : (
        <span className={`relative m-[3px] flex-1 rounded-[3px] ${photo}`}>
          {id === "plaque" ? (
            <span className="absolute inset-x-[2px] bottom-[2px] h-[9px] rounded-[2px] bg-paper" />
          ) : (
            <>
              <span className="absolute bottom-[8px] left-[3px] h-[2px] w-3/4 rounded bg-white" />
              {id !== "reveal" && <span className="absolute bottom-[4px] left-[3px] h-[2px] w-1/2 rounded bg-white/60" />}
              {id === "classic" && (
                <>
                  <span className="absolute left-[3px] top-[3px] h-[3px] w-3 rounded-full bg-white/60" />
                  <span className="absolute right-[3px] top-[3px] h-[3px] w-3 rounded-full bg-white/60" />
                </>
              )}
            </>
          )}
        </span>
      )}
    </span>
  );
}

export function ThemeSwitcher({ light = false }: { light?: boolean }) {
  const [themeId, select] = useSiteTheme();
  const [fontId, selectFont] = useSiteFont();
  const cardId = useCardStyle();
  const detailId = useDetailStyle();
  const introId = useIntroStyle();
  const galleryId = useGalleryStyle();
  const reviewId = useReviewStyle();
  const footerId = useFooterStyle();
  const aboutId = useAboutStyle();
  const contactId = useContactStyle();
  const demoReviews = useDemoReviews();
  const reduce = useReducedMotion();
  const active = THEMES.find((t) => t.id === themeId) ?? THEMES[0]!;

  const triggerTone = light
    ? "border-black/15 bg-black/[0.04] text-ink hover:bg-black/[0.08]"
    : "border-white/30 bg-white/10 text-white hover:bg-white/20";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <motion.button
          type="button"
          aria-label={`Change colour theme (current: ${active.name})`}
          title="Colour themes"
          {...(reduce ? {} : { whileHover: { rotate: -14, scale: 1.08 }, whileTap: { scale: 0.94 } })}
          transition={{ type: "spring", stiffness: 380, damping: 18 }}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white/70 ${triggerTone}`}
        >
          <PaletteIcon colors={[active.swatches[1], active.swatches[2], active.swatches[3], active.swatches[0]]} />
        </motion.button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={10}
        collisionPadding={12}
        data-lenis-prevent
        className="z-[100] max-h-[var(--radix-popover-content-available-height)] w-[min(320px,calc(100vw-24px))] overflow-y-auto overscroll-contain rounded-2xl border border-neutral-200 bg-paper p-2 text-ink shadow-[0_24px_60px_-20px_rgba(0,0,0,0.35)]"
      >
        <p className="px-3 pb-2 pt-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
          Colour theme
        </p>
        <div role="radiogroup" aria-label="Colour theme" className="flex flex-col gap-1">
          {THEMES.map((t) => {
            const selected = t.id === themeId;
            return (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => select(t.id)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ink/40 ${
                  selected ? "bg-neutral-100" : "hover:bg-neutral-50"
                }`}
              >
                <span className="flex shrink-0 -space-x-2" aria-hidden>
                  {t.swatches.map((c, i) => (
                    <span
                      key={i}
                      className="h-7 w-7 rounded-full border-2 border-paper shadow-sm ring-1 ring-black/10"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-semibold leading-tight">{t.name}</span>
                  <span className="block truncate text-[12px] text-neutral-500">{t.mood}</span>
                </span>
                {selected && <Check size={16} className="shrink-0 text-ink" aria-hidden />}
              </button>
            );
          })}
        </div>

        <p className="px-3 pb-2 pt-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
          Typography
        </p>
        <div role="radiogroup" aria-label="Typography" className="flex flex-col gap-1">
          {FONTS.map((f) => {
            const selected = f.id === fontId;
            return (
              <button
                key={f.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => selectFont(f.id)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ink/40 ${
                  selected ? "bg-neutral-100" : "hover:bg-neutral-50"
                }`}
              >
                <span className="flex w-12 shrink-0 items-baseline justify-center gap-0.5 leading-none" aria-hidden>
                  <span className="text-[26px]" style={{ fontFamily: f.preview[0] }}>A</span>
                  <span className="text-[15px]" style={{ fontFamily: f.preview[1] }}>a</span>
                  <span className="text-[18px]" style={{ fontFamily: f.preview[2] }}>g</span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-semibold leading-tight">{f.name}</span>
                  <span className="block truncate text-[12px] text-neutral-500">{f.mood}</span>
                </span>
                {selected && <Check size={16} className="shrink-0 text-ink" aria-hidden />}
              </button>
            );
          })}
        </div>

        <p className="px-3 pb-2 pt-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
          Trip cards
        </p>
        <div role="radiogroup" aria-label="Trip cards" className="grid grid-cols-2 gap-1">
          {CARD_STYLES.map((c) => {
            const selected = c.id === cardId;
            return (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => applyCardStyle(c.id)}
                title={c.mood}
                className={`flex items-center gap-2 rounded-xl px-2 py-2 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ink/40 ${
                  selected ? "bg-neutral-100" : "hover:bg-neutral-50"
                }`}
              >
                <CardThumb id={c.id} />
                <span className="min-w-0 flex-1 truncate text-[13px] font-semibold leading-tight">{c.name}</span>
                {selected && <Check size={14} className="shrink-0 text-ink" aria-hidden />}
              </button>
            );
          })}
        </div>
        <p className="px-3 pb-2 pt-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
          Trip page
        </p>
        <div role="radiogroup" aria-label="Trip page" className="flex flex-col gap-1">
          {DETAIL_STYLES.map((c) => {
            const selected = c.id === detailId;
            return (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => applyDetailStyle(c.id)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ink/40 ${
                  selected ? "bg-neutral-100" : "hover:bg-neutral-50"
                }`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-semibold leading-tight">{c.name}</span>
                  <span className="block truncate text-[12px] text-neutral-500">{c.mood}</span>
                </span>
                {selected && <Check size={16} className="shrink-0 text-ink" aria-hidden />}
              </button>
            );
          })}
        </div>

        <p className="px-3 pb-2 pt-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
          Trip intro
        </p>
        <div role="radiogroup" aria-label="Trip intro" className="flex flex-col gap-1">
          {INTRO_STYLES.map((c) => {
            const selected = c.id === introId;
            return (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => applyIntroStyle(c.id)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ink/40 ${
                  selected ? "bg-neutral-100" : "hover:bg-neutral-50"
                }`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-semibold leading-tight">{c.name}</span>
                  <span className="block truncate text-[12px] text-neutral-500">{c.mood}</span>
                </span>
                {selected && <Check size={16} className="shrink-0 text-ink" aria-hidden />}
              </button>
            );
          })}
        </div>

        <p className="px-3 pb-2 pt-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
          Trip reviews
        </p>
        <div role="radiogroup" aria-label="Trip reviews" className="flex flex-col gap-1">
          {REVIEW_STYLES.map((c) => {
            const selected = c.id === reviewId;
            return (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => applyReviewStyle(c.id)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ink/40 ${
                  selected ? "bg-neutral-100" : "hover:bg-neutral-50"
                }`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-semibold leading-tight">{c.name}</span>
                  <span className="block truncate text-[12px] text-neutral-500">{c.mood}</span>
                </span>
                {selected && <Check size={16} className="shrink-0 text-ink" aria-hidden />}
              </button>
            );
          })}
        </div>

        {DEMO_REVIEWS_AVAILABLE && (
          <button
            type="button"
            role="switch"
            aria-checked={demoReviews}
            onClick={() => setDemoReviews(!demoReviews)}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left outline-none transition-colors hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-ink/40"
          >
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-semibold leading-tight">Demo reviews</span>
              <span className="block truncate text-[12px] text-neutral-500">Invented reviews, local preview only</span>
            </span>
            <span
              aria-hidden
              className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${demoReviews ? "bg-ink" : "bg-neutral-300"}`}
            >
              <span
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${demoReviews ? "left-[18px]" : "left-0.5"}`}
              />
            </span>
          </button>
        )}

        <p className="px-3 pb-2 pt-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
          Contact page
        </p>
        <div role="radiogroup" aria-label="Contact page" className="flex flex-col gap-1">
          {CONTACT_STYLES.map((c) => {
            const selected = c.id === contactId;
            return (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => applyContactStyle(c.id)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ink/40 ${
                  selected ? "bg-neutral-100" : "hover:bg-neutral-50"
                }`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-semibold leading-tight">{c.name}</span>
                  <span className="block truncate text-[12px] text-neutral-500">{c.mood}</span>
                </span>
                {selected && <Check size={16} className="shrink-0 text-ink" aria-hidden />}
              </button>
            );
          })}
        </div>

        <p className="px-3 pb-2 pt-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
          About page
        </p>
        <div role="radiogroup" aria-label="About page" className="flex flex-col gap-1">
          {ABOUT_STYLES.map((c) => {
            const selected = c.id === aboutId;
            return (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => applyAboutStyle(c.id)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ink/40 ${
                  selected ? "bg-neutral-100" : "hover:bg-neutral-50"
                }`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-semibold leading-tight">{c.name}</span>
                  <span className="block truncate text-[12px] text-neutral-500">{c.mood}</span>
                </span>
                {selected && <Check size={16} className="shrink-0 text-ink" aria-hidden />}
              </button>
            );
          })}
        </div>

        <p className="px-3 pb-2 pt-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
          Footer
        </p>
        <div role="radiogroup" aria-label="Footer" className="flex flex-col gap-1">
          {FOOTER_STYLES.map((c) => {
            const selected = c.id === footerId;
            return (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => applyFooterStyle(c.id)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ink/40 ${
                  selected ? "bg-neutral-100" : "hover:bg-neutral-50"
                }`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-semibold leading-tight">{c.name}</span>
                  <span className="block truncate text-[12px] text-neutral-500">{c.mood}</span>
                </span>
                {selected && <Check size={16} className="shrink-0 text-ink" aria-hidden />}
              </button>
            );
          })}
        </div>

        <p className="px-3 pb-2 pt-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
          Place gallery
        </p>
        <div role="radiogroup" aria-label="Place gallery" className="flex flex-col gap-1">
          {GALLERY_STYLES.map((c) => {
            const selected = c.id === galleryId;
            return (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => applyGalleryStyle(c.id)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ink/40 ${
                  selected ? "bg-neutral-100" : "hover:bg-neutral-50"
                }`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-semibold leading-tight">{c.name}</span>
                  <span className="block truncate text-[12px] text-neutral-500">{c.mood}</span>
                </span>
                {selected && <Check size={16} className="shrink-0 text-ink" aria-hidden />}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
