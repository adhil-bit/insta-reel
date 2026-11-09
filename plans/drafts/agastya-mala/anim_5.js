NB.use('inkwash'); const c = makeCanvas(), g = c.getContext('2d');
const s = NB.sketch(43); s.poly([[100, 1330], [380, 1000], [540, 760], [700, 1000], [980, 1330]], { w: 11 }); s.poly([[300, 1320], [420, 1220], [360, 1140], [470, 1040], [430, 960], [520, 860]], { w: 5, dash: true }); const A = s.mark();
s.figure(220, 1330, 150, 'point'); s.figure(330, 1330, 140, 'stand'); const B = s.mark();
s.circle(760, 700, 230, { w: 8 }, 90); s.poly([[700, 785], [650, 860], [760, 792]], { w: 8 }); const C = s.mark();
window.renderFrame = function (t) { const D = DURATION; NB.paper(g); NB.wash(g, [[100, 1330], [380, 1000], [540, 760], [700, 1000], [980, 1330]], 'rgba(45,60,50,1)', 0.45); NB.glow(g, 540, 770, 120, 'rgba(255,214,120,0.6)', 1);
  s.draw(g, t, { parts: [[0, A, 0, D * 0.3], [A, B, D * 0.25, D * 0.5], [B, C, D * 0.5, D * 0.65]] });
  NB.note(g, '@ ട്രെക്ക് ഫ്രണ്ട്', 760, 718, { a: NB.cl((t - D * 0.6) / 0.2), col: '#b5281f', size: 52, font: 'Baloo' });
};
