import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import catWomen from "@/assets/cat-women.jpg";
import catJacket from "@/assets/cat-jacket.jpg";
import catMen from "@/assets/cat-men.jpg";
import catShoes from "@/assets/cat-shoes.jpg";
import { fadeUp } from "@/lib/animations";
import { OriginButton } from "@/components/ui/origin-button";

const categories = [
  { img: catWomen, title: "Erg Chegaga Luxury Desert Camps & Stargazing Bivouacs" },
  { img: catJacket, title: "4x4 Off-Road Sahara Expeditions & Lake Iriki Crossings" },
  { img: catMen, title: "Sunset Camel Caravans & Nomadic Desert Treks" },
  { img: catShoes, title: "Draa Valley, Ancient Kasbahs & Zagora Oasis Circuits" },
];

export function CategoriesSection() {
  return (
    <section
      id="expeditions"
      data-st-01="parallax"
      data-st-y="250"
      data-st-opacity="0.15"
      className="px-4 py-30 md:px-10 bg-white"
    >
      <div className="flex flex-col lg:flex-row items-end gap-6 w-full">
        <h2
          data-reveal-01="words"
          data-scroll
          className="w-full lg:w-1/2 text-[32px] md:text-[64px] font-semibold tracking-[-0.05em] leading-[1.1] text-[#141414]"
        >
          Sahara Desert <span className="font-normal text-neutral-400">Expeditions.</span>
        </h2>

        <div className="w-full lg:w-1/2 flex justify-between lg:items-end gap-4 lg:text-right">

          <OriginButton
            href="#itinerary"
            className="h-10 rounded-[10px] border-neutral-300 px-5 text-sm font-medium text-neutral-900"
          >
            Explore itineraries <ArrowUpRight size={16} />
          </OriginButton>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-[6px] md:grid-cols-2 ">
        {categories.map((c, i) => (
          <motion.article
            key={c.title}
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: (i % 2) * 0.08 }}
            className="group relative h-[650px] overflow-hidden rounded-[10px] "
          >
            <img
              src={c.img}
              alt={c.title}
              width={1024}
              height={1280}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <h3 className="absolute bottom-0 left-0 p-6 text-lg font-semibold text-white">
              {c.title}
            </h3>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
