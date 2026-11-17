import { getTrips } from "@/data/trips";
import { buildPlaceIndex, type PlaceFacts } from "./derive";

export { placeHref, placeIdForStop } from "./aliases";
export { PLACES } from "./places";
export type { Place, PlaceKind } from "./places";
export type { PlaceFacts } from "./derive";

let index: Map<string, PlaceFacts> | undefined;

/** Coordinates, distance from Marrakech and which trips visit a place, derived from the trips. Built once. */
export const getPlace = (id: string): PlaceFacts | undefined => (index ??= buildPlaceIndex(getTrips())).get(id);
