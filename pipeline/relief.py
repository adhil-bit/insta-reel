"""Stylised 3D relief map scene ("Type B" maps), fully automatic.

script.json:
  "relief": {"scene": 1, "lat": 11.152, "lon": 75.866, "town": "ചേലേമ്പ്ര",
             "district": "MALAPPURAM", "kicker": "LOCATION", "look": "night"}

At render time (GitHub runner, has internet) this downloads free elevation data
(Copernicus DEM GLO-90 / GLO-30, (c) DLR/ESA, free licence, public AWS bucket),
paints a coloured, hill-shaded relief with a glowing Kerala outline (Natural Earth,
public domain), and replaces anim_<scene>.js with a three.js fly-in: all of Kerala ->
down to the town, with a pin, callout and source line.

  python3 -m pipeline.relief jobs/<slug>        # build the map files into jobs/<slug>/relief/
"""
from __future__ import annotations

import base64
import json
import math
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
KERALA = (10.45, 76.15, 7.5)          # centre lat, lon, lat span of the wide view
TEX_W, TEX_H = 1080, 1920             # texture size (portrait, same as the reel)
HM_W, HM_H = 360, 640                 # height-map size (mesh resolution)

LOOKS = {   # land colour ramp by elevation (m), sea colours, outline colour
    "night": {"ramp": [(0, "#16301f"), (40, "#1f3b27"), (200, "#34502e"), (600, "#5c6338"), (1200, "#8a7449"),
                       (1900, "#b89668"), (2700, "#e6d3ad")], "sea": ("#06111c", "#0d2c44"), "line": "#F5C542"},
    "day":   {"ramp": [(0, "#2f5a32"), (40, "#3d6b3a"), (200, "#5a8045"), (600, "#8a8f55"), (1200, "#a8925f"),
                       (1900, "#c9ae84"), (2700, "#f0e4c8")], "sea": ("#0e3a5c", "#1f6f96"), "line": "#FFE08A"},
    "ink":   {"ramp": [(0, "#d9cdb2"), (200, "#cdbf9f"), (800, "#b8a47e"), (1600, "#9c8460"), (2700, "#6f5a40")],
              "sea": ("#efe6d2", "#e2d6bb"), "line": "#7a2e1f"},
}


def _hex(c):
    c = c.lstrip("#"); return np.array([int(c[i:i + 2], 16) for i in (0, 2, 4)], dtype=np.float32)


def bounds_for(lat, lon, lat_span):
    lon_span = lat_span * (TEX_W / TEX_H) / math.cos(math.radians(lat))
    return (lon - lon_span / 2, lat - lat_span / 2, lon + lon_span / 2, lat + lat_span / 2)


def dem(bounds, shape, glo=90):
    """Elevation (m) over bounds (w, s, e, n) resampled to shape (h, w). Sea/missing = 0."""
    import rasterio
    from rasterio.merge import merge
    from rasterio.enums import Resampling
    w, s, e, n = bounds
    code = 30 if glo == 90 else 10
    srcs = []
    for la in range(math.floor(s), math.floor(n) + 1):
        for lo in range(math.floor(w), math.floor(e) + 1):
            name = (f"Copernicus_DSM_COG_{code}_{'N' if la >= 0 else 'S'}{abs(la):02d}_00_"
                    f"{'E' if lo >= 0 else 'W'}{abs(lo):03d}_00_DEM")
            url = f"/vsicurl/https://copernicus-dem-{glo}m.s3.amazonaws.com/{name}/{name}.tif"
            try:
                srcs.append(rasterio.open(url))
            except Exception:
                pass                          # ocean-only tiles don't exist
    if not srcs:
        return np.zeros(shape, np.float32)
    h, wd = shape
    res = ((e - w) / wd, (n - s) / h)
    with rasterio.Env(GDAL_DISABLE_READDIR_ON_OPEN="EMPTY_DIR", GDAL_HTTP_MAX_RETRY="4", GDAL_HTTP_RETRY_DELAY="2"):
        arr, _ = merge(srcs, bounds=bounds, res=res, nodata=0, resampling=Resampling.bilinear)
    a = np.nan_to_num(arr[0].astype(np.float32))[:h, :wd]
    if a.shape != (h, wd):
        a = np.array(Image.fromarray(a).resize((wd, h), Image.BILINEAR))
    return np.clip(a, 0, 9000)


def shade(z, px_m, exag=2.5):
    gy, gx = np.gradient(z * exag, px_m)
    out = np.zeros_like(z)
    for az, wgt in ((315, 0.55), (255, 0.25), (15, 0.20)):              # multi-directional hillshade
        a, alt = math.radians(az), math.radians(38)
        slope = np.arctan(np.hypot(gx, gy)); aspect = np.arctan2(-gx, gy)
        out += wgt * (np.sin(alt) * np.cos(slope) + np.cos(alt) * np.sin(slope) * np.cos(a - aspect))
    return np.clip(out, 0, 1)


