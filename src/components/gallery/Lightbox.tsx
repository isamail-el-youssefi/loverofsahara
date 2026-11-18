import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import type { GalleryPhoto } from "@/data/gallery";
import { photoSrc, type GalleryData } from "@/hooks/use-gallery-photos";
import { tripPath } from "@/lib/routes";
import type { GalleryStrings } from "./strings";
import { photoAlt, tripOf } from "./shared";

/** Full-screen viewer: arrows, Esc, swipe. `index` is null when closed. */
export function Lightbox({
  photos,
  index,
  onIndex,
  onClose,
  data,
  t,
}: {
  photos: GalleryPhoto[];
  index: number | null;
  onIndex: (i: number) => void;
  onClose: () => void;
  data: Pick<GalleryData, "trips">;
  t: GalleryStrings;
}) {
  const open = index !== null && photos.length > 0;
  const closeRef = useRef<HTMLButtonElement>(null);
  const touch = useRef<number | null>(null);
  const n = photos.length;
  const go = (d: number) => index !== null && onIndex((index + d + n) % n);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("keydown", key);
      prev?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index, n]);

  const photo = index !== null ? photos[index] : undefined;
  const trip = photo ? tripOf(data, photo) : undefined;

  return createPortal(
    <AnimatePresence>
      {open && photo && (
        <motion.div
          key="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={photoAlt(data, photo)}
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[200] flex flex-col bg-ink-deep/95 text-white backdrop-blur-sm"
          onPointerDown={(e) => (touch.current = e.clientX)}
          onPointerUp={(e) => {
            if (touch.current === null) return;
            const dx = e.clientX - touch.current;
            touch.current = null;
            if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
          }}
        >
          <div className="flex items-center justify-between px-4 py-4 md:px-8">
            <p className="text-[13px] tabular-nums text-white/60">{t.of((index ?? 0) + 1, n)}</p>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={t.close}
              className="flex size-11 items-center justify-center rounded-full border border-white/25 outline-none transition-colors hover:bg-white hover:text-ink-deep focus-visible:ring-2 focus-visible:ring-white"
            >
              <X size={20} />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-20" onClick={onClose}>
            <AnimatePresence mode="wait">
              <motion.img
                key={photo.path}
                src={photoSrc(photo, 1800)}
                alt={photoAlt(data, photo)}
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                draggable={false}
                onClick={(e) => e.stopPropagation()}
                className="max-h-full max-w-full rounded-[6px] object-contain [box-shadow:0_30px_80px_-30px_rgba(0,0,0,0.9)]"
              />
            </AnimatePresence>
            {n > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    go(-1);
                  }}
                  aria-label={t.previous}
                  className="absolute left-3 top-1/2 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-ink-deep/50 outline-none transition-colors hover:bg-white hover:text-ink-deep focus-visible:ring-2 focus-visible:ring-white md:flex"
                >
                  <ArrowLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    go(1);
                  }}
                  aria-label={t.next}
                  className="absolute right-3 top-1/2 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-ink-deep/50 outline-none transition-colors hover:bg-white hover:text-ink-deep focus-visible:ring-2 focus-visible:ring-white md:flex"
                >
                  <ArrowRight size={20} />
                </button>
              </>
            )}
          </div>

          <div className="flex min-h-[72px] items-center justify-between gap-4 px-4 py-4 md:px-8">
            <p className="line-clamp-2 text-[15px] font-medium tracking-[-0.01em] text-white/85">{trip?.title}</p>
            {trip && (
              <a
                href={tripPath(trip.slug)}
                onClick={onClose}
                className="shrink-0 rounded-full border border-white/30 px-4 py-2 text-[14px] font-medium outline-none transition-colors hover:bg-white hover:text-ink-deep focus-visible:ring-2 focus-visible:ring-white"
              >
                {t.viewTrip} →
              </a>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
