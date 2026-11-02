"""Fetch lead images (with licence + author) for Wikipedia pages, for use in reels. Writes assets/<slug>/*.jpg + credits.json"""
import json, os, sys, re, requests
slug, titles = sys.argv[1], [t for t in sys.argv[2].split("|") if t]
UA = {"User-Agent": "autoreel/1.0 (facts page; contact via GitHub)"}
os.makedirs(f"assets/{slug}", exist_ok=True); credits = []
for title in titles:
    try:
        j = requests.get("https://en.wikipedia.org/w/api.php", params={"action": "query", "titles": title, "prop": "pageimages|images", "piprop": "original|name", "format": "json", "redirects": 1, "imlimit": 30}, headers=UA, timeout=30).json()
        page = next(iter(j["query"]["pages"].values()))
        files = ([page["pageimage"]] if page.get("pageimage") else []) + [i["title"].replace("File:", "") for i in page.get("images", []) if re.search(r"\.(jpe?g|png)$", i["title"], re.I)]
        for fname in files[:4]:
            info = requests.get("https://commons.wikimedia.org/w/api.php", params={"action": "query", "titles": "File:" + fname, "prop": "imageinfo", "iiprop": "url|extmetadata", "iiurlwidth": 1600, "format": "json"}, headers=UA, timeout=30).json()
            ii = next(iter(info["query"]["pages"].values())).get("imageinfo", [{}])[0]
            if not ii.get("thumburl"): continue
            md = ii.get("extmetadata", {}); lic = md.get("LicenseShortName", {}).get("value", "?"); artist = re.sub(r"<.*?>", "", md.get("Artist", {}).get("value", "?"))[:80]
            out = f"assets/{slug}/{re.sub(r'[^A-Za-z0-9]+', '_', fname)[:60]}.jpg"
            open(out, "wb").write(requests.get(ii["thumburl"], headers=UA, timeout=60).content)
            credits.append({"page": title, "file": fname, "path": out, "license": lic, "author": artist, "source": ii.get("descriptionurl")}); print("got", fname, lic, artist)
    except Exception as e:
        print("failed", title, e)
    try:
        ex = requests.get("https://en.wikipedia.org/w/api.php", params={"action": "query", "prop": "extracts", "explaintext": 1, "titles": title, "format": "json", "redirects": 1}, headers=UA, timeout=30).json()
        credits.append({"page": title, "extract": next(iter(ex["query"]["pages"].values())).get("extract", "")[:9000]})
    except Exception as e:
        print("no text", title, e)
json.dump(credits, open(f"assets/{slug}/credits.json", "w"), indent=2, ensure_ascii=False)
