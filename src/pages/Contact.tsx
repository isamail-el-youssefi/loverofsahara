import { ContactEditorial } from "@/components/contact/ContactEditorial";
import { useContactContent } from "@/components/contact/useContactContent";
import { SectionTabs } from "@/components/trip/SectionTabs";
import { useLanguage } from "@/i18n/LanguageProvider";
import { usePageSeo } from "@/lib/seo";
import { contactSeo } from "@/lib/seoData";

/** Contact details and the trip request form. */
export function Contact() {
  const { lang } = useLanguage();
  usePageSeo(contactSeo(lang));
  const t = useContactContent();
  const tabs = [
    { id: "contact", label: t.tabs[0] },
    { id: "how", label: t.tabs[1] },
    { id: "map", label: t.tabs[2] },
    { id: "salah", label: t.tabs[3] },
    { id: "faq", label: t.tabs[4] },
  ];
  return (
    <>
      <ContactEditorial />
      <SectionTabs items={tabs} />
    </>
  );
}
