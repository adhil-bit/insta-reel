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
const gapL = W * 0.38, gapR = W * 0.62, rimY = H * 0.3;
const wall = layer(x => { const s = x.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#0a0f18'); s.addColorStop(1, '#03050a'); x.fillStyle = s; x.fillRect(0, 0, W, H);
  x.save(); x.beginPath(); x.moveTo(0, rimY - 40); x.lineTo(gapL, rimY); x.lineTo(gapL - 30, H); x.lineTo(0, H); x.closePath(); x.clip(); rockTexture(x, 0, 0, W, H, '#4a4036'); x.restore();
  x.save(); x.beginPath(); x.moveTo(W, rimY - 60); x.lineTo(gapR, rimY); x.lineTo(gapR + 30, H); x.lineTo(W, H); x.closePath(); x.clip(); rockTexture(x, 0, 0, W, H, '#463c33'); x.restore();
  const v = x.createLinearGradient(0, H * 0.45, 0, H * 0.8); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.95)'); x.fillStyle = v; x.fillRect(0, 0, W, H); });
const boulder = layer(x => { x.save(); x.beginPath(); x.ellipse(W / 2, H / 2, 240, 150, 0, 0, 6.283); x.clip(); rockTexture(x, W / 2 - 250, H / 2 - 160, 500, 320, '#5a4e42');
  const sh = x.createRadialGradient(W / 2 - 80, H / 2 - 60, 20, W / 2, H / 2, 260); sh.addColorStop(0, 'rgba(255,230,200,0.15)'); sh.addColorStop(1, 'rgba(0,0,0,0.5)'); x.fillStyle = sh; x.fillRect(0, 0, W, H); x.restore(); });
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.85));
  g.globalAlpha = 1; g.drawImage(wall, 0, 0);
  const drop = clamp(k / 0.45), land = ease.in(drop);
  const by = lerp(-H * 0.4, rimY - 40 - H / 2, land) + (drop >= 1 ? Math.max(0, Math.sin((k - 0.45) * 40) * 12 * Math.exp(-(k - 0.45) * 12)) : 0);
  if (k > 0.45 && k < 0.6) { const d = (k - 0.45) / 0.15;           // impact dust
    for (let i = 0; i < 24; i++) { const a = Math.PI + (i / 23) * Math.PI, r = d * 260; g.fillStyle = `rgba(190,170,140,${0.5 * (1 - d)})`;
      g.beginPath(); g.arc(W / 2 + Math.cos(a) * r * 1.4, rimY + 60 + Math.sin(a) * r * 0.3, 14 + d * 30, 0, 6.283); g.fill(); } }
  g.drawImage(boulder, 0, by);
  // light shaft through the opening once the stone is in place
  const lit = clamp((k - 0.6) / 0.3);
  if (lit > 0) { const sh = g.createLinearGradient(0, rimY + 60, 0, H * 0.75); sh.addColorStop(0, rgba(ACCENT, 0.45 * lit)); sh.addColorStop(1, rgba(ACCENT, 0));
    g.fillStyle = sh; g.beginPath(); g.moveTo(gapL + 20, rimY + 90); g.lineTo(gapR - 20, rimY + 90); g.lineTo(gapR + 60, H * 0.75); g.lineTo(gapL - 60, H * 0.75); g.fill();
    g.strokeStyle = rgba(ACCENT, 0.8 * lit); g.lineWidth = 4; g.beginPath(); g.ellipse(W / 2, rimY - 40, 250, 160, 0, 0, 6.283); g.stroke(); }
};
