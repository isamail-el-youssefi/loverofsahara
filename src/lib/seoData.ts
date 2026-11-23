/**
 * What each page says about itself to search engines and social previews: title, description, canonical
 * path, image and structured data (JSON-LD). Pure functions with no React or Vite APIs, so the same code
 * drives both the in-browser head (`seo.ts`) and the build-time prerender (`scripts/prerender.mjs`).
 */
import type { PlaceFacts } from "@/data/places/derive";
import { tripHeroSrc, tripImage } from "@/data/trips/media";
import { aboutContent } from "@/components/about/content";
import { getReviews } from "@/data/reviews";
import { summarize } from "@/lib/reviews";
import { CONTACT } from "@/components/contact/data";
import { BROCHURES, brochureCover, brochureIn, brochurePdf } from "@/data/brochures";
import { LANGUAGES, type Lang } from "@/i18n/languages";
import { SITE } from "@/i18n/site";
import { UI } from "@/i18n/ui";
import { PAGES } from "@/i18n/pages";
import { ABOUT_PATH, BLOG_PATH, BROCHURES_PATH, CONTACT_PATH, GALLERY_PATH, SITE_NAME, SITE_URL, TRIPS_PATH, aboutPath, articlePath, blogPath, contactPath, galleryPath, homePath, placePath, tripPath, tripsPath } from "./routes";

export interface PageSeo {
  title: string;
  description: string;
  /** Path only (e.g. "/places/zagora"); the origin is added for canonical and og:url. */
  path: string;
  /** Absolute image URL for social previews. */
  image?: string | undefined;
  type: "website" | "article";
  jsonLd: Record<string, unknown>[];
  /** Canonical path when it differs from `path` (a page that duplicates another). */
  canonical?: string | undefined;
  /** Other-language versions of this page, for hreflang. */
  alternates?: { hreflang: string; path: string }[] | undefined;
  /** Value for <html lang> when the page is not in English. */
  htmlLang?: string | undefined;
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

/** hreflang links for a page that exists in every language: all six versions (each pointing at itself too) and x-default = English. */
export function languageAlternates(pathFor: (lang: Lang) => string) {
  return [
    ...LANGUAGES.map((l) => ({ hreflang: l.htmlLang, path: pathFor(l.code) })),
    { hreflang: "x-default", path: pathFor("en") },
  ];
}

const htmlLangOf = (lang: Lang) => LANGUAGES.find((l) => l.code === lang)?.htmlLang ?? lang;

/** "Home" in each language, for breadcrumbs. */
export const HOME_NAME: Record<Lang, string> = { en: "Home", fr: "Accueil", de: "Startseite", es: "Inicio", it: "Home", zh: "首页" };

/**
 * Title and description of the all-trips page, written for each language (not machine-translated word for word:
 * they name the same places a visitor would search for). Worth a read by a native speaker before launch.
 */
const TRIPS_SEO: Record<Lang, { title: string; description: string }> = {
  en: {
    title: "Sahara & Morocco Desert Tours: All Trips",
    description:
      "Private desert trips, excursions and treks across southern Morocco: Erg Chegaga, Erg Lihoudi, the Dadès and Todgha gorges, the Draa valley and the Atlantic coast.",
  },
  fr: {
    title: "Circuits dans le Sahara et le désert marocain",
    description:
      "Circuits privés, excursions et treks dans le sud du Maroc : Erg Chegaga, Erg Lihoudi, gorges du Dadès et du Todgha, vallée du Drâa et côte atlantique.",
  },
  de: {
    title: "Sahara- und Marokko-Wüstenreisen: alle Touren",
    description:
      "Private Wüstentouren, Ausflüge und Treks im Süden Marokkos: Erg Chegaga, Erg Lihoudi, Dadès- und Todgha-Schlucht, Drâa-Tal und Atlantikküste.",
  },
  es: {
    title: "Viajes al Sahara y desierto de Marruecos",
    description:
      "Viajes privados, excursiones y treks por el sur de Marruecos: Erg Chegaga, Erg Lihoudi, gargantas del Dadès y del Todgha, valle del Drâa y costa atlántica.",
  },
  it: {
    title: "Tour nel Sahara e nel deserto del Marocco",
    description:
      "Viaggi privati, escursioni e trekking nel sud del Marocco: Erg Chegaga, Erg Lihoudi, gole del Dadès e del Todgha, valle del Draa e costa atlantica.",
  },
  zh: {
    title: "撒哈拉与摩洛哥沙漠之旅：全部行程",
    description: "摩洛哥南部私人沙漠之旅、短途游和徒步：谢加加沙丘、利胡迪沙丘、达德斯与托德拉峡谷、德拉山谷和大西洋海岸。",
  },
};

/** Share image for pages without a photo of their own (home, lists, about, contact, ...): the dunes of Erg Chegaga. */
export const DEFAULT_SHARE_IMAGE = tripImage("/hero/circuit.jpg", 1200) as string;

/** Google Maps listing rating (see data/reviews/google.ts: 5.0 stars, 21 reviews). */
const GOOGLE_RATING = { value: 5, count: 21 };

/** "<title> | Lover of Sahara", dropping the brand when the whole title would pass ~60 characters (search results cut it). */
export const withSite = (title: string) => {
  const t = title.trim();
  const full = `${t} | ${SITE_NAME}`;
  return full.length <= 60 ? full : t;
};

const aggregate = (value: number, count: number) => ({
  "@type": "AggregateRating",
  ratingValue: value,
  bestRating: 5,
  worstRating: 1,
  ratingCount: count,
});

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

export function homeSeo(lang: Lang = "en"): PageSeo {
  const m = SITE[lang].meta;
  return {
    image: DEFAULT_SHARE_IMAGE,
    title: m.homeTitle,
    description: m.homeDescription,
    path: homePath(lang),
    alternates: languageAlternates((l) => homePath(l)),
    htmlLang: lang === "en" ? undefined : htmlLangOf(lang),
    type: "website",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "TravelAgency",
        "@id": `${SITE_URL}/#agency`,
        name: SITE_NAME,
        url: SITE_URL,
        email: CONTACT.email,
        telephone: `+${CONTACT.phoneDigits}`,
        logo: absUrl("/favicon.ico"),
        image: DEFAULT_SHARE_IMAGE,
        description: m.agencyDescription,
        slogan: "Private Sahara Journeys, Born in the Dunes",
        priceRange: "€€",
        currenciesAccepted: "EUR, MAD, USD",
        address: { "@type": "PostalAddress", addressLocality: "Zagora", addressRegion: "Drâa-Tafilalet", addressCountry: "MA" },
        geo: { "@type": "GeoCoordinates", latitude: CONTACT.lat, longitude: CONTACT.lng },
        areaServed: { "@type": "Country", name: "Morocco" },
        founder: {
          "@type": "Person",
          name: "Salah Mouna",
          jobTitle: "Founder & Native Desert Guide",
          homeLocation: { "@type": "Place", name: "Zagora, Morocco" },
          knowsLanguage: ["Berber", "Arabic", "French", "English"],
        },
        knowsLanguage: [...CONTACT.languages],
        sameAs: [CONTACT.instagram, CONTACT.facebook],
        aggregateRating: aggregate(GOOGLE_RATING.value, GOOGLE_RATING.count),
      },
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${absUrl(homePath(lang))}#page`,
        url: absUrl(homePath(lang)),
        name: m.homeTitle,
        inLanguage: htmlLangOf(lang),
        about: { "@id": `${SITE_URL}/#agency` },
      },
    ],
  };
}

