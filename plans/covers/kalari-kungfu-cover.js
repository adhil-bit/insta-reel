const c = makeCanvas(), g = c.getContext('2d');
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
window.renderFrame = function (t) {
  const L = g.createLinearGradient(0, 0, 0, H); L.addColorStop(0, '#2a0e06'); L.addColorStop(0.55, '#8a3416'); L.addColorStop(1, '#1a0804');
  g.fillStyle = L; g.fillRect(0, 0, W / 2, H);
  const R = g.createLinearGradient(0, 0, 0, H); R.addColorStop(0, '#0a1420'); R.addColorStop(0.55, '#3a5068'); R.addColorStop(1, '#0a0e14');
  g.fillStyle = R; g.fillRect(W / 2, 0, W / 2, H);
  g.save(); g.beginPath(); g.rect(W / 2, 0, W / 2, H); g.clip();
  g.fillStyle = 'rgba(200,215,230,0.18)'; for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(W / 2, H * (0.4 + i * 0.03)); for (let x = W / 2; x <= W; x += 30) g.lineTo(x, H * (0.38 + i * 0.03) - Math.abs(Math.sin(x / 120 + i)) * 160); g.lineTo(W, H); g.lineTo(W / 2, H); g.fill(); }
  g.fillStyle = '#0a0e14'; const px = W * 0.8, py = H * 0.32; for (let i = 0; i < 3; i++) { const w = 220 - i * 50; g.beginPath(); g.moveTo(px - w, py - i * 70); g.quadraticCurveTo(px, py - i * 70 - 40, px + w, py - i * 70); g.lineTo(px + w - 30, py - i * 70 + 14); g.lineTo(px - w + 30, py - i * 70 + 14); g.fill(); g.fillRect(px - w * 0.5, py - i * 70 + 14, w, 56); }
  g.restore();
  g.save(); g.beginPath(); g.rect(0, 0, W / 2, H); g.clip(); SK.lamp(g, W * 0.1, H * 0.62, 0.9, t); SK.lamp(g, W * 0.4, H * 0.62, 0.7, t + 1); g.restore();
  kalari(W * 0.24, H * 0.6, 1.0, '#0c0402'); crane(W * 0.76, H * 0.6, 1.0, '#05080c');
  g.fillStyle = '#efe4c8'; g.fillRect(W / 2 - 3, 0, 6, H);
  g.font = '800 260px Inter, serif'; g.textAlign = 'center'; g.fillStyle = '#FACC15'; g.shadowColor = '#FACC15'; g.shadowBlur = 40; g.fillText('?', W / 2, H * 0.33); g.shadowBlur = 0;
  g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(0, H * 0.6, W, H);
  SK.grain(g, t, 0.08); };
