import { ArrowUpRight } from "lucide-react";
import { TripCard } from "@/components/TripCard";
import { useTrips } from "@/hooks/use-trips";
import { TRIPS_PATH } from "@/lib/routes";

const FEATURED = 3;

/** Home "Complete" layout: the first few trips as cards, with a link to the full list. */
export function HomeFeaturedTrips() {
  const { trips, status } = useTrips();
  if (status === "error" || (status === "ready" && trips.length === 0)) return null;
  const featured = trips.slice(0, FEATURED);

  return (
    <section id="featured-trips" className="bg-paper px-4 py-20 md:px-10 md:py-28">
      <div className="flex w-full flex-col items-end gap-6 pb-10 lg:flex-row">
        <h2
          data-reveal-01="words"
          data-scroll
          className="w-full text-[32px] font-semibold leading-[1.1] tracking-[-0.05em] text-ink md:text-[64px] lg:w-1/2"
        >
          Popular <span className="font-normal text-neutral-400">Sahara Trips.</span>
        </h2>
        <div className="flex w-full justify-between gap-4 lg:w-1/2 lg:items-end">
          <p className="max-w-sm text-[16px] font-medium tracking-[-0.03em] text-neutral-500">
            Private 4x4 journeys, desert camps and caravans, planned around you by a local team.
          </p>
          <a
            href={TRIPS_PATH}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-5 py-3 text-[13px] font-semibold text-white transition hover:bg-ink-deep"
          >
            View all trips <ArrowUpRight size={16} aria-hidden />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {status === "loading"
          ? Array.from({ length: FEATURED }, (_, i) => (
              <div key={i} className="h-[480px] animate-pulse rounded-[10px] bg-neutral-100 md:h-[540px]" />
            ))
          : featured.map((trip, i) => <TripCard key={trip.slug} trip={trip} index={i} />)}
      </div>
    </section>
  );
}
