function crow(g, x, y, s, t, pose = 'perch', a = 1) {   // flat crow silhouette; (x,y) = feet
  g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(s, s); g.fillStyle = '#0c0c10';
  if (pose === 'fly') { const f = Math.sin(t * 9) * 0.6; g.beginPath(); g.ellipse(0, 0, 36, 13, 0, 0, 6.283); g.fill(); g.beginPath(); g.arc(34, -6, 11, 0, 6.283); g.fill();
    g.beginPath(); g.moveTo(42, -6); g.lineTo(58, -2); g.lineTo(42, -1); g.fill(); g.beginPath(); g.moveTo(-6, -4); g.quadraticCurveTo(-20, -40 * f - 20, -50, -30 * f - 14); g.lineTo(10, -4); g.fill(); g.beginPath(); g.moveTo(-34, 0); g.lineTo(-56, -6); g.lineTo(-56, 8); g.fill(); }
  else { g.beginPath(); g.ellipse(0, -34, 24, 34, -0.35, 0, 6.283); g.fill(); g.beginPath(); g.arc(14, -70, 13, 0, 6.283); g.fill(); g.beginPath(); g.moveTo(24, -73); g.lineTo(44, -68); g.lineTo(24, -64); g.fill();
    g.beginPath(); g.moveTo(-14, -14); g.lineTo(-40, 14); g.lineTo(-26, 16); g.fill(); g.fillRect(-4, -4, 3, 6); g.fillRect(6, -4, 3, 6); g.fillStyle = '#e8e8e8'; g.beginPath(); g.arc(18, -72, 2.4, 0, 6.283); g.fill(); }
  g.restore(); }
function pole(g, x, base, h, t) { g.fillStyle = '#8a8a86'; g.fillRect(x - 12, base - h, 24, h); g.fillStyle = '#5a5a56'; g.fillRect(x - 90, base - h + 20, 180, 14); for (const dx of [-80, 0, 80]) { g.fillStyle = '#d8d8d0'; g.fillRect(x + dx - 5, base - h + 6, 10, 16); } }
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), arrive = ease.out(clamp((k - 0.65) / 0.3));
  SK.sky(g, 'dawn', 0.6); SK.sun(g, W * 0.72, H * 0.5, 80, '#ffe0a0', 0.5); SK.ground(g, H * 0.62, '#6a4a32', '#3a2618'); SK.palm(g, W * 0.1, H * 0.64, 460, 40, SK.ink, t); SK.house(g, W * 0.82, H * 0.63, 0.7, '#2a1a12', 1, t);
  g.fillStyle = '#3a8a3a'; g.beginPath(); g.ellipse(W * 0.5, H * 0.66, 200, 60, 0, 0, 6.283); g.fill(); g.fillStyle = '#f2ede0'; for (const [dx, dy] of [[-60, -6], [0, -14], [60, -6], [-25, 12], [30, 12]]) { g.beginPath(); g.arc(W * 0.5 + dx, H * 0.66 + dy, 18, 0, 6.283); g.fill(); }
  SK.lamp(g, W * 0.32, H * 0.67, 0.6, t);
  if (arrive > 0) crow(g, lerp(W * 1.1, W * 0.66, arrive), lerp(H * 0.3, H * 0.62, arrive), 1.4, t, arrive < 0.95 ? 'fly' : 'perch');
  SK.grain(g, t, 0.06); };
