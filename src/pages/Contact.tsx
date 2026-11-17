import { ContactDirect } from "@/components/contact/ContactDirect";
import { ContactEditorial } from "@/components/contact/ContactEditorial";
import { ContactSplit } from "@/components/contact/ContactSplit";
import { CONTACT_TABS } from "@/components/contact/data";
import { SectionTabs } from "@/components/trip/SectionTabs";
import { useContactStyle } from "@/hooks/use-contact-style";
import { usePageSeo } from "@/lib/seo";
import { contactSeo } from "@/lib/seoData";

/** Contact details and the trip request form. The design is chosen in the theme switcher ("Contact page"). */
export function Contact() {
  usePageSeo(contactSeo());
  const style = useContactStyle();
  return (
    <>
      {style === "split" ? <ContactSplit /> : style === "direct" ? <ContactDirect /> : <ContactEditorial />}
      <SectionTabs items={[...CONTACT_TABS]} />
    </>
  );
}
