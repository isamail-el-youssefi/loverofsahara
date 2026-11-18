import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { PdfCanvas } from "./PdfCanvas";
import { PAGE_RATIO } from "./pdf";

/** Pages are drawn only when they come near the screen, so a 30-page guide opens as fast as a 10-page one. */
function ScrollPage({
  doc,
  id,
  page,
  width,
  cover,
  onVisible,
  scroller,
}: {
  doc: PDFDocumentProxy | null;
  id: string;
  page: number;
  width: number;
  cover: string;
  onVisible: (p: number) => void;
  scroller: React.RefObject<HTMLDivElement | null>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(page <= 2);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const root = scroller.current;
    const io = new IntersectionObserver(([e]) => e?.isIntersecting && setNear(true), { root, rootMargin: "100% 0px" });
    const mid = new IntersectionObserver(([e]) => e?.isIntersecting && onVisible(page), { root, rootMargin: "-48% 0px -48% 0px" });
    io.observe(el);
    mid.observe(el);
    return () => {
      io.disconnect();
      mid.disconnect();
    };
  }, [onVisible, page, scroller]);

  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : { opacity: 0, y: 48, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, root: scroller, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden rounded-[3px] shadow-[0_30px_70px_-25px_rgba(0,0,0,0.9)]"
      style={{ width, height: width / PAGE_RATIO }}
    >
      {near ? <PdfCanvas doc={doc} id={id} page={page} width={width} placeholder={page === 1 ? cover : undefined} /> : <div className="h-full w-full bg-[#f4efe6]" />}
    </motion.div>
  );
}

/** Immersive vertical reading: pages float up one after another, a thin rail shows progress. */
export function ScrollReader({
  doc,
  id,
  total,
  cover,
  width,
  onPage,
  startPage,
}: {
  doc: PDFDocumentProxy | null;
  id: string;
  total: number;
  cover: string;
  width: number;
  onPage: (p: number) => void;
  startPage: number;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: scroller });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });

  // Open at the page the visitor was on in the book
  useEffect(() => {
    const el = scroller.current?.querySelector<HTMLElement>(`[data-page="${startPage}"]`);
    if (el && startPage > 1) el.scrollIntoView({ block: "center" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative h-full w-full">
      {/* data-lenis-prevent: the site's smooth scroll must not take over this scroller */}
      <div ref={scroller} data-lenis-prevent className="h-full w-full overflow-y-auto overscroll-contain px-4 py-10">
        <div className="mx-auto flex flex-col items-center gap-10 pb-24">
          {Array.from({ length: total }, (_, i) => (
            <div key={`${id}-${i}`} data-page={i + 1}>
              <ScrollPage doc={doc} id={id} page={i + 1} width={width} cover={cover} onVisible={onPage} scroller={scroller} />
            </div>
          ))}
        </div>
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-y-10 right-4 hidden w-px bg-white/15 md:block">
        <motion.div className="h-full w-px origin-top bg-white" style={{ scaleY: progress }} />
      </div>
    </div>
  );
}
