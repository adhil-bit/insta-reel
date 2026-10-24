"""Brand templates drawn with Pillow: the cover and the per-scene text overlay."""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

import config

W, H = config.WIDTH, config.HEIGHT
MARGIN = 64
HEAVY = config.FONTS_DIR / "ArchivoBlack-Regular.ttf"
TEXT = config.FONTS_DIR / "Inter.ttf"


def _font(path: Path, size: int, weight: str | None = None) -> ImageFont.FreeTypeFont:
    font = ImageFont.truetype(str(path), size)
    if weight:
        try:
            font.set_variation_by_name(weight)
        except Exception:
            pass
    return font


def _rgb(hex_color: str, alpha: int = 255) -> tuple:
    h = hex_color.lstrip("#")
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), alpha)


def _accent(category: str) -> tuple:
    return _rgb(config.BRAND["categories"].get(category, "#FACC15"))


def _gradient(stops: list[tuple[float, int]]) -> Image.Image:
    """Black layer whose alpha follows (position 0-1, alpha) stops top to bottom."""
    alphas = []
    for y in range(H):
        p = y / (H - 1)
        for (p0, a0), (p1, a1) in zip(stops, stops[1:]):
            if p0 <= p <= p1:
                t = 0 if p1 == p0 else (p - p0) / (p1 - p0)
                t = t * t * (3 - 2 * t)  # smoothstep
                alphas.append(int(a0 + (a1 - a0) * t))
                break
        else:
            alphas.append(stops[-1][1])
    mask = Image.new("L", (1, H))
    mask.putdata(alphas)
    layer = Image.new("RGBA", (W, H), (6, 8, 14, 0))
    layer.putalpha(mask.resize((W, H)))
    return layer


def _tracked(draw, xy, text, font, fill, tracking=0) -> int:
    """Draw text with letter spacing. Returns the end x."""
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += draw.textlength(ch, font=font) + tracking
    return int(x - tracking)


def _tracked_width(draw, text, font, tracking=0) -> int:
    return int(sum(draw.textlength(ch, font=font) for ch in text) + tracking * (len(text) - 1))


def _header(img: Image.Image, category: str) -> None:
    draw = ImageDraw.Draw(img)
    accent = _accent(category)
    label = _font(TEXT, 26, "Bold")
    y = 78
    # Brand mark: small ring + name
    draw.ellipse((MARGIN, y + 2, MARGIN + 24, y + 26), outline=(255, 255, 255, 235), width=3)
    draw.line((MARGIN + 12, y + 2, MARGIN + 12, y + 26), fill=(255, 255, 255, 235), width=2)
    _tracked(draw, (MARGIN + 38, y), config.BRAND["name"].upper(), label, (255, 255, 255, 235), 4)
    # Category pill
    tag = _font(TEXT, 22, "Bold")
    tw = _tracked_width(draw, category, tag, 4)
    x1 = W - MARGIN
    x0 = x1 - tw - 40
    draw.rounded_rectangle((x0, y - 6, x1, y + 34), radius=20, outline=accent, width=3)
    _tracked(draw, (x0 + 20, y + 1), category, tag, accent, 4)


def _shadowed_text(img: Image.Image, draw_fn) -> None:
    """Run draw_fn on a shadow layer and on the image, for legible text on any photo."""
    shadow = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw_fn(ImageDraw.Draw(shadow), shadow=True)
    shadow = shadow.filter(ImageFilter.GaussianBlur(14))
    img.alpha_composite(shadow)
    draw_fn(ImageDraw.Draw(img), shadow=False)


def _colored_line(draw, x, y, words, font, accent_words, accent, shadow, center=False):
    white = _rgb(config.BRAND["text_color"])
    space = draw.textlength(" ", font=font)
    widths = [draw.textlength(w, font=font) for w in words]
    total = sum(widths) + space * (len(words) - 1)
    if center:
        x = (W - total) / 2
    for word, w in zip(words, widths):
        clean = word.strip(".,!?:;\"'").upper()
        color = accent if clean in accent_words else white
        draw.text((x, y), word, font=font, fill=(0, 0, 0, 200) if shadow else color)
        x += w + space


def _wrap(draw, text, font, max_width) -> list[list[str]]:
    lines, current = [], []
    for word in text.split():
        trial = " ".join(current + [word])
        if current and draw.textlength(trial, font=font) > max_width:
            lines.append(current)
            current = [word]
        else:
            current.append(word)
    if current:
        lines.append(current)
    return lines


def prepare_background(src: Path, out: Path) -> Path:
    """Crop any image to 9:16 at 2x size so the slow zoom stays sharp."""
    img = Image.open(src).convert("RGB")
    img = ImageOps.fit(img, (W * 2, H * 2), Image.LANCZOS, centering=(0.5, 0.4))
    img.save(out, quality=92)
    return out


def make_cover_overlay(script: dict, out: Path) -> Path:
    category = script["category"]
    accent = _accent(category)
    img = _gradient([(0, 150), (0.12, 0), (0.45, 0), (0.72, 225), (1, 250)])
    _header(img, category)

    lines = script["headline"][:3]
    probe = ImageDraw.Draw(img)
    size = 168
    while size > 70:
        font = _font(HEAVY, size)
        if max(probe.textlength(l, font=font) for l in lines) <= W - 2 * MARGIN:
            break
        size -= 4
    line_h = int(size * 1.0)
    block_h = line_h * len(lines)
    top = H - 360 - block_h
    handle_font = _font(TEXT, 30, "SemiBold")
    accent_words = set(script.get("accent_words", []))

    def draw_text(draw, shadow):
        for i, line in enumerate(lines):
            _colored_line(draw, MARGIN, top + i * line_h, line.split(), font,
                          accent_words, accent, shadow)
        if not shadow:
            draw.rectangle((MARGIN, top - 44, MARGIN + 78, top - 34), fill=accent)
            draw.text((MARGIN, top + block_h + 40), config.BRAND["handle"],
                      font=handle_font, fill=(255, 255, 255, 200))

    _shadowed_text(img, draw_text)
    img.save(out)
    return out


def make_scene_overlay(scene: dict, category: str, out: Path) -> Path:
    accent = _accent(category)
    img = _gradient([(0, 140), (0.12, 0), (0.5, 0), (0.78, 210), (1, 235)])
    _header(img, category)

    font = _font(HEAVY, 76)
    probe = ImageDraw.Draw(img)
    lines = _wrap(probe, scene["caption"].upper(), font, W - 2 * MARGIN - 40)
    line_h = 92
    top = int(H * 0.70) - (line_h * len(lines)) // 2
    highlight = {scene.get("highlight", "").upper()}
    handle_font = _font(TEXT, 28, "SemiBold")

    def draw_text(draw, shadow):
        for i, words in enumerate(lines):
            _colored_line(draw, 0, top + i * line_h, words, font, highlight, accent,
                          shadow, center=True)
        if not shadow:
            hw = draw.textlength(config.BRAND["handle"], font=handle_font)
            draw.text(((W - hw) / 2, H - 150), config.BRAND["handle"],
                      font=handle_font, fill=(255, 255, 255, 170))

    _shadowed_text(img, draw_text)
    img.save(out)
    return out


def compose_preview(bg: Path, overlay: Path, out: Path) -> Path:
    """Flatten background + overlay into one image (used for the cover preview)."""
    base = Image.open(bg).convert("RGBA").resize((W, H), Image.LANCZOS)
    base.alpha_composite(Image.open(overlay).convert("RGBA"))
    base.convert("RGB").save(out, quality=92)
    return out
