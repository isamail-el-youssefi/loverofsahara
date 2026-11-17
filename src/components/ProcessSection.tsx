import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { fadeUp } from "@/lib/animations";
import { OriginButton } from "@/components/ui/origin-button";

const steps = [
  {
    n: "01",
    t: "Native Sahrawi & Berber Guides",
    d: "Born and raised in the Drâa Valley and the desert oases, our guides hold ancestral knowledge of Saharan tracks, star navigation, and local Berber traditions.",
  },
  {
    n: "02",
    t: "Private 4x4 Fleet & Tailored Pacing",
    d: "Travel in modern, air-conditioned Toyota Land Cruisers with seasoned desert drivers. Stop whenever you wish for photographs, tea with nomadic families, and fossil hunting.",
  },
  {
    n: "03",
    t: "Deep Dunes Access (Erg Chegaga)",
    d: "Unlike tourist-heavy Erg Chebbi, Erg Chegaga requires 60km of authentic off-road navigation, rewarding you with pristine silence and 300-meter golden sand dunes.",
  },
];

export function ProcessSection() {
  return (
    <section
      id="process"
      data-st-01="parallax"
      data-st-y="250"
      data-st-opacity="0.15"
      className="grid grid-cols-1 items-start gap-8 px-4 py-36 md:px-10 lg:grid-cols-10 lg:gap-32 bg-paper"
    >
      <motion.div {...fadeUp} className="lg:col-span-5 pr-10">
        <div className="text-[15px] text-neutral-600 font-medium">
          Our heritage & expertise
        </div>
        <h2
          data-reveal-01="words"
          data-scroll
          className="mt-4 text-[32px] md:text-[48px] font-medium tracking-[-0.06em] leading-[1.09] text-ink"
        >
          Our Sahara expeditions are{" "}
          <span className="font-normal text-neutral-500">
            handcrafted in Zagora using generations of authentic nomadic wisdom.
          </span>
        </h2>
        <OriginButton
          href="#contact"
          className="mt-6 h-10 rounded-[10px] border-neutral-300 px-5 text-sm font-medium text-neutral-900"
        >
          Plan your adventure <ArrowUpRight size={16} />
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