/**
 * Old trip number -> new slug. This is the ONLY place slugs are defined.
 * Rename a slug here and re-run `npm run trips:import` (it also regenerates docs/trips-slug-map.md).
 * `legacyId` stays on every trip so old URLs (/trips/7, /excursions/10, ...) can be redirected later.
 */
export const SLUG_BY_LEGACY_ID = {
  1: "5-day-nomad-journey",
  2: "3-day-sahara-sprint",
  3: "6-day-sahara-odyssey",
  4: "2-day-desert-getaway",
  5: "agadir-erg-chegaga-6-day-circuit",
  6: "7-day-sahara-trekking",
  7: "ouarzazate-erg-chegaga-3-day-circuit",
  8: "gorges-saghro-chegaga-3-day-circuit",
  9: "zagora-erg-chegaga-3-day-excursion",
  10: "erg-chegaga-1-day-excursion",
  11: "marrakech-lihoudi-2-day-excursion",
  12: "2-day-desert-escape",
  13: "ouarzazate-erg-chegaga-2-day-circuit",
  14: "marrakech-erg-chegaga-4-day-crossing",
  15: "4-day-nomadic-sahara-circuit",
  16: "7-day-southern-odyssey",
  17: "anti-atlas-atlantic-6-day-circuit",
  18: "erg-chegaga-2-day-immersion",
} as const satisfies Record<number, string>;

export type LegacyTripId = keyof typeof SLUG_BY_LEGACY_ID;
export type TripSlug = (typeof SLUG_BY_LEGACY_ID)[LegacyTripId];

export const LEGACY_ID_BY_SLUG: Record<string, number> = Object.fromEntries(
  Object.entries(SLUG_BY_LEGACY_ID).map(([id, slug]) => [slug, Number(id)]),
);
