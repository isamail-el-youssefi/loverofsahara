/**
 * One-off, repeatable import of the old site's reviews backup into src/data/reviews/reviews.json.
 *
 *   node scripts/import-old-reviews.mjs                       (default old-project folder)
 *   node scripts/import-old-reviews.mjs "<path to reviews.json>"
 *
 * - Maps the old numeric tripId to the new trip slug (src/data/trips/slugs.ts).
 * - Leaves OUT personal data: email addresses are never copied.
 * - Skips obvious test entries (comments under 30 characters, like "testing"): they must not appear on the site.
 * - Keeps the reviewer's original language (the page labels it) and the owner's reply and photos.
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const source =
  process.argv[2] ??
  path.join(root, "bringing data from old website", "old website", "Me-First-freelance-main", "data", "reviews.json");

// old trip number -> new slug (keep in step with src/data/trips/slugs.ts)
const slugsFile = fs.readFileSync(path.join(root, "src", "data", "trips", "slugs.ts"), "utf8");
const SLUG = Object.fromEntries([...slugsFile.matchAll(/^\s+(\d+):\s*"([^"]+)"/gm)].map((m) => [m[1], m[2]]));

const STOP = {
  en: ["the", "and", "was", "with", "our", "very", "for", "this", "had", "we"],
  fr: ["le", "la", "les", "et", "nous", "pour", "avec", "une", "des", "très"],
  de: ["und", "der", "die", "das", "ein", "ist", "wir", "mit", "sehr", "für"],
  it: ["il", "la", "che", "una", "per", "con", "nel", "della", "è", "stata"],
  es: ["el", "los", "las", "una", "con", "por", "muy", "que", "fue", "nuestro"],
};
function lang(text) {
  const words = text.toLowerCase().match(/[\p{L}']+/gu) ?? [];
  let best = "en";
  let top = -1;
  for (const [l, list] of Object.entries(STOP)) {
    const hit = words.filter((w) => list.includes(w)).length;
    if (hit > top) {
      top = hit;
      best = l;
    }
  }
  return best;
}

const old = JSON.parse(fs.readFileSync(source, "utf8")).reviews;
const kept = [];
const skipped = [];
for (const r of old) {
  const slug = SLUG[String(r.tripId)];
  if (!slug || r.comment.trim().length < 30) {
    skipped.push(`${r.tripId}: ${r.comment.trim().length < 30 ? "test entry" : "unknown trip"}`);
    continue;
  }
  kept.push({
    id: r.id,
    trip: slug,
    name: r.fullName.trim(),
    rating: r.rating,
    comment: r.comment.trim(),
    lang: lang(r.comment),
    date: (r.createdAt ?? "").slice(0, 10),
    photos: (r.images ?? []).filter((u) => /^https:\/\//.test(u)),
    ...(r.adminReply
      ? { reply: { text: r.adminReply.trim(), date: (r.replyDate ?? r.createdAt ?? "").slice(0, 10) } }
      : {}),
  });
}
kept.sort((a, b) => b.date.localeCompare(a.date));

const out = path.join(root, "src", "data", "reviews", "reviews.json");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(kept, null, 2) + "\n");
console.log(`reviews.json: kept ${kept.length}, skipped ${skipped.length} (${skipped.join("; ")})`);
console.log(kept.map((k) => `${k.trip} [${k.lang}] ${k.rating}★ photos:${k.photos.length}${k.reply ? " reply" : ""}`).join("\n"));
