import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { fadeUp } from "@/lib/animations";
import { LANGUAGE_NAMES, formatReviewDate, summarize, type Review } from "@/lib/reviews";
import { Band, SectionTitle } from "../parts";
import { AddReviewButton } from "./AddReview";
import { useLanguage } from "@/i18n/LanguageProvider";
import { fill } from "@/i18n/reviewStrings";
import { useReviewT } from "@/i18n/useReviewT";
import { PhotoStrip, RatingSummary, ReplyBlock, ReviewText, Stars, dateLocale } from "./shared";

export interface ReviewsProps {
  tripSlug: string;
  tripTitle: string;
  reviews: Review[];
}

/**
 * Variation 1, "Editorial": the same 40/60 rhythm as the gallery. Rating summary and the add button on the left,
 * the reviews as a ruled list (like the day by day) on the right. With no reviews the right side becomes an
 * invitation instead of an empty hole.
 */
export function ReviewsEditorial({ tripSlug, tripTitle, reviews }: ReviewsProps) {
  const RT = useReviewT();
  const { lang } = useLanguage();
  const has = reviews.length > 0;
  const summary = summarize(reviews);

  return (
    <Band id="reviews" tone="paper" fullHeight>
      <motion.div {...fadeUp} className="grid gap-12 lg:grid-cols-[2fr_3fr] lg:gap-14">
        <div className="lg:sticky lg:top-10 lg:self-start">
          <SectionTitle eyebrow={RT.eyebrow}>{RT.title}</SectionTitle>
          {has ? (
            <>
              <RatingSummary summary={summary} className="mt-9 max-w-sm" />
              <AddReviewButton tripSlug={tripSlug} tripTitle={tripTitle} tone="solid" className="mt-9" />
            </>
          ) : (
            <p className="mt-5 text-[15.5px] text-ink/60">{RT.emptyTitle}</p>
          )}
        </div>

        {has ? (
          <ol className="border-b border-ink/10">
            {reviews.map((r) => (
              <li key={r.id} className="border-t border-ink/10 py-8 md:py-10">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                  <h3 className="text-[19px] font-semibold tracking-[-0.02em]">{r.name}</h3>
                  <Stars value={r.rating} size={15} />
                  <span className="text-[13px] text-ink/50">{formatReviewDate(r.date, dateLocale(lang))}</span>
                </div>
                {r.lang !== lang && <p className="mt-1 text-[12px] text-ink/50">{fill(RT.original, { lang: LANGUAGE_NAMES[r.lang] })}</p>}
                <ReviewText text={r.comment} lines={6} className="mt-4 max-w-[42rem] text-[16px] leading-[1.75] text-ink/85" />
                <PhotoStrip photos={r.photos} name={r.name} className="mt-5" />
                {r.reply && <ReplyBlock reply={r.reply} className="mt-6 max-w-[40rem]" />}
              </li>
            ))}
          </ol>
        ) : (
          <div className="flex min-h-[22rem] flex-col items-center justify-center rounded-2xl border border-dashed border-ink/20 px-8 py-12 text-center md:px-14">
            <span className="flex gap-1 text-ink/25" aria-hidden>
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} size={26} strokeWidth={1.4} />
              ))}
            </span>
            <p className="mt-6 max-w-[16ch] text-[30px] font-light leading-[1.1] tracking-[-0.03em] md:text-[40px]">{RT.firstLine}</p>
            <p className="mt-4 max-w-sm text-[15px] leading-[1.6] text-ink/65">{RT.emptyLead}</p>
            <AddReviewButton tripSlug={tripSlug} tripTitle={tripTitle} tone="solid" className="mt-8" />
          </div>
        )}
      </motion.div>
    </Band>
  );
}
