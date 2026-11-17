"""
Shrinks the photos of a brochure so the PDF stays small (Chrome embeds images at their full size).

  python brochures/tools/optimize-images.py <folder> [max long edge px, default 1800] [jpeg quality, default 80]

Only JPEGs larger than the limit are re-encoded (in place); smaller ones are left alone.
"""
import sys, glob, os
import cv2

folder = sys.argv[1]
edge = int(sys.argv[2]) if len(sys.argv) > 2 else 1800
q = int(sys.argv[3]) if len(sys.argv) > 3 else 80
before = after = 0
for f in sorted(glob.glob(os.path.join(folder, "*.jpg"))):
    size = os.path.getsize(f)
    before += size
    img = cv2.imread(f)
    h, w = img.shape[:2]
    if max(h, w) > edge:
        k = edge / max(h, w)
        img = cv2.resize(img, (round(w * k), round(h * k)), interpolation=cv2.INTER_AREA)
        cv2.imwrite(f, img, [cv2.IMWRITE_JPEG_QUALITY, q])
    after += os.path.getsize(f)
print(f"{folder}: {before/1048576:.1f} MB -> {after/1048576:.1f} MB")
