/**
 * Checks src/data/trips/heroes.ts:
 *   1. every trip has a hero, and every entry belongs to a real trip
 *   2. the hero's place is one of that trip's stops
 *   3. the photo exists (local file, or a 200 from the public ImageKit endpoint) and is landscape and wide enough
 *
 *   npm run trips:check-heroes
 */
import fs from "node:fs";
import path from "node:path";
import { placeIdForStop } from "../src/data/places/aliases.ts";
import { TRIP_HERO } from "../src/data/trips/heroes.ts";

const ROOT = process.cwd();
const IK = "https://ik.imagekit.io/loverofsahara";
const MIN_WIDTH = 1500;
const trips: { slug: string; stops: { name: string }[] }[] = JSON.parse(
  fs.readFileSync(path.join(ROOT, "src", "data", "trips", "trips.meta.json"), "utf8"),
);

/** Width and height from the JPEG/PNG header (enough for these files, no image library needed). */
function size(buf: Buffer): { w: number; h: number } | undefined {
  if (buf[0] === 0x89 && buf[1] === 0x50) return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  for (let i = 2; i < buf.length - 9; ) {
    if (buf[i] !== 0xff) { i++; continue; }
    const marker = buf[i + 1]!;
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
    }
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return undefined;
}

let problems = 0;
const fail = (slug: string, msg: string) => { problems++; console.log(`FAIL ${slug}: ${msg}`); };

for (const t of trips) {
  const hero = TRIP_HERO[t.slug];
  if (!hero) { fail(t.slug, "no hero entry"); continue; }

  const onRoute = t.stops.some((s) => placeIdForStop(s.name) === hero.place);
  if (!onRoute) fail(t.slug, `"${hero.place}" is not one of its stops`);

  let buf: Buffer | undefined;
  if (hero.local) {
    const file = path.join(ROOT, "public", hero.local);
    if (!fs.existsSync(file)) fail(t.slug, `missing file ${hero.local}`);
    else buf = fs.readFileSync(file);
  } else if (hero.ik) {
    const res = await fetch(IK + hero.ik.split("/").map(encodeURIComponent).join("/"));
    if (!res.ok) fail(t.slug, `ImageKit ${res.status} for ${hero.ik}`);
    else buf = Buffer.from(await res.arrayBuffer());
  } else fail(t.slug, "entry has neither local nor ik");

  const dim = buf && size(buf);
  if (buf && !dim) fail(t.slug, "could not read the image size");
  if (dim) {
    if (dim.w < dim.h) fail(t.slug, `portrait (${dim.w}x${dim.h})`);
    if (dim.w < MIN_WIDTH) fail(t.slug, `only ${dim.w}px wide (want ${MIN_WIDTH}+)`);
    console.log(`ok   ${t.slug.padEnd(40)} ${hero.place.padEnd(15)} ${dim.w}x${dim.h}`);
  }
}
const known = new Set(trips.map((t) => t.slug));
for (const slug of Object.keys(TRIP_HERO)) if (!known.has(slug)) fail(slug, "hero entry for a trip that does not exist");

console.log(problems ? `\n${problems} problem(s)` : `\nAll ${trips.length} trip heroes are on-route, landscape and ${MIN_WIDTH}px+.`);
process.exit(problems ? 1 : 0);
