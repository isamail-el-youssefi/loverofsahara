import { motion } from "framer-motion";
import { ArrowUpRight, Twitter, Instagram, Youtube } from "lucide-react";
import sewing from "@/assets/sewing.jpg";
import { fadeUp } from "@/lib/animations";

export function CtaSection() {
  return (
    <section id="contact" className="px-4 md:px-10">
      <motion.div
        {...fadeUp}
        className="relative mb-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-8 md:p-14"
      >
        <h2 className="text-[60px] md:text-[104px] font-semibold leading-[1] tracking-[-0.05em] text-[#141414]">
          Plan Your Sahara Journey.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <p className="max-w-md text-[16px] font-medium tracking-[-0.03em] text-neutral-500">
              Ready to explore Erg Chegaga, the Draa Valley, or customize a private 4x4 desert expedition from Zagora? Contact our local desert team today.
            </p>
            <a
              href="mailto:contact@loverofsahara.com"
              className="mt-6 inline-flex items-center gap-2 rounded-[10px] bg-[#121212] px-6 py-3 text-sm font-medium text-white transition hover:bg-black"
            >
              Book an expedition <ArrowUpRight size={16} />
            </a>
            <div className="mt-8">
              <a
                href="mailto:contact@loverofsahara.com"
                className="inline-block border-b border-neutral-200 pb-2 text-2xl font-semibold text-black transition hover:text-neutral-600 md:text-3xl"
              >
                contact@loverofsahara.com
              </a>
            </div>
            <div className="mt-4 text-sm font-medium text-neutral-500">
              <p>📍 Boulevard Mohammed V, Zagora 47900, Drâa-Tafilalet, Morocco</p>
              <p className="mt-1">📞 +212 524 84 70 00 • WhatsApp: +212 661 00 00 00</p>
            </div>
            <div className="mt-8 flex items-center gap-5 text-neutral-500">
              <a href="#" aria-label="Twitter" className="transition hover:text-black">
                <Twitter size={20} />
              </a>
              <a href="#" aria-label="Instagram" className="transition hover:text-black">
                <Instagram size={20} />
              </a>
              <a href="#" aria-label="Youtube" className="transition hover:text-black">
                <Youtube size={20} />
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
