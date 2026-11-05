const c = makeCanvas(), g = c.getContext('2d');
const s = NB.sketch(71);
s.circle(540, 1180, 330, { w: 6 }, 84); s.circle(540, 1180, 250, { w: 3 }, 60);                                                 // plate
s.poly([[370, 1170], [690, 1080], [700, 1170], [380, 1240], [370, 1170]], { w: 6 }); s.line(690, 1080, 700, 1170, { w: 5 });   // slice
for (let i = 0; i < 6; i++) s.circle(430 + i * 45, 1185 - i * 12, 8, { w: 3, amp: 1 });
s.line(860, 1000, 820, 1300, { w: 6 }); for (let k = 0; k < 3; k++) s.line(850 + k * 14, 960, 846 + k * 14, 1010, { w: 4 });     // fork
const A = s.mark();
s.circle(270, 720, 60, { w: 5 }); s.poly([[220, 750], [270, 840], [320, 750]], { w: 5 }); s.text('തലശ്ശേരി', 270, 900, { size: 52 });   // pin
s.circle(780, 700, 190, { w: 5 }, 95); s.poly([[700, 785], [650, 870], [760, 792]], { w: 5 });                                 // comment bubble
const B = s.mark();
window.renderFrame = function (t) {
  NB.paper(g); const w = NB.cl((t - DURATION * 0.35) / 0.8);
  NB.blob(g, 540, 1180, 320, 80, NB.BLUE, w * 0.3); NB.wash(g, [[372, 1172], [688, 1084], [698, 1168], [382, 1236]], '#8a4b2a', w); NB.blob(g, 270, 720, 58, 58, NB.RED, w);
  s.draw(g, t, { parts: [[0, A, 0, DURATION * 0.4], [A, B, DURATION * 0.4, DURATION * 0.65]] });
  const q = NB.cl((t - DURATION * 0.66) / 0.3); for (let j = 0; j < 3; j++) NB.blob(g, 710 + j * 70, 700, 22 * q, 22 * q, NB.INK, q * 1.6);
};
