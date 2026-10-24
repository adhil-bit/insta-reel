"""Catchy reel thumbnail (Instagram cover): the hero animation frame, a short English
kicker and a big Malayalam hook line, rendered in a headless browser so Malayalam
script is shaped correctly."""
import html
from pathlib import Path

import config

W, H = config.WIDTH, config.HEIGHT
FONTS = config.FONTS_DIR.resolve()


STRIP = ".,!?:;\"'“”‘’"


def _hook_html(text: str, accents: list[str], accent: str) -> str:
    accents = {a.strip(STRIP) for a in accents}
    out = []
    for word in text.split():
        clean = word.strip(STRIP)
        esc = html.escape(word)
        out.append(f'<span style="color:{accent}">{esc}</span>' if clean in accents else esc)
    return " ".join(out)


def render(script: dict, background: Path, out: Path) -> Path:
    from playwright.sync_api import sync_playwright

    cat = script["category"]
    accent = config.BRAND["categories"].get(cat, "#FACC15")
    hook = script.get("thumbnail_ml") or " ".join(script["headline"])
    accents = script.get("thumbnail_accent", [])
    kicker = " ".join(script["headline"])
    page = f"""<!doctype html><html><head><meta charset="utf-8"><style>
@font-face {{ font-family: Mal; src: url('{(FONTS / "NotoSansMalayalam.ttf").as_uri()}'); font-weight: 100 900; }}
@font-face {{ font-family: Heavy; src: url('{(FONTS / "ArchivoBlack-Regular.ttf").as_uri()}'); }}
@font-face {{ font-family: Inter; src: url('{(FONTS / "Inter.ttf").as_uri()}'); font-weight: 100 900; }}
html,body {{ margin:0; width:{W}px; height:{H}px; overflow:hidden; background:#05070b; }}
.bg {{ position:absolute; inset:0; background:url('{background.resolve().as_uri()}') center/cover; transform:scale(1.04); }}
.shade {{ position:absolute; inset:0; background:
   linear-gradient(180deg, rgba(4,6,10,.75) 0%, rgba(4,6,10,0) 14%, rgba(4,6,10,0) 38%, rgba(4,6,10,.88) 58%, rgba(4,6,10,.96) 100%); }}
.glow {{ position:absolute; left:50%; top:62%; width:1200px; height:700px; transform:translate(-50%,-50%);
   background:radial-gradient(closest-side, {accent}33, transparent); }}
.top {{ position:absolute; top:70px; left:64px; right:64px; display:flex; justify-content:space-between; align-items:center;
   font:700 26px Inter; letter-spacing:4px; color:#fff; }}
.pill {{ border:3px solid {accent}; color:{accent}; border-radius:24px; padding:6px 20px; font-size:22px; }}
.block {{ position:absolute; left:70px; right:70px; top:1050px; text-align:center; }}
.kicker {{ font:44px Heavy; color:#fff; letter-spacing:1px; opacity:.92; margin-bottom:34px; }}
.kicker:before {{ content:''; display:block; width:90px; height:10px; background:{accent}; margin:0 auto 30px; border-radius:5px; }}
.hook {{ overflow-wrap:anywhere; font-family:Mal; font-weight:800; color:#fff; line-height:1.32; text-shadow:0 4px 24px rgba(0,0,0,.8); }}
.handle {{ position:absolute; bottom:190px; width:100%; text-align:center; font:600 30px Inter; color:rgba(255,255,255,.75); }}
</style></head><body>
<div class="bg"></div><div class="glow"></div><div class="shade"></div>
<div class="top"><span>◍ {html.escape(config.BRAND['name'])}</span><span class="pill">{html.escape(cat)}</span></div>
<div class="block"><div class="kicker">{html.escape(kicker)}</div><div class="hook" id="hook">{_hook_html(hook, accents, accent)}</div></div>
<div class="handle">{html.escape(config.BRAND['handle'])}</div>
<script>
  // shrink the Malayalam line until it fits in its box
  const el = document.getElementById('hook'); let s = 96;
  el.style.fontSize = s + 'px';
  while ((el.scrollHeight > 380 || el.scrollWidth > el.clientWidth + 2) && s > 40) {{ s -= 3; el.style.fontSize = s + 'px'; }}
</script></body></html>"""
    html_path = out.with_suffix(".html")
    html_path.write_text(page, encoding="utf-8")
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": W, "height": H})
        pg.goto(html_path.resolve().as_uri())
        pg.wait_for_timeout(300)
        pg.screenshot(path=str(out), type="jpeg", quality=92)
        b.close()
    return out
