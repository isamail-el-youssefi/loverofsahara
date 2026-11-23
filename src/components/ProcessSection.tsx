import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { fadeUp } from "@/lib/animations";
import { OriginButton } from "@/components/ui/origin-button";
import { useLanguage } from "@/i18n/LanguageProvider";

export function ProcessSection() {
  const p = useLanguage().site.process;
  const steps = p.steps.map((s, i) => ({ n: String(i + 1).padStart(2, "0"), t: s.t, d: s.d }));
  return (
    <section
      id="process"
      data-st-01="parallax"
      data-st-y="250"
      data-st-opacity="0.15"
      className="grid grid-cols-1 items-start gap-8 px-4 py-[var(--section-y)] md:px-10 lg:grid-cols-10 lg:gap-32 bg-paper"
    >
      <motion.div {...fadeUp} className="lg:col-span-5 pr-10">
        <div className="text-[15px] text-neutral-600 font-medium">
          {p.eyebrow}
        </div>
        <h2
          data-reveal-01="words"
          data-scroll
          className="mt-4 text-[32px] md:text-[48px] font-medium tracking-[-0.06em] leading-[1.09] text-ink"
        >
          {p.h2a}{" "}
          <span className="font-normal text-neutral-500">{p.h2b}</span>
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
            className="rounded-[10px] border border-neutral-200 bg-paper p-6 md:p-8 border-neutral-100 border-2 transition hover:shadow-sm"
          >
            <div className="flex items-start gap-4">
              <span className="text-2xl font-medium text-neutral-500 pr-10 pt-2">{s.n}</span>
              <div className="flex flex-col gap-3 max-w-lg">
                <h3 className="text-[18px] md:text-[26px] font-medium tracking-tight text-ink">{s.t}</h3>
                <p className="text-base font-medium leading-tight text-neutral-500">{s.d}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}