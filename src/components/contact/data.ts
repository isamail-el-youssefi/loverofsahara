/**
 * Contact details, in one place. Source: the previous site's contact page and footer.
 * Not shown on purpose (not verified): a street address, opening hours and a promised reply time.
 */
export const CONTACT = {
  email: "loveroffsahara@gmail.com",
  /** Shown as written on the old site. */
  phoneDisplay: "+212 661 842 609",
  /** International digits only, as wa.me and tel: expect. */
  phoneDigits: "212661842609",
  instagram: "https://www.instagram.com/lover_of_sahara/",
  facebook: "https://www.facebook.com/loveroffsahara",
  location: "Zagora, Morocco",
  /** Zagora (the old page's map centre). */
  lat: 30.3267,
  lng: -5.8374,
  languages: ["Berber", "Arabic", "French", "English"],
} as const;

export const whatsappBase = `https://wa.me/${CONTACT.phoneDigits}`;
export const phoneHref = `tel:+${CONTACT.phoneDigits}`;

/** Same three steps in every design. General on purpose: no promised timings. */
export const STEPS = [
  { title: "Tell us your plan", text: "Share your dates, group size and what you would like to see, or pick one of our trips." },
  { title: "We shape your journey", text: "Salah and the team build a private itinerary around you and answer every question." },
  { title: "Confirm and go", text: "Once it feels right, we confirm the details and take care of camps, transport and safety." },
] as const;

export const CONTACT_TABS = [
  { id: "contact", label: "Contact" },
  { id: "how", label: "How it works" },
  { id: "map", label: "Find us" },
  { id: "salah", label: "Your guide" },
  { id: "faq", label: "FAQ" },
] as const;
