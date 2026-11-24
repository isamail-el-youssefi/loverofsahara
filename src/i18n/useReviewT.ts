import { useLanguage } from "./LanguageProvider";
import { REVIEW_STRINGS, type ReviewStrings } from "./reviewStrings";

/** The reviews section's words, in the language of the page. */
export function useReviewT(): ReviewStrings {
  const { lang } = useLanguage();
  return REVIEW_STRINGS[lang];
}
