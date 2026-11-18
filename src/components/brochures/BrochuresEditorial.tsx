import { motion, useReducedMotion } from "framer-motion";
import { GALLERY_IMAGES } from "@/data/siteImages";
import { brochureIn, brochuresIn, type Brochure } from "@/data/brochures";
import { Navbar } from "@/components/Navbar";
import { Band, Eyebrow, SectionTitle } from "@/components/trip/parts";
import { fadeUp } from "@/lib/animations";
import type { Lang } from "@/i18n/languages";
import { READER_STRINGS } from "./reader/strings";
import { ReadLink, ReadPill, Cover, DownloadPill, LanguageChips, PdfLink, metaLine, useBrochureLang } from "./shared";
import type { BrochureStrings } from "./strings";

function Card({ brochure, lang, t, index }: { brochure: Brochure; lang: Lang; t: BrochureStrings; index: number }) {
  const { info } = brochureIn(brochure, lang);
  return (
    <motion.article
      {...fadeUp}
      transition={{ ...fadeUp.transition, delay: (index % 5) * 0.06 }}
      className="group flex flex-col"
    >
      <ReadLink
        brochure={brochure}
        aria-label={`${READER_STRINGS[lang].read}: ${info.title}`}
        className="relative block overflow-hidden rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.08),0_12px_28px_-16px_rgba(0,0,0,0.35)] outline-none transition duration-500 ease-out focus-visible:ring-2 focus-visible:ring-ink group-hover:-translate-y-1.5"
      >
        <Cover brochure={brochure} lang={lang} />
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 flex items-end bg-gradient-to-t from-black/70 via-black/25 to-transparent p-3 pt-14 text-[13px] font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          {READER_STRINGS[lang].read} →
        </span>
      </ReadLink>
      <div className="mt-4 flex flex-1 flex-col">
        <Eyebrow>{info.kicker}</Eyebrow>
        <h3 className="mt-1.5 text-[19px] font-semibold leading-[1.15] tracking-[-0.03em] text-ink md:text-[21px]">{info.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-[14px] leading-[1.45] text-ink/60">{info.subtitle}</p>
        <p className="mt-3 text-[13px] tabular-nums text-neutral-500">{metaLine(t, info.pages, info.mb)}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <ReadPill brochure={brochure} lang={lang} />
          <DownloadPill brochure={brochure} lang={lang} t={t} />
        </div>
      </div>
    </motion.article>
  );
}

/** Trip / contact page language: framed hero, a floating language bar, covers in a paper grid. */
export function BrochuresEditorial() {
  const reduce = useReducedMotion();
  const [lang, setLang, t] = useBrochureLang();
  const regional = brochuresIn("region");
  const thematic = brochuresIn("theme");
  return (
    <div className="trip-page relative">
      <section data-hero-section className="h-[78vh] min-h-[520px] bg-paper p-[4px]">
        <div className="relative flex h-full flex-col items-start justify-end overflow-hidden rounded-lg bg-ink-deep p-6 pb-12 text-left md:p-12 md:pb-16">
          <img src={GALLERY_IMAGES.dunes} alt="" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-[50%_60%]" />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/60 via-black/40 to-transparent" />
          <Navbar />
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex flex-col items-start text-left text-white"
          >
            <p className="eyebrow mb-5 text-[13px] font-medium uppercase tracking-[0.18em] text-white/80">{t.eyebrow}</p>
            <h1 className="text-[min(8.5vw,40px)] font-semibold leading-[1.02] md:text-[min(6vw,84px)] md:font-light!">
              <span className="block">{t.title[0]}</span>
              <span className="block text-white/60">{t.title[1]}</span>
            </h1>
            <p className="mt-6 max-w-[34rem] text-[15.5px] leading-[1.6] text-white/80 md:text-[17px]">{t.intro}</p>
          </motion.div>
        </div>
      </section>

      {/* Language bar: sticks under the top edge while the covers scroll */}
      <div className="sticky top-3 z-30 flex justify-center px-3 pt-6">
        <div className="max-w-full overflow-x-auto rounded-full border border-ink/10 bg-paper/85 p-1.5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.25)] backdrop-blur-md [scrollbar-width:none]">
          <LanguageChips value={lang} onChange={setLang} className="flex-nowrap" />
        </div>
      </div>

      <Band id="regional" tone="paper" parallax={false} className="pt-10 md:pt-14">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <SectionTitle eyebrow="01">{t.regional}</SectionTitle>
          <p className="max-w-[26rem] text-[15.5px] leading-[1.6] text-ink/70">{t.regionalLead}</p>
        </div>
        <div className="grid grid-cols-2 gap-x-[6px] gap-y-12 md:grid-cols-3 lg:grid-cols-5">
          {regional.map((b, i) => (
            <Card key={b.slug} brochure={b} lang={lang} t={t} index={i} />
          ))}
        </div>
      </Band>

      <Band id="thematic" tone="off" parallax={false}>
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <SectionTitle eyebrow="02">{t.theme}</SectionTitle>
          <p className="max-w-[26rem] text-[15.5px] leading-[1.6] text-ink/70">{t.themeLead}</p>
        </div>
        <div className="grid grid-cols-2 gap-x-[6px] gap-y-12 md:grid-cols-4">
          {thematic.map((b, i) => (
            <Card key={b.slug} brochure={b} lang={lang} t={t} index={i} />
          ))}
        </div>
      </Band>

      <Band id="note" tone="paper" parallax={false} className="pb-20 pt-10 md:pb-24 md:pt-14">
        <p className="max-w-[40rem] text-[13.5px] leading-[1.65] text-neutral-500">{t.note}</p>
      </Band>
    </div>
  );
}
