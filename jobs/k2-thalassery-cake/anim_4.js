const c = makeCanvas(), g = c.getContext('2d');
const s = NB.sketch(61);
s.circle(540, 1235, 310, {}, 52); s.line(540, 1287, 540, 1340, { w: 7 }); s.circle(540, 1352, 150, {}, 24);
s.circle(540, 930, 250, { w: 6 }, 62); s.line(290, 930, 290, 1170, { w: 6 }); s.line(790, 930, 790, 1170, { w: 6 }); s.arc(540, 1170, 250, 0, Math.PI, { w: 6 }, 62);
for (let i = 0; i < 16; i++) { const x = 320 + (i * 61) % 440, y = 1000 + (i * 37) % 140; s.circle(x, y, 9, { w: 3, amp: 1 }); }
const star = []; for (let i = 0; i <= 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 34 : 80; star.push([540 + Math.cos(a) * r, 780 + Math.sin(a) * r]); }
s.poly(star, { w: 5 }); s.line(540, 860, 540, 900, { w: 5 });
const A = s.mark();
for (const [x, y, a] of [[230, 760, -2.4], [850, 760, -0.7], [180, 1020, 3.14], [900, 1020, 0]]) s.line(x, y, x + Math.cos(a) * 60, y + Math.sin(a) * 60, { w: 5, col: NB.GOLD });
const B = s.mark();
window.renderFrame = function (t) {
  NB.paper(g); const w = NB.cl((t - DURATION * 0.4) / 0.8);
  NB.wash(g, [[292, 935], [788, 935], [788, 1170], [540, 1232], [292, 1170]], '#8a4b2a', w); NB.blob(g, 540, 930, 245, 58, NB.GOLD, w); NB.blob(g, 540, 780, 70, 70, NB.GOLD, w * 1.3);
  NB.glow(g, 540, 780, 200, 'rgba(255,214,90,0.6)', w);
  s.draw(g, t, { parts: [[0, A, 0, DURATION * 0.45], [A, B, DURATION * 0.5, DURATION * 0.65]] });
  NB.stamp(g, 'ഇന്ത്യയിലെ ആദ്യം?', 540, 640, NB.cl((t - DURATION * 0.62) / 0.35), { size: 56 });
};
