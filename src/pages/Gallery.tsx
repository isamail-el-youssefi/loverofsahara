import { GalleryMosaic } from "@/components/gallery/GalleryMosaic";
import { useLanguage } from "@/i18n/LanguageProvider";
import { usePageSeo } from "@/lib/seo";
import { gallerySeo } from "@/lib/seoData";

/** Photos from every journey. */
export function Gallery() {
  const { lang } = useLanguage();
  usePageSeo(gallerySeo(lang));
  return <GalleryMosaic />;
}
