import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { fadeUp } from "@/lib/animations";
import type { CategoryCard } from "./data";

/**
 * Index (phones and tablets): an editorial list. Big names on hairline rules, each with a small photo,
 * its one-line description and its trip count. No text sits on a photo.
 */
export function CategoriesIndex({ cards }: { cards: CategoryCard[] }) {
  return (
    <motion.ol {...fadeUp} className="mt-10 border-b border-ink/10">
      {cards.map((c, i) => (
        <li key={c.name} className="border-t border-ink/10">
          <a href={c.href} className="group flex items-center gap-4 py-6 outline-none md:gap-6 md:py-9">
            <span className="w-7 shrink-0 text-[12px] font-medium tabular-nums text-neutral-400">
              {String(i + 1).padStart(2, "0")}
            </span>
            <img
              src={c.img}
              alt=""
              width={160}
              height={160}
              loading="lazy"
              className="h-14 w-14 shrink-0 rounded-[8px] object-cover md:h-20 md:w-20"
            />
            <span className="min-w-0 flex-1">
              <span className="block text-[34px] font-semibold leading-[1.02] tracking-[-0.045em] text-ink md:text-[56px]">
                {c.name}
              </span>
              <span className="mt-1 block text-[13px] text-neutral-500">
                {c.count} <span aria-hidden>·</span> {c.blurb}
              </span>
            </span>
            <ArrowUpRight
              size={22}
              aria-hidden
              className="shrink-0 text-ink transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </li>
      ))}
    </motion.ol>
  );
}
