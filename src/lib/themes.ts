export interface SiteTheme {
  id: string;
  name: string;
  mood: string;
  /** Preview swatches [paper, accent, mid, ink] shown in the picker. */
  swatches: [string, string, string, string];
}

export const THEMES: SiteTheme[] = [
  { id: "classic", name: "Classic", mood: "Crisp white & ink", swatches: ["#ffffff", "#ac2a1c", "#a3a3a3", "#141414"] },
  { id: "amber-walnut", name: "Amber Walnut", mood: "Terracotta dunes", swatches: ["#EBEFEE", "#BB6C43", "#CCB499", "#4A413C"] },
  { id: "desert-cocoa", name: "Desert Cocoa", mood: "Warm sand & cocoa", swatches: ["#F4E6D2", "#A78D78", "#6E473B", "#291C0E"] },
  { id: "mother-earth", name: "Mother Earth", mood: "Soft cream & earth", swatches: ["#F4F1E2", "#FCE6B7", "#D7D4B1", "#513229"] },
  { id: "yacht-club", name: "Yacht Club", mood: "Oasis teal & clay", swatches: ["#F2F0EF", "#245F73", "#BBBDBC", "#733E24"] },
  { id: "red-dot", name: "Red Dot", mood: "Warm stone & brick", swatches: ["#F4F3EF", "#9D3828", "#B78984", "#2C2623"] },
];

export interface SiteFont {
  id: string;
  name: string;
  mood: string;
  /** Preview font stacks [heading, body, accent] shown in the picker. */
  preview: [string, string, string];
}

export const FONTS: SiteFont[] = [
  { id: "default", name: "Geist", mood: "Current clean sans", preview: ['"Geist", sans-serif', '"Geist", sans-serif', '"Geist", sans-serif'] },
  {
    id: "red-dot",
    name: "Red Dot",
    mood: "Serif headings, grotesk body, script accents",
    preview: ['"F37 Wicklow", serif', '"PP Neue Montreal", sans-serif', '"Caveat", cursive'],
  },
  {
    id: "sahara-editorial",
    name: "Sahara Editorial",
    mood: "Warm soft serif headings, friendly DM Sans body",
    preview: ['"Fraunces", serif', '"DM Sans", sans-serif', '"Fraunces", serif'],
  },
];

export const FONT_STORAGE_KEY = "los-font";
export const DEFAULT_FONT = "red-dot";

export function applyFont(id: string) {
  document.documentElement.setAttribute("data-font", id);
  try {
    localStorage.setItem(FONT_STORAGE_KEY, id);
  } catch {
    /* storage unavailable */
  }
}

/** Colour theme, typography and trip cards are fixed (no switcher). */
export function getStoredFont(): string {
  return DEFAULT_FONT;
}

export const THEME_STORAGE_KEY = "los-theme";
export const DEFAULT_THEME = "amber-walnut";

export function applyTheme(id: string, animate = true) {
  const root = document.documentElement;
  if (animate) {
    root.classList.add("theme-switching");
    window.setTimeout(() => root.classList.remove("theme-switching"), 500);
  }
  root.setAttribute("data-theme", id);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, id);
  } catch {
    /* storage unavailable */
  }
}

export function getStoredTheme(): string {
  return DEFAULT_THEME;
}

/* ---------- Trip card designs ---------- */

export interface CardStyle {
  id: string;
  name: string;
  mood: string;
}

export const CARD_STYLES: CardStyle[] = [
  { id: "classic", name: "Classic", mood: "Photo, pills, summary & price" },
  { id: "minimal", name: "Minimal", mood: "Photo, title and one line" },
  { id: "editorial", name: "Editorial", mood: "Clean photo, text underneath" },
  { id: "plaque", name: "Plaque", mood: "Photo with a floating label" },
  { id: "reveal", name: "Reveal", mood: "Title only, details on hover" },
  { id: "caption", name: "Caption", mood: "Bare photo, hairline title & price" },
  { id: "index", name: "Index", mood: "Numbered, title only" },
  { id: "centered", name: "Centered", mood: "Symmetrical title & days" },
  { id: "frame", name: "Frame", mood: "Photo in a gallery mat" },
  { id: "corner", name: "Corner", mood: "Title left, price right" },
];

