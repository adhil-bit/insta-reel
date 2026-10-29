"""Find similar Instagram creators via web search, then read their public profile numbers (Business Discovery)."""
import html, json, os, re, sys, urllib.parse
import requests
sys.path.insert(0, ".")
import config
from pipeline.instagram import GRAPH
UA = {"User-Agent": "Mozilla/5.0 (research for a facts page)"}
queries = [q for q in os.environ.get("QUERIES", "").split("|") if q]
extra = [h.strip().lstrip("@").lower() for h in os.environ.get("HANDLES", "").split("|") if h.strip()]
found = {}
for q in queries:
    try:
        r = requests.post("https://html.duckduckgo.com/html/", data={"q": q}, headers=UA, timeout=30).text
        snips = [re.sub(r"<.*?>", "", x) for x in re.findall(r'class="result__snippet"[^>]*>(.*?)</a>', r, re.S)]
        for i, m in enumerate(re.finditer(r'class="result__a" href="([^"]+)"[^>]*>(.*?)</a>', r, re.S)):
            u = html.unescape(m.group(1)); u = urllib.parse.unquote(re.search(r"uddg=([^&]+)", u).group(1)) if "uddg=" in u else u
            hm = re.search(r"instagram\.com/([A-Za-z0-9_.]+)/?", u)
            if hm and hm.group(1).lower() not in ("p", "reel", "reels", "explore", "stories", "accounts", "tv"):
                sn = html.unescape(snips[i]) if i < len(snips) else ""
                cur = found.setdefault(hm.group(1).lower(), {"query": q, "title": re.sub(r"<.*?>", "", m.group(2))[:120], "snippet": ""})
                if re.search(r"Followers", sn) or not cur["snippet"]: cur["snippet"] = sn[:300]
    except Exception as e:
        print("search failed", q, e)
for h in extra:
    found.setdefault(h, {"query": "given", "title": ""})
out = {"profiles": []}
fields = "business_discovery.username({h}){{username,name,biography,followers_count,follows_count,media_count,media.limit(12){{caption,like_count,comments_count,timestamp,media_product_type}}}}"
for h, meta in list(found.items())[:25]:
    row = {"handle": h, **meta}
    try:
        j = requests.get(f"{GRAPH}/{config.IG_USER_ID}", params={"fields": fields.format(h=h), "access_token": config.IG_ACCESS_TOKEN}, timeout=60).json()
        if "business_discovery" in j: row["profile"] = j["business_discovery"]
        else: row["error"] = j.get("error", {}).get("message", "")[:160]
    except Exception as e:
        row["error"] = str(e)[:160]
    out["profiles"].append(row)
os.makedirs("logs", exist_ok=True); json.dump(out, open("logs/discover.json", "w"), indent=2, ensure_ascii=False)
print(len(found), "handles;", sum(1 for p in out["profiles"] if "profile" in p), "profiles read")
