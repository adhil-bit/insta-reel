"""Web research for a reel: Google News RSS + Wikipedia search + article text. Writes logs/research/<slug>.json"""
import json, os, re, sys, html, urllib.parse
import requests
slug, queries = sys.argv[1], [q.strip() for q in sys.argv[2].split("|") if q.strip()]
UA = {"User-Agent": "Mozilla/5.0 (research bot for a facts page; contact via GitHub)"}
out = {"queries": queries, "news": [], "wiki": [], "articles": []}
seen = set()
for q in queries:
    try:
        rss = requests.get("https://news.google.com/rss/search", params={"q": q, "hl": "en-IN", "gl": "IN", "ceid": "IN:en"}, headers=UA, timeout=30).text
        for it in re.findall(r"<item>(.*?)</item>", rss, re.S)[:8]:
            t = html.unescape(re.sub(r"<.*?>", "", re.search(r"<title>(.*?)</title>", it, re.S).group(1)))
            link = re.search(r"<link>(.*?)</link>", it, re.S).group(1).strip()
            date = (re.search(r"<pubDate>(.*?)</pubDate>", it) or [None, ""])[1]
            src = (re.search(r"<source[^>]*>(.*?)</source>", it) or [None, ""])[1]
            if t not in seen:
                seen.add(t); out["news"].append({"q": q, "title": t, "source": src, "date": date, "link": link})
    except Exception as e:
        out["news"].append({"q": q, "error": str(e)[:120]})
    try:
        w = requests.get("https://en.wikipedia.org/w/api.php", params={"action": "query", "list": "search", "srsearch": q, "format": "json", "srlimit": 3}, headers=UA, timeout=30).json()
        for r in w.get("query", {}).get("search", []):
            out["wiki"].append({"q": q, "title": r["title"], "snippet": html.unescape(re.sub(r"<.*?>", "", r["snippet"]))})
    except Exception as e:
        out["wiki"].append({"q": q, "error": str(e)[:120]})
for n in out["news"][:14]:                       # follow the top links and keep readable text
    if "link" not in n: continue
    try:
        r = requests.get(n["link"], headers=UA, timeout=30, allow_redirects=True)
        txt = re.sub(r"(?s)<(script|style|nav|header|footer).*?</\1>", " ", r.text)
        txt = html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", txt)))
        keep = " ".join(s for s in re.split(r"(?<=[.!?]) ", txt) if re.search(r"crow|കാക്ക|KSEB|electrocut|transformer|bird", s, re.I))[:3000]
        out["articles"].append({"title": n["title"], "url": r.url, "text": keep})
    except Exception as e:
        out["articles"].append({"title": n["title"], "error": str(e)[:120]})
os.makedirs("logs/research", exist_ok=True)
json.dump(out, open(f"logs/research/{slug}.json", "w"), indent=2, ensure_ascii=False)
print(len(out["news"]), "news,", len(out["wiki"]), "wiki,", len(out["articles"]), "articles")
