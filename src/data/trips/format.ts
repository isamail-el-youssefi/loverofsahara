/** Small pure helpers shared by the app and the build-time prerender (no Vite-only APIs in this file). */
import type { TripMeta } from "./schema";

const CITY_LABELS: Record<string, string> = {
  marrakech: "Marrakech",
  fez: "Fez",
  agadir: "Agadir",
  zagora: "Zagora",
  ouarzazate: "Ouarzazate",
  "mhamid el ghizlane": "M'Hamid El Ghizlane",
};

export const cityLabel = (city: string) => CITY_LABELS[city] ?? city;

/** Cheapest total per person for the whole trip in EUR (best group-size rate x days). */
export const fromPrice = (meta: Pick<TripMeta, "pricing">) =>
  Math.min(...meta.pricing.map((p) => p.pricePerPersonPerDay * p.days));
