import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { ARTICLE_IMAGES } from "@/data/siteImages";
import { fadeUp } from "@/lib/animations";
import { OriginButton } from "@/components/ui/origin-button";
import { useLanguage } from "@/i18n/LanguageProvider";

export function ArticlesSection() {
  const a = useLanguage().site.articles;
  const articles = [
    { id: 1, img: ARTICLE_IMAGES.chegagaDunes, alt: a.items[0].alt, title: a.items[0].title, date: a.items[0].meta, link: undefined },
    { id: 2, img: ARTICLE_IMAGES.desertCamp, alt: a.items[1].alt, title: a.items[1].title, date: undefined, link: { text: a.readGuide } },
  ];
  return (
    <section
      data-st-01="parallax"
      data-st-y="250"
      data-st-opacity="0.15"
      className="px-4 py-[var(--section-y)] md:px-10 bg-paper"
    >
      <div className="flex flex-col lg:flex-row items-end gap-6 w-full">
        <h2
          data-reveal-01="words"
          data-scroll
          className="w-full lg:w-1/2 text-[32px] md:text-[64px] font-semibold tracking-[-0.05em] leading-[1.1] text-ink"
        >
          {a.h2a} <span className="font-normal text-neutral-400">{a.h2b}</span>
        </h2>

        <div className="w-full lg:w-1/2 flex justify-between lg:items-end gap-4 lg:text-right">

          <OriginButton
            href="/blog"
            className="h-10 rounded-[10px] border-neutral-300 px-5 text-sm font-medium text-neutral-900"
          >
            {a.viewAll} <ArrowUpRight size={16} />
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
              href={`/blog/${article.id}`}
              className="group block cursor-pointer"
            >
              <div className="h-[660px] overflow-hidden rounded-[10px]">
                <img
                  src={article.img}
                  alt={article.alt}
                  width={1280}
                  height={960}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.02]"
                />
              </div>
              <h3 className="mt-5 text-2xl font-semibold tracking-tight transition group-hover:text-neutral-700">
                {article.title}
              </h3>
              {article.date ? (
                <p className="mt-2 text-sm text-neutral-500">{article.date}</p>
              ) : article.link ? (
                <span className="mt-2 inline-block text-sm text-neutral-500 transition group-hover:text-ink">
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
