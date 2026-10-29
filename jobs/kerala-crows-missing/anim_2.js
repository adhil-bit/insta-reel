function crow(g, x, y, s, t, pose = 'perch', a = 1) {   // flat crow silhouette; (x,y) = feet
  g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(s, s); g.fillStyle = '#0c0c10';
  if (pose === 'fly') { const f = Math.sin(t * 9) * 0.6; g.beginPath(); g.ellipse(0, 0, 36, 13, 0, 0, 6.283); g.fill(); g.beginPath(); g.arc(34, -6, 11, 0, 6.283); g.fill();
    g.beginPath(); g.moveTo(42, -6); g.lineTo(58, -2); g.lineTo(42, -1); g.fill(); g.beginPath(); g.moveTo(-6, -4); g.quadraticCurveTo(-20, -40 * f - 20, -50, -30 * f - 14); g.lineTo(10, -4); g.fill(); g.beginPath(); g.moveTo(-34, 0); g.lineTo(-56, -6); g.lineTo(-56, 8); g.fill(); }
  else { g.beginPath(); g.ellipse(0, -34, 24, 34, -0.35, 0, 6.283); g.fill(); g.beginPath(); g.arc(14, -70, 13, 0, 6.283); g.fill(); g.beginPath(); g.moveTo(24, -73); g.lineTo(44, -68); g.lineTo(24, -64); g.fill();
    g.beginPath(); g.moveTo(-14, -14); g.lineTo(-40, 14); g.lineTo(-26, 16); g.fill(); g.fillRect(-4, -4, 3, 6); g.fillRect(6, -4, 3, 6); g.fillStyle = '#e8e8e8'; g.beginPath(); g.arc(18, -72, 2.4, 0, 6.283); g.fill(); }
  g.restore(); }
function pole(g, x, base, h, t) { g.fillStyle = '#8a8a86'; g.fillRect(x - 12, base - h, 24, h); g.fillStyle = '#5a5a56'; g.fillRect(x - 90, base - h + 20, 180, 14); for (const dx of [-80, 0, 80]) { g.fillStyle = '#d8d8d0'; g.fillRect(x + dx - 5, base - h + 6, 10, 16); } }
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), cut = clamp(k / 0.6), city = ease.out(clamp((k - 0.3) / 0.5));
  SK.sky(g, 'sunset', 0.66); SK.ground(g, H * 0.66, '#3a2a22', '#1a1210');
  for (let i = 0; i < 5; i++) { const x = W * (0.12 + i * 0.19), gone = cut > (i + 1) / 6; g.fillStyle = '#1a1014';
    if (!gone) { g.fillRect(x - 14, H * 0.66 - 300, 28, 300); g.beginPath(); g.arc(x, H * 0.66 - 330, 120, 0, 6.283); g.fill(); } else { g.fillRect(x - 18, H * 0.66 - 30, 36, 30); } }
  g.fillStyle = '#2a2230'; for (let i = 0; i < 7; i++) { const bh = (220 + (i * 97) % 260) * city; g.fillRect(W * (0.04 + i * 0.14), H * 0.66 - bh, W * 0.1, bh); g.fillStyle = 'rgba(255,214,140,0.5)'; for (let j = 0; j < bh / 50; j++) g.fillRect(W * (0.06 + i * 0.14), H * 0.66 - 30 - j * 50, 16, 14); g.fillStyle = '#2a2230'; }
  for (let i = 0; i < 6; i++) { const a = t * 0.8 + i; crow(g, W * 0.5 + Math.cos(a) * (220 + i * 20), H * 0.3 + Math.sin(a * 1.3) * 80, 0.8, t + i, 'fly'); }
  SK.grain(g, t, 0.06); };
