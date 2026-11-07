NB.use('inkwash'); const c = makeCanvas(), g = c.getContext('2d');
const PQ = [[260, 1020], [820, 1020], [960, 1300], [120, 1300]];
function pond(s) { s.poly([...PQ, PQ[0]], { w: 11 }); s.poly([[300, 1050], [780, 1050], [900, 1270], [180, 1270], [300, 1050]], { w: 6 }); }
function pwater(g, t, a = 1) { NB.wash(g, [[300, 1050], [780, 1050], [900, 1270], [180, 1270]], 'rgba(70,95,105,1)', 0.5 * a); g.save(); g.globalAlpha = 0.35 * a; g.strokeStyle = '#f3ead6'; g.lineWidth = 3; for (let i = 0; i < 6; i++) { const y = 1090 + i * 30, w = 160 + i * 40; g.beginPath(); g.moveTo(540 - w / 2 + Math.sin(t * 2 + i) * 20, y); g.lineTo(540 + w / 2 + Math.sin(t * 2 + i) * 20, y); g.stroke(); } g.restore(); }
function crown(g, x, y, sc, a, flip) { if (a <= 0) return; g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(sc, flip ? -sc : sc); g.fillStyle = '#d9a527'; g.strokeStyle = '#1b1b1b'; g.lineWidth = 5; g.beginPath(); g.moveTo(-60, 0); g.lineTo(-60, -55); g.lineTo(-30, -22); g.lineTo(0, -70); g.lineTo(30, -22); g.lineTo(60, -55); g.lineTo(60, 0); g.closePath(); g.fill(); g.stroke(); g.fillStyle = '#b5281f'; g.beginPath(); g.arc(0, -15, 9, 0, 6.283); g.fill(); g.restore(); }
function city(s) { for (const [x, w, h] of [[60, 120, 260], [200, 90, 330], [310, 140, 220], [640, 130, 300], [790, 100, 240], [910, 120, 330]]) s.rect(x, 1000 - h, w, h, { w: 7 }); }
const s = NB.sketch(55); pond(s); s.figure(170, 1010, 110, 'sit'); s.figure(330, 1010, 110, 'sit'); s.figure(760, 1010, 110, 'sit'); s.figure(910, 1010, 120, 'point'); const A = s.mark();
s.circle(560, 790, 300, { w: 8 }, 100); s.poly([[500, 880], [450, 960], [560, 888]], { w: 8 }); const B = s.mark();
window.renderFrame = function (t) { const D = DURATION; NB.paper(g); pwater(g, t); NB.glow(g, 540, 640, 300, 'rgba(255,190,110,0.35)', 1);
  s.draw(g, t, { parts: [[0, A, 0, D * 0.35], [A, B, D * 0.4, D * 0.6]] });
  NB.note(g, '@ കോഴിക്കോടൻ ഫ്രണ്ട്', 560, 808, { a: NB.cl((t - D * 0.55) / 0.2), col: '#b5281f', size: 46, font: 'Baloo' });
};
