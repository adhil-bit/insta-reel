NB.use('inkwash'); const c = makeCanvas(), g = c.getContext('2d'); function seal(g, t, x, y, a) { if (a <= 0) return; g.save(); g.globalAlpha = a * 0.92; g.translate(x, y); g.rotate(0.05); g.fillStyle = '#b5281f'; g.beginPath(); g.roundRect(-78, -70, 156, 140, 12); g.fill(); g.fillStyle = '#f3e9d8'; let fs = 50; g.font = '800 50px Baloo'; while (g.measureText(t).width > 136 && fs > 24) { fs -= 2; g.font = '800 ' + fs + 'px Baloo'; } g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, 0, 4); g.restore(); }
const s = NB.sketch(15); s.rect(330, 760, 420, 380, { w: 10 }); s.rect(360, 790, 360, 320, { w: 5 }); const A = s.mark();
s.line(150, 620, 150, 1340, { w: 8 }); s.line(210, 620, 210, 1340, { w: 8 }); s.text('മിഠായിത്തെരുവ്', 180, 1380, { size: 40 }); s.arrow(230, 950, 320, 950, { w: 6, col: '#b5281f' });
for (const [x, y] of [[800, 700], [860, 900], [820, 1120], [400, 1240], [600, 1250]]) { s.circle(x, y, 40, { w: 5 }); s.line(x, y + 40, x, y + 80, { w: 5 }); }
const B = s.mark();
window.renderFrame = function (t) { const D = DURATION; NB.paper(g); NB.wash(g, [362, 792, 356, 316], 'rgba(70,95,105,1)', 0.5);
  s.draw(g, t, { parts: [[0, A, 0, D * 0.3], [A, B, D * 0.3, D * 0.75]] });
  seal(g, 'കോഴിക്കോട്', 900, 1330, NB.cl((t - D * 0.7) / 0.25));
};
