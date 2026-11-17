# Brochures

Re-designed versions of the regional tourism guides that the old site linked to (publisher: Visit Drâa Tafilalet, used with their permission). Same content, the new site's look.

```
npm run brochures:build -- <slug> <lang>      # e.g. npm run brochures:build -- tinghir en
node brochures/build.mjs <slug> <lang>
python brochures/tools/check-text.py <slug> <lang>   # every title/lead/body must be in the PDF
```

Output: `public/brochures/<slug>-<lang>.pdf` (served by the site as `/brochures/<slug>-<lang>.pdf`).

| Folder | What it holds |
|---|---|
| `content/<slug>.<lang>.json` | the transcribed text (`items`) and the page plan (`pages`), see below |
| `content/_credit.en.json` | the shared credit page text (needs `creditSubject` in the brochure JSON) |
| `assets/photos/` | the owner's sharp ImageKit photos (heroes) |
| `assets/brand/sticker.svg` | the Lover of Sahara sticker (cover and last page only) |
| `assets/<slug>/` | photos for that brochure: cropped from the original PDF (`tools/extract-crops.py`, `tools/extract-polaroids.py`) and/or downloaded from the Drive photo library (`tools/drive-photos.py`, then `tools/optimize-images.py`) |
| `build.mjs` | page types, CSS (A4, F37 Wicklow + PP Neue Montreal, Amber Walnut colours) and the Chrome print-to-PDF step |
| `dist/` | generated HTML (git-ignored) |

## Page types (the `pages` array of each brochure JSON)

`cover`, `contents`, `intro` (photo band + title + lead + two columns), `opener-band` (tall photo band with the title on it), `items` (manual columns), `items-auto` (long item lists, paginated automatically by measuring text height in Chrome), `text-band`, `opener-type` (big number opener), `dark-full` (full-bleed photo with numbered stages), `info` (useful information + emergency numbers; `noEmerg` hides the card), `info-more` (second info page with the card), `back`. Pages with `startsSection: N` feed the page numbers of the contents page. Zagora (`zagora.en.json`) is the reference: its inside pages are pixel-identical to the approved design, so keep it that way when changing the CSS.

## Status

- Done: `zagora` (en, 14 pages), `tinghir` (en, 13), `errachidia` (en, 13), `midelt` (en, 12) `ouarzazate` (en, 12) and `general-guide` (en, 32 pages, awaiting review); the last four use photos from the Drive library.
- To do (English first): local-gastronomy, natural-guide (next, one at a time), live-local. Then fr and es, then the `/brochures` page on the site.

Original PDFs: `https://www.visitdraatafilalet.com/assets/docs/<folder>/guide-...-<lang>.pdf` (every URL is in the old site's `app/[locale]/brochures/page.tsx`).

## How to add one

1. Download the original into an empty temp folder. These PDFs have **no text layer**: every page is one image, so read the rendered pages (PyMuPDF: `pymupdf.open(...)[i].get_pixmap(dpi=130)`) and transcribe word for word. Only fix obvious typos and say so.
2. Write `content/<slug>.<lang>.json`.
3. Crop clean rectangular photos with `tools/extract-crops.py <slug> <pdf> <out>` (crop boxes are in a 2150 px wide view of each spread; double-check each spread's page number) and the tilted polaroids with `tools/extract-polaroids.py <pdf> <page> <out>` (levels them; a few with white skies are not detected).
4. Write the `pages` plan in the JSON, reusing the page types above (see `tinghir.en.json`).
5. Build, look at every page as an image, and run `check-text.py`.

## Photo library (Google Drive)

The publisher's photo library "Photos Draa-Tafilalet" is public: https://drive.google.com/drive/folders/1hRA55QrzH52ysberIgnvs4ONG3Dktczd with one folder per region (ids: 1- ZAGORA-MHAMID `1PuXCZTvc_b_I3UrKnjCRj1l5bzfZ10Sr`, 2-TINGHIR `1WFU0s-ju5RuUFwLmPc8ibZ6p6D76Xc4L`, 3-MIDELT `1ktKBxqIH9iHJhf05jPvbMzziR1JYPkvZ`, 4-ER-RACHIDIA `1-yI92LnH-5GPvBcROoQxZu7x7Gm1N3i6` (sub-folders Arfoud, Merzouga, Rachidia, Rissani), 5-OUARZAZATE `1m1mXyQkTPGanUf_BkJxb1zOveIB8VciW`). Files are named by camera number, so make a contact sheet of the previews (`tools/drive-photos.py thumbs`), choose by eye, download the chosen ones at 2400 px (`get`), name them descriptively and run `tools/optimize-images.py <folder> 1600 78` (a 13 MB PDF becomes 5 MB). Keep each PDF under about 6 MB.

Tips from Midelt: a Drive thumbnail download can come back truncated (grey block at the bottom); check the bottom 10% of each photo and re-download with a smaller size if it is flat. If the last page of an `items-auto` list holds only one or two items, remove one figure to pull them back. The back page shows www.loverofsahara.tours (the same domain as the sticker).


Long thematic guides (general-guide, 46 source pages): the content JSON is assembled from `content/_parts/*.json` (item texts) by a small merge script that also holds the page plan. Make the PDF smaller with `python brochures/tools/make-lite-assets.py` then `LITE=1 node brochures/build.mjs <slug> <lang>` (photos 1200 px, covers untouched; about 6 MB). Do NOT post-process the PDF with PyMuPDF `rewrite_images`: it drops the pattern resources and the sticker and shades turn white. Item bodies may contain `

` (rendered as a blank line).
