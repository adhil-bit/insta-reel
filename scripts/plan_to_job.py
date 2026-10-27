"""Turn a locked design plan (plans/<slug>.json) into jobs/<slug>/script.json for the builder."""
import json
import sys
from pathlib import Path

slug = sys.argv[1]
plan = json.loads(Path(f"plans/{slug}.json").read_text())
assert plan.get("locked"), "plan is not locked"
cover = plan["cover"]
script = {
    "topic": {"title": plan["title"], "category": plan["category"], "angle": plan["facts"][0]["claim"],
              "key_facts": [f["claim"] for f in plan["facts"]], "sources": sorted({f["source"] for f in plan["facts"]})},
    "category": plan["category"], "priority": plan["priority"], "template": "explainer",
    "opening": plan.get("opening", {"type": "hero"}),
    "headline": cover["headline"], "accent_words": cover["accent_words"],
    "thumbnail_ml": cover["thumbnail_ml"], "thumbnail_accent": cover.get("thumbnail_accent", []),
    "hook_voiceover": cover["hook_voiceover_ml"], "cover_visual": cover["visual"],
    "scenes": [{"voiceover": s["voiceover_ml"], "caption": s["headline"], "highlight": s.get("highlight", ""),
                "labels": s.get("labels", []), "kicker": s.get("kicker", ""), "visual": s["visual"]} for s in plan["scenes"]],
    "instagram_caption": plan["instagram_caption"], "fact_check": plan["fact_check"],
    "plan_locked": True,
}
if plan.get("voice", "auto") != "auto":
    script["voice_lock"] = plan["voice"]
out = Path(f"jobs/{slug}"); out.mkdir(exist_ok=True)
(out / "script.json").write_text(json.dumps(script, indent=2, ensure_ascii=False))
print(f"jobs/{slug}/script.json written; now write anim_0..anim_{len(plan['scenes'])}.js from the build_cmds")
