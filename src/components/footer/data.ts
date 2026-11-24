import type { SiteStrings } from "@/i18n/site";
import { localePath } from "@/lib/routes";

/** Where each footer link goes (the same in every language); the words are in site.footer.cols. */
const HREFS = [
  ["/about", "/contact", "/brochures", "/gallery", "/about", "/places/zagora", "/about"],
  [
    "/trips/erg-chegaga-2-day-immersion",
    "/trips/zagora-erg-chegaga-3-day-excursion",
    "/trips/marrakech-erg-chegaga-4-day-crossing",
    "/trips/erg-chegaga-1-day-excursion",
    "/trips",
  ],
  ["/places/zagora", "/places/erg-chegaga", "/places/mhamid", "/places/lake-iriki", "/places/tamgroute"],
  [
    "/trips",
    "/trips/4-day-nomadic-sahara-circuit",
    "/trips/2-day-desert-getaway",
    "/gallery",
    "/trips/7-day-sahara-trekking",
  ],
  ["/contact", "/contact", "/blog/2", "/blog", "/contact"],
];

/** The five footer columns in one language. */
export function getFooterCols(site: SiteStrings, lang = "en") {
  return site.footer.cols.map((col, i) => ({
    title: col.title,
    links: col.links.map((name, j) => ({ name, href: localePath(lang, HREFS[i]![j]!) })),
  }));
}

/** Google reviews shown in the footer, the about and contact pages. */
export const GOOGLE_REVIEWS = {
  rating: 5,
  count: 21,
  url: "https://share.google/TPVHGDGZ2Re5lZA3H",
};
