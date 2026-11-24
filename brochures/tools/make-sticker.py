#!/usr/bin/env python
"""Rebuild brochures/assets/brand/sticker.svg with the website's fonts.

The original sticker (sticker.old.svg) has its lettering baked in as outlines. This script
removes those outlines (ring text, banner, tagline, url line, plus the letter counters), keeps
the illustration, and re-draws the lettering as outlines (an SVG used through <img> cannot load
fonts) from the site's own font files:

  banner   LOVER OF SAHARA        F37 Wicklow Medium, caps, +0.04em, thin stroke (= navbar logo)
  tagline  Là où le désert ...    PP Neue Montreal Italic
  ring     EXPLORER · ...         PP Neue Montreal Medium, caps, tracked, set on the old circle
  url      www... • +212 ...      PP Neue Montreal Medium

Needs: pip install --user fonttools uharfbuzz numpy
Usage: python -W ignore brochures/tools/make-sticker.py   (run from the repo root)
"""
import math
import re
import sys
from pathlib import Path

import numpy as np
import uharfbuzz as hb
from fontTools.misc.transform import Transform
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[2]
BRAND = ROOT / "brochures/assets/brand"
FONTS = ROOT / "public/font"
WICKLOW = FONTS / "F37_Wicklow/F37Wicklow-Medium.otf"
MONT_MED = FONTS / "pp-neue-montreal-cufonfonts/ppneuemontreal-medium.otf"
MONT_ITA = FONTS / "pp-neue-montreal-cufonfonts/ppneuemontreal-italic.otf"

INK = "#3C342E"   # sticker's brown ink (banner, tagline, ring)
DEEP = "#191412"  # url line, as in the original


class Face:
    def __init__(self, path):
        self.tt = TTFont(str(path))
        self.gs = self.tt.getGlyphSet()
        self.upem = self.tt["head"].unitsPerEm
        self.cap = self.tt["OS/2"].sCapHeight
        blob = hb.Blob.from_file_path(str(path))
        self.hbface = hb.Face(blob)
        self.hbfont = hb.Font(self.hbface)

    def shape(self, text):
        buf = hb.Buffer()
        buf.add_str(text)
        buf.guess_segment_properties()
        hb.shape(self.hbfont, buf, {"kern": True, "liga": False, "clig": False})
        return [(self.hbfont.glyph_to_string(i.codepoint), p.x_advance, p.x_offset, p.y_offset)
                for i, p in zip(buf.glyph_infos, buf.glyph_positions)]

    def glyph_d(self, name, tr):
        pen = SVGPathPen(self.gs, ntos=lambda v: ("%.2f" % v).rstrip("0").rstrip("."))
        self.gs[name].draw(TransformPen(pen, tr))
        return pen.getCommands()


def run_width(face, text, size, tracking):
    g = face.shape(text)
    adv = sum(a for _, a, _, _ in g) + tracking * face.upem * (len(g) - 1)
    return adv * size / face.upem


def straight(face, text, size, tracking, cx, baseline):
    """Outline path data for one centred line of text."""
    g = face.shape(text)
    s = size / face.upem
    total = run_width(face, text, size, tracking)
    x = cx - total / 2
    out = []
    for name, adv, xo, yo in g:
        out.append(face.glyph_d(name, Transform(s, 0, 0, -s, x + xo * s, baseline - yo * s)))
        x += (adv + tracking * face.upem) * s
    return " ".join(out), total


def fit_size(face, text, tracking, target_w):
    return target_w / run_width(face, text, 1.0, tracking)


def path(d, fill, stroke_w=0.0):
    st = f' stroke="{fill}" stroke-width="{stroke_w:.2f}" stroke-linejoin="round"' if stroke_w else ""
    return f'<path fill="{fill}"{st} d="{d}"/>'


# ---------------------------------------------------------------- strip old lettering
def strip_old_text(svg):
    els = list(re.finditer(r"<path [^>]*?/>", svg))

    def info(t):
        f = re.search(r'fill="([^"]+)"', t).group(1)
        d = re.search(r' d="([^"]+)"', t).group(1)
        n = list(map(float, re.findall(r"-?\d+\.?\d*", d)))
        xs, ys = n[0::2], n[1::2]
        return f, (min(xs), min(ys), max(xs), max(ys))

    inside = lambda b, r: b[0] >= r[0] and b[1] >= r[1] and b[2] <= r[2] and b[3] <= r[3]
    BANNER, TAG, URL, RING = (140, 610, 895, 722), (140, 735, 890, 790), (150, 815, 880, 850), (200, 170, 830, 500)
    DARK = ("#3C342E", "#070302", "#191412")
    # cream letter counters and gradient-filled ring letters / separators found by inspection
    extra = {234, 249, 251, 253, 255, 257, 259, 261, 263, 265, 267, 262, 333, 375}
    rm, ring_letters = set(), []
    for i, m in enumerate(els):
        f, b = info(m.group(0))
        w, h = b[2] - b[0], b[3] - b[1]
        if f == "#3C342E" and (inside(b, BANNER) or inside(b, TAG) or inside(b, RING)):
            rm.add(i)
            if inside(b, RING):
                ring_letters.append(b)
        elif (f in DARK or f.startswith("url(")) and (inside(b, TAG) or inside(b, URL)):
            rm.add(i)
        elif f == "#EBEAE8" and w < 40 and h < 40 and (inside(b, TAG) or inside(b, URL)):
            rm.add(i)
        elif i in extra:
            rm.add(i)
            if i in (262, 333):
                ring_letters.append(b)
    out, last = [], 0
    for i, m in enumerate(els):
        if i in rm:
            out.append(svg[last:m.start()])
            last = m.end()
    out.append(svg[last:])
    return "".join(out), ring_letters


