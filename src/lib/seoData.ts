/**
 * What each page says about itself to search engines and social previews: title, description, canonical
 * path, image and structured data (JSON-LD). Pure functions with no React or Vite APIs, so the same code
 * drives both the in-browser head (`seo.ts`) and the build-time prerender (`scripts/prerender.mjs`).
 */
import type { PlaceFacts } from "@/data/places/derive";
import { tripHeroSrc } from "@/data/trips/media";
import { CONTACT } from "@/components/contact/data";
import { BROCHURES } from "@/data/brochures";
import { ABOUT_PATH, BLOG_PATH, BROCHURES_PATH, CONTACT_PATH, GALLERY_PATH, SITE_NAME, SITE_URL, TRIPS_PATH, articlePath, placePath, tripPath } from "./routes";

export interface PageSeo {
  title: string;
  description: string;
  /** Path only (e.g. "/places/zagora"); the origin is added for canonical and og:url. */
  path: string;
  /** Absolute image URL for social previews. */
  image?: string | undefined;
  type: "website" | "article";
  jsonLd: Record<string, unknown>[];
}

export const absUrl = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`;

/** Share image for a trip: its sharp desktop hero as an absolute URL, else `fallback`. */
export const tripShareImage = (slug: string, fallback?: string) => {
  const hero = tripHeroSrc(slug, 1200);
  if (!hero) return fallback;
  return hero.startsWith("/") ? absUrl(hero) : hero;
};

/** Cuts text to about `max` characters at a word boundary (search snippets show ~155). */
export function clip(text: string, max = 155) {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ") > 60 ? cut.lastIndexOf(" ") : cut.length).replace(/[,;:.\s]+$/, "")}…`;
}

const breadcrumb = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: absUrl(it.path),
  })),
});

const HOME_CRUMB = { name: "Home", path: "/" };

export function homeSeo(): PageSeo {
  return {
    title: `${SITE_NAME} — Zagora & Erg Chegaga Desert Travel Agency Morocco`,
    description:
      "Authentic Sahara desert expeditions, luxury desert camps, 4x4 dune crossings, and camel trekking in Erg Chegaga from Zagora, Morocco.",
    path: "/",
    type: "website",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "TravelAgency",
        "@id": `${SITE_URL}/#agency`,
        name: SITE_NAME,
        url: SITE_URL,
        email: "contact@loverofsahara.com",
        description:
          "Private Sahara desert expeditions, camel treks and 4x4 dune crossings from Zagora, Marrakech and Agadir, Morocco.",
        areaServed: { "@type": "Country", name: "Morocco" },
      },
    ],
  };
}

export function tripsSeo(): PageSeo {
  return {
    title: `Sahara & Morocco Desert Tours: All Trips | ${SITE_NAME}`,
    description:
      "Private desert trips, excursions and treks across southern Morocco: Erg Chegaga, Erg Lihoudi, the Dadès and Todgha gorges, the Draa valley and the Atlantic coast.",
    path: TRIPS_PATH,
    type: "website",
    jsonLd: [breadcrumb([HOME_CRUMB, { name: "Trips", path: TRIPS_PATH }])],
  };
}

export function aboutSeo(): PageSeo {
  return {
    title: `About Us: Salah Mouna & the Lover of Sahara Team | ${SITE_NAME}`,
    description:
      "Meet Salah Mouna, born and raised in Zagora, and the native team behind Lover of Sahara: private 4x4 expeditions, nomad camps and camel treks in Erg Chegaga.",
    path: ABOUT_PATH,
    type: "website",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "@id": `${SITE_URL}${ABOUT_PATH}#about`,
        url: absUrl(ABOUT_PATH),
        name: `About ${SITE_NAME}`,
        about: { "@id": `${SITE_URL}/#agency` },
        mainEntity: {
          "@type": "Person",
          name: "Salah Mouna",
          jobTitle: "Owner and desert guide",
          worksFor: { "@id": `${SITE_URL}/#agency` },
          homeLocation: { "@type": "Place", name: "Zagora, Morocco" },
          knowsLanguage: ["Berber", "Arabic", "French", "English"],
        },
      },
      breadcrumb([HOME_CRUMB, { name: "About", path: ABOUT_PATH }]),
    ],
  };
}

