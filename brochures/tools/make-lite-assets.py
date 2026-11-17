"""
Makes smaller copies of every brochure photo in brochures/dist/assets-lite (long edge 1200 px, JPEG q70; covers, the sticker and
other non-JPEG files are copied as they are). Build with:  LITE=1 node brochures/build.mjs <slug> <lang>

  python brochures/tools/make-lite-assets.py
"""
import os, shutil, cv2

src, dst = "brochures/assets", "brochures/dist/assets-lite"
shutil.rmtree(dst, ignore_errors=True)
for root, _, files in os.walk(src):
    for f in files:
        a = os.path.join(root, f)
        b = os.path.join(dst, os.path.relpath(a, src))
        os.makedirs(os.path.dirname(b), exist_ok=True)
        if f.lower().endswith(".jpg") and "cover" not in f:
            im = cv2.imread(a)
            h, w = im.shape[:2]
            k = 1200 / max(h, w)
            if k < 1:
                im = cv2.resize(im, (round(w * k), round(h * k)), interpolation=cv2.INTER_AREA)
            cv2.imwrite(b, im, [cv2.IMWRITE_JPEG_QUALITY, 70])
        else:
            shutil.copy(a, b)
print("done")
