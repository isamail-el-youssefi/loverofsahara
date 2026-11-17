import { OriginButton } from "@/components/ui/origin-button";
import { TextRollHover } from "@/components/ui/text-stagger-hover";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/i18n/LanguageProvider";

const navLinks = [
  { label: "Expeditions", href: "#expeditions" },
  { label: "Destinations", href: "#destinations" },
  { label: "Erg Chegaga", href: "#process" },
  { label: "Sahara Stories", href: "/blog" },
  { label: "About", href: "/about" },
];

export function Navbar({ theme = "dark", className = "" }: { theme?: "dark" | "light", className?: string }) {
  const { ui } = useLanguage();
  const links = [...navLinks.slice(0, 3), { label: ui.navTrips, href: "/trips" }, ...navLinks.slice(3)];
  const isLight = theme === "light";
  const textColor = isLight ? "text-ink" : "text-white";
  const textMuted = isLight ? "text-ink/70 hover:text-ink" : "text-white/90 hover:text-white";
  const borderColor = isLight ? "border-ink" : "border-white";
  const borderMuted = isLight ? "border-black/20" : "border-white/40";
  const dividerColor = isLight ? "text-ink/20" : "text-white/40";

  return (
    <nav
      className={`site-nav absolute top-0 left-0 right-0 z-50 flex w-full items-center justify-between py-6 md:py-8 px-4 sm:px-6 md:px-12 ${className}`}
    >
      <div className="nav-left flex items-center gap-2 sm:gap-3">
        <a
          href="#"
          className={`nav-logo w-[6.6rem] text-[17px] leading-[1.05] sm:w-auto sm:text-xl md:texxl font-bold tracking-tight transition-transform duration-100 ease-out active:scale-[0.98] ${textColor}`}
        >
          LOVER OF SAHARA
        </a>
        <ThemeSwitcher light={isLight} />
        <LanguageSwitcher light={isLight} />
      </div>
      <div className="nav-right flex items-center gap-6 md:gap-8">
        <div className="nav-links hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className={`text-sm md:text-[15px] font-medium transition ${textMuted}`}
            >
              <TextRollHover activeClassName={isLight ? "text-ink font-semibold" : "text-white font-semibold"}>
                {l.label}
              </TextRollHover>
            </a>
          ))}
        </div>
        <div className="nav-actions flex items-center gap-3">
          <span className={`hidden sm:inline ${dividerColor}`}>|</span>
          {/* "Contact" is dropped on phones: Book Tour goes to the same place and space is tight */}
          <span className="hidden sm:inline-flex">
            <OriginButton
              href="/contact"
              variant={isLight ? "default" : "white"}
              className={`h-9 rounded-[10px] border ${borderMuted} px-5 text-sm font-medium ${textColor} transition-all duration-100 ease-out active:scale-[0.98]`}
            >
              Contact
            </OriginButton>
          </span>
          <OriginButton
            href="/contact"
            variant={isLight ? "default" : "white"}
            className={`h-9 whitespace-nowrap rounded-[10px] border ${borderColor} px-4 sm:px-5 text-sm font-medium ${textColor} transition-all duration-100 ease-out active:scale-[0.98]`}
          >
            Book Tour
          </OriginButton>
        </div>
      </div>
    </nav>
  );
}
