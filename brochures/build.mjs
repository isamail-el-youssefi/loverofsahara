/**
 * Builds the Lover of Sahara brochures (PDF) from structured content.
 *
 *   node brochures/build.mjs zagora en          -> public/brochures/zagora-en.pdf
 *
 * 1. reads brochures/content/<slug>.<lang>.json
 * 2. lays the pages out as HTML/CSS (A4, the website's fonts and Amber Walnut colours)
 * 3. prints it to PDF with the installed Chrome (headless), so fonts are embedded and text stays selectable.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [slug = "zagora", lang = "en"] = process.argv.slice(2);
const content = JSON.parse(fs.readFileSync(path.join(root, "brochures", "content", `${slug}.${lang}.json`), "utf8"));
if (!content.credit) {
  const shared = JSON.parse(fs.readFileSync(path.join(root, "brochures", "content", "_credit.en.json"), "utf8"));
  content.credit = { ...shared, text: shared.text.replace("{{subject}}", content.creditSubject) };
}
const I = content.items;
const FOLIO = `Lover of Sahara  ·  ${content.title}`;

const CHROME = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
].find((p) => p && fs.existsSync(p));
if (!CHROME) throw new Error("Chrome not found. Set CHROME_PATH.");

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
// LITE=1 uses the smaller photo copies made by tools/make-lite-assets.py (long brochures stay around 5 MB)
const ASSET_DIR = process.env.LITE ? path.join("brochures", "dist", "assets-lite") : path.join("brochures", "assets");
const asset = (p) => pathToFileURL(path.join(root, ASSET_DIR, p)).href;
const font = (p) => pathToFileURL(path.join(root, "public", "font", p)).href;

/* ---------- styles ---------- */
const css = `
@font-face{font-family:"F37 Wicklow";src:url("${font("F37_Wicklow/F37Wicklow-Light.otf")}");font-weight:300}
@font-face{font-family:"F37 Wicklow";src:url("${font("F37_Wicklow/F37Wicklow-LightItalic.otf")}");font-weight:300;font-style:italic}
@font-face{font-family:"F37 Wicklow";src:url("${font("F37_Wicklow/F37Wicklow-Regular.otf")}");font-weight:400}
@font-face{font-family:"F37 Wicklow";src:url("${font("F37_Wicklow/F37Wicklow-RegularItalic.otf")}");font-weight:400;font-style:italic}
@font-face{font-family:"F37 Wicklow";src:url("${font("F37_Wicklow/F37Wicklow-Medium.otf")}");font-weight:500}
@font-face{font-family:"F37 Wicklow";src:url("${font("F37_Wicklow/F37Wicklow-MediumItalic.otf")}");font-weight:500;font-style:italic}
@font-face{font-family:"PP Neue Montreal";src:url("${font("pp-neue-montreal-cufonfonts/ppneuemontreal-book.otf")}");font-weight:400}
@font-face{font-family:"PP Neue Montreal";src:url("${font("pp-neue-montreal-cufonfonts/ppneuemontreal-medium.otf")}");font-weight:500}
@font-face{font-family:"PP Neue Montreal";src:url("${font("pp-neue-montreal-cufonfonts/ppneuemontreal-bold.otf")}");font-weight:700}
@page{size:210mm 297mm;margin:0}
:root{--paper:#EBEFEE;--ink:#4A413C;--ink-soft:#5E524B;--ink-deep:#2F2824;--brand:#BB6C43;--n400:#94918E;--n500:#6F6965;--n600:#625B57;--rule:rgba(74,65,60,.16)}
*{box-sizing:border-box}
html,body{margin:0;background:var(--paper);color:var(--ink);font-family:"PP Neue Montreal",Helvetica,Arial,sans-serif;font-size:9pt;line-height:1.62;-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{counter-reset:pageno}
.page{position:relative;width:210mm;height:297mm;overflow:hidden;break-after:page;page-break-after:always;background:var(--paper);counter-increment:pageno}
.page:last-child{break-after:auto;page-break-after:auto}
img{display:block;width:100%;height:100%;object-fit:cover}
h1,h2,h3{font-family:"F37 Wicklow",Georgia,serif;font-weight:500;margin:0;letter-spacing:-.02em;color:var(--ink)}
.dim{color:var(--n400);font-weight:400}
.eyebrow{display:flex;align-items:center;gap:2.2mm;font-size:8pt;font-weight:500;color:var(--n500);letter-spacing:.01em}
.eyebrow::before{content:"";width:1.7mm;height:1.7mm;border-radius:50%;background:var(--brand);flex:none}
.eyebrow.light{color:rgba(255,255,255,.78)}
.display{font-size:34pt;line-height:1.02;letter-spacing:-.035em;margin-top:5mm}
.display.md{font-size:26pt}
.display.light,.light .dim{color:#fff}.display.light .dim{color:rgba(255,255,255,.62)}
.lead{font-family:"F37 Wicklow",Georgia,serif;font-style:italic;font-weight:300;font-size:12.5pt;line-height:1.5;color:var(--ink-soft);margin:7mm 0 0;max-width:150mm}
.inner{position:relative;padding:0 16mm}
.top-pad{padding-top:20mm}
.cols2{display:grid;grid-template-columns:1fr 1fr;column-gap:12mm}
.cols3{display:grid;grid-template-columns:1fr 1fr 1fr;column-gap:9mm}
.gap{margin-top:9mm}.tight{margin-top:7mm}
.item{border-top:.4pt solid var(--rule);padding-top:4mm;margin-bottom:7mm;break-inside:avoid}
.item.first{margin-top:0}
.item h3{font-size:13.5pt;line-height:1.14;margin-bottom:2.6mm;letter-spacing:-.025em}
.item p,.body{margin:0;color:var(--n600);white-space:pre-line}
.body{border-top:.4pt solid var(--rule);padding-top:4mm}
.fig.tall{height:62mm;margin-top:0}
.fig{margin:4mm 0 0;height:42mm;border-radius:1.5mm;overflow:hidden;background:#dddfde}
.folio{position:absolute;left:16mm;right:16mm;bottom:9mm;display:flex;justify-content:space-between;font-size:6.8pt;letter-spacing:.05em;text-transform:uppercase;color:var(--n500)}
.folio .no::after{content:counter(pageno)}
.dark .folio{color:rgba(255,255,255,.7)}
.num{font-family:"F37 Wicklow",serif;font-weight:300;font-size:60pt;line-height:1;color:var(--brand);letter-spacing:-.04em;margin-bottom:3mm}
.sub{font-size:15pt;margin-top:12mm;margin-bottom:5mm;color:var(--ink)}
.sub.big{font-size:22pt;line-height:1.1;margin-top:5mm;margin-bottom:6mm;max-width:150mm}
/* photo bands */
.band{position:absolute;left:0;right:0;overflow:hidden;background:#dddfde}
.band.top{top:0;position:relative}.band.bottom{bottom:0}
.h84{height:84mm}.h96{height:96mm}.h170{height:170mm}.h185{height:185mm}.h58{height:58mm}.h150{height:150mm}.h78{height:78mm}
.band-shade{position:absolute;inset:0;background:linear-gradient(to top,rgba(47,40,36,.78),rgba(47,40,36,.05) 62%,rgba(47,40,36,.18))}
.band.overlay .band-text{position:absolute;left:16mm;right:16mm;bottom:11mm}
.band.overlay .display{font-size:38pt}
.h58.overlay .display{font-size:30pt}
.band.bottom.h150{height:150mm}
/* cover & full-bleed pages */
.bg{position:absolute;inset:0;width:100%;height:100%}
.shade{position:absolute;inset:0;background:linear-gradient(to top,rgba(47,40,36,.88),rgba(47,40,36,.12) 58%,rgba(47,40,36,.3))}
.cover-top{position:absolute;top:14mm;left:16mm;right:16mm;display:flex;justify-content:space-between;align-items:baseline;color:#fff}
.mark{font-family:"F37 Wicklow",serif;font-weight:500;text-transform:uppercase;letter-spacing:.12em;font-size:10pt}
.tag{font-size:8pt;letter-spacing:.06em;text-transform:uppercase;opacity:.8}
.cover-bottom{position:absolute;left:16mm;right:16mm;bottom:20mm;color:#fff}
.cover h1{font-size:60pt;line-height:.98;letter-spacing:-.04em;color:#fff;margin:6mm 0 5mm}
.cover h1 .dim{color:rgba(255,255,255,.62)}
.cover-bottom p{margin:0;font-size:12pt;color:rgba(255,255,255,.82)}
/* contents */
.contents .inner{padding-top:22mm}
.toc{list-style:none;margin:14mm 0 0;padding:0;border-top:.4pt solid var(--rule)}
.toc li{display:grid;grid-template-columns:16mm 1fr 10mm;align-items:baseline;padding:5.2mm 0;border-bottom:.4pt solid var(--rule)}
.toc .n{color:var(--brand);font-family:"F37 Wicklow",serif;font-size:13pt}
.toc .t{font-family:"F37 Wicklow",serif;font-size:14pt;letter-spacing:-.02em;line-height:1.2}
.toc .p{text-align:right;color:var(--n500);font-size:8.5pt}
.contents .band.bottom{height:98mm}
.contents .folio{color:rgba(255,255,255,.85)}
/* section pages */
.s01{padding-top:10mm}.s01 .fig{height:30mm}.s01 .lead{margin-top:5mm}.s02{padding-top:0}.s06{padding-top:6mm}.s06 .item{margin-bottom:5mm}.s06 .lead{margin-top:2mm;font-size:11.5pt}
.spacer{height:5mm}
.item.wide p{max-width:120mm}
.wide2{max-width:none;columns:2;column-gap:12mm}
.cols-text{margin-top:7mm;border-top:.4pt solid var(--rule);padding-top:5mm}
/* hiking */
.hike .hike-shade{background:linear-gradient(to bottom,rgba(10,14,30,.55),rgba(10,14,30,0) 34%,rgba(20,16,14,.6) 52%,rgba(20,16,14,.94) 72%)}
.hike-top{position:absolute;top:18mm;left:0;right:0}
.hike-stages{position:absolute;left:0;right:0;bottom:22mm;display:grid;grid-template-columns:1fr 1fr;gap:9mm 12mm}
.stage{border-top:.4pt solid rgba(255,255,255,.35);padding-top:4mm;color:rgba(255,255,255,.82)}
.stage h3{color:#fff;font-size:13.5pt;line-height:1.15;margin:1mm 0 2.4mm}
.stage p{margin:0;font-size:8.6pt;line-height:1.55}
.sn{font-family:"F37 Wicklow",serif;color:#E9A57F;font-size:11pt}
/* useful information */
.emerg{margin-top:5mm;background:var(--ink-deep);color:#fff;border-radius:2mm;padding:6mm 7mm}
.emerg h3{color:#fff;font-size:14pt;margin-bottom:4mm}
.emerg ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(4,1fr);gap:4mm}
.emerg .tel{display:block;font-family:"F37 Wicklow",serif;font-size:24pt;line-height:1;color:#E9A57F;letter-spacing:-.03em}
.emerg .lb{display:block;margin-top:2mm;font-size:7.6pt;letter-spacing:.04em;text-transform:uppercase;color:rgba(255,255,255,.7)}
/* back */
.back-shade{background:linear-gradient(to bottom,rgba(47,40,36,.62),rgba(47,40,36,.55))}
.back-inner{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:22mm 16mm 20mm;color:#fff}
.back .credit{font-family:"F37 Wicklow",serif;font-weight:300;font-size:13pt;line-height:1.5;max-width:140mm;margin:8mm 0 7mm;color:#fff}
.partners{list-style:none;margin:0 0 7mm;padding:0;font-size:9pt;color:rgba(255,255,255,.78)}
.partners li{padding:1.6mm 0;border-top:.4pt solid rgba(255,255,255,.3);max-width:110mm}
.small{font-size:8.2pt;color:rgba(255,255,255,.75);margin:0}
.back .display{font-size:40pt}
/* sticker (the Lover of Sahara brand mark): cover and last page only */
.sticker{position:absolute;display:block;height:auto;object-fit:contain;transform:rotate(-8deg)}
.cover .sticker{right:9mm;bottom:13mm;width:42mm}
.back .sticker{right:10mm;bottom:14mm;width:46mm}
`;




