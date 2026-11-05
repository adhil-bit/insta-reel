const c = makeCanvas(), g = c.getContext('2d');
const s = NB.sketch(41);
s.line(200, 1150, 880, 1150, { w: 6 }); s.line(250, 1150, 250, 1300, { w: 5 }); s.line(830, 1150, 830, 1300, { w: 5 });       // table
s.rect(470, 1060, 140, 90, { w: 5 }); s.circle(540, 1060, 70, { w: 5 }, 16); s.circle(540, 1030, 14, { w: 4 });              // English cake
const A = s.mark();
s.figure(180, 1330, 300, 'stand'); s.text('ബാപ്പു', 180, 1385, { size: 46 });
s.figure(900, 1330, 300, 'point'); s.line(845, 1032, 955, 1032, { w: 6 }); s.rect(870, 975, 60, 57, { w: 5 });             // sahib + hat
s.text('ബ്രൗൺ സായിപ്പ്', 900, 1385, { size: 46 });
const B = s.mark();
s.circle(700, 760, 230, { w: 5 }, 100); s.poly([[780, 852], [850, 950], [730, 858]], { w: 5 });                                // speech bubble
s.text('ഇതുപോലൊന്ന്', 700, 750, { size: 54 }); s.text('ഉണ്ടാക്കാമോ?', 700, 812, { size: 54, col: NB.RED });
const C = s.mark();
window.renderFrame = function (t) {
  NB.paper(g); const w = NB.cl((t - DURATION * 0.35) / 0.8);
  NB.wash(g, [472, 1050, 136, 98], '#8a4b2a', w); NB.blob(g, 540, 1060, 68, 15, NB.GOLD, w); NB.wash(g, [872, 977, 56, 54], NB.INK, w * 0.6);
  s.draw(g, t, { parts: [[0, A, 0, DURATION * 0.22], [A, B, DURATION * 0.15, DURATION * 0.45], [B, C, DURATION * 0.45, DURATION * 0.7]] });
};