export function contactSeo(): PageSeo {
  return {
    title: `Contact Us: Plan Your Sahara Trip | ${SITE_NAME}`,
    description:
      "Contact Lover of Sahara in Zagora, Morocco: message us on WhatsApp or by email to plan a private 4x4 expedition, nomad camp or camel trek in Erg Chegaga.",
    path: CONTACT_PATH,
    type: "website",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "@id": `${SITE_URL}${CONTACT_PATH}#contact`,
        url: absUrl(CONTACT_PATH),
        name: `Contact ${SITE_NAME}`,
        mainEntity: {
          "@type": "TravelAgency",
          "@id": `${SITE_URL}/#agency`,
          name: SITE_NAME,
          email: CONTACT.email,
          telephone: `+${CONTACT.phoneDigits}`,
          address: { "@type": "PostalAddress", addressLocality: "Zagora", addressCountry: "MA" },
          sameAs: [CONTACT.instagram, CONTACT.facebook],
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            email: CONTACT.email,
            telephone: `+${CONTACT.phoneDigits}`,
            availableLanguage: [...CONTACT.languages],
          },
        },
      },
      breadcrumb([HOME_CRUMB, { name: "Contact", path: CONTACT_PATH }]),
    ],
  };
}

export function gallerySeo(): PageSeo {
  return {
    title: `Sahara Photo Gallery: Dunes, Oases & Desert Camps | ${SITE_NAME}`,
    description:
      "Photos from our private Sahara journeys in Morocco: the dunes of Erg Chegaga, palm oases, ksour, gorges, nomad camps and nights under the stars.",
    path: GALLERY_PATH,
    type: "website",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "ImageGallery",
        "@id": `${SITE_URL}${GALLERY_PATH}#gallery`,
        url: absUrl(GALLERY_PATH),
        name: `${SITE_NAME} photo gallery`,
      },
      breadcrumb([HOME_CRUMB, { name: "Gallery", path: GALLERY_PATH }]),
    ],
  };
}

export function brochuresSeo(): PageSeo {
  return {
    title: `Free Sahara Travel Brochures (PDF) in 6 Languages | ${SITE_NAME}`,
    description:
      "Download free illustrated PDF guides to the Drâa-Tafilalet region of Morocco: Zagora, Tinghir, Errachidia, Ouarzazate, Midelt, nature, local food and Erg Chegaga, in English, French, German, Spanish, Italian and Chinese.",
    path: BROCHURES_PATH,
    type: "website",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${SITE_URL}${BROCHURES_PATH}#brochures`,
        url: absUrl(BROCHURES_PATH),
        name: "Sahara travel brochures",
        hasPart: BROCHURES.map((b) => ({
          "@type": "DigitalDocument",
          name: b.langs.en?.title ?? b.slug,
          encodingFormat: "application/pdf",
          url: absUrl(`/brochures/${b.slug}-en.pdf`),
          inLanguage: Object.keys(b.langs),
        })),
      },
      breadcrumb([HOME_CRUMB, { name: "Brochures", path: BROCHURES_PATH }]),
    ],
  };
}

export function brochureReaderSeo(slug: string): PageSeo {
  const b = BROCHURES.find((x) => x.slug === slug);
  const title = b?.langs.en?.title ?? slug.replace(/-/g, " ");
  const path = `${BROCHURES_PATH}/${slug}`;
  return {
    title: `${title}: Read Online | ${SITE_NAME}`,
    description: `${b?.langs.en?.subtitle ?? "Illustrated guide to the Drâa-Tafilalet region of Morocco"} Read it online as a flipbook, or download the free PDF in six languages.`,
    path,
    type: "website",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "DigitalDocument",
        "@id": `${SITE_URL}${path}#brochure`,
        url: absUrl(path),
        name: title,
        encodingFormat: "application/pdf",
        inLanguage: b ? Object.keys(b.langs) : ["en"],
        isAccessibleForFree: true,
      },
      breadcrumb([HOME_CRUMB, { name: "Brochures", path: BROCHURES_PATH }, { name: title, path }]),
    ],
  };
}

