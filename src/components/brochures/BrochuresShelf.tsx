import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { brochureIn, brochuresIn, type Brochure } from "@/data/brochures";
import { Navbar } from "@/components/Navbar";
import { LANGUAGES, type Lang } from "@/i18n/languages";
import { fadeUp } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { READER_STRINGS } from "./reader/strings";
import { Cover, DownloadPill, LanguageChips, ReadLink, ReadPill, metaLine, useBrochureLang } from "./shared";
import type { BrochureStrings } from "./strings";

function ShelfCard({ brochure, lang, t, offset }: { brochure: Brochure; lang: Lang; t: BrochureStrings; offset: boolean }) {
  const { info } = brochureIn(brochure, lang);
  return (
    <motion.article {...fadeUp} className={cn("group", offset && "md:translate-y-14")}>
      <ReadLink
        brochure={brochure}
        aria-label={`${READER_STRINGS[lang].read}: ${info.title}`}
        className="relative block rounded-[6px] outline-none ring-1 ring-white/10 transition duration-500 ease-out [box-shadow:0_30px_60px_-30px_rgba(0,0,0,0.9)] focus-visible:ring-2 focus-visible:ring-white group-hover:-translate-y-2 group-hover:ring-white/30"
      >
        <Cover brochure={brochure} lang={lang} className="rounded-[6px]" />
        <span
          aria-hidden
          className="absolute bottom-3 right-3 flex size-11 items-center justify-center rounded-full bg-white text-ink-deep shadow-lg transition-transform duration-300 group-hover:scale-110"
        >
          <BookOpen size={18} />
        </span>
      </ReadLink>
      <div className="mt-4 pr-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/45">{info.kicker}</p>
        <h3 className="mt-1.5 text-[20px] font-medium leading-[1.15] tracking-[-0.03em] text-white md:text-[22px]">{info.title}</h3>
        <p className="mt-1 text-[13px] tabular-nums text-white/50">{metaLine(t, info.pages, info.mb)}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <ReadPill brochure={brochure} lang={lang} tone="dark" />
          <DownloadPill brochure={brochure} lang={lang} t={t} tone="dark" />
        </div>
      </div>
    </motion.article>
  );
}

function Group({ title, lead, items, lang, t }: { title: string; lead: string; items: Brochure[]; lang: Lang; t: BrochureStrings }) {
  return (
    <section>
      <div className="mb-8 flex flex-col gap-2 border-t border-white/15 pt-6 md:flex-row md:items-baseline md:justify-between md:gap-10">
        <h2 className="text-[22px] font-medium tracking-[-0.03em] text-white md:text-[26px]">{title}</h2>
        <p className="max-w-[24rem] text-[14px] leading-[1.55] text-white/55">{lead}</p>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 md:gap-y-16">
        {items.map((b, i) => (
          <ShelfCard key={b.slug} brochure={b} lang={lang} t={t} offset={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}

/** Dark page: the headline and a pinned language list on the left, the covers on a shelf on the right. */
export function BrochuresShelf() {
  const [lang, setLang, t] = useBrochureLang();
  return (
    <div className="bg-paper px-[4px] pt-[4px]">
    <div className="nav-framed relative rounded-t-lg bg-ink-deep text-white">
      <Navbar />
      <section className="px-4 pb-28 pt-32 md:px-10 md:pt-40">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-14 lg:grid-cols-12 lg:gap-16">
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow mb-5 text-[13px] font-medium uppercase tracking-[0.18em] text-white/60">{t.eyebrow}</p>
              <h1 className="text-[40px] font-semibold leading-[1.02] tracking-[-0.04em] md:text-[60px] md:font-light">
                <span className="block">{t.title[0]}</span>
                <span className="block text-white/45">{t.title[1]}</span>
              </h1>
              <p className="mt-6 max-w-[26rem] text-[15.5px] leading-[1.65] text-white/70">{t.intro}</p>

              <p className="mb-3 mt-10 hidden text-[11px] font-medium uppercase tracking-[0.14em] text-white/45 lg:block">{t.language}</p>
              <div role="radiogroup" aria-label={t.language} className="hidden border-b border-white/15 lg:block">
                {LANGUAGES.map((l, i) => {
                  const on = l.code === lang;
                  return (
                    <button
                      key={l.code}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      lang={l.htmlLang}
                      onClick={() => setLang(l.code)}
                      className={cn(
                        "group/lang flex w-full items-center gap-4 border-t border-white/15 py-3 text-left outline-none transition-colors focus-visible:bg-white/5",
                        on ? "text-white" : "text-white/45 hover:text-white/80",
                      )}
                    >
                      <span className="w-6 text-[12px] tabular-nums text-white/40">{String(i + 1).padStart(2, "0")}</span>
                      <span className="flex-1 text-[22px] font-light tracking-[-0.02em]">{l.native}</span>
                      <span aria-hidden className={cn("size-2 rounded-full bg-brand transition-opacity", on ? "opacity-100" : "opacity-0")} />
                    </button>
                  );
                })}
              </div>
              <p className="mt-8 hidden max-w-[26rem] text-[12.5px] leading-[1.6] text-white/40 lg:block">{t.note}</p>
            </div>
          </aside>

          {/* Phones and tablets: the Editorial language pill, sticky while the covers scroll */}
          <div className="sticky top-3 z-30 -mb-6 flex justify-center lg:hidden">
            <div className="max-w-full overflow-x-auto rounded-full border border-white/15 bg-ink-deep/80 p-1.5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.8)] backdrop-blur-md [scrollbar-width:none]">
              <LanguageChips value={lang} onChange={setLang} tone="dark" className="flex-nowrap" />
            </div>
          </div>

          <div className="flex flex-col gap-20 lg:col-span-8">
            <Group title={t.regional} lead={t.regionalLead} items={brochuresIn("region")} lang={lang} t={t} />
            <Group title={t.theme} lead={t.themeLead} items={brochuresIn("theme")} lang={lang} t={t} />
            <p className="max-w-[26rem] text-[12.5px] leading-[1.6] text-white/40 lg:hidden">{t.note}</p>
          </div>
        </div>
      </section>
    </div>
    </div>
  );
}
