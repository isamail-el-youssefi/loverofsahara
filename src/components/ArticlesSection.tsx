import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import article1 from "@/assets/article-1.jpg";
import article2 from "@/assets/article-2.jpg";
import { fadeUp } from "@/lib/animations";
import { OriginButton } from "@/components/ui/origin-button";

const articles = [
  {
    id: 1,
    img: article1,
    alt: "Vast golden sand dunes of Erg Chegaga under open sky",
    title: "Erg Chegaga vs Erg Chebbi: Why Morocco's Wildest Dunes Win (2026)",
    date: "Desert Guide • 6 min read",
  },
  {
    id: 2,
    img: article2,
    alt: "Traditional nomadic camp under the Milky Way stars in the Sahara",
    title: "What to Pack for a Night in the Zagora Sahara Desert: The Complete Checklist",
    link: { text: "Read guide →", href: "#article/2" },
  },
];

export function ArticlesSection() {
  return (
    <section className="px-4 py-30 md:px-10">
      <div className="flex flex-col lg:flex-row items-end gap-6 w-full">
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

      <div className="mt-10 grid grid-cols-1 gap-[6px] md:grid-cols-2">
        {articles.map((article, index) => (
          <motion.div
            key={article.id}
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: index * 0.08 }}
          >
            <a
              href={`#article/${article.id}`}
              className="group block cursor-pointer"
            >
              <div className="h-[600px] overflow-hidden rounded-lg">
                <img
                  src={article.img}
                  alt={article.alt}
                  width={1280}
                  height={960}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-105"
                />
              </div>
              <h3 className="mt-5 text-xl font-semibold tracking-tight transition group-hover:text-neutral-700">
                {article.title}
              </h3>
              {article.date ? (
                <p className="mt-2 text-sm text-neutral-500">{article.date}</p>
              ) : article.link ? (
                <span className="mt-2 inline-block text-sm text-neutral-500 transition group-hover:text-black">
                  {article.link.text}
                </span>
              ) : null}
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
