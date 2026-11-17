/** Everything about a place that is derived from the trips (pure: also used by the build-time prerender). */
import { placeIdForStop } from "./aliases";
import { PLACES, type Place } from "./places";

const MARRAKECH: [number, number] = [31.63, -7.99];

/** Straight-line distance in km (haversine). */
function km(a: [number, number], b: [number, number]) {
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b[0] - a[0]);
  const dLng = rad(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

export interface PlaceFacts {
  id: string;
  place: Place;
  lat: number;
  lng: number;
  /** Approximate straight-line distance from Marrakech, rounded to 5 km (0 for Marrakech itself). */
  kmFromMarrakech: number;
  /** Slugs of the trips that stop here. */
  tripSlugs: string[];
}

interface TripStops {
  slug: string;
  stops: { name: string; lat: number; lng: number }[];
}

export function buildPlaceIndex(trips: readonly TripStops[]): Map<string, PlaceFacts> {
  const map = new Map<string, PlaceFacts>();
  for (const trip of trips) {
    for (const stop of trip.stops) {
      const id = placeIdForStop(stop.name);
      const place = id ? PLACES[id] : undefined;
      if (!id || !place) continue;
      const have = map.get(id);
      if (have) {
        if (!have.tripSlugs.includes(trip.slug)) have.tripSlugs.push(trip.slug);
        continue;
      }
      map.set(id, {
        id,
        place,
        lat: stop.lat,
        lng: stop.lng,
        kmFromMarrakech: id === "marrakech" ? 0 : Math.round(km(MARRAKECH, [stop.lat, stop.lng]) / 5) * 5,
        tripSlugs: [trip.slug],
      });
    }
  }
  return map;
}
