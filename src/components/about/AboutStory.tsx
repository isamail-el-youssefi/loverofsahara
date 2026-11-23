import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Band, Eyebrow, SectionTitle } from "@/components/trip/parts";
import { fadeUp } from "@/lib/animations";
import { HERO_PHOTO } from "./content";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useAboutContent } from "./useAboutContent";
import { CtaCard, Faq, Portrait, ReviewsBlock, SustainabilityList } from "./shared";

/** Home-page vibe: oversized statement, stat cards beside a big photo, sticky portrait, numbered values. */
export function AboutStory() {
  const { ABOUT_TAIL, CTA, OWNER, STATS, VALUES } = useAboutContent();
  const { site } = useLanguage();
  const t = site.about;
  return (
    <div className="trip-page relative">
      <Navbar theme="light" />

      <Band id="story" tone="paper" parallax={false} className="pt-40 md:pt-48">
        <motion.div {...fadeUp} className="flex flex-col items-start gap-8 lg:flex-row lg:gap-1.5">
          <div className="w-full flex-shrink-0 pt-4 lg:w-[30%]">
            <div className="flex items-center gap-2 text-[13px] font-medium text-neutral-500">
              <div className="h-1.5 w-1.5 rounded-full bg-brand" /> {site.homeAbout.eyebrow}
            </div>
          </div>
          <h1 className="flex-1 text-[38px] font-semibold leading-[1.04] tracking-[-0.05em] text-ink md:text-[64px]">
            {site.homeAbout.h2a} <span className="font-medium text-neutral-400">{ABOUT_TAIL}</span>
          </h1>
        </motion.div>

        <div className="mt-12 flex flex-col gap-1.5 lg:mt-20 lg:flex-row">
          <div className="flex w-full flex-shrink-0 flex-col gap-1.5 lg:w-[30%]">
            {STATS.map((s, i) => (
              <motion.div
                key={s.n + s.label}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.05 }}
                className="flex h-[145px] flex-col justify-center gap-2 rounded-2xl border border-neutral-100 bg-paper p-6 md:p-8"
              >
                <span className="text-4xl font-bold tracking-tight text-ink">{s.n}</span>
                <span className="max-w-[200px] text-[10px] font-bold uppercase leading-[1.3] tracking-[0.05em] text-neutral-500">
                  {s.label}
                </span>
              </motion.div>
            ))}
            <motion.a
              {...fadeUp}
              href={CTA.mailto}
              className="flex items-center justify-between rounded-2xl bg-ink p-6 text-white transition hover:bg-ink-deep"
            >
              <span className="text-[13px] font-bold">{CTA.button}</span>
              <ArrowUpRight size={18} aria-hidden />
            </motion.a>
          </div>
          <motion.div {...fadeUp} className="relative h-[480px] flex-1 overflow-hidden rounded-2xl lg:h-[610px]">
            <img src={HERO_PHOTO} alt={site.homeAbout.photoAlt} loading="lazy" className="h-full w-full object-cover" />
          </motion.div>
        </div>
      </Band>

      <Band id="salah" tone="off" parallax={false}>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-6">
              <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-ink-deep">
                <Portrait />
              </div>
              <p className="mt-4 text-[13px] text-neutral-500">
                {OWNER.name}, {OWNER.role}
              </p>
            </div>
          </div>
          <motion.div {...fadeUp} className="lg:col-span-7">
            <Eyebrow className="mb-3">{t.ownerEyebrow}</Eyebrow>
            <p className="text-[28px] font-light leading-[1.15] tracking-[-0.03em] md:text-[44px]">“{OWNER.quote}”</p>
            <div className="mt-10 space-y-5 text-[16px] leading-[1.75] text-ink/80">
              {OWNER.bio.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <p className="mt-8 text-[14px] text-neutral-500">{t.languagesLabel}: {OWNER.languages.join(", ")}.</p>
          </motion.div>
        </div>
      </Band>

      <Band id="values" tone="paper" parallax={false}>
        <SectionTitle eyebrow={t.valuesEyebrow}>{t.valuesTitleStory}</SectionTitle>
        <ol className="mt-10 border-b border-ink/10">
          {VALUES.map((v, i) => (
            <li key={v.title} className="grid gap-3 border-t border-ink/10 py-8 md:grid-cols-[4rem_minmax(0,1fr)_minmax(0,1.4fr)] md:items-baseline md:gap-8 md:py-10">
              <span className="text-[13px] tabular-nums text-neutral-400">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="text-[30px] font-semibold tracking-[-0.04em] md:text-[44px]">{v.title}</h3>
              <p className="max-w-[34rem] text-[15.5px] leading-[1.65] text-ink/75">{v.text}</p>
            </li>
          ))}
        </ol>
      </Band>

      <Band id="reviews" tone="paper" parallax={false} className="!pt-0">
        <Eyebrow className="mb-3">{t.reviewsEyebrow}</Eyebrow>
        <h2 className="mb-10 text-[30px] font-semibold leading-[1.05] tracking-[-0.035em] md:text-[40px]">{t.reviewsTitle}</h2>
        <ReviewsBlock />
      </Band>

      <Band id="sustainability" tone="dark" parallax={false} className="py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Eyebrow className="mb-3 !text-white/60">{t.sustainEyebrow}</Eyebrow>
            <h2 className="text-[32px] font-semibold leading-[1.04] tracking-[-0.035em] md:text-[48px]">{t.sustainTitle}</h2>
          </div>
          <div className="lg:col-span-8">
            <SustainabilityList tone="dark" />
          </div>
        </div>
      </Band>

      <Band id="faq" tone="paper" parallax={false}>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionTitle eyebrow={t.faqEyebrow}>{t.faqTitle}</SectionTitle>
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
