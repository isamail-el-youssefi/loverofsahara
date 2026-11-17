/**
 * Turns src/data/reviews/reviews.json (the old site's reviews, from import-old-reviews.mjs) into SQL for D1.
 *
 *   node scripts/reviews-to-sql.mjs > migrations/seed-old-reviews.sql
 *   npx wrangler d1 execute lover-reviews --remote --file migrations/seed-old-reviews.sql
 *
 * Uses INSERT OR REPLACE with the original ids, so it is safe to run again. Emails are not in the JSON.
 */
import fs from "node:fs";
import path from "node:path";

const reviews = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src", "data", "reviews", "reviews.json"), "utf8"));
const q = (v) => (v == null ? "NULL" : `'${String(v).replace(/'/g, "''")}'`);

const lines = reviews.map(
  (r) =>
    `INSERT OR REPLACE INTO reviews (id, trip, name, email, rating, comment, lang, date, photos, reply_text, reply_date, created_at) VALUES (${[
      q(r.id),
      q(r.trip),
      q(r.name),
      "NULL",
      r.rating,
      q(r.comment),
      q(r.lang),
      q(r.date),
      q(JSON.stringify(r.photos ?? [])),
      q(r.reply?.text),
      q(r.reply?.date),
      q(`${r.date}T12:00:00.000Z`),
    ].join(", ")});`,
);
process.stdout.write(lines.join("\n") + "\n");
