import { FooterEditorial } from "@/components/footer/FooterEditorial";
import { FooterSpotlight } from "@/components/footer/FooterSpotlight";

/** Editorial on every page; the Brochures page gets the Spotlight one (dark band led by the Google rating). */
export function Footer({ variant = "editorial" }: { variant?: "editorial" | "spotlight" }) {
  return variant === "spotlight" ? <FooterSpotlight /> : <FooterEditorial />;
}
