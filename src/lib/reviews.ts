/** Reviews: the shape of a published review, the draft the "Add review" form collects, and helpers. */

export interface Review {
  id: string;
  /** Slug of the trip the review is about. */
  trip: string;
  name: string;
  /** 1 to 5. */
  rating: number;
  comment: string;
  /** Language the reviewer wrote in (shown as "Original review"). */
  lang: "en" | "fr" | "de" | "it" | "es";
  /** ISO date (YYYY-MM-DD). */
  date: string;
  photos: string[];
  /** The owner's public answer, if any. */
  reply?: { text: string; date: string };
}

/** What the "Add review" form collects. */
export interface ReviewDraft {
  trip: string;
  name: string;
  /** Optional, never shown publicly. */
  email: string;
  rating: number;
  comment: string;
  photos: File[];
  /** Hidden honeypot field: stays empty for real visitors. */
  website?: string;
}

/** Fired on `window` after a review was saved, so the reviews list can show it straight away. */
export const REVIEW_ADDED_EVENT = "los-review-added";

/**
 * Published reviews of one trip from the reviews API (Cloudflare D1, functions/api/reviews.ts).
 * Throws when the API is unreachable (e.g. plain `vite dev`), so callers can keep the build-time data.
 */
export async function fetchReviews(trip: string, signal?: AbortSignal): Promise<Review[]> {
  const res = await fetch(`/api/reviews?trip=${encodeURIComponent(trip)}`, signal ? { signal } : {});
  if (!res.ok) throw new Error(`Reviews request failed (${res.status})`);
  const data = (await res.json()) as { reviews?: Review[] };
  if (!Array.isArray(data.reviews)) throw new Error("Unexpected reviews response");
  return data.reviews;
}

/** Published reviews of every trip from the reviews API. Throws when the API is unreachable. */
export async function fetchAllReviews(signal?: AbortSignal): Promise<Review[]> {
  const res = await fetch("/api/reviews", signal ? { signal } : {});
  if (!res.ok) throw new Error(`Reviews request failed (${res.status})`);
  const data = (await res.json()) as { reviews?: Review[] };
  if (!Array.isArray(data.reviews)) throw new Error("Unexpected reviews response");
  return data.reviews;
}

/** Sends a new review (and its photos) to the reviews API. Throws with a readable message on failure. */
export async function submitReview(draft: ReviewDraft): Promise<Review | undefined> {
  const body = new FormData();
  body.set("trip", draft.trip);
  body.set("name", draft.name);
  body.set("email", draft.email);
  body.set("rating", String(draft.rating));
  body.set("comment", draft.comment);
  body.set("website", draft.website ?? "");
  for (const f of draft.photos) body.append("photos", f);

  let res: Response;
  try {
    res = await fetch("/api/reviews", { method: "POST", body });
  } catch {
    throw new Error("We couldn't reach the server. Please check your connection and try again.");
  }
  const data = (await res.json().catch(() => ({}))) as { error?: string; review?: Review };
  if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
  if (data.review) window.dispatchEvent(new CustomEvent(REVIEW_ADDED_EVENT, { detail: data.review }));
  return data.review;
}

export const LANGUAGE_NAMES: Record<Review["lang"], string> = {
  en: "English",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
  es: "Español",
};

export interface ReviewSummary {
  count: number;
  /** Average rating, one decimal (0 when there are no reviews). */
  average: number;
  /** Number of reviews per star, index 0 = 1 star ... index 4 = 5 stars. */
  perStar: [number, number, number, number, number];
}

export function summarize(reviews: readonly Review[]): ReviewSummary {
  const perStar: ReviewSummary["perStar"] = [0, 0, 0, 0, 0];
  let sum = 0;
  for (const r of reviews) {
    const i = Math.min(5, Math.max(1, Math.round(r.rating))) - 1;
    perStar[i] = (perStar[i] ?? 0) + 1;
    sum += r.rating;
  }
  return {
    count: reviews.length,
    average: reviews.length ? Math.round((sum / reviews.length) * 10) / 10 : 0,
    perStar,
  };
}

/** "9 Nov 2025" */
export const formatReviewDate = (iso: string, locale = "en-GB") =>
  iso ? new Date(iso + "T12:00:00").toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" }) : "";
