function crow(g, x, y, s, t, pose = 'perch', a = 1) {   // flat crow silhouette; (x,y) = feet
  g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(s, s); g.fillStyle = '#0c0c10';
  if (pose === 'fly') { const f = Math.sin(t * 9) * 0.6; g.beginPath(); g.ellipse(0, 0, 36, 13, 0, 0, 6.283); g.fill(); g.beginPath(); g.arc(34, -6, 11, 0, 6.283); g.fill();
    g.beginPath(); g.moveTo(42, -6); g.lineTo(58, -2); g.lineTo(42, -1); g.fill(); g.beginPath(); g.moveTo(-6, -4); g.quadraticCurveTo(-20, -40 * f - 20, -50, -30 * f - 14); g.lineTo(10, -4); g.fill(); g.beginPath(); g.moveTo(-34, 0); g.lineTo(-56, -6); g.lineTo(-56, 8); g.fill(); }
  else { g.beginPath(); g.ellipse(0, -34, 24, 34, -0.35, 0, 6.283); g.fill(); g.beginPath(); g.arc(14, -70, 13, 0, 6.283); g.fill(); g.beginPath(); g.moveTo(24, -73); g.lineTo(44, -68); g.lineTo(24, -64); g.fill();
    g.beginPath(); g.moveTo(-14, -14); g.lineTo(-40, 14); g.lineTo(-26, 16); g.fill(); g.fillRect(-4, -4, 3, 6); g.fillRect(6, -4, 3, 6); g.fillStyle = '#e8e8e8'; g.beginPath(); g.arc(18, -72, 2.4, 0, 6.283); g.fill(); }
  g.restore(); }
function pole(g, x, base, h, t) { g.fillStyle = '#8a8a86'; g.fillRect(x - 12, base - h, 24, h); g.fillStyle = '#5a5a56'; g.fillRect(x - 90, base - h + 20, 180, 14); for (const dx of [-80, 0, 80]) { g.fillStyle = '#d8d8d0'; g.fillRect(x + dx - 5, base - h + 6, 10, 16); } }
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION);
  SK.sky(g, 'dusk', 0.66); SK.ground(g, H * 0.66, '#2a2030', '#120c16');
  g.fillStyle = '#120c14'; g.fillRect(W * 0.46, H * 0.66 - 420, 40, 420); g.lineWidth = 16; g.strokeStyle = '#120c14'; for (const [dx, dy, a] of [[-260, -380, 1], [220, -320, 1], [-160, -250, 0.5], [180, -220, 0.5]]) { g.beginPath(); g.moveTo(W * 0.48, H * 0.66 - 300 - dy * 0.1); g.lineTo(W * 0.48 + dx, H * 0.66 + dy); g.stroke(); }
  for (let i = 0; i < 9; i++) { const at = 0.15 + i * 0.07, gone = clamp((k - at) / 0.15); const x = W * 0.48 + (i - 4) * 70, y = H * 0.66 - 360 + Math.abs(i - 4) * 30;
    crow(g, x, y + gone * 40, 0.75, t + i, 'perch', 1 - gone); }
  const p = (t * 0.6) % 1; g.strokeStyle = `rgba(255,90,90,${0.5 * (1 - p)})`; g.lineWidth = 4; g.beginPath(); g.arc(W * 0.48, H * 0.4, 100 + p * 300, 0, 6.283); g.stroke(); SK.grain(g, t, 0.06); };
