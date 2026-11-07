NB.use('inkwash'); const c = makeCanvas(), g = c.getContext('2d');
function rain(g, t, a, n = 90) { g.save(); g.globalAlpha = 0.35 * a; g.strokeStyle = '#2b2b2b'; g.lineWidth = 2.5; for (let i = 0; i < n; i++) { const x = (i * 137.5) % 1180 - 60, y = 560 + ((i * 263 + t * 1100) % 820); g.beginPath(); g.moveTo(x, y); g.lineTo(x - 14, y + 46); g.stroke(); } g.restore(); }
function water(g, t, level, a = 1) { g.save(); g.globalAlpha = 0.55 * a; g.fillStyle = 'rgba(70,90,100,1)'; g.beginPath(); g.moveTo(0, 1400); for (let x = 0; x <= 1080; x += 20) g.lineTo(x, level + Math.sin(x / 70 + t * 2.5) * 8); g.lineTo(1080, 1400); g.fill(); g.restore(); }
const s = NB.sketch(27); for (const [x, w, h] of [[180, 180, 170], [450, 200, 200], [740, 170, 160]]) { s.poly([[x - 20, 1260 - h], [x + w / 2, 1260 - h - 110], [x + w + 20, 1260 - h]], { w: 10 }); s.rect(x, 1260 - h, w, h, { w: 9 }); } s.line(60, 1260, 1020, 1260, { w: 9 }); const A = s.mark();
s.figure(560, 900, 120, 'point'); const B = s.mark();
window.renderFrame = function (t) { const D = DURATION; NB.paper(g);
  s.draw(g, t, { parts: [[0, A, 0, D * 0.25], [A, B, D * 0.6, D * 0.8]] });
  rain(g, t, 1, 120); water(g, t, 1360 - 300 * NB.ease(NB.cl((t - D * 0.2) / (D * 0.6))), 1);
};
