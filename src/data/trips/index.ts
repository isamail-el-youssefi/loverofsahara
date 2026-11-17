import metaJson from "./trips.meta.json";
import {
  ContentFileSchema,
  TripsMetaFileSchema,
  type Lang,
  type TripCategory,
  type TripContent,
  type TripContentPartial,
  type TripMeta,
} from "./schema";
import { cityLabel, fromPrice } from "./format";
import { LEGACY_ID_BY_SLUG } from "./slugs";

export { LANGS, TRIP_CATEGORIES } from "./schema";
export type { Lang, TripCategory, TripMeta } from "./schema";
export { SLUG_BY_LEGACY_ID } from "./slugs";
export { getCover, tripImage, tripHeroSrc, loadLegacyMedia } from "./media";

// ------------------------------------------------------------------------------------------
// Language-neutral trips (validated once at load)
// ------------------------------------------------------------------------------------------
const TRIPS: readonly TripMeta[] = TripsMetaFileSchema.parse(metaJson);

export const getTrips = () => TRIPS;
export const getTripBySlug = (slug: string) => TRIPS.find((t) => t.slug === slug);
export const getTripByLegacyId = (id: number) => TRIPS.find((t) => t.legacyId === id);
export const slugToLegacyId = (slug: string) => LEGACY_ID_BY_SLUG[slug];

// ------------------------------------------------------------------------------------------
// Text per language (lazy: only the chosen language + English fallback is downloaded)
// ------------------------------------------------------------------------------------------
type ContentFile = Record<string, TripContentPartial>;
const loaders = import.meta.glob<ContentFile>("./content/*.json", { import: "default" });
const cache = new Map<Lang, Promise<ContentFile>>();

export function loadContent(lang: Lang): Promise<ContentFile> {
  let p = cache.get(lang);
  if (!p) {
    const load = loaders[`./content/${lang}.json`];
    if (!load) return Promise.reject(new Error(`No trip content for language "${lang}"`));
    p = load().then((file) => (import.meta.env.DEV ? ContentFileSchema.parse(file) : file));
    cache.set(lang, p);
  }
  return p;
}

// ------------------------------------------------------------------------------------------
// Localised view model
// ------------------------------------------------------------------------------------------
export interface LocalizedDay {
  day: number;
  /** Route headline of that day (language-neutral, as written in the old site). */
  route: string;
  text: string;
  /** true when this day text is the English one because the chosen language has none. */
  fallback: boolean;
}

export interface LocalizedTrip extends TripMeta {
  lang: Lang;
  title: string;
  marketingTitle: string;
  summary: string;
  keyStops: string[];
  included?: string[] | undefined;
  excluded?: string[] | undefined;
  itinerary: LocalizedDay[];
  /** Fields that fell back to English for this language (empty when fully translated). */
  fallbackFields: string[];
  /** Cheapest total per person for the whole trip in EUR (best group-size rate x days). */
  fromPrice: number;
  departureLabel: string;
}

export { cityLabel } from "./format";

export function localizeTrip(
  meta: TripMeta,
  en: TripContent,
  localized: TripContentPartial | undefined,
  lang: Lang,
): LocalizedTrip {
  const fallbackFields: string[] = [];
  const pick = <K extends "title" | "marketingTitle" | "summary" | "keyStops">(key: K): TripContent[K] => {
    const own = localized?.[key];
    if (own !== undefined && (!Array.isArray(own) || own.length > 0)) return own as TripContent[K];
    if (lang !== "en") fallbackFields.push(key);
    return en[key];
  };

  const ownDays = new Map((localized?.itinerary ?? []).map((d) => [d.day, d.text]));
  const itinerary: LocalizedDay[] = en.itinerary.map((d) => {
    const own = ownDays.get(d.day);
    if (!own && lang !== "en" && !fallbackFields.includes("itinerary")) fallbackFields.push("itinerary");
    return { day: d.day, route: meta.dayRoutes[d.day - 1] ?? "", text: own ?? d.text, fallback: !own && lang !== "en" };
  });

  const included = localized?.included ?? en.included;
  const excluded = localized?.excluded ?? en.excluded;
  if (lang !== "en" && en.included && !localized?.included) fallbackFields.push("included");
  if (lang !== "en" && en.excluded && !localized?.excluded) fallbackFields.push("excluded");

  return {
    ...meta,
    lang,
    title: pick("title"),
    marketingTitle: pick("marketingTitle"),
    summary: pick("summary"),
    keyStops: pick("keyStops"),
    included,
    excluded,
    itinerary,
    fallbackFields,
    fromPrice: fromPrice(meta),
    departureLabel: cityLabel(meta.departureCity),
  };
}

export async function loadLocalizedTrips(lang: Lang): Promise<LocalizedTrip[]> {
  const [en, localized] = await Promise.all([
    loadContent("en") as Promise<Record<string, TripContent>>,
    lang === "en" ? Promise.resolve(undefined) : loadContent(lang),
  ]);
  return TRIPS.map((meta) => localizeTrip(meta, en[meta.slug]!, localized?.[meta.slug], lang));
}

export const countByCategory = (trips: readonly { category: TripCategory }[]) =>
  trips.reduce<Record<TripCategory, number>>(
    (acc, t) => ({ ...acc, [t.category]: acc[t.category] + 1 }),
    { trip: 0, excursion: 0, trekking: 0 },
  );
