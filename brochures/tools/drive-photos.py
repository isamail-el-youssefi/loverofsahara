"""
Lists and downloads photos from a PUBLIC Google Drive folder (no login), used for the "Photos Draa-Tafilalet" library.

  python brochures/tools/drive-photos.py list <folder id> <work dir>          # lists images + sub-folders
  python brochures/tools/drive-photos.py thumbs <folder id> <work dir>        # downloads small previews of every image
  python brochures/tools/drive-photos.py get <file id> <out file> [max edge]  # downloads one photo (default 2400 px)

Folder pages embed their file list as escaped JSON; only the first screenful of a folder is listed.
Root library: https://drive.google.com/drive/folders/1hRA55QrzH52ysberIgnvs4ONG3Dktczd
"""
import codecs, os, re, subprocess, sys

def listing(folder_id, work):
    os.makedirs(work, exist_ok=True)
    page = os.path.join(work, f"{folder_id}.html")
    subprocess.run(["curl", "-sL", "-m", "40", "-o", page, f"https://drive.google.com/drive/folders/{folder_id}"], check=True)
    h = open(page, encoding="utf-8", errors="ignore").read()
    blob = h[h.find("ivd'] = '"):]
    blob = codecs.decode(blob.encode("latin-1", "ignore"), "unicode_escape").replace("\/", "/")
    pat = re.compile(r'\["([0-9A-Za-z_-]{20,50})",\["([0-9A-Za-z_-]{20,50})"\],"(.*?)","([a-z]+/[A-Za-z0-9.+-]+)",')
    return [(m.group(1), m.group(3), m.group(4)) for m in pat.finditer(blob)]

cmd = sys.argv[1]
if cmd in ("list", "thumbs"):
    rows = listing(sys.argv[2], sys.argv[3])
    imgs = [r for r in rows if r[2].startswith("image/")]
    for r in rows:
        print(r)
    if cmd == "thumbs":
        for i, (fid, name, _) in enumerate(imgs):
            out = os.path.join(sys.argv[3], f"{i:02d}_{name}.jpg")
            subprocess.run(["curl", "-sL", "-m", "40", "-o", out, f"https://drive.google.com/thumbnail?id={fid}&sz=w420"])
elif cmd == "get":
    edge = sys.argv[4] if len(sys.argv) > 4 else "2400"
    subprocess.run(["curl", "-sL", "-m", "90", "-o", sys.argv[3], f"https://drive.google.com/thumbnail?id={sys.argv[2]}&sz=s{edge}"], check=True)
