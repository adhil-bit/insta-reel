"""Preview a job's scene animations as a contact sheet (3 frames per scene), with the cinematic pass.

  python3 tools/preview.py jobs/<slug> /tmp/sheet.jpg

Needs: pip install playwright pillow && python3 -m playwright install chromium (if not preinstalled).
Prints 'anim_N.js errors: []' per scene - any error there must be fixed before rendering.
"""
import sys, os, json, tempfile
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT)); os.chdir(ROOT)
from pipeline import animate, cine, relief
from playwright.sync_api import sync_playwright
from PIL import Image

job, out, D = Path(sys.argv[1]).resolve(), Path(sys.argv[2]).resolve(), 7.0
script = json.loads((job / "script.json").read_text()) if (job / "script.json").exists() else {}
files = sorted(job.glob("anim_*.js"), key=lambda f: int(f.stem.split("_")[1]))
tmp = Path(tempfile.mkdtemp()); tiles = []
codes = [f.read_text() for f in files]
if script.get('relief') and (job / 'relief' / 'relief.json').exists(): relief.apply(job, script, codes)
with sync_playwright() as p:
    b = p.chromium.launch(args=['--enable-unsafe-swiftshader']); pg = b.new_page(viewport={"width": 1080, "height": 1920})
    for i, f in enumerate(files):
        code = cine.wrap(codes[i], script, i, i * D, len(files)) or ""
        doc = animate.TEMPLATE % {"W": 1080, "H": 1920, "THREE": animate.THREE_JS, "EARTH": animate.EARTH_TEX if "earthTex" in code else "",
                                  "SCENES": animate.SCENES_JS, "ACCENT": "#c2412d", "DURATION": D, "SEED": 1}
        hp = tmp / "pv.html"; hp.write_text(doc.replace("/*CODE*/", code), encoding="utf-8")
        errs = []; pg.on("pageerror", lambda e: errs.append(str(e))); pg.goto(hp.as_uri()); pg.wait_for_timeout(700)
        for t in (0.0, 2.0, D * 0.97):
            pg.evaluate("t => window.renderFrame(t)", t); pf = tmp / f"t_{f.stem}_{t}.png"; pg.screenshot(path=str(pf)); tiles.append(pf)
        print(f.name, "errors:", errs[:2])
    b.close()
ims = [Image.open(x).resize((270, 480)) for x in tiles]; rows = (len(ims) + 2) // 3
sheet = Image.new("RGB", (3 * 275, rows * 485), "white")
for i, im in enumerate(ims): sheet.paste(im, ((i % 3) * 275, (i // 3) * 485))
sheet.save(out); print("saved", out)