def paint(z, bounds, look, outline=True):
    L = LOOKS.get(look, LOOKS["night"])
    h, w = z.shape
    lat = (bounds[1] + bounds[3]) / 2
    px_m = (bounds[3] - bounds[1]) * 110570 / h
    sea = z <= 0.5
    stops = L["ramp"]; ev = np.array([s[0] for s in stops], np.float32); cols = np.stack([_hex(s[1]) for s in stops])
    land = np.stack([np.interp(z, ev, cols[:, k]) for k in range(3)], -1)
    hs = shade(z, px_m, 3.0 if px_m > 200 else 1.6)[..., None]
    land = land * (0.42 + 0.95 * hs)
    land += np.array([18, 8, -6], np.float32) * (hs - 0.5)                # warm lights, cool shadows
    # sea: deep colour with a lighter band hugging the coast
    m = Image.fromarray((~sea * 255).astype(np.uint8))
    near = np.asarray(m.filter(ImageFilter.GaussianBlur(max(6, w / 90))), np.float32)[..., None] / 255
    s0, s1 = _hex(L["sea"][0]), _hex(L["sea"][1])
    seac = s0 + (s1 - s0) * np.clip(near * 1.6, 0, 1)
    img = np.where(sea[..., None], seac, land)
    im = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))
    # coastline glow
    edge = m.filter(ImageFilter.FIND_EDGES).filter(ImageFilter.GaussianBlur(1.2))
    glow = Image.new("RGB", im.size, tuple(int(x) for x in (s1 * 0.6 + 120)))
    im = Image.composite(glow, im, edge.point(lambda v: min(255, v * 2)))
    if outline:
        st = json.loads((ROOT / "vendor" / "kerala.json").read_text())["states"]
        W0, S0, E0, N0 = bounds
        def xy(p): return ((p[0] - W0) / (E0 - W0) * w, (N0 - p[1]) / (N0 - S0) * h)
        lay = Image.new("L", im.size, 0); d = ImageDraw.Draw(lay)
        lw = max(3, int(w / 260))
        for poly in st.get("Kerala", []):
            d.line([xy(p) for p in poly] + [xy(poly[0])], fill=255, width=lw, joint="curve")
        col = Image.new("RGB", im.size, tuple(int(x) for x in _hex(L["line"])))
        halo = lay.filter(ImageFilter.GaussianBlur(lw * 4)).point(lambda v: min(255, v * 3))
        im = Image.composite(col, im, halo.point(lambda v: v // 3))
        im = Image.composite(col, im, lay)
    return im


def build(job: Path, force=False) -> Path:
    script = json.loads((job / "script.json").read_text(encoding="utf-8"))
    r = script["relief"]
    out = job / "relief"; out.mkdir(exist_ok=True)
    meta_p = out / "relief.json"
    if meta_p.exists() and not force:
        return out
    look = r.get("look", "ink" if str(script.get("account")) == "2" and script.get("theme") == "inkwash" else "night")
    wide_b = bounds_for(*KERALA)
    near_b = bounds_for(r["lat"], r["lon"], r.get("near_span", 0.30))
    meta = {"lat": r["lat"], "lon": r["lon"], "look": look}
    for name, b, glo in (("wide", wide_b, 90), ("near", near_b, 30)):
        z = dem(b, (TEX_H, TEX_W), glo)
        paint(z, b, look, outline=True).save(out / f"{name}.jpg", quality=86, optimize=True)
        hm = np.array(Image.fromarray(z).resize((HM_W, HM_H), Image.BILINEAR))
        Image.fromarray(np.clip(hm / 2800 * 255, 0, 255).astype(np.uint8)).save(out / f"{name}_h.png", optimize=True)
        meta[name] = {"b": [round(x, 5) for x in b], "zmax": float(z.max())}
    meta_p.write_text(json.dumps(meta))
    return out


def _uri(p: Path, mime):
    return f"data:{mime};base64," + base64.b64encode(p.read_bytes()).decode()


def scene_code(job: Path, script: dict) -> str:
    """The three.js fly-in scene for script['relief'] (builds the map files if needed)."""
    out = build(job)
    meta = json.loads((out / "relief.json").read_text())
    r = script["relief"]
    cfg = {
        "lat": r["lat"], "lon": r["lon"], "kerala": [KERALA[0], KERALA[1]],
        "wide": meta["wide"]["b"], "near": meta["near"]["b"],
        "town": r.get("town", ""), "district": r.get("district", ""), "kicker": r.get("kicker", "LOCATION"),
        "source": r.get("source", "MAP: COPERNICUS DEM © DLR/ESA · NATURAL EARTH"),
        "ink": meta.get("look") == "ink", "exag": r.get("exag", 6),
    }
    imgs = "".join(f'<img id="rl_{k}" src="{_uri(out / f, m)}" style="display:none">'
                   for k, f, m in (("wide", "wide.jpg", "image/jpeg"), ("near", "near.jpg", "image/jpeg"),
                                   ("wideh", "wide_h.png", "image/png"), ("nearh", "near_h.png", "image/png")))
    js = (Path(__file__).resolve().parent / "lib" / "relief_scene.js").read_text(encoding="utf-8")
    return "document.write(" + json.dumps(imgs) + ");\nconst RL = " + json.dumps(cfg, ensure_ascii=False) + ";\n" + js


def apply(job: Path, script: dict, codes: list) -> None:
    """Swap the hand-drawn location scene for the relief fly-in (keeps the old scene on any failure)."""
    r = script.get("relief")
    if not r or not codes:
        return
    i = int(r.get("scene", 1))
    try:
        code = scene_code(job, script)
    except Exception as e:                    # no network / bad data: keep the hand-drawn scene
        print(f"relief map skipped ({e})")
        return
    if i < len(codes):
        codes[i] = code
        if (script.get("pin") or {}).get("scene") == i:
            script.pop("pin", None)
        if 0 < i <= len(script.get("scenes", [])):        # the callout replaces the lower-third tag
            script["scenes"][i - 1].pop("loc", None)


if __name__ == "__main__":
    for a in sys.argv[1:]:
        print(build(Path(a), force=True))
