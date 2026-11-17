/**
 * Reviews API (Cloudflare Pages Function, backed by D1 and R2).
 *   GET  /api/reviews?trip=<slug>   published reviews of a trip, newest first (never includes emails)
 *   POST /api/reviews               multipart/form-data: trip, name, email?, rating, comment, photos[] (<= 4 images)
 * Reviews are published immediately.
 */

// Minimal Cloudflare binding types, so this file needs no extra dependency.
interface D1Statement {
  bind(...values: unknown[]): D1Statement;
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
  run(): Promise<unknown>;
}
interface R2Bucket {
  put(key: string, value: ArrayBuffer, options?: { httpMetadata?: { contentType?: string } }): Promise<unknown>;
}
interface Env {
  DB: { prepare(sql: string): D1Statement };
  PHOTOS: R2Bucket;
  PHOTOS_BASE_URL: string;
}
type Handler = (ctx: { request: Request; env: Env }) => Promise<Response>;

const MIN_COMMENT = 20;
const MAX_COMMENT = 1500;
const MAX_NAME = 80;
const MAX_PHOTOS = 4;
const MAX_PHOTO_BYTES = 8 * 1048576;
const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif", "image/avif": "avif" };

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });

const STOP: Record<string, string[]> = {
  en: ["the", "and", "was", "with", "our", "very", "for", "this", "had", "we"],
  fr: ["le", "la", "les", "et", "nous", "pour", "avec", "une", "des", "très"],
  de: ["und", "der", "die", "das", "ein", "ist", "wir", "mit", "sehr", "für"],
  it: ["il", "la", "che", "una", "per", "con", "nel", "della", "è", "stata"],
  es: ["el", "los", "las", "una", "con", "por", "muy", "que", "fue", "nuestro"],
};
function detectLang(text: string): string {
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

interface Row {
  id: string;
  trip: string;
  name: string;
  rating: number;
  comment: string;
  lang: string;
  date: string;
  photos: string;
  reply_text: string | null;
  reply_date: string | null;
}

/** Row -> the `Review` shape used by the site (src/lib/reviews.ts). */
const toReview = (r: Row) => ({
  id: r.id,
  trip: r.trip,
  name: r.name,
  rating: r.rating,
  comment: r.comment,
  lang: r.lang,
  date: r.date,
  photos: JSON.parse(r.photos || "[]") as string[],
  ...(r.reply_text ? { reply: { text: r.reply_text, date: r.reply_date ?? r.date } } : {}),
});

export const onRequestGet: Handler = async ({ request, env }) => {
  const trip = new URL(request.url).searchParams.get("trip");
  const stmt = trip
    ? env.DB.prepare("SELECT id, trip, name, rating, comment, lang, date, photos, reply_text, reply_date FROM reviews WHERE trip = ? ORDER BY created_at DESC").bind(trip)
    : env.DB.prepare("SELECT id, trip, name, rating, comment, lang, date, photos, reply_text, reply_date FROM reviews ORDER BY created_at DESC");
  const { results } = await stmt.all<Row>();
  const res = json({ reviews: results.map(toReview) });
  res.headers.set("Cache-Control", "public, max-age=30");
  return res;
};

export const onRequestPost: Handler = async ({ request, env }) => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  // Honeypot: real visitors never fill this hidden field. Pretend success so bots don't retry.
  if (String(form.get("website") ?? "").trim()) return json({ ok: true });

  const trip = String(form.get("trip") ?? "").trim();
  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const comment = String(form.get("comment") ?? "").trim();
  const rating = Number(form.get("rating"));

  if (!/^[a-z0-9-]{1,120}$/.test(trip)) return json({ error: "Unknown trip." }, 400);
  if (!name || name.length > MAX_NAME) return json({ error: "Please tell us your name." }, 400);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return json({ error: "That email address doesn't look right." }, 400);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return json({ error: "Choose a rating from 1 to 5 stars." }, 400);
  if (comment.length < MIN_COMMENT) return json({ error: `Please write at least ${MIN_COMMENT} characters.` }, 400);
  if (comment.length > MAX_COMMENT) return json({ error: `Reviews are limited to ${MAX_COMMENT} characters.` }, 400);

  const files = form.getAll("photos").filter((f): f is File => typeof f !== "string" && f.size > 0);
  if (files.length > MAX_PHOTOS) return json({ error: `You can add up to ${MAX_PHOTOS} photos.` }, 400);
  for (const f of files) {
    if (!EXT[f.type]) return json({ error: "Only JPG, PNG, WebP, GIF or AVIF photos can be added." }, 400);
    if (f.size > MAX_PHOTO_BYTES) return json({ error: "Each photo must be under 8 MB." }, 400);
  }

  if (files.length && (!env.PHOTOS || !env.PHOTOS_BASE_URL)) {
    return json({ error: "Photo uploads aren't available yet. Please send your review without photos." }, 503);
  }

  const id = crypto.randomUUID();
  const base = (env.PHOTOS_BASE_URL ?? "").replace(/\/$/, "");
  const photos: string[] = [];
  for (const [i, f] of files.entries()) {
    const key = `reviews/${id}-${i + 1}.${EXT[f.type]}`;
    await env.PHOTOS.put(key, await f.arrayBuffer(), { httpMetadata: { contentType: f.type } });
    photos.push(`${base}/${key}`);
  }

  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const lang = detectLang(comment);
  await env.DB.prepare(
    "INSERT INTO reviews (id, trip, name, email, rating, comment, lang, date, photos, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
  )
    .bind(id, trip, name, email || null, rating, comment, lang, date, JSON.stringify(photos), now.toISOString())
    .run();

  return json({ review: { id, trip, name, rating, comment, lang, date, photos } }, 201);
};
