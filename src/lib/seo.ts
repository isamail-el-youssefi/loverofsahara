import { useEffect } from "react";
import { SITE_NAME, SITE_URL } from "./routes";
import { absUrl, type PageSeo } from "./seoData";

/** Finds or creates a <meta>/<link> in <head> by a selector, then sets an attribute. */
function upsert(tag: "meta" | "link", selector: string, attrs: Record<string, string>) {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = document.createElement(tag);
    document.head.appendChild(el);
  }
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
}

const meta = (name: string, content: string) => upsert("meta", `meta[name="${name}"]`, { name, content });
const prop = (property: string, content: string) =>
  upsert("meta", `meta[property="${property}"]`, { property, content });

/**
 * Keeps the document head in step with the page on screen: title, description, canonical link, Open Graph /
 * Twitter tags and the JSON-LD block. (Crawlers that do not run JavaScript get the same tags from the
 * prerendered HTML; this keeps tabs, history and JS-running crawlers correct as people navigate.)
 */
export function applySeo(seo: PageSeo) {
  const url = absUrl(seo.canonical ?? seo.path);
  document.title = seo.title;
  meta("description", seo.description);
  upsert("link", 'link[rel="canonical"]', { rel: "canonical", href: url });
  document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((l) => l.remove());
  for (const alt of seo.alternates ?? []) {
    const l = document.createElement("link");
    l.rel = "alternate";
    l.hreflang = alt.hreflang;
    l.href = absUrl(alt.path);
    document.head.appendChild(l);
  }

  prop("og:site_name", SITE_NAME);
  prop("og:type", seo.type);
  prop("og:title", seo.title);
  prop("og:description", seo.description);
  prop("og:url", url);
  meta("twitter:card", seo.image ? "summary_large_image" : "summary");
  meta("twitter:title", seo.title);
  meta("twitter:description", seo.description);
  if (seo.image) {
    prop("og:image", seo.image);
    meta("twitter:image", seo.image);
  } else {
    document.head.querySelector('meta[property="og:image"]')?.remove();
    document.head.querySelector('meta[name="twitter:image"]')?.remove();
  }

  // Replace any JSON-LD (prerendered or from the previous page) with this page's.
  document.head.querySelectorAll('script[type="application/ld+json"]').forEach((s) => s.remove());
  for (const block of seo.jsonLd) {
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(block);
    document.head.appendChild(s);
  }
}

/** Call from a page with its SEO (or undefined while the page's data is still loading). */
export function usePageSeo(seo: PageSeo | undefined) {
  // JSON is a stable dependency: the object is rebuilt on every render.
  const key = seo ? JSON.stringify([seo.title, seo.description, seo.path, seo.image]) : "";
  useEffect(() => {
    if (seo) applySeo(seo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}

export { SITE_URL };
