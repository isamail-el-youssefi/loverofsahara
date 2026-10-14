'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';

export interface ParallaxImage {
  src: string;
  alt?: string;
  title?: string;
  location?: string;
}

export interface CenterParallaxLayers {
  layer1?: string; // Deep background (e.g. sky/distant mountains)
  layer2?: string; // Midground hills
  layer4?: string; // Foreground rocks
}

export interface ZoomParallaxProps {
  /** Array of images to be displayed in the parallax effect (up to 7 images) */
  images: ParallaxImage[];
  /** Optional title to reveal inside [Img 0] once it reaches 100% viewport */
  centerTitle?: string;
  centerSubtitle?: string;
  centerLayers?: CenterParallaxLayers;
}

export function ZoomParallax({
  images,
  centerTitle = "SAHARA DESERT",
  centerSubtitle = "Where The Dunes Meet The Sky",
  centerLayers,
}: ZoomParallaxProps) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  // Phase 1 (0 to 0.35): Zoom collage into full viewport
  // Phase 2 (0.35 to 1.0): Pin at 100% viewport & trigger multi-layer parallax inside [Img 0]
  const scaleCenter = useTransform(scrollYProgress, [0, 0.35, 1], [1, 4, 4]);

  // Peripheral image scales and fadeout
  const scale5 = useTransform(scrollYProgress, [0, 0.35], [1, 5.2]);
  const scale6 = useTransform(scrollYProgress, [0, 0.35], [1, 6.5]);
  const scale8 = useTransform(scrollYProgress, [0, 0.35], [1, 8.2]);
  const scale9 = useTransform(scrollYProgress, [0, 0.35], [1, 9.5]);
  const peripheralOpacity = useTransform(scrollYProgress, [0, 0.28, 0.35], [1, 0.8, 0]);

  const scales = [scaleCenter, scale5, scale6, scale5, scale6, scale8, scale9];

  // Center image transitions: border-radius vanishes as it expands to full screen
  const borderRadius0 = useTransform(scrollYProgress, [0, 0.3], ['16px', '0px']);

  // Parallax transforms inside [ Img 0 ] (Active from 0.35 to 1.0)
  // We use smaller percentage movements because they are relative to the oversized 160% height container
  const yLayer1 = useTransform(scrollYProgress, [0.35, 1], ['0%', '8%']); // Sky moves down
  const yLayer2 = useTransform(scrollYProgress, [0.35, 1], ['0%', '-5%']); // Mountain moves up slightly
  const yTitle = useTransform(scrollYProgress, [0.35, 1], ['0%', '-10%']); // Title rises up
  const opacityTitle = useTransform(scrollYProgress, [0.30, 0.40], [0, 1]);
  const yLayer4 = useTransform(scrollYProgress, [0.35, 1], ['0%', '-15%']); // Man & Rocks moves up faster

  // Default Sahara multi-layer assets
  const layer1Src =
    centerLayers?.layer1 ||
    "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1920&q=85"; // Sky and distant dunes
  const layer2Src =
    centerLayers?.layer2 ||
    "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=1920&q=85"; // Midground camel caravan
  const layer4Src =
    centerLayers?.layer4 ||
    "https://images.unsplash.com/photo-1682687220198-88e9bdea9931?auto=format&fit=crop&w=1920&q=85"; // Foreground sand ripples

  return (
    <div ref={container} className="relative h-[380vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden  ">
        {images.map(({ src, alt }, index) => {
          const isCenterImage = index === 0;
          const scale = isCenterImage ? scaleCenter : scales[index % scales.length];

          return (
            <motion.div
              key={index}
              style={{
                scale,
                opacity: isCenterImage ? 1 : peripheralOpacity,
              }}
              className={`absolute top-0 left-0 flex h-full w-full items-center justify-center pointer-events-none ${
                index === 1
                  ? '[&>div]:!-top-[30vh] [&>div]:!left-[5vw] [&>div]:!h-[30vh] [&>div]:!w-[35vw]'
                  : ''
              } ${
                index === 2
                  ? '[&>div]:!-top-[10vh] [&>div]:!-left-[25vw] [&>div]:!h-[45vh] [&>div]:!w-[20vw]'
                  : ''
              } ${
                index === 3
                  ? '[&>div]:!left-[27.5vw] [&>div]:!h-[25vh] [&>div]:!w-[25vw]'
                  : ''
              } ${
                index === 4
                  ? '[&>div]:!top-[27.5vh] [&>div]:!left-[5vw] [&>div]:!h-[25vh] [&>div]:!w-[20vw]'
                  : ''
              } ${
                index === 5
                  ? '[&>div]:!top-[27.5vh] [&>div]:!-left-[22.5vw] [&>div]:!h-[25vh] [&>div]:!w-[30vw]'
                  : ''
              } ${
                index === 6
                  ? '[&>div]:!top-[22.5vh] [&>div]:!left-[25vw] [&>div]:!h-[15vh] [&>div]:!w-[15vw]'
                  : ''
              }`}
            >
              <motion.div
                style={isCenterImage ? { borderRadius: borderRadius0 } : undefined}
                className={`relative h-[25vh] w-[25vw] overflow-hidden shadow-2xl transition-all duration-300 ${
                  isCenterImage
                    ? ' ring-0 bg-transparent md:px-[1px] '
                    : 'rounded-[10px] bg-neutral-900 '
                }`}
              >
                {isCenterImage ? (
                  /* [ Img 0 ] Multi-Layer 3D Parallax Cutout Layers */
                  <div className="relative h-full w-full overflow-hidden bg-neutral-950 rounded-[inherit]">
                    {/* Oversized container to prevent exposing edges during heavy parallax translation */}
                    <div className="absolute -top-[30%] -left-[10%] h-[160%] w-[120%]">
                      {/* Layer 1 (Sky / Deepest Background) */}
                      <motion.div
                        style={{ y: yLayer1 }}
                        className="absolute inset-0 h-full w-full will-change-transform pointer-events-none"
                      >
                        <img
                          src={layer1Src}
                          alt="Parallax layer background sky"
                          className="h-full w-full object-cover object-center select-none"
                          loading="eager"
                        />
                      </motion.div>

                      {/* Layer 2 (Midground Mountain/Dunes) */}
                      <motion.div
                        style={{ y: yLayer2 }}
                        className="absolute inset-0 h-full w-full will-change-transform pointer-events-none"
                      >
                        <img
                          src={layer2Src}
                          alt="Parallax layer midground dunes"
                          className="h-full w-full object-cover object-center select-none"
                          loading="eager"
                        />
                      </motion.div>

                      {/* Layer 3 (Title Sandwich Layer) */}
                      <motion.div
                        style={{
                          y: yTitle,
                          opacity: opacityTitle,
                        }}
                        className="absolute inset-0 z-10 flex flex-col items-start justify-center  md:px-16 pb-16 will-change-transform pointer-events-none"
                      >
                        <div className="select-none text-center">
                          <h2 className="text-[10px] md:text-3xl font-black uppercase tracking-[-0.04em] leading-[0.88] text-amber-900/50 drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)]">
                            {centerTitle}
                          </h2>
                          {centerSubtitle && (
                            <p className="md:mt-3 mt-[2px] text-[8px] sm:text-base md:text-xs font-bold tracking-[-0.01em] leading-[0.88] md:leading-0 uppercase px-6 md:px-0 md:text-amber-900/50 text-amber-900/60 drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)]">
                              {centerSubtitle}
                            </p>
                          )}
                        </div>
                      </motion.div>

                      {/* Layer 4 (Foreground Man & Rocks / Sand Ripples) */}
                      <motion.div
                        style={{ y: yLayer4 }}
                        className="absolute inset-0 z-20 h-full w-full will-change-transform pointer-events-none"
                      >
                        <img
                          src={layer4Src}
                          alt="Parallax layer foreground sand"
                          className="h-full w-full object-cover object-center select-none"
                          loading="eager"
                        />
                      </motion.div>
                    </div>
                  </div>
                ) : (
                  /* Peripheral Images 1..6 */
                  <img
                    src={src || '/placeholder.svg'}
                    alt={alt || `Parallax image ${index + 1}`}
                    className="h-full w-full object-cover select-none"
                    loading="lazy"
                  />
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

