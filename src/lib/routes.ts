/**
 * Real, crawlable URLs for the site. The pages used to live behind `#hash` links, which search engines
 * ignore (the whole site looked like one URL), so every page now has a path of its own.
 *
 *   /                      home            (keeps its in-page #anchors)
 *   /trips                 all trips
 *   /trips/<slug>          one trip
 *   /places/<id>           one place a trip stops at
 *   /blog, /blog/<n>       articles
 *   /about                 about Lover of Sahara and its owner
 *   /contact               contact details and the trip request form
 *   /brochures             free PDF guides, in six languages
 *   /brochures/<slug>      read one guide inside the site
 *   /gallery               photos from every journey
 *
 * Old links keep working: `#trip/<slug>`-style hashes and the previous site's `/trips/5`,
 * `/excursions/4`, `/trekkings/6` URLs are mapped to the new paths by `canonicalPath`.
 */
import { SLUG_BY_LEGACY_ID } from "@/data/trips/slugs";

/** Production origin, used for canonical links, the sitemap and social previews. One place to change it. */
export const SITE_URL = "https://www.loverofsahara.com";
export const SITE_NAME = "Lover of Sahara";

export type Route =
  | { name: "home" }
  | { name: "trips" }
  | { name: "about" }
  | { name: "contact" }
  | { name: "brochures" }
  | { name: "brochure"; slug: string }
  | { name: "gallery" }
  | { name: "trip"; slug: string }
  | { name: "place"; id: string }
  | { name: "blog" }
  | { name: "article"; id: number };

export const tripPath = (slug: string) => `/trips/${slug}`;
export const placePath = (id: string) => `/places/${id}`;
export const articlePath = (id: number) => `/blog/${id}`;
export const TRIPS_PATH = "/trips";
export const BLOG_PATH = "/blog";
export const ABOUT_PATH = "/about";
export const CONTACT_PATH = "/contact";
export const BROCHURES_PATH = "/brochures";
export const brochurePath = (slug: string) => `/brochures/${slug}`;
export const GALLERY_PATH = "/gallery";

const trim = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p) || "/";
const slugForLegacyId = (n: string) => (SLUG_BY_LEGACY_ID as Record<number, string>)[Number(n)];

/** Pathname -> route. Unknown paths fall back to the home page. */
export function parseRoute(pathname: string): Route {
  const p = trim(pathname);
  if (p === TRIPS_PATH) return { name: "trips" };
  if (p === BLOG_PATH) return { name: "blog" };
  if (p === ABOUT_PATH) return { name: "about" };
  if (p === CONTACT_PATH) return { name: "contact" };
  if (p === BROCHURES_PATH) return { name: "brochures" };
  if (p === GALLERY_PATH) return { name: "gallery" };
  let m = /^\/trips\/([^/]+)$/.exec(p);
  if (m) return { name: "trip", slug: decodeURIComponent(m[1]!) };
  m = /^\/brochures\/([^/.]+)$/.exec(p);
  if (m) return { name: "brochure", slug: decodeURIComponent(m[1]!) };
  m = /^\/places\/([^/]+)$/.exec(p);
  if (m) return { name: "place", id: decodeURIComponent(m[1]!) };
  m = /^\/blog\/(\d+)$/.exec(p);
  if (m) return { name: "article", id: Number(m[1]) };
  return { name: "home" };
}

/** A stable key per page, used to remount the page (and replay its transition) when the route changes. */
export function routeKey(r: Route): string {
  switch (r.name) {
    case "trip":
      return `trip-${r.slug}`;
    case "brochure":
      return `brochure-${r.slug}`;
    case "place":
      return `place-${r.id}`;
    case "article":
      return `article-${r.id}`;
    default:
      return r.name;
  }
}

/**
 * The path a location should really have, or null when it is already right.
 * Handles the old `#hash` URLs and the previous site's numeric URLs.
 */
export function canonicalPath(pathname: string, hash: string): string | null {
  // Old numeric URLs from the previous site: /trips/5, /excursions/4, /trekkings/6
  const legacy = /^\/(?:trips|excursions|trekkings)\/(\d+)\/?$/.exec(pathname);
  if (legacy) {
    const slug = slugForLegacyId(legacy[1]!);
    if (slug) return tripPath(slug);
  }
  // Old hash routes (only from the home path, where they used to live)
  if (trim(pathname) === "/" && hash) {
    if (hash === "#trips") return TRIPS_PATH;
    if (hash === "#blog") return BLOG_PATH;
    let m = /^#trip\/(.+)$/.exec(hash);
    if (m) return `/trips/${m[1]}`;
    m = /^#place\/(.+)$/.exec(hash);
    if (m) return `/places/${m[1]}`;
    m = /^#article\/?(\d+)$/.exec(hash);
    if (m) return articlePath(Number(m[1]));
  }
  return null;
}
