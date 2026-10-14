import { motion } from "framer-motion";
import heroImg from "@/assets/hero.jpg";
import { Navbar } from "./Navbar";
import { OriginButton } from "@/components/ui/origin-button";

export function HeroSection() {
  return (
    <section
      data-st-01="parallax"
      data-st-y="300"
      data-st-opacity="0.3"
      className="h-screen p-[4px] bg-white"
    >
      <div className="relative flex h-full flex-col items-center justify-center overflow-hidden rounded-2xl p-6 md:p-10">
        <img
          src={heroImg}
          alt="Golden Sahara sand dunes in Erg Chegaga Zagora Morocco"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />

        <Navbar />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 180, mass: 0.8 }}
          className="relative z-10 max-w-[900px] text-center px-4"
        >
          {/* Eyebrow badge: Clean orientation with Apple frosted glass */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-white/90 mb-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]">
            <span>Erg Chegaga • Zagora</span>
          </div>

          {/* Headline: Command presence with optical negative tracking */}
          <h1

            className="text-[2.75rem] sm:text-[3.5rem] lg:text-[64px] font-semibold leading-[1.06] tracking-[-0.04em] text-white"
          >
            Experience the Untamed Sahara of Erg Chegaga
          </h1>

          {/* Subtitle: Short, high-signal, clean 2-line measure */}
          <p className="mx-auto mt-5 max-w-[560px] text-[16px] sm:text-[18px] font-normal leading-[1.6] tracking-normal text-white/85">
            Bespoke 4x4 expeditions, luxury nomad bivouacs, and sunset camel caravans across Morocco&apos;s wildest dune sea.
          </p>

          {/* Buttons: Tactile zero-latency press + Apple materials */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <a
              href="#expeditions"
              className="h-[46px] rounded-[10px] bg-white px-7 text-sm font-semibold text-black transition-all duration-100 ease-out active:scale-[0.98] active:bg-neutral-200 hover:bg-neutral-100 flex items-center shadow-sm"
            >
              Explore Expeditions
            </a>
            <OriginButton
              href="#process"
              variant="white"
              className="h-[46px] rounded-[10px] border-white/40 bg-white/10 px-7 text-sm font-semibold text-white backdrop-blur-md hover:border-white transition-all duration-100 ease-out active:scale-[0.98] active:bg-white/20"
            >
              Discover Erg Chegaga
            </OriginButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
