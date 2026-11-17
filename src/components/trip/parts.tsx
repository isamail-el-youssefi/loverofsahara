import { useState } from "react";
import { tripImage, type LocalizedTrip } from "@/data/trips";
import type { UiStrings } from "@/i18n/ui";

/** Everything a layout needs. All layouts read the same data, only the arrangement differs. */
export interface TripCtx {
  trip: LocalizedTrip;
  ui: UiStrings;
  /** Old image path lists per day number (1-based). */
  dayImages: (day: number) => string[];
  /** First itinerary photo (portrait), resized, or undefined while/if photos are unavailable. Used on phones. */
  heroSrc: string | undefined;
  /** Sharp landscape hero for desktop (md and up); undefined when the trip has none. */
  heroDesktop: string | undefined;
  coverFallback: string;
  money: Intl.NumberFormat;
  more: LocalizedTrip[];
}

/**
 * The trip hero photo: the sharp landscape one from md up, the portrait itinerary photo on phones.
 * `contents` keeps the <img> laid out exactly as before (absolute-fill or h-full inside its frame).
 */
export function TripHero({ ctx, className }: { ctx: TripCtx; className: string }) {
  return (
    <picture className="contents">
      {ctx.heroDesktop && <source media="(min-width: 768px)" srcSet={ctx.heroDesktop} />}
      <img src={ctx.heroSrc ?? ctx.coverFallback} alt="" fetchPriority="high" className={className} />
    </picture>
  );
}

/** Labels that only exist on the trip page (English for now). */
export const T = {
  back: "All trips",
  highlights: "Highlights",
  itinerary: "Day by day",
  gallery: "Gallery",
  galleryTitle: "Photos from this journey",
  nowShowing: "Now showing",
  day: "Day",
  included: "Included",
  excluded: "Not included",
  pricing: "Pricing",
  pricingNote: "Per person for the whole trip. Private groups, always tailored.",
  group: "Group",
  perDay: "Per day",
  total: "Total",
  plan: "Plan this trip",
  planLead: "Tell us your dates and group size and we will shape this journey around you.",
  contact: "Get in touch",
  more: "More journeys",
  departs: "Departs from",
  duration: "Duration",
  stops: "Stops",
  photos: "Photos",
  overview: "Why this journey",
  brief: "The journey",
  routeLabel: "The route",
  includedTitle: "What your trip includes",
} as const;

const SMALL = new Set(["de", "du", "des", "of", "el", "al", "and", "the", "&", "to", "in", "via", "d", "n"]);

/** "MARRAKECH - AIT BEN HADOU - GORGES DE DADES:" -> "Marrakech – Ait Ben Hadou – Gorges de Dades" */
export function tidyRoute(route: string): string {
  return route
    .replace(/[:\s]+$/, "")
    .split(/\s+-\s+/)
    .map((part) =>
      part
        .toLowerCase()
        .split(" ")
        .map((w, i) => (i > 0 && SMALL.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
        .join(" "),
    )
    .join(" – ");
}

export const pad = (n: number) => String(n).padStart(2, "0");

export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`eyebrow text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-500 ${className}`}>
      {children}
    </p>
  );
}

export function SectionTitle({ eyebrow, children }: { eyebrow?: string; children: React.ReactNode }) {
  return (
    <div>
      {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
      <h2
        className="text-[30px] font-semibold leading-[1.05] tracking-[-0.035em] text-ink md:text-[40px]"
      >
        {children}
      </h2>
    </div>
  );
}

/** An itinerary photo. Hides itself if the file is missing so there is never a broken image. */
export function Photo({
  path,
  w = 900,
  className = "",
}: {
  path: string;
  w?: number;
  className?: string;
}) {
  const [ok, setOk] = useState(true);
  const src = tripImage(path, w);
  if (!ok || !src) return null;
  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      draggable={false}
      onError={() => setOk(false)}
      className={`bg-neutral-100 object-cover ${className}`}
    />
  );
}

