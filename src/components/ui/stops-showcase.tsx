import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";

export interface ShowcaseStop {
  name: string;
  image?: string;
  /** When set, the whole row links here (a place page). Rows without it stay plain text. */
  href?: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Numbered stop list with a cursor-following photo preview (adapted from the 21st.dev "project showcase").
 * The preview is absolutely positioned inside the list (not `fixed`), so a transformed ancestor such as a
 * parallax section cannot misplace it, and it follows the cursor through a rAF loop that writes the
 * transform directly instead of re-rendering every frame.
 */
export function StopsShowcase({
  stops,
  active,
  onActive,
}: {
  stops: ShowcaseStop[];
  /** Stop indices highlighted on the map; also dims the other rows. */
  active: number[];
  onActive: (i: number | null) => void;
}) {
  // Long routes get tighter rows so the list stays about as tall as the map.
  const n = stops.length;
  const row = n >= 15 ? "py-1.5" : n >= 11 ? "py-2" : "py-3";
  const name = n >= 15 ? "text-[15px] md:text-[16px]" : n >= 11 ? "text-[16px] md:text-[17px]" : "text-[17px] md:text-[19px]";
  const [hovered, setHovered] = useState<number | null>(null);
  const box = useRef<HTMLOListElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);
  const placed = useRef(false);

  const stop = () => {
    if (raf.current !== null) cancelAnimationFrame(raf.current);
    raf.current = null;
  };

  const start = () => {
    if (raf.current !== null) return;
    const tick = () => {
      const c = current.current;
      const t = target.current;
      c.x += (t.x - c.x) * 0.15;
      c.y += (t.y - c.y) * 0.15;
      if (card.current) card.current.style.transform = `translate3d(${c.x + 20}px, ${c.y - 100}px, 0)`;
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };

  useEffect(() => stop, []);

  // A stop highlighted from outside the list (hovering its number on the map) shows its photo in the list:
  // the card settles beside that row instead of following a cursor.
  const rows = useRef<(HTMLLIElement | null)[]>([]);
  const fromMap = hovered === null && active.length === 1 ? (active[0] ?? null) : null;
  const shown = hovered ?? fromMap;
  useEffect(() => {
    if (hovered !== null) return;
    if (fromMap === null) {
      placed.current = false;
      stop();
      return;
    }
    const list = box.current?.getBoundingClientRect();
    const r = rows.current[fromMap]?.getBoundingClientRect();
    if (!list || !r) return;
    // Right-aligned in the list, vertically centred on the row (the card is drawn at y - 100, 180px tall).
    target.current = { x: Math.max(0, list.width - 320), y: r.top - list.top + r.height / 2 + 10 };
    if (!placed.current) {
      current.current = { ...target.current };
      placed.current = true;
      if (card.current) card.current.style.transform = `translate3d(${target.current.x + 20}px, ${target.current.y - 100}px, 0)`;
    }
    start();
  }, [fromMap, hovered]);

  const move = (e: React.MouseEvent) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    target.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    // First move after entering: jump to the cursor instead of flying in from the last position.
    if (!placed.current) {
      current.current = { ...target.current };
      placed.current = true;
    }
  };

  const enter = (i: number) => {
    setHovered(i);
    onActive(i);
    start();
  };

  const leave = () => {
    setHovered(null);
    onActive(null);
    placed.current = false;
    stop();
  };

  return (
    <ol ref={box} className="relative border-b border-white/10" onMouseMove={move} onMouseLeave={leave}>
      {/* Preview card. Hover-capable devices only; touch devices just get the list. */}
      <div
        ref={card}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-50 hidden overflow-hidden rounded-xl shadow-2xl [@media(hover:hover)]:block"
        style={{
          opacity: shown !== null ? 1 : 0,
          scale: shown !== null ? 1 : 0.8,
          transition: "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), scale 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div className="relative h-[180px] w-[280px] overflow-hidden rounded-xl bg-ink-deep">
          {stops.map((s, i) =>
            s.image ? (
              <img
                key={`${s.name}-${i}`}
                src={s.image}
                alt=""
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-out"
                style={{
                  opacity: shown === i ? 1 : 0,
                  scale: shown === i ? 1 : 1.1,
                  filter: shown === i ? "none" : "blur(10px)",
                }}
              />
            ) : null,
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
        </div>
      </div>

      {stops.map((s, i) => {
        const on = hovered === i || active.includes(i);
        const dim = active.length > 0 && !on;
        return (
          <li
            key={`${s.name}-${i}`}
            ref={(el) => {
              rows.current[i] = el;
            }}
            onMouseEnter={() => enter(i)}
            onFocus={() => enter(i)}
            onBlur={leave}
            tabIndex={s.href ? -1 : 0}
            className={`group relative ${s.href ? "cursor-pointer" : "cursor-default"} border-t border-white/10 outline-none transition-colors duration-300 ${
              dim ? "text-white/35" : "text-white"
            }`}
          >
            {/* Row highlight */}
            <span
              aria-hidden
              className={`absolute inset-0 -mx-4 rounded-lg bg-white/[0.06] transition-all duration-300 ease-out ${
                shown === i ? "scale-100 opacity-100" : "scale-95 opacity-0"
              }`}
            />
            <div className={`relative flex items-center gap-4 ${row}`}>
              <span className="w-7 shrink-0 text-[12px] tabular-nums text-white/50">{pad(i + 1)}</span>
              <span className={`inline-flex flex-1 items-center gap-2 leading-tight tracking-[-0.01em] ${name}`}>
                {s.href ? (
                  // Stretched link: the anchor's ::before covers the whole row, so the full row is the click target.
                  <a
                    href={s.href}
                    className="outline-none before:absolute before:inset-0 before:content-[''] focus-visible:underline"
                  >
                    {s.name}
                  </a>
                ) : (
                  <span>{s.name}</span>
                )}
                {s.href && (
                  <ArrowUpRight
                    aria-hidden
                    className={`h-4 w-4 text-white/70 transition-all duration-300 ease-out ${
                      shown === i ? "translate-x-0 translate-y-0 opacity-100" : "-translate-x-2 translate-y-2 opacity-0"
                    }`}
                  />
                )}
              </span>
              <span
                aria-hidden
                className={`h-1.5 w-1.5 shrink-0 rounded-full bg-brand transition-opacity duration-300 ${
                  on ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
