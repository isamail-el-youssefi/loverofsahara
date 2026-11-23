import { motion, useReducedMotion } from "framer-motion";
import heroVideo from "@/assets/herovideo.mp4";
import { registerHeroVideo } from "@/lib/heroVideo";
import { useLanguage } from "@/i18n/LanguageProvider";
import { Navbar } from "./Navbar";

export function HeroSection() {
  const reduce = useReducedMotion();
  const h = useLanguage().site.hero;

  return (
    <section
      data-hero-section
      data-st-01="parallax"
      data-st-y="300"
      data-st-opacity="0.3"
      className="h-screen p-[4px] bg-paper"
    >
      <div className="hero-frame relative flex h-full flex-col items-start justify-end overflow-hidden rounded-lg p-6 pb-12 md:p-12 md:pb-16">
        <video
          ref={registerHeroVideo}
          src={heroVideo}
          aria-hidden
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full bg-ink-deep object-cover"
        />
        {/* Scrim only where the text sits, so the video stays bright */}
        <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

        <Navbar />

        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduce ? { duration: 0.2 } : { type: "spring", damping: 25, stiffness: 180, mass: 0.8 }}
          className="hero-copy relative z-10 max-w-[640px] text-"
        >
          <p className="eyebrow hero-eyebrow mb-4 text-xs font-medium uppercase tracking-[0.18em] text-white/70">
            {h.eyebrow}
          </p>

          <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-light! leading-[1.08] tracking-[-0.04em] text-white">
            {h.pre}<br className="hero-br" /><i className="hero-em">{h.em}</i>{h.post}
          </h1>

          {/* Shown only in the Sahara Editorial font choice */}
          <p className="hero-lede mt-5  text-white/85">
            {h.lede}
          </p>

{/*           <div className="hero-actions mt-7 flex flex-wrap items-center gap-6">
            <a
              href="#expeditions"
              className="flex h-[46px] items-center rounded-[10px] bg-paper px-7 text-sm font-semibold text-ink transition-all duration-100 ease-out hover:bg-neutral-100 active:scale-[0.98] active:bg-neutral-200"
            >
              Explore Expeditions
            </a>
            <a
              href="#process"
              className="text-sm font-medium text-white/85 transition-colors duration-100 hover:text-white active:opacity-70"
            >
              Discover Erg Chegaga <span aria-hidden>→</span>
            </a>
          </div> */}
        </motion.div>
      </div>
    </section>
  );
}