export const CARD_STORAGE_KEY = "los-card";
export const CARD_EVENT = "los-card-change";
export const DEFAULT_CARD = "minimal";

export function getStoredCardStyle(): string {
  return DEFAULT_CARD;
}

export function applyCardStyle(id: string) {
  try {
    localStorage.setItem(CARD_STORAGE_KEY, id);
  } catch {
    /* storage unavailable */
  }
  window.dispatchEvent(new Event(CARD_EVENT));
}

/* ---------- Trip page (detail) layouts ---------- */

export const DETAIL_STYLES: CardStyle[] = [
  { id: "reddot", name: "Red Dot", mood: "Section tabs, route map, light & dark bands" },
  { id: "editorial", name: "Editorial", mood: "Full hero, then calm sections" },
  { id: "split", name: "Split", mood: "Sticky summary beside the journey" },
  { id: "index", name: "Index", mood: "Compact hero, collapsible days" },
  { id: "cinematic", name: "Cinematic", mood: "A full-width photo for each day" },
];

export const DETAIL_STORAGE_KEY = "los-detail";
export const DETAIL_EVENT = "los-detail-change";
export const DEFAULT_DETAIL = "reddot";

export function getStoredDetailStyle(): string {
  try {
    const id = localStorage.getItem(DETAIL_STORAGE_KEY);
    if (id && DETAIL_STYLES.some((c) => c.id === id)) return id;
  } catch {
    /* storage unavailable */
  }
  return DEFAULT_DETAIL;
}

export function applyDetailStyle(id: string) {
  try {
    localStorage.setItem(DETAIL_STORAGE_KEY, id);
  } catch {
    /* storage unavailable */
  }
  window.dispatchEvent(new Event(DETAIL_EVENT));
}

/* ---------- Home call to action ("Plan Your Sahara Journey") ---------- */

export const CTA_STYLES: CardStyle[] = [
  { id: "classic", name: "Classic", mood: "Boxed card with contact details and photo" },
  { id: "statement", name: "Statement", mood: "Centred headline on paper, nothing else" },
  { id: "photo", name: "Photo", mood: "Full-bleed desert photo, text over it" },
  { id: "ink", name: "Ink", mood: "Dark panel with a ruled contact list" },
];

export const CTA_STORAGE_KEY = "los-cta";
export const CTA_EVENT = "los-cta-change";
export const DEFAULT_CTA = "classic";

export function getStoredCtaStyle(): string {
  try {
    const id = localStorage.getItem(CTA_STORAGE_KEY);
    if (id && CTA_STYLES.some((c) => c.id === id)) return id;
  } catch {
    /* storage unavailable */
  }
  return DEFAULT_CTA;
}

export function applyCtaStyle(id: string) {
  try {
    localStorage.setItem(CTA_STORAGE_KEY, id);
  } catch {
    /* storage unavailable */
  }
  window.dispatchEvent(new Event(CTA_EVENT));
}

/* ---------- Trip page intro (facts + brief under the hero, Red Dot layout) ---------- */

export const INTRO_STYLES: CardStyle[] = [
  { id: "row", name: "Brief + height", mood: "Facts row, then the brief, taller bands" },
  { id: "side", name: "Facts beside the brief", mood: "Brief on the left, facts in a column" },
];

export const INTRO_STORAGE_KEY = "los-intro";
export const INTRO_EVENT = "los-intro-change";
export const DEFAULT_INTRO = "row";

export function getStoredIntroStyle(): string {
  try {
    const id = localStorage.getItem(INTRO_STORAGE_KEY);
    if (id && INTRO_STYLES.some((c) => c.id === id)) return id;
  } catch {
    /* storage unavailable */
  }
  return DEFAULT_INTRO;
}

export function applyIntroStyle(id: string) {
  try {
    localStorage.setItem(INTRO_STORAGE_KEY, id);
  } catch {
    /* storage unavailable */
  }
  window.dispatchEvent(new Event(INTRO_EVENT));
}
