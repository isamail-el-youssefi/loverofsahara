import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { TripCard } from "@/components/TripCard";
import { StopsShowcase } from "@/components/ui/stops-showcase";
import { ThumbnailCarousel, type CarouselItem } from "@/components/ui/thumbnail-carousel";
import { ReviewsSection } from "./reviews/ReviewsSection";
import { ArrowUpRight } from "lucide-react";
import { clip } from "@/lib/seoData";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { placeHref, placeIdForStop } from "@/data/places";
import { tripImage } from "@/data/trips";
import { fadeUp } from "@/lib/animations";
import { useIntroStyle } from "@/hooks/use-intro-style";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollContainerContext } from "@/lib/scrollContainer";
import { RouteMap } from "./RouteMap";
import { SectionTabs, type TabItem } from "./SectionTabs";
import {
  Band,
  Brief,
  Eyebrow,
  Facts,
  Highlights,
  IncludedExcluded,
  PricingTable,
  SectionTitle,
  TripHero,
  pad,
  stopsForDay,
  tidyRoute,
  type TripCtx,
} from "./parts";
import { useTripT } from "@/i18n/useTripT";


/** At most this many photos in the gallery; fewer than the minimum and the band is left out. */
const GALLERY_MAX = 24;
const GALLERY_MIN = 4;

/**
 * Modelled on the Red Dot destination page: centred hero, floating section tabs, a dark "places"
 * band with the route map, a sticky map beside the itinerary, and alternating paper / off-white bands.
 */
