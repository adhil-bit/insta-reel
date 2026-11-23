"""Route-map reels ("design": "route"): a satellite 3D journey along real roads.

script.json:
  "design": "route",
  "route": {
    "stops": [{"en": "PAYYANUR", "ml": "പയ്യന്നൂർ", "q": "Payyanur, Kannur, Kerala"}, ...],   # q = geocoder query (or lat/lon)
    "pois":  [{"en": "KAVVAYI BACKWATERS", "ml": "കവ്വായി കായൽ", "q": "Kavvayi, Kannur", "bubble": true}, ...],
    "scenes": {"0": {"mode": "overview"}, "1": {"from": 0.0, "to": 0.15, "title": 0}, ...}
  }

Build (GitHub runner, internet):  python -m pipeline.route jobs/<slug>
  - geocodes stops/POIs (OpenStreetMap Nominatim), driving route on real roads (OSRM, OpenStreetMap data)
  - cloud-free Sentinel-2 true-colour mosaic (Copernicus data, free incl. commercial use with credit)
  - Copernicus DEM heights (see relief.py)
  -> jobs/<slug>/route/{sat.jpg, sat_h.png, route.json}
At render time route.apply() swaps every scene listed in route.scenes for the three.js journey scene.
"""
from __future__ import annotations

import base64
import json
import math
import sys
import time
from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
UA = {"User-Agent": "insta-reel-route/1.0 (github.com/adhil-bit/insta-reel)"}
TEX_MAX = 3072
HM = 400


def _get(url, params=None, data=None, timeout=60):
    import requests
    for k in range(4):
        try:
            r = (requests.post(url, json=data, headers=UA, timeout=timeout) if data is not None
                 else requests.get(url, params=params, headers=UA, timeout=timeout))
            r.raise_for_status(); return r.json()
        except Exception:
            if k == 3: raise
            time.sleep(2 + 3 * k)


def geocode(p):
    if "lat" in p and "lon" in p:
        return p["lat"], p["lon"]
    js = _get("https://nominatim.openstreetmap.org/search", {"q": p["q"], "format": "json", "limit": 1, "countrycodes": "in"})
    time.sleep(1.2)
    if not js:
        raise RuntimeError(f"geocode failed: {p['q']}")
    return float(js[0]["lat"]), float(js[0]["lon"])


def osrm(points):
    coords = ";".join(f"{lon:.6f},{lat:.6f}" for lat, lon in points)
    js = _get(f"https://router.project-osrm.org/route/v1/driving/{coords}", {"overview": "full", "geometries": "geojson"})
    r = js["routes"][0]
    return [(c[1], c[0]) for c in r["geometry"]["coordinates"]], r["distance"] / 1000.0, [l["distance"] / 1000.0 for l in r["legs"]]


def sentinel_mosaic(bounds, shape):
    """Least-cloudy Sentinel-2 L2A true-colour mosaic over bounds (w,s,e,n) -> uint8 (h,w,3)."""
    import rasterio
    from rasterio.vrt import WarpedVRT
    from rasterio.enums import Resampling
    from rasterio.crs import CRS
    from rasterio.transform import from_bounds
    w, s, e, n = bounds; h, wd = shape
    body = {"collections": ["sentinel-2-l2a"], "bbox": [w, s, e, n], "limit": 40,
            "datetime": "2024-12-01T00:00:00Z/2026-04-30T23:59:59Z",
            "query": {"eo:cloud_cover": {"lt": 20}}, "sortby": [{"field": "properties.eo:cloud_cover", "direction": "asc"}]}
    items = _get("https://earth-search.aws.element84.com/v1/search", data=body).get("features", [])
    out = np.zeros((h, wd, 3), np.float32); have = np.zeros((h, wd), bool)
    tr = from_bounds(w, s, e, n, wd, h); dst = CRS.from_epsg(4326)
    env = dict(GDAL_DISABLE_READDIR_ON_OPEN="EMPTY_DIR", AWS_NO_SIGN_REQUEST="YES", GDAL_HTTP_MAX_RETRY="4", GDAL_HTTP_RETRY_DELAY="2")
    used = []
    with rasterio.Env(**env):
        for it in items[:12]:
            if have.mean() > 0.995:
                break
            try:
                vis = it["assets"]["visual"]["href"]; scl = it["assets"]["scl"]["href"]
                with rasterio.open(vis) as src, WarpedVRT(src, crs=dst, transform=tr, width=wd, height=h, resampling=Resampling.bilinear) as v:
                    rgb = v.read([1, 2, 3]).transpose(1, 2, 0).astype(np.float32)
                with rasterio.open(scl) as src, WarpedVRT(src, crs=dst, transform=tr, width=wd, height=h, resampling=Resampling.nearest) as v:
                    c = v.read(1)
            except Exception as ex:
                print("skip scene", it.get("id"), ex); continue
            good = (rgb.sum(-1) > 0) & ~np.isin(c, [0, 1, 3, 8, 9, 10])
            take = good & ~have
            out[take] = rgb[take]; have |= take; used.append(it["id"])
            print(f"scene {it['id']} cloud {it['properties'].get('eo:cloud_cover')}: filled {have.mean():.3f}")
    if not have.all():                                      # any gaps: blur-fill from neighbours
        fill = np.asarray(Image.fromarray(out.astype(np.uint8)).filter(ImageFilter.GaussianBlur(25)), np.float32)
        out[~have] = fill[~have]
    return np.clip(out, 0, 255).astype(np.uint8), used


