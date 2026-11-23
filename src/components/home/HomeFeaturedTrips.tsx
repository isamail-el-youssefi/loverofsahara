import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { TripCard } from "@/components/TripCard";
import { getAllReviews } from "@/data/reviews";
import type { LocalizedTrip } from "@/data/trips";
import { useTrips } from "@/hooks/use-trips";
import { useLanguage } from "@/i18n/LanguageProvider";
import { fetchAllReviews, summarize, type Review, type ReviewSummary } from "@/lib/reviews";
import { tripsPath } from "@/lib/routes";

/** Cards per page (and per row on desktop). */
const PER_PAGE = 3;

/** Three cards across, in a tall portrait (6:7) shape on desktop. */
const GRID = "grid grid-cols-1 gap-4 md:grid-cols-3 md:[&_article]:aspect-[6/7] md:[&_article]:h-auto";

type Entry = { trip: LocalizedTrip; summary: ReviewSummary | null };

/**
 * Home "Complete" layout: "Popular Sahara Trips".
 * Shows the three most reviewed trips.
 * Reviews start from the build-time data, then refresh from the reviews API.
 */
export function HomeFeaturedTrips() {
  const { trips, status, lang } = useTrips();
  const f = useLanguage().site.featured;
  const [reviews, setReviews] = useState<Review[]>(getAllReviews);

  useEffect(() => {
    const ctrl = new AbortController();
    fetchAllReviews(ctrl.signal)
      .then(setReviews)
      .catch(() => {
        /* API unreachable (local dev, offline): keep the build-time reviews */
      });
    return () => ctrl.abort();
  }, []);

  const entries = useMemo<Entry[]>(() => {
    const bySlug = new Map<string, Review[]>();
    for (const r of reviews) bySlug.set(r.trip, [...(bySlug.get(r.trip) ?? []), r]);
    return trips.map((trip) => ({ trip, summary: bySlug.has(trip.slug) ? summarize(bySlug.get(trip.slug)!) : null }));
  }, [trips, reviews]);

  /** Trips with reviews first (most reviewed, then best rated), the rest after. */
  const ranked = useMemo(() => {
    const reviewed = entries
      .filter((e) => e.summary)
      .sort((a, b) => b.summary!.count - a.summary!.count || b.summary!.average - a.summary!.average);
    return { reviewed, rest: entries.filter((e) => !e.summary) };
  }, [entries]);

  if (status === "error" || (status === "ready" && trips.length === 0)) return null;

  return (
    <section id="featured-trips" className="bg-paper px-4 py-[var(--section-y)] md:flex md:min-h-svh md:flex-col md:px-10">
      <div className="flex w-full flex-col items-end gap-6 pb-10 lg:flex-row">
        <h2
          data-reveal-01="words"
          data-scroll
          className="w-full text-[32px] font-semibold leading-[1.1] tracking-[-0.05em] text-ink md:text-[64px] lg:w-1/2"
        >
          {f.h2a} <span className="font-normal text-neutral-400">{f.h2b}</span>
        </h2>
        <div className="flex w-full flex-col items-start gap-5 sm:flex-row sm:justify-between sm:gap-4 lg:w-1/2 lg:items-end">
          <p className="max-w-sm text-[16px] font-medium tracking-[-0.03em] text-neutral-500">
            {f.lead}
          </p>
          <a
            href={tripsPath(lang)}
            className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-[13px] sm:w-auto font-semibold text-white transition hover:bg-ink-deep"
          >
            {f.viewAll} <ArrowUpRight size={16} aria-hidden />
          </a>
        </div>
      </div>

      {status === "loading" ? (
        <div className={GRID}>
          {Array.from({ length: PER_PAGE }, (_, i) => (
            <div key={i} className="h-[480px] animate-pulse rounded-[10px] bg-neutral-100 md:aspect-[6/7] md:h-auto" />
          ))}
        </div>
      ) : (
        <div className={GRID}>
          {[...ranked.reviewed, ...ranked.rest].slice(0, PER_PAGE).map(({ trip, summary }, i) => (
            <TripCard key={trip.slug} trip={trip} index={i} rating={summary} />
          ))}
        </div>
      )}
    </section>
  );
}