export function tripsSeo(lang: Lang = "en"): PageSeo {
  const text = TRIPS_SEO[lang];
  const path = tripsPath(lang);
  return {
    image: DEFAULT_SHARE_IMAGE,
    title: withSite(text.title),
    description: text.description,
    path,
    alternates: languageAlternates((l) => tripsPath(l)),
    htmlLang: lang === "en" ? undefined : htmlLangOf(lang),
    type: "website",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${SITE_URL}${path}#trips`,
        url: absUrl(path),
        name: text.title,
        inLanguage: htmlLangOf(lang),
      },
      breadcrumb([{ name: HOME_NAME[lang], path: homePath(lang) }, { name: UI[lang].navTrips, path }]),
    ],
  };
}

export function aboutSeo(lang: Lang = "en"): PageSeo {
  const site = SITE[lang];
  const m = site.meta;
  const path = aboutPath(lang);
  const { FAQ } = aboutContent(lang);
  return {
    image: DEFAULT_SHARE_IMAGE,
    title: withSite(m.aboutTitle),
    description: m.aboutDescription,
    path,
    alternates: languageAlternates((l) => aboutPath(l)),
    htmlLang: lang === "en" ? undefined : htmlLangOf(lang),
    type: "website",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "@id": `${SITE_URL}${path}#about`,
        url: absUrl(path),
        name: m.aboutName,
        inLanguage: htmlLangOf(lang),
        about: { "@id": `${SITE_URL}/#agency` },
        mainEntity: {
          "@type": "Person",
          name: "Salah Mouna",
          jobTitle: m.ownerJob,
          worksFor: { "@id": `${SITE_URL}/#agency` },
          homeLocation: { "@type": "Place", name: "Zagora, Morocco" },
          knowsLanguage: ["Berber", "Arabic", "French", "English"],
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        inLanguage: htmlLangOf(lang),
        mainEntity: FAQ.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      breadcrumb([
        { name: m.home, path: homePath(lang) },
        { name: site.homeAbout.eyebrow, path },
      ]),
    ],
  };
}

