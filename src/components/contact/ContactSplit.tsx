import { motion } from "framer-motion";
import { Faq } from "@/components/about/shared";
import { Navbar } from "@/components/Navbar";
import { Band, SectionTitle } from "@/components/trip/parts";
import { fadeUp } from "@/lib/animations";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useContactContent } from "./useContactContent";
import { ContactForm } from "./ContactForm";
import { ContactList, FindUsMap, Steps, WhoYouTalkTo } from "./shared";

/** Home page vibe: an oversized statement, the ways to reach us on the left and the form on the right. */
export function ContactSplit() {
  const t = useContactContent();
  const { site } = useLanguage();
  return (
    <div className="trip-page relative">
      <Navbar theme="light" />

      <Band id="contact" tone="paper" parallax={false} className="pt-40 md:pt-48">
        <motion.div {...fadeUp} className="flex flex-col items-start gap-8 lg:flex-row lg:gap-1.5">
          <div className="w-full flex-shrink-0 pt-4 lg:w-[30%]">
            <div className="flex items-center gap-2 text-[13px] font-medium text-neutral-500">
              <div className="h-1.5 w-1.5 rounded-full bg-brand" /> {t.splitEyebrow}
            </div>
          </div>
          <h1 className="flex-1 text-[44px] font-semibold leading-[1] tracking-[-0.05em] text-ink md:text-[88px]">
            {t.splitH1a}{" "}
            <span className="font-medium text-neutral-400">{t.splitH1b}</span>
          </h1>
        </motion.div>

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-14">
          <motion.div {...fadeUp} className="lg:col-span-5">
            <ContactList />
          </motion.div>
          <motion.div {...fadeUp} className="rounded-2xl border border-neutral-200 bg-paper p-6 md:p-10 lg:col-span-7">
            <ContactForm />
          </motion.div>
        </div>
      </Band>

      <Band id="how" tone="off" parallax={false}>
        <SectionTitle eyebrow={t.howEyebrow}>{t.howTitle}</SectionTitle>
        <div className="mt-10"><Steps /></div>
      </Band>

      <Band id="map" tone="paper" parallax={false}>
        <SectionTitle eyebrow={t.whereEyebrow}>{t.whereTitle}</SectionTitle>
        <div className="mt-8"><FindUsMap /></div>
      </Band>

      <Band id="salah" tone="off" parallax={false}>
        <WhoYouTalkTo />
      </Band>

      <Band id="faq" tone="paper" parallax={false} className="pb-24 md:pb-32">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4"><SectionTitle eyebrow={site.about.faqEyebrow}>{site.about.faqTitle}</SectionTitle></div>
          <div className="lg:col-span-8"><Faq /></div>
        </div>
      </Band>
    </div>
  );
}
