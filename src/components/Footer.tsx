import { FooterEditorial } from "@/components/footer/FooterEditorial";
import { FooterSpotlight } from "@/components/footer/FooterSpotlight";
import { useIsMobile } from "@/hooks/use-mobile";

/** Phones always get the Spotlight footer (dark band led by the Google rating). On desktop it is only the Brochures page; every other page keeps the Editorial one. */
export function Footer({ variant = "editorial" }: { variant?: "editorial" | "spotlight" }) {
  const isMobile = useIsMobile();
  if (variant === "spotlight") return <FooterSpotlight />; // Brochures page: corners stay as they were
  return isMobile ? <FooterSpotlight roundedTop /> : <FooterEditorial />;
}
