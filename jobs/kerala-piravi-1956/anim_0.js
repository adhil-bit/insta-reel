const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
// rough outline of Kerala (lat, lon), coast north to south, then the Ghats back north
const KL = [[12.75,74.95],[12.2,75.1],[11.85,75.35],[11.25,75.78],[10.75,75.92],[10.2,76.2],[9.9,76.25],[9.5,76.33],[9.0,76.48],[8.75,76.65],[8.4,76.95],[8.2,77.15],
            [8.3,77.25],[8.75,77.2],[9.3,77.2],[9.6,77.15],[10.0,77.25],[10.3,77.15],[10.5,76.85],[10.8,76.75],[11.2,76.6],[11.5,76.4],[11.75,76.0],[12.1,75.75],[12.5,75.4],[12.8,75.1]];
function kmap(cx, cy, s) { return ([la, lo]) => [cx + (lo - 76.1) * 250 * s, cy + (10.5 - la) * 250 * s]; }
function region(g, P, latMin, latMax, fill, dx = 0, dy = 0) {   // part of Kerala between two latitudes
  g.save(); g.beginPath(); const a = P([latMax, 76]), b = P([latMin, 76]); g.rect(-20, a[1] + dy, W + 40, b[1] - a[1]); g.clip();
  g.translate(dx, dy); g.fillStyle = fill; g.beginPath(); KL.forEach((p, i) => { const [x, y] = P(p); i ? g.lineTo(x, y) : g.moveTo(x, y); }); g.closePath(); g.fill();
  g.strokeStyle = 'rgba(255,255,255,0.6)'; g.lineWidth = 3; g.stroke(); g.restore();
}
function outline(g, P, fill, stroke) { g.beginPath(); KL.forEach((p, i) => { const [x, y] = P(p); i ? g.lineTo(x, y) : g.moveTo(x, y); }); g.closePath(); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.strokeStyle = stroke; g.lineWidth = 4; g.stroke(); } }
const bgL = () => layer(x => { const b = x.createRadialGradient(W / 2, H * 0.36, 50, W / 2, H * 0.36, H * 0.8); b.addColorStop(0, '#16302a'); b.addColorStop(1, '#04080a'); x.fillStyle = b; x.fillRect(0, 0, W, H);
  x.fillStyle = 'rgba(40,90,140,0.25)'; x.fillRect(0, 0, W * 0.42, H); });
const c = makeCanvas(), g = c.getContext('2d'); const bg = bgL(); const P = kmap(W / 2 + 40, H * 0.42, 0.85);
const sparks = Array.from({length: 5}, (_, i) => ({x: W * (0.2 + 0.6 * rand()), y: H * (0.08 + 0.2 * rand()), at: i * 0.18}));
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.9));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  const gl = g.createRadialGradient(W / 2, H * 0.36, 50, W / 2, H * 0.36, 520); gl.addColorStop(0, rgba(ACCENT, 0.3)); gl.addColorStop(1, rgba(ACCENT, 0)); g.fillStyle = gl; g.fillRect(0, 0, W, H);
  outline(g, P, '#2f6a3a', rgba(ACCENT, 0.9));
  const fillTo = lerp(H * 0.7, H * 0.02, ease.inOut(k));
  g.save(); g.beginPath(); g.rect(0, fillTo, W, H); g.clip(); outline(g, P, '#4caf50', null); g.restore();
  for (const s of sparks) { const f = ((t * 0.5 + s.at) % 1); for (let i = 0; i < 18; i++) { const a = i / 18 * 6.283, r = f * 120;
      g.fillStyle = rgba(['#FFD27A', '#FF7A59', '#9AE6B4'][i % 3], 1 - f); g.fillRect(s.x + Math.cos(a) * r, s.y + Math.sin(a) * r + f * f * 40, 6, 6); } }
};
