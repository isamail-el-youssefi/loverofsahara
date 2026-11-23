import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Car, Compass, Mountain, type LucideIcon } from "lucide-react";
import { fadeUp } from "@/lib/animations";
import { OriginButton } from "@/components/ui/origin-button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/i18n/LanguageProvider";

/** Icons for the three points, in the same order as `site.process.steps` (phone). */
const STEP_ICONS: LucideIcon[] = [Compass, Car, Mountain];

type Step = { n: string; t: string; d: string };

const parallax = { "data-st-01": "parallax", "data-st-y": "250", "data-st-opacity": "0.15" } as const;

/** Two lines of text, with a 44px toggle to read the rest (phone only). */
function Clamp({ text, className = "" }: { text: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const { lang } = useLanguage();
  const more = lang === "fr" ? "Lire la suite" : lang === "es" ? "Leer más" : lang === "de" ? "Mehr lesen" : lang === "it" ? "Leggi di più" : lang === "zh" ? "展开" : "Read more";
  const less = lang === "fr" ? "Réduire" : lang === "es" ? "Reducir" : lang === "de" ? "Weniger" : lang === "it" ? "Riduci" : lang === "zh" ? "收起" : "Less";
  return (
    <div className={className}>
      <p className={`text-[15px] leading-[1.55] text-neutral-500 ${open ? "" : "line-clamp-2"}`}>{text}</p>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="-mb-2 inline-flex min-h-11 items-center text-[13px] font-medium text-ink underline underline-offset-4"
      >
        {open ? less : more}
      </button>
    </div>
  );
}

/** Phone: a short headline, then an open list with an icon, a number and two lines per point. */
function ProcessPhone({ steps }: { steps: Step[] }) {
  const p = useLanguage().site.process;
  return (
    <section id="process" {...parallax} className="bg-paper px-4 py-[var(--section-y)]">
      <motion.div {...fadeUp}>
        <div className="text-[15px] font-medium text-neutral-600">{p.eyebrow}</div>
        <h2
          data-reveal-01="words"
          data-scroll
          className="mt-4 text-[30px] font-medium leading-[1.1] tracking-[-0.05em] text-ink"
        >
          {p.phoneA} <span className="font-normal text-neutral-500">{p.phoneB}</span>
        </h2>
      </motion.div>

      <div className="mt-8 border-t border-ink/10">
        {steps.map((s, i) => {
          const Icon = STEP_ICONS[i] ?? Compass;
          return (
            <motion.div key={s.n} {...fadeUp} className="flex gap-4 border-b border-ink/10 py-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink/[0.06] text-ink">
                <Icon size={22} strokeWidth={1.5} aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-[18px] font-medium leading-[1.2] tracking-tight text-ink">{s.t}</h3>
                  <span className="text-[13px] tabular-nums text-neutral-400">{s.n}</span>
                </div>
                <Clamp text={s.d} className="mt-2" />
              </div>
            </motion.div>
          );
        })}
      </div>

      <OriginButton
        href="#contact"
        className="mt-8 h-12 w-full justify-center rounded-[10px] border-neutral-300 px-5 text-sm font-medium text-neutral-900"
      >
        {p.button} <ArrowUpRight size={16} />
      </OriginButton>
    </section>
  );
}

/** Desktop: the boxed cards with the full text. */
function ProcessDesktop({ steps }: { steps: Step[] }) {
  const p = useLanguage().site.process;
  return (
    <section
      id="process"
      {...parallax}
      className="grid grid-cols-1 items-start gap-8 bg-paper px-4 py-[var(--section-y)] md:px-10 lg:grid-cols-10 lg:gap-32"
    >
      <motion.div {...fadeUp} className="lg:col-span-5 md:pr-10">
        <div className="text-[15px] font-medium text-neutral-600">{p.eyebrow}</div>
        <h2
          data-reveal-01="words"
          data-scroll
          className="mt-4 text-[32px] font-medium leading-[1.09] tracking-[-0.06em] text-ink md:text-[48px]"
        >
          {p.h2a} <span className="font-normal text-neutral-500">{p.h2b}</span>
        </h2>
        <OriginButton
          href="#contact"
          className="mt-6 h-10 rounded-[10px] border-neutral-300 px-5 text-sm font-medium text-neutral-900"
        >
          {p.button} <ArrowUpRight size={16} />
        </OriginButton>
      </motion.div>

      <div className="flex flex-col gap-2 lg:col-span-5">
        {steps.map((s, i) => (
          <motion.div
            key={s.n}
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: i * 0.08 }}
            className="rounded-[10px] border border-neutral-200 bg-paper p-5 transition hover:shadow-sm md:border-2 md:border-neutral-100 md:p-8"
          >
            <div className="flex items-start gap-4">
              <span className="pr-3 pt-1 text-xl font-medium text-neutral-500 md:pr-10 md:pt-2 md:text-2xl">{s.n}</span>
              <div className="flex max-w-lg flex-col gap-3">
                <h3 className="text-[18px] font-medium tracking-tight text-ink md:text-[26px]">{s.t}</h3>
                <p className="text-base font-medium leading-tight text-neutral-500">{s.d}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function ProcessSection() {
  const p = useLanguage().site.process;
  const isMobile = useIsMobile();
  const steps: Step[] = p.steps.map((s, i) => ({ n: String(i + 1).padStart(2, "0"), t: s.t, d: s.d }));
  return isMobile ? <ProcessPhone steps={steps} /> : <ProcessDesktop steps={steps} />;
}
