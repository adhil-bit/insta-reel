"""'Explainer' reel template, modelled on popular map/explainer pages:
full-bleed visuals, a punchy English headline that pops in at the top of every scene,
Malayalam subtitles that follow the narration word by word, labelled pins, a tiny
sources line, and a big bold headline on the cover."""
import html
import json
import re

import config

F = config.FONTS_DIR.resolve()


def _accent_html(text: str, accent_words: list[str]) -> str:
    out = []
    for w in text.split():
        bare = re.sub(r"[^\w']", "", w).upper()
        hit = any(bare == re.sub(r"[^\w']", "", a).upper() for a in accent_words)
        out.append(f'<b>{html.escape(w)}</b>' if hit else html.escape(w))
    return " ".join(out)


def _chunks(text: str, speech_secs: float, start: float = 0.08) -> list[dict]:
    """Split narration into short subtitle chunks and estimate when each word is spoken
    (proportional to word length; close enough for phrase-level captions)."""
    words = text.split()
    if not words:
        return []
    weights = [len(w) + 2 for w in words]
    total = sum(weights)
    span = max(0.5, speech_secs - start - 0.1)
    times, acc = [], start
    for w in weights:
        times.append(acc)
        acc += span * w / total
    chunks, cur = [], []
    for i, w in enumerate(words):
        cur.append(i)
        if len(cur) >= 4 or re.search(r"[.,?!:;]$", w):
            chunks.append(cur); cur = []
    if cur:
        chunks.append(cur)
    out = []
    for ci, idx in enumerate(chunks):
        end = times[chunks[ci + 1][0]] if ci + 1 < len(chunks) else start + span + 0.3
        out.append({"w": [words[i] for i in idx], "ts": [round(times[i], 3) for i in idx],
                    "a": round(times[idx[0]], 3), "b": round(end, 3)})
    return out


def _css(accent: str) -> str:
    return f"""
@font-face {{ font-family: Archivo; src: url('{(F / "ArchivoBlack-Regular.ttf").as_uri()}'); }}
@font-face {{ font-family: Noto; src: url('{(F / "NotoSansMalayalam.ttf").as_uri()}'); font-weight: 100 900; }}
@font-face {{ font-family: Inter; src: url('{(F / "Inter.ttf").as_uri()}'); font-weight: 100 900; }}
.ov {{ position:absolute; inset:0; z-index:50; pointer-events:none; }}
.vig {{ position:absolute; inset:0; background:
   linear-gradient(180deg, rgba(0,0,0,.62) 0%, rgba(0,0,0,0) 24%, rgba(0,0,0,0) 58%, rgba(0,0,0,.72) 86%, rgba(0,0,0,.85) 100%); }}
.head {{ position:absolute; top:210px; left:56px; right:56px; text-align:center; font:400 94px/1.02 Archivo; color:#fff;
        text-transform:uppercase; letter-spacing:-1px; text-shadow:0 6px 28px rgba(0,0,0,.65); will-change:transform,opacity; }}
.head b {{ font-weight:400; color:{accent}; }}
.sub {{ position:absolute; left:70px; right:70px; bottom:400px; text-align:center; font:700 56px/1.38 Noto, Inter; color:#fff;
       text-shadow:0 3px 14px rgba(0,0,0,.9); }}
.sub span {{ transition:none; }}
.sub span.on {{ color:{accent}; }}
.pill {{ position:absolute; transform:translate(-50%,-50%) scale(0); background:rgba(12,12,16,.78); border:3px solid {accent};
        color:#fff; font:800 30px Inter; padding:10px 22px 8px; border-radius:40px; letter-spacing:1.5px; white-space:nowrap;
        box-shadow:0 0 30px {accent}55; }}
.pill i {{ display:inline-block; width:14px; height:14px; border-radius:50%; background:{accent}; margin-right:12px; vertical-align:1px; font-style:normal; }}
.src {{ position:absolute; bottom:330px; left:60px; right:60px; text-align:center; font:500 20px Inter; color:rgba(255,255,255,.42); }}
.brand {{ position:absolute; top:150px; left:64px; font:800 28px Inter; letter-spacing:3px; color:rgba(255,255,255,.85); }}
.brand em {{ font-style:normal; color:{accent}; margin-left:14px; border:2px solid {accent}; border-radius:20px; padding:2px 14px; font-size:22px; }}
.cover {{ position:absolute; left:64px; right:64px; bottom:430px; }}
.cover .kick {{ font:700 50px/1.35 Noto; color:#fff; margin-bottom:22px; text-shadow:0 3px 14px rgba(0,0,0,.9); }}
.cover .kick b {{ color:{accent}; }}
.cover .big {{ font:400 150px/0.98 Archivo; color:#fff; text-transform:uppercase; letter-spacing:-2px; text-shadow:0 8px 34px rgba(0,0,0,.7); }}
.cover .big b {{ font-weight:400; color:{accent}; }}
.bar {{ width:120px; height:10px; background:{accent}; border-radius:5px; margin-bottom:26px; }}
"""


