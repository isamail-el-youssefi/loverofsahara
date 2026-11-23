/**
 * Build-time page generator for the prerender (scripts/prerender.mjs bundles and runs this with Vite's
 * SSR build, so it reads the same data files and path aliases as the app).
 *
 * For every URL it returns the page's SEO (title, description, canonical, image, JSON-LD) and a block of
 * plain semantic HTML (headings, text, facts, links) that goes inside #root, so crawlers that do not run
 * JavaScript still see the real content and the internal links. React replaces it when the app starts.
 */
import { tidyRoute, stopsForDay } from "@/components/trip/parts";
import { blogArticles } from "@/data/articles";
import { placeIdForStop } from "@/data/places/aliases";
import { buildPlaceIndex } from "@/data/places/derive";
import { placeHero } from "@/data/places/heroes";
import { PLACES } from "@/data/places/places";
import { getTrips, loadLegacyMedia, loadLocalizedTrips, tripImage, type LocalizedTrip } from "@/data/trips";
import { aboutContent } from "@/components/about/content";
import { SITE } from "@/i18n/site";
import { CONTACT, STEPS, whatsappBase } from "@/components/contact/data";
import { BROCHURES, brochurePdf } from "@/data/brochures";
import { LANGUAGES, type Lang } from "@/i18n/languages";
import { UI } from "@/i18n/ui";
import { PAGES } from "@/i18n/pages";
import { localizedArticles } from "@/data/articles-i18n";
import { ABOUT_PATH, BLOG_PATH, BROCHURES_PATH, brochureLangPath, CONTACT_PATH, GALLERY_PATH, TRIPS_PATH, aboutPath, articlePath, blogPath, contactPath, galleryPath, homePath, placePath, tripPath, tripsPath } from "@/lib/routes";
import { absUrl, aboutSeo, articleSeo, blogSeo, brochureReaderSeo, brochuresSeo, contactSeo, gallerySeo, HOME_NAME, homeSeo, placeSeo, tripSeo, tripShareImage, tripsSeo, type PageSeo } from "@/lib/seoData";

// The brochures' source text, one file per guide and language (brochures/content/<slug>.<lang>.json).
const BROCHURE_CONTENT = Object.fromEntries(
  Object.entries(import.meta.glob("../brochures/content/*.json", { eager: true, import: "default" }) as Record<string, BrochureDoc>)
    .map(([file, doc]) => [file.split("/").pop()!.replace(/\.json$/, ""), doc] as const)
    .filter(([key]) => !key.startsWith("_")),
) as Record<string, BrochureDoc>;

interface BrochureDoc {
  contentsTitle?: string;
  contents?: { n: string; title: string }[];
  items?: Record<string, string | BrochureItem>;
}
interface BrochureItem {
  title?: string;
  subtitle?: string;
  lead?: string;
  body?: string;
  paras?: string[];
  numbers?: { label: string; tel: string }[];
}

/** A guide's text as plain HTML: contents, then every section with its heading and paragraphs. */
function brochureText(doc: BrochureDoc): string {
  const out: string[] = [];
  if (doc.contents?.length) {
    out.push(`<h2>${esc(doc.contentsTitle ?? "Contents")}</h2><ol>${doc.contents.map((c) => `<li>${esc(c.title)}</li>`).join("")}</ol>`);
  }
  for (const item of Object.values(doc.items ?? {})) {
    if (typeof item === "string") {
      out.push(para(item));
      continue;
    }
    const sectioned = Boolean(item.subtitle || item.lead);
    if (item.title) out.push(sectioned || !(item.body || item.paras) ? `<h2>${esc(item.title)}</h2>` : `<h3>${esc(item.title)}</h3>`);
    if (item.subtitle) out.push(`<p><em>${esc(item.subtitle)}</em></p>`);
    if (item.lead) out.push(para(item.lead));
    if (item.body) out.push(para(item.body));
    for (const p of item.paras ?? []) out.push(para(p));
    if (item.numbers?.length) out.push(`<ul>${item.numbers.map((n) => `<li>${esc(n.label)}: ${esc(n.tel)}</li>`).join("")}</ul>`);
  }
  return out.join("\n");
}

