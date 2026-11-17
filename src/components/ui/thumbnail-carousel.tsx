import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Photo carousel with a thumbnail strip (adapted from the 21st.dev "thumbnail carousel"). Swipe or drag the
 * big photo, use the arrows or the keyboard, or pick a thumbnail; the active thumbnail widens and the strip
 * keeps it centred. It fills the width of whatever contains it.
 */
export interface CarouselItem {
  id: string;
  /** Full-size photo. */
  url: string;
  /** Small version for the strip (falls back to `url`). */
  thumb?: string;
  title: string;
}

const FULL_WIDTH_PX = 128;
const COLLAPSED_WIDTH_PX = 38;
const GAP_PX = 2;
const MARGIN_PX = 2;

function Thumbnails({ items, index, setIndex }: { items: CarouselItem[]; index: number; setIndex: (i: number) => void }) {
  const strip = useRef<HTMLDivElement>(null);

  // Scroll the strip so the active thumbnail sits in the middle.
  useEffect(() => {
    const el = strip.current;
    if (!el) return;
    const before = index * (COLLAPSED_WIDTH_PX + GAP_PX) + MARGIN_PX;
    el.scrollTo({ left: before - (el.offsetWidth / 2 - FULL_WIDTH_PX / 2), behavior: "smooth" });
  }, [index]);

  return (
    <div ref={strip} className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="mx-auto flex h-20 w-fit gap-0.5 pb-2">
        {items.map((item, i) => (
          <motion.button
            key={item.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show photo ${i + 1}: ${item.title}`}
            aria-current={i === index}
            initial={false}
            animate={
              i === index
                ? { width: FULL_WIDTH_PX, marginLeft: MARGIN_PX, marginRight: MARGIN_PX }
                : { width: COLLAPSED_WIDTH_PX, marginLeft: 0, marginRight: 0 }
            }
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative h-full shrink-0 overflow-hidden rounded outline-none focus-visible:ring-2 focus-visible:ring-ink/50"
          >
            <img
              src={item.thumb ?? item.url}
              alt=""
              loading="lazy"
              draggable={false}
              className="pointer-events-none h-full w-full select-none bg-ink/[0.06] object-cover"
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export function ThumbnailCarousel({
  items,
  className = "",
  slideClassName = "h-[52dvh] md:h-[72dvh]",
  index: controlledIndex,
  onIndexChange,
}: {
  items: CarouselItem[];
  className?: string;
  /** Height classes of the big photo frame (defaults to a share of the screen height). */
  slideClassName?: string;
  /** Show this photo (controlled). Leave out to let the carousel keep track itself. */
  index?: number;
  /** Called whenever the shown photo changes (arrows, drag, thumbnails, keyboard). */
  onIndexChange?: (index: number) => void;
}) {
  const reduce = useReducedMotion();
  const [inner, setInner] = useState(0);
  const index = controlledIndex ?? inner;
  const setIndex = (i: number) => {
    setInner(i);
    onIndexChange?.(i);
  };
  const [dragging, setDragging] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const last = items.length - 1;

  // Slide to the current photo (spring), unless the user is mid-drag.
  useEffect(() => {
    if (dragging || !box.current) return;
    const target = -index * (box.current.offsetWidth || 1);
    if (reduce) x.set(target);
    else animate(x, target, { type: "spring", stiffness: 300, damping: 30 });
  }, [index, dragging, reduce, x]);

  // Keep the slide aligned when the container is resized.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => x.set(-index * (el.offsetWidth || 1)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [index, x]);

  const go = (i: number) => setIndex(Math.max(0, Math.min(last, i)));

  const arrow =
    "absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-paper text-ink shadow-lg outline-none transition-transform focus-visible:ring-2 focus-visible:ring-ink/50 enabled:hover:scale-110 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div
        ref={box}
        role="group"
        aria-roledescription="carousel"
        aria-label="Trip photos"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") go(index - 1);
          if (e.key === "ArrowRight") go(index + 1);
        }}
        className="relative overflow-hidden rounded-2xl bg-ink/[0.06] outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
      >
        <motion.div
          className="flex cursor-grab active:cursor-grabbing"
          drag="x"
          dragElastic={0.2}
          dragMomentum={false}
          onDragStart={() => setDragging(true)}
          onDragEnd={(_, info) => {
            setDragging(false);
            const width = box.current?.offsetWidth || 1;
            let next = index;
            if (Math.abs(info.velocity.x) > 500) next = info.velocity.x > 0 ? index - 1 : index + 1;
            else if (Math.abs(info.offset.x) > width * 0.3) next = info.offset.x > 0 ? index - 1 : index + 1;
            go(next);
          }}
          style={{ x }}
        >
          {items.map((item, i) => (
            <div key={item.id} className={`relative w-full shrink-0 overflow-hidden ${slideClassName}`}>
              {/* A blurred copy fills the frame, so the whole photo can be shown (nothing cropped) without empty sides. */}
              <img
                src={item.thumb ?? item.url}
                alt=""
                aria-hidden
                draggable={false}
                className="pointer-events-none absolute inset-0 h-full w-full scale-110 select-none object-cover opacity-70 blur-2xl"
              />
              <img
                src={item.url}
                alt={item.title}
                loading={i < 2 ? "eager" : "lazy"}
                draggable={false}
                className="pointer-events-none relative h-full w-full select-none object-contain"
              />
            </div>
          ))}
        </motion.div>

        <button type="button" aria-label="Previous photo" disabled={index === 0} onClick={() => go(index - 1)} className={`${arrow} left-4`}>
          <ChevronLeft size={22} aria-hidden />
        </button>
        <button type="button" aria-label="Next photo" disabled={index === last} onClick={() => go(index + 1)} className={`${arrow} right-4`}>
          <ChevronRight size={22} aria-hidden />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white tabular-nums" aria-live="polite">
          {index + 1} / {items.length}
        </div>
      </div>

      <Thumbnails items={items} index={index} setIndex={go} />
    </div>
  );
}
