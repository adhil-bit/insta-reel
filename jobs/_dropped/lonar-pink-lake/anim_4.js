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
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, H * 0.6); s.addColorStop(0, '#6a8ab8'); s.addColorStop(1, '#d8c0a0'); x.fillStyle = s; x.fillRect(0, 0, W, H); });
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.85)), p = ease.inOut(clamp((k - 0.15) / 0.7));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  crater(g, W / 2, H * 0.4, 500, 250, p, t);
  const sw = g.createLinearGradient(lerp(-200, W + 200, p) - 160, 0, lerp(-200, W + 200, p) + 160, 0);
  sw.addColorStop(0, 'rgba(255,255,255,0)'); sw.addColorStop(0.5, 'rgba(255,220,240,0.25)'); sw.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = sw; g.beginPath(); g.ellipse(W / 2, H * 0.4 + 12, 340, 165, 0, 0, 6.283); g.fill();
  fadeBottom(g);
};
