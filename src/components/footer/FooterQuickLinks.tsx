import { TextRollHover } from "@/components/ui/text-stagger-hover";
import { useLanguage } from "@/i18n/LanguageProvider";
import { localePath } from "@/lib/routes";
import { cn } from "@/lib/utils";

/**
 * The short list of footer links for phones: only the pages that exist, in the visitor's language.
 * (The full five-column list on desktop still has placeholder links that go nowhere.)
 */
export function useQuickLinks() {
  const { site, ui, lang } = useLanguage();
  const [about, contact] = site.footer.cols[0]!.links;
  return [
    { name: ui.navTrips, href: localePath(lang, "/trips") },
    { name: about!, href: localePath(lang, "/about") },
    { name: contact!, href: localePath(lang, "/contact") },
    { name: ui.navBrochures, href: localePath(lang, "/brochures") },
    { name: ui.navGallery, href: localePath(lang, "/gallery") },
    { name: site.footer.cols[4]!.links[2]!, href: localePath(lang, "/blog") },
  ];
}

/** Two-column ruled list of the quick links. */
export function FooterQuickLinks({ tone, className }: { tone: "light" | "dark"; className?: string }) {
  const links = useQuickLinks();
  const dark = tone === "dark";
  return (
    <ul className={cn("grid grid-cols-2 gap-x-6", className)}>
      {links.map((l) => (
        <li key={l.href} className={cn("border-t", dark ? "border-white/10" : "border-ink/10")}>
          <a
            href={l.href}
            className={cn("block py-2.5 text-[15px] font-medium transition", dark ? "text-white/80 hover:text-white" : "text-ink/75 hover:text-ink")}
          >
            <TextRollHover activeClassName={dark ? "text-white" : "text-ink"}>{l.name}</TextRollHover>
          </a>
        </li>
      ))}
    </ul>
  );
}
