import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { TripCard } from "@/components/TripCard";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { getAllReviews } from "@/data/reviews";
import type { LocalizedTrip } from "@/data/trips";
import { useHomeTripsStyle } from "@/hooks/use-home-trips-style";
import { useTrips } from "@/hooks/use-trips";
import { useLanguage } from "@/i18n/LanguageProvider";
import { fetchAllReviews, summarize, type Review, type ReviewSummary } from "@/lib/reviews";
import { tripsPath } from "@/lib/routes";

/** Cards per page (and per row on desktop). */
const PER_PAGE = 3;
const POPULAR = "popular";

/** Three cards across, in a tall portrait (6:7) shape on desktop. */
const GRID = "grid grid-cols-1 gap-4 md:grid-cols-3 md:[&_article]:aspect-[6/7] md:[&_article]:h-auto";

type Entry = { trip: LocalizedTrip; summary: ReviewSummary | null };

/**
 * Home "Complete" layout: "Popular Sahara Trips".
 * - Classic: the three most reviewed trips.
 * - Tabs (theme switcher > Home trips): "Popular" (the trips travellers reviewed) first, then one tab per
 *   departure city. Three cards at a time, with dots underneath when a tab has more than three.
 * Reviews start from the build-time data, then refresh from the reviews API.
 */
export function HomeFeaturedTrips() {
  const { trips, status, lang } = useTrips();
  const f = useLanguage().site.featured;
  const style = useHomeTripsStyle();
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
        <div className="flex w-full justify-between gap-4 lg:w-1/2 lg:items-end">
          <p className="max-w-sm text-[16px] font-medium tracking-[-0.03em] text-neutral-500">
            {f.lead}
          </p>
          <a
            href={tripsPath(lang)}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-5 py-3 text-[13px] font-semibold text-white transition hover:bg-ink-deep"
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
      ) : style === "tabs" ? (
        <TabbedTrips entries={entries} reviewed={ranked.reviewed} />
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

/** Round frosted arrow centred on the left or right edge of the cards (desktop; touch screens just swipe). */
function ArrowButton({ dir, disabled, onClick }: { dir: "prev" | "next"; disabled: boolean; onClick: () => void }) {
  const f = useLanguage().site.featured;
  const Icon = dir === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      aria-label={dir === "prev" ? f.prev : f.next}
      disabled={disabled}
      onClick={onClick}
      className={`absolute top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-paper/90 text-ink shadow-[0_8px_24px_-8px_rgba(0,0,0,0.35)] backdrop-blur-md outline-none transition hover:bg-paper focus-visible:ring-2 focus-visible:ring-ink/50 disabled:pointer-events-none disabled:opacity-0 md:flex ${
        dir === "prev" ? "left-3" : "right-3"
      }`}
    >
      <Icon size={22} aria-hidden />
    </button>
  );
}

/** Gap between cards (Tailwind gap-4), needed to compute one page's scroll distance. */
const GAP = 16;

/**
 * Tabs: Popular (reviewed trips) + one tab per departure city. Three cards are in view at a time; a tab with
 * more trips scrolls sideways: arrows and dots on desktop, swipe on touch. The dots row is always
 * reserved, so every tab has the same card height.
 */
function TabbedTrips({ entries, reviewed }: { entries: Entry[]; reviewed: Entry[] }) {
  const f = useLanguage().site.featured;
  const reduce = useReducedMotion();
  const scroller = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState(POPULAR);
  const [page, setPage] = useState(0);

  const tabs = useMemo(() => {
    const byCity = new Map<string, { label: string; items: Entry[] }>();
    for (const e of entries) {
      const key = e.trip.departureCity;
      const group = byCity.get(key) ?? { label: e.trip.departureLabel, items: [] };
      group.items.push(e);
      byCity.set(key, group);
    }
    const cities = [...byCity.entries()]
      .sort((a, b) => b[1].items.length - a[1].items.length || a[1].label.localeCompare(b[1].label))
      .map(([id, g]) => ({ id, label: g.label, items: g.items }));
    return [...(reviewed.length ? [{ id: POPULAR, label: f.popular, items: reviewed }] : []), ...cities];
  }, [entries, reviewed, f.popular]);

  const current = tabs.find((t) => t.id === tab) ?? tabs[0]!;
  const items = current.items;
  const pages = Math.ceil(items.length / PER_PAGE);

  const step = () => (scroller.current ? scroller.current.clientWidth + GAP : 0);
  const goTo = (i: number) => {
    const el = scroller.current;
    if (!el) return;
    const target = Math.max(0, Math.min(pages - 1, i));
    el.scrollTo({ left: target * step(), behavior: reduce ? "auto" : "smooth" });
  };

  const onScroll = () => {
    const el = scroller.current;
    if (!el || !step()) return;
    setPage(Math.max(0, Math.min(pages - 1, Math.round(el.scrollLeft / step()))));
  };

  const fade = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -6 },
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <>
      <AnimatedTabs
        aria-label={f.byDeparture}
        className="mb-6"
        value={current.id}
        onChange={(id) => {
          setTab(id);
          setPage(0);
        }}
        tabs={tabs.map((t) => ({ id: t.id, label: t.label, count: t.items.length }))}
      />

      <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={current.id}
          {...fade}
          ref={scroller}
          onScroll={onScroll}
          className="grid auto-cols-[85%] snap-x snap-mandatory grid-flow-col gap-4 overflow-x-auto overscroll-x-contain [scrollbar-width:none] md:auto-cols-[calc((100%-2rem)/3)] md:[&_article]:aspect-[6/7] md:[&_article]:h-auto [&::-webkit-scrollbar]:hidden"
        >
          {items.map(({ trip, summary }, i) => (
            <div
              key={trip.slug}
              className={i % PER_PAGE === 0 ? "snap-start" : "max-md:snap-start"}
            >
              <TripCard trip={trip} index={i % PER_PAGE} rating={summary} />
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {pages > 1 && (
        <>
          <ArrowButton dir="prev" disabled={page === 0} onClick={() => goTo(page - 1)} />
          <ArrowButton dir="next" disabled={page >= pages - 1} onClick={() => goTo(page + 1)} />
        </>
      )}
      </div>

      {/* Always present on desktop (even with one page) so every tab keeps the same card height. */}
      <div role="group" aria-label={f.more} className="mt-6 hidden h-2 items-center justify-center gap-2 md:flex">
        {pages > 1 &&
          Array.from({ length: pages }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={f.page.replace("{i}", String(i + 1)).replace("{n}", String(pages))}
              aria-current={i === page}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-ink/50 focus-visible:ring-offset-2 ${
                i === page ? "w-6 bg-ink" : "w-2 bg-ink/25 hover:bg-ink/50"
              }`}
            />
          ))}
      </div>
    </>
  );
}
