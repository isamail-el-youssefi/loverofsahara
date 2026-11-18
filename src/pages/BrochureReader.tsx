import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, BookOpen, ChevronLeft, ChevronRight, Maximize2, Rows3, X } from "lucide-react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { BROCHURES, brochureCover, brochureIn, brochurePdf } from "@/data/brochures";
import { BROCHURES_PATH } from "@/lib/routes";
import { usePageSeo } from "@/lib/seo";
import { brochureReaderSeo } from "@/lib/seoData";
import { cn } from "@/lib/utils";
import { LanguageChips, PdfLink, useBrochureLang } from "@/components/brochures/shared";
import { FlipBook, indexOfPage, pageAt, positions } from "@/components/brochures/reader/FlipBook";
import { ScrollReader } from "@/components/brochures/reader/ScrollReader";
import { PAGE_RATIO, openPdf } from "@/components/brochures/reader/pdf";
import { READER_STRINGS } from "@/components/brochures/reader/strings";

type Mode = "flip" | "scroll";
const MODE_KEY = "los-reader-mode";
const readMode = (): Mode => {
  try {
    return localStorage.getItem(MODE_KEY) === "scroll" ? "scroll" : "flip";
  } catch {
    return "flip";
  }
};

const pill =
  "inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-[14px] font-medium tracking-[-0.01em] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white";

