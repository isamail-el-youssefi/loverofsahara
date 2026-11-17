import { motion } from "framer-motion";
import { ArrowUpRight, Facebook, Instagram } from "lucide-react";
import sewing from "@/assets/sewing.jpg";
import { CONTACT, phoneHref, whatsappBase } from "@/components/contact/data";
import { fadeUp } from "@/lib/animations";

export function CtaSection() {
  return (
    <section id="contact" className="px-4 md:px-10">
      <motion.div
        {...fadeUp}
        className="relative mb-8 overflow-hidden rounded-2xl border border-neutral-200 bg-paper p-8 md:p-14"
      >
        <h2
          data-reveal-01="words"
          data-scroll
          className="text-[60px] md:text-[104px] font-semibold leading-[1] tracking-[-0.05em] text-ink"
        >
          Plan Your Sahara Journey.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <p className="max-w-md text-[16px] font-medium tracking-[-0.03em] text-neutral-500">
              Ready to explore Erg Chegaga, the Draa Valley, or customize a private 4x4 desert expedition from Zagora? Contact our local desert team today.
            </p>
            <a
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-[10px] bg-ink px-6 py-3 text-sm font-medium text-white transition hover:bg-ink-deep"
            >
              Book an expedition <ArrowUpRight size={16} />
            </a>
            <div className="mt-8">
              <a
                href={`mailto:${CONTACT.email}`}
                className="inline-block border-b border-neutral-200 pb-2 text-2xl font-semibold text-ink transition hover:text-neutral-600 md:text-3xl"
              >
                {CONTACT.email}
              </a>
            </div>
            <div className="mt-4 text-sm font-medium text-neutral-500">
              <p>📍 {CONTACT.location}</p>
              <p className="mt-1">
                📞 <a href={phoneHref} className="transition hover:text-ink">{CONTACT.phoneDisplay}</a> • WhatsApp:{" "}
                <a href={whatsappBase} target="_blank" rel="noopener noreferrer" className="transition hover:text-ink">
                  {CONTACT.phoneDisplay}
                </a>
              </p>
            </div>
            <div className="mt-8 flex items-center gap-5 text-neutral-500">
              <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="transition hover:text-ink">
                <Instagram size={20} />
              </a>
              <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="transition hover:text-ink">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          <div className="relative h-48 overflow-hidden rounded-2xl md:h-56">
            <img
              src={sewing}
              alt="Sunset over the Erg Chegaga Sahara desert with nomadic camp"
              width={1280}
              height={720}
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
            <span className="absolute bottom-5 left-6 text-sm font-medium text-white">
              Experience the timeless spirit of the Sahara.
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
