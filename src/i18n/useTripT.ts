import { useLanguage } from "./LanguageProvider";
import { TRIP_STRINGS, type TripStrings } from "./tripStrings";

/** The trip page's own words, in the language of the page. */
export function useTripT(): TripStrings {
  const { lang } = useLanguage();
  return TRIP_STRINGS[lang];
}
