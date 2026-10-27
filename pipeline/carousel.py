"""Weekly carousel: 4:5 slides (1080x1350) built from the reels' own cover animations.
Spec: carousels/<slug>.json  ->  output/carousel-<slug>/slide_01.jpg ...  (+ caption.txt)"""
import html
import json
from pathlib import Path

import config
from pipeline import animate

F = config.FONTS_DIR.resolve()
SW, SH = 1080, 1350
CSS = f"""
@font-face {{ font-family: Archivo; src: url('{(F / "ArchivoBlack-Regular.ttf").as_uri()}'); }}
@font-face {{ font-family: Noto; src: url('{(F / "NotoSansMalayalam.ttf").as_uri()}'); font-weight: 100 900; }}
@font-face {{ font-family: Inter; src: url('{(F / "Inter.ttf").as_uri()}'); font-weight: 100 900; }}
html,body {{ margin:0; width:{SW}px; height:{SH}px; overflow:hidden; background:#07080c; color:#fff; }}
.img {{ position:absolute; left:0; right:0; top:0; height:930px; background-size:cover; background-position:50% 38%; }}
.fade {{ position:absolute; left:0; right:0; top:560px; height:380px; background:linear-gradient(180deg, rgba(7,8,12,0), #07080c); }}
.num {{ position:absolute; left:70px; top:820px; font:400 120px Archivo; color:var(--a); }}
.t {{ position:absolute; left:70px; right:70px; top:965px; font:400 78px/1.0 Archivo; text-transform:uppercase; }}
.ml {{ position:absolute; left:70px; right:70px; top:1150px; font:700 44px/1.35 Noto; color:#e8e8ee; }}
.brand {{ position:absolute; left:70px; top:60px; font:800 26px Inter; letter-spacing:3px; color:rgba(255,255,255,.85);
          background:rgba(0,0,0,.45); padding:8px 16px; border-radius:20px; }}
.swipe {{ position:absolute; right:60px; bottom:50px; font:800 30px Inter; color:var(--a); }}
.grid {{ position:absolute; inset:0; display:grid; grid-template-columns:1fr 1fr; grid-template-rows:1fr 1fr; filter:brightness(.42); }}
.grid div {{ background-size:cover; background-position:50% 38%; }}
.big {{ position:absolute; left:70px; right:70px; top:470px; font:400 132px/0.98 Archivo; text-transform:uppercase; }}
.big b {{ font-weight:400; color:var(--a); }}
.kick {{ position:absolute; left:70px; right:70px; top:360px; font:700 54px/1.3 Noto; }}
.bar {{ position:absolute; left:70px; top:320px; width:120px; height:10px; border-radius:5px; background:var(--a); }}
.cta {{ position:absolute; left:80px; right:80px; top:330px; text-align:center; }}
.cta h1 {{ font:400 92px/1.05 Archivo; margin:0 0 40px; text-transform:uppercase; }}
.cta p {{ font:700 46px/1.45 Noto; margin:0 0 26px; color:#e8e8ee; }}
.cta .btn {{ display:inline-block; margin-top:30px; background:var(--a); color:#08090c; font:800 50px Inter; padding:22px 60px; border-radius:60px; }}
"""


def _frame(folder: Path, out: Path, accent: str) -> Path:
    """Render the reel's cover animation at a nice moment, full 1080x1920."""
    code = (folder / "anim_0.js").read_text()
    html_doc = (animate.TEMPLATE % {"W": 1080, "H": 1920, "THREE": animate.THREE_JS, "EARTH": animate.EARTH_TEX, "SCENES": animate.SCENES_JS,
                                     "ACCENT": accent, "DURATION": 5.0, "SEED": 1000}).replace("/*CODE*/", code)
    hp = out.with_suffix(".html"); hp.write_text(html_doc, encoding="utf-8")
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        b = p.chromium.launch(args=["--enable-unsafe-swiftshader"]); pg = b.new_page(viewport={"width": 1080, "height": 1920})
        pg.goto(hp.resolve().as_uri()); pg.wait_for_timeout(300); pg.evaluate("t => window.renderFrame(t)", 4.2)
        pg.screenshot(path=str(out), type="jpeg", quality=92); b.close()
    return out


def _shoot(body: str, accent: str, out: Path) -> Path:
    from playwright.sync_api import sync_playwright
    hp = out.with_suffix(".html")
    hp.write_text(f"<!doctype html><meta charset=utf-8><style>{CSS}</style><body style='--a:{accent}'>{body}</body>", encoding="utf-8")
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={"width": SW, "height": SH})
        pg.goto(hp.resolve().as_uri()); pg.wait_for_timeout(400); pg.screenshot(path=str(out), type="jpeg", quality=92); b.close()
    return out


def build(spec_path: Path) -> tuple[list[Path], str]:
    spec = json.loads(spec_path.read_text())
    accent = spec.get("accent", "#F59E3B")
    out = config.OUTPUT_DIR / f"carousel-{spec_path.stem}"; out.mkdir(parents=True, exist_ok=True)
    frames = [_frame(config.ROOT / "jobs" / it["folder"], out / f"frame_{i}.jpg", accent) for i, it in enumerate(spec["items"])]
    uri = lambda p: p.resolve().as_uri()
    slides = []
    grid = "".join(f"<div style=\"background-image:url('{uri(f)}')\"></div>" for f in frames[:4])
    head = "<br>".join(html.escape(l).replace(html.escape(spec.get("accent_word", "")), f"<b>{html.escape(spec.get('accent_word', ''))}</b>") if spec.get("accent_word") else html.escape(l) for l in spec["title_lines"])
    slides.append(_shoot(f"<div class=grid>{grid}</div><div class=brand>UNEXPLORED TRUTHS</div><div class=bar></div>"
                         f"<div class=kick>{html.escape(spec['title_ml'])}</div><div class=big>{head}</div><div class=swipe>SWIPE →</div>",
                         accent, out / "slide_01.jpg"))
    for i, (it, fr) in enumerate(zip(spec["items"], frames), 1):
        slides.append(_shoot(f"<div class=img style=\"background-image:url('{uri(fr)}')\"></div><div class=fade></div>"
                             f"<div class=brand>UNEXPLORED TRUTHS</div><div class=num>{i:02d}</div>"
                             f"<div class=t>{html.escape(it['title'])}</div><div class=ml>{html.escape(it['line_ml'])}</div>",
                             accent, out / f"slide_{i + 1:02d}.jpg"))
    slides.append(_shoot(f"<div class=brand>UNEXPLORED TRUTHS</div><div class=cta><h1>{html.escape(spec.get('cta_title', 'Which one surprised you?'))}</h1>"
                         f"<p>{html.escape(spec.get('cta_ml', 'ഓരോന്നിന്റെയും മുഴുവൻ കഥ ഞങ്ങളുടെ റീലുകളിലുണ്ട് 🎬'))}</p>"
                         f"<p>Save this · Share with a friend 📩</p><div class=btn>+ Follow</div></div>", accent, out / f"slide_{len(slides) + 1:02d}.jpg"))
    (out / "caption.txt").write_text(spec["caption"], encoding="utf-8")
    return slides, spec["caption"]
