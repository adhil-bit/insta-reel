"""2-second 'follow us' end card added to every reel, in Malayalam, over a blurred
still of the reel's last scene so it feels like part of the video."""
import html
from pathlib import Path

import config
from .utils import run

W, H, FPS = config.WIDTH, config.HEIGHT, config.FPS
FONTS = config.FONTS_DIR.resolve()


def _card_png(script: dict, background: Path, out: Path, html_override: str | None = None) -> Path:
    from playwright.sync_api import sync_playwright
    accent = config.BRAND["categories"].get(script["category"], "#FACC15")
    ec = config.BRAND.get("end_card", {})
    page = f"""<!doctype html><html><head><meta charset="utf-8"><style>
@font-face {{ font-family: Mal; src: url('{(FONTS / "NotoSansMalayalam.ttf").as_uri()}'); font-weight: 100 900; }}
@font-face {{ font-family: Inter; src: url('{(FONTS / "Inter.ttf").as_uri()}'); font-weight: 100 900; }}
html,body {{ margin:0; width:{W}px; height:{H}px; overflow:hidden; background:#05070b; }}
.bg {{ position:absolute; inset:-40px; background:url('{background.resolve().as_uri()}') center/cover; filter: blur(22px) brightness(.45); }}
.wrap {{ position:absolute; left:80px; right:80px; top:560px; text-align:center; color:#fff; }}
.ask {{ font:700 52px Mal; opacity:.85; margin-bottom:26px; }}
.main {{ font:800 86px Mal; line-height:1.3; text-shadow:0 4px 24px rgba(0,0,0,.7); }}
.main b {{ color:{accent}; }}
.btn {{ display:inline-flex; align-items:center; gap:18px; margin-top:64px; padding:26px 64px; border-radius:60px; background:{accent};
        color:#08090c; font:800 54px Inter; box-shadow:0 0 60px {accent}88; }}
.handle {{ margin-top:40px; font:700 44px Inter; color:rgba(255,255,255,.9); }}
.share {{ margin-top:22px; font:600 40px Mal; color:rgba(255,255,255,.7); }}
</style></head><body><div class="bg"></div><div class="wrap">
<div class="ask">{html.escape(ec.get("ask", "ഇഷ്ടപ്പെട്ടോ?"))}</div>
<div class="main">{ec.get("main_html", "കൂടുതൽ കഥകൾക്ക് <b>ഫോളോ</b> ചെയ്യൂ")}</div>
<div class="btn">＋ Follow</div>
<div class="handle">{html.escape(config.BRAND["handle"])}</div>
<div class="share">{html.escape(ec.get("share", "ഒരു സുഹൃത്തിന് അയച്ചുകൊടുക്കൂ 📩"))}</div>
</div></body></html>"""
    if html_override:
        page = "<!doctype html><meta charset=utf-8>" + html_override
    hp = out.with_suffix(".html"); hp.write_text(page, encoding="utf-8")
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={"width": W, "height": H})
        pg.goto(hp.resolve().as_uri()); pg.wait_for_timeout(300); pg.screenshot(path=str(out)); b.close()
    return out


def make(script: dict, background: Path, work: Path, html: str | None = None) -> Path:
    """Render the end card as a clip with the same format as the scene clips."""
    secs = config.END_CARD_SECONDS
    png = _card_png(script, background, work / "endcard.png", html)
    out = work / "clip_end.mp4"
    frames = int(secs * FPS)
    run(["ffmpeg", "-y", "-v", "error", "-loop", "1", "-i", str(png),
         "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo",
         "-filter_complex", f"[0:v]scale={W * 2}:{H * 2},zoompan=z='1+0.0006*on':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
                            f":d=1:s={W}x{H}:fps={FPS},fade=t=in:st=0:d=0.25,format=yuv420p[v]",
         "-map", "[v]", "-map", "1:a", "-frames:v", str(frames), "-t", f"{secs:.3f}", "-r", str(FPS),
         "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-c:a", "aac", "-b:a", "192k", "-ac", "2", str(out)])
    return out
