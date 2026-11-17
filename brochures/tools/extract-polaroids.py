"""
Finds the tilted white "polaroid" photos on a page of an original brochure, levels each one and trims the white
frame, so the photo can be reused as a clean rectangle.

  python brochures/tools/extract-polaroids.py <pdf> <page number> <out dir> [prefix]

Writes <out dir>/<prefix>p<page>-<n>.jpg (n counts top to bottom, left column first) and prints the size of each.
The original pages are flattened images (scan 2480 px wide), so the output is at most that resolution.
"""
import sys
import cv2
import numpy as np
import pymupdf

pdf, pno, out = sys.argv[1], int(sys.argv[2]), sys.argv[3]
prefix = sys.argv[4] if len(sys.argv) > 4 else ""
doc = pymupdf.open(pdf)
page = doc[pno - 1]
zoom = 2480.0 / page.rect.width
pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom))
img = cv2.imdecode(np.frombuffer(pix.tobytes("png"), np.uint8), cv2.IMREAD_COLOR)
H, W = img.shape[:2]

# near-white frame mask; each photo is a "hole" inside the white polaroid frame (this also separates stacked polaroids)
mask = (img.min(axis=2) >= 222).astype(np.uint8) * 255
mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
cnts, hier = cv2.findContours(mask, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_SIMPLE)
found = []
for i, c in enumerate(cnts):
    if hier[0][i][3] == -1:  # outer contours only; we want holes
        continue
    area = cv2.contourArea(c)
    if area < (W * H) * 0.012 or area > (W * H) * 0.2:
        continue
    (cx, cy), (w, h), ang = cv2.minAreaRect(c)
    if min(w, h) < 120 or area / (w * h) < 0.9:
        continue
    found.append((cx, cy, w, h, ang))

found.sort(key=lambda r: (round(r[0] / (W / 2)), r[1]))
for n, (cx, cy, w, h, ang) in enumerate(found, 1):
    if h > w:  # long side horizontal
        w, h = h, w
        ang += 90
    # level the page around the photo, then take the photo rectangle (inset a little to drop the frame fringe)
    M = cv2.getRotationMatrix2D((cx, cy), ang, 1.0)
    rot = cv2.warpAffine(img, M, (W, H), flags=cv2.INTER_CUBIC, borderValue=(255, 255, 255))
    ix, iy = w * 0.012, h * 0.012
    x0, y0 = int(cx - w / 2 + ix), int(cy - h / 2 + iy)
    x1, y1 = int(cx + w / 2 - ix), int(cy + h / 2 - iy)
    photo = rot[max(0, y0):y1, max(0, x0):x1]
    name = f"{out}/{prefix}p{pno}-{n}.jpg"
    cv2.imwrite(name, photo, [cv2.IMWRITE_JPEG_QUALITY, 90])
    print(f"p{pno}-{n}: {photo.shape[1]}x{photo.shape[0]}  angle {ang:.1f}  at ({int(cx*2150/W)},{int(cy*2150/W)})")
