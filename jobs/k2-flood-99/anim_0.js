NB.use('inkwash'); const c = makeCanvas(), g = c.getContext('2d'); function seal(g, t, x, y, a) { if (a <= 0) return; g.save(); g.globalAlpha = a * 0.92; g.translate(x, y); g.rotate(0.05); g.fillStyle = '#b5281f'; g.beginPath(); g.roundRect(-78, -70, 156, 140, 12); g.fill(); g.fillStyle = '#f3e9d8'; let fs = 50; g.font = '800 50px Baloo'; while (g.measureText(t).width > 136 && fs > 24) { fs -= 2; g.font = '800 ' + fs + 'px Baloo'; } g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, 0, 4); g.restore(); }
function rain(g, t, a, n = 90) { g.save(); g.globalAlpha = 0.35 * a; g.strokeStyle = '#2b2b2b'; g.lineWidth = 2.5; for (let i = 0; i < n; i++) { const x = (i * 137.5) % 1180 - 60, y = 560 + ((i * 263 + t * 1100) % 820); g.beginPath(); g.moveTo(x, y); g.lineTo(x - 14, y + 46); g.stroke(); } g.restore(); }
function water(g, t, level, a = 1) { g.save(); g.globalAlpha = 0.55 * a; g.fillStyle = 'rgba(70,90,100,1)'; g.beginPath(); g.moveTo(0, 1400); for (let x = 0; x <= 1080; x += 20) g.lineTo(x, level + Math.sin(x / 70 + t * 2.5) * 8); g.lineTo(1080, 1400); g.fill(); g.restore(); }
const s = NB.sketch(7); s.poly([[100, 1060], [320, 760], [560, 1060]], { w: 12 }); s.line(60, 1060, 1020, 1060, { w: 10 }); const A = s.mark();
const h = NB.sketch(8); h.poly([[440, 1060], [700, 700], [980, 1060]], { w: 12 }); const HA = h.mark();
window.renderFrame = function (t) { const D = DURATION; NB.paper(g);
  const slide = NB.ease(NB.cl((t - D * 0.45) / (D * 0.4)));
  NB.wash(g, [[100, 1060], [320, 760], [560, 1060]], 'rgba(60,70,60,1)', 0.5);
  g.save(); g.translate(slide * 120, slide * 160); g.globalAlpha = 1 - slide * 0.7; NB.wash(g, [[440, 1060], [700, 700], [980, 1060]], 'rgba(60,70,60,1)', 0.5); h.draw(g, t, { parts: [[0, HA, 0, Math.min(1.6, D * 0.3)]], pen: false }); g.restore();
  s.draw(g, t, { parts: [[0, A, 0, Math.min(1.6, D * 0.3)]] });
  rain(g, t, 1); water(g, t, 1300 - 180 * NB.ease(NB.cl(t / D)), 1);
  seal(g, '1099', 900, 640, NB.cl((t - D * 0.7) / 0.25));
};
