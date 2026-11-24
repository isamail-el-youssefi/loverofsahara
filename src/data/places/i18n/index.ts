import type { Lang } from "@/i18n/languages";
import type { Place, PlaceKind } from "../places";
import { PLACES_DE } from "./de";
import { PLACES_ES } from "./es";
import { PLACES_FR } from "./fr";
import { PLACES_IT } from "./it";
import type { PlaceI18n } from "./types";
import { PLACES_ZH } from "./zh";

const TEXT: Record<Exclude<Lang, "en">, Record<string, PlaceI18n>> = { fr: PLACES_FR, de: PLACES_DE, es: PLACES_ES, it: PLACES_IT, zh: PLACES_ZH };

/** The place text in the page language (the English text is the fallback for anything not translated). */
export function localizePlace(id: string, place: Place, lang: Lang): Place {
  if (lang === "en") return place;
  const t = TEXT[lang][id];
  if (!t) return place;
  return { ...place, name: t.name ?? place.name, region: t.region, brief: t.brief, bestTime: t.bestTime, insights: t.insights };
}

/** The labels of a place page (headings, facts, map section, buttons), in every language. */
export interface PlaceLabels {
  back: string;
  the: string;
  insights: string;
  insightTitles: [string, string, string, string, string];
  type: string;
  region: string;
  fromMarrakech: string;
  startFinish: string;
  bestTime: string;
  onTrips: string;
  coordinates: string;
  where: string;
  gettingThere: string;
  gallery: string;
  galleryTitle: string;
  journeys: string;
  kinds: Record<PlaceKind, string>;
  tabs: { overview: string; insights: string; map: string; gallery: string; trips: string };
  latitude: string;
  longitude: string;
  copied: string;
  copyCoords: string;
  openMaps: string;
  /** "{name}" is filled in. */
  openMapsAria: string;
  loading: string;
  notFound: string;
  marrakechText: string;
  /** "{km}" is filled in. */
  distanceText: string;
  /** "{place}, {region}" photo description. */
  heroAlt: string;
  /** Cardinal letters: north, south, east, west. */
  cardinals: [string, string, string, string];
}

