import { MessageCircle, Phone } from "lucide-react";
import { TRIP_CATEGORIES } from "@/data/trips";
import { PLACES } from "@/data/places";
import { CONTACT, phoneHref, whatsappBase } from "@/components/contact/data";
import { useLanguage } from "@/i18n/LanguageProvider";
import { placePath, tripsPath } from "@/lib/routes";

/** Places worth a link from the footer (all have a real page). */
const FEATURED_PLACES = ["zagora", "erg-chegaga", "ait-ben-haddou", "dades-gorges"] as const;

const chip =
  "inline-flex h-9 items-center rounded-full border border-white/20 bg-white/5 px-3.5 text-[13px] font-medium text-white/85 outline-none transition-colors hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white/60";

/**
 * Phone-only filler for the dark footer: trip types, ways to reach us, top destinations. Every link goes to a
 * page that exists. The footer is exactly one screen tall, so each group carries a tier class (see styles.css,
 * `.ftr-t1..3`) and only shows when the footer is tall enough for it. Nothing is ever clipped.
 */
export function FooterExplore({ className }: { className?: string }) {
  const { ui, lang } = useLanguage();
  return (
    <div className={className}>
      <div className="ftr-t1 mt-5 flex-wrap gap-2">
        {TRIP_CATEGORIES.map((c) => (
          <a key={c} href={`${tripsPath(lang)}?category=${c}`} className={chip}>
            {ui.categories[c]}
          </a>
        ))}
      </div>

      <div className="ftr-t2 mt-4 flex-wrap items-center gap-x-5 gap-y-2 text-[14px] font-medium text-white/80">
        <a href={whatsappBase} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
          <MessageCircle size={16} aria-hidden /> WhatsApp
        </a>
        <a href={phoneHref} className="inline-flex items-center gap-2">
          <Phone size={16} aria-hidden /> {CONTACT.phoneDisplay}
        </a>
      </div>

      <div className="ftr-t3 mt-5 flex-wrap gap-2">
        {FEATURED_PLACES.filter((id) => PLACES[id]).map((id) => (
          <a key={id} href={placePath(id)} className={chip}>
            {PLACES[id]!.name}
          </a>
        ))}
      </div>
    </div>
  );
}
