import { ArrowUpRight } from "lucide-react";
import { getCategoryCards } from "@/components/categories/data";
import { CategoriesIndex } from "@/components/categories/CategoriesIndex";
import { CategoriesPanels } from "@/components/categories/CategoriesPanels";
import { OriginButton } from "@/components/ui/origin-button";

/**
 * The trip categories (Circuits, Excursions, Trekking, Yoga) with live trip counts.
 * Desktop: tall panels that widen on hover. Below the lg breakpoint (phones and tablets): an index list.
 */
export function CategoriesSection() {
  const cards = getCategoryCards();
  return (
    <section
      id="expeditions"
      data-st-01="parallax"
      data-st-y="250"
      data-st-opacity="0.15"
      className="px-4 py-30 md:px-10 bg-paper"
    >
      <div className="flex flex-col lg:flex-row items-end gap-6 w-full">
        <h2
          data-reveal-01="words"
          data-scroll
          className="w-full lg:w-1/2 text-[32px] md:text-[64px] font-semibold tracking-[-0.05em] leading-[1.1] text-ink"
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

      <div className="hidden lg:block">
        <CategoriesPanels cards={cards} />
      </div>
      <div className="lg:hidden">
        <CategoriesIndex cards={cards} />
      </div>
    </section>
  );
}
