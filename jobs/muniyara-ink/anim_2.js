NB.use('inkwash'); const c = makeCanvas(), g = c.getContext('2d'); function seal(g, t, x, y, a) { if (a <= 0) return; g.save(); g.globalAlpha = a * 0.92; g.translate(x, y); g.rotate(0.05); g.fillStyle = '#b5281f'; g.beginPath(); g.roundRect(-78, -70, 156, 140, 12); g.fill(); g.fillStyle = '#f3e9d8'; let fs = 50; g.font = '800 50px Baloo'; while (g.measureText(t).width > 136 && fs > 24) { fs -= 2; g.font = '800 ' + fs + 'px Baloo'; } g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, 0, 4); g.restore(); }
function dolmen(s, x, y, k) { s.poly([[x - 250*k, y - 310*k], [x + 230*k, y - 345*k], [x + 270*k, y - 280*k], [x - 270*k, y - 250*k], [x - 250*k, y - 310*k]], { w: 12 }); s.rect(x - 230*k, y - 255*k, 46*k, 255*k, { w: 10 }); s.rect(x + 185*k, y - 285*k, 46*k, 285*k, { w: 10 }); s.rect(x - 150*k, y - 250*k, 300*k, 250*k, { w: 9 }); s.circle(x, y - 130*k, 40*k, { w: 8 }); s.line(x - 330*k, y, x + 330*k, y, { w: 12 }); }
function dwash(g, x, y, k, a) { NB.wash(g, [[x - 250*k, y - 310*k], [x + 230*k, y - 345*k], [x + 270*k, y - 280*k], [x - 270*k, y - 250*k]], 'rgba(80,75,70,1)', 0.45*a); NB.wash(g, [x - 150*k, y - 250*k, 300*k, 250*k], 'rgba(60,55,50,1)', 0.3*a); }
const s = NB.sketch(31); dolmen(s, 540, 1300, 1.0); const A = s.mark(); s.figure(540, 1290, 140, 'sit'); const B = s.mark();
window.renderFrame = function (t) { const D = DURATION; NB.paper(g); dwash(g, 540, 1300, 1.0, 1);
  NB.glow(g, 540, 1180, 260, 'rgba(255,214,120,0.6)', NB.cl((t - D * 0.3) / 0.6));
  s.draw(g, t, { parts: [[0, A, 0, D * 0.25], [A, B, D * 0.25, D * 0.55]] });
  NB.note(g, 'മുനി + അറ', 540, 760, { a: NB.cl((t - D * 0.1) / 0.25), col: '#b5281f', size: 92 });
  NB.note(g, '= സന്യാസിയുടെ മുറി', 540, 860, { a: NB.cl((t - D * 0.35) / 0.25), col: '#1b1b1b', size: 58 });
};
