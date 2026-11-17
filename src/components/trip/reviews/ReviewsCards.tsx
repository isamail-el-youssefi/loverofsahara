import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { formatReviewDate, summarize } from "@/lib/reviews";
import { Band, SectionTitle } from "../parts";
import { AddReviewButton } from "./AddReview";
import type { ReviewsProps } from "./ReviewsEditorial";
import { DemoTag, PhotoStrip, RT, ReplyBlock, ReviewText, Stars } from "./shared";

/**
 * Variation 3, "Cards": a soft off-white band with each review in its own rounded card, laid out like a masonry
 * wall (cards keep their natural height). The title, the average and the add button share one header row. With no
 * reviews a single dashed card invites the first one.
 */
export function ReviewsCards({ tripSlug, tripTitle, reviews }: ReviewsProps) {
  const has = reviews.length > 0;
  const summary = summarize(reviews);

  return (
    <Band id="reviews" tone="off" parallax={false}>
      <motion.div {...fadeUp}>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionTitle eyebrow={RT.eyebrow}>{RT.title}</SectionTitle>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            {has && (
              <div className="flex items-center gap-3 rounded-full border border-ink/15 bg-paper px-4 py-2.5 text-[14px] text-ink/70">
                <span className="text-[20px] font-semibold leading-none tracking-[-0.02em] text-ink tabular-nums">{summary.average.toFixed(1)}</span>
                <Stars value={summary.average} size={14} />
                <span>{RT.basedOn(summary.count)}</span>
              </div>
            )}
            {has && <AddReviewButton tripSlug={tripSlug} tripTitle={tripTitle} tone="solid" />}
          </div>
        </div>

        {has ? (
          // Columns follow the number of reviews, so a couple of cards fill the row instead of leaving a gap.
          <ul
            className={`mt-10 columns-1 gap-4 ${
              reviews.length >= 3 ? "md:columns-2 xl:columns-3" : reviews.length === 2 ? "md:columns-2" : "max-w-[40rem]"
            }`}
          >
            {reviews.map((r) => (
              <li key={r.id} className="mb-4 break-inside-avoid rounded-2xl border border-ink/10 bg-paper p-6 md:p-7">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink/[0.07] text-[16px] font-semibold uppercase text-ink"
                  >
                    {r.name.trim().charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <h3 className="flex items-center gap-2 text-[16px] font-semibold tracking-[-0.01em]">
                      <span className="truncate">{r.name}</span>
                      {r.demo && <DemoTag />}
                    </h3>
                    <p className="text-[12.5px] text-ink/50">
                      {formatReviewDate(r.date)}
                      {r.lang !== "en" ? ` · ${RT.original(r.lang)}` : ""}
                    </p>
                  </div>
                </div>
                <Stars value={r.rating} size={15} className="mt-4" />
                <ReviewText text={r.comment} lines={7} className="mt-3 text-[15px] leading-[1.7] text-ink/80" />
                <PhotoStrip photos={r.photos} name={r.name} className="mt-4" />
                {r.reply && (
                  <div className="mt-5 rounded-xl bg-ink/[0.04] p-4">
                    <ReplyBlock reply={r.reply} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-10 flex flex-col items-center rounded-2xl border border-dashed border-ink/25 bg-paper/60 px-8 py-16 text-center">
            <Stars value={0} size={26} className="text-ink" />
            <p className="mt-6 max-w-[18ch] text-[28px] font-light leading-[1.12] tracking-[-0.03em] md:text-[38px]">{RT.firstLine}</p>
            <p className="mt-4 max-w-md text-[15px] leading-[1.6] text-ink/65">{RT.emptyLead}</p>
            <AddReviewButton tripSlug={tripSlug} tripTitle={tripTitle} tone="solid" className="mt-8" />
          </div>
        )}
      </motion.div>
    </Band>
  );
}
