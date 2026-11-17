import type { Review } from "@/lib/reviews";
import { demoReviews } from "./demo";
import data from "./reviews.json";

const ALL = data as Review[];

/**
 * Published reviews of one trip, newest first. Empty for trips nobody has reviewed yet.
 * `includeDemo` adds the invented preview reviews (development only; see ./demo.ts).
 */
export const getReviews = (tripSlug: string, includeDemo = false): Review[] => {
  const real = ALL.filter((r) => r.trip === tripSlug);
  if (!includeDemo || !import.meta.env.DEV) return real;
  return [...real, ...demoReviews(tripSlug)].sort((a, b) => b.date.localeCompare(a.date));
};
