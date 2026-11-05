const c = makeCanvas(), g = c.getContext('2d');
const s = NB.sketch(31);
s.line(110, 1240, 970, 1240, { w: 6 });                                                         // ground
s.poly([[230, 820], [540, 630], [850, 820], [230, 820]], { w: 6 });                              // roof
for (let i = 1; i < 6; i++) s.line(230 + i * 52, 820 - i * 32, 850 - i * 52, 820 - i * 32, { w: 3, amp: 1 });  // roof tiles
s.rect(270, 820, 540, 420, { w: 6 }); s.rect(480, 1030, 120, 210, { w: 5 });                     // walls, door
s.rect(320, 930, 120, 100, { w: 5 }); s.line(380, 930, 380, 1030, { w: 3 }); s.rect(640, 930, 120, 100, { w: 5 }); s.line(700, 930, 700, 1030, { w: 3 });
s.rect(350, 838, 380, 62, { w: 4 }); s.text('ROYAL BISCUIT FACTORY', 540, 882, { size: 38, font: 'Hand' });
s.rect(700, 660, 46, 90, { w: 5 }); for (let k = 0; k < 2; k++) s.curve([[723 + k * 14, 650], [700 + k * 14, 610], [740 + k * 14, 570], [715 + k * 14, 530]], { w: 3, col: '#8a7a6a' });
const A = s.mark();
s.figure(160, 1240, 260, 'point'); s.text('ബാപ്പു', 160, 1300, { size: 50 });
const B = s.mark();
window.renderFrame = function (t) {
  NB.paper(g); const w = NB.cl((t - DURATION * 0.5) / 1.0);
  NB.wash(g, [272, 822, 536, 416], NB.BROWN, w * 0.6); NB.wash(g, [[235, 818], [540, 634], [846, 818]], NB.RED, w * 0.7);
  NB.wash(g, [322, 932, 116, 96], NB.GOLD, w); NB.wash(g, [642, 932, 116, 96], NB.GOLD, w); NB.glow(g, 540, 1130, 260, 'rgba(255,200,90,0.5)', w);
  s.draw(g, t, { parts: [[0, A, 0, DURATION * 0.45], [A, B, DURATION * 0.4, DURATION * 0.62]] });
  NB.stamp(g, '1883', 860, 640, NB.cl((t - DURATION * 0.66) / 0.35), { size: 60 });
};
