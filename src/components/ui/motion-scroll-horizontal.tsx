"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useScrollContainer } from "@/lib/scrollContainer";

export interface ScrollHorizontalItem {
  src: string;
  alt: string;
  label: string;
  location?: string;
}

/** The 3-layer cutout used by the zoom-parallax hero on desktop. */
export interface ScrollHorizontalLayers {
  sky: string; // deepest background
  dune: string; // midground
  front: string; // foreground cutout
}

export interface ScrollHorizontalProps {
  /** Cards that slide sideways. The LAST card is replaced by the layered parallax image. */
  items: ScrollHorizontalItem[];
  /** Layers for the final card (same assets as the desktop zoom-parallax centre image). */
  layers: ScrollHorizontalLayers;
  /** Label shown on the final card before it zooms */
  finalLabel?: string;
  finalLocation?: string;
  title?: string;
  subtitle?: string;
}

const GAP = 6; // matches the site's tight 6px grid gaps
/** Empty frame left above and beside the zoomed image: same as the footer (px-[4px]). The bottom is flush. */
const FRAME = 4;
/** Corner radius of the zoomed frame: Tailwind `rounded-2xl` in this theme. */
const FRAME_RADIUS = 18;
const CARD_RADIUS = 10;

// Scroll phases (0 to 1 across the sticky track)
const PAN_END = 0.5; //     cards slide sideways
const ZOOM_START = 0.52; // last card grows to full-bleed
const ZOOM_END = 0.76; //   full screen reached
//                          ZOOM_END to 1: layers parallax (same as desktop 0.35 to 1)

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const ramp = (v: number, from: number, to: number, a: number, b: number) =>
  a + (b - a) * clamp01((v - from) / (to - from));

/**
 * Phone gallery: scroll down to slide cards sideways. The last card is the layered
 * sky / dunes / foreground image; it zooms to full screen and its layers then parallax,
 * exactly like the desktop zoom-parallax centre image.
 *
 * Adapted from the 21st.dev "motion-scroll-horizontal" component and bound to the page's
 * own scroll container. Transforms use plain functions (not [input]/[output] arrays) because
 * the array form is handed to the browser's native scroll timeline, which misreads sticky
 * layouts inside a nested scroller.
 */
