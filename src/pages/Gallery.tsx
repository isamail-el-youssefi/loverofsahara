import { GalleryJourneys } from "@/components/gallery/GalleryJourneys";
import { GalleryMosaic } from "@/components/gallery/GalleryMosaic";
import { GallerySpotlight } from "@/components/gallery/GallerySpotlight";
import { usePhotosStyle } from "@/hooks/use-photos-style";
import { useLanguage } from "@/i18n/LanguageProvider";
import { usePageSeo } from "@/lib/seo";
import { gallerySeo } from "@/lib/seoData";

/** Photos from every journey. The design is chosen in the theme switcher ("Gallery page"). */
export function Gallery() {
  const { lang } = useLanguage();
  usePageSeo(gallerySeo(lang));
  const style = usePhotosStyle();
  return style === "journeys" ? <GalleryJourneys /> : style === "spotlight" ? <GallerySpotlight /> : <GalleryMosaic />;
}
