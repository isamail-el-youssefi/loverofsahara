import type { Lang } from "@/i18n/languages";
import { blogArticles, type ArticleData } from "../articles";
import { de } from "./de";
import { es } from "./es";
import { fr } from "./fr";
import { it } from "./it";
import type { ArticleTexts, SectionText } from "./types";
import { zh } from "./zh";

const TEXTS: Record<Exclude<Lang, "en">, ArticleTexts> = { fr, de, es, it, zh };

/** What the blog list shows for the English articles (photo description and the line under the title). */
const EN_LIST: Record<number, { alt: string; listMeta: string }> = {
  1: { alt: "Vast golden sand dunes of Erg Chegaga under open sky", listMeta: "Desert Guide • Oct 14, 2025" },
  2: { alt: "Nomad tents of a desert camp in the Sahara near Zagora", listMeta: "Packing Guide • Nov 02, 2025" },
  3: { alt: "A 4x4 and a resting camel on the open desert plain near Erg Chegaga", listMeta: "Adventure • Nov 20, 2025" },
  4: { alt: "A teapot on the embers during a desert picnic in the Sahara", listMeta: "Culture • Dec 05, 2025" },
};

export type LocalizedArticle = ArticleData & { alt: string; listMeta: string };

/** One article in one language: the photos and the order of the sections come from `data/articles.ts`, the words from here. */
export function localizeArticle(a: ArticleData, lang: Lang): LocalizedArticle {
  const en = EN_LIST[a.id] ?? { alt: a.title, listMeta: a.category };
  const t = lang === "en" ? undefined : TEXTS[lang][a.id];
  if (!t) return { ...a, ...en };
  return {
    ...a,
    category: t.category,
    title: t.title,
    authorRole: t.authorRole,
    published: t.published,
    updated: t.updated,
    readTime: t.readTime,
    lead: t.lead,
    alt: t.alt,
    listMeta: t.listMeta,
    sections: a.sections.map((s, i) => {
      const x: SectionText | undefined = t.sections[i];
      if (!x) return s;
      return {
        ...s,
        ...(x.heading !== undefined ? { heading: x.heading } : {}),
        paragraphs: x.paragraphs,
        ...(x.quote !== undefined ? { quote: x.quote } : {}),
        ...(x.quoteAuthor !== undefined ? { quoteAuthor: x.quoteAuthor } : {}),
        ...(x.highlights ? { highlights: x.highlights } : {}),
        ...(s.images
          ? {
              images: {
                ...s.images,
                ...(x.caption !== undefined ? { caption: x.caption } : {}),
                ...(x.secondaryCaption !== undefined ? { secondaryCaption: x.secondaryCaption } : {}),
              },
            }
          : {}),
      };
    }),
  };
}

/** All articles in one language. */
export const localizedArticles = (lang: Lang): LocalizedArticle[] => blogArticles.map((a) => localizeArticle(a, lang));
