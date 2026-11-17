import { createContext, forwardRef, useContext } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import type { LocalizedTrip } from "@/data/trips";
import { useTripCover } from "@/hooks/use-trip-cover";
import { fadeUp } from "@/lib/animations";
import { tripPath } from "@/lib/routes";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useCardStyle } from "@/hooks/use-card-style";

type CardProps = { trip: LocalizedTrip; index: number };

function usePrice(trip: LocalizedTrip) {
  const { lang } = useLanguage();
  return new Intl.NumberFormat(lang, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(
    trip.fromPrice,
  );
}

/** True inside the trips grid: the grid staggers the cards in, so they skip their own scroll fade. */
const StaggerContext = createContext(false);

function useCardMotion(index: number) {
  const staggered = useContext(StaggerContext);
  if (staggered) return {};
  return { ...fadeUp, transition: { ...fadeUp.transition, delay: (index % 3) * 0.08 } };
}

/** Trips grid entry: a quiet fade-up, staggered by index; the grid is re-keyed on filter change (see Trips.tsx). Long, soft ease-out; no bounce. */
const cardEnter = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const, delay: 0.05 + Math.min(i, 9) * 0.06 },
  }),
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.25, ease: "easeIn" as const } },
};

const photoCard = "group relative h-[480px] overflow-hidden rounded-[10px] bg-ink-deep md:h-[540px]";
const photo = "h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]";

/** Minimal: full-bleed photo, a soft low gradient, the title and a single quiet line. */
function MinimalCard({ trip, index }: CardProps) {
  const motionProps = useCardMotion(index);
  const cover = useTripCover(trip.slug, trip.cover);
  const { ui } = useLanguage();
  const price = usePrice(trip);
  return (
    <motion.article {...motionProps} data-trip={trip.slug} className={photoCard}>
      <img src={cover} alt="" width={1024} height={1280} loading="lazy" draggable={false} className={photo} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <h3 className="text-[26px] font-semibold leading-[1.08] tracking-[-0.03em]">{trip.title}</h3>
        <p className="mt-2 text-[13px] text-white/75">
          {ui.days(trip.durationDays)} <span aria-hidden>·</span> {ui.from} {price}
        </p>
      </div>
    </motion.article>
  );
}

/** Editorial: the photo stands alone; type sits quietly underneath on the page colour. */
function EditorialCard({ trip, index }: CardProps) {
  const motionProps = useCardMotion(index);
  const cover = useTripCover(trip.slug, trip.cover);
  const { ui } = useLanguage();
  const price = usePrice(trip);
  return (
    <motion.article {...motionProps} data-trip={trip.slug} className="group pb-8 text-ink">
      <div className="aspect-[4/5] overflow-hidden rounded-[10px] bg-ink-deep">
        <img src={cover} alt="" width={1024} height={1280} loading="lazy" draggable={false} className={photo} />
      </div>
      <p className="eyebrow mt-4 text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
        {ui.categories[trip.category]} <span aria-hidden>·</span> {ui.days(trip.durationDays)}
      </p>
      <h3 className="mt-1.5 text-[24px] font-semibold leading-[1.1] tracking-[-0.03em]">{trip.title}</h3>
      <p className="mt-2 text-[14px] text-neutral-600">
        {ui.from} {price}
      </p>
    </motion.article>
  );
}