export function ScrollHorizontal({
  items,
  layers,
  finalLabel = "Erg Chegaga",
  finalLocation = "Zagora",
  title = "SAHARA DESERT",
  subtitle = "Where The Dunes Meet The Sky",
}: ScrollHorizontalProps) {
  const reduce = useReducedMotion();
  const scrollContainer = useScrollContainer();
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Measured on resize so the pan distance and zoom factor fit any phone size
  const metrics = useRef({ step: 0, slotW: 0, slotH: 0, vw: 0, vh: 0 });

  const { scrollYProgress } = useScroll({
    ...scrollContainer,
    target: trackRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const card = cardRef.current;
    const stage = stageRef.current;
    if (!card || !stage) return;

    const measure = () => {
      // fractional sizes: offsetWidth rounds, which would drift the pan by ~0.4px per card
      const rect = card.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (!w || !h) return;
      metrics.current = {
        step: w + GAP,
        slotW: w,
        slotH: h,
        vw: stage.getBoundingClientRect().width,
        vh: stage.getBoundingClientRect().height,
      };
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(card);
    ro.observe(stage);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Number of cards = items + the layered final card
  const total = items.length + 1;
  const last = total - 1;

  // Pan: first card starts centred, final card ends centred
  const x = useTransform(scrollYProgress, (v) => -clamp01(v / PAN_END) * last * metrics.current.step);

  // Zoom of the final card + corner radius
  const zoomT = useTransform(scrollYProgress, (v) => easeOut(clamp01((v - ZOOM_START) / (ZOOM_END - ZOOM_START))));
  // The final card grows (width/height, not scale, so layers stay crisp and the frame is exact)
  // until it fills the stage minus a 4px frame on every side, like the footer's inset.
  const lastWidth = useTransform(zoomT, (t) => {
    const m = metrics.current;
    return m.slotW ? m.slotW + (m.vw - FRAME * 2 - m.slotW) * t : "74cqw";
  });
  const lastHeight = useTransform(zoomT, (t) => {
    const m = metrics.current;
    // frame on top only: the image runs flush to the bottom edge, straight into the footer
    return m.slotH ? m.slotH + (m.vh - FRAME - m.slotH) * t : "62dvh";
  });
  // Drop the card down by half the frame so the extra 4px sits at the top, not split top/bottom
  const lastShift = useTransform(zoomT, (t) => (FRAME / 2) * t);
  // Top corners round up to the footer's radius; bottom corners square off
  const radiusTop = useTransform(zoomT, (t) => CARD_RADIUS + (FRAME_RADIUS - CARD_RADIUS) * t);
  const radiusBottom = useTransform(zoomT, (t) => CARD_RADIUS * (1 - t));

  // Other cards + captions fade away as the final card takes the screen
  const othersOpacity = useTransform(scrollYProgress, (v) => ramp(v, PAN_END - 0.04, ZOOM_START + 0.1, 1, 0));
  const captionOpacity = useTransform(scrollYProgress, (v) => ramp(v, PAN_END, ZOOM_START + 0.04, 1, 0));

  // Layer parallax once full screen (same ranges as ZoomParallax: sky down, dunes/title/foreground up)
  const yLayer1 = useTransform(scrollYProgress, (v) => `${ramp(v, ZOOM_END, 1, 0, 8)}%`);
  const yLayer2 = useTransform(scrollYProgress, (v) => `${ramp(v, ZOOM_END, 1, 0, -5)}%`);
  const yTitle = useTransform(scrollYProgress, (v) => `${ramp(v, ZOOM_END, 1, 0, -10)}%`);
  const yLayer4 = useTransform(scrollYProgress, (v) => `${ramp(v, ZOOM_END, 1, 0, -15)}%`);
  const opacityTitle = useTransform(scrollYProgress, (v) => ramp(v, ZOOM_END - 0.14, ZOOM_END - 0.02, 0, 1));

  // Progress UI
  const barScale = useTransform(scrollYProgress, (v) => clamp01(v / PAN_END));
  const counter = useTransform(scrollYProgress, (v) =>
    String(Math.round(clamp01(v / PAN_END) * last) + 1).padStart(2, "0"),
  );
  const uiOpacity = useTransform(scrollYProgress, (v) => ramp(v, PAN_END, ZOOM_START + 0.06, 1, 0));

  const cardClass =
    "relative m-0 h-[62dvh] w-[74cqw] shrink-0 overflow-hidden rounded-[10px] bg-ink-deep";

  return (
    <div ref={trackRef} className="relative h-[480dvh] w-full bg-paper">
      {/* container-type: cqw units follow the stage width (viewport minus any scrollbar), so the last card centres exactly */}
      <div
        ref={stageRef}
        className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-paper [container-type:inline-size]"
      >
        {/* Track of cards */}
        <motion.div
          style={{ x, gap: GAP }}
          className="absolute inset-y-0 left-0 flex items-center px-[13cqw] will-change-transform"
        >
          {items.map((item, i) => (
            <motion.figure
              key={item.src}
              ref={i === 0 ? cardRef : undefined}
              style={{ opacity: othersOpacity }}
              className={cardClass}
            >
              <img
                src={item.src}
                alt={item.alt}
                loading={i < 3 ? "eager" : "lazy"}
                draggable={false}
                className="h-full w-full select-none object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <motion.figcaption
                style={{ opacity: captionOpacity }}
                className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-3 p-5 text-white"
              >
                <span className="text-lg font-semibold leading-[1.15] tracking-[-0.02em]">
                  {item.label}
                  {item.location && (
                    <span className="mt-1 block text-xs font-medium tracking-normal text-white/70">
                      {item.location}
                    </span>
                  )}
                </span>
                <span className="shrink-0 pb-0.5 text-xs font-medium tabular-nums text-white/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </motion.figcaption>
            </motion.figure>
          ))}

          {/* Final card: 3-layer parallax image (same composition as the desktop centre image) */}
          {/* Fixed-size slot keeps the row layout stable while the card inside grows */}
          <div className="relative h-[62dvh] w-[74cqw] shrink-0">
          <motion.figure
            style={{
              width: lastWidth,
              height: lastHeight,
              borderTopLeftRadius: radiusTop,
              borderTopRightRadius: radiusTop,
              borderBottomLeftRadius: radiusBottom,
              borderBottomRightRadius: radiusBottom,
              marginTop: lastShift,
              x: "-50%",
              y: "-50%",
              zIndex: 10,
            }}
            className="absolute left-1/2 top-1/2 m-0 overflow-hidden bg-ink-deep"
          >
            {/* Oversized stack so edges never show while layers translate */}
            <div className="absolute -top-[30%] -left-[10%] h-[160%] w-[120%]">
              <motion.div
                style={{ y: reduce ? 0 : yLayer1 }}
                className="pointer-events-none absolute inset-0 will-change-transform"
              >
                <img
                  src={layers.sky}
                  alt=""
                  draggable={false}
                  className="h-full w-full select-none object-cover object-center"
                />
              </motion.div>

              <motion.div
                style={{ y: reduce ? 0 : yLayer2 }}
                className="pointer-events-none absolute inset-0 will-change-transform"
              >
                <img
                  src={layers.dune}
                  alt=""
                  draggable={false}
                  className="h-full w-full select-none object-cover object-center"
                />
              </motion.div>

              {/* Title sandwiched between the dunes and the foreground cutout */}
              <motion.div
                style={{ y: reduce ? 0 : yTitle, opacity: opacityTitle }}
                className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center pb-16 will-change-transform"
              >
                <div className="select-none px-3 text-center">
                  <h2 className="text-[26px] font-black uppercase leading-[0.88] tracking-[-0.04em] text-amber-900/60 drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)]">
                    {title}
                  </h2>
                  <p className="mt-1 text-[9px] font-bold uppercase leading-[0.88] tracking-[-0.01em] text-amber-900/60 drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)]">
                    {subtitle}
                  </p>
                </div>
              </motion.div>

              <motion.div
                style={{ y: reduce ? 0 : yLayer4 }}
                className="pointer-events-none absolute inset-0 z-20 will-change-transform"
              >
                <img
                  src={layers.front}
                  alt={`${finalLabel} — desert dunes with a lone traveller`}
                  draggable={false}
                  className="h-full w-full select-none object-cover object-center"
                />
              </motion.div>
            </div>

            {/* Caption while it is still a card in the row */}
            <div className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-t from-black/80 via-transparent to-transparent">
              <motion.div
                style={{ opacity: captionOpacity }}
                className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-3 p-5 text-white"
              >
                <span className="text-lg font-semibold leading-[1.15] tracking-[-0.02em]">
                  {finalLabel}
                  <span className="mt-1 block text-xs font-medium tracking-normal text-white/70">
                    {finalLocation}
                  </span>
                </span>
                <span className="shrink-0 pb-0.5 text-xs font-medium tabular-nums text-white/70">
                  {String(total).padStart(2, "0")}
                </span>
              </motion.div>
            </div>
          </motion.figure>
          </div>
        </motion.div>

        {/* Counter + progress bar */}
        <motion.div
          style={{ opacity: uiOpacity }}
          className="pointer-events-none absolute inset-x-4 bottom-7 z-20 flex items-center gap-3 text-ink"
        >
          <span className="text-xs font-medium tabular-nums">
            <motion.span>{counter}</motion.span>
            <span className="text-neutral-400"> / {String(total).padStart(2, "0")}</span>
          </span>
          <span className="relative h-px flex-1 bg-neutral-200">
            <motion.span style={{ scaleX: barScale }} className="absolute inset-0 origin-left bg-brand" />
          </span>
        </motion.div>
      </div>
    </div>
  );
}

export default ScrollHorizontal;
