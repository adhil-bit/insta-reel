NB.use('inkwash'); const c = makeCanvas(), g = c.getContext('2d'); function seal(g, t, x, y, a) { if (a <= 0) return; g.save(); g.globalAlpha = a * 0.92; g.translate(x, y); g.rotate(0.05); g.fillStyle = '#b5281f'; g.beginPath(); g.roundRect(-78, -70, 156, 140, 12); g.fill(); g.fillStyle = '#f3e9d8'; let fs = 50; g.font = '800 50px Baloo'; while (g.measureText(t).width > 136 && fs > 24) { fs -= 2; g.font = '800 ' + fs + 'px Baloo'; } g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, 0, 4); g.restore(); }
function dolmen(s, x, y, k) { s.poly([[x - 250*k, y - 310*k], [x + 230*k, y - 345*k], [x + 270*k, y - 280*k], [x - 270*k, y - 250*k], [x - 250*k, y - 310*k]], { w: 12 }); s.rect(x - 230*k, y - 255*k, 46*k, 255*k, { w: 10 }); s.rect(x + 185*k, y - 285*k, 46*k, 285*k, { w: 10 }); s.rect(x - 150*k, y - 250*k, 300*k, 250*k, { w: 9 }); s.circle(x, y - 130*k, 40*k, { w: 8 }); s.line(x - 330*k, y, x + 330*k, y, { w: 12 }); }
function dwash(g, x, y, k, a) { NB.wash(g, [[x - 250*k, y - 310*k], [x + 230*k, y - 345*k], [x + 270*k, y - 280*k], [x - 270*k, y - 250*k]], 'rgba(80,75,70,1)', 0.45*a); NB.wash(g, [x - 150*k, y - 250*k, 300*k, 250*k], 'rgba(60,55,50,1)', 0.3*a); }
const s = NB.sketch(11); dolmen(s, 540, 1200, 1.15); const A = s.mark();
s.figure(540, 1185, 150, 'sit'); const B = s.mark();
window.renderFrame = function (t) { const D = DURATION; NB.paper(g);
  NB.blob(g, 860, 620, 60, 60, '#d9d2c3', 1.4); NB.ridge(g, 760, 130, 'rgba(70,70,70,0.2)', 1, 3); NB.ridge(g, 820, 100, 'rgba(30,30,30,0.28)', 1, 8); NB.mist(g, 760, 120, 0.8);
  dwash(g, 540, 1200, 1.15, 1);
  s.draw(g, t, { parts: [[0, A, 0, Math.min(1.8, D * 0.35)], [A, B, D * 0.45, D * 0.75]] });
  NB.glow(g, 540, 1080, 200, 'rgba(255,214,120,0.5)', NB.cl((t - D * 0.5) / 0.6));
  NB.note(g, '?', 900, 1180, { a: NB.cl((t - D * 0.78) / 0.2), col: '#b5281f', size: 150, font: 'Baloo' });
  seal(g, 'മുനിയറ', 180, 1300, NB.cl((t - D * 0.2) / 0.3));
};
