import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { PdfCanvas } from "./PdfCanvas";
import { renderPage } from "./pdf";

interface Props {
  doc: PDFDocumentProxy | null;
  id: string;
  total: number;
  cover: string;
  pageW: number;
  pageH: number;
  /** One page at a time (phones) instead of a two-page spread. */
  single: boolean;
  /** Controlled position: a spread index (desktop) or a zero-based page (single). */
  index: number;
  onIndex: (i: number) => void;
}

/** How many positions the book has. Spread 0 is the lone front cover. */
export const positions = (total: number, single: boolean) => (single ? total : Math.floor(total / 2) + 1);
/** The page number (1-based) the counter should show. */
export const pageAt = (i: number, total: number, single: boolean) => (single ? i + 1 : Math.min(i === 0 ? 1 : 2 * i, total));
/** Inverse of `pageAt`: the position that shows page `p`. */
export const indexOfPage = (p: number, single: boolean) => (single ? p - 1 : Math.floor(p / 2));

const left = (i: number, total: number) => (i > 0 && 2 * i <= total ? 2 * i : null);
const right = (i: number, total: number) => (2 * i + 1 <= total ? 2 * i + 1 : null);

/** A book you can open: pages turn in 3D (desktop spread) or slide (single page), by click, drag or keys. */
export function FlipBook({ doc, id, total, cover, pageW, pageH, single, index, onIndex }: Props) {
  const reduce = useReducedMotion();
  const last = positions(total, single) - 1;
  const [turn, setTurn] = useState<{ from: number; to: number } | null>(null);
  const [dir, setDir] = useState(1);
  const angle = useMotionValue(0);
  const busy = useRef(false);

  const go = useCallback(
    (to: number) => {
      if (busy.current || to < 0 || to > last || to === index) return;
      setDir(to > index ? 1 : -1);
      if (single || reduce || Math.abs(to - index) !== 1) {
        onIndex(to);
        return;
      }
      busy.current = true;
      const fwd = to > index;
      angle.set(fwd ? 0 : -180);
      setTurn({ from: index, to });
      animate(angle, fwd ? -180 : 0, { duration: 0.95, ease: [0.45, 0.05, 0.2, 1] }).then(() => {
        onIndex(to);
        setTurn(null);
        busy.current = false;
      });
    },
    [angle, index, last, onIndex, reduce, single],
  );

  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // Warm up the pages that are about to be turned to
  useEffect(() => {
    if (!doc) return;
    const wanted = single ? [index + 2, index + 3] : [left(index + 1, total), right(index + 1, total), left(index + 2, total)];
    for (const p of wanted) if (p && p <= total) renderPage(doc, id, p, pageW).catch(() => {});
  }, [doc, id, index, pageW, single, total]);

  const face = (p: number | null) =>
    p ? <PdfCanvas doc={doc} id={id} page={p} width={pageW} placeholder={p === 1 ? cover : undefined} /> : <div className="h-full w-full bg-[#e9e2d4]" />;

  const onPanEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x < -50) next();
    else if (info.offset.x > 50) prev();
  };

  /* ---------- single page (phones) ---------- */
  if (single) {
    return (
      <motion.div className="relative touch-pan-y select-none" style={{ width: pageW, height: pageH }} onPanEnd={onPanEnd}>
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={index}
            initial={{ x: reduce ? 0 : dir * 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: reduce ? 0 : dir * -60, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 overflow-hidden rounded-[3px] shadow-[0_30px_70px_-25px_rgba(0,0,0,0.9)]"
          >
            {face(index + 1)}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    );
  }

  /* ---------- two-page spread (desktop) ---------- */
  const shown = turn ? turn.to : index;
  const fwd = turn ? turn.to > turn.from : true;
  const j = turn ? Math.min(turn.from, turn.to) : 0; // the leaf is the sheet between spread j and j+1
  const staticLeft = turn ? left(fwd ? turn.from : turn.to, total) : left(index, total);
  const staticRight = turn ? right(fwd ? turn.to : turn.from, total) : right(index, total);
  // Centre the book while it is closed on the front or the back cover
  const shift = left(shown, total) === null ? -pageW / 2 : right(shown, total) === null ? pageW / 2 : 0;

  return (
    <motion.div
      className="relative select-none"
      style={{ width: pageW * 2, height: pageH, perspective: 2600 }}
      animate={{ x: shift }}
      transition={{ duration: 0.9, ease: [0.45, 0.05, 0.2, 1] }}
      onPanEnd={onPanEnd}
    >
      <button
        type="button"
        aria-label="Previous page"
        tabIndex={-1}
        onClick={prev}
        disabled={!staticLeft}
        className="absolute left-0 top-0 block overflow-hidden rounded-l-[3px] shadow-[0_30px_70px_-25px_rgba(0,0,0,0.9)] disabled:pointer-events-none disabled:opacity-0"
        style={{ width: pageW, height: pageH, cursor: "w-resize" }}
      >
        {face(staticLeft)}
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-l from-black/25 via-transparent to-transparent" />
      </button>
      <button
        type="button"
        aria-label="Next page"
        tabIndex={-1}
        onClick={next}
        disabled={!staticRight}
        className="absolute right-0 top-0 block overflow-hidden rounded-r-[3px] shadow-[0_30px_70px_-25px_rgba(0,0,0,0.9)] disabled:pointer-events-none disabled:opacity-0"
        style={{ width: pageW, height: pageH, cursor: "e-resize" }}
      >
        {face(staticRight)}
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-transparent" />
      </button>

      {turn && <Leaf angle={angle} pageW={pageW} pageH={pageH} front={face(right(j, total))} back={face(left(j + 1, total))} />}
    </motion.div>
  );
}

/** The sheet being turned. Hinged on the spine; its two faces darken as it passes the vertical. */
function Leaf({ angle, pageW, pageH, front, back }: { angle: MotionValue<number>; pageW: number; pageH: number; front: React.ReactNode; back: React.ReactNode }) {
  const frontShade = useTransform(angle, [-90, 0], [0.5, 0]);
  const backShade = useTransform(angle, [-180, -90], [0, 0.5]);
  return (
    <motion.div
      className="pointer-events-none absolute top-0"
      style={{ left: pageW, width: pageW, height: pageH, rotateY: angle, transformOrigin: "left center", transformStyle: "preserve-3d" }}
    >
      <div className="absolute inset-0 overflow-hidden rounded-r-[3px]" style={{ backfaceVisibility: "hidden" }}>
        {front}
        <motion.span className="absolute inset-0 bg-black" style={{ opacity: frontShade }} />
      </div>
      <div className="absolute inset-0 overflow-hidden rounded-l-[3px]" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
        {back}
        <motion.span className="absolute inset-0 bg-black" style={{ opacity: backShade }} />
      </div>
    </motion.div>
  );
}
