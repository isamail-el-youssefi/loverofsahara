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
import { ABOUT_INTRO, FAQ, OWNER, SUSTAINABILITY, VALUES } from "@/components/about/content";
import { CONTACT, STEPS, whatsappBase } from "@/components/contact/data";
import { ABOUT_PATH, BLOG_PATH, CONTACT_PATH, TRIPS_PATH, articlePath, placePath, tripPath } from "@/lib/routes";
import { absUrl, aboutSeo, articleSeo, blogSeo, contactSeo, homeSeo, placeSeo, tripSeo, tripShareImage, tripsSeo, type PageSeo } from "@/lib/seoData";

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

const crumbs = (items: { name: string; href?: string }[]) =>
  `<nav aria-label="Breadcrumb">${items.map((i) => (i.href ? link(i.href, i.name) : esc(i.name))).join(" / ")}</nav>`;

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

  // ---- Home
  pages.push({
    path: "/",
    seo: homeSeo(),
    body: `<main>
<h1>Lover of Sahara: Sahara desert expeditions from Zagora, Marrakech and Agadir</h1>
<p>${esc(homeSeo().description)}</p>
<h2>Trips</h2>
<ul>${trips.map((t) => `<li>${link(tripPath(t.slug), t.title.trim())}: ${esc(t.summary)}</li>`).join("")}</ul>
<h2>Places we visit</h2>
<ul>${[...places.values()]
      .sort((a, b) => a.place.name.localeCompare(b.place.name))
      .map((f) => `<li>${link(placePath(f.id), f.place.name)}</li>`)
      .join("")}</ul>
<h2>Sahara stories</h2>
<ul>${blogArticles.map((a) => `<li>${link(articlePath(a.id), a.title.replace(/\s*\n\s*/g, " "))}</li>`).join("")}</ul>
</main>`,
  });

  // ---- Trips list
  pages.push({
    path: TRIPS_PATH,
    seo: tripsSeo(),
    body: `<main>${crumbs([{ name: "Home", href: "/" }, { name: "Trips" }])}
<h1>Sahara and Morocco desert tours</h1>
<p>${esc(tripsSeo().description)}</p>
<ul>${trips
      .map(
        (t) =>
          `<li><h2>${link(tripPath(t.slug), t.title.trim())}</h2><p>${esc(t.summary)}</p><p>${t.durationDays} days from ${esc(t.departureLabel)}, from ${money(t.fromPrice)} per person</p></li>`,
      )
      .join("")}</ul>
</main>`,
  });

  // ---- Each trip
  for (const t of trips) {
    const keyStops = t.keyStops.length ? `<h2>Highlights</h2><ul>${t.keyStops.map((k) => `<li>${esc(k)}</li>`).join("")}</ul>` : "";
    const days = t.itinerary
      .map(
        (d) =>
          `<section><h3>Day ${d.day}${d.route ? `: ${esc(tidyRoute(d.route))}` : ""}</h3>${para(d.text)}</section>`,
      )
      .join("");
    const list = (title: string, items?: string[] | undefined) =>
      items?.length ? `<h2>${title}</h2><ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>` : "";
    pages.push({
      path: tripPath(t.slug),
      seo: tripSeo(t, tripShareImage(t.slug, firstPhoto(t.slug))),
      body: `<main>${crumbs([{ name: "Home", href: "/" }, { name: "Trips", href: TRIPS_PATH }, { name: t.title.trim() }])}
<h1>${esc(t.title.trim())}</h1>
<p>${esc(t.summary)}</p>
<dl><dt>Duration</dt><dd>${t.durationDays} days</dd><dt>Departs from</dt><dd>${esc(t.departureLabel)}</dd><dt>Stops</dt><dd>${t.stops.length}</dd><dt>From</dt><dd>${money(t.fromPrice)} per person</dd></dl>
${keyStops}
<h2>The route</h2>${stopsList(t)}
<h2>Day by day</h2>${days}
${list("What your trip includes", t.included)}${list("Not included", t.excluded)}
</main>`,
    });
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

  // ---- About
  pages.push({
    path: ABOUT_PATH,
    seo: aboutSeo(),
    body: `<main>${crumbs([{ name: "Home", href: "/" }, { name: "About" }])}
<h1>About Lover of Sahara</h1><p>${esc(ABOUT_INTRO)}</p>
<h2>${esc(OWNER.name)}: ${esc(OWNER.role)}</h2>${OWNER.bio.map((b) => `<p>${esc(b)}</p>`).join("")}
<h2>Our values</h2><ul>${VALUES.map((v) => `<li><strong>${esc(v.title)}</strong>: ${esc(v.text)}</li>`).join("")}</ul>
<h2>Sustainability</h2><ul>${SUSTAINABILITY.map((s) => `<li><strong>${esc(s.title)}</strong>: ${esc(s.text)}</li>`).join("")}</ul>
<h2>Frequently asked questions</h2>${FAQ.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join("")}
</main>`,
  });

  // ---- Contact
  pages.push({
    path: CONTACT_PATH,
    seo: contactSeo(),
    body: `<main>${crumbs([{ name: "Home", href: "/" }, { name: "Contact" }])}
<h1>Contact Lover of Sahara</h1><p>${esc(contactSeo().description)}</p>
<ul><li>WhatsApp: <a href="${esc(whatsappBase)}">${esc(CONTACT.phoneDisplay)}</a></li><li>Email: <a href="mailto:${esc(CONTACT.email)}">${esc(CONTACT.email)}</a></li><li>${link(CONTACT.instagram, "Instagram")}</li><li>${link(CONTACT.facebook, "Facebook")}</li><li>Location: ${esc(CONTACT.location)}</li></ul>
<h2>How it works</h2><ol>${STEPS.map((s) => `<li><strong>${esc(s.title)}</strong>: ${esc(s.text)}</li>`).join("")}</ol>
</main>`,
  });

  // ---- Blog
  pages.push({
    path: BLOG_PATH,
    seo: blogSeo(),
    body: `<main>${crumbs([{ name: "Home", href: "/" }, { name: "Sahara Stories" }])}
<h1>Sahara stories</h1><p>${esc(blogSeo().description)}</p>
<ul>${blogArticles.map((a) => `<li>${link(articlePath(a.id), a.title.replace(/\s*\n\s*/g, " "))}</li>`).join("")}</ul>
</main>`,
  });
  for (const a of blogArticles) {
    const title = a.title.replace(/\s*\n\s*/g, " ");
    pages.push({
      path: articlePath(a.id),
      seo: articleSeo(a),
      body: `<main>${crumbs([{ name: "Home", href: "/" }, { name: "Sahara Stories", href: BLOG_PATH }, { name: title }])}
<article><h1>${esc(title)}</h1><p>${esc(a.category)} · by ${esc(a.author)}</p><p>${esc(a.lead)}</p>
${a.sections.map((s) => `${s.heading ? `<h2>${esc(s.heading)}</h2>` : ""}${s.paragraphs.map((x) => `<p>${esc(x)}</p>`).join("")}`).join("")}
</article></main>`,
    });
  }

  // ---- Redirects from the previous site's numeric URLs (/trips/5, /excursions/4, /trekkings/6)
  const section = { trip: "trips", excursion: "excursions", trekking: "trekkings" } as const;
  const redirects = getTrips().map((t) => `/${section[t.category]}/${t.legacyId}  ${tripPath(t.slug)}  301`);

  return { pages, redirects };
}
