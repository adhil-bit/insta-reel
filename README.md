# AutoReel

Claude finds a trending topic, writes the script, writes a fresh code animation for
every scene, and the pipeline renders it, adds voiceover, brand captions and music,
and posts it to Instagram as a Reel.

```
topic (Claude + web search) → script (Claude) → voice → animations (Claude writes JS,
headless Chromium renders each frame) → video (FFmpeg) → music → Instagram
```

## How the code animations work

For each scene Claude writes a small JavaScript program (Canvas 2D or three.js) that
defines `renderFrame(t)`, i.e. "draw the frame at time t". A headless browser calls it
30 times per second of voiceover and FFmpeg stitches the frames into video, so every
animation is new, exactly as long as its voice line, and needs no image API.

Built-in safety net: if an animation crashes, renders a blank frame or is missing
`renderFrame`, the error goes back to Claude to fix (up to 2 retries). If it still fails,
a built-in animated globe is used so the reel always finishes. Every animation's code is
saved in `output/<reel>/work/anim_N.js` so you can reuse the ones you like.

Prefer still images instead? Set `VISUAL_MODE=image` in `.env`.

## 1. Install

- Python 3.10 or newer
- FFmpeg: Windows `winget install ffmpeg` · Mac `brew install ffmpeg` · Linux `sudo apt install ffmpeg`

```bash
pip install -r requirements.txt
playwright install chromium # the browser that renders the animations
cp .env.example .env        # then fill in your keys
python main.py preview      # tests animation rendering, templates and FFmpeg, no keys needed
```

Open `output/_preview/` and check `cover.jpg`, `scene.jpg` and `preview.mp4`.

## 2. Make it your brand

Edit `BRAND` in `config.py`: page name, handle, niche, category colours and the image
style that every visual shares. Re-run `python main.py preview` until you like the look.

Put royalty-free tracks (`.mp3`, `.wav`, `.m4a`) in `music/`. One is picked at random per
reel. Only use music you have the rights to, or Instagram may mute the reel.

## 3. API keys (.env)

| What | Where |
|---|---|
| `ANTHROPIC_API_KEY` | console.anthropic.com (docs: docs.claude.com) |
| `ELEVENLABS_API_KEY` + `ELEVENLABS_VOICE_ID` | elevenlabs.io, pick a voice and copy its ID |
| `OPENAI_API_KEY` | platform.openai.com, cheaper voice option (`VOICE_PROVIDER=openai`) |
| `PEXELS_API_KEY` | only if you switch to `VISUAL_MODE=image` with stock photos |

With code animations you only need Claude + one voice provider.

**Render time:** each second of video is 30 browser frames. On a normal laptop expect a
few minutes per reel; `RENDER_WORKERS` in `.env` (default 3) renders scenes in parallel.

## 4. Connect Instagram

1. In the Instagram app: Settings → Account type → switch to **Professional** (Creator or Business).
2. Go to developers.facebook.com → My Apps → Create App → add the **Instagram** product.
3. Choose **Instagram API with Instagram Login** (simplest, no Facebook Page needed):
   - Add your Instagram account as a tester and accept the invite in the app.
   - Generate an access token with the `instagram_business_basic` and
     `instagram_business_content_publish` permissions.
   - In `.env` set `IG_GRAPH_HOST=graph.instagram.com`, your token, and your IG user ID
     (shown next to the token, or call `https://graph.instagram.com/me?fields=user_id&access_token=TOKEN`).
4. Tokens expire (long-lived tokens last about 60 days). Refresh it before then.

Using the Facebook Login version instead? Keep `IG_GRAPH_HOST=graph.facebook.com` and use
the `instagram_content_publish` permission with a Page-linked account.

## 5. Daily use

```bash
python main.py make                         # trending topic, saved for review
python main.py make --topic "Why Venice is sinking"
python main.py list                         # what's waiting
python main.py post 20261024-0930-why-venice-is-sinking
```

`make` prints every factual claim and its sources. Watch the reel and check those
claims before you post. One wrong fact on an explainer page costs more than a day's views.

