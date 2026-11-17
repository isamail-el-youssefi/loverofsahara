"""
Checks that every title, lead and body in brochures/content/<slug>.<lang>.json is present in the built PDF.

  python brochures/tools/check-text.py <slug> <lang>

Differences in capitalisation of the big two-tone page titles are expected; line breaks at hyphens are ignored.
"""
import json, re, sys, pymupdf

slug, lang = sys.argv[1], sys.argv[2]
c = json.load(open(f"brochures/content/{slug}.{lang}.json", encoding="utf-8"))
d = pymupdf.open(f"public/brochures/{slug}-{lang}.pdf")
norm = lambda s: re.sub(r"\s+", " ", s.replace("­", "")).replace("- ", "-").strip()
pdf = norm(" ".join(p.get_text() for p in d))
missing = checked = 0

def check(label, text):
    global missing, checked
    checked += 1
    if norm(text) in pdf:
        return
    words = norm(text).split(" ")
    for i in range(0, len(words), 6):
        w = " ".join(words[i:i + 6])
        if w not in pdf:
            print("MISSING in", label, "->", w)
            missing += 1
            return

for k, v in c["items"].items():
    if isinstance(v, str):
        check(k, v)
    elif "body" in v:
        check(k + " (title)", v["title"])
        check(k, v["body"])
        if "lead" in v:
            check(k + " lead", v["lead"])
print(f"{slug}-{lang}: checked {checked} texts, missing {missing}, pages {len(d)}")
