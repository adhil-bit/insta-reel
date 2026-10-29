function crow(g, x, y, s, t, pose = 'perch', a = 1) {   // flat crow silhouette; (x,y) = feet
  g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(s, s); g.fillStyle = '#0c0c10';
  if (pose === 'fly') { const f = Math.sin(t * 9) * 0.6; g.beginPath(); g.ellipse(0, 0, 36, 13, 0, 0, 6.283); g.fill(); g.beginPath(); g.arc(34, -6, 11, 0, 6.283); g.fill();
    g.beginPath(); g.moveTo(42, -6); g.lineTo(58, -2); g.lineTo(42, -1); g.fill(); g.beginPath(); g.moveTo(-6, -4); g.quadraticCurveTo(-20, -40 * f - 20, -50, -30 * f - 14); g.lineTo(10, -4); g.fill(); g.beginPath(); g.moveTo(-34, 0); g.lineTo(-56, -6); g.lineTo(-56, 8); g.fill(); }
  else { g.beginPath(); g.ellipse(0, -34, 24, 34, -0.35, 0, 6.283); g.fill(); g.beginPath(); g.arc(14, -70, 13, 0, 6.283); g.fill(); g.beginPath(); g.moveTo(24, -73); g.lineTo(44, -68); g.lineTo(24, -64); g.fill();
    g.beginPath(); g.moveTo(-14, -14); g.lineTo(-40, 14); g.lineTo(-26, 16); g.fill(); g.fillRect(-4, -4, 3, 6); g.fillRect(6, -4, 3, 6); g.fillStyle = '#e8e8e8'; g.beginPath(); g.arc(18, -72, 2.4, 0, 6.283); g.fill(); }
  g.restore(); }
function pole(g, x, base, h, t) { g.fillStyle = '#8a8a86'; g.fillRect(x - 12, base - h, 24, h); g.fillStyle = '#5a5a56'; g.fillRect(x - 90, base - h + 20, 180, 14); for (const dx of [-80, 0, 80]) { g.fillStyle = '#d8d8d0'; g.fillRect(x + dx - 5, base - h + 6, 10, 16); } }
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), zap = clamp((k - 0.45) / 0.06), fall = ease.in(clamp((k - 0.5) / 0.3));
  SK.sky(g, 'day', 0.7); SK.ground(g, H * 0.7, '#7a8a5a', '#4a5a3a');
  pole(g, W * 0.2, H * 0.72, 760, t); pole(g, W * 0.86, H * 0.72, 760, t);
  const wy = [H * 0.72 - 754, H * 0.72 - 754, H * 0.72 - 754]; g.strokeStyle = '#2a2a2a'; g.lineWidth = 4;
  [-80, 0, 80].forEach((dx, i) => { g.beginPath(); g.moveTo(W * 0.2 + dx, wy[i]); g.quadraticCurveTo(W * 0.53, wy[i] + 70 + i * 4, W * 0.86 + dx, wy[i]); g.stroke(); });
  g.fillStyle = '#6a6a66'; g.fillRect(W * 0.86 - 70, H * 0.72 - 520, 140, 170); g.fillStyle = '#4a4a46'; for (let i = 0; i < 5; i++) g.fillRect(W * 0.86 - 70 + i * 30, H * 0.72 - 540, 14, 24);
  for (let i = 0; i < 3; i++) crow(g, W * (0.36 + i * 0.09), H * 0.72 - 690 + i * 3, 0.9, t + i);
  const cx = W * 0.62, cy = H * 0.72 - 686 + fall * 900;
  if (zap > 0 && zap < 1) { g.fillStyle = `rgba(255,255,200,${1 - zap})`; g.fillRect(0, 0, W, H); g.strokeStyle = '#fff6a0'; g.lineWidth = 6; for (let i = 0; i < 8; i++) { const a = i * 0.785; g.beginPath(); g.moveTo(cx, cy - 40); g.lineTo(cx + Math.cos(a) * 90, cy - 40 + Math.sin(a) * 90); g.stroke(); } }
  g.save(); g.translate(cx, cy); g.rotate(fall * 2.2); crow(g, 0, 0, 0.9, t, 'perch', 1 - 0.3 * fall); g.restore();
  SK.grain(g, t, 0.05); };
