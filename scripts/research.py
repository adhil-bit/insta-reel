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
    try:                                         # Bing News RSS gives the articles' real addresses
        rss = requests.get("https://www.bing.com/news/search", params={"q": q, "format": "rss", "cc": "IN"}, headers=UA, timeout=30).text
        for it in re.findall(r"<item>(.*?)</item>", rss, re.S)[:8]:
            t = html.unescape(re.sub(r"<.*?>", "", re.search(r"<title>(.*?)</title>", it, re.S).group(1)))
            link = html.unescape(re.search(r"<link>(.*?)</link>", it, re.S).group(1).strip())
            qs = urllib.parse.parse_qs(urllib.parse.urlparse(link).query); link = qs.get("url", [link])[0]
            desc = html.unescape(re.sub(r"<.*?>", "", (re.search(r"<description>(.*?)</description>", it, re.S) or [None, ""])[1]))
            date = (re.search(r"<pubDate>(.*?)</pubDate>", it) or [None, ""])[1]
            if t not in seen:
                seen.add(t); out["news"].append({"q": q, "title": t, "source": urllib.parse.urlparse(link).netloc, "date": date, "link": link, "desc": desc[:300], "direct": True})
    except Exception as e:
        out["news"].append({"q": q, "error": "bing " + str(e)[:100]})
    try:
        w = requests.get("https://en.wikipedia.org/w/api.php", params={"action": "query", "list": "search", "srsearch": q, "format": "json", "srlimit": 3}, headers=UA, timeout=30).json()
        for r in w.get("query", {}).get("search", []):
            out["wiki"].append({"q": q, "title": r["title"], "snippet": html.unescape(re.sub(r"<.*?>", "", r["snippet"]))})
    except Exception as e:
        out["wiki"].append({"q": q, "error": str(e)[:120]})
def real_url(title):
    """Google News links are JS redirects: find the publisher's own URL via DuckDuckGo's HTML search."""
    r = requests.post("https://html.duckduckgo.com/html/", data={"q": title}, headers=UA, timeout=30).text
    m = re.search(r'class="result__a" href="([^"]+)"', r)
    if not m: return None
    u = html.unescape(m.group(1))
    if "uddg=" in u: u = urllib.parse.unquote(re.search(r"uddg=([^&]+)", u).group(1))
    return u
picks = [n for n in out["news"] if "title" in n]
want = os.environ.get("FOLLOW", "")
if want: picks = [n for n in picks if any(w.lower() in n["title"].lower() for w in want.split("|"))] or picks
for n in picks[:12]:                             # follow the links and keep readable text
    try:
        url = real_url(re.sub(r" - [^-]+$", "", n["title"])) or n["link"]
        r = requests.get(url, headers=UA, timeout=30, allow_redirects=True)
        txt = re.sub(r"(?s)<(script|style|nav|header|footer).*?</\1>", " ", r.text)
        txt = html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", txt)))
        kw = os.environ.get("KEYWORDS", "crow|കാക്ക|KSEB|electrocut|transformer|bird")
        keep = " ".join(s for s in re.split(r"(?<=[.!?]) ", txt) if re.search(kw, s, re.I))[:3500]
        out["articles"].append({"title": n["title"], "url": r.url, "text": keep})
    except Exception as e:
        out["articles"].append({"title": n["title"], "error": str(e)[:120]})
os.makedirs("logs/research", exist_ok=True)
json.dump(out, open(f"logs/research/{slug}.json", "w"), indent=2, ensure_ascii=False)
print(len(out["news"]), "news,", len(out["wiki"]), "wiki,", len(out["articles"]), "articles")