/** Label/value facts. `stack`: a ruled column (used beside the brief); `row`: the compact grid. Used by trips and places. */
export function FactList({
  rows,
  className = "",
  variant = "row",
}: {
  rows: [string, string][];
  className?: string;
  variant?: "row" | "stack";
}) {
  const stack = variant === "stack";
  return (
    <dl className={className}>
      {rows.map(([k, v]) => (
        <div key={k} className={stack ? "border-t border-ink/10 py-5 first:border-t-0 first:pt-0" : undefined}>
          <dt className="eyebrow text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-500">{k}</dt>
          <dd className="mt-1.5 text-[19px] font-semibold tracking-[-0.02em] text-ink md:text-[22px]">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Facts({
  ctx,
  className = "",
  variant = "row",
}: {
  ctx: TripCtx;
  className?: string;
  /** `stack`: a ruled column (used beside the brief); `row`: the compact grid. */
  variant?: "row" | "stack";
}) {
  const { trip, ui, money } = ctx;
  const rows: [string, string][] = [
    [T.duration, ui.days(trip.durationDays)],
    [T.departs, trip.departureLabel],
    [T.stops, String(trip.stops.length)],
    [ui.from, `${money.format(trip.fromPrice)} ${ui.perPerson}`],
  ];
  return <FactList rows={rows} className={className} variant={variant} />;
}

/** A short lead paragraph under a small label: big, light type. */
export function BriefText({ label, text, className = "" }: { label: string; text: string; className?: string }) {
  if (!text) return null;
  return (
    <div className={className}>
      <Eyebrow className="mb-4">{label}</Eyebrow>
      <p className="max-w-[48rem] text-[24px] font-light leading-[1.25] tracking-[-0.02em] text-ink md:text-[36px]">
        {text}
      </p>
    </div>
  );
}

/** The trip's short brief (the summary every trip already has). */
export function Brief({ ctx, className = "" }: { ctx: TripCtx; className?: string }) {
  return <BriefText label={T.brief} text={ctx.trip.summary} className={className} />;
}

/** Splits a title into two balanced lines (at the space that best evens out the halves). */
export function twoLines(title: string): string[] {
  const words = title.trim().split(/\s+/);
  if (words.length < 2) return [title];
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
}

/** Key stops as quiet tags: scannable, never a 16-line list. */
export function Highlights({ ctx }: { ctx: TripCtx }) {
  const stops = ctx.trip.keyStops;
  if (!stops.length) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {stops.map((s) => (
        <li
          key={s}
          className="rounded-full border border-ink/15 px-3.5 py-1.5 text-[13px] leading-tight text-ink/80"
        >
          {s}
        </li>
      ))}
    </ul>
  );
}

function RuledList({ items }: { items: string[] }) {
  return (
    <ul className="divide-y divide-ink/10 border-y border-ink/10">
      {items.map((item, i) => (
        <li key={i} className="py-3 text-[14.5px] leading-[1.5] text-ink/80">
          {item}
        </li>
      ))}
    </ul>
  );
}

export function IncludedExcluded({ ctx }: { ctx: TripCtx }) {
  const { included, excluded } = ctx.trip;
  if (!included?.length && !excluded?.length) return null;
  return (
    <div className="grid gap-10 md:grid-cols-2 md:gap-10">
      {included?.length ? (
        <div>
          <h3 className="mb-5 text-[22px] font-semibold tracking-[-0.03em] text-ink">{T.included}</h3>
          <RuledList items={included} />
        </div>
      ) : null}
      {excluded?.length ? (
        <div>
          <h3 className="mb-5 text-[22px] font-semibold tracking-[-0.03em] text-ink">{T.excluded}</h3>
          <RuledList items={excluded} />
        </div>
      ) : null}
    </div>
  );
}

export function PricingTable({ ctx, compact = false }: { ctx: TripCtx; compact?: boolean }) {
  const { trip, money } = ctx;
  const tiers = [...trip.pricing].sort((a, b) => a.persons - b.persons);
  return (
    <div>
      <div className="grid grid-cols-3 pb-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-500">
        <span>{T.group}</span>
        <span>{T.perDay}</span>
        <span className="text-right">{T.total}</span>
      </div>
      {tiers.map((p) => (
        <div
          key={`${p.persons}-${p.days}`}
          className={`grid grid-cols-3 items-baseline border-t border-ink/10 ${compact ? "py-2.5" : "py-3.5"}`}
        >
          <span className="text-[15px] text-ink">
            {p.persons} {p.persons === 1 ? "person" : "people"}
          </span>
          <span className="text-[15px] text-ink/65">{money.format(p.pricePerPersonPerDay)}</span>
          <span className={`text-right font-semibold tracking-[-0.02em] text-ink ${compact ? "text-[16px]" : "text-[19px]"}`}>
            {money.format(p.pricePerPersonPerDay * p.days)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function PlanButton({ ctx, dark = false }: { ctx: TripCtx; dark?: boolean }) {
  return (
    <a
      href={`mailto:contact@loverofsahara.com?subject=${encodeURIComponent(ctx.trip.title)}`}
      className={`inline-flex h-[46px] items-center justify-center rounded-[10px] px-7 text-sm font-semibold transition-all duration-100 ease-out active:scale-[0.98] ${
        dark ? "bg-paper text-ink hover:bg-neutral-100" : "bg-ink text-paper hover:opacity-90"
      }`}
    >
      {T.contact}
    </a>
  );
}

export function PlanPanel({ ctx }: { ctx: TripCtx }) {
  return (
    <div className="rounded-2xl bg-ink-deep px-6 py-14 text-center text-white md:px-12 md:py-20">
      <h2 className="mx-auto max-w-[16ch] text-[32px] font-semibold leading-[1.05] tracking-[-0.035em] md:text-[52px]">
        {T.plan}
      </h2>
      <p className="mx-auto mt-4 max-w-md text-[15px] leading-[1.5] text-white/70">{T.planLead}</p>
      <div className="mt-7">
        <PlanButton ctx={ctx} dark />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------- */
/* Red Dot style building blocks                                                                */
/* ------------------------------------------------------------------------------------------- */

/** A full-width band. Alternating tones give the page Red Dot's paper / dark / off-white rhythm. */
export function Band({
  id,
  tone = "paper",
  children,
  className = "",
  parallax = true,
  fullHeight = false,
  minHeight,
}: {
  id?: string;
  tone?: "paper" | "dark" | "off";
  children: React.ReactNode;
  className?: string;
  /** Homepage-style section parallax: this band slides under the next one and darkens. */
  parallax?: boolean;
  /** At least one full screen tall, content centred. (Inline, because `.trip-page section` resets min-height.) */
  fullHeight?: boolean;
  /** Any other minimum height (e.g. "58dvh"), content centred. Wins over `fullHeight`. */
  minHeight?: string;
}) {
  const minH = minHeight ?? (fullHeight ? "100dvh" : undefined);
  const tones = {
    paper: "bg-paper text-ink",
    dark: "bg-ink-deep text-white",
    off: "bg-ink/[0.045] text-ink",
  } as const;
  return (
    <section
      id={id}
      {...(parallax ? { "data-st-01": "parallax", "data-st-y": "250", "data-st-opacity": "0.15" } : {})}
      style={minH ? { minHeight: minH } : undefined}
      className={`${tones[tone]} px-4 py-16 md:px-10 md:py-24 ${minH ? "flex flex-col justify-center" : ""} ${className}`}
    >
      {children}
    </section>
  );
}

/** Lowercase, accent-free text for loose name matching. */
export const norm = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

const GENERIC = new Set(["gorges", "valley", "lake", "desert", "village", "kasbah", "dunes", "pass", "massif"]);

/**
 * Indices of the stops a day touches. A stop matches when its full name appears in the day's route (then
 * its text); otherwise its first distinctive word does. A place visited twice (e.g. start and end city)
 * resolves to the occurrence nearest to where this day sits in the trip.
 */
export function stopsForDay(
  stops: { name: string }[],
  route: string,
  text: string,
  dayPos: number,
): number[] {
  const find = (hay: string) => {
    const h = norm(hay);
    const byName = new Map<string, number[]>();
    stops.forEach((s, i) => {
      const full = norm(s.name);
      const word = full.split(/[\s'-]+/).find((w) => w.length >= 5 && !GENERIC.has(w));
      if (h.includes(full) || (word && h.includes(word))) byName.set(full, [...(byName.get(full) ?? []), i]);
    });
    const target = dayPos * (stops.length - 1);
    return [...byName.values()].map((idx) => idx.reduce((a, b) => (Math.abs(b - target) < Math.abs(a - target) ? b : a)));
  };
  const byRoute = find(route);
  return byRoute.length ? byRoute : find(text);
}
