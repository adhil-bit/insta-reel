const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
function rockTexture(x, x0, y0, w, h, base) {          // grainy granite wall
  x.fillStyle = base; x.fillRect(x0, y0, w, h);
  for (let i = 0; i < 900; i++) { const px = x0 + rand() * w, py = y0 + rand() * h, r = 4 + rand() * 40, v = rand();
    x.fillStyle = v < 0.5 ? `rgba(0,0,0,${0.04 + rand() * 0.08})` : `rgba(255,240,220,${0.02 + rand() * 0.05})`;
    x.beginPath(); x.ellipse(px, py, r, r * (0.4 + rand() * 0.6), rand() * 3, 0, 6.283); x.fill(); }
  x.strokeStyle = 'rgba(0,0,0,0.25)'; x.lineWidth = 2;
  for (let i = 0; i < 40; i++) { let px = x0 + rand() * w, py = y0 + rand() * h; x.beginPath(); x.moveTo(px, py);
    for (let j = 0; j < 6; j++) { px += (rand() - 0.5) * 80; py += rand() * 50; x.lineTo(px, py); } x.stroke(); }
}
// carvings as polylines in a 0..100 box; drawn progressively like they are being engraved
const GLYPHS = {
  man: [[[50,10],[50,20]], [[42,4],[50,10],[58,4]], [[44,0],[50,4],[56,0]], [[50,20],[50,55]], [[50,28],[32,40]], [[50,28],[68,40]], [[50,55],[38,80]], [[50,55],[62,80]], [[44,10],[56,10],[56,20],[44,20],[44,10]]],
  animal: [[[15,40],[70,40],[80,30],[88,34],[80,46],[70,52],[20,52],[15,40]], [[25,52],[22,75]], [[38,52],[36,75]], [[58,52],[60,75]], [[68,52],[72,75]], [[15,42],[6,60]], [[82,30],[86,18]], [[86,30],[94,20]]],
  spiral: (() => { const p = []; for (let a = 0; a < 18; a += 0.3) p.push([50 + Math.cos(a) * a * 2.5, 50 + Math.sin(a) * a * 2.5]); return [p]; })(),
  sun: (() => { const s = [], c = []; for (let a = 0; a <= 6.4; a += 0.3) c.push([50 + Math.cos(a) * 18, 50 + Math.sin(a) * 18]); s.push(c);
    for (let i = 0; i < 10; i++) { const a = i / 10 * 6.283; s.push([[50 + Math.cos(a) * 26, 50 + Math.sin(a) * 26], [50 + Math.cos(a) * 42, 50 + Math.sin(a) * 42]]); } return s; })(),
  rings: (() => { const s = []; for (const r of [10, 22, 34]) { const c = []; for (let a = 0; a <= 6.4; a += 0.25) c.push([50 + Math.cos(a) * r, 50 + Math.sin(a) * r]); s.push(c); } s.push([[50, 10], [50, 90]]); s.push([[10, 50], [90, 50]]); return s; })(),
  dancer: [[[50,12],[50,50]], [[50,22],[30,8]], [[50,22],[70,8]], [[50,50],[34,74],[40,92]], [[50,50],[66,74],[60,92]], [[40,2],[60,2],[60,12],[40,12],[40,2]], [[36,2],[44,-8],[50,2],[56,-8],[64,2]]],
};
function plen(p) { let L = 0; for (let i = 1; i < p.length; i++) L += Math.hypot(p[i][0] - p[i-1][0], p[i][1] - p[i-1][1]); return L; }
function glyph(g, name, x, y, s, prog, color, width) {
  const strokes = GLYPHS[name], total = strokes.reduce((a, p) => a + plen(p), 0); let left = prog * total;
  g.strokeStyle = color; g.lineWidth = width; g.lineCap = 'round'; g.lineJoin = 'round';
  for (const p of strokes) { if (left <= 0) break; g.beginPath(); g.moveTo(x + (p[0][0] - 50) * s, y + (p[0][1] - 50) * s);
    for (let i = 1; i < p.length; i++) { const d = Math.hypot(p[i][0] - p[i-1][0], p[i][1] - p[i-1][1]);
      if (left >= d) { g.lineTo(x + (p[i][0] - 50) * s, y + (p[i][1] - 50) * s); left -= d; }
      else { const f = left / d; g.lineTo(x + (lerp(p[i-1][0], p[i][0], f) - 50) * s, y + (lerp(p[i-1][1], p[i][1], f) - 50) * s); left = 0; break; } }
    g.stroke(); }
}
function engraved(g, name, x, y, s, prog, glow) {     // carved groove + warm glow
  glyph(g, name, x + 3, y + 3, s, prog, 'rgba(0,0,0,0.55)', 9);
  g.shadowColor = ACCENT; g.shadowBlur = 25 * glow;
  glyph(g, name, x, y, s, prog, rgba(ACCENT, 0.5 + 0.5 * glow), 7); g.shadowBlur = 0;
}
const c = makeCanvas(), g = c.getContext('2d');
const bg = layer(x => { rockTexture(x, 0, 0, W, H, '#41372d');
  const v = x.createLinearGradient(0, H * 0.5, 0, H * 0.8); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.92)'); x.fillStyle = v; x.fillRect(0, 0, W, H); });
const rows = [['man', 190, 250, 2.4], ['dancer', 420, 230, 2.4], ['man', 640, 260, 2.2], ['dancer', 870, 240, 2.3],
              ['animal', 300, 520, 3.0], ['animal', 760, 500, 2.8],
              ['spiral', 200, 800, 1.8], ['sun', 470, 790, 2.2], ['rings', 740, 800, 2.2], ['spiral', 930, 780, 1.4]];
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.85));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  rows.forEach(([n, x, y, s], i) => { const p = ease.inOut(clamp((k - i * 0.07) * 3)); if (p > 0) engraved(g, n, x, y, s, p, 0.5 + 0.5 * Math.sin(t * 2.4 + i)); });
  // a chisel spark at the newest carving
  const i = Math.min(rows.length - 1, Math.floor(k / 0.07)), [, x, y] = rows[i];
  if (k < 0.95) for (let j = 0; j < 8; j++) { const a = t * 20 + j, r = (t * 300 + j * 20) % 60;
    g.fillStyle = rgba('#FFE2A8', 1 - r / 60); g.fillRect(x + Math.cos(a) * r, y + Math.sin(a) * r, 4, 4); }
};
