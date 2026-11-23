/**
 * Every photo the site shows outside the trip pages, in one place.
 *
 * All of them live in the owner's ImageKit library (the same one the old site used). Where the old site had
 * the same slot, the same photo is used (trip cards: see `cardImage` in trips.meta.json; contact page hero);
 * the other slots are filled from that library by subject. To swap a photo, change its path here. List the
 * library with `npm run imagekit:list`.
 */
import { tripImage } from "@/data/trips/media";

/** ImageKit path -> URL, resized on the fly to `w` pixels wide. */
const ik = (path: string, w = 1400) => tripImage(path, w) as string;

/** Home page: the four expedition cards. */
export const CATEGORY_IMAGES = {
  camps: ik("/trip5.jpg"),
  fourByFour: ik("/card/11.jpg"), // golden dunes with a tiny camel party: a short escape, not a caravan
  caravans: ik("/hero/trekking.jpg"),
  yoga: ik("/hero/yoga.jpg"),
};

/**
 * Trips dropdown, "By departure": one photo that shows each city (or, for M'hamid, the dunes it leads to).
 * Keys are the `departureCity` values in trips.meta.json; a city not listed here falls back to the photo of
 * its first trip.
 */
export const CITY_IMAGES: Record<string, string> = {
  marrakech: ik("/hero/marrakech.jpg", 900),
  zagora: ik("/hero/zagora.jpg", 900),
  agadir: ik("/card/20.jpg", 900), // the Legzira arch on the Atlantic coast
  ouarzazate: ik("/hero/ouarzazate.jpg", 900),
  "mhamid el ghizlane": ik("/hero/circuit.jpg", 900),
};

/** Home page: the four destinations. */
export const DESTINATION_IMAGES = {
  ergChegaga: ik("/hero/circuit.jpg", 1600),
  dadesValley: ik("/tinghir.jpg", 1600),
  aitBenHaddou: ik("/nature.jpg", 1600),
  todghaGorges: ik("/6jp/day2/9.jpg", 1600),
};

/** Home page "About us" photo: a sharp 3000 px original, asked for large because only the middle of it shows in the portrait frame. */
export const ABOUT_PHOTO = ik("/10004.jpg", 2400);

/** Home page call to action ("Photo" design): the sunset desert camp, a sharp 3000 px original. */
export const CTA_PHOTO = ik("/trip5.jpg", 2400);

/** Home page gallery (the old site's gallery photos). */
export const GALLERY_IMAGES = {
  dunes: ik("/hero/circuit.jpg", 1920),
};

/** Home "Happy travelers" zoom collage: photos sent by guests (the old site's "Happy travelers" carousel). */
export const TRAVELER_IMAGES = {
  group: ik("/2.jpg", 1280),
  bigGroup: ik("/8.jpg", 1280),
  camels: ik("/6.jpg", 1280),
  trio: ik("/1.jpg", 1280),
  picnic: ik("/11-1.jpg", 1280),
  camelCouple: ik("/9.jpg", 1280),
};

/** Blog: one cover per article, plus the photos inside the articles. */
export const ARTICLE_IMAGES = {
  chegagaDunes: ik("/card/12.jpg", 1600),
  desertCamp: ik("/10001.jpg", 1600),
  irikiCrossing: ik("/10006.jpg", 1600),
  teaCeremony: ik("/3.jpg", 1600),
  duneCrests: ik("/hero/ex.jpg", 1600),
  bivouac: ik("/card/1.jpg", 1600),
  bivouacWide: ik("/card/6.jpg", 1600),
  desertGarments: ik("/general.jpg", 1600),
  expeditionVehicle: ik("/10003.jpg", 1600),
  irikiPlain: ik("/card/2.jpg", 1600),
  mintTea: ik("/2222.jpg", 1600),
};

/** Contact page hero (the old contact page's photo). */
export const CONTACT_HERO = ik("/10001.jpg", 2000);
