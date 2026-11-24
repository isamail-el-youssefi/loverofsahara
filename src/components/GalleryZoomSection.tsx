import { ZoomParallax, ParallaxImage } from "@/components/ui/zoom-parallax";
import { ScrollHorizontal, type ScrollHorizontalItem } from "@/components/ui/motion-scroll-horizontal";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowDown, ArrowUpRight, Sparkles } from "lucide-react";
import { OriginButton } from "./ui/origin-button";

// Import local parallax layers provided by user
import { GALLERY_IMAGES, TRAVELER_IMAGES } from "@/data/siteImages";
import skyLayer from "../assets/parallex/backlayer.png";
import duneLayer from "../assets/parallex/midlayer.png";
import womenLayer from "../assets/parallex/frontlayer.png";
// Phones get 1500px WebP copies of the same layers: the 2400px PNGs (about 15MB each once decoded) overflow
// the phone GPU's tile memory during the final zoom, which shows up as white squares flashing in and out.
import skyLayerPhone from "../assets/parallex/backlayer-m.webp";
import duneLayerPhone from "../assets/parallex/midlayer-m.webp";
import womenLayerPhone from "../assets/parallex/frontlayer-m.webp";

const galleryImages: ParallaxImage[] = [
  {
    // [ Img 0 ] - Center hero image that expands to fill the full viewport (3-layer parallax)
    src: GALLERY_IMAGES.dunes,
    alt: "Golden dunes of Erg Chegaga under a clear sky",
  },
  {
    // [ Img 1 ] - Top Right (wide)
    src: TRAVELER_IMAGES.group,
    alt: "A group of travelers posing together on a mountain track",
  },
  {
    // [ Img 2 ] - Top Left (tall)
    src: TRAVELER_IMAGES.bigGroup,
    alt: "A big group of travelers cheering in the dunes with their guide",
  },
  {
    // [ Img 3 ] - Middle Right
    src: TRAVELER_IMAGES.camels,
    alt: "A traveler and camels on a dune under a deep blue sky",
  },
  {
    // [ Img 4 ] - Bottom Right
    src: TRAVELER_IMAGES.trio,
    alt: "Two travelers and their guide in a blue robe on the dunes",
  },
  {
    // [ Img 5 ] - Bottom Left
    src: TRAVELER_IMAGES.picnic,
    alt: "Travelers sharing a tagine picnic in the shade of an acacia",
  },
  {
    // [ Img 6 ] - Bottom Center-Right
    src: TRAVELER_IMAGES.camelCouple,
    alt: "A couple standing with their camel in the sand",
  },
];

// Phone gallery: horizontal scroll through guest photos; the final card is the same
// 3-layer image as the desktop zoom-parallax centre and zooms to full screen with layer parallax.
const phoneItems: ScrollHorizontalItem[] = [
  { src: TRAVELER_IMAGES.bigGroup, alt: "A big group of travelers cheering in the dunes with their guide", label: "Our travelers", location: "Dunes of Erg Chegaga" },
  { src: TRAVELER_IMAGES.picnic, alt: "Travelers sharing a tagine picnic in the shade of an acacia", label: "Desert picnic", location: "Tagine under the acacia" },
  { src: TRAVELER_IMAGES.camelCouple, alt: "A couple standing with their camel in the sand", label: "Camel walk", location: "Sunset in the dunes" },
  { src: TRAVELER_IMAGES.group, alt: "A group of travelers posing together on a mountain track", label: "On the trail", location: "Anti-Atlas tracks" },
];

export function GalleryZoomSection() {
  const isMobile = useIsMobile();

  return (
    <section data-st-01="parallax" className="relative w-full text-white pt-[var(--section-y)] bg-paper">
      {/* Intro Header */}
      <div className="flex flex-col lg:flex-row items-end gap-6 w-full px-4 pb-16 md:px-10">
        <h2
          data-reveal-01="words"
          data-scroll
          className="w-full lg:w-1/2 text-[32px] md:text-[64px] font-semibold tracking-[-0.05em] leading-[1.1] text-ink"
        >
          Happy <span className="font-normal text-neutral-400">travelers.</span>
        </h2>

        <div className="w-full lg:w-1/2 flex justify-between lg:items-end gap-4 lg:text-right">

          <OriginButton
            href="#reviews"
            className="h-10 rounded-[10px] border-neutral-300 px-5 text-sm font-medium text-neutral-900"
          >
            Read the reviews <ArrowUpRight size={16} />
          </OriginButton>
        </div>
      </div>

      {/* Desktop: zoom parallax collage · Phone: horizontal-scroll gallery */}
      {isMobile ? (
        <ScrollHorizontal
          items={phoneItems}
          layers={{ sky: skyLayerPhone, dune: duneLayerPhone, front: womenLayerPhone }}
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