/** Plaque: a small frosted paper label floats over the bottom of the photo. */
function PlaqueCard({ trip, index }: CardProps) {
  const motionProps = useCardMotion(index);
  const cover = useTripCover(trip.slug, trip.cover);
  const { ui } = useLanguage();
  const price = usePrice(trip);
  return (
    <motion.article {...motionProps} data-trip={trip.slug} className={photoCard}>
      <img src={cover} alt="" width={1024} height={1280} loading="lazy" draggable={false} className={photo} />
      <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-4 rounded-[8px] bg-paper/95 p-4 text-ink shadow-[0_10px_30px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md">
        <div className="min-w-0">
          <p className="eyebrow text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
            {ui.days(trip.durationDays)}
          </p>
          <h3 className="mt-1 text-[20px] font-semibold leading-[1.1] tracking-[-0.03em]">{trip.title}</h3>
        </div>
        <p className="shrink-0 text-right text-[12px] leading-tight text-neutral-500">
          {ui.from}
          <span className="block text-[18px] font-semibold tracking-[-0.02em] text-ink">{price}</span>
        </p>
      </div>
    </motion.article>
  );
}

/** Reveal: only the title at rest; the summary and price slide up on hover or focus. */
function RevealCard({ trip, index }: CardProps) {
  const motionProps = useCardMotion(index);
  const cover = useTripCover(trip.slug, trip.cover);
  const { ui } = useLanguage();
  const price = usePrice(trip);
  return (
    <motion.article {...motionProps} data-trip={trip.slug} tabIndex={0} className={`${photoCard} outline-none`}>
      <img src={cover} alt="" width={1024} height={1280} loading="lazy" draggable={false} className={photo} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/0 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <h3 className="text-[26px] font-semibold leading-[1.08] tracking-[-0.03em]">{trip.title}</h3>
        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <p className="line-clamp-2 pt-3 text-[14px] leading-[1.5] text-white/80">{trip.summary}</p>
            <p className="pt-3 text-[13px] text-white/75">
              {ui.days(trip.durationDays)} <span aria-hidden>·</span> {ui.from} {price}
            </p>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/** Caption: bare photo, then one hairline row underneath: title left, price right. */
function CaptionCard({ trip, index }: CardProps) {
  const motionProps = useCardMotion(index);
  const cover = useTripCover(trip.slug, trip.cover);
  const { ui } = useLanguage();
  const price = usePrice(trip);
  return (
    <motion.article {...motionProps} data-trip={trip.slug} className="group pb-6 text-ink">
      <div className="aspect-[4/5] overflow-hidden rounded-[10px] bg-ink-deep">
        <img src={cover} alt="" width={1024} height={1280} loading="lazy" draggable={false} className={photo} />
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-4 border-b border-ink/15 pb-3">
        <h3 className="text-[19px] font-semibold leading-[1.15] tracking-[-0.02em]">{trip.title}</h3>
        <span className="shrink-0 text-[14px] text-neutral-600">{price}</span>
      </div>
      <p className="mt-2 text-[12px] text-neutral-500">{ui.days(trip.durationDays)}</p>
    </motion.article>
  );
}

/** Index: a thin number in the corner and the title; nothing else. */
function IndexCard({ trip, index }: CardProps) {
  const motionProps = useCardMotion(index);
  const cover = useTripCover(trip.slug, trip.cover);
  const { ui } = useLanguage();
  return (
    <motion.article {...motionProps} data-trip={trip.slug} className={photoCard}>
      <img src={cover} alt="" width={1024} height={1280} loading="lazy" draggable={false} className={photo} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/15" />
      <span className="absolute left-6 top-5 text-[13px] font-medium tabular-nums tracking-[0.08em] text-white/80">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="absolute right-6 top-5 text-[13px] text-white/80">{ui.days(trip.durationDays)}</span>
      <h3 className="absolute inset-x-0 bottom-0 p-6 text-[28px] font-semibold leading-[1.05] tracking-[-0.03em] text-white">
        {trip.title}
      </h3>
    </motion.article>
  );
}

/** Centered: title and days centred at the foot of the photo, quiet and symmetrical. */
function CenteredCard({ trip, index }: CardProps) {
  const motionProps = useCardMotion(index);
  const cover = useTripCover(trip.slug, trip.cover);
  const { ui } = useLanguage();
  return (
    <motion.article {...motionProps} data-trip={trip.slug} className={photoCard}>
      <img src={cover} alt="" width={1024} height={1280} loading="lazy" draggable={false} className={photo} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/0 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center p-7 text-center text-white">
        <h3 className="max-w-[16ch] text-[25px] font-semibold leading-[1.1] tracking-[-0.02em]">{trip.title}</h3>
        <span className="mt-3 h-px w-8 bg-white/50" aria-hidden />
        <p className="eyebrow mt-3 text-[11px] font-medium uppercase tracking-[0.16em] text-white/75">
          {ui.days(trip.durationDays)}
        </p>
      </div>
    </motion.article>
  );
}

/** Frame: the photo sits in a paper mat like a gallery print; title below inside the frame. */
function FrameCard({ trip, index }: CardProps) {
  const motionProps = useCardMotion(index);
  const cover = useTripCover(trip.slug, trip.cover);
  const { ui } = useLanguage();
  const price = usePrice(trip);
  return (
    <motion.article
      {...motionProps}
      data-trip={trip.slug}
      className="group rounded-[10px] border border-ink/12 bg-paper p-3 text-ink"
    >
      <div className="aspect-[4/5] overflow-hidden rounded-[6px] bg-ink-deep">
        <img src={cover} alt="" width={1024} height={1280} loading="lazy" draggable={false} className={photo} />
      </div>
      <div className="px-1 pb-1 pt-4 text-center">
        <h3 className="text-[20px] font-semibold leading-[1.15] tracking-[-0.02em]">{trip.title}</h3>
        <p className="mt-1.5 text-[12px] text-neutral-500">
          {ui.days(trip.durationDays)} <span aria-hidden>·</span> {ui.from} {price}
        </p>
      </div>
    </motion.article>
  );
}

/** Corner: title bottom-left, price bottom-right, on the lightest possible shade. */
function CornerCard({ trip, index }: CardProps) {
  const motionProps = useCardMotion(index);
  const cover = useTripCover(trip.slug, trip.cover);
  const price = usePrice(trip);
  return (
    <motion.article {...motionProps} data-trip={trip.slug} className={photoCard}>
      <img src={cover} alt="" width={1024} height={1280} loading="lazy" draggable={false} className={photo} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-white">
        <h3 className="text-[22px] font-semibold leading-[1.1] tracking-[-0.02em]">{trip.title}</h3>
        <span className="shrink-0 text-[15px] text-white/85">{price}</span>
      </div>
    </motion.article>
  );
}

/** Picks the design chosen in the theme switcher. */
export const TripCard = forwardRef<HTMLAnchorElement, CardProps & { stagger?: boolean }>(function TripCard(
  { stagger = false, ...props },
  ref,
) {
  const style = useCardStyle();
  const card = (() => {
    switch (style) {
      case "caption":
        return <CaptionCard {...props} />;
      case "index":
        return <IndexCard {...props} />;
      case "centered":
        return <CenteredCard {...props} />;
      case "frame":
        return <FrameCard {...props} />;
      case "corner":
        return <CornerCard {...props} />;
      case "minimal":
        return <MinimalCard {...props} />;
      case "editorial":
        return <EditorialCard {...props} />;
      case "plaque":
        return <PlaqueCard {...props} />;
      case "reveal":
        return <RevealCard {...props} />;
      default:
        return <ClassicCard {...props} />;
    }
  })();
  const href = tripPath(props.trip.slug);
  const cls = "block rounded-[10px] outline-none focus-visible:ring-2 focus-visible:ring-ink/50";
  if (!stagger) {
    return (
      <a ref={ref} href={href} aria-label={props.trip.title} className={cls}>
        {card}
      </a>
    );
  }
  // Trips grid: each card staggers itself; the photo's slow zoom is the hover.
  // `layout` makes the cards that stay glide to their new grid slot when the filter changes
  // (same FLIP + spring as 21st.dev animated-toggle-layout-container); leaving cards fade out.
  return (
    <StaggerContext.Provider value>
      <motion.a
        ref={ref}
        layout
        href={href}
        aria-label={props.trip.title}
        className={cls}
        variants={cardEnter}
        custom={props.index}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ layout: { type: "spring", stiffness: 200, damping: 25 } }}
      >
        {card}
      </motion.a>
    </StaggerContext.Provider>
  );
});

const glass =
  "inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]";

/**
 * One trip. Same visual language as the expedition cards: full-bleed photo, 10px radius,
 * dark gradient from the bottom, frosted-glass pills, tight semibold type.
 */
function ClassicCard({ trip, index }: CardProps) {
  const motionProps = useCardMotion(index);
  const cover = useTripCover(trip.slug, trip.cover);
  const { ui, lang } = useLanguage();
  const price = new Intl.NumberFormat(lang, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(trip.fromPrice);

  return (
    <motion.article
      {...motionProps}
      data-trip={trip.slug}
      className="group relative h-[480px] overflow-hidden rounded-[10px] bg-ink-deep md:h-[540px]"
    >
      <img
        src={cover}
        alt=""
        width={1024}
        height={1280}
        loading="lazy"
        draggable={false}
        className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/25" />

      {/* Top: category + duration */}
      <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-2">
        <span className={glass}>{ui.categories[trip.category]}</span>
        <span className={glass}>{ui.days(trip.durationDays)}</span>
      </div>

      {/* Bottom: title, summary, price */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-5 text-white md:p-6">
        <p className="eyebrow text-[11px] font-semibold uppercase tracking-[0.08em] text-white/65">
          {ui.departsFrom} {trip.departureLabel}
        </p>
        <h3 className="text-[24px] font-semibold leading-[1.08] tracking-[-0.03em] md:text-[26px]">
          {trip.title}
        </h3>
        <p className="line-clamp-2 text-[14px] leading-[1.5] text-white/75">{trip.summary}</p>

        <div className="mt-1 flex items-end justify-between gap-4 border-t border-white/20 pt-4">
          <div>
            <span className="block text-[11px] font-medium uppercase tracking-[0.06em] text-white/60">
              {ui.from}
            </span>
            <span className="text-[26px] font-semibold leading-none tracking-[-0.03em]">{price}</span>
            <span className="ml-1.5 text-[12px] text-white/65">{ui.perPerson}</span>
          </div>
          <span className="inline-flex items-center gap-1.5 pb-0.5 text-[12px] font-medium text-white/70">
            <MapPin size={13} aria-hidden />
            {ui.stops(trip.stops.length)}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
