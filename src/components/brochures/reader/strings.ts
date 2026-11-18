import type { Lang } from "@/i18n/languages";

export interface ReaderStrings {
  read: string;
  flip: string;
  scroll: string;
  page: (n: number, total: number) => string;
  close: string;
  fullscreen: string;
  next: string;
  prev: string;
  loading: string;
  error: string;
  hint: string;
}

export const READER_STRINGS: Record<Lang, ReaderStrings> = {
  en: { read: "Read online", flip: "Book", scroll: "Scroll", page: (n, t) => `Page ${n} of ${t}`, close: "Close", fullscreen: "Fullscreen", next: "Next page", prev: "Previous page", loading: "Opening the brochure…", error: "The brochure could not be opened. Please download the PDF instead.", hint: "Use ← → or drag to turn the pages" },
  fr: { read: "Lire en ligne", flip: "Livre", scroll: "Défilement", page: (n, t) => `Page ${n} sur ${t}`, close: "Fermer", fullscreen: "Plein écran", next: "Page suivante", prev: "Page précédente", loading: "Ouverture de la brochure…", error: "La brochure n'a pas pu s'ouvrir. Téléchargez plutôt le PDF.", hint: "← → ou glissez pour tourner les pages" },
  es: { read: "Leer en línea", flip: "Libro", scroll: "Desplazar", page: (n, t) => `Página ${n} de ${t}`, close: "Cerrar", fullscreen: "Pantalla completa", next: "Página siguiente", prev: "Página anterior", loading: "Abriendo el folleto…", error: "No se pudo abrir el folleto. Descarga el PDF.", hint: "← → o arrastra para pasar las páginas" },
  de: { read: "Online lesen", flip: "Buch", scroll: "Scrollen", page: (n, t) => `Seite ${n} von ${t}`, close: "Schließen", fullscreen: "Vollbild", next: "Nächste Seite", prev: "Vorherige Seite", loading: "Broschüre wird geöffnet…", error: "Die Broschüre konnte nicht geöffnet werden. Bitte lade das PDF herunter.", hint: "← → oder ziehen zum Blättern" },
  it: { read: "Leggi online", flip: "Libro", scroll: "Scorri", page: (n, t) => `Pagina ${n} di ${t}`, close: "Chiudi", fullscreen: "Schermo intero", next: "Pagina successiva", prev: "Pagina precedente", loading: "Apertura dell'opuscolo…", error: "Impossibile aprire l'opuscolo. Scarica il PDF.", hint: "← → o trascina per sfogliare" },
  zh: { read: "在线阅读", flip: "翻页", scroll: "滚动", page: (n, t) => `第 ${n} 页 / 共 ${t} 页`, close: "关闭", fullscreen: "全屏", next: "下一页", prev: "上一页", loading: "正在打开手册…", error: "无法打开手册，请下载 PDF。", hint: "使用 ← → 或拖动翻页" },
};
