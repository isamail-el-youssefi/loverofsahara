import { ZoomParallax, ParallaxImage } from "@/components/ui/zoom-parallax";
import { ScrollHorizontal, type ScrollHorizontalItem } from "@/components/ui/motion-scroll-horizontal";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowDown, ArrowUpRight, Sparkles } from "lucide-react";
import { OriginButton } from "./ui/origin-button";

// Import local parallax layers provided by user
import { GALLERY_IMAGES } from "@/data/siteImages";
import skyLayer from "../assets/parallex/backlayer.png";
import duneLayer from "../assets/parallex/midlayer.png";
import womenLayer from "../assets/parallex/frontlayer.png";

const galleryImages: ParallaxImage[] = [
  {
    // [ Img 0 ] - Center hero image that expands to fill the full viewport
    src: GALLERY_IMAGES.dunes,
    alt: "Golden dunes of Erg Chegaga under a clear sky",

  },
  {
    // [ Img 1 ] - Top Right
    src: GALLERY_IMAGES.tichkaPass,
    alt: "The Tizi n'Tichka pass gate in the High Atlas",

  },
  {
    // [ Img 2 ] - Top Left
    src: GALLERY_IMAGES.campfireStars,
    alt: "Campfire in the dunes under a starry night sky",

  },
  {
    // [ Img 3 ] - Middle Right
    src: GALLERY_IMAGES.aitBenHaddou,
    alt: "The clay ksar of Aït Ben Haddou above its palm-lined river",

  },
  {
    // [ Img 4 ] - Bottom Right
    src: GALLERY_IMAGES.caravan,
    alt: "Camel caravan riding through blowing sand",

  },
  {
    // [ Img 5 ] - Bottom Left
    src: GALLERY_IMAGES.canyon,
    alt: "Red rock canyon and winding river bed at dusk",

  },
  
  {
    // [ Img 6 ] - Bottom Center-Right
    src: GALLERY_IMAGES.desertLunch,
    alt: "Tagine cooking over embers at a desert picnic",

  },
];

// Phone gallery: horizontal scroll through local desert photos; the final card is the same
// 3-layer image as the desktop zoom-parallax centre and zooms to full screen with layer parallax.
const phoneItems: ScrollHorizontalItem[] = [
  { src: GALLERY_IMAGES.todghaGorges, alt: "Road between the sheer rock walls of the Todgha Gorges", label: "Todgha Gorges", location: "Red cliffs & canyons" },
  { src: GALLERY_IMAGES.marrakech, alt: "The Koutoubia minaret and palm trees in Marrakech", label: "Marrakech Medina", location: "Where the journey begins" },
  { src: GALLERY_IMAGES.campfireStars, alt: "Campfire in the dunes under a starry night sky", label: "Sahara Stargazing", location: "Desert bivouac nights" },
  { src: GALLERY_IMAGES.caravan, alt: "Camel caravan riding through blowing sand", label: "Camel Caravans", location: "Sunset in the dunes" },
];

export function GalleryZoomSection() {
  const isMobile = useIsMobile();

  return (
    <section data-st-01="parallax" className="relative w-full text-white pt-24 bg-paper">
      {/* Intro Header */}
      <div className="flex flex-col lg:flex-row items-end gap-6 w-full px-4 pb-16 md:px-10">
        <h2
          data-reveal-01="words"
          data-scroll
          className="w-full lg:w-1/2 text-[32px] md:text-[64px] font-semibold tracking-[-0.05em] leading-[1.1] text-ink"
        >
          Sahara <span className="font-normal text-neutral-400">Stories.</span>
        </h2>

        <div className="w-full lg:w-1/2 flex justify-between lg:items-end gap-4 lg:text-right">

          <OriginButton
            href="/blog"
            className="h-10 rounded-[10px] border-neutral-300 px-5 text-sm font-medium text-neutral-900"
          >
            View all stories <ArrowUpRight size={16} />
          </OriginButton>
        </div>
      </div>

      {/* Desktop: zoom parallax collage · Phone: horizontal-scroll gallery */}
      {isMobile ? (
        <ScrollHorizontal
          items={phoneItems}
          layers={{ sky: skyLayer, dune: duneLayer, front: womenLayer }}
        />
      ) : (
        <ZoomParallax
          images={galleryImages}
          centerLayers={{
            layer1: skyLayer,
            layer2: duneLayer,
            layer4: womenLayer,
          }}
        />
      )}
    </section>
  );
}
