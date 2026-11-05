NB.use('inkwash'); const c = makeCanvas(), g = c.getContext('2d');
const s = NB.sketch(25);
s.rect(140, 620, 300, 300, { w: 12 }); for (let i = 1; i < 6; i++) s.line(140 + i * 50, 625, 140 + i * 50, 915, { w: 9 });
const A = s.mark();
for (let k = 0; k < 4; k++) { const x0 = 150 + k * 78; for (let i = 0; i < 4; i++) s.line(x0 + i * 13, 980, x0 + i * 13, 1050, { w: 5 }); s.line(x0 - 6, 1040, x0 + 52, 990, { w: 5 }); }
const B = s.mark();
s.line(500, 1300, 1020, 1300, { w: 12 }); for (const [x, h] of [[520, 330], [640, 470], [770, 380], [890, 520]]) { s.rect(x, 1300 - h, 110, h, { w: 8 }); for (let r = 0; r < h / 90 - 1; r++) s.rect(x + 30, 1300 - h + 30 + r * 90, 46, 40, { w: 4 }); }
const C = s.mark();
s.figure(300, 1370, 230, 'shrug');
const D = s.mark();
window.renderFrame = function (t) { NB.paper(g); NB.wash(g, [142, 622, 296, 296], 'rgba(40,40,40,1)', 0.22);
  s.draw(g, t, { parts: [[0, A, 0, DURATION * 0.2], [A, B, DURATION * 0.18, DURATION * 0.4], [B, C, DURATION * 0.38, DURATION * 0.66], [C, D, DURATION * 0.64, DURATION * 0.8]] });
  NB.note(g, '?', 300, 1110, { a: NB.cl((t - DURATION * 0.8) / 0.2), col: '#b5281f', size: 120, font: 'Baloo' });
};
