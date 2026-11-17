'use client'

import { DESTINATION_IMAGES } from "@/data/siteImages";
import { useRef } from "react";
import { useScrollContainer } from "@/lib/scrollContainer";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight, MapPin } from "lucide-react";
import { OriginButton } from "@/components/ui/origin-button";

export interface DestinationItemData {
id: number;
title: string;
tag: string;
location: string;
description: string;
imageUrl: string;
reverse?: boolean;
}

const defaultDestinations: DestinationItemData[] = [
{
  id: 1,
  title: "Erg Chegaga",
  tag: "The Untamed Dunes",
  location: "Zagora • Sahara Desert",
  description:
    "Morocco's largest and wildest sea of golden sand. Towering 300-meter dunes stretching across 40 kilometers of untouched wilderness, accessible only by private 4x4 expedition across ancient dry lakes and the Sacred Oasis.",
  imageUrl: DESTINATION_IMAGES.ergChegaga,
  reverse: true,
},
{
  id: 2,
  title: "Dades Valley",
  tag: "Valley of 1,000 Kasbahs",
  location: "High Atlas • Tinghir Province",
  description:
    "Carved between the High Atlas and Jbel Saghro mountains, featuring dramatic serpentine switchback roads, rust-red rock canyons known as the monkey fingers, and lush river oases filled with ancient earthen Kasbahs.",
  imageUrl: DESTINATION_IMAGES.dadesValley,
  reverse: false,
},
{
  id: 3,
  title: "Aït Ben Haddou",
  tag: "UNESCO World Heritage Ksar",
  location: "Ouarzazate • Souss-Massa",
  description:
    "A magnificent 11th-century fortified clay ksar along the historic trans-Saharan caravan route. Stroll through centuries-old earthen architecture, intricate clay towers, and the legendary backdrop of cinematic epics.",
  imageUrl: DESTINATION_IMAGES.aitBenHaddou,
  reverse: true,
},
{
  id: 4,
  title: "Todgha Gorges",
  tag: "300m Limestone Canyons",
  location: "Tinghir • Draa-Tafilalet",
  description:
    "A breathtaking limestone canyon carved over millennia by the Todgha River. Sheer vertical rock walls soaring 300 meters above crystal-clear mountain streams, opening into the lush date palm groves of Tinghir.",
  imageUrl: DESTINATION_IMAGES.todghaGorges,
  reverse: false,
},
];

function DestinationSectionItem({ section }: { section: DestinationItemData }) {
  const targetRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const scrollContainer = useScrollContainer();
  const { scrollYProgress } = useScroll({
    ...scrollContainer,
    target: targetRef,
    offset: ["start 85%", "center 35%"],
  });

  // Apple Design: Smooth scroll progression with spring physics to feel like real mass
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 25,
    stiffness: 180,
    mass: 0.6,
  });

  // Fluid transforms honoring prefers-reduced-motion
  const opacityContent = useTransform(smoothProgress, [0.05, 0.4], [0, 1]);
  const scaleImage = useTransform(
    smoothProgress,
    [0.05, 0.75],
    shouldReduceMotion ? [1, 1] : [1.04, 1]
  );
  const translateContent = useTransform(
    smoothProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [-24, 0]
  );

  return (
    <div
      ref={targetRef}
      className="py-16 md:py-24 lg:py-28"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-20 items-center">
        {/* Content description column - structured 5 cols with Apple typographic rhythm */}
        <motion.div
          style={{
            opacity: opacityContent,
            y: translateContent,
          }}
          className={`lg:col-span-5 flex flex-col justify-center ${
            section.reverse ? "lg:order-2 lg:pl-2 xl:pl-6" : "lg:order-1 lg:pr-2 xl:pr-6"
          }`}
        >
          {/* Unified eyebrow header: single cohesive row preventing visual fragmentation */}
          <div className="flex flex-wrap items-center gap-2.5 mb-5">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-neutral-100 text-neutral-800 border border-neutral-200/90 shadow-2xs">
              {section.tag}
            </span>
 {/*            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              <MapPin size={13} className="text-brand shrink-0" />
              <span>{section.location}</span>
            </span> */}
          </div>

          {/* Apple typography: Negative tracking for large headings with optical sizing */}
          <h3 className="text-[34px] sm:text-[44px] lg:text-[50px] xl:text-[56px] font-semibold tracking-[-0.035em] leading-[1.1] text-ink">
            {section.title}
          </h3>

          {/* Apple typography: Comfortable reading measure (~65ch) and neutral tracking */}
          <p className="mt-5 text-[16px] sm:text-[17px] md:text-[18px] font-normal leading-[1.68] tracking-normal text-neutral-600 max-w-lg">
            {section.description}
          </p>

          {/* Instant tactile response on pointerdown with harmonized button radius (rounded-[10px]) */}
          <div className="mt-8 pt-1">
            <OriginButton
              href="#contact"
              className="h-10 rounded-[10px] border-neutral-300 px-6 text-sm font-medium text-neutral-900 transition-all duration-100 ease-out active:scale-[0.98] active:bg-neutral-200/80 hover:bg-neutral-100"
            >
              Explore {section.title} <ArrowUpRight size={16} />
            </OriginButton>
          </div>
        </motion.div>

        {/* Media container: 7 cols with harmonized corner radius (rounded-2xl md:rounded-[24px]) */}
        <motion.div
          style={{
            opacity: opacityContent,
            scale: scaleImage,
            willChange: "transform, opacity",
          }}
          className={`lg:col-span-7 flex justify-center w-full ${
            section.reverse ? "lg:order-1" : "lg:order-2"
          }`}
        >
          <div className="group relative h-[65vh] sm:h-[70vh] lg:h-[76vh] max-h-[740px] min-h-[460px] w-full overflow-hidden rounded-2xl md:rounded-[24px] bg-neutral-100 border border-neutral-200/70 shadow-md transition-shadow duration-300">
            <img
              src={section.imageUrl}
              alt={`${section.title} - ${section.location}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent pointer-events-none" />

            {/* Apple translucent frosted glass card with light-catching specular edge */}
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white">
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-white/70 font-semibold">Morocco Destination</p>
                <p className="text-2xl md:text-3xl font-semibold tracking-tight text-white mt-1">{section.title}</p>
              </div>
              <span className="text-xs font-medium text-white/95 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/25 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]">
                {section.location}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export const ParallaxScrollFeatureSection = ({
  destinations = defaultDestinations,
}: {
  destinations?: DestinationItemData[];
}) => {
  return (
    <section
      id="destinations"
      data-st-01="parallax"
      data-st-y="250"
      data-st-opacity="0.15"
      className="px-4 py-24 md:px-10 bg-paper"
    >
      {/* Section Header matching website typography & layout */}
      <div className="flex flex-col lg:flex-row items-end gap-6 w-full ">
        <div className="w-full lg:w-3/5">

          <h2
            data-reveal-01="words"
            data-scroll
            className="text-[32px] md:text-[64px] font-semibold tracking-[-0.05em] leading-[1.08] text-ink"
          >
            Iconic Southern <span className="font-normal text-neutral-400">Routes.</span>
          </h2>
        </div>


      </div>

      {/* Parallax Destinations List */}
      <div className="flex flex-col">
        {destinations.map((section) => (
          <DestinationSectionItem key={section.id} section={section} />
        ))}
      </div>
    </section>
  );
};

export const Component = ParallaxScrollFeatureSection;