/* ---------- building blocks ---------- */
const eyebrow = (t, cls = "") => `<div class="eyebrow ${cls}">${esc(t)}</div>`;
const txt = (id) => {
  if (id.includes(".")) {
    const [k, f] = id.split(".");
    return I[k][f];
  }
  return typeof I[id] === "string" ? I[id] : I[id].body;
};
const folio = () => `<footer class="folio"><span>${esc(FOLIO)}</span><span class="no"></span></footer>`;
const two = (t) => `${esc(t[0])} <span class="dim">${esc(t[1])}</span>`; // two-tone headline: [strong, dim]
const bandAttr = (b, extra) => `class="band ${extra}${b.h ? ` h${b.h}` : ""}"${b.h ? ` style="height:${b.h}mm"` : ""}`;
const bandImg = (b) => `<img src="${asset(b.image)}" alt="" style="object-position:${b.pos ?? "50% 50%"}">`;
const sticker = () => `<img class="sticker" src="${asset("brand/sticker.svg")}" alt="Lover of Sahara">`;

/** One text block: an item (title + body + optional photo), a bare paragraph, or a tall photo. */
const block = (b) => {
  if (b.item) {
    const cls = ["item", b.first && "first", b.wide && "wide", b.cls].filter(Boolean).join(" ");
    return `<article class="${cls}"><h3>${esc(I[b.item].title)}</h3><p>${esc(I[b.item].body)}</p>${
      b.img ? `<figure class="fig"${b.figH ? ` style="height:${b.figH}mm"` : ""}><img src="${asset(b.img)}" alt="" style="object-position:${b.imgPos ?? "50% 50%"}"></figure>` : ""
    }</article>`;
  }
  if (b.para) return `<p class="body">${esc(txt(b.para))}</p>`;
  if (b.fig) return `<figure class="fig tall"${b.top ? ` style="margin-top:${b.top}mm"` : ""}><img src="${asset(b.fig)}" alt=""></figure>`;
  if (b.info) return `<article class="item"><h3>${esc(I[b.info].title)}</h3><p>${esc(I[b.info].body)}</p></article>`;
  throw new Error("Unknown block: " + JSON.stringify(b));
};
const column = (blocks) => `<div>${blocks.map(block).join("")}</div>`;
const columns = (cols, n = cols.length) => cols.map(column).join("");

