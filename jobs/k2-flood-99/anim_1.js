NB.use('inkwash'); const c = makeCanvas(), g = c.getContext('2d'); function seal(g, t, x, y, a) { if (a <= 0) return; g.save(); g.globalAlpha = a * 0.92; g.translate(x, y); g.rotate(0.05); g.fillStyle = '#b5281f'; g.beginPath(); g.roundRect(-78, -70, 156, 140, 12); g.fill(); g.fillStyle = '#f3e9d8'; let fs = 50; g.font = '800 50px Baloo'; while (g.measureText(t).width > 136 && fs > 24) { fs -= 2; g.font = '800 ' + fs + 'px Baloo'; } g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, 0, 4); g.restore(); }
function rain(g, t, a, n = 90) { g.save(); g.globalAlpha = 0.35 * a; g.strokeStyle = '#2b2b2b'; g.lineWidth = 2.5; for (let i = 0; i < n; i++) { const x = (i * 137.5) % 1180 - 60, y = 560 + ((i * 263 + t * 1100) % 820); g.beginPath(); g.moveTo(x, y); g.lineTo(x - 14, y + 46); g.stroke(); } g.restore(); }
function water(g, t, level, a = 1) { g.save(); g.globalAlpha = 0.55 * a; g.fillStyle = 'rgba(70,90,100,1)'; g.beginPath(); g.moveTo(0, 1400); for (let x = 0; x <= 1080; x += 20) g.lineTo(x, level + Math.sin(x / 70 + t * 2.5) * 8); g.lineTo(1080, 1400); g.fill(); g.restore(); }
const s = NB.sketch(17); s.rect(300, 640, 480, 560, { w: 10 }); s.line(300, 740, 780, 740, { w: 8 }); s.circle(400, 640, 18, { w: 6 }); s.circle(680, 640, 18, { w: 6 }); s.text('ജൂലൈ', 540, 710, { size: 54 }); const A = s.mark();
window.renderFrame = function (t) { const D = DURATION; NB.paper(g); rain(g, t, 0.6);
  NB.wash(g, [302, 642, 476, 556], '#f3ead6', 1);
  s.draw(g, t, { parts: [[0, A, 0, D * 0.25]] });
  const k = NB.cl((t - D * 0.35) / 0.4), sc = Math.abs(Math.cos(k * Math.PI));
  g.save(); g.translate(540, 980); g.scale(1, Math.max(0.02, sc)); g.font = '800 170px Baloo, Inter'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = k < 0.5 ? '#1b1b1b' : '#b5281f'; g.fillText(k < 0.5 ? '1924' : '1099', 0, 0); g.restore();
  NB.note(g, 'മലയാള വർഷം', 540, 1130, { a: NB.cl((t - D * 0.65) / 0.2), col: '#1b1b1b', size: 52 });
};
