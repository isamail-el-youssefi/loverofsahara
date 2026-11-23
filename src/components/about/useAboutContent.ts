import { useMemo } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { aboutContent } from "./content";

/** The About text in the language of the page. */
export function useAboutContent() {
  const { lang } = useLanguage();
  return useMemo(() => aboutContent(lang), [lang]);
}
