import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ArrowDown, BookOpen } from "lucide-react";
import { brochureIn, brochuresIn, type Brochure } from "@/data/brochures";
import { Navbar } from "@/components/Navbar";
import { LANGUAGES, type Lang } from "@/i18n/languages";
import { cn } from "@/lib/utils";
import { READER_STRINGS } from "./reader/strings";
import { Cover, LanguageChips, PdfLink, ReadLink, metaLine, useBrochureLang } from "./shared";
import type { BrochureStrings } from "./strings";

/** Short label for a language in the row buttons. */
const SHORT: Record<Lang, string> = { en: "EN", fr: "FR", de: "DE", es: "ES", it: "IT", zh: "中文" };

function Row({
  brochure,
  no,
  lang,
  t,
  onHover,
}: {
  brochure: Brochure;
  no: number;
  lang: Lang;
  t: BrochureStrings;
  onHover: (b: Brochure | null) => void;
}) {
  const { lang: shown, info } = brochureIn(brochure, lang);
  return (
    <li
      onMouseEnter={() => onHover(brochure)}
      onMouseLeave={() => onHover(null)}
      className="group grid grid-cols-[64px_1fr] items-center gap-x-5 gap-y-5 border-t border-ink/12 py-6 md:grid-cols-[40px_minmax(0,1.3fr)_minmax(0,0.7fr)_auto] md:gap-x-8 md:py-8"
    >
      {/* Phones: a small cover instead of the hover preview */}
      <div className="row-span-2 md:hidden">
        <Cover brochure={brochure} lang={lang} className="rounded-[4px]" />
      </div>
      <span className="hidden text-[13px] tabular-nums text-neutral-400 md:block">{String(no).padStart(2, "0")}</span>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-500">{info.kicker}</p>
        <h3 className="mt-1.5 text-[24px] font-light leading-[1.08] tracking-[-0.03em] text-ink transition-transform duration-500 md:text-[34px] md:group-hover:translate-x-2">
          {info.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[14.5px] leading-[1.5] text-ink/60">{info.subtitle}</p>
      </div>
      <p className="hidden text-[14px] leading-[1.6] text-neutral-500 md:block">
        {metaLine(t, info.pages, info.mb)}
        <br />
        <span className="text-ink/40">{t.free}</span>
      </p>
      <div className="col-start-2 flex flex-wrap items-center gap-1.5 md:col-start-auto md:justify-end">
        <ReadLink
          brochure={brochure}
          aria-label={`${READER_STRINGS[shown].read}: ${info.title}`}
          className="mr-1 inline-flex h-9 items-center gap-1.5 rounded-full border border-ink bg-ink px-3.5 text-[13px] font-medium text-paper outline-none transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-ink"
        >
          <BookOpen size={14} aria-hidden />
          {READER_STRINGS[shown].read}
        </ReadLink>
        {LANGUAGES.map((l) => {
          const has = Boolean(brochure.langs[l.code]);
          if (!has) return null;
          const on = l.code === shown;
          return (
            <PdfLink
              key={l.code}
              brochure={brochure}
              lang={l.code}
              aria-label={`${t.download}: ${info.title} (${l.native})`}
              className={cn(
                "inline-flex h-9 min-w-[2.6rem] items-center justify-center gap-1 rounded-full border px-3 text-[13px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ink",
                on ? "border-ink bg-ink text-paper" : "border-ink/20 text-ink/70 hover:border-ink hover:bg-ink hover:text-paper",
              )}
            >
              <span lang={l.htmlLang}>{SHORT[l.code]}</span>
              {on && <ArrowDown size={13} aria-hidden />}
            </PdfLink>
          );
        })}
      </div>
    </li>
  );
}

/** Paper page: a big ruled list, one row per brochure, a download button for each language. */
export function BrochuresIndex() {
  const reduce = useReducedMotion();
  const [lang, setLang, t] = useBrochureLang();
  const [hover, setHover] = useState<Brochure | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 28, mass: 0.6 });
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 28, mass: 0.6 });

  const onMove = (e: React.MouseEvent) => {
    x.set(e.clientX + 36);
    y.set(e.clientY - 150);
  };

  let n = 0;
  const groups = [
    { title: t.regional, lead: t.regionalLead, items: brochuresIn("region") },
    { title: t.theme, lead: t.themeLead, items: brochuresIn("theme") },
  ];

  return (
    <div className="relative">
      <Navbar theme="light" />
      <section className="px-4 pb-28 pt-36 md:px-10 md:pt-44">
        <div className="grid items-end gap-8 pb-14 lg:grid-cols-12 lg:gap-16 lg:pb-20">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-5 text-[13px] font-medium uppercase tracking-[0.18em] text-neutral-500">{t.eyebrow}</p>
            <h1 className="text-[40px] font-semibold leading-[1.02] tracking-[-0.045em] text-ink md:text-[72px] md:font-light">
              <span className="block">{t.title[0]}</span>
              <span className="block text-neutral-400">{t.title[1]}</span>
            </h1>
          </div>
          <div className="lg:col-span-5">
            <p className="max-w-[28rem] text-[15.5px] leading-[1.65] text-ink/70">{t.intro}</p>
            <LanguageChips value={lang} onChange={setLang} className="mt-6" />
          </div>
        </div>

        <div ref={listRef} onMouseMove={reduce ? undefined : onMove} className="flex flex-col gap-16">
          {groups.map((g) => (
            <div key={g.title}>
              <div className="mb-2 flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-ink">{g.title}</h2>
                <p className="text-[14px] text-neutral-500">{g.lead}</p>
              </div>
              <ul className="border-b border-ink/12">
                {g.items.map((b) => {
                  n += 1;
                  return <Row key={b.slug} brochure={b} no={n} lang={lang} t={t} onHover={setHover} />;
                })}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-14 max-w-[40rem] text-[13.5px] leading-[1.65] text-neutral-500">{t.note}</p>
      </section>

      {/* Cover that follows the pointer (desktop with a mouse only) */}
      {!reduce && (
        <div className="pointer-events-none fixed left-0 top-0 z-40 hidden md:block">
          <motion.div style={{ x, y }}>
            <AnimatePresence>
              {hover && (
                <motion.div
                  key={hover.slug}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="w-[210px] origin-left [box-shadow:0_30px_60px_-24px_rgba(0,0,0,0.5)]"
                >
                  <Cover brochure={hover} lang={lang} className="rounded-[6px]" eager />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </div>
  );
}
