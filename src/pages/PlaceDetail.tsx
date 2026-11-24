import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { TripCard } from "@/components/TripCard";
import { RouteMap } from "@/components/trip/RouteMap";
import { SectionTabs, type TabItem } from "@/components/trip/SectionTabs";
import { Band, BriefText, Eyebrow, FactList, Photo, pad, stopsForDay, twoLines } from "@/components/trip/parts";
import { getCover, loadLegacyMedia, tripImage } from "@/data/trips";
import type { LegacyMedia } from "@/data/trips/schema";
import { getPlace, placeIdForStop } from "@/data/places";
import { placeHero } from "@/data/places/heroes";
import { useIntroStyle } from "@/hooks/use-intro-style";
import { useTrips } from "@/hooks/use-trips";
import { fadeUp } from "@/lib/animations";
import { TRIPS_PATH } from "@/lib/routes";
import { usePageSeo } from "@/lib/seo";
import { absUrl, placeSeo } from "@/lib/seoData";

/** Labels that only exist on place pages (English for now, like the trip page's own labels). */
const PT = {
  back: "Back",
  the: "The place",
  insights: "Insights",
  insightTitles: ["Why stop here", "What to see", "The story", "Best moment", "Good to know"],
  type: "Type",
  region: "Region",
  fromMarrakech: "From Marrakech",
  startFinish: "Start & finish",
  bestTime: "Best time",
  onTrips: "On our trips",
  coordinates: "Coordinates",
  where: "Where it sits",
  gettingThere: "Getting there",
  gallery: "Gallery",
  galleryTitle: "From the road",
  journeys: "On these journeys",
} as const;

/** 5 + 3 + 5: the sticky gallery's two scrolling columns and its pinned middle column. */
const GALLERY_MAX = 13;
/** Fewer photos than this and a gallery would look thin, so the band stays empty. */
const GALLERY_MIN = 4;

/** A framed, lazy photo that hides itself if the file is missing. */
function GalleryPhoto({ path, className }: { path: string; className: string }) {
  return (
    <figure className="w-full overflow-hidden rounded-md">
      <Photo path={path} w={900} className={`block w-full align-bottom ${className}`} />
    </figure>
  );
}

/** 31.047 -> 31°02′49″ (degrees, minutes, seconds). */
function dms(value: number) {
  const abs = Math.abs(value);
  const d = Math.floor(abs);
  const mFloat = (abs - d) * 60;
  const m = Math.floor(mFloat);
  const s = Math.round((mFloat - m) * 60);
  // Rounding seconds can reach 60: carry it over.
  const [mm, ss] = s === 60 ? [m + 1, 0] : [m, s];
  const [dd, mmm] = mm === 60 ? [d + 1, 0] : [d, mm];
  return `${dd}°${String(mmm).padStart(2, "0")}′${String(ss).padStart(2, "0")}″`;
}

