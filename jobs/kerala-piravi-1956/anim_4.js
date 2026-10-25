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
const c = makeCanvas(), g = c.getContext('2d'); const bg = bgL();
const votes = Array.from({length: 26}, () => ({x: W / 2 + (rand() - 0.5) * 500, d: rand(), r: (rand() - 0.5) * 2}));
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.88));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  const bx = W / 2, by = H * 0.46;
  for (const v of votes) { const u = (t * 0.45 + v.d) % 1, y = lerp(-80, by - 160, ease.in(u)), x = lerp(v.x, bx, u);
    g.save(); g.translate(x, y); g.rotate(v.r * (1 - u)); g.fillStyle = '#f2ece2'; g.fillRect(-36, -24, 72, 48); g.fillStyle = rgba(ACCENT, 0.8); g.fillRect(-20, -6, 40, 12); g.restore(); }
  g.fillStyle = '#5a4a3a'; g.fillRect(bx - 260, by - 160, 520, 360); g.fillStyle = '#7a6450'; g.fillRect(bx - 260, by - 190, 520, 40);
  g.fillStyle = '#1a1410'; g.fillRect(bx - 110, by - 180, 220, 18);
  const lvl = ease.inOut(k); g.fillStyle = rgba(ACCENT, 0.5); g.fillRect(bx - 230, by + 170 - 300 * lvl, 460, 300 * lvl);
  g.strokeStyle = '#f2ece2'; g.lineWidth = 4; g.strokeRect(bx - 260, by - 160, 520, 360);
};