export function blogSeo(): PageSeo {
  return {
    title: `Sahara Stories: Desert Guides & Travel Tips | ${SITE_NAME}`,
    description:
      "Guides from the dunes: what to pack, how Erg Chegaga compares with Erg Chebbi, the Lake Iriki crossing and the nomadic traditions of the Draa valley.",
    path: BLOG_PATH,
    type: "website",
    jsonLd: [breadcrumb([HOME_CRUMB, { name: "Sahara Stories", path: BLOG_PATH }])],
  };
}

export interface ArticleLike {
  id: number;
  title: string;
  lead: string;
  author: string;
  category: string;
  published: string;
}

export function articleSeo(a: ArticleLike): PageSeo {
  const title = a.title.replace(/\s*\n\s*/g, " ");
  const path = articlePath(a.id);
  return {
    title: `${title} | ${SITE_NAME}`,
    description: clip(a.lead),
    path,
    type: "article",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description: clip(a.lead),
        author: { "@type": "Person", name: a.author },
        publisher: { "@type": "Organization", name: SITE_NAME },
        mainEntityOfPage: absUrl(path),
      },
      breadcrumb([HOME_CRUMB, { name: "Sahara Stories", path: BLOG_PATH }, { name: title, path }]),
    ],
  };
}

export function placeSeo(facts: PlaceFacts, image?: string): PageSeo {
  const { place } = facts;
  const path = placePath(facts.id);
  const description = clip(`${place.brief} Best time to visit: ${place.bestTime}.`);
  return {
    title: `${place.name}, Morocco: what to see & when to go | ${SITE_NAME}`,
    description,
    path,
    image,
    type: "website",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "TouristAttraction",
        name: place.name,
        description: place.brief,
        url: absUrl(path),
        ...(image ? { image } : {}),
        geo: { "@type": "GeoCoordinates", latitude: facts.lat, longitude: facts.lng },
        address: { "@type": "PostalAddress", addressCountry: "MA", addressRegion: place.region },
      },
      breadcrumb([HOME_CRUMB, { name: "Trips", path: TRIPS_PATH }, { name: place.name, path }]),
    ],
  };
}

/** The parts of a trip the SEO needs (a LocalizedTrip satisfies it; so does the prerender's English trip). */
export interface TripLike {
  slug: string;
  title: string;
  summary: string;
  durationDays: number;
  departureLabel: string;
  fromPrice: number;
  stops: { name: string; lat: number; lng: number }[];
}

export function tripSeo(trip: TripLike, image?: string): PageSeo {
  const path = tripPath(trip.slug);
  return {
    title: `${trip.title.trim()} | ${SITE_NAME}`,
    description: clip(trip.summary),
    path,
    image,
    type: "website",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "TouristTrip",
        name: trip.title.trim(),
        description: trip.summary,
        url: absUrl(path),
        ...(image ? { image } : {}),
        provider: { "@type": "TravelAgency", name: SITE_NAME, url: SITE_URL },
        itinerary: {
          "@type": "ItemList",
          itemListElement: trip.stops.map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Place",
              name: s.name,
              geo: { "@type": "GeoCoordinates", latitude: s.lat, longitude: s.lng },
            },
          })),
        },
        offers: {
          "@type": "Offer",
          price: trip.fromPrice,
          priceCurrency: "EUR",
          url: absUrl(path),
          availability: "https://schema.org/InStock",
        },
      },
      breadcrumb([HOME_CRUMB, { name: "Trips", path: TRIPS_PATH }, { name: trip.title.trim(), path }]),
    ],
  };
}
