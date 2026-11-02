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
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, H * 0.7); s.addColorStop(0, '#1e5a4e'); s.addColorStop(1, '#06120e'); x.fillStyle = s; x.fillRect(0, 0, W, H); });
const crystals = Array.from({length: 40}, () => ({x: rand() * W, y: H * 0.05 + rand() * H * 0.55, s: 14 + rand() * 30, r: rand() * 3, at: rand()}));
const bubbles = Array.from({length: 60}, () => ({x: rand() * W, o: rand(), r: 3 + rand() * 8, s: 0.5 + rand()}));
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.85));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  for (let i = 0; i < 6; i++) { const y = H * 0.08 + i * 70 + Math.sin(t + i) * 10; g.strokeStyle = 'rgba(200,255,240,0.12)'; g.lineWidth = 3; g.beginPath();
    for (let x = 0; x <= W; x += 20) g.lineTo(x, y + Math.sin(x * 0.01 + t * 1.5 + i) * 12); g.stroke(); }
  for (const cr of crystals) { const a = ease.out(clamp((k - cr.at * 0.7) * 3)); if (a <= 0) continue;
    g.save(); g.translate(cr.x, cr.y); g.rotate(cr.r + t * 0.1); g.globalAlpha = a; const s = cr.s * a;
    g.fillStyle = 'rgba(240,250,255,0.85)'; g.fillRect(-s / 2, -s / 2, s, s); g.strokeStyle = rgba(ACCENT, 0.9); g.lineWidth = 2; g.strokeRect(-s / 2, -s / 2, s, s); g.restore(); }
  g.globalAlpha = 1;
  for (const b of bubbles) { const y = H * 0.65 - ((t * 60 * b.s + b.o * H) % (H * 0.65)); g.strokeStyle = 'rgba(220,255,245,0.5)'; g.lineWidth = 2; g.beginPath(); g.arc(b.x + Math.sin(t * 2 + b.o * 9) * 8, y, b.r, 0, 6.283); g.stroke(); }
  fadeBottom(g);
};
