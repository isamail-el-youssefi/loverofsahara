import { CATEGORY_IMAGES } from "@/data/siteImages";
import { countByCategory, getTrips, type TripCategory } from "@/data/trips";
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

const CARDS: { name: string; blurb: string; category: TripCategory | null; img: string }[] = [
  { name: "Circuits", blurb: "Private multi-day journeys, from 2 to 7 days.", category: "trip", img: CATEGORY_IMAGES.camps },
  { name: "Excursions", blurb: "Short desert escapes, from 1 to 3 days.", category: "excursion", img: CATEGORY_IMAGES.fourByFour },
  { name: "Trekking", blurb: "A week on foot through the desert.", category: "trekking", img: CATEGORY_IMAGES.caravans },
  { name: "Yoga", blurb: "Yoga in the desert.", category: null, img: CATEGORY_IMAGES.draaValley },
];

/** The four trip categories with live trip counts. Yoga has no trips yet, so it points to the contact page. */
export function getCategoryCards(): CategoryCard[] {
  const counts = countByCategory(getTrips());
  return CARDS.map((c) => {
    const n = c.category ? counts[c.category] : 0;
    return {
      name: c.name,
      blurb: c.blurb,
      img: c.img,
      href: c.category ? `${TRIPS_PATH}?category=${c.category}` : CONTACT_PATH,
      count: c.category ? `${n} ${n === 1 ? "trip" : "trips"}` : "Coming soon",
    };
  });
}

/** Text on a photo: no dark layer, only a soft shadow on the letters. */
export const ON_PHOTO = "[text-shadow:0_1px_12px_rgba(0,0,0,0.35)]";
