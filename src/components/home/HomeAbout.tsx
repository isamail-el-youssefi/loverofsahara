import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { ABOUT_INTRO, OWNER, STATS } from "@/components/about/content";
import { ABOUT_PHOTO } from "@/data/siteImages";
import { fadeUp } from "@/lib/animations";
import { ABOUT_PATH, CONTACT_PATH } from "@/lib/routes";

/** Home "Complete" layout: a short, calm introduction to the team: photo, one headline, one paragraph, four facts. */
export function HomeAbout() {
  return (
    <section
      id="about"
      data-st-01="parallax"
      data-st-y="250"
      data-st-opacity="0.15"
      className="bg-paper px-4 py-[var(--section-y)] md:px-10"
    >
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[5fr_6fr] lg:gap-16">
        <motion.div {...fadeUp} className="relative aspect-[6/7] overflow-hidden rounded-2xl bg-neutral-100 lg:aspect-[10/11]">
          <img
            src={ABOUT_PHOTO}
            alt="Camel caravan in the Sahara near Zagora"
            width={2400}
            height={1596}
            loading="lazy"
            className="h-full w-full object-cover object-[62%_50%]"
          />
          <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6 pt-16 text-[14px] text-white">
            “{OWNER.quote}”
            <span className="mt-1 block text-[12px] text-white/70">
              {OWNER.name}, {OWNER.role}
            </span>
          </p>
        </motion.div>

        <div>
          <div className="flex items-center gap-2 text-[13px] font-medium text-neutral-500">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden /> About us
          </div>
          <h2
            data-reveal-01="words"
            data-scroll
            className="mt-5 text-[36px] font-semibold leading-[1.05] tracking-[-0.05em] text-ink md:text-[60px]"
          >
            Native guides from Zagora. <div className="font-normal text-neutral-400">Private Sahara journeys.</div>
          </h2>
          <motion.p {...fadeUp} className="mt-6 max-w-xl text-[16px] font-medium leading-[1.6] tracking-[-0.02em] text-neutral-600">
            {ABOUT_INTRO}
          </motion.p>

          <dl className="mt-10 grid grid-cols-2 border-t border-neutral-200">
            {STATS.map((s, i) => (
              <motion.div
                key={s.n}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.05 }}
                className={`py-6 pr-4 ${i % 2 === 0 ? "border-r border-neutral-200" : "pl-6"} ${i < 2 ? "border-b border-neutral-200" : ""}`}
              >
                <dt className="text-[34px] font-semibold leading-none tracking-[-0.04em] text-ink md:text-[44px]">{s.n}</dt>
                <dd className="mt-2 max-w-[220px] text-[12px] font-medium leading-[1.4] text-neutral-500">{s.label}</dd>
              </motion.div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={ABOUT_PATH}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[13px] font-semibold text-white transition hover:bg-ink-deep"
            >
              Our story <ArrowUpRight size={16} aria-hidden />
            </a>
            <a
              href={CONTACT_PATH}
              className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-5 py-3 text-[13px] font-semibold text-ink transition hover:bg-ink/5"
            >
              Plan your trip
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
