import caravan from "@/assets/article-1.jpg";
import dunes from "@/assets/cat-jacket.jpg";
import canyon from "@/assets/cat-women.jpg";
import stars from "@/assets/article-2.jpg";
import souk from "@/assets/red-stitch.jpg";
import atlantic from "@/assets/sewing.jpg";
import type { CoverKey } from "./schema";
import { TRIP_HERO } from "./heroes";

/** Placeholder covers until the real trip photos are available (the old site served them from ImageKit). */
const COVERS: Record<CoverKey, string> = { caravan, dunes, canyon, stars, souk, atlantic };

export const getCover = (key: CoverKey) => COVERS[key];

/** The old site's ImageKit endpoint (found in its review image URLs). Trip photos live under it. */
export const TRIP_IMAGE_BASE: string = "https://ik.imagekit.io/loverofsahara";

/** Turns a path from `trips.legacy-media.json` into a real URL (adds a missing leading slash, encodes spaces). */
export const resolveLegacyImage = (path: string) => {
  if (!TRIP_IMAGE_BASE) return undefined;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${TRIP_IMAGE_BASE.replace(/\/$/, "")}${clean.split("/").map(encodeURIComponent).join("/")}`;
};

/** Same as `resolveLegacyImage`, sized by ImageKit on the fly (`w` = pixel width). */
export const tripImage = (path: string, w = 1600) => {
  const url = resolveLegacyImage(path);
  return url ? `${url}?tr=w-${w},q-80` : undefined;
};

/**
 * Sharp landscape hero for desktop (see heroes.ts), or undefined when the trip has none.
 * A local file comes back as a root-relative path, an ImageKit photo as a resized URL.
 */
export const tripHeroSrc = (slug: string, w = 2000) => {
  const hero = TRIP_HERO[slug];
  if (!hero) return undefined;
  return hero.local ?? (hero.ik ? tripImage(hero.ik, w) : undefined);
};

/** Old image paths per trip (lazy: it is a large file only the detail page needs). */
export const loadLegacyMedia = () =>
  import("./trips.legacy-media.json").then((m) => m.default as Record<string, import("./schema").LegacyMedia>);

/** Real cover for a trip: the first itinerary photo from the old site (placeholder until it loads). */
let legacyCache: Promise<Record<string, import("./schema").LegacyMedia>> | undefined;
export const loadLegacyMediaCached = () => (legacyCache ??= loadLegacyMedia());
