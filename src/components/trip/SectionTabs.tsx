import { useContext, useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useTripT } from "@/i18n/useTripT";
import { ScrollContainerContext } from "@/lib/scrollContainer";

/** Red Dot's pill easing: slow in, slow out. */
const PILL_EASE: [number, number, number, number] = [0.65, 0, 0.35, 1];

export interface TabItem {
  id: string;
  label: string;
}

/**
 * Floating section tabs (modelled on reddottours.com's page nav): a frosted pill fixed at the bottom
 * centre. It appears once the hero is behind you and the active tab follows the section in view.
 *
 * Same reveal as Red Dot: the capsule grows out of its centre (clip-path inset + half-translate),
 * then the labels fade in. Going away is the reverse: labels fade out, then the capsule collapses.
 */
export function SectionTabs({ items, showAfter }: { items: TabItem[]; /** Id of the section whose arrival reveals the pill (default: the first tab). Use when the first tab is the hero. */ showAfter?: string }) {
  const T = useTripT();
  const scrollRef = useContext(ScrollContainerContext);
  const [active, setActive] = useState(items[0]?.id ?? "");
  const [visible, setVisible] = useState(false);
  const track = useRef<HTMLDivElement>(null);

  // collapse: 1 = a point at the centre, 0 = full pill. labels: opacity of the tabs inside.
  const collapse = useMotionValue(1);
  const labels = useMotionValue(0);
  const clipPath = useTransform(collapse, (v) => `inset(0px ${v * 100}% 0px 0px round 9999px)`);
  const shift = useTransform(collapse, (v) => `${v * 50}%`);
  const labelVisibility = useTransform(labels, (v) => (v > 0.001 ? "visible" : "hidden"));

  // Drive the two tweens in sequence. Re-running stops the old ones, so a quick reversal continues
  // from wherever the values currently are.
  useEffect(() => {
    let cancelled = false;
    const running: { stop: () => void }[] = [];
    const run = async () => {
      if (visible) {
        const a = animate(collapse, 0, { duration: 0.4, ease: PILL_EASE });
        running.push(a);
        await a;
        if (cancelled) return;
        running.push(animate(labels, 1, { duration: 0.5, ease: "easeOut" }));
      } else {
        const a = animate(labels, 0, { duration: 0.4, ease: "easeInOut" });
        running.push(a);
        await a;
        if (cancelled) return;
        running.push(animate(collapse, 1, { duration: 0.4, ease: PILL_EASE }));
      }
    };
    void run();
    return () => {
      cancelled = true;
      running.forEach((r) => r.stop());
    };
  }, [visible, collapse, labels]);

  useEffect(() => {
    const root = scrollRef?.current;
    if (!root) return;

    const compute = () => {
      const probe = root.scrollTop + root.clientHeight * 0.35;
      const base = root.getBoundingClientRect().top - root.scrollTop;
      let current = items[0]?.id ?? "";
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top - base <= probe) current = it.id;
      }
      setActive(current);
      const first = document.getElementById(showAfter ?? items[0]?.id ?? "");
      const firstTop = first ? first.getBoundingClientRect().top - base : 0;
      setVisible(root.scrollTop + root.clientHeight * 0.6 > firstTop);
    };

    compute();
    root.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      root.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [scrollRef, items, showAfter]);

  // Keep the active tab visible when the pill scrolls horizontally (small screens).
  useEffect(() => {
    const btn = track.current?.querySelector<HTMLElement>(`[data-tab="${active}"]`);
    btn?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [active]);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.dispatchEvent(new CustomEvent("los-scroll-to", { detail: { el } }));
  };

  return (
    <nav
      aria-label={T.pageSections}
      className="pointer-events-none fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[60] flex justify-center px-[4vw] md:bottom-6"
    >
      <motion.div
        style={{ clipPath, x: shift }}
        className="pointer-events-auto max-w-[min(92vw,820px)] rounded-full bg-ink-deep/55 backdrop-blur-2xl"
      >
        <motion.div
          ref={track}
          style={{ opacity: labels, visibility: labelVisibility }}
          className="flex w-full items-center gap-1 overflow-x-auto p-1.5 max-md:p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
        {items.map((it) => {
          const on = it.id === active;
          return (
            <button
              key={it.id}
              type="button"
              data-tab={it.id}
              aria-current={on ? "true" : undefined}
              onClick={() => go(it.id)}
              className={`shrink-0 rounded-full px-5 py-3 text-[15px] font-medium max-md:px-4 max-md:py-2 max-md:text-[14px] transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${
                on ? "bg-paper text-ink" : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {it.label}
            </button>
          );
        })}
        </motion.div>
      </motion.div>
    </nav>
  );
}
