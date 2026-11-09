NB.use('inkwash'); const c = makeCanvas(), g = c.getContext('2d');
const s = NB.sketch(11); s.line(100, 1250, 980, 1250, { w: 9 }); s.rect(180, 1000, 300, 250, { w: 9 }); for (let i = 0; i < 5; i++) s.rect(180 + i * 60, 960, 40, 40, { w: 6 }); s.rect(290, 1110, 80, 140, { w: 7 }); const A = s.mark();
s.rect(640, 1110, 220, 140, { w: 9 }); s.curve([[640, 1110], [660, 1040], [840, 1040], [860, 1110]], { w: 9 }); s.rect(735, 1150, 30, 40, { w: 5 }); const B = s.mark();
function crown(g, x, y, sc, a) { if (a <= 0) return; g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(sc, sc); g.fillStyle = '#d9a527'; g.strokeStyle = '#1b1b1b'; g.lineWidth = 5; g.beginPath(); g.moveTo(-60, 0); g.lineTo(-60, -55); g.lineTo(-30, -22); g.lineTo(0, -70); g.lineTo(30, -22); g.lineTo(60, -55); g.lineTo(60, 0); g.closePath(); g.fill(); g.stroke(); g.restore(); }
window.renderFrame = function (t) { const D = DURATION; NB.paper(g); NB.wash(g, [182, 1002, 296, 246], 'rgba(120,105,85,1)', 0.35);
  s.draw(g, t, { parts: [[0, A, 0, D * 0.35], [A, B, D * 0.4, D * 0.7]] });
  crown(g, 330, 880, 1.2, NB.cl((t - D * 0.2) / 0.25)); NB.glow(g, 750, 1150, 160, 'rgba(255,200,90,0.6)', NB.cl((t - D * 0.65) / 0.3));
  NB.note(g, 'നിധി?', 750, 960, { a: NB.cl((t - D * 0.7) / 0.2), col: '#b5281f', size: 80, font: 'Baloo' });
};
