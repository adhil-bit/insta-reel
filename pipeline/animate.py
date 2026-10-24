"""Code-based animation: Claude writes a JavaScript animation for each scene,
a headless browser renders it frame by frame, FFmpeg encodes the frames."""
import re
import subprocess
from pathlib import Path

from PIL import Image, ImageStat

import config

W, H, FPS = config.WIDTH, config.HEIGHT, config.FPS
THREE_JS = (config.ROOT / "vendor" / "three.min.js").resolve().as_uri()


class AnimationError(Exception):
    pass


# Helpers every animation can use. Claude's code is inserted at /*CODE*/.
TEMPLATE = """<!doctype html><html><head><meta charset="utf-8">
<style>html,body{margin:0;padding:0;background:#04060b;overflow:hidden;width:%(W)dpx;height:%(H)dpx}
canvas{display:block;position:absolute;left:0;top:0}</style>
<script src="%(THREE)s"></script></head><body><script>
const W=%(W)d, H=%(H)d, ACCENT="%(ACCENT)s", DURATION=%(DURATION).3f;
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);
  t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const rand = mulberry32(%(SEED)d);
const lerp=(a,b,t)=>a+(b-a)*t, clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const ease={in:t=>t*t*t, out:t=>1-Math.pow(1-t,3),
  inOut:t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2, sine:t=>-(Math.cos(Math.PI*t)-1)/2};
function rgba(hex,a){const h=hex.replace('#','');return `rgba(${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)},${a})`}
function makeCanvas(){const c=document.createElement('canvas');c.width=W;c.height=H;document.body.appendChild(c);return c}
</script><script>
{ // block scope: lets animations use names like `top` or `name` safely
/*CODE*/
}
</script></body></html>"""

# Built-in animation: used by `preview`, as the style example for Claude,
# and as a fallback if a generated animation keeps failing.
FALLBACK_JS = r"""
const c = makeCanvas(), g = c.getContext('2d');
const cx = W/2, cy = H*0.38, R = W*0.36;
function layer(draw) {                          // pre-render static layers once
  const l = document.createElement('canvas'); l.width = W; l.height = H;
  draw(l.getContext('2d')); return l;
}
const bgLayer = layer(x => {
  const bg = x.createRadialGradient(cx, cy, R*0.2, cx, cy, H*0.9);
  bg.addColorStop(0, '#101a33'); bg.addColorStop(1, '#03050a');
  x.fillStyle = bg; x.fillRect(0, 0, W, H);
});
const glowLayer = layer(x => {
  const gl = x.createRadialGradient(cx, cy, R*0.9, cx, cy, R*1.4);
  gl.addColorStop(0, rgba(ACCENT, 0.35)); gl.addColorStop(1, rgba(ACCENT, 0));
  x.fillStyle = gl; x.beginPath(); x.arc(cx, cy, R*1.4, 0, 6.283); x.fill();
});
const bodyLayer = layer(x => {
  const b = x.createRadialGradient(cx-R*0.35, cy-R*0.4, R*0.1, cx, cy, R);
  b.addColorStop(0, '#2a4a8a'); b.addColorStop(0.7, '#0f1f44'); b.addColorStop(1, '#060b1a');
  x.fillStyle = b; x.beginPath(); x.arc(cx, cy, R, 0, 6.283); x.fill();
});
const stars = Array.from({length: 220}, () => ({x: rand()*W, y: rand()*H*0.8, r: rand()*1.8+0.4, p: rand()*6.28}));
const dots = Array.from({length: 1600}, () => ({lat: Math.asin(rand()*2-1), lon: rand()*Math.PI*2}));

window.renderFrame = function(t) {
  const k = t / DURATION;
  const band = ease.inOut(clamp(k*1.3));        // the story event: a heat band spreads
  g.globalAlpha = 1; g.drawImage(bgLayer, 0, 0);

  g.fillStyle = '#cfe0ff';
  for (const s of stars) {                      // twinkling stars
    g.globalAlpha = 0.3 + 0.3*Math.sin(s.p + t*2);
    g.fillRect(s.x, s.y, s.r*1.6, s.r*1.6);
  }
  g.globalAlpha = 0.35 + 0.65*band; g.drawImage(glowLayer, 0, 0);
  g.globalAlpha = 1; g.drawImage(bodyLayer, 0, 0);

  const rot = t*0.35;                           // continuous rotation
  for (const d of dots) {
    const lon = d.lon + rot;
    const x3 = Math.cos(d.lat)*Math.sin(lon), y3 = Math.sin(d.lat), z3 = Math.cos(d.lat)*Math.cos(lon);
    if (z3 < 0) continue;
    const heat = Math.exp(-Math.pow((d.lat + 0.1)/0.25, 2)) * band;
    const size = 1.5 + 2.5*z3 + heat*3;
    g.fillStyle = heat > 0.12 ? rgba(ACCENT, 0.35 + 0.65*heat) : `rgba(140,180,255,${0.12 + 0.5*z3})`;
    g.fillRect(cx + x3*R - size/2, cy - y3*R - size/2, size, size);
  }
  g.strokeStyle = rgba(ACCENT, 0.25 + 0.4*band); g.lineWidth = 3;
  g.beginPath(); g.arc(cx, cy, R, 0, 6.283); g.stroke();
};
"""


def extract_code(text: str) -> str:
    match = re.search(r"```(?:javascript|js)?\s*\n(.*?)```", text, re.S)
    code = match.group(1) if match else text
    return re.sub(r"</?script[^>]*>", "", code).strip()


