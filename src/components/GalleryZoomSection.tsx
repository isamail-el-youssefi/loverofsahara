import { ZoomParallax, ParallaxImage } from "@/components/ui/zoom-parallax";
import { ScrollHorizontal, type ScrollHorizontalItem } from "@/components/ui/motion-scroll-horizontal";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowDown, ArrowUpRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { PAGES } from "@/i18n/pages";
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

const buildGalleryImages = (alts: string[]): ParallaxImage[] => [
  {
    // [ Img 0 ] - Center hero image that expands to fill the full viewport (3-layer parallax)
    src: GALLERY_IMAGES.dunes,
    alt: alts[0] ?? "",
  },
  {
    // [ Img 1 ] - Top Right (wide)
    src: TRAVELER_IMAGES.group,
    alt: alts[1] ?? "",
  },
  {
    // [ Img 2 ] - Top Left (tall)
    src: TRAVELER_IMAGES.bigGroup,
    alt: alts[2] ?? "",
  },
  {
    // [ Img 3 ] - Middle Right
    src: TRAVELER_IMAGES.camels,
    alt: alts[3] ?? "",
  },
  {
    // [ Img 4 ] - Bottom Right
    src: TRAVELER_IMAGES.trio,
    alt: alts[4] ?? "",
  },
  {
    // [ Img 5 ] - Bottom Left
    src: TRAVELER_IMAGES.picnic,
    alt: alts[5] ?? "",
  },
  {
    // [ Img 6 ] - Bottom Center-Right
    src: TRAVELER_IMAGES.camelCouple,
    alt: alts[6] ?? "",
  },
];

// Phone gallery: horizontal scroll through guest photos; the final card is the same
// 3-layer image as the desktop zoom-parallax centre and zooms to full screen with layer parallax.
const buildPhoneItems = (p: { alt: string; label: string; location: string }[]): ScrollHorizontalItem[] => [
  { src: TRAVELER_IMAGES.bigGroup, alt: p[0]?.alt ?? "", label: p[0]?.label ?? "", location: p[0]?.location ?? "" },
  { src: TRAVELER_IMAGES.picnic, alt: p[1]?.alt ?? "", label: p[1]?.label ?? "", location: p[1]?.location ?? "" },
  { src: TRAVELER_IMAGES.camelCouple, alt: p[2]?.alt ?? "", label: p[2]?.label ?? "", location: p[2]?.location ?? "" },
  { src: TRAVELER_IMAGES.group, alt: p[3]?.alt ?? "", label: p[3]?.label ?? "", location: p[3]?.location ?? "" },
];

export function GalleryZoomSection() {
  const isMobile = useIsMobile();
  const { lang } = useLanguage();
  const t = PAGES[lang].home.collage;
  const galleryImages = buildGalleryImages(t.alts);
  const phoneItems = buildPhoneItems(t.phone);

  return (
    <section data-st-01="parallax" className="relative w-full text-white pt-[var(--section-y)] bg-paper">
      {/* Intro Header */}
      <div className="flex flex-col lg:flex-row items-end gap-6 w-full px-4 pb-16 md:px-10">
        <h2
          data-reveal-01="words"
          data-scroll
          className="w-full lg:w-1/2 text-[32px] md:text-[64px] font-semibold tracking-[-0.05em] leading-[1.1] text-ink"
        >
          {t.h2a} <span className="font-normal text-neutral-400">{t.h2b}</span>
        </h2>

        <div className="w-full lg:w-1/2 flex justify-between lg:items-end gap-4 lg:text-right">

          <OriginButton
            href="#reviews"
            className="h-10 rounded-[10px] border-neutral-300 px-5 text-sm font-medium text-neutral-900"
          >
            {t.button} <ArrowUpRight size={16} />
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
