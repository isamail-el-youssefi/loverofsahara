import { useMemo } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { getFooterCols } from "./data";

/** The footer columns in the language of the page. */
export function useFooterCols() {
  const { site } = useLanguage();
  return useMemo(() => getFooterCols(site), [site]);
}
