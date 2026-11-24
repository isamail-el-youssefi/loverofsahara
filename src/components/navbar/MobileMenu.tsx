import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { LANGUAGES } from "@/i18n/languages";
import { useLanguage } from "@/i18n/LanguageProvider";
import { localePath } from "@/lib/routes";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/** The pages, in the visitor's language. Same set as the desktop navbar, plus Contact. */
function useMenuItems() {
  const { site, ui, lang } = useLanguage();
  const [about, contact] = site.footer.cols[0]!.links;
  return [
    { label: ui.navTrips, href: localePath(lang, "/trips") },
    { label: about!, href: localePath(lang, "/about") },
    { label: "Sahara Stories", href: localePath(lang, "/blog") },
    { label: ui.navBrochures, href: localePath(lang, "/brochures") },
    { label: ui.navGallery, href: localePath(lang, "/gallery") },
    { label: contact!, href: localePath(lang, "/contact") },
  ];
}

/** Burger button (phones and tablets) that opens the menu sheet. */
export function MobileMenu({ light = false }: { light?: boolean }) {
  const [open, setOpen] = useState(false);
  const tone = light
    ? "border-black/15 bg-black/[0.04] text-ink hover:bg-black/[0.08]"
    : "border-white/30 bg-white/10 text-white hover:bg-white/20";
  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={`flex size-11 shrink-0 items-center justify-center rounded-full border shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] outline-none backdrop-blur-md transition-colors focus-visible:ring-2 focus-visible:ring-white/70 lg:hidden ${tone}`}
      >
        <Menu size={20} aria-hidden />
      </button>
      {createPortal(
        <AnimatePresence>{open && <MenuOverlay key="menu" onClose={() => setOpen(false)} />}</AnimatePresence>,
        document.body,
      )}
    </>
  );
}

function MenuOverlay({ onClose }: { onClose: () => void }) {
  const reduce = useReducedMotion();
  const items = useMenuItems();
  const { lang, setLang } = useLanguage();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("keydown", key);
      prev?.focus?.();
    };
  }, [onClose]);

  const closeBtn = (
    <button
      ref={closeRef}
      type="button"
      onClick={onClose}
      aria-label="Close menu"
      className="flex size-11 items-center justify-center rounded-full border border-ink/20 outline-none transition-colors hover:bg-ink hover:text-paper focus-visible:ring-2 focus-visible:ring-current"
    >
      <X size={20} />
    </button>
  );

  const langs = (
    <div role="radiogroup" aria-label="Language" className="flex flex-wrap gap-1.5">
      {LANGUAGES.map((l) => {
        const on = l.code === lang;
        return (
          <button
            key={l.code}
            type="button"
            role="radio"
            aria-checked={on}
            lang={l.htmlLang}
            title={l.native}
            onClick={() => setLang(l.code)}
            className={cn(
              "h-9 rounded-full border px-3.5 text-[13px] font-medium uppercase tracking-wide outline-none transition-colors focus-visible:ring-2 focus-visible:ring-current",
              on ? "border-ink bg-ink text-paper" : "border-ink/20 text-ink/70 hover:border-ink/50 hover:text-ink",
            )}
          >
            {l.code}
          </button>
        );
      })}
    </div>
  );

  const cta = (
    <a
      href={items[5]!.href}
      onClick={onClose}
      className="inline-flex h-[48px] w-full items-center justify-center rounded-[10px] bg-ink px-7 text-sm font-semibold text-paper transition-all duration-100 ease-out hover:bg-ink/85 active:scale-[0.98]"
    >
      Book Tour
    </a>
  );

  const rise = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, ease: EASE, delay: 0.08 + i * 0.045 },
        };

  const fade = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.3 } };

  const sheetMotion = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" }, transition: { duration: 0.45, ease: EASE } };

  return (
    <>
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[199] bg-black/40"
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        data-lenis-prevent
        className="fixed inset-x-[4px] bottom-0 z-[200] max-h-[100dvh] overflow-y-auto rounded-t-2xl bg-paper px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 text-ink shadow-[0_-30px_80px_-30px_rgba(0,0,0,0.5)]"
        {...sheetMotion}
      >
        <div className="mb-3 flex items-center justify-between">
          <span aria-hidden className="ml-1 h-1 w-10 rounded-full bg-ink/20" />
          {closeBtn}
        </div>
        <nav aria-label="Menu">
          <ul className="grid grid-cols-2 gap-[6px]">
            {items.map((l, i) => (
              <motion.li key={l.href} {...rise(i)}>
                <a
                  href={l.href}
                  onClick={onClose}
                  className="flex min-h-[76px] flex-col justify-between rounded-2xl bg-ink/[0.045] p-4 outline-none transition-colors hover:bg-ink/[0.08] focus-visible:ring-2 focus-visible:ring-ink/40"
                >
                  <span className="text-[12px] tabular-nums text-neutral-400">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[18px] font-medium leading-[1.1] tracking-[-0.02em]">{l.label}</span>
                </a>
              </motion.li>
            ))}
          </ul>
        </nav>
        <div className="mt-5 flex flex-col gap-4">
          {langs}
          {cta}
        </div>
      </motion.div>
    </>
  );
}
