/**
 * Runs after `vite build` (see the "build" script). Gives every URL its own HTML file so search engines and
 * social previews get real titles, descriptions, canonical links, structured data and page content without
 * running JavaScript:
 *
 *   dist/places/zagora/index.html, dist/trips/<slug>/index.html, dist/trips/index.html, dist/blog/..., dist/index.html
 *   dist/sitemap.xml, dist/_redirects (old numeric URLs -> new slugs, plus the single-page-app fallback)
 *
 * The page content comes from scripts/seo-entry.ts, loaded through Vite's own SSR build so it reads the same
 * data files and path aliases as the app. The app still renders in the browser as before: React replaces the
 * prerendered block inside #root when it starts.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "vite";

const root = process.cwd();
const dist = path.join(root, "dist");
const tmp = path.join(root, "node_modules", ".prerender");
const SITE_URL = "https://www.loverofsahara.com"; // keep in step with src/lib/routes.ts

if (!fs.existsSync(path.join(dist, "index.html"))) {
  console.error("prerender: dist/index.html not found. Run `vite build` first.");
  process.exit(1);
}

// 1. Bundle the page generator for Node (same config, aliases and data as the app).
await build({
  configFile: path.join(root, "vite.config.ts"),
  logLevel: "warn",
  // tsconfig paths only cover src/, so give this out-of-tree entry the "@/" alias explicitly.
  resolve: { alias: { "@": path.join(root, "src") } },
  build: {
    ssr: path.join(root, "scripts", "seo-entry.ts"),
    outDir: tmp,
    emptyOutDir: true,
    rollupOptions: { output: { format: "es", entryFileNames: "seo-entry.mjs" } },
  },
  ssr: { noExternal: true },
});
const { buildPages } = await import(pathToFileURL(path.join(tmp, "seo-entry.mjs")).href);
const { pages, redirects } = await buildPages();

// 2. Fill the built shell for each page.
const shell = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const attr = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const abs = (p) => (p === "/" ? SITE_URL : SITE_URL + p);

// Tags the page sets for itself: remove the generic ones from the shell, then add the page's.
const STRIP = [
  /<title>[\s\S]*?<\/title>\s*/i,
  /<meta\s+(?:name|property)="(?:description|og:[a-z:_]+|twitter:[a-z:_]+)"[\s\S]*?\/?>\s*/gi,
  /<link\s+rel="canonical"[\s\S]*?\/?>\s*/gi,
];

const HIDDEN =
  "position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0";

function render(page) {
  const { seo } = page;
  const url = abs(seo.path);
  let html = shell;
  for (const re of STRIP) html = html.replace(re, "");
  const head = [
    `<title>${attr(seo.title).replace(/&quot;/g, '"')}</title>`,
    `<meta name="description" content="${attr(seo.description)}" />`,
    `<link rel="canonical" href="${attr(url)}" />`,
    `<meta property="og:site_name" content="Lover of Sahara" />`,
    `<meta property="og:type" content="${seo.type}" />`,
    `<meta property="og:title" content="${attr(seo.title)}" />`,
    `<meta property="og:description" content="${attr(seo.description)}" />`,
    `<meta property="og:url" content="${attr(url)}" />`,
    seo.image ? `<meta property="og:image" content="${attr(seo.image)}" />` : "",
    `<meta name="twitter:card" content="${seo.image ? "summary_large_image" : "summary"}" />`,
    `<meta name="twitter:title" content="${attr(seo.title)}" />`,
    `<meta name="twitter:description" content="${attr(seo.description)}" />`,
    seo.image ? `<meta name="twitter:image" content="${attr(seo.image)}" />` : "",
    ...seo.jsonLd.map((j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, "\\u003c")}</script>`),
  ]
    .filter(Boolean)
    .join("\n    ");
  html = html.replace("</head>", `    ${head}\n  </head>`);
  // Real content for crawlers; visually hidden because React renders the designed page over it.
  html = html.replace(
    /<div id="root"><\/div>/,
    `<div id="root"><div data-prerender style="${HIDDEN}">${page.body}</div></div>`,
  );
  return html;
}

for (const page of pages) {
  const dir = page.path === "/" ? dist : path.join(dist, ...page.path.split("/").filter(Boolean));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), render(page));
}

// 3. Sitemap and redirects.
const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${abs(p.path)}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemap);

// Old numeric URLs first, then the SPA fallback (prerendered files win over it on Netlify/Cloudflare-style hosts).
fs.writeFileSync(path.join(dist, "_redirects"), `${redirects.join("\n")}\n/*  /index.html  200\n`);

fs.rmSync(tmp, { recursive: true, force: true });
console.log(`prerender: ${pages.length} pages, sitemap.xml, ${redirects.length} redirects -> dist/`);
