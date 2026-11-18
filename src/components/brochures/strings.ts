import type { Lang } from "@/i18n/languages";

/** Page text for the brochures page, in the six site languages. */
export interface BrochureStrings {
  eyebrow: string;
  /** Two-tone headline: [dark part, light part]. */
  title: [string, string];
  intro: string;
  language: string;
  download: string;
  pages: (n: number) => string;
  regional: string;
  regionalLead: string;
  theme: string;
  themeLead: string;
  note: string;
  /** "Free PDF" label in the list design. */
  free: string;
}

export const BROCHURE_STRINGS: Record<Lang, BrochureStrings> = {
  en: {
    eyebrow: "Brochures",
    title: ["Guides to take", "into the desert."],
    intro:
      "Illustrated PDF guides to the Drâa-Tafilalet region: a general guide, one for each province and three thematic ones. Free to download, in six languages.",
    language: "Language",
    download: "Download PDF",
    pages: (n) => `${n} pages`,
    regional: "The five provinces",
    regionalLead: "One guide per province: what to see, customs, food and practical information.",
    theme: "Thematic guides",
    themeLead: "The region as a whole, its nature and food, and the wild dunes of Erg Chegaga.",
    note: "Based on the official guides of Visit Drâa Tafilalet, reproduced with the permission of its publisher. Design by Lover of Sahara.",
    free: "Free PDF",
  },
  fr: {
    eyebrow: "Brochures",
    title: ["Des guides à emporter", "dans le désert."],
    intro:
      "Des guides PDF illustrés de la région Drâa-Tafilalet : un guide général, un par province et trois guides thématiques. Gratuits, en six langues.",
    language: "Langue",
    download: "Télécharger le PDF",
    pages: (n) => `${n} pages`,
    regional: "Les cinq provinces",
    regionalLead: "Un guide par province : sites à voir, coutumes, gastronomie et informations pratiques.",
    theme: "Guides thématiques",
    themeLead: "La région dans son ensemble, sa nature, sa cuisine et les dunes sauvages de l'Erg Chegaga.",
    note: "D'après les guides officiels de Visit Drâa Tafilalet, reproduits avec l'autorisation de leur éditeur. Conception : Lover of Sahara.",
    free: "PDF gratuit",
  },
  de: {
    eyebrow: "Broschüren",
    title: ["Reiseführer für", "die Wüste."],
    intro:
      "Bebilderte PDF-Führer zur Region Drâa-Tafilalet: ein allgemeiner Führer, einer pro Provinz und drei thematische. Kostenlos, in sechs Sprachen.",
    language: "Sprache",
    download: "PDF herunterladen",
    pages: (n) => `${n} Seiten`,
    regional: "Die fünf Provinzen",
    regionalLead: "Ein Führer pro Provinz: Sehenswürdigkeiten, Bräuche, Küche und praktische Informationen.",
    theme: "Thematische Führer",
    themeLead: "Die Region als Ganzes, ihre Natur, ihre Küche und die wilden Dünen des Erg Chegaga.",
    note: "Nach den offiziellen Führern von Visit Drâa Tafilalet, mit Genehmigung des Herausgebers wiedergegeben. Gestaltung: Lover of Sahara.",
    free: "Kostenloses PDF",
  },
  es: {
    eyebrow: "Folletos",
    title: ["Guías para llevar", "al desierto."],
    intro:
      "Guías ilustradas en PDF de la región de Drâa-Tafilalet: una guía general, una por provincia y tres temáticas. Gratuitas, en seis idiomas.",
    language: "Idioma",
    download: "Descargar PDF",
    pages: (n) => `${n} páginas`,
    regional: "Las cinco provincias",
    regionalLead: "Una guía por provincia: qué ver, costumbres, gastronomía e información práctica.",
    theme: "Guías temáticas",
    themeLead: "La región en su conjunto, su naturaleza, su cocina y las dunas salvajes del Erg Chegaga.",
    note: "Basado en las guías oficiales de Visit Drâa Tafilalet, reproducidas con permiso de su editor. Diseño: Lover of Sahara.",
    free: "PDF gratis",
  },
  it: {
    eyebrow: "Brochure",
    title: ["Guide da portare", "nel deserto."],
    intro:
      "Guide illustrate in PDF della regione del Drâa-Tafilalet: una guida generale, una per provincia e tre tematiche. Gratuite, in sei lingue.",
    language: "Lingua",
    download: "Scarica il PDF",
    pages: (n) => `${n} pagine`,
    regional: "Le cinque province",
    regionalLead: "Una guida per provincia: cosa vedere, usanze, gastronomia e informazioni pratiche.",
    theme: "Guide tematiche",
    themeLead: "La regione nel suo insieme, la sua natura, la sua cucina e le dune selvagge dell'Erg Chegaga.",
    note: "Basato sulle guide ufficiali di Visit Drâa Tafilalet, riprodotte con il permesso dell'editore. Progetto grafico: Lover of Sahara.",
    free: "PDF gratuito",
  },
  zh: {
    eyebrow: "手册",
    title: ["带进沙漠的", "旅行指南。"],
    intro: "德拉-塔菲拉莱特地区的 PDF 图文指南：一本综合指南、每个省各一本，以及三本主题指南。免费下载，提供六种语言。",
    language: "语言",
    download: "下载 PDF",
    pages: (n) => `${n} 页`,
    regional: "五个省份",
    regionalLead: "每个省一本指南：景点、风俗、美食与实用信息。",
    theme: "主题指南",
    themeLead: "整个地区、它的自然与美食，以及 Erg Chegaga 的野性沙丘。",
    note: "内容取自 Visit Drâa Tafilalet 的官方指南，经出版方许可转载。设计：Lover of Sahara。",
    free: "免费 PDF",
  },
};
