/**
 * The downloadable brochures. The list, titles, page counts and sizes come from `brochures.json`, which
 * `brochures/tools/make-site-assets.py` writes after the PDFs are built (it also renders the cover images).
 */
import raw from "./brochures.json";
import type { Lang } from "@/i18n/languages";

export type BrochureGroup = "region" | "theme";

export interface BrochureLang {
  title: string;
  kicker: string;
  subtitle: string;
  pages: number;
  /** File size in megabytes. */
  mb: number;
}

export interface Brochure {
  slug: string;
  group: BrochureGroup;
  langs: Partial<Record<Lang, BrochureLang>>;
}

export const BROCHURES = raw as Brochure[];

export const brochurePdf = (slug: string, lang: Lang) => `/brochures/${slug}-${lang}.pdf`;
export const brochureCover = (slug: string, lang: Lang) => `/brochures/covers/${slug}-${lang}.jpg`;

/** The brochure in `lang`, falling back to English if that language is missing. */
export function brochureIn(b: Brochure, lang: Lang): { lang: Lang; info: BrochureLang } {
  const info = b.langs[lang];
  if (info) return { lang, info };
  return { lang: "en", info: b.langs.en! };
}

export const brochuresIn = (group: BrochureGroup) => BROCHURES.filter((b) => b.group === group);
