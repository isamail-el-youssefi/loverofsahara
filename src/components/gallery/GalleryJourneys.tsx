import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { cityLabel } from "@/data/trips";
import type { GalleryPhoto } from "@/data/gallery";
import { useLanguage } from "@/i18n/LanguageProvider";
import { fadeUp } from "@/lib/animations";
import { tripPath } from "@/lib/routes";
import { Lightbox } from "./Lightbox";
import { CityChips, GallerySkeleton, Thumb, ratioAt, useGallery } from "./shared";

/** Paper page: one film strip per journey, titled with the trip and linked to it. */
export function GalleryJourneys() {
  const g = useGallery();
  const { ui } = useLanguage();
  const { t, status, trips, visible } = g;
  const [open, setOpen] = useState<{ photos: GalleryPhoto[]; i: number } | null>(null);

  // Every trip that has photos (in the current city filter), with its own photos
  const rows = useMemo(() => {
    return [...trips.values()]
      .filter((trip) => g.city === "all" || trip.departureCity === g.city)
      .map((trip) => ({ trip, photos: g.photos.filter((p) => p.trips.includes(trip.slug)) }))
      .filter((r) => r.photos.length > 0);
  }, [trips, g.photos, g.city]);

  return (
    <div className="relative">
      <Navbar theme="light" />
      <section className="px-4 pb-28 pt-36 md:px-10 md:pt-44">
        <div className="grid items-end gap-8 pb-10 lg:grid-cols-12 lg:gap-16 lg:pb-14">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-5 text-[13px] font-medium uppercase tracking-[0.18em] text-neutral-500">{t.eyebrow}</p>
            <h1 className="text-[40px] font-semibold leading-[1.02] tracking-[-0.045em] text-ink md:text-[72px] md:font-light">
              <span className="block">{t.title[0]}</span>
              <span className="block text-neutral-400">{t.title[1]}</span>
            </h1>
          </div>
          <div className="lg:col-span-5">
            <p className="max-w-[28rem] text-[15.5px] leading-[1.65] text-ink/70">{t.intro}</p>
            <CityChips ctx={g} className="mt-6" />
          </div>
        </div>

        {status === "loading" && <GallerySkeleton />}
        {status === "error" && <p className="text-[15px] text-neutral-500">{t.empty}</p>}
        {status === "ready" && (
          <div className="flex flex-col">
            {rows.map(({ trip, photos }, ri) => (
              <motion.div key={trip.slug} {...fadeUp} viewport={{ once: true, amount: 0.1 }} className="border-t border-ink/12 py-8 md:py-10">
                <div className="mb-5 flex flex-col gap-2 md:mb-6 md:flex-row md:items-end md:justify-between">
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-500">
                      <span className="tabular-nums">{String(ri + 1).padStart(2, "0")}</span> · {ui.days(trip.durationDays)} · {t.from} {cityLabel(trip.departureCity)}
                    </p>
                    <h2 className="mt-1.5 text-[26px] font-light leading-[1.08] tracking-[-0.03em] text-ink md:text-[36px]">{trip.title}</h2>
                  </div>
                  <a
                    href={tripPath(trip.slug)}
                    className="shrink-0 self-start rounded-full border border-ink/25 px-4 py-2 text-[14px] font-medium text-ink outline-none transition-colors hover:border-ink hover:bg-ink hover:text-paper focus-visible:ring-2 focus-visible:ring-ink md:self-auto"
                  >
                    {t.viewTrip} →
                  </a>
                </div>
                <div
                  data-lenis-prevent-wheel
                  className="-mx-4 flex snap-x snap-mandatory gap-[6px] overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:-mx-10 md:px-10"
                >
                  {photos.map((p, i) => (
                    <button
                      key={p.path}
                      type="button"
                      onClick={() => setOpen({ photos, i })}
                      aria-label={trip.title}
                      className="group h-[220px] shrink-0 snap-start overflow-hidden rounded-[4px] outline-none focus-visible:ring-2 focus-visible:ring-ink md:h-[300px]"
                    >
                      <Thumb
                        photo={p}
                        alt={trip.title}
                        w={700}
                        className={`h-full ${ratioAt(i + ri)}`}
                        imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.045]"
                        eager={ri === 0 && i < 4}
                      />
                    </button>
                  ))}
                </div>
              </motion.div>
            ))}
            {rows.length === 0 && <p className="text-[15px] text-neutral-500">{t.empty}</p>}
            <div className="border-t border-ink/12" />
          </div>
        )}
      </section>

      <Lightbox photos={open?.photos ?? visible} index={open ? open.i : null} onIndex={(i) => setOpen((o) => (o ? { ...o, i } : o))} onClose={() => setOpen(null)} data={g} t={t} />
    </div>
  );
}
