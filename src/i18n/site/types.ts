/**
 * The words of the home page, the About page and the footer, in every language.
 *
 * Pure data (no React), so the same text feeds the pages, the search-engine tags and the prerendered HTML
 * (scripts/seo-entry.ts). One file per language (en.ts, fr.ts, ...), each typed with this interface, so a missing
 * key is a compile error. Names of places stay as the trip texts spell them in that language.
 */
type T3<T> = [T, T, T];
type T4<T> = [T, T, T, T];

export interface Qa {
  q: string;
  a: string;
}
export interface TitleText {
  title: string;
  text: string;
}

export interface SiteStrings {
  meta: {
    homeTitle: string;
    homeDescription: string;
    agencyDescription: string;
    aboutTitle: string;
    aboutDescription: string;
    aboutName: string;
    ownerJob: string;
    /** "Home" in breadcrumbs */
    home: string;
  };
  hero: { eyebrow: string; pre: string; em: string; post: string; lede: string };
  homeAbout: { eyebrow: string; h2a: string; h2b: string; ourStory: string; planTrip: string; photoAlt: string };
  about: {
    kicker: string;
    h1a: string;
    h1b: string;
    storyEyebrow: string;
    ownerEyebrow: string;
    languagesLabel: string;
    valuesEyebrow: string;
    valuesTitle: string;
    valuesTitleStory: string;
    reviewsEyebrow: string;
    reviewsTitle: string;
    reviewsNote: string;
    sustainEyebrow: string;
    sustainTitle: string;
    faqEyebrow: string;
    faqTitle: string;
    ownerRole: string;
    ownerQuote: string;
    languages: T4<string>;
    bio: T3<string>;
    intro: string;
    tail: string;
    stats: T4<string>;
    values: T4<TitleText>;
    countries: { italy: string; france: string };
    sustainability: T3<TitleText>;
    faq: T5<Qa>;
    cta: { title: string; lead: string; button: string };
    tabs: [string, string, string, string, string, string];
    chapters: T3<string>;
    portraitAlt: string;
  };
  categories: {
    h2a: string;
    h2b: string;
    explore: string;
    cards: T4<{ name: string; blurb: string }>;
    comingSoon: string;
  };
  process: { eyebrow: string; h2a: string; h2b: string; button: string; steps: T3<{ t: string; d: string }> };
  destinations: { h2a: string; h2b: string; label: string; explore: string; items: T4<{ title: string; tag: string; location: string; description: string }> };
  articles: {
    h2a: string;
    h2b: string;
    viewAll: string;
    readGuide: string;
    items: [
      { alt: string; title: string; meta: string },
      { alt: string; title: string },
    ];
  };
  featured: { h2a: string; h2b: string; lead: string; viewAll: string; popular: string; byDeparture: string; prev: string; next: string; more: string; page: string };
  cta: {
    eyebrow: string;
    h2a: string;
    h2b: string;
    copy: string;
    book: string;
    whatsapp: string;
    email: string;
    phone: string;
    basedIn: string;
    follow: string;
    location: string;
  };
  footer: {
    cols: T5<{ title: string; links: string[] }>;
    newsletter: string;
    emailPlaceholder: string;
    emailLabel: string;
    signUp: string;
    thanks: string;
    rights: string;
    wordmark: string;
    googleReviews: string;
    googleAria: string;
  };
}

type T5<T> = [T, T, T, T, T];
