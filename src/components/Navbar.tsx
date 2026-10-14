import { OriginButton } from "@/components/ui/origin-button";
import { TextRollHover } from "@/components/ui/text-stagger-hover";

const navLinks = [
  { label: "Expeditions", href: "#expeditions" },
  { label: "Destinations", href: "#destinations" },
  { label: "Erg Chegaga", href: "#process" },
  { label: "Itinerary", href: "#itinerary" },
  { label: "Sahara Stories", href: "#blog" },
];

export function Navbar({ theme = "dark", className = "" }: { theme?: "dark" | "light", className?: string }) {
  const isLight = theme === "light";
  const textColor = isLight ? "text-black" : "text-white";
  const textMuted = isLight ? "text-black/70 hover:text-black" : "text-white/90 hover:text-white";
  const borderColor = isLight ? "border-black" : "border-white";
  const borderMuted = isLight ? "border-black/20" : "border-white/40";
  const dividerColor = isLight ? "text-black/20" : "text-white/40";

  return (
    <nav
      className={`absolute top-0 left-0 right-0 z-50 flex w-full items-center justify-between py-6 md:py-8 px-6 md:px-12 ${className}`}
    >
      <a
        href="#"
        className={`text-xl md:text-2xl font-bold tracking-tight transition-transform duration-100 ease-out active:scale-[0.98] ${textColor}`}
      >
        LOVER OF SAHARA
      </a>
      <div className="flex items-center gap-6 md:gap-8">
        <div className="hidden items-center gap-6 lg:flex">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className={`text-sm md:text-[15px] font-medium transition ${textMuted}`}
            >
              <TextRollHover activeClassName={isLight ? "text-black font-semibold" : "text-white font-semibold"}>
                {l.label}
              </TextRollHover>
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className={`hidden sm:inline ${dividerColor}`}>|</span>
          <OriginButton
            href="#contact"
            variant={isLight ? "default" : "white"}
            className={`h-9 rounded-[10px] border ${borderMuted} px-5 text-sm font-medium ${textColor} transition-all duration-100 ease-out active:scale-[0.98]`}
          >
            Contact
          </OriginButton>
          <OriginButton
            href="#contact"
            variant={isLight ? "default" : "white"}
            className={`h-9 rounded-[10px] border ${borderColor} px-5 text-sm font-medium ${textColor} transition-all duration-100 ease-out active:scale-[0.98]`}
          >
            Book Tour
          </OriginButton>
        </div>
      </div>
    </nav>
  );
}
