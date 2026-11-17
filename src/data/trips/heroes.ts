/**
 * Desktop hero photo per trip. Plain data (no imports) so `scripts/check-trip-heroes.ts` can run it in Node.
 *
 * Why this exists: the trip-day photos in ImageKit are portrait and only 640-1200 px wide, so stretched across a
 * desktop hero they look soft. These are landscape photos of at least 1500 px. Phones keep the portrait day photo.
 *
 * Rule: `place` must be a stop of that trip (checked by `npm run trips:check-heroes`), so the photo always shows
 * somewhere the trip really goes.
 *
 *   local  a file in public/ (the place photos, see docs/place-hero-sources.md)
 *   ik     a path in the owner's ImageKit library (`npm run imagekit:list`)
 *
 * A trip without an entry falls back to its first itinerary photo. Slugs: src/data/trips/slugs.ts.
 * To use sharper originals later, upload them to ImageKit and point `ik` at them.
 */
export interface TripHero {
  /** Place id (src/data/places/aliases.ts) that the photo shows. */
  place: string;
  local?: string;
  ik?: string;
}

const place = (id: string): TripHero => ({ place: id, local: `/images/places/${id}.jpg` });

export const TRIP_HERO: Record<string, TripHero> = {
  "5-day-nomad-journey": place("ait-ben-haddou"),
  "3-day-sahara-sprint": place("tizi-n-tichka"),
  "6-day-sahara-odyssey": place("dades-gorges"),
  "2-day-desert-getaway": place("zagora"),
  "agadir-erg-chegaga-6-day-circuit": place("taroudant"),
  "7-day-sahara-trekking": { place: "erg-chegaga", ik: "/hero/trekking.jpg" },
  "ouarzazate-erg-chegaga-3-day-circuit": place("ouarzazate"),
  "gorges-saghro-chegaga-3-day-circuit": place("jbel-saghro"),
  "zagora-erg-chegaga-3-day-excursion": { place: "erg-chegaga", ik: "/hero/ex.jpg" },
  "erg-chegaga-1-day-excursion": { place: "erg-chegaga", ik: "/card/8.jpg" },
  "marrakech-lihoudi-2-day-excursion": place("marrakech"),
  "2-day-desert-escape": place("tamgroute"),
  "ouarzazate-erg-chegaga-2-day-circuit": place("taznakht"),
  "marrakech-erg-chegaga-4-day-crossing": place("boumalne-dades"),
  "4-day-nomadic-sahara-circuit": place("draa-valley"),
  "7-day-southern-odyssey": place("todgha-gorges"),
  "anti-atlas-atlantic-6-day-circuit": { place: "tafraoute", ik: "/tafraoute/3.jpg" },
  "erg-chegaga-2-day-immersion": { place: "erg-chegaga", ik: "/hero/circuit.jpg" },
};
