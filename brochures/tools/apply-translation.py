"""Create content/<slug>.<lang>.json from content/<slug>.en.json.

usage: python apply-translation.py <slug> <lang> <translations.py>

The translations file defines  SRC (list, EN strings in order, produced by
`--dump`) and TR (list, same length). Every string value of the EN JSON that
equals an SRC entry is replaced by the TR entry; everything else (ids, images,
numbers, phones, urls) is left untouched. Prints any string that was not
covered so nothing stays in English by accident.
usage dump: python apply-translation.py <slug> --dump <out.json>
"""
import json, sys, os, importlib.util

root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "content")
SKIP_KEYS = {"tel", "n", "type", "image", "pos", "img", "imgPos", "fig", "item", "info", "para", "slug", "lang",
             "website", "email", "lead", "sub", "stages", "startsSection", "num", "first", "wide", "h"}


def walk(o, f, key=None, path=()):
    if isinstance(o, dict):
        return {k: walk(v, f, k, path + (k,)) for k, v in o.items()}
    if isinstance(o, list):
        return [walk(v, f, key, path + (i,)) for i, v in enumerate(o)]
    if isinstance(o, str):
        return f(o, key, path)
    return o


def main():
    slug = sys.argv[1]
    en = json.load(open(os.path.join(root, f"{slug}.en.json"), encoding="utf8"))
    if sys.argv[2] == "--dump":
        out = []
        def collect(s, key, path):
            # in pages only translate display text
            if path and path[0] == "pages" and key not in ("eyebrow", "title", "line", "dim"):
                return s
            if key in SKIP_KEYS and path[0] != "items": return s
            if path[:1] == ("items",) and key in ("tel",): return s
            if s.startswith("www.") or "@" in s: return s
            if s not in out: out.append(s)
            return s
        walk(en, collect)
        json.dump(out, open(sys.argv[3], "w", encoding="utf8"), ensure_ascii=False, indent=0)
        print(len(out), "strings")
        return
    lang, tr_file = sys.argv[2], sys.argv[3]
    spec = importlib.util.spec_from_file_location("tr", tr_file)
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    assert len(m.SRC) == len(m.TR), (len(m.SRC), len(m.TR))
    table = dict(zip(m.SRC, m.TR))
    missing = []
    def sub(s, key, path):
        if s in table: return table[s]
        if (key in ("title", "body", "eyebrow", "label", "line", "dim", "text", "kicker", "subtitle", "contentsTitle")
                and not s.startswith("www.")):
            missing.append((".".join(map(str, path)), s[:60]))
        return s
    out = walk(en, sub)
    out["lang"] = lang
    json.dump(out, open(os.path.join(root, f"{slug}.{lang}.json"), "w", encoding="utf8"), ensure_ascii=False, indent=2)
    print("written", f"{slug}.{lang}.json", "| uncovered:", len(missing))
    for p, s in missing: print("  ", p, "=>", s)


main()
