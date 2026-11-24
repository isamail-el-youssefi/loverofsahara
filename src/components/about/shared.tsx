import { useId, useState } from "react";
import { motion } from "framer-motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Plus } from "lucide-react";
import { GoogleReviewsBadge } from "@/components/footer/GoogleReviewsBadge";
import { fadeUp } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { HERO_PHOTO, OWNER as OWNER_EN } from "./content";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useAboutContent } from "./useAboutContent";

const fallbackPhoto = HERO_PHOTO;

/** Salah's portrait from the old site; if that file cannot load, a desert photo stands in. */
export function Portrait({ className, alt }: { className?: string; alt?: string }) {
  const { site } = useLanguage();
  const [src, setSrc] = useState(OWNER_EN.portrait ?? fallbackPhoto);
  return (
    <img
      src={src}
      alt={alt ?? site.about.portraitAlt}
      loading="lazy"
      draggable={false}
      onError={() => setSrc(fallbackPhoto)}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}

/**
 * Accordion, one question open at a time. The answer's height animates with a CSS grid-row transition
 * (0fr to 1fr), so the answer that closes and the one that opens slide together and the questions below
 * glide instead of jumping. Each question is a real button (aria-expanded / aria-controls).
 */
export function Faq({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { FAQ } = useAboutContent();
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(0);
  const dark = tone === "dark";
  return (
    <div className={cn("border-b", dark ? "border-white/15" : "border-ink/10")}>
      {FAQ.map((f, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-panel-${i}`;
        return (
          <div key={f.q} className={cn("border-t", dark ? "border-white/15" : "border-ink/10")}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                style={{ WebkitTapHighlightColor: "transparent" }}
                className="flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-left text-[18px] font-semibold tracking-[-0.02em] outline-none focus-visible:ring-2 focus-visible:ring-current md:py-6 md:text-[21px]"
              >
                {f.q}
                <Plus
                  size={20}
                  aria-hidden
                  className={cn(
                    "shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:duration-150",
                    isOpen && "rotate-45",
                  )}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-hidden={!isOpen}
              onTransitionEnd={(e) => {
                // Heights changed: let the scroll-driven section effects re-measure once the slide has finished
                if (e.target === e.currentTarget && e.propertyName === "grid-template-rows") ScrollTrigger.refresh();
              }}
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:duration-150",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="min-h-0 overflow-hidden">
                <p className={cn("max-w-[44rem] pb-6 text-[15.5px] leading-[1.65]", dark ? "text-white/70" : "text-ink/75")}>
                  {f.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Real guest words plus the Google rating badge. */
export function ReviewsBlock({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { QUOTES } = useAboutContent();
  const { site } = useLanguage();
  const dark = tone === "dark";
  return (
    <div>
      <div className="mb-10 flex flex-wrap items-center justify-between gap-6">
        <GoogleReviewsBadge tone={dark ? "dark" : "light"} />
        <p className={cn("max-w-sm text-[14px]", dark ? "text-white/60" : "text-neutral-500")}>
          {site.about.reviewsNote}
        </p>
      </div>
      <div className="grid gap-[6px] md:grid-cols-3">
        {QUOTES.map((q, i) => (
          <motion.figure
            key={q.name}
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: i * 0.08 }}
            className={cn(
              "flex flex-col justify-between gap-8 rounded-2xl p-6 md:p-8",
              dark ? "bg-white/[0.06]" : "bg-ink/[0.045]",
            )}
          >
            <blockquote className="text-[16px] leading-[1.6] md:text-[17px]">“{q.text}”</blockquote>
            <figcaption className={cn("text-[13px]", dark ? "text-white/60" : "text-neutral-500")}>
              <span className={cn("font-semibold", dark ? "text-white" : "text-ink")}>{q.name}</span>, {q.from}
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </div>
  );
}

/** Three short commitments in a ruled list. */
export function SustainabilityList({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { SUSTAINABILITY } = useAboutContent();
  const dark = tone === "dark";
  return (
    <ol className={cn("border-b", dark ? "border-white/15" : "border-ink/10")}>
      {SUSTAINABILITY.map((s, i) => (
        <li
          key={s.title}
          className={cn("grid grid-cols-[2rem_1fr] gap-x-4 border-t py-5 md:py-6", dark ? "border-white/15" : "border-ink/10")}
        >
          <span className={cn("pt-1.5 text-[12px] tabular-nums", dark ? "text-white/50" : "text-neutral-400")}>
            {String(i + 1).padStart(2, "0")}
          </span>
          <div>
            <h3 className="text-[19px] font-semibold tracking-[-0.02em] md:text-[22px]">{s.title}</h3>
            <p className={cn("mt-1.5 max-w-[38rem] text-[15px] leading-[1.6]", dark ? "text-white/70" : "text-ink/70")}>
              {s.text}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Four numbers in a row. */
export function StatsRow({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  const { STATS } = useAboutContent();
  const dark = tone === "dark";
  return (
    <dl className={cn("grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4", className)}>
      {STATS.map((s) => (
        <div key={s.n + s.label}>
          <dt className="text-[44px] font-light leading-none tracking-[-0.04em] tabular-nums md:text-[64px]">{s.n}</dt>
          <dd
            className={cn(
              "mt-3 max-w-[14rem] text-[11px] font-semibold uppercase leading-[1.35] tracking-[0.06em]",
              dark ? "text-white/60" : "text-neutral-500",
            )}
          >
            {s.label}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Closing call to action card, same as the place page's "Plan this trip". */
export function CtaCard() {
  const { CTA } = useAboutContent();
  return (
    <div className="rounded-2xl bg-ink-deep px-6 py-14 text-center text-white md:px-12 md:py-20">
      <h2 className="mx-auto max-w-[16ch] text-[32px] font-semibold leading-[1.05] tracking-[-0.035em] md:text-[52px]">
        {CTA.title}
      </h2>
      <p className="mx-auto mt-4 max-w-md text-[15px] leading-normal text-white/70">{CTA.lead}</p>
      <div className="mt-7">
        <a
          href={CTA.mailto}
          className="inline-flex h-[46px] items-center justify-center rounded-[10px] bg-paper px-7 text-sm font-semibold text-ink transition-all duration-100 ease-out hover:bg-neutral-100 active:scale-[0.98]"
        >
          {CTA.button}
        </a>
      </div>
    </div>
  );
}