def render(js_code: str, accent: str, duration: float, seed: int,
           html_path: Path, out: Path) -> Path:
    """Render the animation to an MP4 of exactly `duration` seconds."""
    from playwright.sync_api import Error as PlaywrightError, sync_playwright

    html = TEMPLATE % {"W": W, "H": H, "THREE": THREE_JS, "ACCENT": accent,
                       "DURATION": duration, "SEED": seed}
    html_path.write_text(html.replace("/*CODE*/", js_code), encoding="utf-8")
    frames = int(round(duration * FPS))
    errors: list[str] = []

    with sync_playwright() as p:
        browser = p.chromium.launch(args=["--enable-unsafe-swiftshader"])   # forcing ANGLE/SwiftShader made 2D canvas ~15x slower
        ffmpeg = None
        try:
            page = browser.new_page(viewport={"width": W, "height": H})
            page.on("pageerror", lambda e: errors.append(f"JS error: {e}"))
            page.on("console", lambda m: errors.append(f"console.error: {m.text}")
                    if m.type == "error" else None)
            page.goto(html_path.resolve().as_uri())
            page.wait_for_load_state("load")

            def frame(t: float) -> None:
                page.evaluate("t => window.renderFrame(t)", t)
                if errors:
                    raise AnimationError(f"At t={t:.2f}s: " + "; ".join(errors[:3]))

            if errors:
                raise AnimationError("; ".join(errors[:3]))
            if not page.evaluate("typeof window.renderFrame === 'function'"):
                raise AnimationError("window.renderFrame(t) is not defined.")

            # Sanity check: the middle frame must not be blank
            frame(duration / 2)
            sample = html_path.with_suffix(".check.png")
            page.screenshot(path=str(sample))
            if max(ImageStat.Stat(Image.open(sample).convert("L")).stddev) < 4:
                raise AnimationError("The frame is blank or almost one flat colour.")

            # Fast path: read pixels straight from the canvas, several frames per browser call
            # (about 2-3x faster than screenshots). Falls back to screenshots when a scene uses
            # more than one canvas or the canvas can't be read.
            fast = page.evaluate("document.querySelectorAll('canvas').length") == 1
            if fast:
                import base64, io
                b64 = page.evaluate("t => { window.renderFrame(t); return document.querySelector('canvas').toDataURL('image/jpeg', 0.92).split(',')[1]; }", duration / 2)
                img = Image.open(io.BytesIO(base64.b64decode(b64))).convert("L")
                fast = max(ImageStat.Stat(img).stddev) >= 4 and img.size == (W, H)
            ffmpeg = subprocess.Popen(
                ["ffmpeg", "-y", "-v", "error", "-f", "image2pipe", "-framerate", str(FPS),
                 "-c:v", "mjpeg", "-i", "-", "-c:v", "libx264", "-preset", "veryfast",
                 "-crf", "16", "-pix_fmt", "yuv420p", str(out)],
                stdin=subprocess.PIPE,
            )
            BATCH = 8
            for start in range(0, frames, BATCH):
                ts = [i / FPS for i in range(start, min(frames, start + BATCH))]
                if fast:
                    batch = page.evaluate("ts => ts.map(t => { window.renderFrame(t); return document.querySelector('canvas').toDataURL('image/jpeg', 0.92).split(',')[1]; })", ts)
                    if errors:
                        raise AnimationError(f"At t={ts[0]:.2f}s: " + "; ".join(errors[:3]))
                    for b in batch:
                        ffmpeg.stdin.write(base64.b64decode(b))
                else:
                    for t in ts:
                        frame(t)
                        ffmpeg.stdin.write(page.screenshot(type="jpeg", quality=92))
        except PlaywrightError as err:
            raise AnimationError(str(err).split("\n")[0][:500]) from None
        finally:
            if ffmpeg:
                ffmpeg.stdin.close()
                ffmpeg.wait()
            browser.close()

    if ffmpeg.returncode != 0:
        raise AnimationError("FFmpeg failed to encode the frames.")
    return out


def build(scene: dict, category: str, duration: float, idx: int, work: Path) -> Path:
    """Ask Claude for an animation, render it, retry with the error, then fall back."""
    from . import claude

    accent = config.BRAND["categories"].get(category, "#FACC15")
    out = work / f"anim_{idx}.mp4"
    code = claude.write_animation(scene, accent, duration)
    for attempt in range(3):
        try:
            (work / f"anim_{idx}.js").write_text(code, encoding="utf-8")
            render(code, accent, duration, seed=1000 + idx,
                   html_path=work / f"anim_{idx}.html", out=out)
            print(f"    animation {idx + 1} rendered")
            return out
        except AnimationError as err:
            print(f"    animation {idx + 1} attempt {attempt + 1} failed: {err}")
            if attempt < 2:
                code = claude.fix_animation(code, str(err))
    print(f"    animation {idx + 1}: using the built-in fallback")
    return render(FALLBACK_JS, accent, duration, seed=1000 + idx,
                  html_path=work / f"anim_{idx}.html", out=out)


def render_or_fallback(code: str | None, category: str, duration: float, idx: int, work: Path) -> Path:
    """Render ready-made animation code; use the built-in animation if it fails."""
    accent = config.BRAND["categories"].get(category, "#FACC15")
    out, html = work / f"anim_{idx}.mp4", work / f"anim_{idx}.html"
    if code:
        try:
            render(code, accent, duration, seed=1000 + idx, html_path=html, out=out)
            print(f"    animation {idx + 1} rendered")
            return out
        except AnimationError as err:
            print(f"    animation {idx + 1} failed ({err}), using the built-in fallback")
    return render(FALLBACK_JS, accent, duration, seed=1000 + idx, html_path=html, out=out)
