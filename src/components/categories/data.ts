import { CATEGORY_IMAGES } from "@/data/siteImages";
import { countByCategory, getTrips, type TripCategory } from "@/data/trips";
import type { SiteStrings } from "@/i18n/site";
import type { UiStrings } from "@/i18n/ui";
import { CONTACT_PATH, TRIPS_PATH } from "@/lib/routes";

export interface CategoryCard {
  name: string;
  /** One honest line, taken from the real trip durations. */
  blurb: string;
  img: string;
  href: string;
  /** "11 trips", "1 trip" or "Coming soon". */
  count: string;
}

/** The four cards: what does not change with the language (trip category and photo). Names and blurbs are in site.categories. */
const CARDS: { category: TripCategory | null; img: string }[] = [
  { category: "trip", img: CATEGORY_IMAGES.camps },
  { category: "excursion", img: CATEGORY_IMAGES.fourByFour },
  { category: "trekking", img: CATEGORY_IMAGES.caravans },
  { category: null, img: CATEGORY_IMAGES.yoga },
];

/** The four trip categories with live trip counts. Yoga has no trips yet, so it points to the contact page. */
export function getCategoryCards(site: SiteStrings, ui: UiStrings): CategoryCard[] {
  const counts = countByCategory(getTrips());
  return CARDS.map((c, i) => {
    const n = c.category ? counts[c.category] : 0;
    return {
      name: site.categories.cards[i]!.name,
      blurb: site.categories.cards[i]!.blurb,
      img: c.img,
      href: c.category ? `${TRIPS_PATH}?category=${c.category}` : CONTACT_PATH,
      count: c.category ? ui.showing(n) : site.categories.comingSoon,
    };
  });
}

/** Text on a photo: no dark layer, only a soft shadow on the letters. */
export const ON_PHOTO = "[text-shadow:0_1px_12px_rgba(0,0,0,0.35)]";