/** Where it sits: latitude and longitude in degrees-minutes-seconds with the decimals beneath, plus copy and open-in-maps actions. */
function Coordinates({ lat, lng, name }: { lat: number; lng: number; name: string }) {
  const [copied, setCopied] = useState(false);
  const decimal = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  const cells = [
    { label: "Latitude", dms: `${dms(lat)} ${lat >= 0 ? "N" : "S"}`, dec: `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}` },
    { label: "Longitude", dms: `${dms(lng)} ${lng >= 0 ? "E" : "W"}`, dec: `${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? "E" : "W"}` },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(decimal);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable (insecure context or denied): nothing to confirm */
    }
  };

  return (
    <div className="mt-8 max-w-[30rem] rounded-2xl border border-ink/10 bg-ink/[0.03] p-5">
      <Eyebrow className="mb-4">{PT.coordinates}</Eyebrow>
      <dl className="grid grid-cols-2 gap-5">
        {cells.map((c) => (
          <div key={c.label}>
            <dt className="text-[12px] text-neutral-500">{c.label}</dt>
            <dd className="mt-1 text-[19px] font-semibold tabular-nums tracking-[-0.02em] text-ink">{c.dms}</dd>
            <dd className="mt-0.5 text-[12.5px] tabular-nums text-neutral-500">{c.dec}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-5 flex flex-wrap gap-2 border-t border-ink/10 pt-4">
        <button
          type="button"
          onClick={copy}
          className="inline-flex h-9 items-center gap-2 rounded-[10px] border border-ink/15 px-3.5 text-[13px] font-medium text-ink outline-none transition-colors hover:bg-ink/[0.05] focus-visible:ring-2 focus-visible:ring-ink/40 active:scale-[0.98]"
        >
          {copied ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
          <span aria-live="polite">{copied ? "Copied" : "Copy coordinates"}</span>
        </button>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${name} in Google Maps (opens in a new tab)`}
          className="inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-ink/15 px-3.5 text-[13px] font-medium text-ink outline-none transition-colors hover:bg-ink/[0.05] focus-visible:ring-2 focus-visible:ring-ink/40 active:scale-[0.98]"
        >
          Open in Maps <ArrowUpRight size={14} aria-hidden />
        </a>
      </div>
    </div>
  );
}

const goBack = () => {
  if (window.history.length > 1) {
    window.history.back();
    return;
  }
  // Opened directly (nothing to go back to): go to the trips page. App listens to popstate.
  window.history.pushState(null, "", TRIPS_PATH);
  window.dispatchEvent(new PopStateEvent("popstate"));
};

/**
 * One place a trip stops at. Same language as the Red Dot trip page: framed full-height hero, light display
 * type, bands with the homepage's section parallax, floating section tabs and trip cards.
 * Text is editorial (src/data/places); distance, map and trips are derived from the trips themselves.
 */
export function PlaceDetail({ id }: { id: string }) {
  const facts = getPlace(id);
  const { trips, status } = useTrips();
  const reduce = useReducedMotion();
  const intro = useIntroStyle();
  const [media, setMedia] = useState<Record<string, LegacyMedia> | undefined>();

  useEffect(() => {
    let alive = true;
    loadLegacyMedia()
      .then((m) => alive && setMedia(m))
      .catch(() => alive && setMedia(undefined));
    return () => {
      alive = false;
    };
  }, []);

  const visiting = useMemo(
    () => (facts ? trips.filter((t) => facts.tripSlugs.includes(t.slug)) : []),
    [facts, trips],
  );

  // Photos of the days on which this place is visited (itinerary photos are per day, not per place).
  const photos = useMemo(() => {
    const out: string[] = [];
    if (!media) return out;
    for (const t of visiting) {
      const stopIdx = t.stops.findIndex((s) => placeIdForStop(s.name) === id);
      if (stopIdx < 0) continue;
      t.itinerary.forEach((d, i) => {
        const pos = t.itinerary.length > 1 ? i / (t.itinerary.length - 1) : 0;
        if (!stopsForDay(t.stops, d.route, d.text, pos).includes(stopIdx)) return;
        const first = media[t.slug]?.days[`day${d.day}`]?.[0];
        if (first) out.push(first);
      });
    }
    return out;
  }, [media, visiting, id]);

  // Title, description, canonical, share image and structured data for this place
  usePageSeo(
    facts
      ? placeSeo(
          facts,
          placeHero(id) ? absUrl(placeHero(id)!) : photos[0] ? tripImage(photos[0], 1200) : undefined,
        )
      : undefined,
  );

  // Every photo of the days that visit this place.
  const gallery = useMemo(() => {
    if (!media) return [] as string[];
    const lists: string[][] = [];
    for (const t of visiting) {
      const stopIdx = t.stops.findIndex((s) => placeIdForStop(s.name) === id);
      if (stopIdx < 0) continue;
      t.itinerary.forEach((d, i) => {
        const pos = t.itinerary.length > 1 ? i / (t.itinerary.length - 1) : 0;
        if (!stopsForDay(t.stops, d.route, d.text, pos).includes(stopIdx)) return;
        const day = media[t.slug]?.days[`day${d.day}`];
        if (day?.length) lists.push([...day]);
      });
    }
    // One trip's days after another. The old site stores the same shot under several trips, so mixing trips
    // would put visible duplicates side by side; within one trip the photos are distinct.
    const out: string[] = [];
    for (const l of lists) {
      for (const p of l) {
        if (out.length < GALLERY_MAX && !out.includes(p)) out.push(p);
      }
    }
    return out;
  }, [media, visiting, id]);

  if (!facts) {
    return (
      <div className="relative flex min-h-dvh items-center justify-center px-6">
        <Navbar theme="light" />
        <p className="text-neutral-500">{status === "loading" ? "Loading" : "We could not find that place."}</p>
      </div>
    );
  }

  const { place } = facts;
  // Known synchronously from the trip data, so the trips band exists from the first render. The scroll
  // effects bind each band to the one below it when the page mounts, so it must not pop in later.
  const hasTrips = facts.tripSlugs.length > 0;
  const hasGallery = gallery.length >= GALLERY_MIN;
  // Sticky layout (7+ photos): a pinned middle column of 3 between two scrolling columns. Fewer photos
  // (4 to 6) use a plain grid instead, where a pinned column would have nothing to scroll past.
  const midCount = gallery.length >= 7 ? 3 : 0;
  const rest = gallery.slice(midCount);
  const leftCount = Math.ceil(rest.length / 2);
  const colMid = gallery.slice(0, midCount);
  const colLeft = rest.slice(0, leftCount);
  const colRight = rest.slice(leftCount);
  // The place's own landscape photo when it has one; otherwise a photo from a trip day, then a cover.
  const heroPath = photos[0];
  const heroSrc = placeHero(id) ?? (heroPath && tripImage(heroPath, 2000)) ?? getCover(visiting[0]?.cover ?? "dunes");
  const lines = twoLines(place.name);

  const factRows: [string, string][] = [
    [PT.type, place.kind],
    [PT.region, place.region],
    [PT.fromMarrakech, facts.kmFromMarrakech === 0 ? PT.startFinish : `~${facts.kmFromMarrakech} km`],
    [PT.bestTime, place.bestTime],
    [PT.onTrips, String(facts.tripSlugs.length)],
  ];

  const tabs: TabItem[] = [
    { id: "overview", label: "Overview" },
    { id: "insights", label: "Insights" },
    { id: "map", label: "Map" },
    ...(hasGallery ? [{ id: "gallery", label: "Gallery" }] : []),
    ...(hasTrips ? [{ id: "trips", label: "Trips" }] : []),
  ];

  return (
    <div className="trip-page relative">
      {/* Hero: same frame as the trip page */}
      <section
        data-hero-section
        data-st-01="parallax"
        data-st-y="300"
        data-st-opacity="0.3"
        className="h-dvh bg-paper p-[4px]"
      >
        <div className="relative flex h-full flex-col items-start justify-end overflow-hidden rounded-lg bg-ink-deep p-6 pb-12 text-left md:p-12 md:pb-16">
          <img
            src={heroSrc}
            alt={`${place.name}, ${place.region}, Morocco`}
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover object-[50%_60%]"
          />
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
              {place.kind} <span aria-hidden>·</span> {place.region}
            </p>
            <h1 className="whitespace-nowrap text-[min(7vw,40px)] font-semibold leading-[1] md:text-[min(6vw,84px)] md:font-light!">
              {lines.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Overview: facts + the brief. Follows the "Trip intro" choice of the theme switcher. */}
      <Band id="overview" tone="paper" parallax={false} fullHeight>
        <button
          type="button"
          onClick={goBack}
          className="eyebrow mb-8 self-start text-[12px] font-medium uppercase tracking-[0.16em] text-neutral-500 transition-colors hover:text-ink"
        >
          <span aria-hidden>←</span> {PT.back}
        </button>
        {intro === "side" ? (
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <BriefText label={PT.the} text={place.brief} className="lg:col-span-8" />
            <FactList rows={factRows} variant="stack" className="lg:col-span-4" />
          </div>
        ) : (
          <>
            <FactList
              rows={factRows}
              className="grid grid-cols-2 gap-x-6 gap-y-7 border-b border-ink/10 pb-10 md:grid-cols-5 md:pb-14"
            />
            <BriefText label={PT.the} text={place.brief} className="pt-10 md:pt-14" />
          </>
        )}
      </Band>

      {/* Insights: dark band with the three notes as a numbered, ruled list */}
      <Band id="insights" tone="dark" fullHeight className="py-16 md:py-20">
        <motion.div {...fadeUp} className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <Eyebrow className="mb-3 !text-white/60">{PT.the}</Eyebrow>
            <h2 className="text-[32px] font-semibold leading-[1.04] tracking-[-0.035em] md:text-[48px]">{PT.insights}</h2>
          </div>
          <ol className="border-b border-white/10 lg:col-span-7">
            {place.insights.map((text, i) => (
              <li key={i} className="grid grid-cols-[2rem_1fr] gap-x-4 border-t border-white/10 py-5 md:py-6">
                <span className="pt-1.5 text-[12px] tabular-nums text-white/50">{pad(i + 1)}</span>
                <div>
                  <h3 className="text-[19px] font-semibold tracking-[-0.02em] md:text-[22px]">{PT.insightTitles[i]}</h3>
                  <p className="mt-1.5 max-w-[38rem] text-[15px] leading-[1.6] text-white/70">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </motion.div>
      </Band>

      {/* Map: where it sits */}
      <Band id="map" tone="paper" fullHeight>
        <motion.div {...fadeUp} className="grid items-stretch gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="flex flex-col justify-center lg:col-span-5">
            <Eyebrow className="mb-3">{PT.where}</Eyebrow>
            <h2 className="text-[30px] font-semibold leading-[1.05] tracking-[-0.035em] md:text-[40px]">
              {PT.gettingThere}
            </h2>
            <p className="mt-5 max-w-[30rem] text-[15.5px] leading-[1.65] text-ink/75">
              {facts.kmFromMarrakech === 0
                ? "Marrakech is where our journeys begin and end, before the road climbs into the High Atlas and drops towards the desert."
                : `About ${facts.kmFromMarrakech} km from Marrakech as the crow flies. The road is longer: it winds over the High Atlas and along the valleys, which is a large part of the journey.`}
            </p>
            <Coordinates lat={facts.lat} lng={facts.lng} name={place.name} />
          </div>
          <div className="flex lg:col-span-7">
            <RouteMap
              key={id}
              stops={[{ name: place.name, lat: facts.lat, lng: facts.lng }]}
              active={[]}
              onActive={() => {}}
              tone="light"
              named
              className="min-h-[360px] w-full flex-1 overflow-hidden rounded-2xl md:min-h-[60dvh]"
            />
          </div>
        </motion.div>
      </Band>

      {/* Gallery: always in the page (so the band above binds to it), empty until there are enough photos.
          The middle column stays pinned while the outer two scroll past it. No parallax: it holds a sticky child. */}
      <Band id="gallery" tone="paper" parallax={false} className={hasGallery ? "" : "!p-0"}>
        {hasGallery && (
          <>
            <motion.div {...fadeUp} className="mb-8">
              <Eyebrow className="mb-3">{PT.gallery}</Eyebrow>
              <h2 className="text-[30px] font-semibold leading-[1.05] tracking-[-0.035em] md:text-[40px]">
                {PT.galleryTitle}
              </h2>
            </motion.div>

            {midCount === 0 ? (
              <div className="grid grid-cols-2 gap-[6px] md:grid-cols-3">
                {gallery.map((p) => (
                  <GalleryPhoto key={p} path={p} className="h-56 object-cover md:h-96" />
                ))}
              </div>
            ) : (
              <>
                {/* Phones: a simple two-column grid */}
                <div className="grid grid-cols-2 gap-[6px] md:hidden">
                  {gallery.map((p) => (
                    <GalleryPhoto key={p} path={p} className="h-56 object-cover" />
                  ))}
                </div>
                {/* md and up: sticky middle column */}
                <div className="hidden grid-cols-12 gap-[6px] md:grid">
                  <div className="col-span-4 grid gap-[6px]">
                    {colLeft.map((p) => (
                      <GalleryPhoto key={p} path={p} className="h-96 object-cover" />
                    ))}
                  </div>
                  <div className="sticky top-0 col-span-4 grid h-dvh grid-rows-3 gap-[6px] self-start">
                    {colMid.map((p) => (
                      <figure key={p} className="h-full w-full overflow-hidden rounded-md">
                        <Photo path={p} w={900} className="block h-full w-full object-cover align-bottom" />
                      </figure>
                    ))}
                  </div>
                  <div className="col-span-4 grid gap-[6px]">
                    {colRight.map((p) => (
                      <GalleryPhoto key={p} path={p} className="h-96 object-cover" />
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </Band>

      {/* The trips that stop here, then the footer */}
      {hasTrips && (
        <Band id="trips" tone="paper" parallax={false} className="!pt-0 pb-24 md:pb-32">
          <h2 className="mb-7 text-[26px] font-semibold tracking-[-0.03em] md:text-[32px]">{PT.journeys}</h2>
          <div className="grid grid-cols-1 gap-[6px] md:grid-cols-2 xl:grid-cols-3">
            {visiting.slice(0, 6).map((t, i) => (
              <TripCard key={t.slug} trip={t} index={i} />
            ))}
          </div>
        </Band>
      )}

      <SectionTabs items={tabs} />
    </div>
  );
}