export function RedDotLayout({ ctx, dayPanels = false }: { ctx: TripCtx; dayPanels?: boolean }) {
  const T = useTripT();
  const { trip, ui, money } = ctx;
  const reduce = useReducedMotion();
  const scrollRef = useContext(ScrollContainerContext);
  const intro = useIntroStyle();
  const isMobile = useIsMobile();

  // Always two lines: break at the space that best balances the two halves.
  const titleLines = useMemo(() => {
    const words = trip.title.trim().split(/\s+/);
    if (words.length < 2) return [trip.title];
    let best = 1;
    let bestDiff = Infinity;
    for (let i = 1; i < words.length; i++) {
      const diff = Math.abs(words.slice(0, i).join(" ").length - words.slice(i).join(" ").length);
      if (diff < bestDiff) {
        bestDiff = diff;
        best = i;
      }
    }
    return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
  }, [trip.title]);

  const stops = trip.stops;
  const [hover, setHover] = useState<number | null>(null);
  const [dayInView, setDayInView] = useState<number | null>(null);

  // Stops belonging to each day (matched by name against the day's route, then text).
  const dayStops = useMemo(
    () =>
      trip.itinerary.map((d, i) =>
        stopsForDay(stops, d.route, d.text, trip.itinerary.length > 1 ? i / (trip.itinerary.length - 1) : 0),
      ),
    [trip.itinerary, stops],
  );

  // Preview photo per stop. Stops carry no photos of their own, so each takes one from the first day that
  // touches it (stops on the same day get different photos); the cover is the fallback.
  const stopsWithImages = stops.map((s, i) => {
    const d = dayStops.findIndex((list) => list.includes(i));
    const photos = d >= 0 ? ctx.dayImages(d + 1) : [];
    const rank = d >= 0 ? dayStops[d]!.indexOf(i) : 0;
    const path = photos.length ? photos[rank % photos.length] : undefined;
    const placeId = placeIdForStop(s.name);
    return {
      name: s.name,
      image: (path && tripImage(path, 560)) || ctx.coverFallback,
      ...(placeId ? { href: placeHref(placeId) } : {}),
    };
  });

  // The day nearest the middle of the screen drives the map highlight in the itinerary.
  const dayRefs = useRef<(HTMLElement | null)[]>([]);
  useEffect(() => {
    const root = scrollRef?.current ?? null;
    const els = dayRefs.current.filter((e): e is HTMLElement => !!e);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) setDayInView(Number((en.target as HTMLElement).dataset["dayIndex"]));
        }
      },
      { root, rootMargin: "-40% 0px -50% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [scrollRef, trip.slug]);

  const itineraryActive = hover !== null ? [hover] : dayInView !== null ? (dayStops[dayInView] ?? []) : [];
  const routeActive = hover !== null ? [hover] : [];

  // Every photo of the trip's days, in order, each once. They arrive asynchronously (the old site's photo list is
  // loaded lazily), so the gallery band appears only once there are enough of them.
  const galleryItems: CarouselItem[] = [];
  /** Itinerary index of the day each gallery photo belongs to (parallel to `galleryItems`). */
  const galleryDays: number[] = [];
  const seenPhotos = new Set<string>();
  trip.itinerary.forEach((d, dayIdx) => {
    for (const p of ctx.dayImages(d.day)) {
      const url = tripImage(p, isMobile ? 900 : 1800);
      if (!url || seenPhotos.has(p) || galleryItems.length >= GALLERY_MAX) continue;
      seenPhotos.add(p);
      galleryItems.push({ id: p, url, thumb: tripImage(p, 240) ?? url, title: `${trip.title.trim()}, ${T.dayN(d.day).toLowerCase()}` });
      galleryDays.push(dayIdx);
    }
  });
  const hasGallery = galleryItems.length >= GALLERY_MIN;

  // The photo on show drives the info panel on the left: which day it is from and what happens that day.
  const [galleryIndex, setGalleryIndex] = useState(0);
  const shownIndex = Math.min(galleryIndex, Math.max(0, galleryItems.length - 1));
  const shownDay = galleryDays[shownIndex] ?? 0;
  const shownItin = trip.itinerary[shownDay];
  const daysWithPhotos = [...new Set(galleryDays)];
  /** The places visited on the day on show (stops that have a place page), for links. */
  const shownPlaces = (dayStops[shownDay] ?? [])
    .map((si) => stops[si]?.name)
    .filter((n): n is string => !!n)
    .map((name) => ({ name, id: placeIdForStop(name) }))
    .filter((p): p is { name: string; id: string } => !!p.id)
    .filter((p, i, all) => all.findIndex((q) => q.id === p.id) === i);

  // The band appearing pushes everything below it down; the page's scroll effects measured positions at start,
  // so measure again.
  useEffect(() => {
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(raf);
  }, [hasGallery]);

  // The parallax (and its darkening veil) is timed from each section's measured position. Photos and reviews load
  // after that measurement and change the page height, which left the veil half-on over sections still in view
  // (they looked grey). Measure again whenever the page's height changes.
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    let raf = 0;
    let last = el.offsetHeight;
    const ro = new ResizeObserver(() => {
      if (Math.abs(el.offsetHeight - last) < 2) return;
      last = el.offsetHeight;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  const hasIncl = !!(trip.included?.length || trip.excluded?.length);
  const tabs = (["overview", "route", "itinerary", "gallery", "included", "reviews", "pricing"] as const)
    .map((id): TabItem => ({ id, label: T.tabs[id] }))
    .filter((t) => (t.id === "included" ? hasIncl : t.id === "gallery" ? hasGallery : true));

  return (
    <div ref={rootRef} className="trip-page relative">
      {/* Hero: script label + big title, centred over the photo */}
      <section
        data-hero-section
        data-st-01="parallax"
        data-st-y="300"
        data-st-opacity="0.3"
        className="h-[100dvh] bg-paper p-[4px]"
      >
        <div className="relative flex h-full flex-col items-start justify-end overflow-hidden rounded-lg bg-ink-deep p-6 pb-12 text-center md:p-12 md:pb-16">
          <TripHero ctx={ctx} className="absolute inset-0 h-full w-full object-cover object-[50%_72%]" />
          {/* Scrim only where the text sits, like the home hero */}
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/60 via-black/40 to-transparent" />
          <Navbar />
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex flex-col items-start text-left text-white"
          >
            <p className="eyebrow mb-5 text-[13px] font-medium uppercase tracking-[0.18em] text-white/80">
              {ui.categories[trip.category]} <span aria-hidden>·</span> {ui.days(trip.durationDays)}
            </p>
            <h1 className="whitespace-nowrap text-[min(7vw,40px)] font-semibold md:font-light! leading-[1] tracking-[0.0em] md:text-[min(6vw,84px)]">
              {titleLines.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h1>
{/*             <p className="mt-6 max-w-[36rem] text-[15px] leading-[1.55] text-white/85 md:text-[17px]">{trip.summary}</p>
 */}        {/*    { <a
              href="/trips"
              className="eyebrow mt-8 text-[12px] font-medium uppercase tracking-[0.16em] text-white/70 transition-colors hover:text-white"
            >}
              <span aria-hidden>←</span> {T.back}
            </a> */}
          </motion.div>
        </div>
      </section>

      {/* Overview: facts + why we love it, then the highlights. One band, so the parallax treats them as one section. */}
      <Band id="overview" tone="paper" fullHeight>
        {intro === "side" ? (
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <Brief ctx={ctx} className="lg:col-span-8" />
            <Facts ctx={ctx} variant="stack" className="lg:col-span-4" />
          </div>
        ) : (
          <div>
            <Facts ctx={ctx} className="grid grid-cols-2 gap-x-6 gap-y-7 border-b md:gap-x-0 border-ink/10 pb-10 md:grid-cols-4 md:pb-14" />
            <Brief ctx={ctx} className="pt-10 md:pt-14" />
          </div>
        )}

        {trip.keyStops.length > 0 && (
          <motion.div
            {...fadeUp}
            className="mt-16 grid gap-8 border-t border-ink/10 pt-10 md:mt-24 md:grid-cols-12 md:gap-10 md:pt-14"
          >
            <div className="md:col-span-4">
              <Eyebrow className="mb-3">{T.overview}</Eyebrow>
              <h2 className="text-[30px] font-semibold leading-[1.05] tracking-[-0.035em] md:text-[40px]">
                {T.highlights}
              </h2>
            </div>
            <div className="md:col-span-8">
              <Highlights ctx={ctx} />
            </div>
          </motion.div>
        )}
      </Band>

      {/* Route: dark band, stops list left, map right (Red Dot's "Places to visit") */}
      <Band id="route" tone="dark" fullHeight className="py-20 md:py-28">
        <motion.div {...fadeUp} className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <Eyebrow className="mb-3 !text-white/60">{T.routeLabel}</Eyebrow>
            <h2
              className={`${stops.length >= 15 ? "mb-5" : "mb-8"} text-[32px] font-semibold leading-[1.04] tracking-[-0.035em] md:text-[48px]`}
            >
              {stops.length} {T.stops.toLowerCase()}
            </h2>
            <StopsShowcase stops={stopsWithImages} active={routeActive} onActive={setHover} />
          </div>
          {/* The map stretches to the list's height, so it never ends above the bottom of the list */}
          <div className="flex lg:col-span-7">
            <RouteMap
              key="route-dark"
              stops={stops}
              active={routeActive}
              onActive={setHover}
              tone="dark"
              className="min-h-[420px] w-full flex-1 overflow-hidden rounded-2xl md:min-h-[600px]"
            />
          </div>
        </motion.div>
      </Band>

      {/* Itinerary: days on the left, map pinned on the right and following the day in view */}
      <Band id="itinerary" tone="paper">
        <SectionTitle eyebrow={T.itinerary}>{ui.days(trip.durationDays)}</SectionTitle>
        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            {trip.itinerary.map((d, i) =>
              dayPanels ? (
                <article
                  key={d.day}
                  ref={(el) => {
                    dayRefs.current[i] = el;
                  }}
                  data-day-index={i}
                  className="py-1"
                >
                  <div className="relative flex min-h-[200px] items-end overflow-hidden rounded-2xl bg-ink-deep md:min-h-[340px]">
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -right-2 -top-6 select-none text-[220px] font-semibold leading-none tracking-[-0.06em] text-white/[0.07] md:text-[340px]"
                    >
                      {pad(d.day)}
                    </span>
                    <div className="relative p-6 text-white md:p-10">
                      <p className="eyebrow text-[11px] font-medium uppercase tracking-[0.16em] text-white/65">
                        {T.dayN(pad(d.day))}
                      </p>
                      {d.route && (
                        <h3 className="mt-2 max-w-[28ch] text-[24px] font-semibold leading-[1.1] tracking-[-0.03em] md:text-[38px]">
                          {tidyRoute(d.route)}
                        </h3>
                      )}
                    </div>
                  </div>
                  <p className="max-w-[40rem] whitespace-pre-line py-8 text-[15.5px] leading-[1.7] text-ink/80">{d.text}</p>
                </article>
              ) : (
                <article
                  key={d.day}
                  ref={(el) => {
                    dayRefs.current[i] = el;
                  }}
                  data-day-index={i}
                  onMouseEnter={() => setDayInView(i)}
                  className={`border-t border-ink/10 py-9 transition-opacity duration-500 md:py-12 ${
                    dayInView !== null && dayInView !== i ? "opacity-55" : "opacity-100"
                  }`}
                >
                  <Eyebrow>
                    {T.dayN(pad(d.day))}
                  </Eyebrow>
                  {d.route && (
                    <h3 className="mt-2.5 text-[22px] font-semibold leading-[1.15] tracking-[-0.03em] md:text-[27px]">
                      {tidyRoute(d.route)}
                    </h3>
                  )}
                  <p className="mt-4 max-w-[40rem] whitespace-pre-line text-[15.5px] leading-[1.7] text-ink/80">{d.text}</p>
                </article>
              ),
            )}
          </div>
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-6">
              <RouteMap
                key="route-light"
                stops={stops}
                active={itineraryActive}
                onActive={setHover}
                tone="light"
                className="h-[calc(100dvh-3rem)] w-full overflow-hidden rounded-2xl"
              />
            </div>
          </div>
        </div>
      </Band>

      {/* Gallery: photos from every day of the trip. Same width as the other bands. */}
      {/* Gallery and included / not included are one band, so the parallax treats them as one section. */}
      {(hasGallery || hasIncl) && (
        <Band id={hasGallery ? "gallery" : "included"} tone="paper" fullHeight className={`${hasGallery ? "md:!py-16" : ""} ${hasIncl ? "!pb-44 md:!pb-52" : ""}`}>
          {/* Phone: title, then the photo (swipe), then the day chips in one scrolling row and the day's text.
              The text block has a fixed minimum height so the photo does not jump as the day changes. */}
          {hasGallery && isMobile && (
            <motion.div {...fadeUp} className="min-w-0">
              <SectionTitle eyebrow={T.gallery}>{T.galleryTitle}</SectionTitle>
              <ThumbnailCarousel
                compact
                className="mt-6"
                items={galleryItems}
                index={shownIndex}
                onIndexChange={setGalleryIndex}
                slideClassName="h-[max(240px,calc(100dvh-25rem))]"
              />
              <div
                className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                role="group"
                aria-label={T.jumpToDay}
              >
                {daysWithPhotos.map((dayIdx) => {
                  const on = dayIdx === shownDay;
                  return (
                    <button
                      key={dayIdx}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setGalleryIndex(galleryDays.indexOf(dayIdx))}
                      className={`min-h-11 shrink-0 rounded-full border px-5 text-[14px] leading-tight outline-none transition-colors ${
                        on ? "border-ink bg-ink text-paper" : "border-ink/15 text-ink/80"
                      }`}
                    >
                      {T.dayN(pad(trip.itinerary[dayIdx]?.day ?? dayIdx + 1))}
                    </button>
                  );
                })}
              </div>
              {shownItin && (
                <div className="mt-4 min-h-[7.5rem]" aria-live="polite">
                  <p className="line-clamp-3 text-[15px] leading-[1.6] text-ink/75">{clip(shownItin.text, 150)}</p>
                  {shownPlaces.length > 0 && (
                    <ul className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {shownPlaces.map((pl) => (
                        <li key={pl.id} className="shrink-0">
                          <a
                            href={placeHref(pl.id)}
                            className="inline-flex min-h-11 items-center gap-1 rounded-full border border-ink/15 px-4 text-[14px] leading-tight text-ink/80"
                          >
                            {pl.name} <ArrowUpRight size={13} aria-hidden />
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {hasGallery && !isMobile && (
          <motion.div {...fadeUp} className="grid min-w-0 gap-10 lg:grid-cols-[2fr_3fr] lg:items-center lg:gap-14">
            <div className="flex flex-col">
              <SectionTitle eyebrow={T.gallery}>{T.galleryTitle}</SectionTitle>
              <p className="mt-4 max-w-[28rem] text-[14.5px] leading-[1.6] text-ink/65">
                {galleryItems.length} photos from {daysWithPhotos.length} {daysWithPhotos.length === 1 ? "day" : "days"} of this
                journey. Swipe, drag, or use the arrow keys.
              </p>

              {/* Jump to a day's photos */}
              <div className="mt-7 flex flex-wrap gap-2" role="group" aria-label={T.jumpToDay}>
                {daysWithPhotos.map((dayIdx) => {
                  const on = dayIdx === shownDay;
                  return (
                    <button
                      key={dayIdx}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setGalleryIndex(galleryDays.indexOf(dayIdx))}
                      className={`rounded-full border px-3.5 py-1.5 text-[13px] leading-tight outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ink/40 ${
                        on ? "border-ink bg-ink text-paper" : "border-ink/15 text-ink/80 hover:bg-ink/[0.05]"
                      }`}
                    >
                      {T.dayN(pad(trip.itinerary[dayIdx]?.day ?? dayIdx + 1))}
                    </button>
                  );
                })}
              </div>

              {/* Now showing: the day the current photo belongs to */}
              {shownItin && (
                <motion.div
                  key={shownDay}
                  initial={{ opacity: 0, y: reduce ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-9 border-t border-ink/10 pt-7"
                  aria-live="polite"
                >
                
   
                  <p className="mt-3 max-w-[30rem] text-[15px] leading-[1.65] text-ink/75">{clip(shownItin.text, 170)}</p>
                  {shownPlaces.length > 0 && (
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {shownPlaces.map((p) => (
                        <li key={p.id}>
                          <a
                            href={placeHref(p.id)}
                            className="inline-flex items-center gap-1 rounded-full border border-ink/15 px-3.5 py-1.5 text-[13px] leading-tight text-ink/80 outline-none transition-colors hover:bg-ink/[0.05] focus-visible:ring-2 focus-visible:ring-ink/40"
                          >
                            {p.name} <ArrowUpRight size={13} aria-hidden />
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              )}
            </div>

            {/* On desktop the photo is sized from the screen height so the whole row (photo + thumbnails) plus the
                band padding fits in one screen: the section then is exactly one screen and its centre is the
                screen's centre, which is where the left side is centred. */}
            <ThumbnailCarousel
              items={galleryItems}
              index={shownIndex}
              onIndexChange={setGalleryIndex}
              slideClassName="h-[52dvh] lg:h-[max(340px,calc(100dvh-15rem))]"
            />
          </motion.div>
          )}

          {hasIncl && (
            <div
              id={hasGallery ? "included" : undefined}
              className={hasGallery ? "mt-16 scroll-mt-20 border-t border-ink/10 pt-14 md:mt-24 md:pt-20" : ""}
            >
              <SectionTitle eyebrow={T.included}>{T.includedTitle}</SectionTitle>
              <div className="mt-10">
                <IncludedExcluded ctx={ctx} />
              </div>
            </div>
          )}
        </Band>
      )}

      {/* Reviews: the trip's reviews (or an invitation to write the first) and the "Add a review" button.
          Its layout is chosen in the theme switcher ("Trip reviews"). */}
      <ReviewsSection tripSlug={trip.slug} tripTitle={trip.title.trim()} />

      {/* Pricing */}
      <Band id="pricing" tone="paper" className="!min-h-[100dvh] md:!min-h-[110dvh] flex flex-col justify-center">
        <div className="grid gap-8 md:grid-cols-12 md:gap-10">
          <div className="md:sticky md:top-10 md:col-span-4 md:self-start">
            <SectionTitle eyebrow={T.pricing}>
              {ui.from} {money.format(trip.fromPrice)}
            </SectionTitle>
            <p className="mt-4 max-w-xs text-[14px] leading-[1.5] text-neutral-500">{T.pricingNote}</p>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <PricingTable ctx={ctx} />
          </div>
        </div>
      </Band>

      {ctx.more.length > 0 && (
        <Band tone="paper" parallax={false} className="!pt-24 pb-24 md:!pt-40 md:pb-32">
          <h2
            className="mb-7 text-[26px] font-semibold tracking-[-0.03em] md:text-[32px]"
          >
            {T.more}
          </h2>
          <div className="grid grid-cols-1 gap-[6px] md:grid-cols-2 xl:grid-cols-3">
            {ctx.more.map((t, i) => (
              <TripCard key={t.slug} trip={t} index={i} />
            ))}
          </div>
        </Band>
      )}

      <SectionTabs items={tabs} />
    </div>
  );
}
