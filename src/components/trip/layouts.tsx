import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { TripCard } from "@/components/TripCard";
import { fadeUp } from "@/lib/animations";
import { RouteMap } from "./RouteMap";
import {
  Eyebrow,
  Facts,
  Highlights,
  IncludedExcluded,
  PlanPanel,
  PricingTable,
  SectionTitle,
  T,
  TripHero,
  pad,
  tidyRoute,
  type TripCtx,
} from "./parts";

const gutter = "px-4 md:px-10";

function More({ ctx }: { ctx: TripCtx }) {
  if (!ctx.more.length) return null;
  return (
    <section className={`${gutter} pb-24 md:pb-32`}>
      <h2 className="mb-7 text-[26px] font-semibold tracking-[-0.03em] text-ink md:text-[32px]">{T.more}</h2>
      <div className="grid grid-cols-1 gap-[6px] md:grid-cols-2 xl:grid-cols-3">
        {ctx.more.map((t, i) => (
          <TripCard key={t.slug} trip={t} index={i} />
        ))}
      </div>
    </section>
  );
}

function HeroFrame({ ctx, tall }: { ctx: TripCtx; tall: boolean }) {
  const { trip } = ctx;
  const reduce = useReducedMotion();
  return (
    <section data-hero-section className={`${tall ? "h-[92dvh]" : "h-[68dvh]"} min-h-[520px] bg-paper p-[4px]`}>
      <div className="relative flex h-full flex-col justify-end overflow-hidden rounded-2xl bg-ink-deep p-6 pb-9 md:p-12 md:pb-12">
        <TripHero ctx={ctx} className="absolute inset-0 h-full w-full object-cover object-[50%_72%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-black/25" />
        <Navbar />
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-[52rem] text-white"
        >
          <a
            href="/trips"
            className="eyebrow mb-4 inline-block text-[12px] font-medium uppercase tracking-[0.16em] text-white/75 transition-colors hover:text-white"
          >
            <span aria-hidden>←</span> {T.back}
          </a>
          <h1 className="text-[38px] font-semibold leading-[1.02] tracking-[-0.03em] md:text-[min(4.8vw,68px)]">
            {trip.title}
          </h1>
          <p className="mt-4 max-w-[32rem] text-[15px] leading-[1.5] text-white/80 md:text-[17px]">{trip.summary}</p>
        </motion.div>
      </div>
    </section>
  );
}

function FactsStrip({ ctx }: { ctx: TripCtx }) {
  return (
    <section className={`${gutter} pt-9 md:pt-12`}>
      <Facts ctx={ctx} className="grid grid-cols-2 gap-y-6 border-b border-ink/10 pb-9 md:grid-cols-4" />
    </section>
  );
}

function HighlightsBlock({ ctx }: { ctx: TripCtx }) {
  if (!ctx.trip.keyStops.length) return null;
  return (
    <motion.section {...fadeUp} className={`${gutter} py-14 md:py-20`}>
      <div className="grid gap-6 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-3">
          <SectionTitle>{T.highlights}</SectionTitle>
        </div>
        <div className="md:col-span-9">
          <Highlights ctx={ctx} />
        </div>
      </div>
    </motion.section>
  );
}

function TailSections({ ctx }: { ctx: TripCtx }) {
  const hasIncl = ctx.trip.included?.length || ctx.trip.excluded?.length;
  return (
    <>
      {hasIncl ? (
        <section className={`${gutter} pb-16 md:pb-24`}>
          <div className="border-t border-ink/10 pt-12">
            <IncludedExcluded ctx={ctx} />
          </div>
        </section>
      ) : null}
      <section className={`${gutter} pb-16 md:pb-24`}>
        <div className="grid gap-8 border-t border-ink/10 pt-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-4">
            <SectionTitle eyebrow={T.pricing}>
              {ctx.ui.from} {ctx.money.format(ctx.trip.fromPrice)}
            </SectionTitle>
            <p className="mt-4 max-w-xs text-[14px] leading-[1.5] text-neutral-500">{T.pricingNote}</p>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <PricingTable ctx={ctx} />
          </div>
        </div>
      </section>
      <section className={`${gutter} pb-16 md:pb-24`}>
        <PlanPanel ctx={ctx} />
      </section>
      <More ctx={ctx} />
    </>
  );
}

/* ------------------------------------------------------------------------------------------- */
/* 1. Editorial                                                                                 */
/* ------------------------------------------------------------------------------------------- */

