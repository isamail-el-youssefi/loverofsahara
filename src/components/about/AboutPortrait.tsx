import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Band, Eyebrow, SectionTitle } from "@/components/trip/parts";
import { fadeUp } from "@/lib/animations";
import { ABOUT_INTRO, OWNER, VALUES } from "./content";
import { CtaCard, Faq, Portrait, ReviewsBlock, StatsRow, SustainabilityList } from "./shared";

/** What each paragraph of Salah's own words is about. */
const CHAPTERS = ["Where I come from", "What I share", "What we do"] as const;

/** Salah first: a dark hero with his portrait and quote, his story as chapters, then the rest of the page. */
export function AboutPortrait() {
  return (
    <div className="trip-page relative">
      <section
        id="story"
        data-hero-section
        data-st-01="parallax"
        data-st-y="300"
        data-st-opacity="0.3"
        className="min-h-screen bg-paper p-[4px]"
      >
        <div className="relative flex min-h-[calc(100dvh-8px)] flex-col overflow-hidden rounded-lg bg-ink-deep px-6 pb-10 pt-32 text-white md:px-12 md:pb-14 md:pt-40">
          <Navbar />
          <div className="grid flex-1 items-end gap-10 lg:grid-cols-12 lg:gap-14">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7"
            >
              <p className="eyebrow mb-5 text-[13px] font-medium uppercase tracking-[0.18em] text-white/70">
                {OWNER.role} <span aria-hidden>·</span> Lover of Sahara
              </p>
              <h1 className="text-[48px] font-semibold leading-[0.98] tracking-[-0.04em] md:text-[96px] md:font-light">
                {OWNER.name}
              </h1>
              <p className="mt-8 max-w-[34rem] text-[22px] font-light leading-[1.25] tracking-[-0.02em] text-white/85 md:text-[30px]">
                “{OWNER.quote}”
              </p>
              <ul className="mt-8 flex flex-wrap gap-2" aria-label="Languages spoken">
                {OWNER.languages.map((l) => (
                  <li key={l} className="rounded-full border border-white/25 px-3.5 py-1.5 text-[13px] leading-tight text-white/85">
                    {l}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5"
            >
              <div className="aspect-[4/5] max-h-[70dvh] overflow-hidden rounded-2xl bg-white/10 lg:ml-auto">
                <Portrait />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Band id="salah" tone="paper" parallax={false}>
        <motion.div {...fadeUp} className="mb-12 grid gap-6 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Eyebrow className="mb-3">Our story</Eyebrow>
          </div>
          <p className="text-[24px] font-light leading-[1.22] tracking-[-0.03em] md:text-[36px] lg:col-span-8">{ABOUT_INTRO}</p>
        </motion.div>
        <ol className="border-b border-ink/10">
          {OWNER.bio.map((p, i) => (
            <li key={p.slice(0, 24)} className="grid gap-4 border-t border-ink/10 py-8 md:grid-cols-12 md:gap-16 md:py-12">
              <div className="md:col-span-4">
                <span className="text-[12px] tabular-nums text-neutral-400">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-1 text-[24px] font-semibold tracking-[-0.03em] md:text-[30px]">{CHAPTERS[i]}</h3>
              </div>
              <p className="max-w-[40rem] text-[16px] leading-[1.75] text-ink/80 md:col-span-8">{p}</p>
            </li>
          ))}
        </ol>
      </Band>

      <Band id="values" tone="dark" parallax={false} className="py-20 md:py-28">
        <Eyebrow className="mb-3 !text-white/60">What we stand for</Eyebrow>
        <h2 className="mb-12 text-[32px] font-semibold leading-[1.04] tracking-[-0.035em] md:text-[48px]">Authentic. Wild.</h2>
        <StatsRow tone="dark" className="border-b border-white/15 pb-12" />
        <div className="mt-12 grid gap-[6px] md:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-2xl bg-white/[0.06] p-6 md:p-8">
              <h3 className="text-[24px] font-semibold tracking-[-0.03em]">{v.title}</h3>
              <p className="mt-3 text-[15px] leading-[1.6] text-white/70">{v.text}</p>
            </div>
          ))}
        </div>
      </Band>

      <Band id="reviews" tone="paper" parallax={false}>
        <Eyebrow className="mb-3">Why travel with us</Eyebrow>
        <h2 className="mb-10 text-[30px] font-semibold leading-[1.05] tracking-[-0.035em] md:text-[40px]">Trusted by our guests</h2>
        <ReviewsBlock />
      </Band>

      <Band id="sustainability" tone="off" parallax={false}>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionTitle eyebrow="Responsible travel">Sustainability</SectionTitle>
          </div>
          <div className="lg:col-span-8">
            <SustainabilityList />
          </div>
        </div>
      </Band>

      <Band id="faq" tone="paper" parallax={false}>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionTitle eyebrow="Good to know">Questions</SectionTitle>
          </div>
          <div className="lg:col-span-8">
            <Faq />
          </div>
        </div>
      </Band>

      <Band tone="paper" parallax={false} className="!pt-4 pb-24 md:pb-32">
        <CtaCard />
      </Band>
    </div>
  );
}