/** Reads one brochure inside the site: an openable book, or an immersive scroll. */
export function BrochureReader({ slug }: { slug: string }) {
  const brochure = BROCHURES.find((b) => b.slug === slug);
  usePageSeo(brochureReaderSeo(slug));
  // Unknown slug: send the visitor to the list
  useEffect(() => {
    if (!brochure) {
      window.history.replaceState(null, "", BROCHURES_PATH);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  }, [brochure]);
  if (!brochure) return null;
  return <Reader slug={slug} />;
}

function Reader({ slug }: { slug: string }) {
  const brochure = BROCHURES.find((b) => b.slug === slug)!;
  const [langWanted, setLang, bt] = useBrochureLang();
  const { lang, info } = brochureIn(brochure, langWanted);
  const t = READER_STRINGS[lang];
  const url = brochurePdf(slug, lang);
  const id = `${slug}-${lang}`;
  const cover = brochureCover(slug, lang);

  const [mode, setModeState] = useState<Mode>(readMode);
  const setMode = (m: Mode) => {
    setModeState(m);
    try {
      localStorage.setItem(MODE_KEY, m);
    } catch {
      /* private mode */
    }
  };

  // --- the PDF ---
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
  const [failed, setFailed] = useState(false);
  const total = doc?.numPages ?? info.pages;
  useEffect(() => {
    let live = true;
    let opened: PDFDocumentProxy | null = null;
    setDoc(null);
    setFailed(false);
    openPdf(url)
      .then((d) => {
        opened = d;
        if (live) setDoc(d);
        else void d.loadingTask.destroy();
      })
      .catch((e) => {
        console.error("[reader] open failed", e);
        if (live) setFailed(true);
      });
    return () => {
      live = false;
      void opened?.loadingTask.destroy();
    };
  }, [url]);

  // --- size of the stage ---
  const stage = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => e && setBox({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, [mode]);
  const single = box.w < 880;
  const pageH = Math.max(0, Math.min(box.h - 16, (single ? box.w - 24 : (box.w - 64) / 2) / PAGE_RATIO));
  const pageW = Math.round(pageH * PAGE_RATIO);
  const scrollW = Math.round(Math.min(760, Math.max(240, box.w - 32)));

  // --- position ---
  const [page, setPage] = useState(1); // 1-based page the reader is on (counter)
  const [index, setIndex] = useState(0);
  useEffect(() => {
    // Keep the position when the layout changes between spread and single page; reset on a new brochure
    setIndex(indexOfPage(page, single));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [single, mode]);
  const onIndex = useCallback(
    (i: number) => {
      setIndex(i);
      setPage(pageAt(i, total, single));
    },
    [single, total],
  );
  useEffect(() => {
    setPage(1);
    setIndex(0);
  }, [id]);
  const lastIndex = positions(total, single) - 1;
  const jump = (p: number) => {
    setPage(p);
    setIndex(indexOfPage(p, single));
  };

  // The footer arrows ask the book to turn (it listens for the arrow keys), so they animate like a key press
  const key = (k: string) => window.dispatchEvent(new KeyboardEvent("keydown", { key: k }));
  const root = useRef<HTMLDivElement>(null);
  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void root.current?.requestFullscreen?.().catch(() => {});
  };

  const btnPrimary = useMemo(() => cn(pill, "border-white/25 text-white hover:border-white hover:bg-white hover:text-ink-deep"), []);

  return (
    <div ref={root} className="flex h-[100dvh] flex-col bg-ink-deep text-white">
      {/* top bar */}
      <header className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 md:px-8">
        <a href={BROCHURES_PATH} aria-label={t.close} className={cn(pill, "w-9 justify-center border-white/25 px-0 hover:border-white hover:bg-white hover:text-ink-deep")}>
          <X size={16} aria-hidden />
        </a>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-medium uppercase tracking-[0.14em] text-white/45">{info.kicker}</p>
          <h1 className="truncate text-[16px] font-medium leading-tight tracking-[-0.02em] md:text-[18px]">{info.title}</h1>
        </div>
        <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Mode">
          {(["flip", "scroll"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={mode === m}
              onClick={() => setMode(m)}
              className={cn(pill, mode === m ? "border-white bg-white text-ink-deep" : "border-white/25 text-white/75 hover:border-white/60 hover:text-white")}
            >
              {m === "flip" ? <BookOpen size={15} aria-hidden /> : <Rows3 size={15} aria-hidden />}
              <span className="hidden sm:inline">{m === "flip" ? t.flip : t.scroll}</span>
            </button>
          ))}
          <button type="button" onClick={toggleFullscreen} aria-label={t.fullscreen} className={cn(btnPrimary, "hidden w-9 justify-center px-0 sm:inline-flex")}>
            <Maximize2 size={15} aria-hidden />
          </button>
          <PdfLink brochure={brochure} lang={lang} aria-label={bt.download} className={cn(btnPrimary)}>
            <ArrowDown size={15} aria-hidden />
            <span className="hidden md:inline">{bt.download}</span>
          </PdfLink>
        </div>
        <LanguageChips value={lang} onChange={setLang} tone="dark" className="w-full md:w-auto" />
      </header>

      {/* stage */}
      <div ref={stage} className="relative min-h-0 flex-1">
        {failed ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="max-w-sm text-[15px] text-white/70">{t.error}</p>
            <PdfLink brochure={brochure} lang={lang} className={btnPrimary}>
              <ArrowDown size={15} aria-hidden />
              {bt.download}
            </PdfLink>
          </div>
        ) : box.w === 0 ? null : mode === "flip" ? (
          <div className="flex h-full items-center justify-center overflow-hidden">
            <FlipBook
              key={`${id}-${single ? "s" : "d"}`}
              doc={doc}
              id={id}
              total={total}
              cover={cover}
              pageW={pageW}
              pageH={pageH}
              single={single}
              index={index}
              onIndex={onIndex}
            />
          </div>
        ) : (
          <ScrollReader key={id} doc={doc} id={id} total={total} cover={cover} width={scrollW} onPage={setPage} startPage={page} />
        )}
        {!doc && !failed && (
          <p className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-[12px] text-white/45" role="status">
            {t.loading}
          </p>
        )}
      </div>

      {/* bottom bar */}
      <footer className="flex items-center gap-3 px-4 py-3 md:px-8">
        {mode === "flip" && (
          <button type="button" onClick={() => key("ArrowLeft")} disabled={index <= 0} aria-label={t.prev} className={cn(pill, "w-9 justify-center border-white/25 px-0 hover:border-white hover:bg-white hover:text-ink-deep disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white")}>
            <ChevronLeft size={16} aria-hidden />
          </button>
        )}
        <input
          type="range"
          min={1}
          max={Math.max(total, 1)}
          value={page}
          onChange={(e) => jump(Number(e.target.value))}
          aria-label={t.page(page, total)}
          disabled={mode === "scroll"}
          className="h-1 min-w-0 flex-1 cursor-pointer accent-white disabled:opacity-40"
        />
        <p className="w-28 shrink-0 text-center text-[13px] tabular-nums text-white/60 md:w-36" aria-live="polite">
          {t.page(page, total)}
        </p>
        {mode === "flip" && (
          <button type="button" onClick={() => key("ArrowRight")} disabled={index >= lastIndex} aria-label={t.next} className={cn(pill, "w-9 justify-center border-white/25 px-0 hover:border-white hover:bg-white hover:text-ink-deep disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white")}>
            <ChevronRight size={16} aria-hidden />
          </button>
        )}
      </footer>
      <p className="sr-only">{t.hint}</p>
    </div>
  );
}
