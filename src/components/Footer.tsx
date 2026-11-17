import { useFooterStyle } from "@/hooks/use-footer-style";
import { FooterEditorial } from "@/components/footer/FooterEditorial";
import { FooterMinimal } from "@/components/footer/FooterMinimal";
import { FooterSpotlight } from "@/components/footer/FooterSpotlight";
import { FooterWild } from "@/components/footer/FooterWild";

/** Picks the footer design chosen in the theme switcher. */
export function Footer() {
  const style = useFooterStyle();
  switch (style) {
    case "editorial":
      return <FooterEditorial />;
    case "spotlight":
      return <FooterSpotlight />;
    case "minimal":
      return <FooterMinimal />;
    default:
      return <FooterWild />;
  }
}
