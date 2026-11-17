import { motion } from "framer-motion";
import { Mail, MessageCircle } from "lucide-react";
import { Faq } from "@/components/about/shared";
import { Navbar } from "@/components/Navbar";
import { Band, Eyebrow, SectionTitle } from "@/components/trip/parts";
import { fadeUp } from "@/lib/animations";
import { ContactForm } from "./ContactForm";
import { CONTACT, whatsappBase } from "./data";
import { ContactList, FindUsMap, Steps, WhoYouTalkTo } from "./shared";

/** WhatsApp first: a dark hero with the two fastest ways to reach us, the full request form below. */
export function ContactDirect() {
  return (
    <div className="trip-page relative">
      <section id="contact" data-hero-section data-st-01="parallax" data-st-y="300" data-st-opacity="0.3" className="min-h-screen bg-paper p-[4px]">
        <div className="relative flex min-h-[calc(100dvh-8px)] flex-col justify-end overflow-hidden rounded-lg bg-ink-deep px-6 pb-12 pt-32 text-white md:px-12 md:pb-16">
          <Navbar />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[60rem]"
          >
            <p className="eyebrow mb-5 text-[13px] font-medium uppercase tracking-[0.18em] text-white/70">The fastest way to reach us</p>
            <h1 className="text-[44px] font-semibold leading-[0.98] tracking-[-0.04em] md:text-[96px] md:font-light">Message us on WhatsApp</h1>
            <p className="mt-6 max-w-[34rem] text-[17px] leading-[1.5] text-white/75">
              Salah and the team answer in {CONTACT.languages.slice(0, -1).join(", ")} and {CONTACT.languages[CONTACT.languages.length - 1]}.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappBase}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-[54px] items-center justify-center gap-2.5 rounded-[10px] bg-paper px-8 text-[15px] font-semibold text-ink transition-all duration-100 ease-out hover:bg-neutral-100 active:scale-[0.98]"
              >
                <MessageCircle size={19} aria-hidden /> WhatsApp {CONTACT.phoneDisplay}
              </a>
              <a
                href={`mailto:${CONTACT.email}`}
                className="inline-flex h-[54px] items-center justify-center gap-2.5 rounded-[10px] border border-white/40 px-8 text-[15px] font-semibold text-white transition-all duration-100 ease-out hover:bg-white/10 active:scale-[0.98]"
              >
                <Mail size={19} aria-hidden /> {CONTACT.email}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Band id="form" tone="paper" parallax={false}>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionTitle eyebrow="Plan a trip">Prefer to write it all down?</SectionTitle>
            <p className="mt-4 text-[15.5px] leading-[1.65] text-ink/75">
              Fill this in and we will open WhatsApp or your email with the message ready.
            </p>
            <ContactList className="mt-8" />
          </div>
          <motion.div {...fadeUp} className="rounded-2xl border border-ink/10 bg-ink/[0.03] p-6 md:p-10 lg:col-span-8">
            <ContactForm />
          </motion.div>
        </div>
      </Band>

      <Band id="how" tone="off" parallax={false}>
        <SectionTitle eyebrow="How it works">Three simple steps</SectionTitle>
        <div className="mt-10"><Steps /></div>
      </Band>

      <Band id="map" tone="dark" parallax={false} className="py-20 md:py-28">
        <Eyebrow className="mb-3 !text-white/60">Where we are</Eyebrow>
        <h2 className="mb-8 text-[32px] font-semibold leading-[1.04] tracking-[-0.035em] md:text-[48px]">Zagora, gateway to the Sahara</h2>
        <FindUsMap tone="dark" />
      </Band>

      <Band id="salah" tone="paper" parallax={false}>
        <WhoYouTalkTo />
      </Band>

      <Band id="faq" tone="off" parallax={false} className="pb-24 md:pb-32">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4"><SectionTitle eyebrow="Good to know">Questions</SectionTitle></div>
          <div className="lg:col-span-8"><Faq /></div>
        </div>
      </Band>
    </div>
  );
}
