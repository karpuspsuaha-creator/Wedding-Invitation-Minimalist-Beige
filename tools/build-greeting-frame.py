"""
Build the framed greeting photo (greeting section).

Template shapes live in assets/frames/frame-<name>.svg (each SVG = the photo window).
The photo is cropped exactly to the template window (aspect ratio) so nothing important
is cut awkwardly, then masked, shadowed, edged with a thin gold line and decorated with
the watercolor flowers from phuonglucky-frame-6582649.svg.

Usage (dari root project):
    python tools/build-greeting-frame.py                                  # arch + default photo
    python tools/build-greeting-frame.py --template bloom --photo assets/images/wedding-ceremony.jpg

Butuh: pip install -r tools/requirements.txt
"""

import argparse
import os
import subprocess

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEMP = os.environ.get("TEMP", ".") or "."
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
W = H = 1400

# name -> (window bbox x0,y0,x1,y1, flower A cx,cy,size, flower B cx,cy,size)
SHAPES = {
    "arch":     ((330, 150, 1070, 1250), (1090, 320, 430), (295, 905, 385)),
    "oval":     ((300, 120, 1100, 1280), (1105, 320, 420), (290, 930, 375)),
    "hexagon":  ((250, 150, 1150, 1250), (1120, 300, 440), (280, 880, 400)),
    "squircle": ((280, 150, 1120, 1250), (1115, 320, 430), (270, 885, 400)),
    "bloom":    ((215, 150, 1175, 1235), (1085, 300, 440), (285, 905, 395)),
}

# face anchor (source pixels) used to keep the subject well placed inside the window
# default: assets/images/unsplash-couple-side.jpg (foto pasangan close-up, 1800x2700)
FACE_X, FACE_Y = 1020, 790


def render_mask(name):
    svg = os.path.join(ROOT, "assets", "frames", f"frame-{name}.svg")
    out = os.path.join(TEMP, f"mask_{name}.png")
    if os.path.exists(out):
        os.remove(out)
    subprocess.run(
        [
            EDGE, "--headless=new", "--disable-gpu", "--hide-scrollbars",
            "--default-background-color=00000000", "--virtual-time-budget=4000",
            "--window-size=1400,1400", f"--screenshot={out}",
            "file:///" + svg.replace("\\", "/").replace(" ", "%20"),
        ],
        capture_output=True,
    )
    return Image.open(out).convert("RGBA").split()[3]


def flower_clusters():
    fl = None
    for cand in (
        os.path.join(ROOT, "assets", "frames", "flowers-only.png"),
        os.path.join(TEMP, "flowers_1350.png"),
    ):
        if os.path.exists(cand):
            fl = Image.open(cand).convert("RGBA")
            break
    if fl is None:
        raise FileNotFoundError("flowers-only.png tidak ditemukan (assets/frames/flowers-only.png)")
    a = np.array(fl.split()[3])
    fw = fl.width

    def bbox(m):
        ys, xs = np.nonzero(m)
        return (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)

    rb, lb = bbox(a[:, fw // 2:]), bbox(a[:, : fw // 2])
    rb = (rb[0] + fw // 2, rb[1], rb[2] + fw // 2, rb[3])
    return fl.crop(rb), fl.crop(lb)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--template", default="arch", choices=sorted(SHAPES))
    ap.add_argument("--photo", default=os.path.join("assets", "images", "unsplash-couple-side.jpg"))
    ap.add_argument("--out", default=os.path.join("assets", "images", "greeting-framed.png"))
    ap.add_argument("--face-x", type=int, default=FACE_X, help="titik fokus horizontal (px sumber)")
    ap.add_argument("--face-y", type=int, default=FACE_Y, help="titik fokus vertikal (px sumber)")
    args = ap.parse_args()
    face_x, face_y = args.face_x, args.face_y

    win, fa_pos, fb_pos = SHAPES[args.template]
    x0, y0, x1, y1 = win
    ww, wh = x1 - x0, y1 - y0

    src = Image.open(os.path.join(ROOT, args.photo)).convert("RGB")
    sw, sh = src.size
    aspect = ww / wh
    crop_h = min(sh, sw / aspect)
    crop_w = crop_h * aspect
    if crop_w > sw:
        crop_w, crop_h = sw, sw / aspect
    left = min(max(face_x - 0.5 * crop_w, 0), sw - crop_w)
    top = min(max(face_y - 0.30 * crop_h, 0), sh - crop_h)
    crop = src.crop((int(left), int(top), int(left + crop_w), int(top + crop_h))).resize((ww, wh), Image.LANCZOS)

    mask = render_mask(args.template)
    if mask.size != (W, H):
        mask = mask.resize((W, H), Image.LANCZOS)

    canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    shadow = Image.new("RGBA", (W, H), (86, 60, 40, 0))
    shadow.putalpha(mask.filter(ImageFilter.GaussianBlur(9)).point(lambda v: int(v * 0.34)))
    canvas.alpha_composite(shadow, (0, 14))

    photo = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    photo.paste(crop, (x0, y0))
    canvas.paste(photo, (0, 0), Image.composite(photo.split()[3], Image.new("L", (W, H), 0), mask))

    m = np.array(mask) > 0
    dil = np.zeros_like(m)
    for dy in range(-2, 3):
        for dx in range(-2, 3):
            dil |= np.roll(np.roll(m, dy, axis=0), dx, axis=1)
    gold = Image.new("RGBA", (W, H), (198, 160, 96, 0))
    gold.putalpha(Image.fromarray(((dil & ~m).astype(np.uint8) * 255), "L").point(lambda v: int(v * 0.72)))
    canvas.alpha_composite(gold)

    cluster_a, cluster_b = flower_clusters()
    for cl, (cx, cy, size) in ((cluster_a, fa_pos), (cluster_b, fb_pos)):
        h = int(cl.height * (size / cl.width))
        canvas.alpha_composite(cl.resize((size, h), Image.LANCZOS), (int(cx - size / 2), int(cy - h / 2)))

    out = os.path.join(ROOT, args.out)
    canvas.save(out, optimize=True)
    print("saved", out, os.path.getsize(out), canvas.size)

    # Versi rapat (tanpa area transparan) khusus untuk lightbox: foto + bunga
    # tampil besar dan bersih, tanpa "frame" persegi.
    alpha = canvas.split()[3]
    bbox = alpha.getbbox()
    if bbox:
        pad = 12
        bbox = (max(0, bbox[0] - pad), max(0, bbox[1] - pad),
                min(W, bbox[2] + pad), min(H, bbox[3] + pad))
        cropped = canvas.crop(bbox)
        full = os.path.join(ROOT, "assets", "images", "greeting-framed-full.png")
        cropped.save(full, optimize=True)
        print("saved", full, os.path.getsize(full), cropped.size)


if __name__ == "__main__":
    main()