export const PLACE_LABELS: Record<Lang, PlaceLabels> = {
  en: {
    back: "Back",
    the: "The place",
    insights: "Insights",
    insightTitles: ["Why stop here", "What to see", "The story", "Best moment", "Good to know"],
    type: "Type",
    region: "Region",
    fromMarrakech: "From Marrakech",
    startFinish: "Start & finish",
    bestTime: "Best time",
    onTrips: "On our trips",
    coordinates: "Coordinates",
    where: "Where it sits",
    gettingThere: "Getting there",
    gallery: "Gallery",
    galleryTitle: "From the road",
    journeys: "On these journeys",
    kinds: { City: "City", Town: "Town", Village: "Village", Kasbah: "Kasbah", Pass: "Pass", Gorge: "Gorge", Valley: "Valley", Oasis: "Oasis", Dunes: "Dunes", Lake: "Lake", Massif: "Massif", Coast: "Coast", Park: "Park" },
    tabs: { overview: "Overview", insights: "Insights", map: "Map", gallery: "Gallery", trips: "Trips" },
    latitude: "Latitude",
    longitude: "Longitude",
    copied: "Copied",
    copyCoords: "Copy coordinates",
    openMaps: "Open in Maps",
    openMapsAria: "Open {name} in Google Maps (opens in a new tab)",
    loading: "Loading",
    notFound: "We could not find that place.",
    marrakechText: "Marrakech is where our journeys begin and end, before the road climbs into the High Atlas and drops towards the desert.",
    distanceText: "About {km} km from Marrakech as the crow flies. The road is longer: it winds over the High Atlas and along the valleys, which is a large part of the journey.",
    heroAlt: "{place}, Morocco",
    cardinals: ["N", "S", "E", "W"],
  },
  fr: {
    back: "Retour",
    the: "Le lieu",
    insights: "À savoir",
    insightTitles: ["Pourquoi s’arrêter", "À voir", "L’histoire", "Le meilleur moment", "Bon à savoir"],
    type: "Type",
    region: "Région",
    fromMarrakech: "Depuis Marrakech",
    startFinish: "Départ et arrivée",
    bestTime: "Meilleure période",
    onTrips: "Dans nos voyages",
    coordinates: "Coordonnées",
    where: "Où se situe-t-il",
    gettingThere: "Comment s’y rendre",
    gallery: "Galerie",
    galleryTitle: "Sur la route",
    journeys: "Dans ces voyages",
    kinds: { City: "Ville", Town: "Ville", Village: "Village", Kasbah: "Kasbah", Pass: "Col", Gorge: "Gorge", Valley: "Vallée", Oasis: "Oasis", Dunes: "Dunes", Lake: "Lac", Massif: "Massif", Coast: "Côte", Park: "Parc" },
    tabs: { overview: "Aperçu", insights: "À savoir", map: "Carte", gallery: "Galerie", trips: "Voyages" },
    latitude: "Latitude",
    longitude: "Longitude",
    copied: "Copié",
    copyCoords: "Copier les coordonnées",
    openMaps: "Ouvrir dans Maps",
    openMapsAria: "Ouvrir {name} dans Google Maps (s’ouvre dans un nouvel onglet)",
    loading: "Chargement",
    notFound: "Nous n’avons pas trouvé ce lieu.",
    marrakechText: "Marrakech est le lieu où nos voyages commencent et se terminent, avant que la route ne grimpe dans le Haut Atlas puis ne descende vers le désert.",
    distanceText: "À environ {km} km de Marrakech à vol d’oiseau. La route est plus longue : elle serpente à travers le Haut Atlas et le long des vallées, ce qui fait une grande partie du voyage.",
    heroAlt: "{place}, Maroc",
    cardinals: ["N", "S", "E", "O"],
  },
  de: {
    back: "Zurück",
    the: "Der Ort",
    insights: "Einblicke",
    insightTitles: ["Warum hier halten", "Was zu sehen ist", "Die Geschichte", "Der beste Moment", "Gut zu wissen"],
    type: "Art",
    region: "Region",
    fromMarrakech: "Ab Marrakesch",
    startFinish: "Start und Ziel",
    bestTime: "Beste Reisezeit",
    onTrips: "Auf unseren Reisen",
    coordinates: "Koordinaten",
    where: "Wo er liegt",
    gettingThere: "Anreise",
    gallery: "Galerie",
    galleryTitle: "Unterwegs",
    journeys: "Auf diesen Reisen",
    kinds: { City: "Stadt", Town: "Stadt", Village: "Dorf", Kasbah: "Kasbah", Pass: "Pass", Gorge: "Schlucht", Valley: "Tal", Oasis: "Oase", Dunes: "Dünen", Lake: "See", Massif: "Massiv", Coast: "Küste", Park: "Park" },
    tabs: { overview: "Überblick", insights: "Einblicke", map: "Karte", gallery: "Galerie", trips: "Reisen" },
    latitude: "Breitengrad",
    longitude: "Längengrad",
    copied: "Kopiert",
    copyCoords: "Koordinaten kopieren",
    openMaps: "In Maps öffnen",
    openMapsAria: "{name} in Google Maps öffnen (öffnet in einem neuen Tab)",
    loading: "Wird geladen",
    notFound: "Wir konnten diesen Ort nicht finden.",
    marrakechText: "In Marrakesch beginnen und enden unsere Reisen, bevor die Straße ins Hohe Atlas-Gebirge ansteigt und sich zur Wüste hin senkt.",
    distanceText: "Etwa {km} km von Marrakesch in der Luftlinie. Die Straße ist länger: Sie windet sich über den Hohen Atlas und durch die Täler, was einen großen Teil der Reise ausmacht.",
    heroAlt: "{place}, Marokko",
    cardinals: ["N", "S", "O", "W"],
  },
  es: {
    back: "Volver",
    the: "El lugar",
    insights: "Claves",
    insightTitles: ["Por qué parar", "Qué ver", "La historia", "El mejor momento", "Conviene saber"],
    type: "Tipo",
    region: "Región",
    fromMarrakech: "Desde Marrakech",
    startFinish: "Inicio y fin",
    bestTime: "Mejor época",
    onTrips: "En nuestros viajes",
    coordinates: "Coordenadas",
    where: "Dónde está",
    gettingThere: "Cómo llegar",
    gallery: "Galería",
    galleryTitle: "Desde el camino",
    journeys: "En estos viajes",
    kinds: { City: "Ciudad", Town: "Localidad", Village: "Pueblo", Kasbah: "Kasba", Pass: "Puerto", Gorge: "Garganta", Valley: "Valle", Oasis: "Oasis", Dunes: "Dunas", Lake: "Lago", Massif: "Macizo", Coast: "Costa", Park: "Parque" },
    tabs: { overview: "Resumen", insights: "Claves", map: "Mapa", gallery: "Galería", trips: "Viajes" },
    latitude: "Latitud",
    longitude: "Longitud",
    copied: "Copiado",
    copyCoords: "Copiar coordenadas",
    openMaps: "Abrir en Maps",
    openMapsAria: "Abrir {name} en Google Maps (se abre en una pestaña nueva)",
    loading: "Cargando",
    notFound: "No hemos encontrado ese lugar.",
    marrakechText: "Marrakech es donde nuestros viajes empiezan y terminan, antes de que la carretera suba al Alto Atlas y baje hacia el desierto.",
    distanceText: "A unos {km} km de Marrakech en línea recta. La carretera es más larga: serpentea por el Alto Atlas y a lo largo de los valles, que son gran parte del viaje.",
    heroAlt: "{place}, Marruecos",
    cardinals: ["N", "S", "E", "O"],
  },
  it: {
    back: "Indietro",
    the: "Il luogo",
    insights: "Da sapere",
    insightTitles: ["Perché fermarsi", "Cosa vedere", "La storia", "Il momento migliore", "Da sapere"],
    type: "Tipo",
    region: "Regione",
    fromMarrakech: "Da Marrakech",
    startFinish: "Partenza e arrivo",
    bestTime: "Periodo migliore",
    onTrips: "Nei nostri viaggi",
    coordinates: "Coordinate",
    where: "Dove si trova",
    gettingThere: "Come arrivare",
    gallery: "Galleria",
    galleryTitle: "Lungo la strada",
    journeys: "In questi viaggi",
    kinds: { City: "Città", Town: "Cittadina", Village: "Villaggio", Kasbah: "Kasbah", Pass: "Passo", Gorge: "Gola", Valley: "Valle", Oasis: "Oasi", Dunes: "Dune", Lake: "Lago", Massif: "Massiccio", Coast: "Costa", Park: "Parco" },
    tabs: { overview: "Panoramica", insights: "Da sapere", map: "Mappa", gallery: "Galleria", trips: "Viaggi" },
    latitude: "Latitudine",
    longitude: "Longitudine",
    copied: "Copiato",
    copyCoords: "Copia le coordinate",
    openMaps: "Apri in Maps",
    openMapsAria: "Apri {name} in Google Maps (si apre in una nuova scheda)",
    loading: "Caricamento",
    notFound: "Non abbiamo trovato questo luogo.",
    marrakechText: "Marrakech è dove i nostri viaggi iniziano e finiscono, prima che la strada salga nell’Alto Atlante e scenda verso il deserto.",
    distanceText: "A circa {km} km da Marrakech in linea d’aria. La strada è più lunga: si snoda sull’Alto Atlante e lungo le valli, che sono gran parte del viaggio.",
    heroAlt: "{place}, Marocco",
    cardinals: ["N", "S", "E", "O"],
  },
  zh: {
    back: "返回",
    the: "关于此地",
    insights: "要点",
    insightTitles: ["为何在此停留", "值得一看", "历史故事", "最佳时刻", "实用提示"],
    type: "类型",
    region: "地区",
    fromMarrakech: "距马拉喀什",
    startFinish: "起点与终点",
    bestTime: "最佳时间",
    onTrips: "包含此地的行程",
    coordinates: "坐标",
    where: "位置",
    gettingThere: "如何前往",
    gallery: "图库",
    galleryTitle: "沿途风景",
    journeys: "包含此地的旅程",
    kinds: { City: "城市", Town: "城镇", Village: "村庄", Kasbah: "卡斯巴", Pass: "山口", Gorge: "峡谷", Valley: "河谷", Oasis: "绿洲", Dunes: "沙丘", Lake: "湖泊", Massif: "山地", Coast: "海岸", Park: "公园" },
    tabs: { overview: "概览", insights: "要点", map: "地图", gallery: "图库", trips: "行程" },
    latitude: "纬度",
    longitude: "经度",
    copied: "已复制",
    copyCoords: "复制坐标",
    openMaps: "在地图中打开",
    openMapsAria: "在谷歌地图中打开{name}（在新标签页中打开）",
    loading: "加载中",
    notFound: "找不到该地点。",
    marrakechText: "我们的旅程从马拉喀什开始，也在这里结束，之后道路攀上高阿特拉斯，再向沙漠下行。",
    distanceText: "距马拉喀什直线距离约{km}公里。实际路程更长：道路蜿蜒翻越高阿特拉斯并沿河谷前行，这也是旅程的重要部分。",
    heroAlt: "{place}，摩洛哥",
    cardinals: ["北", "南", "东", "西"],
  },
};
