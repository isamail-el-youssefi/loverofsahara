import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { fadeUp } from "@/lib/animations";
import { ON_PHOTO, type CategoryCard } from "./data";

/**
 * Panels: four tall columns side by side. On desktop the one you point at widens and reveals its line;
 * on a phone they stack. Each carries its number, name and trip count.
 */
export function CategoriesPanels({ cards }: { cards: CategoryCard[] }) {
  return (
    <motion.div {...fadeUp} className="mt-10 flex flex-col gap-[6px] lg:h-[680px] lg:flex-row">
      {cards.map((c, i) => (
        <a
          key={c.name}
          href={c.href}
          className="group relative block h-[320px] overflow-hidden rounded-[10px] outline-none transition-[flex] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-2 focus-visible:ring-ink/50 lg:h-auto lg:flex-1 lg:hover:flex-[2.6] lg:focus-visible:flex-[2.6]"
        >
          <img
            src={c.img}
            alt=""
            width={1024}
            height={1280}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
          />
          <div className={`absolute inset-x-0 top-0 flex items-start justify-between p-6 text-white ${ON_PHOTO}`}>
            <span className="text-[12px] font-medium tabular-nums">{String(i + 1).padStart(2, "0")}</span>
            <ArrowUpRight size={18} aria-hidden className="opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>
          <div className={`absolute inset-x-0 bottom-0 p-6 text-white ${ON_PHOTO}`}>
            <h3 className="text-lg font-semibold">{c.name}</h3>
            <p className="mt-0.5 text-[13px] text-white/85">{c.count}</p>
            <p className="mt-3 hidden max-w-[28ch] text-[14px] leading-[1.45] opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 lg:block">
              {c.blurb}
            </p>
          </div>
        </a>
      ))}
    </motion.div>
  );
}
