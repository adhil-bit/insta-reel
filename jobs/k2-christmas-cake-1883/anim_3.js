const c = makeCanvas(), g = c.getContext('2d');
const s = NB.sketch(51);
s.arc(540, 1070, 270, 0, Math.PI, { w: 7 }, 190); s.circle(540, 1070, 270, { w: 6 }, 46); s.line(640, 1060, 800, 880, { w: 6 }); // bowl + spoon
s.curve([[180, 640], [130, 700], [150, 790], [210, 800], [260, 760], [250, 680], [180, 640]], { w: 5 });                      // cashew apple
s.curve([[190, 800], [160, 840], [190, 880], [230, 860], [215, 820]], { w: 5 }); s.text('കശുമാങ്ങ', 200, 950, { size: 50 });
s.arrow(270, 900, 380, 1000, { w: 4 });
s.rect(830, 680, 100, 170, { w: 5 }); s.rect(860, 620, 40, 60, { w: 5 }); s.text('BRANDY', 880, 775, { size: 30, font: 'Hand' }); s.text('ബ്രാണ്ടി', 880, 920, { size: 50 });
s.text('മൈദ', 250, 1330, { size: 50 }); s.circle(830, 1290, 34, { w: 4 }, 44); s.circle(900, 1300, 34, { w: 4 }, 44); s.text('മുട്ട', 860, 1380, { size: 46 });
const A = s.mark();
s.line(800, 640, 960, 880, { w: 10, col: NB.RED }); s.line(960, 640, 800, 880, { w: 10, col: NB.RED });                       // brandy crossed out
s.arrow(240, 950, 240, 950, { w: 1 });
const B = s.mark();
window.renderFrame = function (t) {
  NB.paper(g); const w = NB.cl((t - DURATION * 0.45) / 0.8);
  NB.blob(g, 200, 720, 62, 82, NB.RED, w); NB.blob(g, 200, 840, 36, 30, NB.GOLD, w); NB.wash(g, [[272, 1075], [808, 1075], [700, 1230], [380, 1230]], NB.BROWN, w * 0.7);
  NB.wash(g, [832, 682, 96, 166], NB.GOLD, w * 0.6);
  s.draw(g, t, { parts: [[0, A, 0, DURATION * 0.55], [A, B, DURATION * 0.62, DURATION * 0.75]] });
  NB.note(g, 'പകരം?', 880, 610, { a: NB.cl((t - DURATION * 0.76) / 0.3), col: NB.RED, size: 54 });
};