export function contactSeo(lang: Lang = "en"): PageSeo {
  const p = PAGES[lang].contact;
  const path = contactPath(lang);
  return {
    image: DEFAULT_SHARE_IMAGE,
    title: withSite(p.seoTitle),
    description: p.seoDescription,
    path,
    alternates: languageAlternates((l) => contactPath(l)),
    htmlLang: lang === "en" ? undefined : htmlLangOf(lang),
    type: "website",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "@id": `${absUrl(path)}#contact`,
        url: absUrl(path),
        name: p.name,
        inLanguage: htmlLangOf(lang),
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
      breadcrumb([
        { name: HOME_NAME[lang], path: homePath(lang) },
        { name: p.name, path },
      ]),
    ],
  };
}

export function gallerySeo(lang: Lang = "en"): PageSeo {
  const p = PAGES[lang].gallery;
  const path = galleryPath(lang);
  return {
    image: DEFAULT_SHARE_IMAGE,
    title: withSite(p.seoTitle),
    description: p.seoDescription,
    path,
    alternates: languageAlternates((l) => galleryPath(l)),
    htmlLang: lang === "en" ? undefined : htmlLangOf(lang),
    type: "website",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "ImageGallery",
        "@id": `${absUrl(path)}#gallery`,
        url: absUrl(path),
        name: p.name,
        inLanguage: htmlLangOf(lang),
      },
      breadcrumb([
        { name: HOME_NAME[lang], path: homePath(lang) },
        { name: p.name, path },
      ]),
    ],
  };
}

export function brochuresSeo(): PageSeo {
  return {
    image: DEFAULT_SHARE_IMAGE,
    title: withSite("Free Sahara Travel Brochures (PDF) in 6 Languages"),
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
          url: absUrl(`/brochures/${b.slug}/en`),
          inLanguage: Object.keys(b.langs),
        })),
      },
      breadcrumb([HOME_CRUMB, { name: "Brochures", path: BROCHURES_PATH }]),
    ],
  };
}

const FREE_GUIDE: Record<Lang, (pages: number, mb: number) => string> = {
  en: (p, m) => `Free illustrated guide, ${p} pages (PDF, ${m} MB). Read it online or download it.`,
  fr: (p, m) => `Guide illustré gratuit, ${p} pages (PDF, ${m} Mo). À lire en ligne ou à télécharger.`,
  de: (p, m) => `Kostenloser Bildband, ${p} Seiten (PDF, ${m} MB). Online lesen oder herunterladen.`,
  es: (p, m) => `Guía ilustrada gratuita, ${p} páginas (PDF, ${m} MB). Léela en línea o descárgala.`,
  it: (p, m) => `Guida illustrata gratuita, ${p} pagine (PDF, ${m} MB). Leggila online o scaricala.`,
  zh: (p, m) => `免费图文指南，共 ${p} 页（PDF，${m} MB）。可在线阅读或下载。`,
};

/** The page for one brochure in one language (`/brochures/<slug>/<lang>`), or the language-neutral entry. */
export function brochureReaderSeo(slug: string, wanted?: Lang): PageSeo {
  const b = BROCHURES.find((x) => x.slug === slug);
  const neutral = `${BROCHURES_PATH}/${slug}`;
  if (!b) {
    return { title: `${slug.replace(/-/g, " ")} | ${SITE_NAME}`, description: "Illustrated guide to the Drâa-Tafilalet region of Morocco.", path: neutral, type: "website", jsonLd: [] };
  }
  const { lang, info } = brochureIn(b, wanted ?? "en");
  const langPath = `${neutral}/${lang}`;
  const path = wanted ? langPath : neutral;
  const available = LANGUAGES.filter((l) => b.langs[l.code]);
  const htmlLang = LANGUAGES.find((l) => l.code === lang)?.htmlLang;
  const description = `${info.subtitle}. ${FREE_GUIDE[lang](info.pages, info.mb)}`;
  return {
    title: withSite(`${info.title}: ${info.kicker}`),
    description,
    path,
    // The language-neutral URL is a duplicate of the English page.
    canonical: wanted ? undefined : `${neutral}/en`,
    alternates: [
      ...available.map((l) => ({ hreflang: l.htmlLang, path: `${neutral}/${l.code}` })),
      { hreflang: "x-default", path: `${neutral}/en` },
    ],
    htmlLang: lang === "en" ? undefined : htmlLang,
    image: absUrl(brochureCover(slug, lang)),
    type: "website",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": ["Article", "DigitalDocument"],
        "@id": `${SITE_URL}${langPath}#brochure`,
        url: absUrl(langPath),
        headline: info.title,
        name: info.title,
        alternativeHeadline: info.subtitle,
        description,
        inLanguage: htmlLang ?? lang,
        isAccessibleForFree: true,
        image: absUrl(brochureCover(slug, lang)),
        about: { "@type": "Place", name: info.title, address: { "@type": "PostalAddress", addressRegion: "Drâa-Tafilalet", addressCountry: "MA" } },
        author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        encoding: {
          "@type": "MediaObject",
          contentUrl: absUrl(brochurePdf(slug, lang)),
          encodingFormat: "application/pdf",
          contentSize: `${info.mb} MB`,
        },
        workTranslation: available
          .filter((l) => l.code !== lang)
          .map((l) => ({ "@type": "Article", inLanguage: l.htmlLang, name: b.langs[l.code]!.title, url: absUrl(`${neutral}/${l.code}`) })),
      },
      breadcrumb([HOME_CRUMB, { name: "Brochures", path: BROCHURES_PATH }, { name: info.title, path: langPath }]),
    ],
  };
}

