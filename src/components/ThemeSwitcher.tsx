import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  ABOUT_STYLES,
  BROCHURES_STYLES,
  CONTACT_STYLES,
  FOOTER_STYLES,
  GALLERY_STYLES,
  HOME_TRIPS_STYLES,
  PHOTOS_STYLES,
  REVIEW_STYLES,
  THEMES,
  applyAboutStyle,
  applyBrochuresStyle,
  applyContactStyle,
  applyFooterStyle,
  applyGalleryStyle,
  applyHomeTripsStyle,
  applyPhotosStyle,
  applyReviewStyle,
  getStoredTheme,
} from "@/lib/themes";
import { useAboutStyle } from "@/hooks/use-about-style";
import { useBrochuresStyle } from "@/hooks/use-brochures-style";
import { useContactStyle } from "@/hooks/use-contact-style";
import { useFooterStyle } from "@/hooks/use-footer-style";
import { useGalleryStyle } from "@/hooks/use-gallery-style";
import { useHomeTripsStyle } from "@/hooks/use-home-trips-style";
import { usePhotosStyle } from "@/hooks/use-photos-style";
import { useReviewStyle } from "@/hooks/use-review-style";

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

export function ThemeSwitcher({ light = false }: { light?: boolean }) {
  const galleryId = useGalleryStyle();
  const reviewId = useReviewStyle();
  const homeTripsId = useHomeTripsStyle();
  const footerId = useFooterStyle();
  const aboutId = useAboutStyle();
  const contactId = useContactStyle();
  const brochuresId = useBrochuresStyle();
  const photosId = usePhotosStyle();
  const reduce = useReducedMotion();
  const active = THEMES.find((t) => t.id === getStoredTheme()) ?? THEMES[0]!;

  const triggerTone = light
    ? "border-black/15 bg-black/[0.04] text-ink hover:bg-black/[0.08]"
    : "border-white/30 bg-white/10 text-white hover:bg-white/20";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <motion.button
          type="button"
          aria-label={`Site options`}
          title="Site options"
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
          Home trips
        </p>
        <div role="radiogroup" aria-label="Home trips" className="flex flex-col gap-1">
          {HOME_TRIPS_STYLES.map((c) => {
            const selected = c.id === homeTripsId;
            return (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => applyHomeTripsStyle(c.id)}
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
          Gallery page
        </p>
        <div role="radiogroup" aria-label="Gallery page" className="flex flex-col gap-1">
          {PHOTOS_STYLES.map((c) => {
            const selected = c.id === photosId;
            return (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => applyPhotosStyle(c.id)}
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
          Brochures page
        </p>
        <div role="radiogroup" aria-label="Brochures page" className="flex flex-col gap-1">
          {BROCHURES_STYLES.map((c) => {
            const selected = c.id === brochuresId;
            return (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => applyBrochuresStyle(c.id)}
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
