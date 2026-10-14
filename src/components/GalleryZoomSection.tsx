import { ZoomParallax, ParallaxImage } from "@/components/ui/zoom-parallax";
import { ArrowDown, ArrowUpRight, Sparkles } from "lucide-react";
import { OriginButton } from "./ui/origin-button";

// Import local parallax layers provided by user
import skyLayer from "../assets/parallex/backlayer.png";
import duneLayer from "../assets/parallex/midlayer.png";
import womenLayer from "../assets/parallex/frontlayer.png";

const galleryImages: ParallaxImage[] = [
  {
    // [ Img 0 ] - Center hero image that expands to fill the full viewport
    src: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1920&q=85",
    alt: "Erg Chegaga endless golden desert dunes at golden hour",

  },
  {
    // [ Img 1 ] - Top Right
    src: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1280&q=80",
    alt: "High Atlas mountain pass serpentine roads",

  },
  {
    // [ Img 2 ] - Top Left
    src: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1280&q=80",
    alt: "Milky Way and clear night sky over desert bivouac",

  },
  {
    // [ Img 3 ] - Middle Right
    src: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1280&q=80",
    alt: "Historic clay architecture of Aït Ben Haddou",

  },
  {
    // [ Img 4 ] - Bottom Right
    src: "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=1280&q=80",
    alt: "Camel caravan moving along the ridgeline of dunes",

  },
  {
    // [ Img 5 ] - Bottom Left
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1280&q=80",
    alt: "Sheer red cliffs of Todgha Gorges",

  },
  
  {
    // [ Img 6 ] - Bottom Center-Right
    src: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1280&q=80",
    alt: "Traditional nomadic camp fireside evening in the desert",

  },
];

export function GalleryZoomSection() {
  return (
    <section className="relative w-full  text-white pt-24">
      {/* Intro Header */}
      <div className="flex flex-col lg:flex-row items-end gap-6 w-full px-4 pb-16 md:px-10">
        <h2 className="w-full lg:w-1/2 text-[32px] md:text-[64px] font-semibold tracking-[-0.05em] leading-[1.1] text-[#141414]">
          Sahara <span className="font-normal text-neutral-400">Stories.</span>
        </h2>

        <div className="w-full lg:w-1/2 flex justify-between lg:items-end gap-4 lg:text-right">
          <p className="text-[16px] font-medium tracking-[-0.03em] text-neutral-500 max-w-sm text-left">
            Insider guides, packing secrets, and stories from our native desert team in Zagora.
          </p>
          <OriginButton
            href="#blog"
            className="h-10 rounded-[10px] border-neutral-300 px-5 text-sm font-medium text-neutral-900"
          >
            View all stories <ArrowUpRight size={16} />
          </OriginButton>
        </div>
      </div>

      {/* 300vh Zoom Parallax Experience */}
      <ZoomParallax 
        images={galleryImages} 
        centerLayers={{
          layer1: skyLayer,
          layer2: duneLayer,
          layer4: womenLayer
        }}
      />
    </section>
  );
}
