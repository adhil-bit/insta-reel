const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
function mixc(a, b, t) { return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')})`; }
const GREEN = [46, 110, 92], PINK = [232, 110, 160];
function crater(g, cx, cy, rx, ry, lakeT, t) {    // oblique view of the crater bowl with its lake
  const rim = g.createRadialGradient(cx, cy, rx * 0.6, cx, cy, rx * 1.25); rim.addColorStop(0, '#3a4a2a'); rim.addColorStop(0.7, '#2a3420'); rim.addColorStop(1, 'rgba(20,26,18,0)');
  g.fillStyle = rim; g.beginPath(); g.ellipse(cx, cy, rx * 1.25, ry * 1.25, 0, 0, 6.283); g.fill();
  g.fillStyle = '#1a2416'; g.beginPath(); g.ellipse(cx, cy + ry * 0.05, rx, ry, 0, 0, 6.283); g.fill();
  for (let i = 0; i < 90; i++) { const a = i / 90 * 6.283, rr = 0.82 + 0.1 * Math.sin(i * 5.3); g.fillStyle = i % 2 ? '#2f4a24' : '#3a5a2a';
    g.beginPath(); g.arc(cx + Math.cos(a) * rx * rr, cy + Math.sin(a) * ry * rr, 14, 0, 6.283); g.fill(); }
  const lk = g.createRadialGradient(cx - rx * 0.2, cy - ry * 0.2, 10, cx, cy, rx * 0.68);
  lk.addColorStop(0, mixc([90, 160, 130], [255, 170, 205], lakeT)); lk.addColorStop(1, mixc(GREEN, PINK, lakeT));
  g.fillStyle = lk; g.beginPath(); g.ellipse(cx, cy + ry * 0.05, rx * 0.68, ry * 0.66, 0, 0, 6.283); g.fill();
  g.strokeStyle = 'rgba(255,255,255,0.25)'; g.lineWidth = 3;
  for (let i = 0; i < 5; i++) { const p = (t * 0.2 + i / 5) % 1; g.globalAlpha = 1 - p; g.beginPath(); g.ellipse(cx, cy + ry * 0.05, rx * 0.68 * p, ry * 0.66 * p, 0, 0, 6.283); g.stroke(); }
  g.globalAlpha = 1;
}
function fadeBottom(g) { const f = g.createLinearGradient(0, H * 0.55, 0, H * 0.8); f.addColorStop(0, 'rgba(4,6,10,0)'); f.addColorStop(1, 'rgba(4,6,10,1)'); g.fillStyle = f; g.fillRect(0, H * 0.55, W, H); }
const starsL = () => layer(x => { const s = x.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#05040e'); s.addColorStop(1, '#0e1218'); x.fillStyle = s; x.fillRect(0, 0, W, H);
  x.fillStyle = '#e6e2ff'; for (let i = 0; i < 200; i++) { x.globalAlpha = rand() * 0.7; x.fillRect(rand() * W, rand() * H * 0.5, 2, 2); } x.globalAlpha = 1; });
const c = makeCanvas(), g = c.getContext('2d');
const cx = W / 2, cy = H * 0.36, R = 400;
const bg = layer(x => { x.fillStyle = '#030206'; x.fillRect(0, 0, W, H); });
const mic = Array.from({length: 160}, (_, i) => ({x: (rand() - 0.5) * 2, y: (rand() - 0.5) * 2, a: rand() * 6.283, L: 20 + rand() * 26, at: i / 160, vx: (rand() - 0.5) * 0.04, vy: (rand() - 0.5) * 0.04}));
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.85)), n = Math.floor(lerp(8, 160, ease.in(k)));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  g.save(); g.beginPath(); g.arc(cx, cy, R, 0, 6.283); g.clip();
  const f = g.createRadialGradient(cx, cy, 0, cx, cy, R); f.addColorStop(0, mixc([230, 240, 235], [255, 220, 235], k)); f.addColorStop(1, mixc([150, 170, 160], [210, 150, 180], k));
  g.fillStyle = f; g.fillRect(cx - R, cy - R, 2 * R, 2 * R);
  for (let i = 0; i < n; i++) { const m = mic[i], x = cx + (((m.x + m.vx * t + 3) % 2) - 1) * R, y = cy + (((m.y + m.vy * t + 3) % 2) - 1) * R, a = m.a + t * 0.3;
    g.save(); g.translate(x, y); g.rotate(a); g.fillStyle = '#e0457a'; g.beginPath(); g.roundRect(-m.L / 2, -7, m.L, 14, 7); g.fill();
    g.fillStyle = 'rgba(255,255,255,0.35)'; g.fillRect(-m.L / 2 + 5, -4, m.L - 10, 3); g.restore(); }
  g.restore();
  const v = g.createRadialGradient(cx, cy, R * 0.7, cx, cy, R); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.65)'); g.fillStyle = v; g.beginPath(); g.arc(cx, cy, R, 0, 6.283); g.fill();
  g.strokeStyle = '#2a2a30'; g.lineWidth = 28; g.beginPath(); g.arc(cx, cy, R + 14, 0, 6.283); g.stroke();
  g.strokeStyle = rgba(ACCENT, 0.7); g.lineWidth = 3; g.beginPath(); g.arc(cx, cy, R + 30, 0, 6.283); g.stroke();
};