export function EditorialLayout({ ctx }: { ctx: TripCtx }) {
  return (
    <div className="trip-page relative">
      <HeroFrame ctx={ctx} tall />
      <FactsStrip ctx={ctx} />
      <HighlightsBlock ctx={ctx} />
      <section className={`${gutter} pb-16 md:pb-24`}>
        <SectionTitle eyebrow={T.itinerary}>{ctx.ui.days(ctx.trip.durationDays)}</SectionTitle>
        <div className="mt-10">
          {ctx.trip.itinerary.map((d) => {
            return (
              <motion.article
                key={d.day}
                {...fadeUp}
                className="grid gap-5 border-t border-ink/10 py-9 md:grid-cols-12 md:gap-10 md:py-12"
              >
                <header className="md:col-span-4">
                  <Eyebrow>
                    {T.day} {pad(d.day)}
                  </Eyebrow>
                  {d.route && (
                    <h3 className="mt-2.5 text-[22px] font-semibold leading-[1.15] tracking-[-0.03em] text-ink md:text-[26px]">
                      {tidyRoute(d.route)}
                    </h3>
                  )}
                </header>
                <div className="md:col-span-8">
                  <p className="max-w-[42rem] whitespace-pre-line text-[15.5px] leading-[1.7] text-ink/80">{d.text}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>
      <TailSections ctx={ctx} />
    </div>
  );
}

/* ------------------------------------------------------------------------------------------- */
/* 2. Split: sticky summary on the left, the journey scrolls on the right                       */
/* ------------------------------------------------------------------------------------------- */

export function SplitLayout({ ctx }: { ctx: TripCtx }) {
  const { trip, ui } = ctx;
  return (
    <div className="trip-page relative">
      <Navbar theme="light" />
      <div className={`${gutter} pb-20 pt-28 md:pt-32`}>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Sticky summary */}
          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-8">
              <a
                href="/trips"
                className="eyebrow inline-block text-[12px] font-medium uppercase tracking-[0.16em] text-neutral-500 transition-colors hover:text-ink"
              >
                <span aria-hidden>←</span> {T.back}
              </a>
              <Eyebrow className="mt-8">
                {ui.categories[trip.category]} <span aria-hidden>·</span> {ui.days(trip.durationDays)}
              </Eyebrow>
              <h1 className="mt-3 text-[38px] font-semibold leading-[1.02] tracking-[-0.035em] text-ink md:text-[52px]">
                {trip.title}
              </h1>
              <p className="mt-5 text-[15.5px] leading-[1.65] text-ink/75">{trip.summary}</p>

              <Facts ctx={ctx} className="mt-8 grid grid-cols-2 gap-y-5 border-t border-ink/10 pt-7" />

              <div className="mt-8 border-t border-ink/10 pt-7">
                <PricingTable ctx={ctx} compact />
                <p className="mt-3 text-[12.5px] text-neutral-500">{T.pricingNote}</p>
              </div>
            </div>
          </aside>

          {/* Journey */}
          <div className="lg:col-span-7">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-ink-deep">
              <TripHero ctx={ctx} className="h-full w-full object-cover" />
            </div>

            {trip.keyStops.length > 0 && (
              <div className="mt-10">
                <Eyebrow className="mb-4">{T.highlights}</Eyebrow>
                <Highlights ctx={ctx} />
              </div>
            )}

            <div className="mt-14">
              <SectionTitle eyebrow={T.itinerary}>{ui.days(trip.durationDays)}</SectionTitle>
              <div className="mt-8">
                {trip.itinerary.map((d) => {
                  return (
                    <motion.article key={d.day} {...fadeUp} className="border-t border-ink/10 py-9">
                      <div className="flex items-baseline gap-4">
                        <span className="text-[13px] tabular-nums text-neutral-400">{pad(d.day)}</span>
                        {d.route && (
                          <h3 className="text-[20px] font-semibold leading-[1.2] tracking-[-0.025em] text-ink md:text-[22px]">
                            {tidyRoute(d.route)}
                          </h3>
                        )}
                      </div>
                      <p className="mt-4 whitespace-pre-line pl-0 text-[15px] leading-[1.7] text-ink/75 md:pl-9">{d.text}</p>
                    </motion.article>
                  );
                })}
              </div>
            </div>

            {(trip.included?.length || trip.excluded?.length) && (
              <div className="mt-6 border-t border-ink/10 pt-10">
                <IncludedExcluded ctx={ctx} />
              </div>
            )}
          </div>
        </div>
      </div>
      <More ctx={ctx} />
    </div>
  );
}

/* ------------------------------------------------------------------------------------------- */
/* 3. Index: compact hero, every day collapses to one line                                      */
/* ------------------------------------------------------------------------------------------- */

export function IndexLayout({ ctx }: { ctx: TripCtx }) {
  const [open, setOpen] = useState<number | null>(1);
  return (
    <div className="trip-page relative">
      <HeroFrame ctx={ctx} tall={false} />
      <FactsStrip ctx={ctx} />
      <HighlightsBlock ctx={ctx} />
      <section className={`${gutter} pb-16 md:pb-24`}>
        <div className="grid gap-8 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-3">
            <SectionTitle eyebrow={T.itinerary}>{ctx.ui.days(ctx.trip.durationDays)}</SectionTitle>
          </div>
          <div className="md:col-span-9">
            {ctx.trip.itinerary.map((d) => {
              const isOpen = open === d.day;
              return (
                <div key={d.day} className="border-t border-ink/10 last:border-b">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : d.day)}
                    className="flex w-full items-center gap-5 py-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
                  >
                    <span className="w-8 shrink-0 text-[13px] tabular-nums text-neutral-400">{pad(d.day)}</span>
                    <span className="min-w-0 flex-1 text-[19px] font-semibold leading-[1.2] tracking-[-0.025em] text-ink md:text-[22px]">
                      {d.route ? tidyRoute(d.route) : `${T.day} ${d.day}`}
                    </span>
                    <ChevronDown
                      size={20}
                      aria-hidden
                      className={`shrink-0 text-neutral-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows] duration-500 ease-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="pb-8 pl-0 md:pl-[52px]">
                        <p className="max-w-[40rem] whitespace-pre-line text-[15.5px] leading-[1.7] text-ink/80">{d.text}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <TailSections ctx={ctx} />
    </div>
  );
}

/* ------------------------------------------------------------------------------------------- */
/* 4. Cinematic: each day opens with a large typographic panel; a route map precedes the days   */
/* ------------------------------------------------------------------------------------------- */

export function CinematicLayout({ ctx }: { ctx: TripCtx }) {
  const [hover, setHover] = useState<number | null>(null);
  const active = hover === null ? [] : [hover];
  return (
    <div className="trip-page relative">
      <HeroFrame ctx={ctx} tall />
      <FactsStrip ctx={ctx} />
      <HighlightsBlock ctx={ctx} />
      <section className={`${gutter} pb-16 md:pb-24`}>
        <RouteMap
          stops={ctx.trip.stops}
          active={active}
          onActive={setHover}
          tone="light"
          className="h-[420px] w-full overflow-hidden rounded-2xl md:h-[560px]"
        />
      </section>
      <section className="pb-16 md:pb-24">
        <div className={`${gutter} mb-8`}>
          <SectionTitle eyebrow={T.itinerary}>{ctx.ui.days(ctx.trip.durationDays)}</SectionTitle>
        </div>
        {ctx.trip.itinerary.map((d) => (
          <motion.article key={d.day} {...fadeUp} className="p-[4px]">
            <div className="relative flex min-h-[260px] items-end overflow-hidden rounded-2xl bg-ink-deep md:min-h-[340px]">
              <span
                aria-hidden
                className="pointer-events-none absolute -right-2 -top-6 select-none text-[220px] font-semibold leading-none tracking-[-0.06em] text-white/[0.07] md:text-[340px]"
              >
                {pad(d.day)}
              </span>
              <div className="relative p-6 text-white md:p-10">
                <p className="eyebrow text-[11px] font-medium uppercase tracking-[0.16em] text-white/65">
                  {T.day} {pad(d.day)}
                </p>
                {d.route && (
                  <h3 className="mt-2 max-w-[28ch] text-[24px] font-semibold leading-[1.1] tracking-[-0.03em] md:text-[38px]">
                    {tidyRoute(d.route)}
                  </h3>
                )}
              </div>
            </div>
            <div className={`${gutter} py-8 md:py-10`}>
              <p className="max-w-[44rem] whitespace-pre-line text-[15.5px] leading-[1.7] text-ink/80 md:ml-[8.33%]">
                {d.text}
              </p>
            </div>
          </motion.article>
        ))}
      </section>
      <TailSections ctx={ctx} />
    </div>
  );
}
