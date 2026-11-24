import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Share2, Bookmark } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { OriginButton } from "@/components/ui/origin-button";
import { useLanguage } from "@/i18n/LanguageProvider";
import { PAGES } from "@/i18n/pages";
import { localizedArticles } from "@/data/articles-i18n";
import { aboutPath, articlePath, blogPath, homePath } from "@/lib/routes";
import { usePageSeo } from "@/lib/seo";
import { articleSeo } from "@/lib/seoData";

export function ArticleDetail({ id }: { id: number | null }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const { lang } = useLanguage();
  const t = PAGES[lang].article;
  const articles = localizedArticles(lang);

  const currentIndex = articles.findIndex((a) => a.id === id);
  const article = currentIndex !== -1 ? articles[currentIndex] : articles[0];
  usePageSeo(article ? articleSeo(article, lang) : undefined);

  const nextArticle =
    articles[(currentIndex + 1) % articles.length] || articles[0];

  return (
    <div className="min-h-dvh bg-paper">
      {/* Hero Section - 90vh (Preserving user modifications) */}
      <div className="h-[90dvh] p-[4px]">
        <section className="relative flex h-full flex-col justify-end overflow-hidden rounded-2xl p-6 md:p-10">
          <img
            src={article.img}
            alt={article.alt || article.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

          {/* Same Navbar as HeroSection */}
          <Navbar />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 max-w-[900px] w-full"
          >
            {/* Breadcrumbs */}
            <div className="mb-6 flex items-center gap-2 text-xs font-light text-white/70">
              <a href={homePath(lang)} className="hover:text-white transition">{t.home}</a>
              <span>/</span>
              <a href={blogPath(lang)} className="hover:text-white transition">{t.blog}</a>
              <span>/</span>
              <span className="text-white/90">{article.category}</span>
            </div>

            {/* Category Subheading */}
            <p className="eyebrow mb-4 text-sm font-light text-white/80 uppercase">
              {article.category}
            </p>

            {/* Title */}
            <h1 className="mb-8 text-[2.75rem] font-medium leading-[1] tracking-tighter text-white sm:text-[3.5rem] lg:text-[68px] whitespace-pre-line">
              {article.title}
            </h1>

            {/* Author Info */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-white/80">
              <span>
                {t.by}{" "}
                <a
                  href={aboutPath(lang)}
                  className="text-white underline decoration-white/40 underline-offset-4 transition hover:decoration-white"
                >
                  {article.author}
                </a>
                , {article.authorRole}
              </span>
              <span className="hidden sm:inline text-white/40">|</span>
              <span>{t.published} {article.published}</span>
              <span className="hidden sm:inline text-white/40">|</span>
              <span>{t.updated} {article.updated}</span>
            </div>
          </motion.div>
        </section>
      </div>

      {/* Article Content Layout - Minimalist Editorial */}
      <main className="mx-auto max-w-[760px] px-6 py-16 md:px-8 md:py-20">
        {/* Meta Bar: Read time & Sharing */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-6 text-xs text-neutral-400 font-medium tracking-wide uppercase">
          <div className="flex items-center gap-2 text-neutral-500">
            <Clock size={14} className="text-neutral-400" />
            <span>{article.readTime}</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
              className="flex items-center gap-1.5 hover:text-neutral-900 transition cursor-pointer"
              title={t.shareTitle}
            >
              <Share2 size={14} />
              <span>{t.share}</span>
            </button>
            <button
              className="flex items-center gap-1.5 hover:text-neutral-900 transition cursor-pointer"
              title={t.saveTitle}
            >
              <Bookmark size={14} />
              <span>{t.save}</span>
            </button>
          </div>
        </div>

        {/* Lead Paragraph */}
        <p className="mt-10 text-[20px] md:text-[23px] font-normal leading-[1.6] text-neutral-900 tracking-[-0.015em]">
          {article.lead}
        </p>

        {/* Editorial Sections */}
        <div className="mt-14 space-y-16">
          {article.sections.map((section, sIdx) => (
            <section key={sIdx} className="space-y-6">
              {section.heading && (
                <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-neutral-950 pt-4">
                  {section.heading}
                </h2>
              )}

              {section.paragraphs.map((p, pIdx) => (
                <p
                  key={pIdx}
                  className="text-[17px] leading-[1.8] text-neutral-600 font-normal tracking-[-0.01em]"
                >
                  {p}
                </p>
              ))}

              {/* Minimal Highlight Specs Grid */}
              {section.highlights && (
                <div className="my-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  {section.highlights.map((item, hIdx) => (
                    <div
                      key={hIdx}
                      className="rounded-xl border border-neutral-100 bg-neutral-50/60 p-5 transition hover:border-neutral-200"
                    >
                      <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-neutral-500 font-normal">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Minimalist Quote */}
              {section.quote && (
                <div className="my-10 border-l-2 border-neutral-900 pl-6 py-1">
                  <blockquote className="text-xl md:text-[22px] font-normal italic leading-snug text-neutral-900 tracking-tight">
                    "{section.quote}"
                  </blockquote>
                  {section.quoteAuthor && (
                    <p className="mt-3 text-xs tracking-wider uppercase text-neutral-400 font-medium">
                      — {section.quoteAuthor}
                    </p>
                  )}
                </div>
              )}

              {/* Image Blocks */}
              {section.images && (
                <figure className="my-10 space-y-3">
                  {section.images.aspect === "duo" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="overflow-hidden rounded-xl bg-neutral-100">
                        <img
                          src={section.images.src}
                          alt={section.images.caption || t.imgAlt[0]}
                          className="h-[380px] w-full object-cover transition duration-500 hover:scale-105"
                        />
                        {section.images.caption && (
                          <p className="p-3 text-[11px] leading-tight text-neutral-400 font-mono">
                            {section.images.caption}
                          </p>
                        )}
                      </div>
                      {section.images.secondarySrc && (
                        <div className="overflow-hidden rounded-xl bg-neutral-100">
                          <img
                            src={section.images.secondarySrc}
                            alt={section.images.secondaryCaption || t.imgAlt[1]}
                            className="h-[380px] w-full object-cover transition duration-500 hover:scale-105"
                          />
                          {section.images.secondaryCaption && (
                            <p className="p-3 text-[11px] leading-tight text-neutral-400 font-mono">
                              {section.images.secondaryCaption}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-xl bg-neutral-100">
                      <img
                        src={section.images.src}
                        alt={section.images.caption || t.imgAlt[2]}
                        className="h-[420px] md:h-[500px] w-full object-cover transition duration-500 hover:scale-105"
                      />
                      {section.images.caption && (
                        <figcaption className="mt-3 text-[11px] leading-relaxed text-neutral-400 font-mono">
                          {section.images.caption}
                        </figcaption>
                      )}
                    </div>
                  )}
                </figure>
              )}
            </section>
          ))}
        </div>

        {/* Minimal Author Card */}
        <div className="mt-20 border-t border-neutral-100 pt-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-2xl border border-neutral-100 bg-neutral-50/50 p-6 md:p-8">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                {t.written}
              </span>
              <h3 className="text-lg font-semibold text-neutral-900 tracking-tight">
                {article.author}
              </h3>
              <p className="text-xs text-neutral-500 max-w-sm">
                {t.writtenTail.replace("{role}", article.authorRole)}
              </p>
            </div>
            <OriginButton
              href={blogPath(lang)}
              className="h-9 rounded-xl border border-neutral-300 px-5 text-xs font-medium text-neutral-900"
            >
              {t.allStories}
            </OriginButton>
          </div>
        </div>

        {/* Next Article Navigator */}
        {nextArticle && (
          <div className="mt-14 border-t border-neutral-100 pt-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              {t.next}
            </span>
            <a
              href={articlePath(nextArticle.id, lang)}
              className="group mt-4 flex items-center justify-between gap-4 rounded-2xl border border-neutral-100 p-6 transition hover:border-neutral-300 hover:bg-neutral-50/40"
            >
              <div className="space-y-1">
                <span className="text-[11px] font-medium uppercase tracking-widest text-neutral-400">
                  {nextArticle.category}
                </span>
                <h4 className="text-base md:text-lg font-semibold tracking-tight text-neutral-900 group-hover:text-ink transition">
                  {nextArticle.title.replace("\n", " ")}
                </h4>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 transition group-hover:border-neutral-900 group-hover:bg-neutral-900 group-hover:text-white">
                <ArrowRight size={16} />
              </div>
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
