import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { photoSrc } from "@/hooks/use-gallery-photos";
import { tripPath } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { CityChips, GallerySkeleton, Thumb, photoAlt, tripOf, useGallery } from "./shared";

/** Dark page: one big photo that stays in view, a scrolling rail of thumbnails to choose from. */
export function GallerySpotlight() {
  const g = useGallery();
  const { t, visible, status } = g;
  const [index, setIndex] = useState(0);
  const n = visible.length;

  // New filter: back to the first photo
  useEffect(() => setIndex(0), [g.city]);

  const go = (d: number) => n > 0 && setIndex((i) => (i + d + n) % n);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);

  const photo = visible[index];
  const trip = photo ? tripOf(g, photo) : undefined;
  const next = visible[(index + 1) % Math.max(n, 1)];

  return (
    <div className="relative bg-ink-deep text-white">
      <Navbar />
      <section className="px-4 pb-28 pt-32 md:px-10 md:pt-40">
        <div className="grid items-end gap-8 pb-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-5 text-[13px] font-medium uppercase tracking-[0.18em] text-white/60">{t.eyebrow}</p>
            <h1 className="text-[40px] font-semibold leading-[1.02] tracking-[-0.04em] md:text-[68px] md:font-light">
              <span className="block">{t.title[0]}</span>
              <span className="block text-white/45">{t.title[1]}</span>
            </h1>
          </div>
          <div className="lg:col-span-5">
            <p className="max-w-[28rem] text-[15.5px] leading-[1.65] text-white/70">{t.intro}</p>
          </div>
        </div>

        <div className="mb-8 overflow-x-auto [scrollbar-width:none]">
          <CityChips ctx={g} tone="dark" className="flex-nowrap md:flex-wrap" />
        </div>

        {status === "loading" && <GallerySkeleton dark />}
        {status === "error" && <p className="text-[15px] text-white/60">{t.empty}</p>}
        {status === "ready" && photo && (
          <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-12 lg:gap-8">
            {/* The stage */}
            <div className="lg:col-span-8">
              <div className="sticky top-3 lg:top-24">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[8px] bg-white/5 md:aspect-[3/2] lg:max-h-[calc(100dvh-14rem)] [box-shadow:0_40px_80px_-40px_rgba(0,0,0,0.9)]">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.img
                      key={photo.path}
                      src={photoSrc(photo, 1600)}
                      alt={photoAlt(g, photo)}
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      draggable={false}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </AnimatePresence>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => go(-1)}
                      aria-label={t.previous}
                      className="flex size-11 items-center justify-center rounded-full bg-white/90 text-ink-deep outline-none transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-white"
                    >
                      <ArrowLeft size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => go(1)}
                      aria-label={t.next}
                      className="flex size-11 items-center justify-center rounded-full bg-white/90 text-ink-deep outline-none transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-white"
                    >
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[12px] tabular-nums text-white/45">{t.of(index + 1, n)}</p>
                    <p className="mt-1 text-[18px] font-medium tracking-[-0.02em] text-white/90">{trip?.title}</p>
                  </div>
                  {trip && (
                    <a
                      href={tripPath(trip.slug)}
                      className="shrink-0 rounded-full border border-white/30 px-4 py-2 text-[14px] font-medium outline-none transition-colors hover:bg-white hover:text-ink-deep focus-visible:ring-2 focus-visible:ring-white"
                    >
                      {t.viewTrip} →
                    </a>
                  )}
                </div>
              </div>
              {/* Warm the cache for the next photo */}
              {next && <link rel="preload" as="image" href={photoSrc(next, 1600)} />}
            </div>

            {/* The rail */}
            <div
              data-lenis-prevent
              className="grid grid-cols-4 content-start gap-[6px] md:grid-cols-6 lg:col-span-4 lg:max-h-[calc(100dvh-8rem)] lg:grid-cols-3 lg:self-start lg:overflow-y-auto lg:pr-1 lg:[scrollbar-width:thin]"
            >
              {visible.map((p, i) => (
                <button
                  key={p.path}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={photoAlt(g, p)}
                  aria-current={i === index}
                  className={cn(
                    "relative overflow-hidden rounded-[4px] outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-white",
                    i === index ? "opacity-100 ring-2 ring-white" : "opacity-55 hover:opacity-100",
                  )}
                >
                  <Thumb photo={p} alt="" w={320} className="aspect-square" eager={i < 18} />
                </button>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
