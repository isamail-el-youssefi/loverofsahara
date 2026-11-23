import { BrochuresShelf } from "@/components/brochures/BrochuresShelf";
import { usePageSeo } from "@/lib/seo";
import { brochuresSeo } from "@/lib/seoData";

/** Free PDF guides in six languages. */
export function Brochures() {
  usePageSeo(brochuresSeo());
  return <BrochuresShelf />;
}
