import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { TripCard } from "@/components/TripCard";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { TRIP_CATEGORIES, countByCategory, type TripCategory } from "@/data/trips";
import { useTrips } from "@/hooks/use-trips";
import { useLanguage } from "@/i18n/LanguageProvider";
import { fadeUp } from "@/lib/animations";
import { usePageSeo } from "@/lib/seo";
import { tripsSeo } from "@/lib/seoData";

type Filter = "all" | TripCategory;

export function Trips() {
  usePageSeo(tripsSeo());
  const { trips, status } = useTrips();
  const { ui, lang } = useLanguage();
  const stop = lang === "zh" ? "。" : ".";
  // The home page category cards link here as /trips?category=excursion
  const [filter, setFilter] = useState<Filter>(() => {
    const c = new URLSearchParams(window.location.search).get("category");
    return (TRIP_CATEGORIES as readonly string[]).includes(c ?? "") ? (c as TripCategory) : "all";
  });

  const counts = useMemo(() => countByCategory(trips), [trips]);
  const visible = useMemo(
    () => (filter === "all" ? trips : trips.filter((t) => t.category === filter)),
    [trips, filter],
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

        {/* Category filter */}
        <div className="flex flex-wrap items-center gap-4 pb-8">
          <AnimatedTabs
            aria-label={ui.navTrips}
            value={filter}
            onChange={(id) => setFilter(id as Filter)}
            disabled={status !== "ready"}
            tabs={pills.map((p) => ({ id: p.key, label: p.label, count: status === "ready" ? p.count : "·" }))}
          />
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
