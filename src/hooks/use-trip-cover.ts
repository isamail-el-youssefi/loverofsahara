import { useEffect, useState } from "react";
import { getTripBySlug } from "@/data/trips";
import { getCover, loadLegacyMediaCached, tripImage } from "@/data/trips/media";
import type { CoverKey } from "@/data/trips/schema";

/**
 * Cover image URL for a trip card: the card photo the old site used for that trip. A trip without one
 * falls back to its first itinerary photo (placeholder until that is known).
 */
export function useTripCover(slug: string, fallbackKey: CoverKey, width = 1000) {
  const cardImage = getTripBySlug(slug)?.cardImage;
  const [firstPhoto, setFirstPhoto] = useState<string | undefined>();
  useEffect(() => {
    if (cardImage) return;
    let alive = true;
    loadLegacyMediaCached()
      .then((all) => {
        const days = all[slug]?.days ?? {};
        const first = days["day1"]?.[0] ?? Object.values(days)[0]?.[0];
        if (alive && first) setFirstPhoto(tripImage(first, width));
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [slug, width, cardImage]);
  return (cardImage && tripImage(cardImage, width)) ?? firstPhoto ?? getCover(fallbackKey);
}