export interface BuiltPage {
  path: string;
  seo: PageSeo;
  /** HTML for inside #root. */
  body: string;
}

const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);
const link = (href: string, text: string) => `<a href="${esc(href)}">${esc(text)}</a>`;
const para = (text: string) =>
  text
    .split(/\n{2,}|\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${esc(p)}</p>`)
    .join("");

const versions = (pathFor: (l: Lang) => string) =>
  `<nav aria-label="Languages"><ul>${LANGUAGES.map((o) => `<li><a href="${esc(pathFor(o.code))}" hreflang="${esc(o.htmlLang)}" lang="${esc(o.htmlLang)}">${esc(o.native)}</a></li>`).join("")}</ul></nav>`;

const crumbs = (items: { name: string; href?: string }[]) =>
  `<nav aria-label="Breadcrumb">${items.map((i) => (i.href ? link(i.href, i.name) : esc(i.name))).join(" / ")}</nav>`;

/** The words the trip pages print around the data, in each language. */
interface TripLabels {
  home: string;
  duration: string;
  stops: string;
  highlights: string;
  route: string;
  dayByDay: string;
  day: (n: number) => string;
  included: string;
  excluded: string;
  languages: string;
}
const T_LABELS: Record<Lang, TripLabels> = {
  en: { home: "Home", duration: "Duration", stops: "Stops", highlights: "Highlights", route: "The route", dayByDay: "Day by day", day: (n) => `Day ${n}`, included: "What your trip includes", excluded: "Not included", languages: "This trip in other languages" },
  fr: { home: "Accueil", duration: "Durée", stops: "Étapes", highlights: "Points forts", route: "L’itinéraire", dayByDay: "Jour par jour", day: (n) => `Jour ${n}`, included: "Ce que comprend votre voyage", excluded: "Non inclus", languages: "Ce voyage dans d’autres langues" },
  de: { home: "Startseite", duration: "Dauer", stops: "Stationen", highlights: "Höhepunkte", route: "Die Route", dayByDay: "Tag für Tag", day: (n) => `Tag ${n}`, included: "Das ist in Ihrer Reise enthalten", excluded: "Nicht enthalten", languages: "Diese Reise in anderen Sprachen" },
  es: { home: "Inicio", duration: "Duración", stops: "Paradas", highlights: "Lo más destacado", route: "La ruta", dayByDay: "Día a día", day: (n) => `Día ${n}`, included: "Qué incluye su viaje", excluded: "No incluido", languages: "Este viaje en otros idiomas" },
  it: { home: "Home", duration: "Durata", stops: "Tappe", highlights: "Punti salienti", route: "Il percorso", dayByDay: "Giorno per giorno", day: (n) => `Giorno ${n}`, included: "Cosa include il viaggio", excluded: "Non incluso", languages: "Questo viaggio in altre lingue" },
  zh: { home: "首页", duration: "行程天数", stops: "站点", highlights: "行程亮点", route: "路线", dayByDay: "每日行程", day: (n) => `第${n}天`, included: "行程包含", excluded: "不包含", languages: "其他语言版本" },
};

const money = (n: number) => `€${Math.round(n)}`;

/** Links to the place pages for a trip's stops (stops without a page stay plain text). */
function stopsList(trip: LocalizedTrip) {
  return `<ol>${trip.stops
    .map((s) => {
      const id = placeIdForStop(s.name);
      return `<li>${id ? link(placePath(id), s.name) : esc(s.name)}</li>`;
    })
    .join("")}</ol>`;
}

export async function buildPages(): Promise<{ pages: BuiltPage[]; redirects: string[] }> {
  const trips = await loadLocalizedTrips("en");
  const media = await loadLegacyMedia();
  const places = buildPlaceIndex(getTrips());
  const pages: BuiltPage[] = [];

  const firstPhoto = (slug: string) => {
    const days = media[slug]?.days ?? {};
    const p = days["day1"]?.[0] ?? Object.values(days)[0]?.[0];
    return p ? tripImage(p, 1200) : undefined;
  };

  // ---- Trips list and each trip, once per language. English lives at /trips/..., the others at /fr/trips/...
  // (see routes.ts). Every version is its own page with its own title, text and hreflang links to the rest.
  for (const { code: lang } of LANGUAGES) {
    const L = T_LABELS[lang];
    const ui = UI[lang];
    const localized = lang === "en" ? trips : await loadLocalizedTrips(lang);
    const versions = (pathFor: (l: Lang) => string) =>
      `<nav aria-label="${esc(L.languages)}"><ul>${LANGUAGES.map((o) => `<li><a href="${esc(pathFor(o.code))}" hreflang="${esc(o.htmlLang)}" lang="${esc(o.htmlLang)}">${esc(o.native)}</a></li>`).join("")}</ul></nav>`;
    const seoList = tripsSeo(lang);

    // ---- Home and About in this language (words from src/i18n/site/<lang>.ts, the same text the pages show)
    const site = SITE[lang];
    const joint = (x: string, y: string) => (lang === "zh" ? `${x}${y}` : `${x} ${y}`);
    const langNav = (pathFor: (l: Lang) => string, label: string) =>
      `<nav aria-label="${esc(label)}"><ul>${LANGUAGES.map((o) => `<li><a href="${esc(pathFor(o.code))}" hreflang="${esc(o.htmlLang)}" lang="${esc(o.htmlLang)}">${esc(o.native)}</a></li>`).join("")}</ul></nav>`;
    const categoryIds = ["trip", "excursion", "trekking", null] as const;
    pages.push({
      path: homePath(lang),
      seo: homeSeo(lang),
      body: `<main>
<h1>${esc(`${site.hero.pre}${site.hero.em}${site.hero.post}`.trim())}</h1>
<p>${esc(site.hero.lede)}</p>
<h2>${esc(joint(site.categories.h2a, site.categories.h2b))}</h2>
<ul>${site.categories.cards
        .map((c, i) => `<li>${categoryIds[i] ? link(`${tripsPath(lang)}?category=${categoryIds[i]}`, c.name) : esc(c.name)}: ${esc(c.blurb)}</li>`)
        .join("")}</ul>
<h2>${esc(joint(site.featured.h2a, site.featured.h2b))}</h2>
<p>${esc(site.featured.lead)}</p>
<ul>${localized.map((t) => `<li>${link(tripPath(t.slug, lang), t.title.trim())}: ${esc(t.summary)}</li>`).join("")}</ul>
<p>${link(tripsPath(lang), site.featured.viewAll)}</p>
<h2>${esc(joint(site.destinations.h2a, site.destinations.h2b))}</h2>
${site.destinations.items.map((d) => `<h3>${esc(d.title)}</h3><p>${esc(d.tag)} (${esc(d.location)})</p><p>${esc(d.description)}</p>`).join("")}
<h2>${esc(site.process.eyebrow)}</h2>
<p>${esc(joint(site.process.h2a, site.process.h2b))}</p>
${site.process.steps.map((st) => `<h3>${esc(st.t)}</h3><p>${esc(st.d)}</p>`).join("")}
<h2>${esc(joint(site.homeAbout.h2a, site.homeAbout.h2b))}</h2>
<p>${esc(site.about.intro)}</p>
<ul>${[["300m", 0], ["40km", 1], ["100%", 2], ["1", 3]].map(([n, i]) => `<li>${esc(String(n))} ${esc(site.about.stats[i as 0 | 1 | 2 | 3])}</li>`).join("")}</ul>
<p>${link(aboutPath(lang), site.homeAbout.ourStory)} · ${link(CONTACT_PATH, site.homeAbout.planTrip)}</p>
<h2>${esc(joint(site.articles.h2a, site.articles.h2b))}</h2>
<ul>${[1, 2].map((id, i) => `<li>${link(articlePath(id), site.articles.items[i]!.title)}</li>`).join("")}</ul>
<h2>${esc(joint(site.cta.h2a, site.cta.h2b))}</h2>
<p>${esc(site.cta.copy)}</p>
${langNav((l) => homePath(l), LANGUAGES.find((l) => l.code === lang)!.native)}
</main>`,
    });

    const about = aboutContent(lang);
    pages.push({
      path: aboutPath(lang),
      seo: aboutSeo(lang),
      body: `<main>${crumbs([{ name: site.meta.home, href: homePath(lang) }, { name: site.homeAbout.eyebrow }])}
<h1>${esc(joint(site.about.h1a, site.about.h1b))}</h1><p>${esc(about.ABOUT_INTRO)}</p>
<h2>${esc(about.OWNER.name)}: ${esc(about.OWNER.role)}</h2>${about.OWNER.bio.map((b) => `<p>${esc(b)}</p>`).join("")}
<h2>${esc(site.about.valuesTitle)}</h2><ul>${about.VALUES.map((v) => `<li><strong>${esc(v.title)}</strong>: ${esc(v.text)}</li>`).join("")}</ul>
<h2>${esc(site.about.sustainTitle)}</h2><ul>${about.SUSTAINABILITY.map((x) => `<li><strong>${esc(x.title)}</strong>: ${esc(x.text)}</li>`).join("")}</ul>
<h2>${esc(site.about.faqEyebrow)}</h2>${about.FAQ.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join("")}
${langNav((l) => aboutPath(l), LANGUAGES.find((l) => l.code === lang)!.native)}
</main>`,
    });

    pages.push({
      path: tripsPath(lang),
      seo: seoList,
      body: `<main>${crumbs([{ name: L.home, href: "/" }, { name: ui.navTrips }])}
<h1>${esc(ui.heading)}</h1>
<p>${esc(seoList.description)}</p>
<ul>${localized
        .map(
          (t) =>
            `<li><h2>${link(tripPath(t.slug, lang), t.title.trim())}</h2><p>${esc(t.summary)}</p><p>${esc(ui.days(t.durationDays))} · ${esc(ui.departsFrom)} ${esc(t.departureLabel)} · ${esc(ui.from)} ${money(t.fromPrice)} ${esc(ui.perPerson)}</p></li>`,
        )
        .join("")}</ul>
${versions((l) => tripsPath(l))}
</main>`,
    });

    for (const t of localized) {
      const keyStops = t.keyStops.length ? `<h2>${esc(L.highlights)}</h2><ul>${t.keyStops.map((k) => `<li>${esc(k)}</li>`).join("")}</ul>` : "";
      const days = t.itinerary
        .map(
          (d) =>
            `<section><h3>${esc(L.day(d.day))}${d.route ? `: ${esc(tidyRoute(d.route))}` : ""}</h3>${para(d.text)}</section>`,
        )
        .join("");
      const list = (title: string, items?: string[] | undefined) =>
        items?.length ? `<h2>${esc(title)}</h2><ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>` : "";
      pages.push({
        path: tripPath(t.slug, lang),
        seo: tripSeo(t, tripShareImage(t.slug, firstPhoto(t.slug))),
        body: `<main>${crumbs([{ name: L.home, href: "/" }, { name: ui.navTrips, href: tripsPath(lang) }, { name: t.title.trim() }])}
<h1>${esc(t.title.trim())}</h1>
<p>${esc(t.summary)}</p>
<dl><dt>${esc(L.duration)}</dt><dd>${esc(ui.days(t.durationDays))}</dd><dt>${esc(ui.departsFrom)}</dt><dd>${esc(t.departureLabel)}</dd><dt>${esc(L.stops)}</dt><dd>${t.stops.length}</dd><dt>${esc(ui.from)}</dt><dd>${money(t.fromPrice)} ${esc(ui.perPerson)}</dd></dl>
${keyStops}
<h2>${esc(L.route)}</h2>${stopsList(t)}
<h2>${esc(L.dayByDay)}</h2>${days}
${list(L.included, t.included)}${list(L.excluded, t.excluded)}
${versions((l) => tripPath(t.slug, l))}
</main>`,
      });
    }
  }

  // ---- Each place
  for (const f of places.values()) {
    const visiting = trips.filter((t) => f.tripSlugs.includes(t.slug));
    // The same photo choice the page makes: the first photo of a day that visits the place.
    let image: string | undefined;
    for (const t of visiting) {
      const stopIdx = t.stops.findIndex((s) => placeIdForStop(s.name) === f.id);
      for (const [i, d] of t.itinerary.entries()) {
        const pos = t.itinerary.length > 1 ? i / (t.itinerary.length - 1) : 0;
        if (stopIdx < 0 || !stopsForDay(t.stops, d.route, d.text, pos).includes(stopIdx)) continue;
        const p = media[t.slug]?.days[`day${d.day}`]?.[0];
        if (p) {
          image = tripImage(p, 1200);
          break;
        }
      }
      if (image) break;
    }
    // The place's own hero photo wins for the share image.
    const own = placeHero(f.id);
    if (own) image = absUrl(own);
    const p = f.place;
    const titles = ["Why stop here", "What to see", "The story", "Best moment", "Good to know"];
    pages.push({
      path: placePath(f.id),
      seo: placeSeo(f, image),
      body: `<main>${crumbs([{ name: "Home", href: "/" }, { name: "Trips", href: TRIPS_PATH }, { name: p.name }])}
<h1>${esc(p.name)}</h1>
<p>${esc(p.kind)} · ${esc(p.region)}</p>
<p>${esc(p.brief)}</p>
<dl><dt>Type</dt><dd>${esc(p.kind)}</dd><dt>Region</dt><dd>${esc(p.region)}</dd><dt>From Marrakech</dt><dd>${f.kmFromMarrakech === 0 ? "Start and finish of our journeys" : `about ${f.kmFromMarrakech} km as the crow flies`}</dd><dt>Best time</dt><dd>${esc(p.bestTime)}</dd><dt>Coordinates</dt><dd>${f.lat}, ${f.lng}</dd></dl>
<h2>Insights</h2>${p.insights.map((text, i) => `<h3>${titles[i]}</h3><p>${esc(text)}</p>`).join("")}
<h2>On these journeys</h2><ul>${visiting.map((t) => `<li>${link(tripPath(t.slug), t.title.trim())}: ${esc(t.summary)}</li>`).join("")}</ul>
</main>`,
    });
  }

  // ---- Contact (in every language)
  for (const { code: lang } of LANGUAGES) {
    const cp = PAGES[lang].contact;
    const path = contactPath(lang);
    pages.push({
      path,
      seo: contactSeo(lang),
      body: `<main>${crumbs([{ name: HOME_NAME[lang], href: homePath(lang) }, { name: cp.name }])}
<h1>${esc(cp.name)}</h1><p>${esc(cp.seoDescription)}</p>
<ul><li>WhatsApp: <a href="${esc(whatsappBase)}">${esc(CONTACT.phoneDisplay)}</a></li><li>Email: <a href="mailto:${esc(CONTACT.email)}">${esc(CONTACT.email)}</a></li><li>${link(CONTACT.instagram, "Instagram")}</li><li>${link(CONTACT.facebook, "Facebook")}</li><li>Location: ${esc(CONTACT.location)}</li></ul>
<h2>${esc(cp.howTitle)}</h2><ol>${cp.steps.map((st) => `<li><strong>${esc(st.title)}</strong>: ${esc(st.text)}</li>`).join("")}</ol>
${versions((l) => contactPath(l))}
</main>`,
    });
  }

  // ---- Gallery (in every language)
  for (const { code: lang } of LANGUAGES) {
    const gp = PAGES[lang].gallery;
    const path = galleryPath(lang);
    const localized = lang === "en" ? trips : await loadLocalizedTrips(lang);
    pages.push({
      path,
      seo: gallerySeo(lang),
      body: `<main>${crumbs([{ name: HOME_NAME[lang], href: homePath(lang) }, { name: gp.name }])}
<h1>${esc(gp.name)}</h1><p>${esc(gp.seoDescription)}</p>
<ul>${localized.map((t) => `<li>${link(tripPath(t.slug, lang), t.title.trim())}</li>`).join("")}</ul>
${versions((l) => galleryPath(l))}
</main>`,
    });
  }

  // ---- Brochures
  pages.push({
    path: BROCHURES_PATH,
    seo: brochuresSeo(),
    body: `<main>${crumbs([{ name: "Home", href: "/" }, { name: "Brochures" }])}
<h1>Sahara travel brochures</h1><p>${esc(brochuresSeo().description)}</p>
<ul>${BROCHURES.map((b) => `<li>${link(`/brochures/${b.slug}`, b.langs.en?.title ?? b.slug)} (PDF): ${LANGUAGES.filter((l) => b.langs[l.code]).map((l) => link(`/brochures/${b.slug}-${l.code}.pdf`, l.native)).join(" · ")}</li>`).join("")}</ul>
</main>`,
  });

  // One page per brochure and language, carrying the guide's full text (from brochures/content) so search
  // engines and AI assistants can read, index and quote it. /brochures/<slug> alone points at the English page.
  for (const b of BROCHURES) {
    const en = b.langs.en!;
    pages.push({
      path: `/brochures/${b.slug}`,
      seo: brochureReaderSeo(b.slug),
      body: `<main>${crumbs([{ name: "Home", href: "/" }, { name: "Brochures", href: BROCHURES_PATH }, { name: en.title }])}
<h1>${esc(en.title)}</h1><p>${esc(en.subtitle)}</p>
<ul>${LANGUAGES.filter((l) => b.langs[l.code]).map((l) => `<li>${link(brochureLangPath(b.slug, l.code), `${b.langs[l.code]!.title} (${l.native})`)}</li>`).join("")}</ul>
</main>`,
    });
    for (const l of LANGUAGES) {
      const info = b.langs[l.code];
      if (!info) continue;
      const doc = BROCHURE_CONTENT[`${b.slug}.${l.code}`];
      pages.push({
        path: brochureLangPath(b.slug, l.code),
        seo: brochureReaderSeo(b.slug, l.code),
        body: `<main>${crumbs([{ name: "Home", href: "/" }, { name: "Brochures", href: BROCHURES_PATH }, { name: info.title }])}
<h1>${esc(info.title)}</h1><p>${esc(info.kicker)}. ${esc(info.subtitle)}</p>
<p>${link(brochurePdf(b.slug, l.code), `${info.title} (PDF, ${info.pages} p., ${info.mb} MB)`)}</p>
<p>${LANGUAGES.filter((o) => o.code !== l.code && b.langs[o.code]).map((o) => link(brochureLangPath(b.slug, o.code), o.native)).join(" · ")}</p>
${doc ? brochureText(doc) : ""}
</main>`,
      });
    }
  }

  // ---- Blog (in every language)
  for (const { code: lang } of LANGUAGES) {
    const bp = PAGES[lang].blog;
    const path = blogPath(lang);
    const articles = localizedArticles(lang);
    pages.push({
      path,
      seo: blogSeo(lang),
      body: `<main>${crumbs([{ name: HOME_NAME[lang], href: homePath(lang) }, { name: bp.crumb }])}
<h1>${esc(bp.name)}</h1><p>${esc(bp.seoDescription)}</p>
<ul>${articles.map((a) => `<li>${link(articlePath(a.id, lang), a.title.replace(/\s*\n\s*/g, " "))}</li>`).join("")}</ul>
${versions((l) => blogPath(l))}
</main>`,
    });

    for (const a of articles) {
      const title = a.title.replace(/\s*\n\s*/g, " ");
      pages.push({
        path: articlePath(a.id, lang),
        seo: articleSeo(a, lang),
        body: `<main>${crumbs([{ name: HOME_NAME[lang], href: homePath(lang) }, { name: bp.crumb, href: blogPath(lang) }, { name: title }])}
<article><h1>${esc(title)}</h1><p>${esc(a.category)} · by ${esc(a.author)}</p><p>${esc(a.lead)}</p>
${a.sections.map((sec) => `${sec.heading ? `<h2>${esc(sec.heading)}</h2>` : ""}${sec.paragraphs.map((x) => `<p>${esc(x)}</p>`).join("")}`).join("")}
</article>
${versions((l) => articlePath(a.id, l))}
</main>`,
      });
    }
  }

  // ---- Redirects from the previous site (loverofsahara.tours, a Next.js app with /<locale>/... URLs).
  // Written to dist/_redirects (Cloudflare Pages), so they never touch the app or its UI.
  const redirects = legacyRedirects(getTrips().map((t) => ({ legacyId: t.legacyId, slug: t.slug })));

  return { pages, redirects };
}

/**
 * Every URL the previous site answered, mapped to its closest page here.
 * Old site: English had no prefix, the other five languages did (/fr/trips/5); trips lived at
 * /trips/<n>, /excursions/<n>, /trekkings/<n> (also /trekking/<n>), and each departure city had a list page.
 * Language prefixes are dropped: trips are English only for now (brochures keep their own /<slug>/<lang>).
 */
function legacyRedirects(trips: { legacyId: number; slug: string }[]): string[] {
  const prefixes = ["", "/fr", "/de", "/it", "/es", "/zh"];
  const out: string[] = [];
  const rule = (from: string, to: string) => {
    if (from !== to) out.push(`${from}  ${to}  301`); // never redirect a page to itself
  };

  // Static, 1:1 pages: the old language prefix alone goes to the home page.
  for (const px of prefixes) {
    // /fr and /fr/about are real pages now (the home page and About in French), so they are never redirect sources.
    // /fr/trips is a real page now (the trips list in French), so it is never a redirect source.
    const toTrips = tripsPath((px.slice(1) || "en") as Lang);
    for (const [from, to] of [
      ["/excursions", toTrips],
      ["/trekkings", toTrips],
      ["/trekking", toTrips],
      ["/yogas", toTrips],
      ["/yoga", toTrips],
      ["/search", toTrips],
      ["/fez", toTrips],
      ["/login", "/"],
      ...(px ? ([["/brochures", BROCHURES_PATH]] as const) : []),
    ] as const) {
      rule(px + from, to);
    }
    // Departure-city pages -> the place page for that city.
    for (const [from, to] of [
      ["/zagora", placePath("zagora")],
      ["/marrakech", placePath("marrakech")],
      ["/agadir", placePath("agadir")],
      ["/ouarzazate", placePath("ouarzazate")],
      ["/mhamid-el-ghizlane", placePath("mhamid")],
    ] as const) {
      rule(px + from, to);
    }
  }

  // Numeric trip pages: /trips/5, /excursions/4, /trekkings/6 (and /trekking/6), with or without a language.
  for (const px of prefixes) {
    for (const t of trips) {
      for (const sec of ["trips", "excursions", "trekkings", "trekking"]) {
        rule(`${px}/${sec}/${t.legacyId}`, tripPath(t.slug, (px.slice(1) || "en") as Lang));
      }
    }
  }

  // Anything else under an old section lands on the closest list (splats: Cloudflare allows 100 of these).
  for (const px of prefixes) {
    for (const [from, to] of [
      ["/yogas/*", tripsPath((px.slice(1) || "en") as Lang)],
      ["/yoga/*", tripsPath((px.slice(1) || "en") as Lang)],
      ["/fez/*", tripsPath((px.slice(1) || "en") as Lang)],
      ["/article/*", BLOG_PATH], // old articles had text ids; the blog now has different articles
    ] as const) {
      rule(px + from, to);
    }
    for (const city of ["zagora", "marrakech", "agadir", "ouarzazate", "mhamid-el-ghizlane"]) {
      rule(`${px}/${city}/*`, tripsPath((px.slice(1) || "en") as Lang)); // a city's trip detail page -> all trips
    }
  }
  return [...new Set(out)];
}
