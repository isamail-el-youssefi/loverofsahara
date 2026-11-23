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
export const SITE_URL = "https://loverofsahara.tours";
export const SITE_NAME = "Lover of Sahara";

export type Route =
  | { name: "home" }
  | { name: "trips" }
  | { name: "about" }
  | { name: "contact" }
  | { name: "brochures" }
  | { name: "brochure"; slug: string; lang?: string }
  | { name: "gallery" }
  | { name: "trip"; slug: string }
  | { name: "place"; id: string }
  | { name: "blog" }
  | { name: "article"; id: number };

/**
 * Languages other than English get a URL prefix on the pages that exist in every language (home, About, trips,
 * contact, gallery, blog: /fr, /fr/about, /fr/trips/<slug>, /fr/blog/2) so each language version can be indexed on
 * its own. English stays unprefixed. The other pages (brochures, places) have no prefix: the brochures carry their
 * language at the end (/brochures/<slug>/fr) and the places are English only for now.
 */
export const LOCALES = ["fr", "de", "es", "it", "zh"] as const;
const LOCALE_PREFIX = /^\/(fr|de|es|it|zh)(?=\/|$)/;
const LOCALIZED_ROUTE = /^(?:\/|\/about|\/contact|\/gallery|\/blog(?:\/\d+)?|\/trips(?:\/[^/?#]+)?)\/?(?:[?#].*)?$/;

/** Removes a leading language prefix: "/fr/trips/x" -> { lang: "fr", path: "/trips/x" }. */
export function splitLocale(pathname: string): { lang: string | undefined; path: string } {
  const m = LOCALE_PREFIX.exec(pathname);
  return m ? { lang: m[1], path: pathname.slice(m[0].length) || "/" } : { lang: undefined, path: pathname };
}

/** The language a URL asks for: "fr" for /fr/trips/x or /fr, "en" for /trips/x or /, undefined for any other page. */
export function localizedRouteLang(pathname: string): string | undefined {
  const { lang, path } = splitLocale(pathname);
  return LOCALIZED_ROUTE.test(path) ? (lang ?? "en") : undefined;
}

/**
 * Adds the language prefix to the URL of a page that exists in every language:
 * "/trips/x" -> "/fr/trips/x", "/" -> "/fr", "/#process" -> "/fr#process". Any other path is returned as it is.
 */
export function localePath(lang: string, path: string) {
  if (lang === "en" || !LOCALIZED_ROUTE.test(path)) return path;
  return path === "/" || path.startsWith("/?") || path.startsWith("/#") ? `/${lang}${path.slice(1)}` : `/${lang}${path}`;
}

export const tripPath = (slug: string, lang = "en") => localePath(lang, `/trips/${slug}`);
export const placePath = (id: string) => `/places/${id}`;
export const articlePath = (id: number, lang = "en") => localePath(lang, `/blog/${id}`);
export const TRIPS_PATH = "/trips";
export const tripsPath = (lang = "en") => localePath(lang, TRIPS_PATH);
export const BLOG_PATH = "/blog";
export const blogPath = (lang = "en") => localePath(lang, BLOG_PATH);
export const ABOUT_PATH = "/about";
export const aboutPath = (lang = "en") => localePath(lang, ABOUT_PATH);
export const homePath = (lang = "en") => localePath(lang, "/");
export const CONTACT_PATH = "/contact";
export const contactPath = (lang = "en") => localePath(lang, CONTACT_PATH);
export const BROCHURES_PATH = "/brochures";
export const brochurePath = (slug: string) => `/brochures/${slug}`;
/** One URL per language, so each language version can be indexed on its own. */
export const brochureLangPath = (slug: string, lang: string) => `/brochures/${slug}/${lang}`;
export const GALLERY_PATH = "/gallery";
export const galleryPath = (lang = "en") => localePath(lang, GALLERY_PATH);

const trim = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p) || "/";
const slugForLegacyId = (n: string) => (SLUG_BY_LEGACY_ID as Record<number, string>)[Number(n)];

/** Pathname -> route. Unknown paths fall back to the home page. */
export function parseRoute(pathname: string): Route {
  let p = trim(pathname);
  // /fr/trips/... is the same page as /trips/... in another language (the language provider reads the prefix)
  const loc = splitLocale(p);
  if (loc.lang && LOCALIZED_ROUTE.test(loc.path)) p = trim(loc.path);
  if (p === TRIPS_PATH) return { name: "trips" };
  if (p === BLOG_PATH) return { name: "blog" };
  if (p === ABOUT_PATH) return { name: "about" };
  if (p === CONTACT_PATH) return { name: "contact" };
  if (p === BROCHURES_PATH) return { name: "brochures" };
  if (p === GALLERY_PATH) return { name: "gallery" };
  let m = /^\/trips\/([^/]+)$/.exec(p);
  if (m) return { name: "trip", slug: decodeURIComponent(m[1]!) };
  m = /^\/brochures\/([^/.]+)(?:\/(en|fr|de|es|it|zh))?$/.exec(p);
  if (m) return m[2] ? { name: "brochure", slug: decodeURIComponent(m[1]!), lang: m[2] } : { name: "brochure", slug: decodeURIComponent(m[1]!) };
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
      return `brochure-${r.slug}`; // same page for every language: switching language must not replay the transition
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
  const legacy = /^(?:\/(fr|de|es|it|zh))?\/(?:trips|excursions|trekkings)\/(\d+)\/?$/.exec(pathname);
  if (legacy) {
    const slug = slugForLegacyId(legacy[2]!);
    if (slug) return tripPath(slug, legacy[1] ?? "en");
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
