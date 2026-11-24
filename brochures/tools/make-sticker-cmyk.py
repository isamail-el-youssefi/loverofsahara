#!/usr/bin/env python
"""Export brochures/assets/brand/sticker.svg as a vector CMYK PDF for the print store.

No Ghostscript needed: the sticker is plain paths (M L C Z), circles and solid fills, so this
writes the PDF directly. Every colour is converted from sRGB to Coated FOGRA39 (the Windows
CoatedFOGRA39.icc profile, relative colorimetric + black point compensation) and written with
the DeviceCMYK operators (k / K); the profile is embedded as the PDF's output intent.
No RGB operators and no raster images, so it scales to any size.

Needs: pip install --user pillow
Usage: python -W ignore brochures/tools/make-sticker-cmyk.py [width_mm=100]
"""
import re
import sys
import zlib
from pathlib import Path

from PIL import Image, ImageCms

ROOT = Path(__file__).resolve().parents[2]
SVG = ROOT / "brochures/assets/brand/sticker.svg"
OUT = ROOT / "brochures/assets/brand/sticker-cmyk.pdf"
ICC = Path(r"C:\Windows\System32\spool\drivers\color\CoatedFOGRA39.icc")
WIDTH_MM = float(sys.argv[1]) if len(sys.argv) > 1 else 100.0

srgb = ImageCms.createProfile("sRGB")
fogra = ImageCms.getOpenProfile(str(ICC))
xform = ImageCms.buildTransform(
    srgb, fogra, "RGB", "CMYK",
    renderingIntent=ImageCms.Intent.RELATIVE_COLORIMETRIC,
    flags=ImageCms.Flags.BLACKPOINTCOMPENSATION,
)
_cache = {}


def cmyk(hexcol):
    if hexcol not in _cache:
        r, g, b = (int(hexcol[i:i + 2], 16) for i in (1, 3, 5))
        c, m, y, k = ImageCms.applyTransform(Image.new("RGB", (1, 1), (r, g, b)), xform).getpixel((0, 0))
        _cache[hexcol] = " ".join("%.3f" % (v / 255) for v in (c, m, y, k))
    return _cache[hexcol]


svg = SVG.read_text(encoding="utf8")
NAMED = {"black": "#000000", "white": "#FFFFFF"}
grad = {}
for m in re.finditer(r'<linearGradient id="([^"]+)"([^>]*)>(.*?)</linearGradient>', svg, re.S):
    co = {k: float(v) for k, v in re.findall(r'(x1|y1|x2|y2)="([^"]+)"', m.group(2))}
    st = [NAMED.get(c, c) for c in re.findall(r'stop-color="([^"]+)"', m.group(3))]
    grad[m.group(1)] = (co, st[0], st[-1])
shadings = []  # PDF axial shadings in DeviceCMYK, referenced as /Sh0, /Sh1, ...


def shading_name(gid):
    co, c0, c1 = grad[gid]
    d = (f"<< /ShadingType 2 /ColorSpace /DeviceCMYK /Coords [{co['x1']} {co['y1']} {co['x2']} {co['y2']}] "
         f"/Function << /FunctionType 2 /Domain [0 1] /C0 [{cmyk(c0)}] /C1 [{cmyk(c1)}] /N 1 >> /Extend [true true] >>")
    if d not in shadings:
        shadings.append(d)
    return f"Sh{shadings.index(d)}"


def path_ops(d, pts):
    """SVG path data (absolute M L H V C Z) -> PDF path operators; every point goes to pts."""
    toks = re.findall(r"[MLHVCZ]|-?\d+\.?\d*(?:e-?\d+)?", d)
    out, i, cmd = [], 0, None
    cx = cy = 0.0
    while i < len(toks):
        if toks[i] in ("M", "L", "H", "V", "C", "Z"):
            cmd = toks[i]
            i += 1
            if cmd == "Z":
                out.append("h")
                continue
        if cmd == "M":
            cx, cy = float(toks[i]), float(toks[i + 1]); i += 2
            out.append(f"{cx} {cy} m"); cmd = "L"  # extra pairs after M are lines
        elif cmd == "L":
            cx, cy = float(toks[i]), float(toks[i + 1]); i += 2
            out.append(f"{cx} {cy} l")
        elif cmd == "H":
            cx = float(toks[i]); i += 1
            out.append(f"{cx} {cy} l")
        elif cmd == "V":
            cy = float(toks[i]); i += 1
            out.append(f"{cx} {cy} l")
        elif cmd == "C":
            v = list(map(float, toks[i:i + 6])); i += 6
            out.append(" ".join(map(str, v)) + " c")
            pts += list(zip(v[0::2], v[1::2]))
            cx, cy = v[4], v[5]
            continue
        else:
            raise ValueError("unexpected token " + toks[i])
        pts.append((cx, cy))
    return "\n".join(out)


