"""Cover thumbnails + metadata for the /brochures page of the site.

usage: python brochures/tools/make-site-assets.py

Reads every public/brochures/<slug>-<lang>.pdf, renders page 1 to public/brochures/covers/<slug>-<lang>.jpg
(640 px wide) and writes src/data/brochures.json with, per brochure and language, the title, the kicker,
the number of pages and the file size. Run it again after rebuilding the PDFs.
"""
import json, os, sys
import fitz  # PyMuPDF

root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
pdf_dir = os.path.join(root, "public", "brochures")
cover_dir = os.path.join(pdf_dir, "covers")
content = os.path.join(root, "brochures", "content")
os.makedirs(cover_dir, exist_ok=True)

LANGS = ["en", "fr", "de", "es", "it", "zh"]
# slug, group, order. "region" = the five provincial guides, "theme" = the thematic guides.
BROCHURES = [
    ("general-guide", "theme"),
    ("zagora", "region"),
    ("tinghir", "region"),
    ("errachidia", "region"),
    ("ouarzazate", "region"),
    ("midelt", "region"),
    ("natural-guide", "theme"),
    ("local-gastronomy", "theme"),
    ("erg-chegaga", "theme"),
]

out = []
for slug, group in BROCHURES:
    entry = {"slug": slug, "group": group, "langs": {}}
    for lang in LANGS:
        pdf = os.path.join(pdf_dir, f"{slug}-{lang}.pdf")
        if not os.path.exists(pdf):
            continue
        doc = fitz.open(pdf)
        page = doc[0]
        zoom = 640 / page.rect.width
        pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=False)
        pix.save(os.path.join(cover_dir, f"{slug}-{lang}.jpg"), jpg_quality=80)
        j = json.load(open(os.path.join(content, f"{slug}.{lang}.json"), encoding="utf8"))
        entry["langs"][lang] = {
            "title": j["title"],
            "kicker": j.get("kicker", ""),
            "subtitle": j.get("subtitle", ""),
            "pages": len(doc),
            "mb": round(os.path.getsize(pdf) / 1_048_576, 1),
        }
        doc.close()
    out.append(entry)
    print(slug, sorted(entry["langs"]))

target = os.path.join(root, "src", "data", "brochures.json")
with open(target, "w", encoding="utf8") as f:
    json.dump(out, f, ensure_ascii=False, indent=1)
print("wrote", target)
