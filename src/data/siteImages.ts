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
  fourByFour: ik("/222.jpg"),
  caravans: ik("/hero/trekking.jpg"),
  draaValley: ik("/trip4.jpg"),
};

/** Home page: the four destinations. */
export const DESTINATION_IMAGES = {
  ergChegaga: ik("/hero/circuit.jpg", 1600),
  dadesValley: ik("/tinghir.jpg", 1600),
  aitBenHaddou: ik("/nature.jpg", 1600),
  todghaGorges: ik("/6jp/day2/9.jpg", 1600),
};

/** Home page gallery (the old site's gallery photos). */
export const GALLERY_IMAGES = {
  dunes: ik("/hero/circuit.jpg", 1920),
  tichkaPass: ik("/6666.jpg", 1280),
  campfireStars: ik("/10007.jpg", 1280),
  aitBenHaddou: ik("/3333.jpg", 1280),
  caravan: ik("/10004.jpg", 1280),
  canyon: ik("/10002.jpg", 1280),
  desertLunch: ik("/11-1.jpg", 1280),
  todghaGorges: ik("/6jp/day2/9.jpg", 1280),
  marrakech: ik("/hero/marrakech.jpg", 1280),
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
export const CONTACT_HERO = ik("/contact3.jpg", 2000);
