NB.use('inkwash'); const c = makeCanvas(), g = c.getContext('2d');
const s = NB.sketch(57); s.figure(360, 1300, 260, 'sit'); s.figure(650, 1300, 170, 'stand'); s.figure(760, 1300, 140, 'stand'); const A = s.mark();
s.circle(560, 840, 230, { w: 8 }, 110); s.poly([[490, 935], [440, 1020], [560, 942]], { w: 8 }); const B = s.mark();
window.renderFrame = function (t) { const D = DURATION; NB.paper(g); NB.glow(g, 360, 1180, 260, 'rgba(255,200,110,0.45)', 1);
  s.draw(g, t, { parts: [[0, A, 0, D * 0.3], [A, B, D * 0.3, D * 0.5]] });
  NB.note(g, '99-ലെ മഴ...', 560, 865, { a: NB.cl((t - D * 0.45) / 0.2), col: '#b5281f', size: 74, font: 'Baloo' });
};
