/**
 * DEMO reviews, for previewing the reviews UI only. Everything here is invented: the names, the texts, the dates.
 * They are never part of the real data: `getReviews` adds them only when the demo switch is on, and the switch
 * exists only in development (`npm run dev`), so they cannot reach the production site or the prerendered pages.
 * Each one carries `demo: true`, which the UI shows as a "Demo" tag.
 */
import type { Review } from "@/lib/reviews";

type Template = Pick<Review, "rating" | "lang" | "comment"> & { photos?: string[]; reply?: string };

// Local landscape photos (the place hero photos) stand in for guests' photos.
const P = (id: string) => `/images/places/${id}.jpg`;

const TEMPLATES: Template[] = [
  {
    rating: 5,
    lang: "en",
    comment: "Unforgettable. Our guide made everything feel effortless.",
  },
  {
    rating: 5,
    lang: "en",
    comment:
      "We were a group of four friends and this was the highlight of our whole Morocco trip. The route was well paced, the camp was far better than we expected, and the evenings by the fire under the stars are something none of us will forget. The guide knew every track and every family along the way, and the food was excellent from the first lunch to the last dinner.",
    photos: [P("zagora"), P("agdz"), P("jbel-saghro")],
    reply: "Thank you so much! It was a pleasure to have your group with us. Come back soon, the dunes will be waiting.",
  },
  {
    rating: 4,
    lang: "en",
    comment:
      "A really good trip with a lovely guide. The long drive on the second day was tiring, but the landscapes made up for it. I would suggest bringing a warm jacket for the night in the desert, it gets cold quickly.",
    reply: "Thank you for the honest feedback and the tip about the jacket. We now remind every guest before the camp night.",
  },
  {
    rating: 5,
    lang: "fr",
    comment:
      "Un voyage magique du début à la fin. Notre guide connaissait parfaitement la région et nous a fait découvrir des endroits que nous n'aurions jamais trouvés seuls. Le bivouac sous les étoiles restera un souvenir inoubliable. Je recommande les yeux fermés.",
    photos: [P("todgha-gorges"), P("dades-gorges")],
    reply: "Merci beaucoup pour ce beau message ! Au plaisir de vous revoir dans le désert.",
  },
  {
    rating: 5,
    lang: "de",
    comment:
      "Sehr herzlicher Empfang, perfekt organisiert und ein Guide, der wirklich Spaß an seiner Arbeit hat. Die Nacht in den Dünen war der Höhepunkt unserer Reise. Wir würden jederzeit wieder mit Lover of Sahara fahren.",
    photos: [P("taznakht")],
  },
  {
    rating: 3,
    lang: "en",
    comment:
      "The scenery was stunning and the guide was kind. For us the days were a little too full, we would have liked more time in each place. Still a memorable experience and good value for money.",
    reply: "Thank you for telling us. We can slow the pace on a private trip, just let us know your preferences when you book.",
  },
  {
    rating: 5,
    lang: "it",
    comment:
      "Un'esperienza incredibile! Dalla partenza da Marrakech fino all'ultima sera nel deserto tutto è stato curato nei dettagli. Il silenzio delle dune non si dimentica. Grazie di cuore a tutta la squadra.",
  },
  {
    rating: 4,
    lang: "es",
    comment:
      "Un viaje precioso con un guía muy atento. Los paisajes son impresionantes y la cena en el campamento fue deliciosa. Volveríamos sin dudarlo, quizá con un día más para descansar.",
    photos: [P("telouet"), P("ait-ben-haddou")],
  },
  {
    rating: 5,
    lang: "en",
    comment:
      "I travelled alone and felt looked after the whole time. The guide shared so much about local life, the tea ceremony with a nomad family was a real highlight, and the camel ride at sunset was magical. Everything was exactly as described, and the team replied to my messages within minutes before the trip.",
  },
];

const NAMES = [
  "Amelia R.",
  "Lucas Bernard",
  "Katharina W.",
  "Marco Ferrante",
  "Sofía Delgado",
  "Daniel O'Connor",
  "Hannah Lindqvist",
  "Yuki T.",
  "Pierre Vasseur",
  "Isabel Moreno",
];

/** 2025-2026 dates, newest last; picked deterministically per review. */
const DATES = ["2026-02-14", "2026-01-22", "2025-12-30", "2025-12-04", "2025-11-18", "2025-10-27", "2025-10-09", "2025-09-21"];

/** Small stable hash so a trip always gets the same demo set. */
const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

/** Six invented reviews for a trip: a mix of lengths, languages, ratings, photos and owner replies. */
export function demoReviews(tripSlug: string): Review[] {
  const start = hash(tripSlug);
  const count = 6;
  return Array.from({ length: count }, (_, i) => {
    // A step of 4 is coprime with the 9 templates, so six reviews are six different ones.
    const t = TEMPLATES[(start + i * 4) % TEMPLATES.length]!;
    const date = DATES[(start + i) % DATES.length]!;
    return {
      id: `demo-${tripSlug}-${i}`,
      trip: tripSlug,
      name: NAMES[(start + i * 2) % NAMES.length]!,
      rating: t.rating,
      comment: t.comment,
      lang: t.lang,
      date,
      photos: t.photos ?? [],
      ...(t.reply ? { reply: { text: t.reply, date } } : {}),
      demo: true,
    } satisfies Review;
  }).sort((a, b) => b.date.localeCompare(a.date));
}
