import type { SiteStrings } from "@/i18n/site";

/** Where each footer link goes (the same in every language); the words are in site.footer.cols. */
const HREFS = [
  ["/about", "/contact", "/brochures", "/gallery", "#", "#", "#"],
  ["#expeditions", "#expeditions", "#expeditions", "#expeditions", "#expeditions"],
  ["#destinations", "#destinations", "#destinations", "#destinations", "#destinations"],
  ["#process", "#process", "#process", "#process", "#process"],
  ["#", "#", "/blog", "#", "#"],
];

/** The five footer columns in one language. */
export function getFooterCols(site: SiteStrings) {
  return site.footer.cols.map((col, i) => ({
    title: col.title,
    links: col.links.map((name, j) => ({ name, href: HREFS[i]![j]! })),
  }));
}

/** Google reviews shown in the footer. TODO: replace `url` with the Google Business reviews link. */
export const GOOGLE_REVIEWS = {
  rating: 5,
  count: 21,
  url: "#google-reviews-url-to-be-added",
};
