import type { Lang } from "@/i18n/languages";

/** Page text for the gallery page, in the six site languages. */
export interface GalleryStrings {
  eyebrow: string;
  /** Two-tone headline: [dark part, light part]. */
  title: [string, string];
  intro: string;
  /** Filter label for every photo. */
  all: string;
  photos: (n: number) => string;
  more: string;
  viewTrip: string;
  close: string;
  previous: string;
  next: string;
  /** "12 / 197" label for the big viewer. */
  of: (i: number, n: number) => string;
  from: string;
  empty: string;
}

export const GALLERY_STRINGS: Record<Lang, GalleryStrings> = {
  en: {
    eyebrow: "Gallery",
    title: ["Photos from", "the desert."],
    intro: "Moments from our private Sahara journeys: dunes, oases, ksour, gorges and nights under the stars. Tap a photo to see it large.",
    all: "All",
    photos: (n) => `${n} ${n === 1 ? "photo" : "photos"}`,
    more: "Show more",
    viewTrip: "View this trip",
    close: "Close",
    previous: "Previous photo",
    next: "Next photo",
    of: (i, n) => `${i} / ${n}`,
    from: "From",
    empty: "No photos to show right now.",
  },
  fr: {
    eyebrow: "Galerie",
    title: ["Photos du", "désert."],
    intro: "Des instants de nos voyages privés dans le Sahara : dunes, oasis, ksour, gorges et nuits sous les étoiles. Touchez une photo pour l'agrandir.",
    all: "Toutes",
    photos: (n) => `${n} ${n === 1 ? "photo" : "photos"}`,
    more: "Voir plus",
    viewTrip: "Voir ce voyage",
    close: "Fermer",
    previous: "Photo précédente",
    next: "Photo suivante",
    of: (i, n) => `${i} / ${n}`,
    from: "Depuis",
    empty: "Aucune photo à afficher pour le moment.",
  },
  de: {
    eyebrow: "Galerie",
    title: ["Fotos aus", "der Wüste."],
    intro: "Momente unserer privaten Sahara-Reisen: Dünen, Oasen, Ksour, Schluchten und Nächte unter den Sternen. Tippen Sie auf ein Foto, um es groß zu sehen.",
    all: "Alle",
    photos: (n) => `${n} ${n === 1 ? "Foto" : "Fotos"}`,
    more: "Mehr anzeigen",
    viewTrip: "Diese Reise ansehen",
    close: "Schließen",
    previous: "Vorheriges Foto",
    next: "Nächstes Foto",
    of: (i, n) => `${i} / ${n}`,
    from: "Ab",
    empty: "Derzeit keine Fotos vorhanden.",
  },
  es: {
    eyebrow: "Galería",
    title: ["Fotos del", "desierto."],
    intro: "Momentos de nuestros viajes privados por el Sáhara: dunas, oasis, ksour, gargantas y noches bajo las estrellas. Toque una foto para verla grande.",
    all: "Todas",
    photos: (n) => `${n} ${n === 1 ? "foto" : "fotos"}`,
    more: "Ver más",
    viewTrip: "Ver este viaje",
    close: "Cerrar",
    previous: "Foto anterior",
    next: "Foto siguiente",
    of: (i, n) => `${i} / ${n}`,
    from: "Desde",
    empty: "No hay fotos para mostrar ahora.",
  },
  it: {
    eyebrow: "Galleria",
    title: ["Foto dal", "deserto."],
    intro: "Momenti dei nostri viaggi privati nel Sahara: dune, oasi, ksour, gole e notti sotto le stelle. Tocca una foto per vederla grande.",
    all: "Tutte",
    photos: (n) => `${n} ${n === 1 ? "foto" : "foto"}`,
    more: "Mostra altro",
    viewTrip: "Vedi questo viaggio",
    close: "Chiudi",
    previous: "Foto precedente",
    next: "Foto successiva",
    of: (i, n) => `${i} / ${n}`,
    from: "Da",
    empty: "Nessuna foto da mostrare al momento.",
  },
  zh: {
    eyebrow: "图库",
    title: ["沙漠中的", "瞬间。"],
    intro: "我们私人撒哈拉之旅的精彩瞬间：沙丘、绿洲、土堡、峡谷和星空下的夜晚。点击照片查看大图。",
    all: "全部",
    photos: (n) => `${n} 张照片`,
    more: "显示更多",
    viewTrip: "查看此行程",
    close: "关闭",
    previous: "上一张",
    next: "下一张",
    of: (i, n) => `${i} / ${n}`,
    from: "出发地：",
    empty: "暂时没有可显示的照片。",
  },
};