def circle_ops(cx, cy, r):
    k = 0.5522847498 * r
    return (f"{cx+r} {cy} m {cx+r} {cy+k} {cx+k} {cy+r} {cx} {cy+r} c {cx-k} {cy+r} {cx-r} {cy+k} {cx-r} {cy} c "
            f"{cx-r} {cy-k} {cx-k} {cy-r} {cx} {cy-r} c {cx+k} {cy-r} {cx+r} {cy-k} {cx+r} {cy} c h")


body, xs, ys = [], [], []
for m in re.finditer(r"<(path|circle) ([^>]*?)/>", svg):
    tag, attrs = m.group(1), m.group(2)
    fill = re.search(r'fill="([^"]+)"', attrs).group(1)
    stroke = re.search(r'stroke-width="([^"]+)"', attrs)
    if tag == "path":
        d = re.search(r' d="([^"]+)"|^d="([^"]+)"', " " + attrs)
        d = d.group(1) or d.group(2)
        pts = []
        geom = path_ops(d, pts)
        xs += [q[0] for q in pts]; ys += [q[1] for q in pts]
    else:
        a = {k: float(v) for k, v in re.findall(r'(cx|cy|r)="([^"]+)"', attrs)}
        geom = circle_ops(a["cx"], a["cy"], a["r"])
    if fill.startswith("url("):
        body.append(f"q\n{geom}\nW n /{shading_name(fill[5:-1])} sh\nQ")
        continue
    col = cmyk(fill)
    if stroke:
        body.append(f"{col} k {col} K {float(stroke.group(1)):.3f} w 1 j\n{geom}\nB")
    else:
        body.append(f"{col} k\n{geom}\nf")

# page = the sticker's own bounding box (the svg canvas is mostly empty), with a 2 mm margin
x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
pad = 0.02 * (x1 - x0)
x0, x1, y0, y1 = x0 - pad, x1 + pad, y0 - pad, y1 + pad
w_pt = WIDTH_MM / 25.4 * 72
s = w_pt / (x1 - x0)
h_pt = (y1 - y0) * s
content = f"{s:.6f} 0 0 {-s:.6f} {-x0*s:.4f} {y1*s:.4f} cm\n" + "\n".join(body)
stream = zlib.compress(content.encode("ascii"), 9)
icc = ICC.read_bytes()
icc_z = zlib.compress(icc, 9)

objs = [
    b"<< /Type /Catalog /Pages 2 0 R /OutputIntents [5 0 R] >>",
    b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {w_pt:.3f} {h_pt:.3f}] /TrimBox [0 0 {w_pt:.3f} {h_pt:.3f}] "
    .encode() + ("/Resources << /Shading << " + " ".join(f"/Sh{i} {d}" for i, d in enumerate(shadings)) + " >> >> /Contents 4 0 R >>").encode(),
    b"<< /Length %d /Filter /FlateDecode >>\nstream\n" % len(stream) + stream + b"\nendstream",
    b"<< /Type /OutputIntent /S /GTS_PDFX /OutputConditionIdentifier (FOGRA39) "
    b"/OutputCondition (Coated FOGRA39 (ISO 12647-2:2004)) /Info (Coated FOGRA39) /DestOutputProfile 6 0 R >>",
    b"<< /N 4 /Alternate /DeviceCMYK /Length %d /Filter /FlateDecode >>\nstream\n" % len(icc_z) + icc_z + b"\nendstream",
]
pdf = bytearray(b"%PDF-1.6\n%\xe2\xe3\xcf\xd3\n")
offs = []
for i, o in enumerate(objs, 1):
    offs.append(len(pdf))
    pdf += f"{i} 0 obj\n".encode() + o + b"\nendobj\n"
xref = len(pdf)
pdf += f"xref\n0 {len(objs)+1}\n0000000000 65535 f \n".encode()
for o in offs:
    pdf += f"{o:010d} 00000 n \n".encode()
pdf += f"trailer\n<< /Size {len(objs)+1} /Root 1 0 R >>\nstartxref\n{xref}\n%%EOF\n".encode()
OUT.write_bytes(pdf)
print(f"wrote {OUT}  {len(pdf)//1024} KB  {WIDTH_MM:.0f} x {h_pt/72*25.4:.1f} mm  colours: {len(_cache)}")
