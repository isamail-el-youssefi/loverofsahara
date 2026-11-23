/**
 * Everything the About page says, in one place.
 *
 * The words live in src/i18n/site/<lang>.ts (one file per language); this file adds what is the same in every
 * language (the owner's name and photo, the figures, the guests' own words) and returns the whole set for a
 * language with `aboutContent(lang)`. The English constants below are for code that has no language (the
 * prerender's English page, the search tags).
 *
 * Source: the previous site (`bringing data from old website/.../locales/en/Homepage.json` for the bio, and its
 * guest recommendations for the quotes). Stats are the ones already on the home page. Nothing here is invented:
 * the founding year and team members are not in that data, so they are left out until they are provided.
 */
import { tripImage } from "@/data/trips";
import type { Lang } from "@/i18n/languages";
import { SITE } from "@/i18n/site";

/** Camel caravan at Zagora, Salah's home town (already used by the Zagora place page). */
export const HERO_PHOTO = "/images/places/zagora.jpg";

const MAILTO = "mailto:contact@loverofsahara.com?subject=Planning%20a%20trip%20with%20Lover%20of%20Sahara";

/** Real guest words from the previous site and the reviews on this one, in the language they were written in. */
const QUOTE_TEXTS = [
  { text: "Competent and friendly. Salah knows everything about the desert and its secrets. Truly recommended.", name: "Andrea", from: "italy" },
  {
    text: "Très belle journée avec Salah qui nous a fait découvrir les dunes de Chegaga, un village nomade avec sa gentillesse et son honnêteté qui nous a guidé à travers de très belles rencontres. On recommande vivement !!! Vous repartirez avec de superbes images et souvenirs.",
    name: "Lauriane",
    from: "france",
  },
  {
    text: "Un immense merci à Salah pour avoir organisé et accompagné notre séjour ! C'était une expérience véritablement authentique, pleine de découvertes et de moments de partage simples mais profonds.",
    name: "Rivière",
    from: "france",
  },
] as const;

const TAB_IDS = ["story", "salah", "values", "reviews", "sustainability", "faq"] as const;

/** The About page's content in one language. */
export function aboutContent(lang: Lang) {
  const a = SITE[lang].about;
  return {
    OWNER: {
      name: "Salah Mouna",
      role: a.ownerRole,
      /** The old site's portrait (served from its ImageKit account). */
      portrait: tripImage("/about22.jpg", 1200),
      languages: a.languages,
      bio: a.bio,
      quote: a.ownerQuote,
    },
    ABOUT_INTRO: a.intro,
    /** The second half of the intro, for designs that set the first half apart as a headline. */
    ABOUT_TAIL: a.tail,
    STATS: [
      { n: "300m", label: a.stats[0] },
      { n: "40km", label: a.stats[1] },
      { n: "100%", label: a.stats[2] },
      { n: "1", label: a.stats[3] },
    ],
    VALUES: a.values,
    QUOTES: QUOTE_TEXTS.map((q) => ({ text: q.text, name: q.name, from: a.countries[q.from] })),
    /** Soft, general commitments drawn from how the trips already run. TODO(owner): confirm or refine these. */
    SUSTAINABILITY: a.sustainability,
    FAQ: a.faq,
    CTA: { ...a.cta, mailto: MAILTO },
    /** Section tabs shown at the bottom of the page. */
    ABOUT_TABS: TAB_IDS.map((id, i) => ({ id, label: a.tabs[i]! })),
  };
}

const EN = aboutContent("en");
export const OWNER = EN.OWNER;
export const ABOUT_INTRO = EN.ABOUT_INTRO;
export const ABOUT_TAIL = EN.ABOUT_TAIL;
export const STATS = EN.STATS;
export const VALUES = EN.VALUES;
export const QUOTES = EN.QUOTES;
export const SUSTAINABILITY = EN.SUSTAINABILITY;
export const FAQ = EN.FAQ;
export const CTA = EN.CTA;
export const ABOUT_TABS = EN.ABOUT_TABS;
