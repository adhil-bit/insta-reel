const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
function rice(g, x, y, h, sway, color) {           // one rice plant: a few curved blades
  g.strokeStyle = color; g.lineWidth = 3; g.lineCap = 'round';
  for (let b = -2; b <= 2; b++) {
    g.beginPath(); g.moveTo(x, y);
    g.quadraticCurveTo(x + b * 4 + sway * 0.5, y - h * 0.6, x + b * 9 + sway, y - h * (0.85 + 0.1 * Math.cos(b)));
    g.stroke();
  }
}
function waves(g, y0, amp, t, speed, color, x0 = 0, x1 = W) {
  g.fillStyle = color; g.beginPath(); g.moveTo(x0, H);
  for (let x = x0; x <= x1; x += 12) g.lineTo(x, y0 + Math.sin(x * 0.012 + t * speed) * amp + Math.sin(x * 0.031 - t * speed * 1.3) * amp * 0.4);
  g.lineTo(x1, H); g.closePath(); g.fill();
}
const c = makeCanvas(), g = c.getContext('2d');
const lake = layer(x => { const b = x.createRadialGradient(W/2, H*0.36, 50, W/2, H*0.36, H*0.7);
  b.addColorStop(0, '#1d4f7a'); b.addColorStop(1, '#06121f'); x.fillStyle = b; x.fillRect(0, 0, W, H); });
const ripples = Array.from({length: 160}, () => ({x: rand() * W, y: rand() * H * 0.75, p: rand() * 6, l: 10 + rand() * 24}));
const polders = [
  {x: 120, y: 260, w: 380, h: 300, d: 0.0}, {x: 560, y: 220, w: 400, h: 340, d: 0.12},
  {x: 140, y: 610, w: 340, h: 360, d: 0.24}, {x: 530, y: 620, w: 430, h: 330, d: 0.36}];
const drops = Array.from({length: 60}, () => ({i: Math.floor(rand() * 4), p: rand(), a: rand() * 6.283}));
function perim(p, f) {                       // point at fraction f along a rectangle's edge
  const L = 2 * (p.w + p.h); let d = f * L;
  if (d < p.w) return [p.x + d, p.y]; d -= p.w;
  if (d < p.h) return [p.x + p.w, p.y + d]; d -= p.h;
  if (d < p.w) return [p.x + p.w - d, p.y + p.h]; d -= p.w;
  return [p.x, p.y + p.h - d];
}
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.88));
  g.globalAlpha = 1; g.drawImage(lake, 0, 0);
  g.strokeStyle = 'rgba(180,220,255,0.18)'; g.lineWidth = 2;
  for (const r of ripples) { const o = Math.sin(t * 1.5 + r.p) * 8; g.beginPath(); g.moveTo(r.x + o, r.y); g.lineTo(r.x + o + r.l, r.y); g.stroke(); }
  for (const p of polders) {
    const wall = ease.inOut(clamp((k - p.d) * 3));
    const drain = ease.inOut(clamp((k - p.d - 0.3) * 2.2));
    if (drain > 0) {                         // drained land turns into green paddy
      g.fillStyle = `rgba(${lerp(30,60,drain)|0},${lerp(80,150,drain)|0},${lerp(120,70,drain)|0},${drain})`;
      g.fillRect(p.x, p.y, p.w, p.h);
      g.strokeStyle = `rgba(140,210,110,${0.35 * drain})`; g.lineWidth = 3;
      for (let yy = p.y + 24; yy < p.y + p.h; yy += 28) { g.beginPath(); g.moveTo(p.x + 10, yy); g.lineTo(p.x + p.w - 10, yy); g.stroke(); }
    }
    if (wall > 0) {
      g.strokeStyle = '#7a5a36'; g.lineWidth = 16; g.lineCap = 'square'; g.beginPath();
      const steps = 80; for (let i = 0; i <= steps * wall; i++) { const [x, y] = perim(p, i / steps); i ? g.lineTo(x, y) : g.moveTo(x, y); }
      g.stroke();
      if (wall >= 1) { g.strokeStyle = rgba(ACCENT, 0.5 + 0.3 * Math.sin(t * 3)); g.lineWidth = 3; g.strokeRect(p.x - 10, p.y - 10, p.w + 20, p.h + 20); }
    }
  }
  // pumps throwing water over the walls while draining
  for (const d of drops) {
    const p = polders[d.i], drain = clamp((k - p.d - 0.3) * 2.2);
    if (drain <= 0 || drain >= 1) continue;
    const ph = (t * 0.9 + d.p) % 1, sx = p.x + p.w / 2, sy = p.y;
    g.fillStyle = `rgba(150,210,255,${0.8 * (1 - ph)})`;
    g.beginPath(); g.arc(sx + Math.cos(d.a) * 60 * ph, sy - 120 * ph + 140 * ph * ph, 6, 0, 6.283); g.fill();
  }
};
