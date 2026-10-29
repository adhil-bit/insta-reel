function crow(g, x, y, s, t, pose = 'perch', a = 1) {   // flat crow silhouette; (x,y) = feet
  g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(s, s); g.fillStyle = '#0c0c10';
  if (pose === 'fly') { const f = Math.sin(t * 9) * 0.6; g.beginPath(); g.ellipse(0, 0, 36, 13, 0, 0, 6.283); g.fill(); g.beginPath(); g.arc(34, -6, 11, 0, 6.283); g.fill();
    g.beginPath(); g.moveTo(42, -6); g.lineTo(58, -2); g.lineTo(42, -1); g.fill(); g.beginPath(); g.moveTo(-6, -4); g.quadraticCurveTo(-20, -40 * f - 20, -50, -30 * f - 14); g.lineTo(10, -4); g.fill(); g.beginPath(); g.moveTo(-34, 0); g.lineTo(-56, -6); g.lineTo(-56, 8); g.fill(); }
  else { g.beginPath(); g.ellipse(0, -34, 24, 34, -0.35, 0, 6.283); g.fill(); g.beginPath(); g.arc(14, -70, 13, 0, 6.283); g.fill(); g.beginPath(); g.moveTo(24, -73); g.lineTo(44, -68); g.lineTo(24, -64); g.fill();
    g.beginPath(); g.moveTo(-14, -14); g.lineTo(-40, 14); g.lineTo(-26, 16); g.fill(); g.fillRect(-4, -4, 3, 6); g.fillRect(6, -4, 3, 6); g.fillStyle = '#e8e8e8'; g.beginPath(); g.arc(18, -72, 2.4, 0, 6.283); g.fill(); }
  g.restore(); }
function pole(g, x, base, h, t) { g.fillStyle = '#8a8a86'; g.fillRect(x - 12, base - h, 24, h); g.fillStyle = '#5a5a56'; g.fillRect(x - 90, base - h + 20, 180, 14); for (const dx of [-80, 0, 80]) { g.fillStyle = '#d8d8d0'; g.fillRect(x + dx - 5, base - h + 6, 10, 16); } }
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), mv = ease.inOut(clamp((k - 0.1) / 0.5));
  SK.sky(g, 'sunset', 0.64); SK.ground(g, H * 0.64, '#2a2026', '#120c12');
  SK.palm(g, W * 0.12, H * 0.66, 420, 40, SK.ink, t); SK.house(g, W * 0.24, H * 0.65, 0.5, '#1a1014', 1, t);
  g.fillStyle = '#241c2a'; for (let i = 0; i < 4; i++) { const bh = 260 + i * 70; g.fillRect(W * (0.56 + i * 0.1), H * 0.64 - bh, W * 0.08, bh); }
  g.strokeStyle = rgba(ACCENT, 0.8); g.lineWidth = 6; g.setLineDash([18, 12]); g.beginPath(); g.moveTo(W * 0.24, H * 0.42); g.quadraticCurveTo(W * 0.45, H * 0.25, W * 0.7, H * 0.4); g.stroke(); g.setLineDash([]);
  for (let i = 0; i < 7; i++) { const u = clamp(mv * 1.4 - i * 0.06); const x = lerp(W * 0.24, W * 0.7, u) + (i % 3) * 20, y = H * 0.42 - Math.sin(u * Math.PI) * 140 + (i % 2) * 18; crow(g, x, y, 0.7, t + i, u > 0 && u < 1 ? 'fly' : 'perch'); }
  const q = ease.out(clamp((k - 0.7) / 0.2)); if (q > 0) { g.fillStyle = rgba(ACCENT, q); g.beginPath(); g.roundRect(W * 0.38, H * 0.2 - 50 * q, 260, 110, 28); g.fill(); g.beginPath(); g.moveTo(W * 0.42, H * 0.2 + 60 * q - 50 * q + 50); g.lineTo(W * 0.4, H * 0.2 + 80); g.lineTo(W * 0.47, H * 0.2 + 58); g.fill();
    g.fillStyle = '#120c12'; for (let j = 0; j < 3; j++) { g.beginPath(); g.arc(W * 0.43 + j * 60, H * 0.2 + 5, 12, 0, 6.283); g.fill(); } }
  SK.grain(g, t, 0.06); };
