import { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TripsMenuPanel } from "@/components/navbar/TripsMenu";
import { OriginButton } from "@/components/ui/origin-button";
import { TextRollHover } from "@/components/ui/text-stagger-hover";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MobileMenu } from "@/components/navbar/MobileMenu";
import { useLanguage } from "@/i18n/LanguageProvider";
import { PAGES } from "@/i18n/pages";
import { useTripT } from "@/i18n/useTripT";
import { localePath } from "@/lib/routes";

export function Navbar({ theme = "dark", className = "" }: { theme?: "dark" | "light", className?: string }) {
  const { ui, site, lang } = useLanguage();
  const T = useTripT();
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const [navH, setNavH] = useState(0);
  useLayoutEffect(() => {
    if (!open || !navRef.current) return;
    const el = navRef.current;
    const read = () => setNavH(el.offsetHeight);
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, [open]);
  const links: { label: string; href: string; xlOnly?: boolean }[] = [
    { label: ui.navTrips, href: localePath(lang, "/trips") },
    { label: PAGES[lang].blog.name, href: localePath(lang, "/blog") },
    { label: site.footer.cols[0]!.links[0]!, href: localePath(lang, "/about") },
    { label: ui.navBrochures, href: localePath(lang, "/brochures"), xlOnly: true },
    { label: ui.navGallery, href: localePath(lang, "/gallery"), xlOnly: true },
  ];
  // While the menu is open the navbar sits on the menu's colour, so it takes that colour's tones.
  const isLight = open || theme === "light";
  const textColor = isLight ? "text-ink" : "text-white";
  const textMuted = isLight ? "text-ink/70 hover:text-ink" : "text-white/90 hover:text-white";
  const borderColor = isLight ? "border-ink" : "border-white";
  const borderMuted = isLight ? "border-black/20" : "border-white/40";
  const dividerColor = isLight ? "text-ink/20" : "text-white/40";

  return (
    <nav
      ref={navRef}
      onMouseLeave={() => setOpen(false)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
      className={`site-nav absolute top-0 left-0 right-0 z-50 flex w-full items-center justify-between py-6 md:py-8 px-4 sm:px-6 md:px-12 ${className}`}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            key="trips-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{ paddingTop: navH, minHeight: "70vh" }}
            className="absolute inset-x-[4px] top-0 -z-10 flex flex-col rounded-b-lg bg-paper text-ink shadow-[0_30px_80px_-30px_rgba(0,0,0,0.45)] [.hero-frame_&]:inset-x-0 [.nav-framed_&]:inset-x-0"
            onClick={() => setOpen(false)}
          >
            <TripsMenuPanel />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="nav-left flex items-center gap-2 sm:gap-3">
        <a
          href="#"
          className={`nav-logo -my-2 whitespace-nowrap py-2 text-[20px] leading-[1.05] sm:text-2xl md:texxl font-bold tracking-tight transition-[transform,color] duration-100 ease-out active:scale-[0.98] ${textColor}`}
        >
          LOVER OF SAHARA
        </a>
        {/* Phones and tablets: the language lives in the menu */}
        <span className="hidden lg:inline-flex">
          <LanguageSwitcher light={isLight} />
        </span>
      </div>
      <div className="nav-right flex items-center gap-6 md:gap-8">
        <div className="nav-links hidden items-center gap-6 lg:flex">
          {links.map((l) => {
            const link = (
              <a
                key={l.label}
                href={l.href}
                className={`text-sm md:text-[15px] font-medium transition-colors ${textMuted} ${l.xlOnly ? "hidden xl:inline" : ""}`}
              >
                <TextRollHover activeClassName={isLight ? "text-ink" : "text-white"}>
                  {l.label}
                </TextRollHover>
              </a>
            );
            if (l.href !== "/trips") {
              return (
                <span key={l.label} className={l.xlOnly ? "hidden xl:inline" : ""} onMouseEnter={() => setOpen(false)}>
                  {link}
                </span>
              );
            }
            return (
              <div
                key={l.label}
                onMouseEnter={() => setOpen(true)}
                onFocus={() => setOpen(true)}
              >
                {link}
              </div>
            );
          })}
        </div>
        <div className="nav-actions flex items-center gap-3">
          <MobileMenu light={isLight} />
          <span className={`hidden lg:inline ${dividerColor}`}>|</span>
          <span className="hidden lg:inline-flex">
            <OriginButton
              href={localePath(lang, "/contact")}
              variant={isLight ? "default" : "white"}
              className={`h-9 rounded-[10px] border ${borderMuted} px-5 text-sm font-medium ${textColor} transition-all duration-100 ease-out active:scale-[0.98]`}
            >
              {site.footer.cols[0]!.links[1]}
            </OriginButton>
          </span>
          <span className="hidden lg:inline-flex">
          <OriginButton
            href={localePath(lang, "/contact")}
            variant={isLight ? "default" : "white"}
            className={`h-11 whitespace-nowrap rounded-[10px] border ${borderColor} px-4 sm:px-5 md:h-9 text-sm font-medium ${textColor} transition-all duration-100 ease-out active:scale-[0.98]`}
          >
            {T.bookTour}
          </OriginButton>
          </span>
        </div>
      </div>
    </nav>
  );
}
