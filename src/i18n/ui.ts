import type { Lang } from "./languages";
import type { TripCategory } from "@/data/trips/schema";

/**
 * Labels for the trips UI. Where the old site already had a translation (categories, "From",
 * "Per Person", customise notice, "Our Trips") its wording is reused; the rest is new.
 * The rest of the site (hero, sections, footer) is still English-only.
 */
export interface UiStrings {
  navTrips: string;
  navBrochures: string;
  navGallery: string;
  navByCategory: string;
  navByDeparture: string;
  reviewed: string;
  heading: string;
  intro: string;
  all: string;
  categories: Record<TripCategory, string>;
  from: string;
  perPerson: string;
  departsFrom: string;
  customize: string;
  language: string;
  /** "5 days" */
  days: (n: number) => string;
  /** "12 stops" */
  stops: (n: number) => string;
  /** "18 trips" */
  showing: (n: number) => string;
}

export const UI: Record<Lang, UiStrings> = {
  en: {
    navTrips: "Trips",
    navBrochures: "Brochures",
    navGallery: "Gallery",
    navByCategory: "By category",
    navByDeparture: "By departure",
    reviewed: "Reviewed",
    heading: "Our Trips",
    intro: "Private 4x4 journeys into the Sahara, from short desert escapes to week-long expeditions.",
    all: "All",
    categories: { trip: "Trips", excursion: "Excursions", trekking: "Trekking" },
    from: "From",
    perPerson: "per person",
    departsFrom: "Departs from",
    customize: "All trips can be customized to better suit your preferences",
    language: "Language",
    days: (n) => `${n} ${n === 1 ? "day" : "days"}`,
    stops: (n) => `${n} stops`,
    showing: (n) => `${n} ${n === 1 ? "trip" : "trips"}`,
  },
  fr: {
    navTrips: "Circuits",
    navBrochures: "Brochures",
    navGallery: "Galerie",
    navByCategory: "Par catégorie",
    navByDeparture: "Par départ",
    reviewed: "Avec avis",
    heading: "Nos Circuits",
    intro: "Voyages privés en 4x4 dans le Sahara, des escapades express aux expéditions d’une semaine.",
    all: "Tous",
    categories: { trip: "Circuits", excursion: "Excursions", trekking: "Randonnée" },
    from: "À partir de",
    perPerson: "par personne",
    departsFrom: "Départ de",
    customize: "Tous les voyages peuvent être personnalisés selon vos préférences",
    language: "Langue",
    days: (n) => `${n} ${n === 1 ? "jour" : "jours"}`,
    stops: (n) => `${n} étapes`,
    showing: (n) => `${n} ${n === 1 ? "voyage" : "voyages"}`,
  },
  de: {
    navTrips: "Reisen",
    navBrochures: "Broschüren",
    navGallery: "Galerie",
    navByCategory: "Nach Kategorie",
    navByDeparture: "Nach Abreiseort",
    reviewed: "Mit Bewertungen",
    heading: "Unsere Reisen",
    intro: "Private 4x4-Reisen in die Sahara – von kurzen Wüstenausflügen bis zu einwöchigen Expeditionen.",
    all: "Alle",
    categories: { trip: "Reisen", excursion: "Ausflüge", trekking: "Wandern" },
    from: "Ab",
    perPerson: "pro Person",
    departsFrom: "Abfahrt ab",
    customize: "Diese Reise kann an Ihre spezifischen Wünsche und Bedürfnisse angepasst werden",
    language: "Sprache",
    days: (n) => `${n} ${n === 1 ? "Tag" : "Tage"}`,
    stops: (n) => `${n} Stationen`,
    showing: (n) => `${n} ${n === 1 ? "Reise" : "Reisen"}`,
  },
  es: {
    navTrips: "Viajes",
    navBrochures: "Folletos",
    navGallery: "Galería",
    navByCategory: "Por categoría",
    navByDeparture: "Por salida",
    reviewed: "Con reseñas",
    heading: "Nuestros Viajes",
    intro: "Viajes privados en 4x4 por el Sahara, desde breves escapadas hasta expediciones de una semana.",
    all: "Todos",
    categories: { trip: "Viajes", excursion: "Excursiones", trekking: "Senderismo" },
    from: "Desde",
    perPerson: "por persona",
    departsFrom: "Salida desde",
    customize: "Este viaje se puede personalizar según sus preferencias y necesidades específicas",
    language: "Idioma",
    days: (n) => `${n} ${n === 1 ? "día" : "días"}`,
    stops: (n) => `${n} paradas`,
    showing: (n) => `${n} ${n === 1 ? "viaje" : "viajes"}`,
  },
  it: {
    navTrips: "Viaggi",
    navBrochures: "Brochure",
    navGallery: "Galleria",
    navByCategory: "Per categoria",
    navByDeparture: "Per partenza",
    reviewed: "Con recensioni",
    heading: "I nostri Viaggi",
    intro: "Viaggi privati in 4x4 nel Sahara, dalle brevi fughe nel deserto alle spedizioni di una settimana.",
    all: "Tutti",
    categories: { trip: "Viaggi", excursion: "Escursioni", trekking: "Trekking" },
    from: "Da",
    perPerson: "a persona",
    departsFrom: "Partenza da",
    customize: "Questo viaggio può essere personalizzato in base alle tue preferenze e necessità specifiche",
    language: "Lingua",
    days: (n) => `${n} ${n === 1 ? "giorno" : "giorni"}`,
    stops: (n) => `${n} tappe`,
    showing: (n) => `${n} ${n === 1 ? "viaggio" : "viaggi"}`,
  },
  zh: {
    navTrips: "旅行",
    navBrochures: "手册",
    navGallery: "图库",
    navByCategory: "按类别",
    navByDeparture: "按出发地",
    reviewed: "有评价",
    heading: "我们的旅行",
    intro: "私人四驱车撒哈拉之旅，从短途沙漠之行到长达一周的探险。",
    all: "全部",
    categories: { trip: "旅行", excursion: "短途游", trekking: "徒步旅行" },
    from: "起价",
    perPerson: "每人",
    departsFrom: "出发地",
    customize: "此行程可根据您的具体偏好和需求进行定制",
    language: "语言",
    days: (n) => `${n}天`,
    stops: (n) => `${n}站`,
    showing: (n) => `${n}个行程`,
  },
};
