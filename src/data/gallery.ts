/**
 * Photos for the gallery page. There is no separate photo list: the gallery reuses the itinerary photos of
 * every trip (the old site's ImageKit library, listed in `trips.legacy-media.json`), merged so that a photo
 * used by several trips appears once and remembers which trips it belongs to.
 */
import type { LegacyMedia } from "@/data/trips/schema";

export interface GalleryPhoto {
  /** Old image path (resolved to an ImageKit URL with `tripImage`). */
  path: string;
  /** Slugs of the trips that use this photo, the first one is the "home" trip. */
  trips: string[];
  /** Departure cities of those trips (lowercase, as in trips.meta.json), no duplicates. */
  cities: string[];
}

/** Tourist snapshots the owner does not want shown (see the site notes), plus the site's placeholder carousel. */
const SKIP = new Set(["/3.jpg", "/11-1.jpg"]);
const isPhoto = (p: string) => /\.(jpe?g|png|webp)$/i.test(p) && !SKIP.has(p.startsWith("/") ? p : `/${p}`);

/** All unique photos, taken from the trips in turns so neighbours rarely come from the same trip. */
export function buildGalleryPhotos(
  media: Record<string, LegacyMedia>,
  trips: { slug: string; departureCity: string }[],
): GalleryPhoto[] {
  const cityOf = new Map(trips.map((t) => [t.slug, t.departureCity]));
  const owners = new Map<string, string[]>();
  const perTrip: { slug: string; paths: string[] }[] = [];

  for (const t of trips) {
    const m = media[t.slug];
    if (!m) continue;
    const paths: string[] = [];
    for (const day of Object.keys(m.days).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))) {
      for (const p of m.days[day] ?? []) if (isPhoto(p) && !paths.includes(p)) paths.push(p);
    }
    for (const p of paths) owners.set(p, [...(owners.get(p) ?? []), t.slug]);
    perTrip.push({ slug: t.slug, paths });
  }

  const out: GalleryPhoto[] = [];
  const seen = new Set<string>();
  const longest = Math.max(0, ...perTrip.map((t) => t.paths.length));
  for (let i = 0; i < longest; i++) {
    for (const t of perTrip) {
      const p = t.paths[i];
      if (!p || seen.has(p)) continue;
      seen.add(p);
      const slugs = owners.get(p) ?? [t.slug];
      const cities = [...new Set(slugs.map((s) => cityOf.get(s)).filter((c): c is string => Boolean(c)))];
      out.push({ path: p, trips: slugs, cities });
    }
  }
  return out;
}
