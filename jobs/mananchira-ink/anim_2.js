NB.use('inkwash'); const c = makeCanvas(), g = c.getContext('2d');
const s = NB.sketch(25); s.line(80, 1250, 1000, 1250, { w: 10 }); s.curve([[420, 1250], [470, 1320], [700, 1320], [760, 1250]], { w: 8 }); const A = s.mark();
s.figure(250, 1250, 330, 'point'); const B = s.mark(); s.figure(520, 1300, 170, 'dig'); s.figure(690, 1300, 170, 'dig'); s.figure(880, 1250, 180, 'dig'); const C = s.mark();
function crown(g, x, y, sc, a) { if (a <= 0) return; g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(sc, sc); g.fillStyle = '#d9a527'; g.strokeStyle = '#1b1b1b'; g.lineWidth = 5; g.beginPath(); g.moveTo(-40, 0); g.lineTo(-40, -40); g.lineTo(-20, -15); g.lineTo(0, -50); g.lineTo(20, -15); g.lineTo(40, -40); g.lineTo(40, 0); g.closePath(); g.fill(); g.stroke(); g.restore(); }
window.renderFrame = function (t) { const D = DURATION; NB.paper(g); NB.wash(g, [[430, 1252], [480, 1310], [690, 1310], [750, 1252]], 'rgba(70,95,105,1)', 0.5 * NB.cl((t - D * 0.5) / 0.5));
  s.draw(g, t, { parts: [[0, A, 0, D * 0.2], [A, B, D * 0.1, D * 0.45], [B, C, D * 0.4, D * 0.8]] });
  crown(g, 250, 925, 1.2, NB.cl((t - D * 0.35) / 0.25));
  NB.note(g, 'സാമൂതിരി', 250, 860, { a: NB.cl((t - D * 0.45) / 0.25), col: '#b5281f', size: 56, font: 'Baloo' });
};