def fit_circle(letters):
    """Circle through the centres of the old ring letters (letters only, not the dots)."""
    pts = np.array([[(b[0] + b[2]) / 2, (b[1] + b[3]) / 2] for b in letters if (b[2] - b[0]) > 12 and (b[3] - b[1]) > 12])
    A = np.c_[2 * pts[:, 0], 2 * pts[:, 1], np.ones(len(pts))]
    sol = np.linalg.lstsq(A, (pts ** 2).sum(1), rcond=None)[0]
    cx, cy = sol[0], sol[1]
    r = math.sqrt(sol[2] + cx * cx + cy * cy)
    ang = [math.atan2(p[0] - cx, -(p[1] - cy)) for p in pts]  # 0 = top, clockwise
    return cx, cy, r, min(ang), max(ang)


# ---------------------------------------------------------------- ring text
def ring(face, cx, cy, r_mid, a0, a1, cap_h):
    size = cap_h / (face.cap / face.upem)
    s = size / face.upem
    words = ["EXPLORER", None, "RESSENTIR", None, "VIVRE LE SAHARA"]
    items = []  # (glyph name or None, advance units)
    dot_gap = 0.95 * face.upem
    for w in words:
        if w is None:
            items.append((None, dot_gap))
            continue
        for name, adv, _, _ in face.shape(w):
            items.append((name, adv))
    n_gaps = len(items) - 1
    # first/last letter centres sit on a0/a1: span runs from half of first glyph to half of last
    span_units = (a1 - a0) * r_mid / s
    natural = sum(a for _, a in items) - items[0][1] / 2 - items[-1][1] / 2
    tracking_units = (span_units - natural) / n_gaps
    d_out, dots = [], []
    pos = -items[0][1] / 2  # start so that first glyph centre is at 0
    pos = 0.0
    for i, (name, adv) in enumerate(items):
        centre = pos + adv / 2
        ang = a0 + (centre - items[0][1] / 2) * s / r_mid
        px, py = cx + r_mid * math.sin(ang), cy - r_mid * math.cos(ang)
        if name is None:
            dots.append((px, py))
        else:
            base_r = r_mid - cap_h / 2
            bx, by = cx + base_r * math.sin(ang), cy - base_r * math.cos(ang)
            tr = Transform().translate(bx, by).rotate(ang).scale(s, -s).translate(-adv / 2, 0)
            d_out.append(face.glyph_d(name, tr))
        pos += adv + tracking_units
    return " ".join(d_out), dots, tracking_units / face.upem, size


def main():
    old = BRAND / "sticker.old.svg"
    if not old.exists():
        sys.exit("missing " + str(old))
    svg, ring_letters = strip_old_text(old.read_text(encoding="utf8"))
    cx, cy, r, a0, a1 = fit_circle(ring_letters)
    print(f"ring circle c=({cx:.1f},{cy:.1f}) r={r:.1f} angles {math.degrees(a0):.1f}..{math.degrees(a1):.1f}")

    wick, med, ita = Face(WICKLOW), Face(MONT_MED), Face(MONT_ITA)
    parts = []

    # banner: same face / weight / tracking / stroke as the navbar logo
    track = 0.04
    size = fit_size(wick, "LOVER OF SAHARA", track, 743)
    cap = size * wick.cap / wick.upem
    base = 665 + cap / 2
    d, _ = straight(wick, "LOVER OF SAHARA", size, track, 515.5, base)
    parts.append(path(d, INK, stroke_w=size * 0.019))  # navbar: 0.6px stroke on 32px type
    print(f"banner size {size:.1f} cap {cap:.1f}")

    # tagline
    size = min(fit_size(ita, "Là où le désert devient une émotion.", 0.0, 722), 46)
    d, w = straight(ita, "Là où le désert devient une émotion.", size, 0.0, 511.5, 777)
    parts.append(path(d, INK))
    print(f"tagline size {size:.1f} width {w:.0f}")

    # url + phone with a round bullet between
    t1, t2, tr_ = "www.loverofsahara.tours", "+212 661 842 609", 0.06
    gap, dot_r = 26.0, 4.5
    size = 26.0
    for _ in range(40):  # fit the whole line to 718 wide
        tot = run_width(med, t1, size, tr_) + run_width(med, t2, size, tr_) + 2 * gap + 2 * dot_r
        size *= 718 / tot
    w1, w2 = run_width(med, t1, size, tr_), run_width(med, t2, size, tr_)
    tot = w1 + w2 + 2 * gap + 2 * dot_r
    x0 = 515 - tot / 2
    base = 842
    d1, _ = straight(med, t1, size, tr_, x0 + w1 / 2, base)
    d2, _ = straight(med, t2, size, tr_, x0 + w1 + 2 * gap + 2 * dot_r + w2 / 2, base)
    parts.append(path(d1 + " " + d2, DEEP))
    xm = x0 + w1 + gap + dot_r
    ymid = base - (med.cap / med.upem) * size / 2
    parts.append(f'<circle cx="{xm:.1f}" cy="{ymid:.1f}" r="{dot_r}" fill="{DEEP}"/>')
    print(f"url size {size:.1f}")

    # ring text
    rd, dots, trk, size = ring(med, cx, cy, r, a0, a1, 25.0)
    parts.append(path(rd, INK))
    for px, py in dots:
        parts.append(f'<circle cx="{px:.1f}" cy="{py:.1f}" r="3.3" fill="{INK}"/>')
    print(f"ring size {size:.1f} tracking {trk:.3f}em")

    out = svg.replace("</svg>", "\n".join(parts) + "</svg>")
    (BRAND / "sticker.svg").write_text(out, encoding="utf8")
    print("wrote", BRAND / "sticker.svg", len(out) // 1024, "KB")


if __name__ == "__main__":
    main()
