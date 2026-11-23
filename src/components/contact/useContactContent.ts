import { useMemo } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { PAGES } from "@/i18n/pages";

/** The Contact page text in the language of the page. */
export function useContactContent() {
  const { lang } = useLanguage();
  return useMemo(() => PAGES[lang].contact, [lang]);
}
