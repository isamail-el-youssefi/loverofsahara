import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Check, ChevronDown, Copy, ExternalLink, Mail, MessageCircle } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CONTACT } from "@/components/contact/data";
import {
  buildTripGmailUrl,
  buildTripInquiryMessage,
  buildTripMailtoUrl,
  buildTripWhatsappUrl,
  type TripInquiryParams,
} from "@/components/contact/message";
import { tripImage, type LocalizedTrip } from "@/data/trips";
import type { UiStrings } from "@/i18n/ui";
import { useTripT } from "@/i18n/useTripT";

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
  const T = useTripT();
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
      <p className="max-w-[48rem] text-[21px] font-light leading-[1.3] tracking-[-0.02em] text-ink md:text-[36px]">
        {text}
      </p>
    </div>
  );
}

/** The trip's short brief (the summary every trip already has). */
export function Brief({ ctx, className = "" }: { ctx: TripCtx; className?: string }) {
  const T = useTripT();
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
          {item.replace(/\p{Extended_Pictographic}️?/gu, "").trim()}
        </li>
      ))}
    </ul>
  );
}

export function IncludedExcluded({ ctx }: { ctx: TripCtx }) {
  const T = useTripT();
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

export function EmailChoicePopover({
  params,
  dark = false,
  compact = false,
}: {
  params: TripInquiryParams;
  dark?: boolean;
  compact?: boolean;
}) {
  const T = useTripT();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const gmailUrl = buildTripGmailUrl(params);
  const mailtoUrl = buildTripMailtoUrl(params);
  const inquiryMessage = buildTripInquiryMessage(params);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`To: ${CONTACT.email}\n\n${inquiryMessage}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard fallback
    }
  };

  const triggerClasses = dark
    ? "inline-flex h-[46px] items-center justify-center gap-2 rounded-full border border-white/30 px-6 text-sm font-semibold text-white transition-all duration-100 ease-out hover:bg-white/10 active:scale-[0.98]"
    : `inline-flex items-center justify-center gap-1.5 rounded-full border border-ink/20 text-ink transition-all duration-100 ease-out hover:bg-ink/[0.04] active:scale-[0.98] ${
        compact ? "h-[40px] px-4 text-[13px]" : "h-[42px] px-5 text-[13.5px] font-semibold"
      }`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" className={triggerClasses} aria-label={T.chooseClient}>
          <Mail size={15} aria-hidden="true" />
          <span>{T.email}</span>
          <ChevronDown size={13} className={dark ? "text-white/60" : "text-neutral-400"} aria-hidden="true" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="z-50 w-[270px] rounded-2xl border border-ink/10 bg-paper p-1.5 text-ink shadow-[0_20px_50px_-15px_rgba(0,0,0,0.35)] outline-none"
      >
        <p className="px-3 pb-1.5 pt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
          {T.sendVia}
        </p>

        <div className="flex flex-col gap-0.5">
          {/* Gmail */}
          <a
            href={gmailUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between rounded-xl px-3 py-2 text-left text-[13.5px] font-medium text-ink transition-colors hover:bg-ink/[0.05]"
          >
            <span className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10 text-red-600 font-bold text-[13px]">
                G
              </span>
              <span>
                <span className="block leading-tight font-semibold">Gmail</span>
                <span className="block text-[11.5px] text-neutral-500 font-normal">{T.opensTab}</span>
              </span>
            </span>
            <ExternalLink size={13} className="text-neutral-400" aria-hidden="true" />
          </a>

          {/* Default Mail App (Outlook, Apple Mail) */}
          <a
            href={mailtoUrl}
            onClick={() => setOpen(false)}
            className="flex items-center justify-between rounded-xl px-3 py-2 text-left text-[13.5px] font-medium text-ink transition-colors hover:bg-ink/[0.05]"
          >
            <span className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink/5 text-ink">
                <Mail size={14} />
              </span>
              <span>
                <span className="block leading-tight font-semibold">{T.defaultApp}</span>
                <span className="block text-[11.5px] text-neutral-500 font-normal">Outlook, Apple Mail</span>
              </span>
            </span>
          </a>

          {/* Copy Details */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[13.5px] font-medium text-ink transition-colors hover:bg-ink/[0.05]"
          >
            <span className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink/5 text-ink">
                {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              </span>
              <span>
                <span className="block leading-tight font-semibold">
                  {copied ? T.copied : T.copyDetails}
                </span>
                <span className="block text-[11.5px] text-neutral-500 font-normal">
                  {copied ? T.readyToPaste : T.copyHint}
                </span>
              </span>
            </span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function PricingTable({ ctx, compact = false }: { ctx: TripCtx; compact?: boolean }) {
  const T = useTripT();
  const isMobile = useIsMobile();
  const { trip, money } = ctx;
  const tiers = [...trip.pricing].sort((a, b) => a.persons - b.persons);

  const [selected, setSelected] = useState<number | "solo" | "custom">(() => {
    const two = tiers.find((x) => x.persons === 2);
    return two ? two.persons : (tiers[0]?.persons ?? 2);
  });

  const selectedTier = typeof selected === "number" ? tiers.find((x) => x.persons === selected) : undefined;
  const pricePerPersonPerDay = selectedTier ? selectedTier.pricePerPersonPerDay : trip.fromPrice;
  const totalPerPerson = selectedTier ? pricePerPersonPerDay * selectedTier.days : trip.fromPrice * trip.durationDays;
  const groupTotal = typeof selected === "number" ? totalPerPerson * selected : undefined;

  const inquiryParams: TripInquiryParams = {
    tripTitle: trip.title,
    durationDays: trip.durationDays,
    departureCity: trip.departureCity,
    persons: selected,
    pricePerPersonPerDay: typeof selected === "number" ? pricePerPersonPerDay : undefined,
    totalPerPerson: typeof selected === "number" ? totalPerPerson : undefined,
    groupTotal,
  };

  const waUrl = buildTripWhatsappUrl(inquiryParams);

  return (
    <div>
      {/* Table header */}
      <div className="grid grid-cols-12 pb-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-500">
        <span className="col-span-5">{T.group}</span>
        <span className="col-span-3 text-center">{T.perDay}</span>
        <span className="col-span-4 text-right">{T.total}</span>
      </div>

      {/* Ruled rows */}
      <div className="divide-y divide-ink/10 border-y border-ink/10">
        {tiers.map((p) => {
          const isSelected = selected === p.persons;
          return (
            <button
              key={`${p.persons}-${p.days}`}
              type="button"
              onClick={() => setSelected(p.persons)}
              className={`group -mx-2.5 grid w-[calc(100%+1.25rem)] grid-cols-12 items-baseline rounded-md px-2.5 text-left transition-colors duration-100 ${
                compact ? "py-2.5" : "py-3.5"
              } ${isSelected ? "bg-ink/[0.04]" : "hover:bg-ink/[0.02]"}`}
            >
              <span className="col-span-5 flex items-center gap-2 text-[15px] text-ink">
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full transition-all ${
                    isSelected
                      ? "bg-brand opacity-100 scale-100"
                      : "bg-ink/30 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100"
                  }`}
                  aria-hidden="true"
                />
                <span className={isSelected ? "font-semibold text-ink" : "text-ink"}>
                  {p.persons} {p.persons === 1 ? T.person : T.people}
                </span>
              </span>
              <span className="col-span-3 text-center text-[15px] text-ink/65">
                {money.format(p.pricePerPersonPerDay)}
              </span>
              <span
                className={`col-span-4 text-right font-semibold tracking-[-0.02em] text-ink ${
                  compact ? "text-[16px]" : "text-[19px]"
                }`}
              >
                {money.format(p.pricePerPersonPerDay * p.days)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Alternative sizes: quiet editorial links */}
      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 text-[12.5px] text-neutral-500">
        <span>{T.customGroup}</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSelected("solo")}
            className={`inline-flex min-h-11 items-center transition-colors md:min-h-0 ${
              selected === "solo"
                ? "font-semibold text-ink underline underline-offset-4 decoration-brand"
                : "hover:text-ink"
            }`}
          >
            {T.solo}
          </button>
          <span className="text-neutral-300" aria-hidden="true">·</span>
          <button
            type="button"
            onClick={() => setSelected("custom")}
            className={`inline-flex min-h-11 items-center transition-colors md:min-h-0 ${
              selected === "custom"
                ? "font-semibold text-ink underline underline-offset-4 decoration-brand"
                : "hover:text-ink"
            }`}
          >
            {T.sixPlus}
          </button>
        </div>
      </div>

      {/* Editorial Inquiry Action Strip */}
      <div className={`border-t border-ink/10 pt-5 ${compact ? "mt-5" : "mt-8"}`}>
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <div className="min-w-0">
            <p className="eyebrow flex items-center gap-2 whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-500">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
              {selected === "solo"
                ? T.soloLabel
                : selected === "custom"
                  ? T.groupLabel
                  : T.travelers(selected)}
            </p>
            <p className="mt-1 text-[15.5px] font-medium tracking-[-0.01em] text-ink">
              {selected === "solo" ? (
                T.soloText
              ) : selected === "custom" ? (
                T.groupText
              ) : (
                <>
                  {/* Phone: just the total, so the price and both buttons fit on one line */}
                  {groupTotal ? (
                    <span className="sm:hidden">
                      <span className="font-semibold text-ink">{money.format(groupTotal)}</span>
                      <span className="text-neutral-500"> {T.totalWord}</span>
                    </span>
                  ) : null}
                  <span className={groupTotal ? "hidden sm:inline" : ""}>
                    <span className="font-semibold text-ink">{money.format(totalPerPerson)}</span>
                    <span className="text-neutral-500"> {T.perPersonWord}</span>
                    {groupTotal && (
                      <span className="font-normal text-neutral-500"> · {money.format(groupTotal)} {T.totalWord}</span>
                    )}
                  </span>
                </>
              )}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-[42px] items-center justify-center gap-2 rounded-full bg-ink px-3.5 text-[13.5px] sm:px-5 font-semibold text-paper transition-all duration-100 ease-out hover:bg-ink-deep active:scale-[0.98]"
            >
              <MessageCircle size={15} aria-hidden="true" />
              <span>WhatsApp</span>
            </a>
            <EmailChoicePopover params={inquiryParams} compact={compact || isMobile} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PlanButton({ ctx, dark = false }: { ctx: TripCtx; dark?: boolean }) {
  const defaultTier = [...ctx.trip.pricing].sort((a, b) => a.persons - b.persons)[0];
  const persons = defaultTier ? defaultTier.persons : 2;
  const totalPerPerson = defaultTier
    ? defaultTier.pricePerPersonPerDay * defaultTier.days
    : ctx.trip.fromPrice * ctx.trip.durationDays;
  const groupTotal = defaultTier ? totalPerPerson * defaultTier.persons : totalPerPerson * 2;

  const inquiryParams: TripInquiryParams = {
    tripTitle: ctx.trip.title,
    durationDays: ctx.trip.durationDays,
    departureCity: ctx.trip.departureCity,
    persons,
    pricePerPersonPerDay: defaultTier?.pricePerPersonPerDay ?? ctx.trip.fromPrice,
    totalPerPerson,
    groupTotal,
  };

  const waUrl = buildTripWhatsappUrl(inquiryParams);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex h-[46px] items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-all duration-100 ease-out active:scale-[0.98] ${
          dark ? "bg-paper text-ink hover:bg-neutral-100" : "bg-ink text-paper hover:bg-ink-deep"
        }`}
      >
        <MessageCircle size={16} aria-hidden="true" />
        <span>WhatsApp</span>
      </a>
      <EmailChoicePopover params={inquiryParams} dark={dark} />
    </div>
  );
}

/** Closing call to action: the Statement design (centred on paper, hairline above), with the trip's own text and buttons. */
export function PlanPanel({ ctx }: { ctx: TripCtx }) {
  const T = useTripT();
  return (
    <div className="border-t border-ink/10 px-2 pb-8 pt-20 text-center md:pt-28">
      <h2 className="mx-auto max-w-5xl text-[40px] font-semibold leading-[1.02] tracking-[-0.05em] text-ink md:text-[104px]">
        {T.plan}
      </h2>
      <p className="mx-auto mt-8 max-w-md text-[16px] font-medium leading-[1.6] tracking-[-0.02em] text-neutral-500">{T.planLead}</p>
      <div className="mt-10">
        <PlanButton ctx={ctx} />
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
    off: "bg-[color-mix(in_srgb,var(--color-ink)_4.5%,var(--color-paper))] text-ink", // opaque: a see-through band lets the parallax band underneath show through
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