const emergCard = () => `<div class="emerg">
      <h3>${esc(I.emergencies.title)}</h3>
      <ul>${I.emergencies.numbers.map((n) => `<li><span class="tel">${esc(n.tel)}</span><span class="lb">${esc(n.label)}</span></li>`).join("")}</ul>
    </div>`;

/* ---------- page renderers (one per page type) ---------- */
const R = {
  cover: (p) => `<section class="page cover">
  <img class="bg" src="${asset(p.image)}" alt="" style="object-position:${p.pos ?? "50% 50%"}">
  <div class="shade"></div>
  <div class="cover-top"><span class="mark">Lover of Sahara</span><span class="tag">${esc(content.kicker)}</span></div>
  <div class="cover-bottom">
    ${eyebrow(content.kicker, "light")}
    <h1>${esc(content.cover.line)} <span class="dim">${esc(content.cover.dim)}</span></h1>
    <p>${esc(content.subtitle)}</p>
  </div>
  ${sticker()}
</section>`,

  contents: (p, ctx) => `<section class="page contents">
  <div class="inner">
    ${eyebrow(content.contentsTitle)}
    <h2 class="display">Inside the <span class="dim">guide.</span></h2>
    <ol class="toc">${content.contents
      .map((c) => `<li><span class="n">${c.n}</span><span class="t">${esc(c.title)}</span><span class="p">${ctx.sectionPage[Number(c.n)]}</span></li>`)
      .join("")}</ol>
  </div>
  <div class="band bottom"><img src="${asset(p.image)}" alt="" style="object-position:${p.pos ?? "50% 50%"}"></div>
  ${folio()}
</section>`,

  // photo band on top, then eyebrow, two-tone title, lead, two columns
  intro: (p) => `<section class="page">
  <div ${bandAttr(p.band, "top")}>${bandImg(p.band)}</div>
  <div class="inner s01">
    ${eyebrow(p.eyebrow)}
    <h2 class="display">${two(p.title)}</h2>
    ${p.lead ? `<p class="lead">${esc(txt(p.lead))}</p>` : ""}
    <div class="cols2 gap">${columns(p.columns)}</div>
  </div>
  ${folio()}
</section>`,

  // tall photo band with the title on it, then lead and a first item
  "opener-band": (p) => `<section class="page">
  <div ${bandAttr(p.band, "top overlay")}>
    ${bandImg(p.band)}
    <div class="band-shade"></div>
    <div class="band-text">${eyebrow(p.num, "light")}<h2 class="display light">${two(p.title)}</h2></div>
  </div>
  <div class="inner s02">
    ${p.lead ? `<p class="lead">${esc(txt(p.lead))}</p><div class="spacer"></div>` : ""}
    ${(p.blocks ?? []).map(block).join("")}
    ${p.columns ? `<div class="${p.cols === 3 ? "cols3" : "cols2"} gap tight">${columns(p.columns)}</div>` : ""}
  </div>
  ${folio()}
</section>`,

  // two (or three) columns of items
  items: (p) => `<section class="page">
  <div class="inner top-pad">
    ${eyebrow(p.eyebrow)}
    ${p.sub ? `<h3 class="sub big">${esc(txt(p.sub))}</h3>` : ""}
    <div class="${p.cols === 3 ? "cols3" : "cols2"} gap tight">${columns(p.columns)}</div>
  </div>
  ${folio()}
</section>`,

  // heading + long text in two text columns, photo band at the bottom
  "text-band": (p) => `<section class="page">
  <div class="inner top-pad">
    ${eyebrow(p.eyebrow)}
    <h2 class="display md">${esc(I[p.item].title)}</h2>
    <p class="body wide2 cols-text">${esc(I[p.item].body)}</p>
  </div>
  <div ${bandAttr(p.band, "bottom")}>${bandImg(p.band)}</div>
  ${folio()}
</section>`,

  // big terracotta number, title, optional lead and sub heading, then columns
  "opener-type": (p) => `<section class="page">
  <div class="inner top-pad">
    <div class="num">${p.num}</div>
    ${eyebrow(p.eyebrow)}
    <h2 class="display">${two(p.title)}</h2>
    ${p.lead ? `<p class="lead">${esc(txt(p.lead))}</p>` : ""}
    ${p.sub ? `<h3 class="sub">${esc(txt(p.sub))}</h3>` : ""}
    <div class="${p.cols === 3 ? "cols3" : "cols2"} gap">${columns(p.columns)}</div>
  </div>
  ${folio()}
</section>`,

  // full-bleed dark photo page with numbered stages
  "dark-full": (p) => `<section class="page dark hike">
  <img class="bg" src="${asset(p.image)}" alt="" style="object-position:${p.pos ?? "50% 50%"}">
  <div class="shade hike-shade"></div>
  <div class="inner hike-top">
    ${eyebrow(p.eyebrow, "light")}
    <h2 class="display light">${two(p.title)}</h2>
  </div>
  <div class="inner hike-stages">${p.stages
    .map((id, i) => `<article class="stage"><span class="sn">0${i + 1}</span><h3>${esc(I[id].title)}</h3><p>${esc(I[id].body)}</p></article>`)
    .join("")}</div>
  ${folio()}
</section>`,

  // photo band with title, lead, three columns of short items and the emergency numbers card
  info: (p) => `<section class="page">
  <div ${bandAttr(p.band, "top overlay")}>
    ${bandImg(p.band)}
    <div class="band-shade"></div>
    <div class="band-text">${eyebrow(p.num, "light")}<h2 class="display light">${two(p.title)}</h2></div>
  </div>
  <div class="inner s06">
    <p class="lead">${esc(txt(p.lead))}</p>
    <div class="cols3 gap tight">${columns(p.columns)}</div>
    ${p.noEmerg ? "" : emergCard()}
  </div>
  ${folio()}
</section>`,

  // second page of useful information (no photo band): columns + the emergency numbers card
  "info-more": (p) => `<section class="page">
  <div class="inner top-pad">
    ${eyebrow(p.eyebrow)}
    <div class="cols3 gap tight">${columns(p.columns)}</div>
    ${emergCard()}
  </div>
  ${folio()}
</section>`,

  back: (p) => {
    const c = content.credit;
    return `<section class="page dark back">
  <img class="bg" src="${asset(p.image)}" alt="" style="object-position:${p.pos ?? "50% 50%"}">
  <div class="shade back-shade"></div>
  <div class="inner back-inner">
    <div>
      ${eyebrow(c.title, "light")}
      <p class="credit">${esc(c.text)}</p>
      <ul class="partners">${c.partners.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      <p class="small">${esc(c.website)}  ·  ${esc(c.email)}</p>
    </div>
    <div class="cta">
      <h2 class="display light">Plan your Sahara <span class="dim">journey.</span></h2>
      <p class="small">www.loverofsahara.tours  ·  loveroffsahara@gmail.com  ·  +212 661 842 609</p>
    </div>
  </div>
  ${sticker()}
</section>`;
  },
};

