/**
 * One-off, idempotent importer: old Next.js site  ->  clean trip data for the new site.
 *
 *   npm run trips:import                      (uses the default old-project folder)
 *   npm run trips:import -- "<path-to-old-project>"
 *
 * Reads (old project):
 *   data/packageInfo.ts            structure per trip (pricing, map points, image paths, ...)
 *   constant/index.tsx             allPackages (duration, departure city, card photo) + TRIPDAY (day routes)
 *   locales/<lang>/Homepage.json   all text, 6 languages
 *
 * Writes (new project, committed):
 *   src/data/trips/trips.meta.json         language-neutral facts
 *   src/data/trips/trips.legacy-media.json old image paths (ImageKit), kept for later
 *   src/data/trips/content/<lang>.json     text per language, keyed by new slug
 *   docs/trips-slug-map.md                 old number -> slug table + data-issue report
 *
 * Every known bug of the old data is fixed in ONE visible place (the OVERRIDES / helpers below)
 * and listed in the report, so nothing is silently "cleaned".
 */
import fs from "node:fs";
import path from "node:path";
import {
  ContentFileSchema,
  LegacyMediaFileSchema,
  EnglishContentFileSchema,
  LANGS,
  TripsMetaFileSchema,
  type CoverKey,
  type LegacyMedia,
  type Lang,
  type TripCategory,
  type TripContentPartial,
  type TripMeta,
} from "../src/data/trips/schema.ts";
import { SLUG_BY_LEGACY_ID } from "../src/data/trips/slugs.ts";

const ROOT = process.cwd();
const OLD =
  process.argv[2] ??
  path.join(ROOT, "bringing data from old website", "old website", "Me-First-freelance-main");
const OUT_DIR = path.join(ROOT, "src", "data", "trips");
const DOC_PATH = path.join(ROOT, "docs", "trips-slug-map.md");
const TRIP_COUNT = Object.keys(SLUG_BY_LEGACY_ID).length;

// ---------------------------------------------------------------------------------------------
// Placeholder covers (real photos live on ImageKit; see src/data/trips/media.ts)
// ---------------------------------------------------------------------------------------------
const COVER_BY_LEGACY_ID: Record<number, CoverKey> = {
  1: "caravan", 2: "dunes", 3: "canyon", 4: "dunes", 5: "atlantic", 6: "canyon",
  7: "canyon", 8: "canyon", 9: "caravan", 10: "dunes", 11: "souk", 12: "dunes",
  13: "canyon", 14: "caravan", 15: "stars", 16: "caravan", 17: "atlantic", 18: "dunes",
};

// ---------------------------------------------------------------------------------------------
// Issues collected while importing (printed + written to docs/)
// ---------------------------------------------------------------------------------------------
interface Issue {
  trip: number | "all";
  lang: Lang | "all";
  kind: string;
  detail: string;
  resolution: string;
}
const issues: Issue[] = [];
const note = (i: Issue) => issues.push(i);

// ---------------------------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------------------------
const read = (rel: string) => fs.readFileSync(path.join(OLD, rel), "utf8");

/** Take the JS literal assigned to `export const <name>` (balanced, string/comment aware) and evaluate it. */
function extractLiteral<T>(source: string, name: string): T {
  const decl = source.indexOf(`export const ${name}`);
  if (decl < 0) throw new Error(`export const ${name} not found`);
  const eq = source.indexOf("=", decl);
  let i = eq + 1;
  while (i < source.length && source[i] !== "[" && source[i] !== "{") i++;
  const open = source[i]!;
  const close = open === "[" ? "]" : "}";
  let depth = 0;
  let end = -1;
  for (let j = i; j < source.length; j++) {
    const c = source[j]!;
    const n = source[j + 1];
    if (c === "/" && n === "/") { j = source.indexOf("\n", j); if (j < 0) break; continue; }
    if (c === "/" && n === "*") { j = source.indexOf("*/", j) + 1; continue; }
    if (c === '"' || c === "'" || c === "`") {
      for (j++; j < source.length && source[j] !== c; j++) if (source[j] === "\\") j++;
      continue;
    }
    if (c === open) depth++;
    else if (c === close && --depth === 0) { end = j; break; }
  }
  if (end < 0) throw new Error(`unbalanced literal for ${name}`);
  const literal = source.slice(i, end + 1).replace(/\s+as const/g, "");
  return new Function(`return (${literal});`)() as T;
}