def grade(img):
    im = Image.fromarray(img)
    im = ImageEnhance.Contrast(im).enhance(1.18); im = ImageEnhance.Color(im).enhance(1.25); im = ImageEnhance.Brightness(im).enhance(1.05)
    return im.filter(ImageFilter.UnsharpMask(radius=2, percent=60, threshold=2))


def build(job: Path, force=False) -> Path:
    from pipeline.relief import dem
    script = json.loads((job / "script.json").read_text(encoding="utf-8"))
    R = script["route"]
    out = job / "route"; out.mkdir(exist_ok=True)
    if (out / "route.json").exists() and not force:
        return out
    def loc(p):
        la, lo = geocode(p); return dict(p, lat=la, lon=lo)
    stops = [loc(p) for p in R["stops"]]
    pois = [loc(p) for p in R.get("pois", [])]
    line, km, legs = osrm([(p["lat"], p["lon"]) for p in stops])
    lats = [a for a, _ in line] + [p["lat"] for p in pois]; lons = [b for _, b in line] + [p["lon"] for p in pois]
    s, n, w, e = min(lats), max(lats), min(lons), max(lons)
    cl = math.cos(math.radians((s + n) / 2)); mx = max((n - s), (e - w) * cl) * 0.45 + 0.03
    s, n = s - mx, n + mx; w, e = w - mx / cl, e + mx / cl
    wkm, hkm = (e - w) * 111.32 * cl, (n - s) * 110.57
    sc = TEX_MAX / max(wkm, hkm); size = (int(wkm * sc), int(hkm * sc))
    img, used = sentinel_mosaic((w, s, e, n), (size[1], size[0]))
    grade(img).save(out / "sat.jpg", quality=88, optimize=True)
    z = dem((w, s, e, n), (HM * size[1] // max(size), HM * size[0] // max(size)), 30)
    zmax = float(max(50.0, np.percentile(z, 99.5)))
    Image.fromarray(np.clip(z / zmax * 255, 0, 255).astype(np.uint8)).save(out / "sat_h.png", optimize=True)
    cum = [0.0]
    for (a1, b1), (a2, b2) in zip(line, line[1:]):
        cum.append(cum[-1] + math.hypot((a2 - a1) * 110.57, (b2 - b1) * 111.32 * cl))
    stop_at = []
    for p in stops:                                          # position of each stop along the line (0..1)
        i = min(range(len(line)), key=lambda k: (line[k][0] - p["lat"]) ** 2 + (line[k][1] - p["lon"]) ** 2)
        stop_at.append(cum[i] / cum[-1])
    meta = {"b": [w, s, e, n], "zmax_km": zmax / 1000.0, "km": round(km, 1), "legs": [round(x, 1) for x in legs],
            "line": [[round(a, 6), round(b, 6)] for a, b in line[::max(1, len(line) // 1500)]],
            "stops": stops, "stop_at": stop_at, "pois": pois, "scenes_used": used}
    (out / "route.json").write_text(json.dumps(meta, ensure_ascii=False))
    print(json.dumps({"km": meta["km"], "legs": meta["legs"], "stops": [(p["en"], p["lat"], p["lon"]) for p in stops],
                      "pois": [(p["en"], p["lat"], p["lon"]) for p in pois], "tex": size}, ensure_ascii=False))
    return out


def _uri(p: Path, mime):
    return f"data:{mime};base64," + base64.b64encode(p.read_bytes()).decode()


def scene_code(job: Path, script: dict, i: int) -> str:
    out = job / "route"
    meta = json.loads((out / "route.json").read_text())
    cfg = {"meta": meta, "scene": (script["route"].get("scenes") or {}).get(str(i), {}),
           "credit": "Contains modified Copernicus Sentinel data · © OpenStreetMap contributors · Illustrative map"}
    imgs = (f'<img id="rt_sat" src="{_uri(out / "sat.jpg", "image/jpeg")}" style="display:none">'
            f'<img id="rt_h" src="{_uri(out / "sat_h.png", "image/png")}" style="display:none">')
    js = (Path(__file__).resolve().parent / "lib" / "route_scene.js").read_text(encoding="utf-8")
    return "document.write(" + json.dumps(imgs) + ");\nconst RT = " + json.dumps(cfg, ensure_ascii=False) + ";\n" + js


def apply(job: Path, script: dict, codes: list) -> None:
    R = script.get("route")
    if not R or not codes:
        return
    try:
        build(job)
    except Exception as e:
        print(f"route map skipped ({e})"); return
    for k in (R.get("scenes") or {}):
        i = int(k)
        if i < len(codes):
            codes[i] = scene_code(job, script, i)


if __name__ == "__main__":
    for a in sys.argv[1:]:
        print(build(Path(a), force=True))
