import type { Review } from "@/lib/reviews";
import data from "./reviews.json";

const ALL = data as Review[];

/** Every published review (build-time data), newest first. */
export const getAllReviews = (): Review[] => ALL;

/**
 * Published reviews of one trip, newest first. Empty for trips nobody has reviewed yet.
 */
export const getReviews = (tripSlug: string): Review[] => ALL.filter((r) => r.trip === tripSlug);