GLOBE = r'''
<canvas id="globe" width="1080" height="1920" style="position:absolute;inset:0;width:100%;height:100%"></canvas>
<div id="gring" style="position:absolute;left:50%;top:50%;width:24px;height:24px;margin:-12px 0 0 -12px;border-radius:50%;background:ACC;opacity:0"></div>
<script>
(function(){
  const LAT = %(LAT)s, LON = %(LON)s, D = %(D)s;
  let R = null, cam, scene, globe;
  function init() {
    const c = document.getElementById('globe');
    R = new THREE.WebGLRenderer({canvas: c, antialias: true, preserveDrawingBuffer: true}); R.setSize(1080, 1920, false);
    scene = new THREE.Scene(); cam = new THREE.PerspectiveCamera(32, 1080 / 1920, 0.1, 100);
    const tex = new THREE.Texture(document.getElementById('earthTex')); tex.needsUpdate = true;
    globe = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 64), new THREE.MeshPhongMaterial({map: tex, shininess: 12}));
    scene.add(globe); scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.06, 64, 48), new THREE.MeshBasicMaterial({color: 0x5aa8ff, transparent: true, opacity: 0.12, side: THREE.BackSide})));
    scene.add(new THREE.AmbientLight(0x8090a0, 0.9)); const sun = new THREE.DirectionalLight(0xffffff, 1.0); sun.position.set(-3, 2, 5); scene.add(sun);
  }
  const io = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2, cl = x => Math.min(1, Math.max(0, x));
  const prev = window.overlayFrame;
  window.overlayFrame = function (t) {
    if (!R) init();
    const k = io(cl(t / (D * 0.42))), fade = 1 - cl((t / D - 0.48) / 0.14);
    globe.rotation.set(LAT * Math.PI / 180 * k, -(LON + 90) * Math.PI / 180 + (1 - k) * 1.6, 0);
    cam.position.set(0, 0, 6.2 - 4.05 * k); cam.lookAt(0, 0, 0);
    R.setClearColor(0x03060c, 1); R.render(scene, cam);
    document.getElementById('globe').style.opacity = fade;
    const ring = document.getElementById('gring'), p = (t * 1.2) % 1;
    ring.style.opacity = k > 0.75 ? fade : 0; ring.style.boxShadow = `0 0 0 ${8 + p * 50}px rgba(255,255,255,${0.35 * (1 - p)})`;
    if (prev) prev(t);
  };
})();
</script>'''


