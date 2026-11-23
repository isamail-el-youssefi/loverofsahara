import { PageCta } from "@/components/CtaSection";
import { AboutEditorial } from "@/components/about/AboutEditorial";
import { AboutPortrait } from "@/components/about/AboutPortrait";
import { AboutStory } from "@/components/about/AboutStory";
import { useAboutContent } from "@/components/about/useAboutContent";
import { useLanguage } from "@/i18n/LanguageProvider";
import { SectionTabs } from "@/components/trip/SectionTabs";
import { useAboutStyle } from "@/hooks/use-about-style";
import { usePageSeo } from "@/lib/seo";
import { aboutSeo } from "@/lib/seoData";

/** About Lover of Sahara and its owner, Salah Mouna. The design is chosen in the theme switcher ("About page"). */
export function About() {
  const { lang } = useLanguage();
  usePageSeo(aboutSeo(lang));
  const { ABOUT_TABS } = useAboutContent();
  const style = useAboutStyle();
  return (
    <>
      {style === "story" ? <AboutStory /> : style === "portrait" ? <AboutPortrait /> : <AboutEditorial />}
      <PageCta />
      <SectionTabs items={[...ABOUT_TABS]} />
    </>
  );
}
