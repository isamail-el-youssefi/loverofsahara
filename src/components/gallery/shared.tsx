import { useEffect, useMemo, useRef, useState } from "react";
import { cityLabel } from "@/data/trips";
import type { GalleryPhoto } from "@/data/gallery";
import { photoSrc, useGalleryPhotos, type GalleryData } from "@/hooks/use-gallery-photos";
import { useLanguage } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/utils";
import { GALLERY_STRINGS, type GalleryStrings } from "./strings";

/** Everything a gallery design needs: the data, the page text and the current city filter. */
export function useGallery() {
  const data = useGalleryPhotos();
  const { lang } = useLanguage();
  const [city, setCity] = useState<string>("all");
  const visible = useMemo(
    () => (city === "all" ? data.photos : data.photos.filter((p) => p.cities.includes(city))),
    [data.photos, city],
  );
  return { ...data, lang, t: GALLERY_STRINGS[lang], city, setCity, visible };
}
export type GalleryCtx = ReturnType<typeof useGallery>;

/** Title of the trip a photo belongs to (its first trip). */
export const tripOf = (data: Pick<GalleryData, "trips">, p: GalleryPhoto) => data.trips.get(p.trips[0] ?? "");

/** Alt text: the trip the photo comes from. */
export const photoAlt = (data: Pick<GalleryData, "trips">, p: GalleryPhoto) => tripOf(data, p)?.title ?? "";

/** Rotating image ratios, so a column layout looks like a mosaic and nothing jumps while photos load. */
const RATIOS = ["aspect-[4/5]", "aspect-square", "aspect-[3/4]", "aspect-[4/3]", "aspect-[5/6]", "aspect-[5/4]"] as const;
export const ratioAt = (i: number) => RATIOS[i % RATIOS.length]!;

/**
 * Shows the first `start` items and more as the sentinel scrolls into view (and via the button),
 * so a page with hundreds of photos does not request them all at once. Resets when `resetKey` changes.
 */
export function useIncremental(total: number, resetKey: string, start = 32, step = 24) {
  const [count, setCount] = useState(start);
  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => setCount(start), [resetKey, start]);
  useEffect(() => {
    const el = sentinel.current;
    if (!el || count >= total) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setCount((c) => Math.min(total, c + step));
      },
      { rootMargin: "900px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [count, total, step]);
  return { count: Math.min(count, total), more: () => setCount((c) => Math.min(total, c + step)), sentinel, done: count >= total };
}

/** City filter chips. `tone` is the surface they sit on. */
export function CityChips({
  ctx,
  tone = "light",
  className,
}: {
  ctx: Pick<GalleryCtx, "cities" | "photos" | "city" | "setCity" | "t">;
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  const items = [{ key: "all", label: ctx.t.all, count: ctx.photos.length }, ...ctx.cities.map((c) => ({ key: c.city, label: cityLabel(c.city), count: c.count }))];
  return (
    <div role="radiogroup" aria-label="Filter" className={cn("flex flex-wrap gap-1.5", className)}>
      {items.map((it) => {
        const on = ctx.city === it.key;
        return (
          <button
            key={it.key}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => ctx.setCity(it.key)}
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded-full border px-4 text-[14px] font-medium tracking-[-0.01em] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-current",
              on
                ? dark
                  ? "border-white bg-white text-ink-deep"
                  : "border-ink bg-ink text-paper"
                : dark
                  ? "border-white/25 text-white/75 hover:border-white/60 hover:text-white"
                  : "border-ink/20 text-ink/70 hover:border-ink/50 hover:text-ink",
            )}
          >
            {it.label}
            <span className={cn("text-[12px] tabular-nums", on ? "opacity-60" : "opacity-45")}>{it.count}</span>
          </button>
        );
      })}
    </div>
  );
}

/** A photo thumbnail inside a fixed-ratio frame. */
export function Thumb({
  photo,
  alt,
  w = 700,
  className,
  imgClassName,
  eager = false,
}: {
  photo: GalleryPhoto;
  alt: string;
  w?: number;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
}) {
  const [ok, setOk] = useState(true);
  if (!ok) return null;
  return (
    <div className={cn("relative overflow-hidden bg-ink/10", className)}>
      <img
        src={photoSrc(photo, w)}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
        onError={() => setOk(false)}
        className={cn("h-full w-full object-cover", imgClassName)}
      />
    </div>
  );
}

/** Soft grey blocks while the photo list loads. */
export function GallerySkeleton({ dark = false }: { dark?: boolean }) {
  return (
    <div className="columns-2 gap-[6px] md:columns-3 lg:columns-4" aria-hidden>
      {Array.from({ length: 12 }, (_, i) => (
        <div key={i} className={cn("mb-[6px] animate-pulse rounded-[4px]", ratioAt(i), dark ? "bg-white/10" : "bg-ink/10")} />
      ))}
    </div>
  );
}

export type { GalleryStrings };
