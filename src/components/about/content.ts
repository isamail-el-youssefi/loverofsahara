/**
 * Everything the About page says, in one place.
 *
 * Source: the previous site (`bringing data from old website/.../locales/en/Homepage.json` for the bio, and its
 * guest recommendations for the quotes). Stats are the ones already on the home page. Nothing here is invented:
 * the founding year and team members are not in that data, so they are left out until they are provided.
 */
import { tripImage } from "@/data/trips";

/** Camel caravan at Zagora, Salah's home town (already used by the Zagora place page). */
export const HERO_PHOTO = "/images/places/zagora.jpg";

export const OWNER = {
  name: "Salah Mouna",
  role: "Owner & desert guide",
  /** The old site's portrait (served from its ImageKit account). */
  portrait: tripImage("/about22.jpg", 1200),
  languages: ["Berber", "Arabic", "French", "English"],
  /** Written by Salah in the first person on the old site; the unfinished closing sentence is left out. */
  bio: [
    "Born and raised in Zagora, a gateway to the Sahara Desert in southern Morocco, I have deep roots in this mesmerizing landscape. Growing up in this desertic region, I developed an intimate knowledge of the dunes, oases, and hidden treasures that most visitors never discover. My connection to this land goes beyond being a tour guide: the desert is my heritage and my home.",
    "As a native of Zagora, I offer authentic insights into desert life that only a local can provide. I'm fluent in Berber, Arabic, French, and English, allowing me to bridge cultural gaps and provide a truly immersive experience for international travelers. My family has lived in this region for generations, and I'm eager to share our traditions, stories, and secret spots with you.",
    "My desert tours include camel treks across the stunning Erg Chigaga dunes, overnight stays in traditional Berber camps under the stars, visits to remote villages, and authentic culinary experiences.",
  ],
  quote: "The desert is my heritage and my home.",
} as const;

export const ABOUT_INTRO =
  "Lover of Sahara is a Zagora-based team of native guides, led by Salah Mouna, running private 4x4 expeditions, nomad camps and camel treks across Erg Chegaga and southern Morocco.";

/** The second half of the intro, for designs that set the first half apart as a headline. */
export const ABOUT_TAIL =
  "Led by Salah Mouna, running private 4x4 expeditions, nomad camps and camel treks across Erg Chegaga and southern Morocco.";

export const STATS = [
  { n: "300m", label: "highest golden sand dunes in Erg Chegaga" },
  { n: "40km", label: "vast unbroken wilderness of the Sahara sea" },
  { n: "100%", label: "private 4x4 expeditions & tailored routes" },
  { n: "1", label: "native team handling camps, transport & safety" },
] as const;

export const VALUES = [
  { title: "Authentic", text: "A native team from Zagora, whose families have lived here for generations, shows you desert life as locals live it." },
  { title: "Wild", text: "Erg Chegaga, 40 km of unbroken dunes reached by 4x4 across dry lakes and the Sacred Oasis, far from the usual routes." },
  { title: "Private", text: "Every expedition is private, with a route shaped around your dates, your group and your pace." },
  { title: "Local", text: "One team looks after your camps, transport and safety from the first pick-up to the last goodbye." },
] as const;

/** Real guest words from the previous site and the reviews on this one, in the language they were written in. */
export const QUOTES = [
  {
    text: "Competent and friendly. Salah knows everything about the desert and its secrets. Truly recommended.",
    name: "Andrea",
    from: "Italy",
  },
  {
    text: "Très belle journée avec Salah qui nous a fait découvrir les dunes de Chegaga, un village nomade avec sa gentillesse et son honnêteté qui nous a guidé à travers de très belles rencontres. On recommande vivement !!! Vous repartirez avec de superbes images et souvenirs.",
    name: "Lauriane",
    from: "France",
  },
  {
    text: "Un immense merci à Salah pour avoir organisé et accompagné notre séjour ! C'était une expérience véritablement authentique, pleine de découvertes et de moments de partage simples mais profonds.",
    name: "Rivière",
    from: "France",
  },
] as const;

/** Soft, general commitments drawn from how the trips already run. TODO(owner): confirm or refine these. */
export const SUSTAINABILITY = [
  { title: "Local people first", text: "The team that guides, drives and cooks for you lives in Zagora, so your journey supports the region you visit." },
  { title: "Small, private groups", text: "Private 4x4 expeditions keep the footprint of each journey small and the experience quiet." },
  { title: "Respect for the desert", text: "Our guides share how to move through dunes, oases and villages with care, so they stay as wild as you found them." },
] as const;

export const FAQ = [
  { q: "Are the expeditions private?", a: "Yes. Every expedition is a private 4x4 journey with a tailored route, so it is just your group and your guide." },
  { q: "Who will guide us?", a: "Salah Mouna and our native team from Zagora. Salah speaks Berber, Arabic, French and English." },
  { q: "Where do the trips start?", a: "We run trips from Zagora, Marrakech and Agadir, across Erg Chegaga and the south of Morocco." },
  { q: "Can the trip be adapted to us?", a: "Yes. All trips can be customised to suit your preferences. Tell us your dates and group size and we will shape the journey around you." },
  { q: "What should we pack?", a: "Our Desert Packing Guide on the blog covers clothing, sun protection and what to bring for a night in a desert camp." },
] as const;

export const CTA = {
  title: "Plan your Sahara journey",
  lead: "Tell us your dates and group size and Salah and the team will shape the journey around you.",
  button: "Get in touch",
  mailto: "mailto:contact@loverofsahara.com?subject=Planning%20a%20trip%20with%20Lover%20of%20Sahara",
} as const;

/** Section tabs shown at the bottom of the page. */
export const ABOUT_TABS = [
  { id: "story", label: "Story" },
  { id: "salah", label: "Salah" },
  { id: "values", label: "Values" },
  { id: "reviews", label: "Reviews" },
  { id: "sustainability", label: "Sustainability" },
  { id: "faq", label: "FAQ" },
] as const;
