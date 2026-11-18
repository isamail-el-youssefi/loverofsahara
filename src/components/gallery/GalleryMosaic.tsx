import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { fadeUp } from "@/lib/animations";
import { Lightbox } from "./Lightbox";
import { CityChips, GallerySkeleton, Thumb, photoAlt, ratioAt, useGallery, useIncremental } from "./shared";

/** Paper page: a mosaic of photos in columns, a sticky city filter, a full-screen viewer. */
export function GalleryMosaic() {
  const g = useGallery();
  const { t, visible, status } = g;
  const [open, setOpen] = useState<number | null>(null);
  const inc = useIncremental(visible.length, g.city);
  const shown = visible.slice(0, inc.count);

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
            {status === "ready" && <p className="mt-4 text-[13px] tabular-nums text-neutral-500">{t.photos(visible.length)}</p>}
          </div>
        </div>

        {/* City filter: floats under the top edge while the mosaic scrolls */}
        <div className="sticky top-3 z-30 mb-8 flex justify-center">
          <div className="max-w-full overflow-x-auto rounded-full border border-ink/10 bg-paper/85 p-1.5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.25)] backdrop-blur-md [scrollbar-width:none]">
            <CityChips ctx={g} className="flex-nowrap" />
          </div>
        </div>

        {status === "loading" && <GallerySkeleton />}
        {status === "error" && <p className="text-[15px] text-neutral-500">{t.empty}</p>}
        {status === "ready" && (
          <div className="columns-2 gap-[6px] md:columns-3 lg:columns-4">
            {shown.map((p, i) => (
              <motion.button
                key={p.path}
                type="button"
                {...fadeUp}
                viewport={{ once: true, amount: 0.05 }}
                onClick={() => setOpen(i)}
                aria-label={photoAlt(g, p)}
                className="group mb-[6px] block w-full break-inside-avoid overflow-hidden rounded-[4px] outline-none focus-visible:ring-2 focus-visible:ring-ink"
              >
                <Thumb
                  photo={p}
                  alt={photoAlt(g, p)}
                  className={ratioAt(i)}
                  imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.045]"
                  eager={i < 8}
                />
              </motion.button>
            ))}
          </div>
        )}

        {status === "ready" && !inc.done && (
          <div ref={inc.sentinel} className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={inc.more}
              className="h-11 rounded-full border border-ink/25 px-6 text-[14px] font-medium text-ink outline-none transition-colors hover:border-ink hover:bg-ink hover:text-paper focus-visible:ring-2 focus-visible:ring-ink"
            >
              {t.more}
            </button>
          </div>
        )}
      </section>

      <Lightbox photos={visible} index={open} onIndex={setOpen} onClose={() => setOpen(null)} data={g} t={t} />
    </div>
  );
}
