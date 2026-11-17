/**
 * The trips spell the same place several ways ("Ait / Aït Ben Haddou", "Lac Iriki / Iriqui", ...).
 * `placeIdForStop` folds every spelling to one canonical place id; a name that matches nothing has no
 * place page and stays plain text in the UI.
 */

/** Lowercase, accent-free, apostrophes and punctuation turned into single spaces. */
export const normPlace = (s: string) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/['’`]/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/** place id -> every spelling seen in the trips (and a few obvious ones). */
const SPELLINGS: Record<string, string[]> = {
  marrakech: ["Marrakech"],
  agadir: ["Agadir"],
  taroudant: ["Taroudant"],
  taliouine: ["Taliouine"],
  "tizi-n-tichka": ["Tizi n Tichka Pass", "Col Tichka", "Col du Tizi n’Tichka", "Tizi n'Tichka"],
  telouet: ["Telouet"],
  "ait-ben-haddou": ["Ait Ben Haddou", "Aït Ben Haddou"],
  "oasis-fint": ["Oasis Fint", "Fint Oasis"],
  ouarzazate: ["Ouarzazate"],
  "kalaat-mgouna": ["Kalaat M'Gouna", "Kalaat Mgouna"],
  bouthgrar: ["Bouthgrar"],
  "dades-gorges": ["Gorges de Dades", "Gorges Dades", "Gorges du Dadès", "Vallée du Dadès"],
  "boumalne-dades": ["Boumalne Dadès"],
  msemrir: ["Msemrir"],
  agoudal: ["Agoudal"],
  "todgha-gorges": ["Gorges Todgha", "Gorges du Todra"],
  "jbel-saghro": ["Jbel Saghro", "Jebel Saghro"],
  taznakht: ["Taznakht"],
  agdz: ["Agdz", "Agdez"],
  "draa-valley": ["Vallée du Drâa"],
  zagora: ["Zagora", "El Faija Zagora"],
  tamgroute: ["Tamgroute"],
  mhamid: ["M'Hamid El Ghizlane", "Mhamid El Ghizlan"],
  "erg-chegaga": ["Erg Chegaga"],
  "erg-lihoudi": ["Erg Lihodi", "Erg Lihoudi"],
  "lake-iriki": ["Lac Iriki", "Lac Iriqui"],
  "foum-zguid": ["Foum Zguid"],
  tafraoute: ["Tafraoute"],
  "ait-mansour-gorges": ["Gorges d'Aït Mansour"],
  amtoudi: ["Amtoudi"],
  "sidi-ifni": ["Sidi Ifni"],
  legzira: ["Legzira"],
  mirleft: ["Mirleft"],
  "massa-national-park": ["Parc National de Massa"],
};

const BY_SPELLING = new Map<string, string>();
for (const [id, names] of Object.entries(SPELLINGS)) for (const n of names) BY_SPELLING.set(normPlace(n), id);

/** The place page id for a stop name, or undefined when the stop has no page. */
export const placeIdForStop = (name: string): string | undefined => BY_SPELLING.get(normPlace(name));

export const placeHref = (id: string) => `/places/${id}`;
