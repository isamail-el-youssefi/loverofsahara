import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { GOOGLE_MAPS_URL, GOOGLE_REVIEWS_LIST } from "@/data/reviews/google";
import { GoogleLogo } from "@/components/footer/GoogleReviewsBadge";
import { GOOGLE_REVIEWS } from "@/components/footer/data";
import { Stars } from "@/components/trip/reviews/shared";
import { fadeUp } from "@/lib/animations";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/i18n/LanguageProvider";
import { PAGES } from "@/i18n/pages";

/** Quote size by length: the long reviews are set smaller so they stay comfortable to read in full. */
const quoteSize = (n: number) =>
  n > 480
    ? "text-[18px] leading-[1.55] md:text-[22px]"
    : n > 300
      ? "text-[20px] leading-[1.5] md:text-[26px]"
      : "text-[24px] leading-[1.4] md:text-[32px]";

/**
 * Home "Complete" layout: one review at a time, set as a quiet pull quote with a hairline index underneath.
 * No boxes: type, space and thin rules only.
 */
export function HomeReviews() {
  const reviews = GOOGLE_REVIEWS_LIST;
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  const { lang, site } = useLanguage();
  const t = PAGES[lang].home.reviews;
  const [index, setIndex] = useState(0);
  if (reviews.length === 0) return null;

  const last = reviews.length - 1;
  const go = (i: number) => setIndex(Math.max(0, Math.min(last, i)));
  const r = reviews[Math.min(index, last)]!;
  const text = r.text;
  const fade = reduce
    ? { initial: false as const, animate: { opacity: 1 }, exit: { opacity: 1 }, transition: { duration: 0 } }
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <section
      id="reviews"
      // Phone: slides under the next section like the others (it had no parallax)
      {...(isMobile ? { "data-st-01": "parallax", "data-st-y": "250", "data-st-opacity": "0.15" } : {})}
      className="bg-paper px-4 py-[var(--section-y)] md:px-10"
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[2fr_3fr] lg:gap-20">
        <div className="lg:sticky lg:top-10 lg:self-start">
          <div className="flex items-center gap-2 text-[13px] font-medium text-neutral-500">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden /> {t.eyebrow}
          </div>
          <h2
            data-reveal-01="words"
            data-scroll
            className="mt-5 text-[36px] font-semibold leading-[1.05] tracking-[-0.05em] text-ink md:text-[60px]"
          >
            {t.h2a} <span className="font-normal text-neutral-400">{t.h2b}</span>
          </h2>
          <motion.div {...fadeUp} className="mt-10 flex items-end gap-4">
            <span className="text-[64px] font-light leading-[0.9] tracking-[-0.05em] text-ink md:text-[80px]">
              {GOOGLE_REVIEWS.rating.toFixed(1)}
            </span>
            <div className="pb-1">
              <Stars value={GOOGLE_REVIEWS.rating} size={15} />
              <p className="mt-1.5 flex items-center gap-1.5 text-[12px] text-neutral-500">
                <GoogleLogo size={13} /> {GOOGLE_REVIEWS.count} {site.footer.googleReviews}
              </p>
            </div>
          </motion.div>
        </div>

        <div
          role="group"
          aria-roledescription="carousel"
          aria-label={t.aria}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") go(index - 1);
            if (e.key === "ArrowRight") go(index + 1);
          }}
          className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
        >
          <div className="min-h-[26rem] md:min-h-[30rem]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure key={r.id} {...fade} className="m-0">
                <blockquote
                  lang={r.lang}
                  className={`whitespace-pre-line font-light tracking-[-0.02em] text-ink ${quoteSize(text.length)}`}
                >
                  “{text}”
                </blockquote>
                <figcaption className="mt-8 border-t border-ink/10 pt-5 text-[13px] text-neutral-500">
                  <span className="font-semibold text-ink">{r.name}</span>
                  <span aria-hidden> · </span>
                  <span className="inline-flex items-center gap-1.5 align-middle">
                    <GoogleLogo size={13} /> {t.source}
                  </span>
                  <span className="mt-1 block text-[12px]">{t.original.replace("{lang}", "Français")}</span>
                  <a
                    href={GOOGLE_MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-[13px] font-medium text-ink underline-offset-4 hover:underline"
                  >
                    {t.readAll} <ArrowUpRight size={14} aria-hidden />
                  </a>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <ol className="mt-10 flex gap-6 overflow-x-auto border-t border-ink/10 [scrollbar-width:none] md:gap-10">
            {reviews.map((rv, i) => {
              const active = i === index;
              return (
                <li key={rv.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-current={active}
                    className={`-mt-px flex items-baseline gap-2 border-t py-4 text-[13px] outline-none transition-colors focus-visible:text-ink ${
                      active ? "border-ink text-ink" : "border-transparent text-neutral-400 hover:text-ink"
                    }`}
                  >
                    <span className="tabular-nums text-[11px]">{String(i + 1).padStart(2, "0")}</span>
                    {rv.name.split(" ")[0]}
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
