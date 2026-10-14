import { motion } from "framer-motion";
import heroImg from "@/assets/hero.jpg";
import { Navbar } from "./Navbar";
import { OriginButton } from "@/components/ui/origin-button";

export function HeroSection() {
  return (
    <div className="h-screen p-[4px]">
      <section className="relative flex h-full flex-col items-center justify-center overflow-hidden rounded-2xl p-6 md:p-10">
        <img
          src={heroImg}
          alt="Golden Sahara sand dunes in Erg Chegaga Zagora Morocco"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />

        <Navbar className="top-[-15px] left-[-5px]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-[920px] text-center"
        >
          <h1 className="text-[2.75rem] font-medium leading-[1.08] tracking-[-0.07em] text-white sm:text-[3.5rem] lg:text-[68px]">
            Experience the Untamed Sahara of Erg Chegaga
          </h1>
          <p className="mx-auto mt-8 max-w-[720px] text-[18px] font-medium leading-[1.35] tracking-[-0.03em] text-neutral-100/95">
            Based in Zagora, the historic gateway to the dunes. We curate bespoke{" "}
            <a
              href="#expeditions"
              className="underline underline-offset-[6px] decoration-white/40 decoration-2 transition hover:decoration-white"
            >
              4x4 Sahara expeditions
            </a>
            , luxury nomadic desert camps, and sunset camel caravans across Morocco&apos;s wildest dune sea.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#expeditions"
              className="rounded-[10px] bg-white px-7 py-[14px] text-sm font-semibold text-black transition hover:bg-neutral-100 h-[48px] flex items-center"
            >
              Explore Expeditions
            </a>
            <OriginButton
              href="#process"
              variant="white"
              className="h-[48px] rounded-[10px] border-white/60 bg-transparent px-7 text-sm font-semibold text-white backdrop-blur-md hover:border-white"
            >
              Discover Erg Chegaga
            </OriginButton>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
