import { motion } from "framer-motion";
import { ArrowUpRight, Facebook, Instagram } from "lucide-react";
import { CONTACT, phoneHref, whatsappBase } from "@/components/contact/data";
import { CTA_PHOTO } from "@/data/siteImages";
import { fadeUp } from "@/lib/animations";
import { CONTACT_PATH } from "@/lib/routes";

/** The one paragraph all designs share (same words as the original section). */
const COPY =
  "Ready to explore Erg Chegaga, the Draa Valley, or customize a private 4x4 desert expedition from Zagora? Contact our local desert team today.";

const eyebrow = "flex items-center gap-2 text-[13px] font-medium";

/** Classic: a quiet paper card that overlaps the end of the gallery photo. Headline, one paragraph, two actions, four facts. */
export function CtaClassic() {
  const fact = "text-[15px] font-medium tracking-[-0.01em] text-ink transition hover:text-neutral-500";
  const label = "text-[12px] font-medium uppercase tracking-[0.08em] text-neutral-400";
  return (
    <motion.div
      {...fadeUp}
      className="relative mb-8 rounded-[28px] border border-ink/10 bg-paper px-8 py-14 shadow-[0_50px_110px_-50px_rgba(0,0,0,0.5)] md:px-16 md:py-20"
    >
      <div className={`${eyebrow} text-neutral-500`}>
        <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden /> Plan your trip
      </div>
      <motion.h2
        {...fadeUp}
        className="mt-6 max-w-4xl text-[48px] font-semibold leading-[1.02] tracking-[-0.05em] text-ink md:text-[96px]"
      >
        Plan your Sahara <span className="font-normal text-neutral-400">journey.</span>
      </motion.h2>

      <div className="mt-14 grid gap-12 border-t border-ink/10 pt-10 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="max-w-md text-[16px] font-medium leading-[1.6] tracking-[-0.02em] text-neutral-500">{COPY}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={CONTACT_PATH}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[14px] font-semibold text-white transition hover:bg-ink-deep"
            >
              Book an expedition <ArrowUpRight size={16} aria-hidden />
            </a>
            <a
              href={whatsappBase}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3.5 text-[14px] font-semibold text-ink transition hover:bg-ink/5"
            >
              WhatsApp us
            </a>
          </div>
        </div>

        <dl className="grid grid-cols-1 gap-x-10 gap-y-7 sm:grid-cols-2">
          <div>
            <dt className={label}>Email</dt>
            <dd className="mt-2">
              <a href={`mailto:${CONTACT.email}`} className={fact}>
                {CONTACT.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className={label}>Phone &amp; WhatsApp</dt>
            <dd className="mt-2">
              <a href={phoneHref} className={fact}>
                {CONTACT.phoneDisplay}
              </a>
            </dd>
          </div>
          <div>
            <dt className={label}>Based in</dt>
            <dd className="mt-2 text-[15px] font-medium tracking-[-0.01em] text-ink">{CONTACT.location}</dd>
          </div>
          <div>
            <dt className={label}>Follow</dt>
            <dd className="mt-2 flex gap-5">
              <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" className={fact}>
                Instagram
              </a>
              <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer" className={fact}>
                Facebook
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </motion.div>
  );
}

/** Statement: centred headline on the paper colour, one paragraph, two buttons, one email. No boxes. */
export function CtaStatement() {
  return (
    <motion.div {...fadeUp} className="mb-8 border-t border-ink/10 px-2 pb-8 pt-20 text-center md:pt-28">
      <div className={`${eyebrow} justify-center text-neutral-500`}>
        <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden /> Plan your trip
      </div>
      <motion.h2 {...fadeUp} className="mx-auto mt-6 max-w-5xl text-[48px] font-semibold leading-[1.02] tracking-[-0.05em] text-ink md:text-[104px]">
        Plan your Sahara <span className="font-normal text-neutral-400">journey.</span>
      </motion.h2>
      <p className="mx-auto mt-8 max-w-md text-[16px] font-medium leading-[1.6] tracking-[-0.02em] text-neutral-500">{COPY}</p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <a
          href={CONTACT_PATH}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[14px] font-semibold text-white transition hover:bg-ink-deep"
        >
          Book an expedition <ArrowUpRight size={16} aria-hidden />
        </a>
        <a
          href={whatsappBase}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3.5 text-[14px] font-semibold text-ink transition hover:bg-ink/5"
        >
          WhatsApp us
        </a>
      </div>
      <a
        href={`mailto:${CONTACT.email}`}
        className="mt-10 inline-block border-b border-ink/15 pb-1.5 text-[15px] font-medium text-neutral-600 transition hover:border-ink hover:text-ink"
      >
        {CONTACT.email}
      </a>
    </motion.div>
  );
}

/** Photo: the sunset desert camp full-bleed, headline bottom-left, actions bottom-right. */
export function CtaPhoto() {
  return (
    <motion.div {...fadeUp} className="relative mb-8 overflow-hidden rounded-[24px] bg-ink-deep text-white">
      <img
        src={CTA_PHOTO}
        alt="Sunset over a nomad camp in the Erg Chegaga dunes"
        width={2400}
        height={1600}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" aria-hidden />

      <div className="relative flex min-h-[620px] flex-col justify-between p-8 md:min-h-[760px] md:p-14">
        <span className="inline-flex w-fit items-center rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[12px] font-medium text-white/90 backdrop-blur-md">
          {CONTACT.location} · Erg Chegaga
        </span>

        <div className="grid items-end gap-10 lg:grid-cols-[3fr_2fr] lg:gap-16">
          <motion.h2 {...fadeUp} className="text-[48px] font-semibold leading-[1.02] tracking-[-0.05em] md:text-[96px]">
            Plan your Sahara <span className="font-normal text-white/60">journey.</span>
          </motion.h2>
          <div>
            <p className="max-w-sm text-[15px] font-medium leading-[1.6] text-white/75">{COPY}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={CONTACT_PATH}
                className="inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3.5 text-[14px] font-semibold text-ink transition hover:bg-white"
              >
                Book an expedition <ArrowUpRight size={16} aria-hidden />
              </a>
              <a
                href={whatsappBase}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-[14px] font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
              >
                WhatsApp us
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Row({ label, value, href, external }: { label: string; value: string; href?: string; external?: boolean }) {
  const inner = (
    <>
      <span className="w-24 shrink-0 text-[12px] font-medium uppercase tracking-[0.08em] text-white/45">{label}</span>
      <span className="min-w-0 flex-1 truncate text-[18px] font-semibold tracking-[-0.02em] md:text-[22px]">{value}</span>
      {href && (
        <ArrowUpRight
          size={18}
          aria-hidden
          className="shrink-0 text-white/40 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
        />
      )}
    </>
  );
  const cls = "group flex items-center gap-4 border-b border-white/15 py-5";
  return href ? (
    <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={`${cls} transition hover:border-white/40`}>
      {inner}
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

/** Ink: a dark panel, headline on the left, a ruled list of ways to reach the team on the right. */
export function CtaInk() {
  return (
    <motion.div
      {...fadeUp}
      className="mb-8 grid gap-14 rounded-[24px] bg-ink p-8 text-white md:p-14 lg:grid-cols-[6fr_5fr] lg:gap-20"
    >
      <div className="flex flex-col justify-between gap-12">
        <div>
          <div className={`${eyebrow} text-white/55`}>
            <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden /> Plan your trip
          </div>
          <motion.h2 {...fadeUp} className="mt-6 text-[48px] font-semibold leading-[1.02] tracking-[-0.05em] md:text-[88px]">
            Plan your Sahara <span className="font-normal text-white/45">journey.</span>
          </motion.h2>
        </div>
        <div>
          <p className="max-w-md text-[15px] font-medium leading-[1.6] text-white/65">{COPY}</p>
          <a
            href={CONTACT_PATH}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3.5 text-[14px] font-semibold text-ink transition hover:bg-white"
          >
            Book an expedition <ArrowUpRight size={16} aria-hidden />
          </a>
        </div>
      </div>

      <div className="flex flex-col justify-end">
        <div className="border-t border-white/15">
          <Row label="Email" value={CONTACT.email} href={`mailto:${CONTACT.email}`} />
          <Row label="WhatsApp" value={CONTACT.phoneDisplay} href={whatsappBase} external />
          <Row label="Phone" value={CONTACT.phoneDisplay} href={phoneHref} />
          <Row label="Based in" value={CONTACT.location} />
        </div>
        <div className="mt-6 flex items-center gap-5 text-white/55">
          <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="transition hover:text-white">
            <Instagram size={20} />
          </a>
          <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="transition hover:text-white">
            <Facebook size={20} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