/* ---------- automatic pagination of long item lists ---------- */
// Heights come from Chrome itself (dump-dom of the same CSS at column width), so pages fill exactly.
const COL_W_MM = 83;
const CAP_MM = 244; // usable column height under the eyebrow
function measure(blocks) {
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>${css}.mcol{width:${COL_W_MM}mm;position:absolute;left:0;top:0}</style></head><body>
<div class="mcol">${blocks.map((b, i) => `<div class="m" data-i="${i}">${block(b)}</div>`).join("")}</div><pre id="out"></pre>
<script>document.fonts.ready.then(()=>setTimeout(()=>{const r=[...document.querySelectorAll('.m')].map(e=>{const el=e.firstElementChild,cs=getComputedStyle(el);return el.getBoundingClientRect().height+parseFloat(cs.marginTop)+parseFloat(cs.marginBottom)});document.getElementById('out').textContent=JSON.stringify(r)},200))</script></body></html>`;
  const dir = path.join(root, "brochures", "dist");
  fs.mkdirSync(dir, { recursive: true });
  const f = path.join(dir, `_measure.${slug}.html`);
  fs.writeFileSync(f, html);
  const out = execFileSync(
    CHROME,
    ["--headless=new", "--disable-gpu", "--allow-file-access-from-files", "--virtual-time-budget=20000", "--dump-dom", pathToFileURL(f).href],
    { timeout: 120000, maxBuffer: 64 * 1024 * 1024 },
  ).toString();
  const m = out.match(/<pre id="out">([\s\S]*?)<\/pre>/);
  if (!m) throw new Error("Could not measure item heights");
  return JSON.parse(m[1].replace(/&quot;/g, '"')).map((px) => px / 3.7795275591);
}

/** Fills two columns per page, in order; returns `items` page specs. */
function paginate(spec) {
  const h = measure(spec.blocks);
  const pages = [];
  let cols = [[], []];
  let used = [0, 0];
  let c = 0;
  const flush = () => {
    if (cols[0].length || cols[1].length) pages.push({ type: "items", eyebrow: spec.eyebrow, cols: 2, columns: cols });
    cols = [[], []];
    used = [0, 0];
    c = 0;
  };
  spec.blocks.forEach((b, i) => {
    while (used[c] > 0 && used[c] + h[i] > CAP_MM) {
      if (c === 0) c = 1;
      else flush();
    }
    cols[c].push(b);
    used[c] += h[i];
  });
  flush();
  return pages;
}

/* ---------- assemble ---------- */
let specs = [];
for (const p of content.pages) {
  if (p.type === "items-auto") {
    const [first, ...rest] = paginate(p);
    first.startsSection = p.startsSection;
    specs.push(first, ...rest);
  } else specs.push(p);
}
const sectionPage = {};
specs.forEach((p, i) => {
  if (p.startsSection != null && sectionPage[p.startsSection] == null) sectionPage[p.startsSection] = i + 1;
});
const pages = specs.map((p) => {
  if (!R[p.type]) throw new Error("Unknown page type: " + p.type);
  return R[p.type](p, { sectionPage });
});

const html = `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><title>${esc(content.title)} – Lover of Sahara</title><style>${css}</style></head><body>${pages.join("\n")}</body></html>`;

const outDir = path.join(root, "brochures", "dist");
fs.mkdirSync(outDir, { recursive: true });
const htmlFile = path.join(outDir, `${slug}.${lang}.html`);
fs.writeFileSync(htmlFile, html);

const pdfDir = path.join(root, "public", "brochures");
fs.mkdirSync(pdfDir, { recursive: true });
const pdfFile = path.join(pdfDir, `${slug}-${lang}.pdf`);
execFileSync(
  CHROME,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    "--allow-file-access-from-files",
    "--virtual-time-budget=20000",
    `--print-to-pdf=${pdfFile}`,
    pathToFileURL(htmlFile).href,
  ],
  { stdio: "pipe", timeout: 120000 },
);
console.log(`${path.relative(root, pdfFile)}  (${(fs.statSync(pdfFile).size / 1048576).toFixed(1)} MB, ${pages.length} pages)`);
