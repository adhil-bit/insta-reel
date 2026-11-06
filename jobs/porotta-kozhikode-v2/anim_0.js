NB.use('whiteboard'); const c = makeCanvas(), g = c.getContext('2d'); const AC = NB.style.accent, RD = '#d23b2f';
function spiral(s, cx, cy, R, turns, o) { const p = []; for (let a = 0; a <= turns * 6.283; a += 0.25) { const r = 14 + (R - 14) * a / (turns * 6.283); p.push([cx + r * Math.cos(a), cy + r * Math.sin(a) * 0.9]); } s.poly(p, o); }
const s = NB.sketch(21);
spiral(s, 300, 900, 190, 4.2, { w: 7 }); s.circle(300, 900, 200, { w: 8 }, 182);
s.text('+', 540, 930, { size: 120, font: 'Hand' });
s.arc(770, 900, 170, 0.05, 3.09, { w: 8 }, 120); s.line(600, 905, 940, 905, { w: 8 });
for (const [x, y] of [[700, 880], [770, 868], [845, 884], [735, 840], [810, 838]]) s.poly([[x - 26, y], [x - 8, y - 22], [x + 24, y - 14], [x + 22, y + 10], [x - 20, y + 12], [x - 26, y]], { w: 5 });
for (const x of [710, 780, 850]) s.curve([[x, 800], [x - 18, 770], [x + 14, 740], [x - 6, 705]], { w: 4, col: '#7c8796' });
const A = s.mark();
s.curve([[300, 1110], [360, 1230], [470, 1270]], { w: 5, dash: true, col: AC }); s.curve([[770, 1030], [700, 1200], [610, 1270]], { w: 5, dash: true, col: AC });
s.curve([[540, 1350], [490, 1270], [500, 1225], [540, 1205], [580, 1225], [590, 1270], [540, 1350]], { w: 8, col: RD }); s.circle(540, 1262, 18, { w: 6, col: RD });
s.text('KOZHIKODE', 790, 1300, { size: 64, font: 'Hand', col: RD });
const B = s.mark();
window.renderFrame = function (t) { NB.paper(g); const D = DURATION;
  const w = NB.cl((t - D * 0.35) / 0.6); NB.blob(g, 300, 900, 200, 182, '#e7b45a', w * 0.7); NB.blob(g, 770, 960, 150, 60, '#8a4a2a', w * 0.6);
  s.draw(g, t, { parts: [[0, A, 0, D * 0.45], [A, B, D * 0.45, D * 0.8]] });
  NB.note(g, '?', 960, 1290, { size: 190, col: RD, font: 'Hand', a: NB.cl((t - D * 0.78) / 0.2) });
  NB.stamp(g, 'ട്രോൾ!', 800, 650, NB.cl((t - D * 0.3) / 0.2), { col: RD, size: 66, rot: 0.1 });
};