const ENTITIES: Record<string, string> = { "&amp;": "&", "&quot;": '"', "&#39;": "'", "&lt;": "<", "&gt;": ">" };
const decodeEntities = (s: string) => s.replace(/&(?:amp|quot|#39|lt|gt);/g, (m) => ENTITIES[m] ?? m);
const tidy = (s: string) => decodeEntities(s).replace(/[ \t]+/g, " ").replace(/\s+\n/g, "\n").trim();

/** The old data contains exactly one double-encoded character (verified by scanning every file). */
const MOJIBAKE: Record<string, string> = { "AÃƒÂ¯t": "Aït" };
const fixMojibake = (s: string) =>
  Object.entries(MOJIBAKE).reduce((acc, [bad, good]) => acc.split(bad).join(good), s);

const toList = (v: unknown): string[] | undefined => {
  if (v == null) return undefined;
  if (Array.isArray(v)) return v.map((x) => tidy(String(x))).filter(Boolean);
  // trip 13 stores its key stops as one comma-separated string
  return String(v).split(",").map((x) => tidy(x)).filter(Boolean);
};

/** "Dune Discovery – Ouarzazate Chegaga 2 Days"  ->  "Ouarzazate Chegaga 2 Days" */
const afterSeparator = (s: string) => {
  const parts = s.split(/\s[–-]\s/);
  return parts.length > 1 ? parts.slice(1).join(" - ").trim() : s;
};

// ---------------------------------------------------------------------------------------------
// Load the old sources
// ---------------------------------------------------------------------------------------------
interface OldPackage {
  category: TripCategory;
  pricing: { persons: number; price: number; days: number }[];
  carousel1: string;
  carousel2: string;
  carousel3: string;
  map?: string;
  leafletMap: { name: string; lat: number; lng: number }[];
  dayImages: Record<string, string[]>;
}
interface OldCard { id: number; duration: string; departureCity: string; category: TripCategory; imageSrc?: string }
interface OldDay { d: string; itinerary?: string; details: string }

const packageInfo = extractLiteral<Record<string, OldPackage>>(read("data/packageInfo.ts"), "packageInfo");
const allPackages = extractLiteral<OldCard[]>(read("constant/index.tsx"), "allPackages");
const TRIPDAY = extractLiteral<OldDay[][]>(read("constant/index.tsx"), "TRIPDAY");
const locales = Object.fromEntries(
  LANGS.map((l) => [l, JSON.parse(read(`locales/${l}/Homepage.json`)) as Record<string, any>]),
) as Record<Lang, Record<string, any>>;

// ---------------------------------------------------------------------------------------------
// 1) Language-neutral meta
// ---------------------------------------------------------------------------------------------
const metas: TripMeta[] = [];
const legacyMedia: Record<string, LegacyMedia> = {};
for (let n = 1; n <= TRIP_COUNT; n++) {
  const slug = SLUG_BY_LEGACY_ID[n as keyof typeof SLUG_BY_LEGACY_ID];
  const pkg = packageInfo[String(n)];
  const card = allPackages.find((p) => p.id === n);
  const days = TRIPDAY[n - 1] ?? [];
  if (!pkg || !card) throw new Error(`trip ${n}: missing in packageInfo or allPackages`);

  const durationDays = parseInt(card.duration, 10);
  const pricingDays = new Set(pkg.pricing.map((p) => p.days));
  if (pricingDays.size !== 1 || !pricingDays.has(durationDays)) {
    note({ trip: n, lang: "all", kind: "duration mismatch", detail: `card "${card.duration}" vs pricing days ${[...pricingDays]}`, resolution: "used the card duration" });
  }
  if (days.length !== durationDays) {
    note({ trip: n, lang: "all", kind: "itinerary length", detail: `${days.length} day entries for a ${durationDays}-day trip`, resolution: "kept the day entries that exist" });
  }

  const stops = pkg.leafletMap.map((s) => {
    const name = fixMojibake(s.name);
    if (name !== s.name) note({ trip: n, lang: "all", kind: "encoding", detail: `map point "${s.name}"`, resolution: `fixed to "${name}"` });
    return { name, lat: s.lat, lng: s.lng };
  });

  const dayRoutes = days.map((d) => (d.itinerary ?? "").replace(/\s+/g, " ").trim());

  legacyMedia[slug] = {
    carousel: [pkg.carousel1, pkg.carousel2, pkg.carousel3].filter(Boolean),
    days: Object.fromEntries(Object.entries(pkg.dayImages).filter(([, v]) => v.length > 0)),
  };

  metas.push({
    slug,
    legacyId: n,
    category: pkg.category,
    durationDays,
    departureCity: card.departureCity,
    pricing: pkg.pricing.map((p) => ({ persons: p.persons, pricePerPersonPerDay: p.price, days: p.days })),
    stops,
    dayRoutes,
    mapEmbedUrl: pkg.map ? decodeEntities(pkg.map) : undefined,
    cover: COVER_BY_LEGACY_ID[n]!,
    cardImage: card.imageSrc || undefined,
  });
}

// one rule for everything the old data got wrong in the structure file
note({ trip: 7, lang: "all", kind: "wrong key", detail: 'packageInfo["7"].heading pointed to tripDetails.trip6 (the trekking title)', resolution: "text is read per trip number straight from the locale files" });
note({ trip: "all", lang: "all", kind: "unused fields", detail: "packageInfo.days is just an array index (N-1) and tripDays is inconsistent", resolution: "dropped; duration comes from the card duration, cross-checked with the pricing rows" });
note({ trip: "all", lang: "all", kind: "inconsistent prices", detail: "old card price = 2-person price x days for trips, but only the per-day rate for excursions 4, 9, 11, 12, 18; TRIPDAY has stray \"100$\" values", resolution: "only the pricing tiers are imported (EUR, per person per day); the UI computes one consistent from-price" });
note({ trip: "all", lang: "all", kind: "route titles", detail: "day route headlines are hard-coded (not translated) and a few are French", resolution: "kept as language-neutral dayRoutes; spacing normalised" });

// ---------------------------------------------------------------------------------------------
// 2) Content per language
// ---------------------------------------------------------------------------------------------
const OVERRIDES = {
  /** Trips whose detail heading is wrong in every language -> derive from the card title instead. */
  titleFromMarketing: new Set([13, 15]),
  /** Italian card title of trip 6 is Spanish in the old file. */
  itTrip6: "Escursione nel Deserto - 7 Giorni di Trekking nel Sahara",
};

const content: Record<Lang, Record<string, TripContentPartial>> = { en: {}, fr: {}, de: {}, es: {}, it: {}, zh: {} };

for (const lang of LANGS) {
  const L = locales[lang];
  for (const meta of metas) {
    const n = meta.legacyId;
    const out: TripContentPartial = {};

    const card = L.packages?.[`package${n}`];
    let detail = L.tripDetails?.[`trip${n}`];
    if (!detail && lang === "it" && L.tripDetails?.[`package${n}`]) {
      detail = L.tripDetails[`package${n}`];
      note({ trip: n, lang, kind: "wrong key", detail: `Italian file stores tripDetails.package${n} instead of trip${n}`, resolution: "read from the misnamed key" });
    }

    let marketing: string | undefined = card?.heading ? tidy(card.heading) : undefined;
    if (lang === "it" && n === 6 && marketing?.startsWith("Excursión")) {
      note({ trip: n, lang, kind: "wrong language", detail: `Italian title is Spanish: "${marketing}"`, resolution: "replaced with an Italian title (please have it reviewed by a native speaker)" });
      marketing = OVERRIDES.itTrip6;
    }
    if (marketing) out.marketingTitle = marketing;
    if (card?.text) out.summary = tidy(card.text);

    if (OVERRIDES.titleFromMarketing.has(n) && marketing) {
      out.title = afterSeparator(marketing);
      if (lang === "en") {
        note({ trip: n, lang: "all", kind: "wrong title", detail: `detail heading says "${detail?.heading}" but the trip is ${meta.durationDays} days`, resolution: `title derived from the card title: "${out.title}"` });
      }
    } else if (detail?.heading) {
      out.title = tidy(detail.heading);
    }

    const keyStops = toList(detail?.keyStops);
    if (keyStops?.length) out.keyStops = keyStops;
    if (lang === "en" && typeof detail?.keyStops === "string") {
      note({ trip: n, lang: "all", kind: "wrong type", detail: "key stops stored as one comma-separated string", resolution: "split into a list" });
    }
    const included = toList(detail?.included);
    const excluded = toList(detail?.excluded);
    if (included?.length) out.included = included;
    if (excluded?.length) out.excluded = excluded;

    const days = TRIPDAY[n - 1] ?? [];
    const itinerary = days
      .map((d, idx) => ({ day: idx + 1, text: L[d.details] ? tidy(String(L[d.details])) : "" }))
      .filter((d) => d.text);
    if (itinerary.length) out.itinerary = itinerary;
    if (n === 13 && lang === "en") {
      note({ trip: 13, lang: "all", kind: "borrowed itinerary", detail: "trip 13 has no day texts of its own; the old site shows trip 7 day 1 and day 3", resolution: "kept that exact behaviour (day texts come from package7-day1 / package7-day3)" });
    }

    content[lang][meta.slug] = out;
  }
}

// ---------------------------------------------------------------------------------------------
// 3) Coverage report (what is missing per language -> falls back to English at runtime)
// ---------------------------------------------------------------------------------------------
const en = content.en;
for (const lang of LANGS) {
  if (lang === "en") continue;
  for (const meta of metas) {
    const c = content[lang][meta.slug]!;
    const e = en[meta.slug]!;
    const missing: string[] = [];
    for (const f of ["title", "marketingTitle", "summary", "keyStops"] as const) if (!c[f]) missing.push(f);
    if ((c.itinerary?.length ?? 0) < (e.itinerary?.length ?? 0)) missing.push(`itinerary (${c.itinerary?.length ?? 0}/${e.itinerary?.length ?? 0} days)`);
    if (e.included && !c.included) missing.push("included");
    if (e.excluded && !c.excluded) missing.push("excluded");
    if (missing.length) {
      note({ trip: meta.legacyId, lang, kind: "missing translation", detail: missing.join(", "), resolution: "English text is shown for these fields" });
    }
  }
}
for (const lang of LANGS) {
  for (const meta of metas) {
    const t = content[lang][meta.slug]!.marketingTitle ?? "";
    if (lang === "zh" && [9, 10, 18].includes(meta.legacyId) && /Chegaga/.test(t)) {
      note({ trip: meta.legacyId, lang, kind: "untranslated word", detail: `Chinese title keeps "Chegaga": ${t}`, resolution: "left as is (needs native review)" });
    }
  }
}

// ---------------------------------------------------------------------------------------------
// 4) Validate + write
// ---------------------------------------------------------------------------------------------
TripsMetaFileSchema.parse(metas);
LegacyMediaFileSchema.parse(legacyMedia);
EnglishContentFileSchema.parse(content.en);
for (const lang of LANGS) if (lang !== "en") ContentFileSchema.parse(content[lang]);

const json = (v: unknown) => JSON.stringify(v, null, 2) + "\n";
fs.mkdirSync(path.join(OUT_DIR, "content"), { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, "trips.meta.json"), json(metas));
fs.writeFileSync(path.join(OUT_DIR, "trips.legacy-media.json"), json(legacyMedia));
for (const lang of LANGS) fs.writeFileSync(path.join(OUT_DIR, "content", `${lang}.json`), json(content[lang]));

// ---------------------------------------------------------------------------------------------
// 5) docs/trips-slug-map.md
// ---------------------------------------------------------------------------------------------
const cell = (s: string | number) => String(s).replace(/\|/g, "\\|");
const lines: string[] = [];
lines.push("# Trips: old numbers -> new slugs", "");
lines.push("Generated by `npm run trips:import` from the old site. Do not edit by hand: change slugs in `src/data/trips/slugs.ts` and re-run.", "");
lines.push("| Old # | New slug | Category | Days | English title | Departure |", "|---:|---|---|---:|---|---|");
for (const m of metas) {
  lines.push(`| ${m.legacyId} | \`${m.slug}\` | ${m.category} | ${m.durationDays} | ${cell(en[m.slug]!.title ?? "")} | ${cell(m.departureCity)} |`);
}
lines.push("", "## Old URL -> new slug", "");
lines.push("| Old URL | New slug |", "|---|---|");
const oldRoute = (c: TripCategory) => (c === "trip" ? "trips" : c === "excursion" ? "excursions" : "trekkings");
for (const m of metas) lines.push(`| \`/${oldRoute(m.category)}/${m.legacyId}\` | \`${m.slug}\` |`);
lines.push("", "## Translation coverage", "", "| Language | Trips with every field translated |", "|---|---:|");
for (const lang of LANGS) {
  const bad = new Set(issues.filter((i) => i.lang === lang && i.kind === "missing translation").map((i) => i.trip));
  lines.push(`| ${lang} | ${TRIP_COUNT - bad.size} / ${TRIP_COUNT} |`);
}
lines.push("", "## Issues found in the old data and how they were handled", "");
lines.push("| Trip | Lang | Issue | Detail | Resolution |", "|---|---|---|---|---|");
for (const i of issues) lines.push(`| ${i.trip} | ${i.lang} | ${cell(i.kind)} | ${cell(i.detail)} | ${cell(i.resolution)} |`);
lines.push("");
fs.mkdirSync(path.dirname(DOC_PATH), { recursive: true });
fs.writeFileSync(DOC_PATH, lines.join("\n"));

console.log(`Imported ${metas.length} trips x ${LANGS.length} languages from\n  ${OLD}`);
console.log(`Wrote src/data/trips/trips.meta.json, content/*.json and docs/trips-slug-map.md`);
console.log(`${issues.length} notes:`);
for (const i of issues) console.log(`  [trip ${i.trip} | ${i.lang}] ${i.kind}: ${i.detail}  ->  ${i.resolution}`);
