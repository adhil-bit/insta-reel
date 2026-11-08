NB.use('inkwash'); const c = makeCanvas(), g = c.getContext('2d'); function seal(g, t, x, y, a) { if (a <= 0) return; g.save(); g.globalAlpha = a * 0.92; g.translate(x, y); g.rotate(0.05); g.fillStyle = '#b5281f'; g.beginPath(); g.roundRect(-78, -70, 156, 140, 12); g.fill(); g.fillStyle = '#f3e9d8'; let fs = 50; g.font = '800 50px Baloo'; while (g.measureText(t).width > 136 && fs > 24) { fs -= 2; g.font = '800 ' + fs + 'px Baloo'; } g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, 0, 4); g.restore(); }
const s = NB.sketch(33); s.poly([[160, 1330], [420, 1000], [540, 780], [660, 1000], [920, 1330]], { w: 11 }); s.poly([[505, 790], [540, 750], [575, 790], [505, 790]], { w: 6 }); s.rect(515, 790, 50, 40, { w: 5 }); const A = s.mark();
s.line(540, 1330, 540, 560, { w: 4, dash: true, col: '#b5281f' }); s.text('കേരളം', 330, 620, { size: 50 }); s.text('തമിഴ്നാട്', 760, 620, { size: 50 }); const B = s.mark();
window.renderFrame = function (t) { const D = DURATION; NB.paper(g); NB.ridge(g, 1200, 120, 'rgba(70,70,70,0.22)', 1, 4);
  NB.wash(g, [[160, 1330], [420, 1000], [540, 780], [660, 1000], [920, 1330]], 'rgba(45,60,50,1)', 0.5);
  s.draw(g, t, { parts: [[0, A, 0, D * 0.35], [A, B, D * 0.35, D * 0.6]] });
  NB.glow(g, 540, 790, 140, 'rgba(255,214,120,0.6)', NB.cl((t - D * 0.6) / 0.3)); NB.mist(g, 1260, 120, 0.7);
  seal(g, 'അഗസ്ത്യകൂടം', 900, 1180, NB.cl((t - D * 0.5) / 0.25));
};