JS = """
<script>
(function(){
  const S = %(STATE)s;
  const ease = x => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
  const back = x => { x = Math.min(1, Math.max(0, x)); const c = 1.7; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  window.overlayFrame = function (t) {
    const head = document.getElementById('head');
    if (head) { const k = ease(t / 0.45); head.style.opacity = k; head.style.transform = `translateY(${(1 - k) * 40}px) scale(${0.86 + 0.14 * back(t / 0.5)})`; }
    const cov = document.getElementById('cov');
    if (cov) { const k = ease(t / 0.5); cov.style.opacity = k; cov.style.transform = `translateY(${(1 - k) * 60}px)`; }
    const sub = document.getElementById('sub');
    if (sub) {
      const c = S.chunks.find(c => t >= c.a && t < c.b) || null;
      if (!c) { sub.innerHTML = ''; }
      else {
        let h = '';
        c.w.forEach((w, i) => { const on = t >= c.ts[i] && (i + 1 >= c.ts.length || t < c.ts[i + 1]); h += `<span class="${on ? 'on' : ''}">${w}</span> `; });
        sub.innerHTML = h;
        const k = ease((t - c.a) / 0.18); sub.style.opacity = k; sub.style.transform = `translateY(${(1 - k) * 16}px)`;
      }
    }
    S.pills.forEach((p, i) => { const el = document.getElementById('pill' + i); if (!el) return;
      const k = back((t - p.at) / 0.35); el.style.transform = `translate(-50%,-50%) scale(${t < p.at || t > p.until ? 0 : k})`; });
  };
})();
</script>"""


def page(kind: str, script: dict, scene: dict, duration: float, speech: float) -> str:
    accent = config.BRAND["categories"].get(script.get("category", ""), "#FACC15")
    pills = []
    opening = script.get("opening") or {}
    globe_on = kind == "cover" and opening.get("type") == "globe" and "lat" in opening and "lon" in opening
    if globe_on and opening.get("label"):
        pills.append({"text": opening["label"], "x": 0.5, "y": 0.455, "at": 0.36 * duration, "until": 0.5 * duration})
    for p in (script.get("cover_labels", []) if kind == "cover" else scene.get("labels", [])):
        at = p.get("at", 0.6)
        until = p.get("until", 99)
        pills.append({"text": p["text"], "x": p.get("x", 0.5), "y": p.get("y", 0.45), "at": at if at > 1 else at * duration,
                      "until": until if until > 1 else until * duration})
    if kind == "cover":
        kick = html.escape(script.get("thumbnail_ml", ""))
        for a in script.get("thumbnail_accent", []):
            kick = kick.replace(html.escape(a), f"<b>{html.escape(a)}</b>")
        body = f"""<div class="brand">UNEXPLORED TRUTHS<em>{html.escape(script.get('category', ''))}</em></div>
<div class="cover" id="cov"><div class="bar"></div><div class="kick">{kick}</div>
<div class="big" style="font-size:{min(150, int(950 / (0.7 * max(len(l) for l in script.get('headline', ['X'])))))}px">{'<br>'.join(_accent_html(l, script.get('accent_words', [])) for l in script.get('headline', []))}</div></div>"""
        chunks = []
    else:
        head = scene.get("caption", "")
        body = f'<div class="head" id="head">{_accent_html(head, [scene.get("highlight", "")])}</div><div class="sub" id="sub"></div>'
        chunks = _chunks(scene.get("voiceover", ""), speech)
    src = " · ".join((script.get("topic", {}).get("sources") or script.get("sources") or [])[:2])
    body += "".join(f'<div class="pill" id="pill{i}" style="left:{p["x"] * 100}%;top:{p["y"] * 100}%"><i></i>{html.escape(p["text"])}</div>'
                    for i, p in enumerate(pills))
    state = json.dumps({"chunks": chunks, "pills": pills}, ensure_ascii=False)
    globe_html = (GLOBE.replace("%(LAT)s", str(opening["lat"])).replace("%(LON)s", str(opening["lon"]))
                  .replace("%(D)s", f"{duration:.3f}").replace("ACC", accent)) if globe_on else ""
    globe_mark, globe_js = (globe_html.split("<script>", 1)[0], "<script>" + globe_html.split("<script>", 1)[1]) if globe_on else ("", "")
    return (f'<style>{_css(accent)}</style><div class="ov">{globe_mark}<div class="vig"></div>{body}'
            f'<div class="src">Sources: {html.escape(src)} · Animated illustration</div></div>' + JS.replace("%(STATE)s", state) + globe_js)
