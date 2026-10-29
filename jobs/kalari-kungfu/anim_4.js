function limb(pts, w, col) { g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); }
function kalari(x, y, s, col) {   // low lion stance, sword raised (kalari)
  g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = col;
  g.beginPath(); g.ellipse(10, -235, 30, 34, 0, 0, 6.283); g.fill();
  g.beginPath(); g.moveTo(-34, -200); g.quadraticCurveTo(0, -215, 40, -200); g.lineTo(30, -95); g.quadraticCurveTo(0, -85, -26, -95); g.closePath(); g.fill();
  limb([[-14, -100], [-120, -40], [-170, 0]], 34, col); limb([[18, -100], [90, -60], [110, 0]], 34, col);
  limb([[34, -190], [110, -230], [150, -300]], 24, col); limb([[-30, -190], [-100, -150], [-140, -170]], 24, col);
  g.strokeStyle = '#d8d0c0'; g.lineWidth = 8; g.beginPath(); g.moveTo(150, -300); g.lineTo(215, -440); g.stroke();
  g.fillStyle = '#b02a2a'; g.fillRect(-36, -110, 72, 18); g.restore(); }
function crane(x, y, s, col) {     // kung fu crane stance, knee raised, arms like wings
  g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = col;
  g.beginPath(); g.ellipse(0, -330, 30, 34, 0, 0, 6.283); g.fill();
  g.beginPath(); g.moveTo(-38, -295); g.quadraticCurveTo(0, -310, 38, -295); g.lineTo(28, -175); g.quadraticCurveTo(0, -165, -28, -175); g.closePath(); g.fill();
  limb([[-10, -180], [-14, -90], [-10, 0]], 34, col); limb([[14, -180], [80, -170], [60, -110]], 32, col);
  limb([[-36, -280], [-120, -330], [-200, -300]], 24, col); limb([[36, -280], [110, -360], [150, -420]], 24, col);
  g.restore(); }
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), st = ease.out(clamp((k - 0.4) / 0.2));
  SK.sky(g, 'dusk', 0.64); g.fillStyle = '#1a141c'; g.fillRect(0, H * 0.64, W, H);
  g.fillStyle = '#0c0a10'; const px = W / 2, py = H * 0.4; for (let i = 0; i < 3; i++) { const w = 300 - i * 70; g.beginPath(); g.moveTo(px - w, py - i * 90); g.quadraticCurveTo(px, py - i * 90 - 50, px + w, py - i * 90); g.lineTo(px + w - 40, py - i * 90 + 18); g.lineTo(px - w + 40, py - i * 90 + 18); g.fill(); g.fillRect(px - w * 0.5, py - i * 90 + 18, w, 72); }
  for (let i = 0; i < 4; i++) crane(W * (0.14 + i * 0.24), H * 0.7, 0.55, '#05060a');
  if (st > 0) { g.save(); g.translate(W * 0.5, H * 0.24); g.rotate(-0.12); g.scale(1.4 - 0.4 * st, 1.4 - 0.4 * st); g.globalAlpha = st; g.strokeStyle = '#FACC15'; g.lineWidth = 10; g.strokeRect(-210, -60, 420, 120); g.fillStyle = '#FACC15'; g.font = '800 72px Inter'; g.textAlign = 'center'; g.fillText('LEGEND', 0, 26); g.restore(); }
  SK.grain(g, t, 0.06); };
