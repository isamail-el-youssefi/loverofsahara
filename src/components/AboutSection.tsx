import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import redStitch from "@/assets/red-stitch.jpg";
import { fadeUp } from "@/lib/animations";

const stats = [
  { n: "300m", label: "highest golden sand dunes in Erg Chegaga" },
  { n: "40km", label: "vast unbroken wilderness of the Sahara sea" },
  { n: "100%", label: "private 4x4 expeditions & tailored routes" },
  { n: "1", label: "native team handling camps, transport & safety" },
];

export function AboutSection() {
  return (
    <section className="flex flex-col gap-10 px-4 py-16 md:px-10 max-w-[1400px] mx-auto w-full">
      <motion.div {...fadeUp} className="flex flex-col lg:flex-row items-start gap-8 lg:gap-1.5 w-full">
        <div className="w-full lg:w-[30%] flex-shrink-0 pt-4">
          <div className="flex items-center gap-2 text-[13px] text-neutral-500 font-medium">
            <div className="w-1.5 h-1.5 rounded-full bg-brand" /> About us
          </div>
        </div>
        <div className="flex-1">
          <h2
            data-reveal-01="words"
            data-scroll
            className="text-[60px] md:text-[104px] font-semibold leading-[1] tracking-[-0.05em] text-ink text-left"
          >
            Discover the raw majesty of Erg Chegaga with Zagora natives. Private 4x4 expeditions{" "}
            <span className="text-neutral-400 font-medium">
              luxury nomad camps, sunset camel caravans, and deep Sahara heritage.
            </span>
          </h2>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-1.5 mt-8 lg:mt-16 w-full">
        <div className="flex flex-col gap-1.5 w-full lg:w-[30%] flex-shrink-0">
          {stats.map((s, i) => (
            <motion.div
              key={s.n + i}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.05 }}
              className="flex flex-col gap-2 rounded-2xl border border-neutral-100 bg-paper p-6 md:p-8 h-[145px] justify-center"
            >
              <span className="text-4xl font-bold tracking-tight text-ink">{s.n}</span>
              <span className="text-[10px] text-neutral-500 leading-[1.3] uppercase tracking-[0.05em] font-bold max-w-[200px]">
                {s.label}
              </span>
            </motion.div>
          ))}
          <motion.a
            {...fadeUp}
            href="#contact"
            className="flex cursor-pointer items-center justify-between rounded-2xl bg-ink p-6 text-white transition hover:bg-ink-deep"
          >
            <span className="font-bold text-[13px]">Explore our story</span>
            <ArrowUpRight size={18} />
          </motion.a>
        </div>

        <motion.div {...fadeUp} className="relative overflow-hidden rounded-2xl h-[500px] lg:h-[610px] flex-1">
          <img
            src={redStitch}
            alt="Traditional Moroccan Berber tea and authentic desert hospitality"
            width={1280}
            height={1600}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
