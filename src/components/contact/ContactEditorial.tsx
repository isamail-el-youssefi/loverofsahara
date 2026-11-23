import { motion, useReducedMotion } from "framer-motion";
import { CONTACT_HERO } from "@/data/siteImages";
import { Faq } from "@/components/about/shared";
import { Navbar } from "@/components/Navbar";
import { Band, Eyebrow, SectionTitle } from "@/components/trip/parts";
import { fadeUp } from "@/lib/animations";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useContactContent } from "./useContactContent";
import { ContactForm } from "./ContactForm";
import { ContactList, FindUsMap, Steps, WhoYouTalkTo } from "./shared";

/** Trip / place page language: framed hero, ruled contact list beside a framed form, paper bands. */
export function ContactEditorial() {
  const reduce = useReducedMotion();
  const t = useContactContent();
  const { site } = useLanguage();
  return (
    <div className="trip-page relative">
      <section data-hero-section data-st-01="parallax" data-st-y="300" data-st-opacity="0.3" className="h-screen bg-paper p-[4px]">
        <div className="relative flex h-full flex-col items-start justify-end overflow-hidden rounded-lg bg-ink-deep p-6 pb-12 text-left md:p-12 md:pb-16">
          <img src={CONTACT_HERO} alt="" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-[50%_60%]" />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/60 via-black/40 to-transparent" />
          <Navbar />
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex flex-col items-start text-left text-white"
          >
            <p className="eyebrow mb-5 text-[13px] font-medium uppercase tracking-[0.18em] text-white/80">{t.kicker}</p>
            <h1 className="whitespace-nowrap text-[min(7vw,40px)] font-semibold leading-[1] md:text-[min(6vw,84px)] md:font-light!">
              <span className="block">{t.h1a}</span>
              <span className="block">{t.h1b}</span>
            </h1>
          </motion.div>
        </div>
      </section>

      <Band id="contact" tone="paper" fullHeight>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <motion.div {...fadeUp} className="lg:col-span-5">
            <Eyebrow className="mb-3">{t.getInTouch}</Eyebrow>
            <h2 className="text-[30px] font-semibold leading-[1.05] tracking-[-0.035em] md:text-[40px]">{t.writeTitle}</h2>
            <p className="mt-4 max-w-[28rem] text-[15.5px] leading-[1.65] text-ink/75">
              {t.writeText}
            </p>
            <ContactList className="mt-8" />
          </motion.div>
          <motion.div {...fadeUp} className="rounded-2xl border border-ink/10 bg-ink/[0.03] p-6 md:p-10 lg:col-span-7">
            <h3 className="mb-6 text-[22px] font-semibold tracking-[-0.03em] md:text-[26px]">{t.tripRequest}</h3>
            <ContactForm />
          </motion.div>
        </div>
      </Band>

      <Band id="how" tone="off" parallax={false} fullHeight>
        <SectionTitle eyebrow={t.howEyebrow}>{t.howTitle}</SectionTitle>
        <div className="mt-10"><Steps /></div>
      </Band>

      <Band id="map" tone="paper" fullHeight>
        <div className="grid items-stretch gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="flex flex-col justify-center lg:col-span-4">
            <SectionTitle eyebrow={t.whereEyebrow}>{t.whereTitle}</SectionTitle>
            <p className="mt-5 text-[15.5px] leading-[1.65] text-ink/75">
              {t.whereText}
            </p>
          </div>
          <div className="flex lg:col-span-8"><FindUsMap className="flex-1" /></div>
        </div>
      </Band>

      <Band id="salah" tone="dark" fullHeight className="py-20 md:py-28">
        <WhoYouTalkTo tone="dark" />
      </Band>

      <Band id="faq" tone="paper" fullHeight className="pb-24 md:pb-32">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4"><SectionTitle eyebrow={site.about.faqEyebrow}>{site.about.faqTitle}</SectionTitle></div>
          <div className="lg:col-span-8"><Faq /></div>
        </div>
      </Band>
    </div>
  );
}
