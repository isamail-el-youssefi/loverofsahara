import { motion, useReducedMotion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Band, Eyebrow, SectionTitle } from "@/components/trip/parts";
import { fadeUp } from "@/lib/animations";
import { HERO_PHOTO } from "./content";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useAboutContent } from "./useAboutContent";
import { CtaCard, Faq, Portrait, ReviewsBlock, StatsRow, SustainabilityList } from "./shared";

/** Red Dot / place-page language: framed hero, light display type, ruled paper bands, dark reviews band. */
export function AboutEditorial() {
  const reduce = useReducedMotion();
  const { ABOUT_INTRO, OWNER, VALUES } = useAboutContent();
  const t = useLanguage().site.about;
  return (
    <div className="trip-page relative">
      <section
        data-hero-section
        data-st-01="parallax"
        data-st-y="300"
        data-st-opacity="0.3"
        className="h-screen bg-paper p-[4px]"
      >
        <div className="relative flex h-full flex-col items-start justify-end overflow-hidden rounded-lg bg-ink-deep p-6 pb-12 text-left md:p-12 md:pb-16">
          <img src={HERO_PHOTO} alt="" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-[50%_60%]" />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/60 via-black/40 to-transparent" />
          <Navbar />
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex flex-col items-start text-left text-white"
          >
            <p className="eyebrow mb-5 text-[13px] font-medium uppercase tracking-[0.18em] text-white/80">
              {t.kicker}
            </p>
            <h1 className="whitespace-nowrap text-[min(7vw,40px)] font-semibold leading-[1] md:text-[min(6vw,84px)] md:font-light!">
              <span className="block">{t.h1a}</span>
              <span className="block">{t.h1b}</span>
            </h1>
          </motion.div>
        </div>
      </section>

      <Band id="story" tone="paper" parallax={false} minHeight="58dvh">
        <motion.div {...fadeUp} className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Eyebrow className="mb-3">{t.storyEyebrow}</Eyebrow>
          </div>
          <p className="text-[26px] font-light leading-[1.2] tracking-[-0.03em] md:text-[40px] lg:col-span-8">{ABOUT_INTRO}</p>
        </motion.div>
        <StatsRow className="mt-14 border-t border-ink/10 pt-10 md:mt-20 md:pt-14" />
      </Band>

      <Band id="salah" tone="off" parallax={false}>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <motion.div {...fadeUp} className="lg:col-span-5">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-ink-deep">
              <Portrait />
            </div>
          </motion.div>
          <motion.div {...fadeUp} className="lg:col-span-7">
            <Eyebrow className="mb-3">{t.ownerEyebrow}</Eyebrow>
            <h2 className="text-[34px] font-semibold leading-[1.04] tracking-[-0.035em] md:text-[52px]">{OWNER.name}</h2>
            <p className="mt-2 text-[15px] text-neutral-500">{OWNER.role}</p>
            <div className="mt-7 space-y-4 text-[15.5px] leading-[1.7] text-ink/80">
              {OWNER.bio.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <ul className="mt-7 flex flex-wrap gap-2" aria-label={t.languagesLabel}>
              {OWNER.languages.map((l) => (
                <li key={l} className="rounded-full border border-ink/15 px-3.5 py-1.5 text-[13px] leading-tight text-ink/80">
                  {l}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </Band>

      <Band id="values" tone="paper" parallax={false}>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionTitle eyebrow={t.valuesEyebrow}>{t.valuesTitle}</SectionTitle>
          </div>
          <ul className="border-b border-ink/10 lg:col-span-8">
            {VALUES.map((v) => (
              <li key={v.title} className="grid gap-2 border-t border-ink/10 py-6 md:grid-cols-[12rem_1fr] md:gap-8 md:py-8">
                <h3 className="text-[22px] font-semibold tracking-[-0.03em] md:text-[26px]">{v.title}</h3>
                <p className="max-w-[40rem] text-[15.5px] leading-[1.65] text-ink/75">{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </Band>

      <Band id="reviews" tone="dark" parallax={false} className="py-20 md:py-28">
        <motion.div {...fadeUp}>
          <Eyebrow className="mb-3 !text-white/60">{t.reviewsEyebrow}</Eyebrow>
          <h2 className="mb-10 text-[32px] font-semibold leading-[1.04] tracking-[-0.035em] md:text-[48px]">
            {t.reviewsTitle}
          </h2>
          <ReviewsBlock tone="dark" />
        </motion.div>
      </Band>

      <Band id="sustainability" tone="paper" parallax={false}>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionTitle eyebrow={t.sustainEyebrow}>{t.sustainTitle}</SectionTitle>
          </div>
          <div className="lg:col-span-8">
            <SustainabilityList />
          </div>
        </div>
      </Band>

      <Band id="faq" tone="off" parallax={false}>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionTitle eyebrow={t.faqEyebrow}>{t.faqTitle}</SectionTitle>
          </div>
          <div className="lg:col-span-8">
            <Faq />
          </div>
        </div>
      </Band>

      <Band tone="paper" parallax={false} className="!pt-10 pb-24 md:pb-32">
        <CtaCard />
      </Band>
    </div>
  );
}
