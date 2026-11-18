import { useEffect, useMemo, useState } from "react";
import { buildGalleryPhotos, type GalleryPhoto } from "@/data/gallery";
import { tripImage } from "@/data/trips";
import { loadLegacyMediaCached } from "@/data/trips/media";
import type { LegacyMedia } from "@/data/trips/schema";
import { useTrips } from "@/hooks/use-trips";
import type { LocalizedTrip } from "@/data/trips";

export interface GalleryData {
  status: "loading" | "ready" | "error";
  photos: GalleryPhoto[];
  /** Trips in the current language, by slug. */
  trips: Map<string, LocalizedTrip>;
  /** Departure cities with the number of photos, most photos first. */
  cities: { city: string; count: number }[];
}

/** Sized ImageKit URL of a gallery photo. */
export const photoSrc = (p: GalleryPhoto, w = 900) => tripImage(p.path, w) ?? "";

/** The gallery photos and the trips they belong to (titles follow the site language). */
export function useGalleryPhotos(): GalleryData {
  const { trips, status: tripStatus } = useTrips();
  const [media, setMedia] = useState<Record<string, LegacyMedia> | null>(null);
  const [mediaError, setMediaError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadLegacyMediaCached()
      .then((m) => !cancelled && setMedia(m))
      .catch(() => !cancelled && setMediaError(true));
    return () => {
      cancelled = true;
    };
  }, []);

  return useMemo(() => {
    const bySlug = new Map(trips.map((t) => [t.slug, t]));
    if (!media || tripStatus !== "ready") {
      return { status: mediaError || tripStatus === "error" ? "error" : "loading", photos: [], trips: bySlug, cities: [] } as GalleryData;
    }
    const photos = buildGalleryPhotos(media, trips);
    const counts = new Map<string, number>();
    for (const p of photos) for (const c of p.cities) counts.set(c, (counts.get(c) ?? 0) + 1);
    const cities = [...counts.entries()].map(([city, count]) => ({ city, count })).sort((a, b) => b.count - a.count);
    return { status: "ready", photos, trips: bySlug, cities } as GalleryData;
  }, [media, mediaError, trips, tripStatus]);
}
