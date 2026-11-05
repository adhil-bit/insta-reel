const c = makeCanvas(), g = c.getContext('2d');
const s = NB.sketch(21);
// cake stand
s.circle(540, 1235, 310, {}, 52); s.line(540, 1287, 540, 1340, { w: 7 }); s.circle(540, 1352, 150, {}, 24);
// cake body
s.circle(540, 930, 250, { w: 6 }, 62); s.line(290, 930, 290, 1170, { w: 6 }); s.line(790, 930, 790, 1170, { w: 6 }); s.arc(540, 1170, 250, 0, Math.PI, { w: 6 }, 62);
for (let i = 0; i < 16; i++) { const x = 320 + (i * 61) % 440, y = 1000 + (i * 37) % 140; s.circle(x, y, 9, { w: 3, amp: 1 }); }   // fruit bits
s.curve([[300, 940], [360, 985], [430, 958], [500, 992], [570, 960], [640, 990], [710, 958], [780, 940]], { w: 4 });            // icing drip
for (const x of [430, 540, 650]) { s.circle(x, 895, 22, { w: 5 }); s.curve([[x, 873], [x + 8, 845], [x + 26, 830]], { w: 4 }); }  // cherries
for (const x of [430, 540, 650]) s.curve([[x, 800], [x - 18, 760], [x + 10, 720], [x - 8, 680]], { w: 3, col: '#8a7a6a' });       // steam
s.rect(150, 640, 170, 90, { w: 4 }); s.line(235, 730, 300, 900, { w: 3 }); s.text('1883', 235, 705, { size: 58, col: NB.RED });   // tag
const A = s.mark();
window.renderFrame = function (t) {
  NB.paper(g); const w = NB.cl((t - DURATION * 0.55) / 1.0);
  NB.wash(g, [[292, 935], [788, 935], [788, 1170], [540, 1232], [292, 1170]], '#8a4b2a', w); NB.blob(g, 540, 930, 245, 58, NB.GOLD, w);
  for (const x of [430, 540, 650]) NB.blob(g, x, 895, 22, 22, NB.RED, w * 1.4); NB.blob(g, 540, 1235, 300, 48, NB.BLUE, w * 0.35);
  s.draw(g, t, { parts: [[0, A, 0, Math.min(3.4, DURATION * 0.6)]] });
};
