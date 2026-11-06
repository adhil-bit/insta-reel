const c = makeCanvas(), g = c.getContext('2d');
const crowd = []; for (let i = 0; i < 22; i++) crowd.push([i * 52 + (i % 3) * 9, 1330 + (i % 2) * 26, 30 + (i % 4) * 4]);
window.renderFrame = function (t) {
  CT.sky(g, '#120a24', '#2a1238', '#3a1a2a');
  for (const [x, a] of [[220, 0.18], [860, 0.14]]) { g.save(); g.globalAlpha = a; g.fillStyle = '#ffd9a0'; g.beginPath(); g.moveTo(x, 0); g.lineTo(x - 260, 1300); g.lineTo(x + 260, 1300); g.fill(); g.restore(); }
  g.fillStyle = '#1a0e16'; g.fillRect(0, 1250, W, H);
  const T = 3.0, u = (t % T) / T, x = 160 + 760 * u, ring = { x: 540, y: 960, rx: 150, ry: 250 };
  const P = CT.at([[0, 'stance'], [0.25, 'stance'], [0.42, 'leap'], [0.62, 'leap'], [0.78, 'stance'], [1, 'stance']], u);
  P.lift = Math.max(0, Math.sin(Math.PI * Math.min(1, Math.max(0, (u - 0.3) / 0.45)))) * 170;
  CT.fireRing(g, ring.x, ring.y, ring.rx, ring.ry, t, 'back');
  CT.fighter(g, x, 1250, 1.05, P, { dir: 1, weapon: 'torch', shield: false, t });
  CT.fireRing(g, ring.x, ring.y, ring.rx, ring.ry, t, 'front');
  for (const [cx, cy, r] of crowd) { g.fillStyle = '#07040a'; g.beginPath(); g.arc(cx, cy, r, 0, 6.283); g.fill(); g.fillRect(cx - r * 1.2, cy + r * 0.6, r * 2.4, 200); }
  for (let i = 0; i < 5; i++) { const px = 120 + i * 210, on = Math.sin(t * 3 + i * 2) > 0.2; g.fillStyle = '#111'; g.fillRect(px, 1215 - (i % 2) * 30, 46, 80); g.fillStyle = on ? '#cfe4ff' : '#5a6a80'; g.fillRect(px + 5, 1221 - (i % 2) * 30, 36, 64);
    if (on && Math.sin(t * 11 + i) > 0.92) { g.fillStyle = 'rgba(255,255,255,0.6)'; g.beginPath(); g.arc(px + 23, 1250 - (i % 2) * 30, 60, 0, 6.283); g.fill(); } }
};