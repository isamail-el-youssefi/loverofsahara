import { AboutEditorial } from "@/components/about/AboutEditorial";
import { AboutPortrait } from "@/components/about/AboutPortrait";
import { AboutStory } from "@/components/about/AboutStory";
import { ABOUT_TABS } from "@/components/about/content";
import { SectionTabs } from "@/components/trip/SectionTabs";
import { useAboutStyle } from "@/hooks/use-about-style";
import { usePageSeo } from "@/lib/seo";
import { aboutSeo } from "@/lib/seoData";

/** About Lover of Sahara and its owner, Salah Mouna. The design is chosen in the theme switcher ("About page"). */
export function About() {
  usePageSeo(aboutSeo());
  const style = useAboutStyle();
  return (
    <>
      {style === "story" ? <AboutStory /> : style === "portrait" ? <AboutPortrait /> : <AboutEditorial />}
      <SectionTabs items={[...ABOUT_TABS]} />
    </>
  );
}
