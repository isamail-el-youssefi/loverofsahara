"""
Crops the clean, rectangular photos out of the original "Guide Touristique de la Province Zagora" PDF
(Visit Draa-Tafilalet, reused with their permission). The original pages are flattened images, so the
photos can only be recovered by cropping them from the page renders.

  python brochures/tools/extract-crops.py <slug> <path to the original pdf> brochures/assets/<slug>

Crop boxes are in a 2150 px wide view of each spread (x0, y0, x1, y1); they are rescaled to the page.
"""
import sys
import pymupdf

slug, src, out = sys.argv[1], sys.argv[2], sys.argv[3]
VIEW_W = 2150.0
# name: (page number, (x0, y0, x1, y1))
ZAGORA = {
    "dunes": (3, (790, 70, 1640, 640)),
    "tamegroute-town": (3, (1756, 510, 2136, 762)),
    "engraving-tazarine": (5, (4, 72, 474, 388)),
    "ksar-amzrou": (5, (4, 402, 474, 728)),
    "museum-draa": (5, (4, 744, 474, 1056)),
    "singers": (6, (1714, 99, 2051, 291)),
    "souk-agdz": (6, (1714, 328, 2051, 519)),
    "jewelry": (6, (1714, 557, 2051, 747)),
    "pottery-hands": (6, (1714, 784, 2051, 975)),
    "musicians": (9, (720, 56, 2080, 572)),
    "tajine-dish": (7, (742, 486, 1036, 694)),
}
TINGHIR = {
    "aerial": (3, (960, 12, 2140, 492)),
    "palm-town": (4, (452, 622, 1068, 1052)),
    "roses-valley": (4, (1742, 112, 2018, 330)),
    "monkey-paws": (4, (1216, 388, 1498, 608)),
    "ksar-lhaj-ali": (5, (132, 102, 428, 318)),
    "ait-youl": (5, (152, 402, 440, 608)),
    "mellah": (5, (132, 682, 430, 898)),
    "ikelane": (5, (1712, 102, 2018, 308)),
    "jbel-saghro": (5, (1712, 412, 1998, 598)),
    "alnif": (5, (1712, 692, 1998, 898)),
    "old-medina": (6, (132, 102, 428, 318)),
    "dinosaurs": (6, (152, 402, 440, 608)),
    "bab-nali": (6, (142, 692, 430, 908)),
    "potter": (6, (1682, 12, 2144, 640)),
    "rings": (7, (132, 102, 428, 318)),
    "assou": (7, (152, 402, 440, 608)),
    "khettaras": (7, (142, 692, 430, 908)),
    "couple": (8, (1186, 24, 2140, 738)),
    "panorama": (9, (640, 0, 2150, 570)),
}
ERRACHIDIA = {
    "khettara-tunnel": (4, (1176, 852, 1586, 1054)),
    "khettara-surface": (4, (1646, 852, 2056, 1054)),
}
SETS = {"zagora": ZAGORA, "tinghir": TINGHIR, "errachidia": ERRACHIDIA}
CROPS = SETS[slug]
doc = pymupdf.open(src)
for name, (pno, (x0, y0, x1, y1)) in CROPS.items():
    page = doc[pno - 1]
    k = page.rect.width / VIEW_W
    clip = pymupdf.Rect(x0 * k, y0 * k, x1 * k, y1 * k)
    zoom = 2480.0 / page.rect.width  # the embedded scan is 2480 px wide
    pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), clip=clip)
    pix.save(f"{out}/{name}.jpg", jpg_quality=90)
    print(name, pix.width, "x", pix.height)
