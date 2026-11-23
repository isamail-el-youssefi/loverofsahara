import { PageCta } from "@/components/CtaSection";
import { AboutPortrait } from "@/components/about/AboutPortrait";
import { useAboutContent } from "@/components/about/useAboutContent";
import { useLanguage } from "@/i18n/LanguageProvider";
import { SectionTabs } from "@/components/trip/SectionTabs";
import { usePageSeo } from "@/lib/seo";
import { aboutSeo } from "@/lib/seoData";

/** About Lover of Sahara and its owner, Salah Mouna. */
export function About() {
  const { lang } = useLanguage();
  usePageSeo(aboutSeo(lang));
  const { ABOUT_TABS } = useAboutContent();
  return (
    <>
      <AboutPortrait />
      <PageCta />
      <SectionTabs items={[...ABOUT_TABS]} showAfter="salah" />
    </>
  );
}
