import { useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { RedDotLayout } from "@/components/trip/RedDotLayout";
import type { TripCtx } from "@/components/trip/parts";
import { getCover, loadLegacyMedia, tripHeroSrc, tripImage } from "@/data/trips";
import type { LegacyMedia } from "@/data/trips/schema";
import { useDetailStyle } from "@/hooks/use-detail-style";
import { useTrips } from "@/hooks/use-trips";
import { useLanguage } from "@/i18n/LanguageProvider";
import { usePageSeo } from "@/lib/seo";
import { tripSeo, tripShareImage } from "@/lib/seoData";

/**
 * One trip. Loads the data once (text in the current language, photos from the old site) and hands
 * the same context to whichever layout is selected in the theme switcher.
 */
export function TripDetail({ slug }: { slug: string }) {
  const { trips, status } = useTrips();
  const { ui, lang } = useLanguage();
  const layout = useDetailStyle();
  const [media, setMedia] = useState<LegacyMedia | undefined>();

  useEffect(() => {
    let alive = true;
    loadLegacyMedia()
      .then((m) => alive && setMedia(m[slug]))
      .catch(() => alive && setMedia(undefined));
    return () => {
      alive = false;
    };
  }, [slug]);

  const money = useMemo(
    () => new Intl.NumberFormat(lang, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }),
    [lang],
  );

  const trip = trips.find((t) => t.slug === slug);

  // Title, description, canonical, share image and structured data for this trip
  const seoDays = media?.days ?? {};
  const seoPhoto = seoDays["day1"]?.[0] ?? Object.values(seoDays)[0]?.[0];
  usePageSeo(trip ? tripSeo(trip, tripShareImage(trip.slug, seoPhoto ? tripImage(seoPhoto, 1200) : undefined)) : undefined);

  if (!trip) {
    return (
      <div className="relative flex min-h-dvh items-center justify-center px-6">
        <Navbar theme="light" />
        <p className="text-neutral-500">{status === "loading" ? "Loading" : "We could not find that trip."}</p>
      </div>
    );
  }

  const dayImages = (n: number) => media?.days[`day${n}`] ?? [];
  const firstPath = dayImages(1)[0] ?? Object.values(media?.days ?? {})[0]?.[0];
  const related = trips.filter((t) => t.slug !== trip.slug && t.category === trip.category).slice(0, 3);

  const ctx: TripCtx = {
    trip,
    ui,
    dayImages,
    heroSrc: firstPath ? tripImage(firstPath, 2000) : undefined,
    heroDesktop: tripHeroSrc(trip.slug),
    coverFallback: getCover(trip.cover),
    money,
    more: related.length === 3 ? related : trips.filter((t) => t.slug !== trip.slug).slice(0, 3),
  };

  // Phones get the same page as desktop (hero, intro, stops, gallery, reviews, tab bar), with each day as a large panel.
  return <RedDotLayout ctx={ctx} dayPanels={layout === "cinematic"} />;
}
