/**
 * Read-only: prints the folder tree of the ImageKit media library (folders + how many files each holds).
 *
 *   npm run imagekit:list                 whole library
 *   npm run imagekit:list -- /cities      one folder (and everything below it)
 *   npm run imagekit:list -- / --files    also print every file name
 *
 * Needs IMAGEKIT_PRIVATE_KEY in .env.local (git-ignored). The key is only used by this script on your
 * machine; it has no VITE_ prefix, so it can never end up in the website bundle.
 */
import fs from "node:fs";
import path from "node:path";

const envFile = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envFile)) process.loadEnvFile(envFile);

const KEY = process.env.IMAGEKIT_PRIVATE_KEY?.trim();
if (!KEY) {
  console.error(
    "IMAGEKIT_PRIVATE_KEY is missing. Add it to .env.local:\n  IMAGEKIT_PRIVATE_KEY=private_xxxxxxxx",
  );
  process.exit(1);
}

const args = process.argv.slice(2);
const SHOW_FILES = args.includes("--files");
const START = args.find((a) => !a.startsWith("--")) ?? "/";
const AUTH = "Basic " + Buffer.from(`${KEY}:`).toString("base64");
const PAGE = 1000;

/** Everything directly inside one folder (files and sub-folders). */
async function listFolder(folder) {
  const items = [];
  for (let skip = 0; ; skip += PAGE) {
    const url = new URL("https://api.imagekit.io/v1/files");
    url.searchParams.set("path", folder);
    url.searchParams.set("type", "all");
    url.searchParams.set("limit", String(PAGE));
    url.searchParams.set("skip", String(skip));
    const res = await fetch(url, { headers: { Authorization: AUTH } });
    if (!res.ok) throw new Error(`ImageKit ${res.status} for ${folder}: ${await res.text()}`);
    const page = await res.json();
    items.push(...page);
    if (page.length < PAGE) return items;
  }
}

let folderCount = 0;
let fileCount = 0;

async function walk(folder, depth) {
  const items = await listFolder(folder);
  const folders = items
    .filter((i) => i.type === "folder")
    .sort((a, b) => a.name.localeCompare(b.name));
  const files = items
    .filter((i) => i.type !== "folder")
    .sort((a, b) => a.name.localeCompare(b.name));
  fileCount += files.length;
  const pad = "  ".repeat(depth);
  console.log(`${pad}${folder}  (${files.length} files, ${folders.length} folders)`);
  if (SHOW_FILES) {
    for (const f of files)
      console.log(`${pad}  - ${f.name}${f.width ? `  ${f.width}x${f.height}` : ""}`);
  }
  for (const sub of folders) {
    folderCount++;
    await walk(sub.folderPath ?? `${folder.replace(/\/$/, "")}/${sub.name}`, depth + 1);
  }
}

await walk(START, 0);
console.log(`\n${folderCount} folders, ${fileCount} files under ${START}`);
