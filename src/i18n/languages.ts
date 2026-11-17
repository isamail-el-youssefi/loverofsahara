import type { Lang } from "@/data/trips/schema";

export type { Lang };
export { LANGS } from "@/data/trips/schema";

export interface LanguageInfo {
  code: Lang;
  /** Name written in the language itself (shown in the picker). */
  native: string;
  /** Value for <html lang>. */
  htmlLang: string;
}

export const LANGUAGES: LanguageInfo[] = [
  { code: "en", native: "English", htmlLang: "en" },
  { code: "fr", native: "Français", htmlLang: "fr" },
  { code: "de", native: "Deutsch", htmlLang: "de" },
  { code: "es", native: "Español", htmlLang: "es" },
  { code: "it", native: "Italiano", htmlLang: "it" },
  { code: "zh", native: "中文", htmlLang: "zh-CN" },
];

export const DEFAULT_LANG: Lang = "en";
export const LANG_STORAGE_KEY = "los-lang";

export const isLang = (v: unknown): v is Lang => LANGUAGES.some((l) => l.code === v);

/** Stored choice, else the browser language if we support it, else English. */
export function detectLang(): Lang {
  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    if (isLang(stored)) return stored;
  } catch {
    /* storage unavailable */
  }
  if (typeof navigator !== "undefined") {
    const prefix = navigator.language?.slice(0, 2).toLowerCase();
    if (isLang(prefix)) return prefix;
  }
  return DEFAULT_LANG;
}
