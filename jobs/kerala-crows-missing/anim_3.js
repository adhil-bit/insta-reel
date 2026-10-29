function crow(g, x, y, s, t, pose = 'perch', a = 1) {   // flat crow silhouette; (x,y) = feet
  g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(s, s); g.fillStyle = '#0c0c10';
  if (pose === 'fly') { const f = Math.sin(t * 9) * 0.6; g.beginPath(); g.ellipse(0, 0, 36, 13, 0, 0, 6.283); g.fill(); g.beginPath(); g.arc(34, -6, 11, 0, 6.283); g.fill();
    g.beginPath(); g.moveTo(42, -6); g.lineTo(58, -2); g.lineTo(42, -1); g.fill(); g.beginPath(); g.moveTo(-6, -4); g.quadraticCurveTo(-20, -40 * f - 20, -50, -30 * f - 14); g.lineTo(10, -4); g.fill(); g.beginPath(); g.moveTo(-34, 0); g.lineTo(-56, -6); g.lineTo(-56, 8); g.fill(); }
  else { g.beginPath(); g.ellipse(0, -34, 24, 34, -0.35, 0, 6.283); g.fill(); g.beginPath(); g.arc(14, -70, 13, 0, 6.283); g.fill(); g.beginPath(); g.moveTo(24, -73); g.lineTo(44, -68); g.lineTo(24, -64); g.fill();
    g.beginPath(); g.moveTo(-14, -14); g.lineTo(-40, 14); g.lineTo(-26, 16); g.fill(); g.fillRect(-4, -4, 3, 6); g.fillRect(6, -4, 3, 6); g.fillStyle = '#e8e8e8'; g.beginPath(); g.arc(18, -72, 2.4, 0, 6.283); g.fill(); }
  g.restore(); }
function pole(g, x, base, h, t) { g.fillStyle = '#8a8a86'; g.fillRect(x - 12, base - h, 24, h); g.fillStyle = '#5a5a56'; g.fillRect(x - 90, base - h + 20, 180, 14); for (const dx of [-80, 0, 80]) { g.fillStyle = '#d8d8d0'; g.fillRect(x + dx - 5, base - h + 6, 10, 16); } }
const c = makeCanvas(), g = c.getContext('2d'); const drops = Array.from({length: 70}, () => [rand(), rand()]);
window.renderFrame = function (t) { const k = clamp(t / DURATION), mist = ease.inOut(clamp((k - 0.15) / 0.4));
  SK.sky(g, 'day', 0.56); g.fillStyle = '#5a8a3a'; g.fillRect(0, H * 0.56, W, H);
  g.strokeStyle = '#7aaa4a'; g.lineWidth = 4; for (let r = 0; r < 14; r++) for (let i = 0; i < 26; i++) { const x = (i * 44 + r * 13) % W, y = H * 0.58 + r * 40; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 6 + Math.sin(t + i) * 3, y - 26); g.stroke(); }
  const fx = lerp(W * 0.15, W * 0.7, k); SK.person(g, fx, H * 0.7, 320, 'stand', '#1a1a14', t * 3); g.fillStyle = '#d8d0b0'; g.fillRect(fx - 50, H * 0.7 - 260, 50, 70); g.strokeStyle = '#3a3a2a'; g.lineWidth = 6; g.beginPath(); g.moveTo(fx + 30, H * 0.7 - 180); g.lineTo(fx + 120, H * 0.7 - 110); g.stroke();
  for (const [x, y] of drops) { const px = fx + 120 + x * 260 - 60, py = H * 0.7 - 110 + y * 120; g.fillStyle = `rgba(220,240,200,${0.5 * mist})`; g.beginPath(); g.arc(px, py, 4, 0, 6.283); g.fill(); }
  g.fillStyle = `rgba(200,230,180,${0.25 * mist})`; g.fillRect(0, H * 0.56, W, H * 0.3);
  crow(g, W * 0.82, H * 0.74, 1.2, t, 'perch', 1 - 0.5 * clamp((k - 0.7) / 0.3)); SK.grain(g, t, 0.05); };
