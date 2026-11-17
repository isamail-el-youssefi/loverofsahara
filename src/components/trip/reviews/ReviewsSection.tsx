import { useEffect, useMemo, useState } from "react";
import { getReviews } from "@/data/reviews";
import { demoReviews } from "@/data/reviews/demo";
import { useDemoReviews } from "@/hooks/use-demo-reviews";
import { useReviewStyle } from "@/hooks/use-review-style";
import { fetchReviews, REVIEW_ADDED_EVENT, type Review } from "@/lib/reviews";
import { ReviewsCards } from "./ReviewsCards";
import { ReviewsEditorial } from "./ReviewsEditorial";
import { ReviewsSpotlight } from "./ReviewsSpotlight";

/**
 * The trip's reviews and the "Add a review" button, in the layout chosen in the theme switcher
 * ("Trip reviews": Editorial, Spotlight or Cards). Trips with no reviews yet show an invitation instead.
 *
 * Reviews start from the build-time data (so the prerendered page already has them), then the live list is
 * loaded from the reviews API (Cloudflare D1). A review just sent by the visitor is added straight away.
 */
export function ReviewsSection({ tripSlug, tripTitle }: { tripSlug: string; tripTitle: string }) {
  const style = useReviewStyle();
  const demo = useDemoReviews();
  const [live, setLive] = useState<Review[]>(() => getReviews(tripSlug));

  useEffect(() => {
    setLive(getReviews(tripSlug));
    const ctrl = new AbortController();
    fetchReviews(tripSlug, ctrl.signal)
      .then(setLive)
      .catch(() => {
        /* API unreachable (local dev, offline): keep the build-time reviews */
      });
    const onAdded = (e: Event) => {
      const r = (e as CustomEvent<Review>).detail;
      if (r?.trip === tripSlug) setLive((list) => (list.some((x) => x.id === r.id) ? list : [r, ...list]));
    };
    window.addEventListener(REVIEW_ADDED_EVENT, onAdded);
    return () => {
      ctrl.abort();
      window.removeEventListener(REVIEW_ADDED_EVENT, onAdded);
    };
  }, [tripSlug]);

  const reviews = useMemo(() => {
    if (!demo || !import.meta.env.DEV) return live;
    return [...live, ...demoReviews(tripSlug)].sort((a, b) => b.date.localeCompare(a.date));
  }, [live, demo, tripSlug]);

  const props = { tripSlug, tripTitle, reviews };
  if (style === "spotlight") return <ReviewsSpotlight {...props} />;
  if (style === "cards") return <ReviewsCards {...props} />;
  return <ReviewsEditorial {...props} />;
}
