import type { PDFDocumentProxy } from "pdfjs-dist";

/** A4 page ratio (width / height). */
export const PAGE_RATIO = 210 / 297;

let lib: Promise<typeof import("pdfjs-dist")> | null = null;

/** pdf.js is loaded on demand, so it only costs anything when someone opens a reader. */
function loadLib() {
  lib ??= Promise.all([import("pdfjs-dist"), import("pdfjs-dist/build/pdf.worker.min.mjs?url")]).then(([pdfjs, worker]) => {
    pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
    return pdfjs;
  });
  return lib;
}

export async function openPdf(url: string): Promise<PDFDocumentProxy> {
  const pdfjs = await loadLib();
  return pdfjs.getDocument({ url, disableRange: true, disableStream: true }).promise;
}

/* Rendered pages are kept in a small cache so a page shown twice (static + turning leaf) renders once. */
const cache = new Map<string, Promise<HTMLCanvasElement>>();
const MAX_CACHED = 14;

/** Render page `n` of `doc` to an offscreen canvas `cssWidth` CSS pixels wide (times the device pixel ratio). */
export function renderPage(doc: PDFDocumentProxy, id: string, n: number, cssWidth: number): Promise<HTMLCanvasElement> {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const px = Math.round(cssWidth * dpr);
  const key = `${id}#${n}#${px}`;
  const hit = cache.get(key);
  if (hit) {
    cache.delete(key);
    cache.set(key, hit); // mark as recently used
    return hit;
  }
  const job = (async () => {
    const page = await doc.getPage(n);
    const base = page.getViewport({ scale: 1 });
    const viewport = page.getViewport({ scale: px / base.width });
    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    await page.render({ canvas, viewport }).promise;
    return canvas;
  })();
  cache.set(key, job);
  job.catch(() => cache.delete(key));
  while (cache.size > MAX_CACHED) cache.delete(cache.keys().next().value as string);
  return job;
}
