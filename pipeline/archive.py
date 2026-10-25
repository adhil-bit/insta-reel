"""'Archive' reel template: every scene plays inside a tilted photo print on a dark desk,
with a black label-tape caption, a handwritten note and a red stamp on the cover.
The page wraps the live animation (the animation draws into #stage)."""
import html

import config

F = config.FONTS_DIR.resolve()
CAT_ML = {"HISTORY": "ചരിത്രം", "SCIENCE": "ശാസ്ത്രം", "NATURE": "പ്രകൃതി", "MYSTERY": "രഹസ്യം", "SPACE": "ബഹിരാകാശം",
          "MONEY": "പണം", "TECH": "സാങ്കേതികം", "CLIMATE": "കാലാവസ്ഥ", "WORLD": "ലോകം"}

CSS = f"""
@font-face {{ font-family: Baloo; src: url('{(F / "BalooChettan2.ttf").as_uri()}'); font-weight: 400 800; }}
@font-face {{ font-family: Chilanka; src: url('{(F / "Chilanka-Regular.ttf").as_uri()}'); }}
@font-face {{ font-family: Noto; src: url('{(F / "NotoSansMalayalam.ttf").as_uri()}'); font-weight: 100 900; }}
@font-face {{ font-family: Inter; src: url('{(F / "Inter.ttf").as_uri()}'); font-weight: 100 900; }}
html,body {{ margin:0; width:{config.WIDTH}px; height:{config.HEIGHT}px; overflow:hidden; }}
body {{ background: radial-gradient(circle at 50% 28%, #3c3833, #1b1916 70%); }}
.grain {{ position:absolute; inset:0; opacity:.18; background-image:
   repeating-linear-gradient(17deg, rgba(255,255,255,.05) 0 2px, transparent 2px 6px),
   repeating-linear-gradient(-23deg, rgba(0,0,0,.25) 0 1px, transparent 1px 7px); }}
.brand {{ position:absolute; top:70px; left:90px; font:700 30px Inter; color:#cfc6b4; }}
.tab {{ position:absolute; top:58px; right:90px; background:#C23A2E; color:#F4F0E6; font:700 32px Noto; padding:12px 28px 8px; border-radius:6px 6px 0 0;
        transform:rotate(1deg); box-shadow:0 6px 0 #8f2a21; }}
.photo {{ position:absolute; left:92px; right:92px; top:180px; height:980px; background:#ECE5D6; padding:26px 26px 112px; box-sizing:border-box;
          transform:rotate(-2.2deg); box-shadow:0 34px 70px rgba(0,0,0,.65); }}
#stage {{ position:relative; width:100%; height:100%; overflow:hidden; background:#0c0c0c; }}
#stage canvas {{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:50% 34%; filter:saturate(.9) contrast(1.04); }}
.note {{ position:absolute; bottom:30px; left:40px; right:40px; font:400 46px Chilanka; color:#3a2f22; }}
.tape {{ position:absolute; left:104px; right:104px; top:1300px; transform:rotate(1.2deg); }}
.tape span {{ display:inline; background:#111; color:#F4F0E6; font:700 var(--fs, 72px)/1.55 Noto, Inter; padding:6px 22px;
             box-decoration-break:clone; -webkit-box-decoration-break:clone; }}
.stamp {{ position:absolute; right:120px; top:150px; width:230px; height:230px; border:9px solid #C23A2E; border-radius:50%; color:#C23A2E;
          display:flex; align-items:center; justify-content:center; font:800 62px Baloo; transform:rotate(14deg); opacity:.88; }}
.handle {{ position:absolute; left:104px; bottom:150px; font:600 30px Inter; color:#a89f8e; }}
"""


def _fit(text: str, big: int, small: int) -> int:
    n = len(text)
    return big if n <= 24 else (big + small) // 2 if n <= 40 else small


def page(kind: str, script: dict, scene: dict | None, index: int, total: int, file_no: int) -> str:
    cat = CAT_ML.get(script.get("category", ""), "ഫയൽ")
    if kind == "cover":
        tape = script.get("thumbnail_ml") or " ".join(script.get("headline", []))
        note = " ".join(w.capitalize() for w in " ".join(script.get("headline", [])).split())
        extra = '<div class="stamp">സത്യം</div>'
        fs = _fit(tape, 88, 70)
    else:
        tape = scene.get("caption_ml") or scene.get("caption", "")
        note = f"{index} / {total}"
        extra = ""
        fs = _fit(tape, 78, 62)
    return f"""<style>{CSS}</style><div class="grain"></div>
<div class="brand">{html.escape(config.BRAND['name'].title())}</div>
<div class="tab">ഫയൽ #{file_no} · {html.escape(cat)}</div>
<div class="photo"><div id="stage"></div><div class="note">{html.escape(note)}</div></div>
{extra}<div class="tape" style="--fs:{fs}px"><span>{html.escape(tape)}</span></div>
<div class="handle">{html.escape(config.BRAND['handle'])}</div>"""


def endcard_page(script: dict, file_no: int) -> str:
    ec = config.BRAND.get("end_card", {})
    return f"""<style>{CSS}
.card {{ position:absolute; left:110px; right:110px; top:430px; background:#ECE5D6; padding:70px 60px 80px; transform:rotate(-1.5deg);
         box-shadow:0 34px 70px rgba(0,0,0,.65); text-align:center; }}
.card h2 {{ margin:0; font:400 54px Chilanka; color:#3a2f22; }}
.card h1 {{ margin:24px 0 0; font:800 92px/1.25 Baloo; color:#1C1A17; }}
.card .btn {{ display:inline-block; margin-top:46px; background:#111; color:#F4F0E6; font:800 52px Inter; padding:20px 54px; }}
.card .share {{ margin-top:34px; font:600 40px Noto; color:#5a4f40; }}
.stamp2 {{ position:absolute; right:130px; top:330px; width:220px; height:220px; border:9px solid #C23A2E; border-radius:50%; color:#C23A2E;
           display:flex; align-items:center; justify-content:center; font:800 54px Baloo; transform:rotate(-12deg); opacity:.9; }}
</style><div class="grain"></div><div class="brand">{html.escape(config.BRAND['name'].title())}</div>
<div class="card"><h2>{html.escape(ec.get('ask', 'ഇഷ്ടപ്പെട്ടോ?'))}</h2>
<h1>അടുത്ത ഫയൽ തുറക്കാൻ ഫോളോ ചെയ്യൂ</h1><div class="btn">＋ Follow</div>
<div class="share">{html.escape(ec.get('share', 'ഒരു സുഹൃത്തിന് അയച്ചുകൊടുക്കൂ 📩'))}</div></div>
<div class="stamp2">ഫോളോ</div><div class="handle">{html.escape(config.BRAND['handle'])}</div>"""