export function blogSeo(lang: Lang = "en"): PageSeo {
  const p = PAGES[lang].blog;
  const path = blogPath(lang);
  return {
    image: DEFAULT_SHARE_IMAGE,
    title: withSite(p.seoTitle),
    description: p.seoDescription,
    path,
    alternates: languageAlternates((l) => blogPath(l)),
    htmlLang: lang === "en" ? undefined : htmlLangOf(lang),
    type: "website",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Blog",
        "@id": `${absUrl(path)}#blog`,
        url: absUrl(path),
        name: p.name,
        description: p.seoDescription,
        inLanguage: htmlLangOf(lang),
      },
      breadcrumb([
        { name: HOME_NAME[lang], path: homePath(lang) },
        { name: p.crumb, path },
      ]),
    ],
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

export function articleSeo(a: ArticleLike, lang: Lang = "en"): PageSeo {
  const title = a.title.replace(/\s*\n\s*/g, " ");
  const path = articlePath(a.id, lang);
  const p = PAGES[lang];
  return {
    title: withSite(title),
    description: clip(a.lead, lang === "zh" ? 80 : 155),
    path,
    image: DEFAULT_SHARE_IMAGE,
    alternates: languageAlternates((l) => articlePath(a.id, l)),
    htmlLang: lang === "en" ? undefined : htmlLangOf(lang),
    type: "article",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description: clip(a.lead, lang === "zh" ? 80 : 155),
        inLanguage: htmlLangOf(lang),
        author: { "@type": "Person", name: a.author },
        publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        mainEntityOfPage: absUrl(path),
      },
      breadcrumb([
        { name: HOME_NAME[lang], path: homePath(lang) },
        { name: p.blog.crumb, path: blogPath(lang) },
        { name: title, path },
      ]),
    ],
  };
}

export function placeSeo(facts: PlaceFacts, image?: string): PageSeo {
  const { place } = facts;
  const path = placePath(facts.id);
  const description = clip(`${place.brief} Best time to visit: ${place.bestTime}.`);
  return {
    title: withSite(`${place.name}, Morocco: what to see & when to go`),
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
  /** Language of the text (English when missing). */
  lang?: Lang | undefined;
}

export function tripSeo(trip: TripLike, image?: string): PageSeo {
  const lang = trip.lang ?? "en";
  const path = tripPath(trip.slug, lang);
  const reviews = getReviews(trip.slug);
  const { count, average } = summarize(reviews);
  return {
    title: withSite(trip.title),
    description: clip(trip.summary, lang === "zh" ? 80 : 155),
    path,
    image,
    // Each language version is its own page: it names itself as canonical and lists all the others.
    alternates: languageAlternates((l) => tripPath(trip.slug, l)),
    htmlLang: lang === "en" ? undefined : htmlLangOf(lang),
    type: "website",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "TouristTrip",
        name: trip.title.trim(),
        description: trip.summary,
        inLanguage: htmlLangOf(lang),
        url: absUrl(path),
        ...(image ? { image } : {}),
        provider: { "@type": "TravelAgency", "@id": `${SITE_URL}/#agency`, name: SITE_NAME, url: SITE_URL },
        ...(count > 0
          ? {
              aggregateRating: aggregate(average, count),
              review: reviews.slice(0, 5).map((r) => ({
                "@type": "Review",
                author: { "@type": "Person", name: r.name },
                datePublished: r.date,
                reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5, worstRating: 1 },
                reviewBody: clip(r.comment, 300),
              })),
            }
          : {}),
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
      breadcrumb([
        { name: HOME_NAME[lang], path: homePath(lang) },
        { name: UI[lang].navTrips, path: tripsPath(lang) },
        { name: trip.title.trim(), path },
      ]),
    ],
  };
}
