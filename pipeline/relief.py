"""Stylised 3D relief map scene ("Type B" maps), fully automatic.

script.json:
  "relief": {"scene": 1, "lat": 11.152, "lon": 75.866, "town": "ചേലേമ്പ്ര",
             "district": "MALAPPURAM", "kicker": "LOCATION"}
  optional: "look": "night" | "ink" (default: ink for the inkwash page), "from": "kozhikode"
            (city for the distance thread; default = nearest district town; false = none)

At render time (GitHub runner, has internet) this downloads free elevation data
(Copernicus DEM GLO-90 / GLO-30, (c) DLR/ESA, free licence, public AWS bucket),
paints three hill-shaded colour tiles (Kerala / district / town) and replaces
anim_<scene>.js with a three.js fly-in: Kerala -> the town, Kerala outline,
distance thread from the nearest city, pin and callout, source line.
Design spec: docs/design-methods.md -> "3D relief map scene" (Fable review, 19 Nov 2026).

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
KERALA = (10.45, 76.15)                                    # centre of the wide view
TILES = (("wide", 7.5, 90, (1080, 1920)), ("mid", 1.6, 90, (1080, 1920)), ("near", 0.45, 30, (1152, 2048)))
HM_W, HM_H = 360, 640                                      # height-map (mesh) resolution

CITIES = {   # district towns: lat, lon, Malayalam name
    "kasaragod": (12.50, 74.99, "കാസർഗോഡ്"), "kannur": (11.874, 75.370, "കണ്ണൂർ"),
    "thalassery": (11.748, 75.492, "തലശ്ശേരി"), "kozhikode": (11.252, 75.768, "കോഴിക്കോട്"),
    "kalpetta": (11.608, 76.083, "കൽപ്പറ്റ"), "malappuram": (11.073, 76.074, "മലപ്പുറം"),
    "palakkad": (10.776, 76.654, "പാലക്കാട്"), "thrissur": (10.527, 76.214, "തൃശ്ശൂർ"),
    "kochi": (9.967, 76.243, "കൊച്ചി"), "kottayam": (9.591, 76.522, "കോട്ടയം"),
    "alappuzha": (9.498, 76.339, "ആലപ്പുഴ"), "pathanamthitta": (9.265, 76.787, "പത്തനംതിട്ട"),
    "kollam": (8.893, 76.614, "കൊല്ലം"), "thiruvananthapuram": (8.524, 76.936, "തിരുവനന്തപുരം"),
}

LOOKS = {   # land ramp at 0/30/55/75/90/100 % of the tile's elevation range
    "night": {"land": ["#0F2A1E", "#1E4A2C", "#4A6B33", "#8C7A45", "#C4925A", "#F0D9A8"],
              "sea": ("#050B14", "#0E2A3D"), "rim": ("#3FA7B5", 0.6), "other": "#5A6470", "ink": False},
    "ink":   {"land": ["#E4D8BC", "#CBBB95", "#A8926A", "#7C6547", "#4A3A2B", "#4A3A2B"],
              "sea": ("#EFE6D2", "#C9CFC4"), "rim": ("#7A2E1F", 0.35), "other": "#B9B2A2", "ink": True},
}
STOPS = [0, .30, .55, .75, .90, 1.0]


def _hex(c):
    c = c.lstrip("#"); return np.array([int(c[i:i + 2], 16) for i in (0, 2, 4)], dtype=np.float32)


def bounds_for(lat, lon, lat_span, size):
    lon_span = lat_span * (size[0] / size[1]) / math.cos(math.radians(lat))
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
            try:
                srcs.append(rasterio.open(f"/vsicurl/https://copernicus-dem-{glo}m.s3.amazonaws.com/{name}/{name}.tif"))
            except Exception:
                pass                          # ocean-only tiles don't exist
    h, wd = shape
    if not srcs:
        return np.zeros(shape, np.float32)
    with rasterio.Env(GDAL_DISABLE_READDIR_ON_OPEN="EMPTY_DIR", GDAL_HTTP_MAX_RETRY="4", GDAL_HTTP_RETRY_DELAY="2"):
        arr, _ = merge(srcs, bounds=bounds, res=((e - w) / wd, (n - s) / h), nodata=0, resampling=Resampling.bilinear)
    a = np.nan_to_num(arr[0].astype(np.float32))[:h, :wd]
    if a.shape != (h, wd):
        a = np.array(Image.fromarray(a).resize((wd, h), Image.BILINEAR))
    return np.clip(a, 0, 9000)


def shade(z, px_m, exag):
    gy, gx = np.gradient(z * exag, px_m)
    slope = np.arctan(np.hypot(gx, gy)); aspect = np.arctan2(-gx, gy)
    out = np.zeros_like(z)
    for az, wgt in ((315, 0.55), (255, 0.25), (15, 0.20)):              # multi-directional hillshade
        a, alt = math.radians(az), math.radians(38)
        out += wgt * (np.sin(alt) * np.cos(slope) + np.cos(alt) * np.sin(slope) * np.cos(a - aspect))
    return np.clip(out, 0, 1)


def _poly_mask(bounds, size, name="Kerala"):
    W0, S0, E0, N0 = bounds; w, h = size
    m = Image.new("L", size, 0); d = ImageDraw.Draw(m)
    for poly in json.loads((ROOT / "vendor" / "kerala.json").read_text())["states"].get(name, []):
        d.polygon([((x - W0) / (E0 - W0) * w, (N0 - y) / (N0 - S0) * h) for x, y in poly], fill=255)
    return np.asarray(m.filter(ImageFilter.GaussianBlur(2)), np.float32) / 255


def paint(z, bounds, look, lo, hi, kerala_only=True):
    L = LOOKS[look]
    h, w = z.shape
    px_m = (bounds[3] - bounds[1]) * 110570 / h
    water = z <= 0.5
    wm = Image.fromarray((water * 255).astype(np.uint8))       # water touching the edge = sea; rest = backwaters
    for x, y in [(x, 0) for x in range(0, w, 7)] + [(x, h - 1) for x in range(0, w, 7)] + \
                [(0, y) for y in range(0, h, 7)] + [(w - 1, y) for y in range(0, h, 7)]:
        if wm.getpixel((x, y)) == 255:
            ImageDraw.floodfill(wm, (x, y), 128)
    wa = np.asarray(wm); sea = wa == 128; inland = wa == 255
    f = np.clip((z - lo) / max(1.0, hi - lo), 0, 1)
    cols = np.stack([_hex(c) for c in L["land"]])
    land = np.stack([np.interp(f, STOPS, cols[:, k]) for k in range(3)], -1)
    hs = shade(z, px_m, 2.5 if px_m > 300 else (4 if px_m > 60 else 6))[..., None]
    if L["ink"]:
        dark = _hex("#2A1D14") / 255
        land = land * (1 - 0.35 * (1 - hs) * (1 - dark))
    else:
        land = land * (0.45 + 0.9 * hs) + np.array([14, 6, -6], np.float32) * (hs - 0.5)
    if kerala_only:                                          # Kerala is the hero: dim the neighbours
        k = _poly_mask(bounds, (w, h))[..., None]
        land = land * (k + (1 - k) * (_hex(L["other"]) / 255 * (0.8 if not L["ink"] else 1.0)))
    m = Image.fromarray((~sea * 255).astype(np.uint8))
    lm = Image.fromarray((~water * 255).astype(np.uint8))        # shelf glow measured in metres, same on every tile
    near = np.asarray(lm.filter(ImageFilter.GaussianBlur(float(np.clip(2500 / px_m, 3, 90)))), np.float32)[..., None] / 255
    s0, s1 = _hex(L["sea"][0]), _hex(L["sea"][1])
    seac = s0 + (s1 - s0) * np.clip(near * 1.6, 0, 1)
    img = np.where(water[..., None], seac, land)
    im = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))
    rim = m.filter(ImageFilter.FIND_EDGES).filter(ImageFilter.MaxFilter(3))
    im = Image.composite(Image.new("RGB", im.size, tuple(int(x) for x in _hex(L["rim"][0]))), im,
                         rim.point(lambda v: int(min(255, v) * L["rim"][1])))
    return im


def build(job: Path, force=False) -> Path:
    script = json.loads((job / "script.json").read_text(encoding="utf-8"))
    r = script["relief"]
    if "lat" not in r and r.get("q"):                     # place name only: geocode once, save into script.json
        from pipeline.route import geocode
        r["lat"], r["lon"] = [round(v, 4) for v in geocode({"q": r["q"], "en": r.get("en", r["q"].split(",")[0]), "alts": r.get("alts", []), "near": r.get("near")})]
        (job / "script.json").write_text(json.dumps(script, ensure_ascii=False, indent=2), encoding="utf-8")
    out = job / "relief"; out.mkdir(exist_ok=True)
    meta_p = out / "relief.json"
    look = r.get("look") or ("ink" if script.get("theme") == "inkwash" else "night")
    if meta_p.exists() and not force:
        m = json.loads(meta_p.read_text())
        if m.get("v") == 4 and m.get("look") == look and m.get("lat") == r["lat"] and m.get("lon") == r["lon"]:
            return out
    meta = {"v": 4, "lat": r["lat"], "lon": r["lon"], "look": look}
    for name, span, glo, size in TILES:
        clat, clon = (KERALA if name == "wide" else (r["lat"], r["lon"]))
        b = bounds_for(clat, clon, span, size)
        zp = out / f"{name}_{span}_{clat:.3f}_{clon:.3f}_z.png"
        if zp.exists():
            z = np.asarray(Image.open(zp), np.float32)
        else:
            z = dem(b, (size[1], size[0]), glo)
            Image.fromarray(np.clip(z, 0, 65535).astype(np.uint16)).save(zp, optimize=True)
        if name == "near":                                   # stretch the ramp to the town's own relief
            land = z[z > 0.5]
            lo, hi = (float(np.percentile(land, 2)), float(np.percentile(land, 98))) if land.size else (0.0, 100.0)
            hi = max(hi, lo + 60)
            hk = 0.5                                         # local range shown as 0.5 km (honest, not alpine)
        else:
            lo, hi, hk = 0.0, 2600.0, 2.6
        if name != "wide" and look == "night" and r.get("sat", True):     # real satellite land for the zoom-in
            sp = out / f"{name}_{span}_{clat:.3f}_{clon:.3f}_sat.jpg"
            if not sp.exists():
                from pipeline.route import sentinel_mosaic, grade
                img, _ = sentinel_mosaic(b, (size[1], size[0]))
                grade(img).save(sp, quality=88, optimize=True)
            Image.open(sp).save(out / f"{name}.jpg", quality=88, optimize=True)
        else:
            paint(z, b, look, lo, hi, kerala_only=(name == "wide")).save(out / f"{name}.jpg", quality=86, optimize=True)
        hm = np.array(Image.fromarray(z).resize((HM_W, HM_H), Image.BILINEAR))
        Image.fromarray(np.clip((hm - lo) / (hi - lo) * 255, 0, 255).astype(np.uint8)).save(out / f"{name}_h.png", optimize=True)
        meta[name] = {"b": [round(x, 5) for x in b], "hk": hk, "zmax": float(z.max())}
    if look == "night" and r.get("sat", True) and r.get("from") is not False:    # real road from the nearest town
        c = _nearest_city(r["lat"], r["lon"], r.get("from"))
        if c:
            try:
                from pipeline.route import osrm
                line, rkm, _ = osrm([(c["lat"], c["lon"]), (r["lat"], r["lon"])])
                meta["road"] = {"line": [[round(x, 5), round(y, 5)] for x, y in line[::max(1, len(line) // 600)]], "km": round(rkm, 1)}
            except Exception as e:
                print("road skipped", e)
    meta_p.write_text(json.dumps(meta))
    return out


def _uri(p: Path, mime):
    return f"data:{mime};base64," + base64.b64encode(p.read_bytes()).decode()


def _nearest_city(lat, lon, want=None):
    def km(c): return math.hypot((c[0] - lat) * 110.57, (c[1] - lon) * 111.32 * math.cos(math.radians(lat)))
    if want and str(want).lower() in CITIES:
        k = str(want).lower(); c = CITIES[k]; return {"lat": c[0], "lon": c[1], "name": c[2], "en": k.upper(), "km": round(km(c))}
    best = min((kc for kc in CITIES.items() if km(kc[1]) > 6), key=lambda kc: km(kc[1]), default=None)
    return {"lat": best[1][0], "lon": best[1][1], "name": best[1][2], "en": best[0].upper(), "km": round(km(best[1]))} if best and km(best[1]) < 120 else None


def scene_code(job: Path, script: dict) -> str:
    """The three.js fly-in scene for script['relief'] (builds the map files if needed)."""
    out = build(job)
    meta = json.loads((out / "relief.json").read_text())
    r = script["relief"]
    outline = json.loads((ROOT / "vendor" / "kerala.json").read_text())["states"]["Kerala"][0][::2]
    lat, lon = r["lat"], r["lon"]
    coords = f"{abs(lat):.2f}°{'N' if lat >= 0 else 'S'} {abs(lon):.2f}°{'E' if lon >= 0 else 'W'}"
    cfg = {
        "lat": lat, "lon": lon, "kerala": list(KERALA), "ink": meta["look"] == "ink",
        "tiles": {k: {"b": meta[k]["b"], "hk": meta[k]["hk"]} for k in ("wide", "mid", "near")},
        "town": r.get("town", ""), "kicker": r.get("kicker", "LOCATION"),
        "sub": (r.get("district", "") + " · " if r.get("district") else "") + coords,
        "source": r.get("source", "MAP: COPERNICUS DEM © DLR/ESA · NATURAL EARTH" + (" · CONTAINS MODIFIED COPERNICUS SENTINEL DATA · © OPENSTREETMAP" if meta.get("road") or meta.get("look") == "night" else "")),
        "outline": outline, "city": None if r.get("from") is False else _nearest_city(lat, lon, r.get("from")),
        "exag": r.get("exag", 5), "road": meta.get("road"),
    }
    imgs = "".join(f'<img id="rl_{k}{s}" src="{_uri(out / f"{k}{e}", m)}" style="display:none">'
                   for k in ("wide", "mid", "near") for s, e, m in (("", ".jpg", "image/jpeg"), ("h", "_h.png", "image/png")))
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
        (script.get("hud") or {}).pop(str(i), None)      # and the count-up chip


if __name__ == "__main__":
    for a in sys.argv[1:]:
        print(build(Path(a), force=True))
