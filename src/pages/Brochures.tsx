import { BrochuresEditorial } from "@/components/brochures/BrochuresEditorial";
import { BrochuresIndex } from "@/components/brochures/BrochuresIndex";
import { BrochuresShelf } from "@/components/brochures/BrochuresShelf";
import { useBrochuresStyle } from "@/hooks/use-brochures-style";
import { usePageSeo } from "@/lib/seo";
import { brochuresSeo } from "@/lib/seoData";

/** Free PDF guides in six languages. The design is chosen in the theme switcher ("Brochures page"). */
export function Brochures() {
  usePageSeo(brochuresSeo());
  const style = useBrochuresStyle();
  return style === "shelf" ? <BrochuresShelf /> : style === "index" ? <BrochuresIndex /> : <BrochuresEditorial />;
}
