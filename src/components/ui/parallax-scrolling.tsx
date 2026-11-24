'use client';

import React, { useRef } from 'react';
import { useScrollContainer } from "@/lib/scrollContainer";
import { motion, useScroll, useTransform } from 'framer-motion';

export interface ParallaxLayerItem {
  layer: number;
  speed: number; // e.g. 70, 55, 40, 10 (% translation)
  content?: React.ReactNode;
  imgSrc?: string;
  className?: string;
}

export interface ParallaxScrollingProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  tagline?: string;
  layers?: ParallaxLayerItem[];
  className?: string;
}

export function ParallaxComponent({
  title = "SAHARA EXPEDITIONS",
  subtitle = "Journey Beyond The Horizon",
  badge = "Immersive 3D Depth",
  tagline = "Feel the silence, beauty, and ancient soul of Erg Chegaga",
  className = "",
}: ParallaxScrollingProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollContainer = useScrollContainer();
  const { scrollYProgress } = useScroll({
    ...scrollContainer,
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Staggered parallax translation speeds for 3D depth layering
  const yLayer1 = useTransform(scrollYProgress, [0, 1], ['-15%', '35%']);
  const yLayer2 = useTransform(scrollYProgress, [0, 1], ['-10%', '20%']);
  const yTitle = useTransform(scrollYProgress, [0, 1], ['-5%', '15%']);
  const yLayer4 = useTransform(scrollYProgress, [0, 1], ['0%', '-5%']);
  const opacityFade = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.8, 1, 1, 0.9]);

  // Fades in the footer color at the bottom to prevent img 0 from colliding with the footer
  // as the foreground layers move up.
  const imgZeroGradientOpacity = useTransform(scrollYProgress, [0, 0.9], [0, 1]);

  return (
    <div
      ref={containerRef}
      className={`relative h-[130vh] sm:h-[150vh] w-full overflow-hidden bg-neutral-950 text-white ${className}`}
    >
      {/* Sticky Parallax Viewport */}
      <div className="sticky top-0 h-dvh w-full overflow-hidden flex items-center justify-center">
        {/* Layer 1 (Deepest Background - Sky & Distant Dunes) */}
        <motion.div
          style={{ y: yLayer1, opacity: opacityFade }}
          className="absolute inset-0 w-full h-[130%] -top-[15%] pointer-events-none will-change-transform"
        >
          <img
            src="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=2000&q=85"
            alt="Deep desert background"
            className="w-full h-full object-cover brightness-[0.7] saturate-110"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
        </motion.div>

        {/* Layer 2 (Midground Dunes / Mountain Ridge) */}
        <motion.div
          style={{ y: yLayer2 }}
          className="absolute inset-0 w-full h-[120%] -top-[10%] pointer-events-none will-change-transform"
        >
          <img
            src="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=2000&q=85"
            alt="Midground ridge"
            className="w-full h-full object-cover mix-blend-screen opacity-40"
            loading="eager"
          />
          <div className="absolute inset-0 bg-radial-[ellipse_at_center] from-amber-500/10 via-transparent to-transparent" />
        </motion.div>

        {/* Layer 3 (Center Typography Sandwich Layer - floats between midground and foreground) */}
        <motion.div
          style={{ y: yTitle }}
          className="relative z-10 flex flex-col items-center justify-center px-4 text-center max-w-5xl mx-auto select-none will-change-transform"
        >
          {badge && (
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-amber-300 backdrop-blur-md mb-4 shadow-lg">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              {badge}
            </div>
          )}

          <h2 className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-[-0.04em] leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-200 to-neutral-500 drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
            {title}
          </h2>

          <p className="mt-4 text-sm sm:text-xl md:text-2xl font-medium tracking-tight text-neutral-300 max-w-2xl drop-shadow-md">
            {subtitle}
          </p>

          {tagline && (
            <p className="mt-2 text-xs sm:text-sm text-neutral-400 tracking-widest uppercase font-light">
              {tagline}
            </p>
          )}
        </motion.div>

        {/* Layer 4 (Foreground Dunes / Cutout & Lighting Depth) */}
        <motion.div
          style={{ y: yLayer4 }}
          className="absolute inset-0 z-20 w-full h-full pointer-events-none will-change-transform"
        >
          {/* Bottom vignette & gradient cut-out giving true depth to the text behind */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
          <div className="absolute -bottom-1 left-0 right-0 h-32 bg-gradient-to-t from-neutral-950 to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-neutral-950 to-transparent" />
        </motion.div>

        {/* 
          This gradient slowly fades in to bridge the gap left when Layer 4 moves UP.
          It covers the exposed 'img 0' and perfectly blends into the #0f0f0f footer. 
        */}
        <motion.div
          style={{ opacity: imgZeroGradientOpacity }}
          className="absolute bottom-0 left-0 right-0 h-[40vh] bg-gradient-to-t from-ink-deep via-ink-deep/80 to-transparent z-30 pointer-events-none"
        />
      </div>
    </div>
  );
}

export default ParallaxComponent;
