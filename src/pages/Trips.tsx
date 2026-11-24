import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Star } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { TripCard } from "@/components/TripCard";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { DEPARTURE_CITIES, TRIP_CATEGORIES, cityLabel, countByCategory, type TripCategory } from "@/data/trips";
import { getAllReviews } from "@/data/reviews";
import { useTrips } from "@/hooks/use-trips";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/i18n/LanguageProvider";
import { fadeUp } from "@/lib/animations";
import { fetchAllReviews, type Review } from "@/lib/reviews";
import { usePageSeo } from "@/lib/seo";
import { tripsSeo } from "@/lib/seoData";

type Filter = "all" | TripCategory;

export function Trips() {
  const { trips, status } = useTrips();
  const isMobile = useIsMobile();
  const { ui, lang } = useLanguage();
  usePageSeo(tripsSeo(lang));
  const stop = lang === "zh" ? "。" : ".";
  // The home page category cards and the navbar menu link here as /trips?category=excursion&departure=zagora
  const readCategory = (): Filter => {
    const c = new URLSearchParams(window.location.search).get("category");
    return (TRIP_CATEGORIES as readonly string[]).includes(c ?? "") ? (c as TripCategory) : "all";
  };
  const readDeparture = () => {
    const d = new URLSearchParams(window.location.search).get("departure")?.toLowerCase() ?? "";
    return (DEPARTURE_CITIES as readonly string[]).includes(d) ? d : "all";
  };
  const readReviewed = () => new URLSearchParams(window.location.search).get("reviewed") === "1";
  const [filter, setFilter] = useState<Filter>(readCategory);
  const [departure, setDeparture] = useState<string>(readDeparture);
  const [reviewedOnly, setReviewedOnly] = useState<boolean>(readReviewed);

  // Build-time reviews first, then refreshed from the API (same as the home "Popular" section)
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
  const reviewedSlugs = useMemo(() => new Set(reviews.map((r) => r.trip)), [reviews]);
  const reviewedCount = useMemo(() => trips.filter((t) => reviewedSlugs.has(t.slug)).length, [trips, reviewedSlugs]);

  // Navbar links change only the query string while this page stays mounted: re-read it.
  useEffect(() => {
    const sync = () => {
      setFilter(readCategory());
      setDeparture(readDeparture());
      setReviewedOnly(readReviewed());
    };
    window.addEventListener("los-urlchange", sync);
    window.addEventListener("popstate", sync);
    return () => {
      window.removeEventListener("los-urlchange", sync);
      window.removeEventListener("popstate", sync);
    };
  }, []);

  const counts = useMemo(() => countByCategory(trips), [trips]);
  const visible = useMemo(
    () =>
      trips.filter(
        (t) =>
          (filter === "all" || t.category === filter) &&
          // Phones have no city / reviewed filters, so a ?departure= link must not silently apply one there
          (isMobile || departure === "all" || t.departureCity === departure) &&
          (isMobile || !reviewedOnly || reviewedSlugs.has(t.slug)),
      ),
    [trips, filter, departure, reviewedOnly, reviewedSlugs, isMobile],
  );
  const departurePills = useMemo(
    () => [
      { id: "all", label: ui.all, count: trips.length },
      ...DEPARTURE_CITIES.map((c) => ({
        id: c,
        label: cityLabel(c),
        count: trips.filter((t) => t.departureCity === c).length,
      })).filter((p) => p.count > 0),
    ],
    [trips, ui.all],
  );

  // "Our Trips" -> "Our" + muted "Trips." (languages without spaces, e.g. Chinese, stay one colour)
  const words = ui.heading.split(" ");
  const lead = words.length > 1 ? words.slice(0, -1).join(" ") : "";
  const tail = words.length > 1 ? words[words.length - 1] : ui.heading;

  const pills: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: ui.all, count: trips.length },
    ...TRIP_CATEGORIES.map((c) => ({ key: c as Filter, label: ui.categories[c], count: counts[c] })),
  ];

  return (
    <div className="relative py-44">
      <Navbar theme="light" />
      <section className="px-4 md:px-10">
        <div className="flex w-full flex-col items-end gap-6 pb-10 lg:flex-row">
          <h1 className="w-full text-[40px] font-semibold leading-[1.05] tracking-[-0.05em] text-ink md:text-[64px] lg:w-1/2">
            {lead && <>{lead} </>}
            <span className={lead ? "font-normal text-neutral-400" : ""}>{tail}{stop}</span>
          </h1>
          <div className="flex w-full justify-between gap-4 lg:w-1/2 lg:items-end">
            <p className="max-w-sm text-left text-[16px] font-medium tracking-[-0.03em] text-neutral-500">
              {ui.intro}
            </p>
          </div>
        </div>

        {/* Filters: category, departure city and reviewed, on one line */}
        <div className="flex flex-wrap items-center gap-3 pb-8">
          <AnimatedTabs
            aria-label={ui.navTrips}
            value={filter}
            onChange={(id) => setFilter(id as Filter)}
            disabled={status !== "ready"}
            tabs={pills.map((p) => ({ id: p.key, label: p.label, count: status === "ready" ? p.count : "·" }))}
            className="max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden"
          />
          <AnimatedTabs
            aria-label={ui.navByDeparture}
            value={departure}
            onChange={(id) => setDeparture(id)}
            disabled={status !== "ready"}
            className="max-md:hidden"
            tabs={departurePills.map((p) => ({ id: p.id, label: p.label, count: status === "ready" ? p.count : "·" }))}
          />
          {reviewedCount > 0 && (
            <button
              type="button"
              aria-pressed={reviewedOnly}
              disabled={status !== "ready"}
              onClick={() => setReviewedOnly((v) => !v)}
              className={`inline-flex h-10 items-center gap-2 whitespace-nowrap max-md:hidden rounded-sm border border-ink px-4 text-sm font-medium outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-ink/50 disabled:opacity-50 ${
                reviewedOnly ? "bg-ink text-paper" : "text-ink hover:bg-ink/10"
              }`}
            >
              <Star size={14} className={reviewedOnly ? "fill-paper" : "fill-ink"} aria-hidden />
              {ui.reviewed}
              <span className={`text-xs tabular-nums ${reviewedOnly ? "text-paper/70" : "text-ink/50"}`}>
                {status === "ready" ? reviewedCount : "·"}
              </span>
            </button>
          )}
          <span className="ml-auto hidden text-sm text-neutral-500 sm:inline">
            {status === "ready" && ui.showing(visible.length)}
          </span>
        </div>

        {/* Grid */}
        {status === "loading" && (
          <div className="grid grid-cols-1 gap-[6px] md:grid-cols-2 xl:grid-cols-3" aria-busy="true">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="h-[480px] animate-pulse rounded-[10px] bg-neutral-100 md:h-[540px]" />
            ))}
          </div>
        )}

        {/* App-level AnimatePresence has initial={false}; this one restores the cards' entry state */}
        {status === "ready" && (
          <div className="relative grid grid-cols-1 gap-[6px] md:grid-cols-2 xl:grid-cols-3" data-testid="trip-grid">
            <AnimatePresence initial mode="popLayout">
              {visible.map((trip, i) => (
                <TripCard key={trip.slug} trip={trip} index={i} stagger />
              ))}
            </AnimatePresence>
          </div>
        )}

        {status === "ready" && (
          <motion.p
            {...fadeUp}
            className="mx-auto mt-12 max-w-xl text-center text-[14px] font-medium text-neutral-500"
          >
            {ui.customize}
          </motion.p>
        )}
      </section>
    </div>
  );
}
