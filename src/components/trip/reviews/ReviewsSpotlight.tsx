import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatReviewDate, summarize } from "@/lib/reviews";
import { Band, Eyebrow } from "../parts";
import { AddReviewButton } from "./AddReview";
import type { ReviewsProps } from "./ReviewsEditorial";
import { PhotoStrip, RT, ReplyBlock, ReviewText, Stars } from "./shared";

/** Quote size by length: short praise is set big, long stories stay readable. */
const quoteSize = (n: number) =>
  n > 700 ? "text-[17px] leading-[1.7] md:text-[20px]" : n > 320 ? "text-[21px] leading-[1.5] md:text-[26px]" : n > 140 ? "text-[27px] leading-[1.3] md:text-[36px]" : "text-[32px] leading-[1.18] md:text-[48px]";

/**
 * Variation 2, "Spotlight": a dark band that gives each review the whole stage, one at a time, set like a pull
 * quote in the site's light display type. Arrows, dots and the keyboard move between them; the summary and the
 * add button sit underneath. With no reviews the band turns into a single big invitation.
 */
export function ReviewsSpotlight({ tripSlug, tripTitle, reviews }: ReviewsProps) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const has = reviews.length > 0;
  const summary = summarize(reviews);
  const last = reviews.length - 1;
  const go = (i: number) => setIndex(Math.max(0, Math.min(last, i)));
  const r = reviews[Math.min(index, last)];

  return (
    <Band id="reviews" tone="dark" fullHeight className="py-20 md:py-28">
      <div className="mx-auto flex w-full max-w-[60rem] flex-col items-center text-center">
        <Eyebrow className="!text-white/60">{RT.eyebrow}</Eyebrow>

        {has && r ? (
          <div
            role="group"
            aria-roledescription="carousel"
            aria-label="Traveller reviews"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") go(index - 1);
              if (e.key === "ArrowRight") go(index + 1);
            }}
            className="mt-6 w-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <span className="block text-[84px] font-light leading-[0.6] text-brand opacity-90 md:text-[120px]" aria-hidden>
              “
            </span>

            <div className="min-h-[18rem]" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.figure
                  key={r.id}
                  initial={{ opacity: 0, y: reduce ? 0 : 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduce ? 0 : -10 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center"
                >
                  <blockquote className="w-full">
                    <ReviewText
                      text={r.comment}
                      lines={7}
                      dark
                      className={`mx-auto max-w-[52rem] font-light tracking-[-0.02em] text-white ${quoteSize(r.comment.length)}`}
                    />
                  </blockquote>
                  <figcaption className="mt-8 flex flex-col items-center gap-2">
                    <Stars value={r.rating} size={16} className="text-white" />
                    <span className="flex items-center gap-2 text-[16px] font-semibold tracking-[-0.01em]">
                      {r.name}
                    </span>
                    <span className="text-[13px] text-white/55">
                      {formatReviewDate(r.date)}
                      {r.lang !== "en" ? ` · ${RT.original(r.lang)}` : ""}
                    </span>
                  </figcaption>
                  <PhotoStrip photos={r.photos} name={r.name} className="mt-6 justify-center" />
                  {r.reply && <ReplyBlock reply={r.reply} dark className="mt-8 max-w-[34rem] text-left" />}
                </motion.figure>
              </AnimatePresence>
            </div>

            {reviews.length > 1 && (
              <div className="mt-10 flex items-center justify-center gap-5">
                <button
                  type="button"
                  aria-label="Previous review"
                  disabled={index === 0}
                  onClick={() => go(index - 1)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/60 disabled:opacity-30"
                >
                  <ChevronLeft size={20} aria-hidden />
                </button>
                <div className="flex items-center gap-2" role="tablist" aria-label="Choose a review">
                  {reviews.map((rv, i) => (
                    <button
                      key={rv.id}
                      type="button"
                      role="tab"
                      aria-selected={i === index}
                      aria-label={`Review ${i + 1} of ${reviews.length}, by ${rv.name}`}
                      onClick={() => go(i)}
                      className={`h-2 rounded-full outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-white/60 ${
                        i === index ? "w-7 bg-white" : "w-2 bg-white/30 hover:bg-white/55"
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  aria-label="Next review"
                  disabled={index === last}
                  onClick={() => go(index + 1)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/60 disabled:opacity-30"
                >
                  <ChevronRight size={20} aria-hidden />
                </button>
              </div>
            )}

            <div className="mt-12 flex flex-col items-center justify-center gap-5 border-t border-white/15 pt-8 sm:flex-row sm:gap-8">
              <div className="flex items-center gap-3 text-[14px] text-white/70">
                <span className="text-[28px] font-light leading-none tracking-[-0.03em] text-white tabular-nums">{summary.average.toFixed(1)}</span>
                <Stars value={summary.average} size={15} className="text-white" />
                <span>{RT.basedOn(summary.count)}</span>
              </div>
              <AddReviewButton tripSlug={tripSlug} tripTitle={tripTitle} tone="light" />
            </div>
          </div>
        ) : (
          <div className="mt-8 flex flex-col items-center">
            <p className="max-w-[14ch] text-[40px] font-light leading-[1.05] tracking-[-0.035em] md:text-[64px]">{RT.firstLine}</p>
            <p className="mt-6 max-w-md text-[16px] leading-[1.65] text-white/65">{RT.emptyLead}</p>
            <AddReviewButton tripSlug={tripSlug} tripTitle={tripTitle} tone="light" className="mt-9" />
          </div>
        )}
      </div>
    </Band>
  );
}
