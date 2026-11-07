NB.use('inkwash'); const c = makeCanvas(), g = c.getContext('2d');
const PQ = [[260, 1020], [820, 1020], [960, 1300], [120, 1300]];
function pond(s) { s.poly([...PQ, PQ[0]], { w: 11 }); s.poly([[300, 1050], [780, 1050], [900, 1270], [180, 1270], [300, 1050]], { w: 6 }); }
function pwater(g, t, a = 1) { NB.wash(g, [[300, 1050], [780, 1050], [900, 1270], [180, 1270]], 'rgba(70,95,105,1)', 0.5 * a); g.save(); g.globalAlpha = 0.35 * a; g.strokeStyle = '#f3ead6'; g.lineWidth = 3; for (let i = 0; i < 6; i++) { const y = 1090 + i * 30, w = 160 + i * 40; g.beginPath(); g.moveTo(540 - w / 2 + Math.sin(t * 2 + i) * 20, y); g.lineTo(540 + w / 2 + Math.sin(t * 2 + i) * 20, y); g.stroke(); } g.restore(); }
function crown(g, x, y, sc, a, flip) { if (a <= 0) return; g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(sc, flip ? -sc : sc); g.fillStyle = '#d9a527'; g.strokeStyle = '#1b1b1b'; g.lineWidth = 5; g.beginPath(); g.moveTo(-60, 0); g.lineTo(-60, -55); g.lineTo(-30, -22); g.lineTo(0, -70); g.lineTo(30, -22); g.lineTo(60, -55); g.lineTo(60, 0); g.closePath(); g.fill(); g.stroke(); g.fillStyle = '#b5281f'; g.beginPath(); g.arc(0, -15, 9, 0, 6.283); g.fill(); g.restore(); }
function city(s) { for (const [x, w, h] of [[60, 120, 260], [200, 90, 330], [310, 140, 220], [640, 130, 300], [790, 100, 240], [910, 120, 330]]) s.rect(x, 1000 - h, w, h, { w: 7 }); }
const s = NB.sketch(45); pond(s); const A = s.mark();
const B = A; const p = NB.sketch(46); p.curve([[150, 820], [120, 900], [140, 960], [200, 980], [260, 960], [280, 900], [250, 820], [150, 820]], { w: 7 }); p.line(160, 812, 240, 812, { w: 7 }); const PA = p.mark();
for (const x of [200, 380, 700, 880]) { s.circle(x, 860, 50, { w: 6 }); s.line(x, 910, x, 990, { w: 6 }); } s.line(540, 990, 540, 860, { w: 6 }); s.circle(540, 845, 16, { w: 5 }); const C = s.mark();
window.renderFrame = function (t) { const D = DURATION; NB.paper(g); pwater(g, t);
  const k = NB.cl((t - D * 0.5) / 0.15);
  s.draw(g, t, { parts: [[0, A, 0, D * 0.2], [A, B, D * 0.15, D * 0.4], [B, C, D * 0.55, D * 0.85]] });
  if (k < 1) { g.save(); g.globalAlpha = 1 - k; NB.wash(g, [[150, 820], [120, 900], [140, 960], [200, 980], [260, 960], [280, 900], [250, 820]], 'rgba(150,90,50,1)', 0.45); p.draw(g, t, { parts: [[0, PA, D * 0.15, D * 0.4]], ghost: false }); g.restore(); }
  NB.note(g, 'അന്ന്: കുടിവെള്ളം', 540, 700, { a: NB.cl((t - D * 0.15) / 0.2) * (1 - k), col: '#1b1b1b', size: 58, font: 'Baloo' });
  NB.note(g, 'ഇന്ന്: സ്ക്വയർ', 540, 700, { a: NB.cl((t - D * 0.6) / 0.2), col: '#b5281f', size: 66, font: 'Baloo' });
};
