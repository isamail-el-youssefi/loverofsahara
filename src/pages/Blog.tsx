import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { Navbar } from "@/components/Navbar";
import { usePageSeo } from "@/lib/seo";
import { blogSeo } from "@/lib/seoData";
import { useLanguage } from "@/i18n/LanguageProvider";
import { PAGES } from "@/i18n/pages";
import { localizedArticles } from "@/data/articles-i18n";
import { articlePath } from "@/lib/routes";

export function Blog() {
  const { lang } = useLanguage();
  usePageSeo(blogSeo(lang));
  const t = PAGES[lang].blog;
  const articles = localizedArticles(lang);

  return (
    <div className="relative py-44">
      <Navbar theme="light" />
      <section className="px-4 md:px-10">
        <div className="flex flex-col lg:flex-row items-end gap-6 w-full pb-14">
          <h2 className="w-full lg:w-1/2 text-[32px] md:text-[55px] font-semibold tracking-[-0.05em] leading-[1.1] text-ink">
            {t.h2}
          </h2>

          <div className="w-full lg:w-1/2 flex justify-between lg:items-end gap-4 lg:text-right">
            <p className="text-[16px] font-medium tracking-[-0.03em] text-neutral-500 max-w-sm text-left">
              {t.lead}
            </p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-x-[6px] gap-y-[12px] md:grid-cols-2">
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: index * 0.08 }}
            >
              <a
                href={articlePath(article.id, lang)}
                className="group block cursor-pointer"
              >
                <div className="h-[570px] overflow-hidden rounded-lg">
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
                {article.listMeta ? (
                  <p className="mt-1 text-sm text-neutral-500">{article.listMeta}</p>
                ) : null}
              </a>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
