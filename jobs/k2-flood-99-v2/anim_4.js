NB.use('inkwash'); const c = makeCanvas(), g = c.getContext('2d'); function seal(g, t, x, y, a) { if (a <= 0) return; g.save(); g.globalAlpha = a * 0.92; g.translate(x, y); g.rotate(0.05); g.fillStyle = '#b5281f'; g.beginPath(); g.roundRect(-78, -70, 156, 140, 12); g.fill(); g.fillStyle = '#f3e9d8'; let fs = 50; g.font = '800 50px Baloo'; while (g.measureText(t).width > 136 && fs > 24) { fs -= 2; g.font = '800 ' + fs + 'px Baloo'; } g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, 0, 4); g.restore(); }
function rain(g, t, a, n = 90) { g.save(); g.globalAlpha = 0.35 * a; g.strokeStyle = '#2b2b2b'; g.lineWidth = 2.5; for (let i = 0; i < n; i++) { const x = (i * 137.5) % 1180 - 60, y = 560 + ((i * 263 + t * 1100) % 820); g.beginPath(); g.moveTo(x, y); g.lineTo(x - 14, y + 46); g.stroke(); } g.restore(); }
function water(g, t, level, a = 1) { g.save(); g.globalAlpha = 0.55 * a; g.fillStyle = 'rgba(70,90,100,1)'; g.beginPath(); g.moveTo(0, 1400); for (let x = 0; x <= 1080; x += 20) g.lineTo(x, level + Math.sin(x / 70 + t * 2.5) * 8); g.lineTo(1080, 1400); g.fill(); g.restore(); }
const s = NB.sketch(47); s.poly([[220, 1250], [540, 720], [860, 1250]], { w: 12 }); s.line(60, 1250, 1020, 1250, { w: 10 }); const A = s.mark();
window.renderFrame = function (t) { const D = DURATION; NB.paper(g);
  const k = NB.ease(NB.cl((t - D * 0.3) / (D * 0.5)));
  g.save(); g.beginPath(); g.rect(0, 0, 1080, 1250); g.clip(); g.translate(0, k * 380); g.globalAlpha = 1 - k * 0.6; NB.wash(g, [[220, 1250], [540, 720], [860, 1250]], 'rgba(60,70,60,1)', 0.55); s.draw(g, t, { parts: [[0, A, 0, D * 0.25]] }); g.restore();
  if (k > 0) NB.wash(g, [[160, 1250], [540, 1250 - 120 * k], [920, 1250]], 'rgba(110,90,70,1)', 0.5 * k);
  rain(g, t, 1); NB.note(g, '?', 540, 820, { a: NB.cl((t - D * 0.8) / 0.2), col: '#b5281f', size: 170, font: 'Baloo' });
  seal(g, 'കരിന്തിരി', 880, 680, NB.cl((t - D * 0.15) / 0.25));
};