`python main.py auto` skips review and posts straight away. Only use it once you trust the output.

## 6. Run it on a schedule

Mac/Linux, make a reel every day at 9:00 (crontab -e):
```
0 9 * * * cd /path/to/autoreel && /usr/bin/python3 main.py make >> log.txt 2>&1
```
Windows: Task Scheduler → Create Basic Task → run `python main.py make` with
"Start in" set to the project folder.

## 7. Run it in the cloud (no laptop needed after setup)

The pipeline runs on GitHub Actions: free, scheduled, and it has the time and tools
(FFmpeg, a browser) that rendering needs. Serverless hosts like Vercel can't run it,
because their functions are capped at a few minutes and a small bundle size.

**One-time setup (from a computer)**
1. Create a GitHub account (use the page's email to stay anonymous) and a **private** repository.
2. Push the project:
   ```bash
   cd autoreel
   git init && git add . && git commit -m "init"
   git branch -M main
   git remote add origin https://github.com/<account>/<repo>.git
   git push -u origin main
   ```
   Uploading through the website instead? Drag-and-drop often skips the hidden `.github`
   folder. Add the two workflow files with *Add file → Create new file*, typing the path
   `.github/workflows/make-reel.yml` (and `post-reel.yml`) and pasting the contents.
3. Repo **Settings → Secrets and variables → Actions**
   - Secrets: `ANTHROPIC_API_KEY`, `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID`,
     `IG_USER_ID`, `IG_ACCESS_TOKEN` (or `OPENAI_API_KEY` for voice)
   - Variables (optional): `VOICE_PROVIDER=openai`, `IG_GRAPH_HOST=graph.facebook.com`
     if you use Facebook Login, `AUTO_POST=true` to skip review, `RENDER_WORKERS`
4. **Actions** tab → enable workflows → *Make reel* → *Run workflow* to test it.

Put your music tracks in `music/` before pushing (the repo is private).

**Daily routine (from your phone's browser)**
- Every day at 09:00 IST a new reel appears under **Releases** with the video, cover,
  caption and the fact-check list. Change the time in `make-reel.yml` (`cron`, in UTC).
- Like it: **Actions → Post reel → Run workflow** (leave the name empty for the newest).
- Don't: same workflow with action **reject**.
- Want a specific topic: *Make reel → Run workflow* and type it in.

Free GitHub accounts include 2,000 Actions minutes a month for private repos, enough for
a reel a day. The Instagram token expires after about 60 days: update the
`IG_ACCESS_TOKEN` secret before then.

## Files

```
main.py               commands (preview / make / list / post / skip / auto)
.github/workflows/    cloud schedule (make-reel.yml) and posting (post-reel.yml)
config.py             keys, brand, video settings
pipeline/claude.py    topic research + script writing
pipeline/animate.py   code animations: render, check, retry, fallback
pipeline/media.py     voice (ElevenLabs or OpenAI) + images for image mode
pipeline/design.py    cover + caption templates
pipeline/video.py     zoom animation, concat, music, export
pipeline/instagram.py Reels publishing (resumable upload, no hosting needed)
fonts/                Archivo Black + Inter (SIL Open Font License)
vendor/three.min.js   three.js r128 for 3D animations (MIT), works offline
music/                your royalty-free tracks
output/               one folder per reel: reel.mp4, cover.jpg, caption.txt, script.json
```

## Troubleshooting

- **`ffmpeg not found`**: install FFmpeg and restart the terminal.
- **Playwright / browser errors**: run `playwright install chromium` again.
- **An animation looks off**: open `work/anim_N.html` in your browser, then in the console
  run `renderFrame(2)` to see the frame at 2 seconds. Edit `anim_N.js` and tweak.
- **JSON errors from Claude**: just run `make` again; it's rare.
- **Instagram `(#10) permission` error**: the token is missing the publish permission or the account isn't Professional.
- **Instagram processing ERROR**: usually a video spec issue; check `reel.mp4` plays and is under 15 minutes.
