const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
// shared cross-section: sky, rock bowl holding the lake, houses on the right rim, trees on the left rim
function crossSection(g, sky, deepTint, waterTop = '#2a5a6a') {
  g.fillStyle = sky; g.fillRect(0, 0, W, H);
  g.fillStyle = '#3a2e26'; g.beginPath(); g.moveTo(0, H * 0.36); g.lineTo(W * 0.2, H * 0.36); g.quadraticCurveTo(W * 0.22, H * 0.62, W * 0.5, H * 0.64); g.quadraticCurveTo(W * 0.78, H * 0.62, W * 0.8, H * 0.36); g.lineTo(W, H * 0.36); g.lineTo(W, H); g.lineTo(0, H); g.fill();
  const wg = g.createLinearGradient(0, H * 0.36, 0, H * 0.63); wg.addColorStop(0, waterTop); wg.addColorStop(1, deepTint); g.fillStyle = wg; g.beginPath(); g.moveTo(W * 0.2, H * 0.36); g.quadraticCurveTo(W * 0.22, H * 0.62, W * 0.5, H * 0.64); g.quadraticCurveTo(W * 0.78, H * 0.62, W * 0.8, H * 0.36); g.closePath(); g.fill();
  for (let i = 0; i < 4; i++) { const x = W * 0.84 + i * 38, y = H * 0.36 - 26; g.fillStyle = '#d8d0c0'; g.fillRect(x, y, 26, 26); g.fillStyle = '#7a3a2a'; g.beginPath(); g.moveTo(x - 4, y); g.lineTo(x + 13, y - 16); g.lineTo(x + 30, y); g.fill(); }
  for (let i = 0; i < 3; i++) { const x = W * 0.06 + i * 40, y = H * 0.36; g.fillStyle = '#4a3220'; g.fillRect(x - 3, y - 40, 6, 40); g.fillStyle = '#2e6a3a'; g.beginPath(); g.arc(x, y - 52, 20, 0, 6.283); g.fill(); }
}
const c = makeCanvas(), g = c.getContext('2d');
const spray = Array.from({length: 60}, () => ({a: (rand() - 0.5) * 2.4, v: 600 + rand() * 500, d: rand() * 0.3}));
window.renderFrame = function (t) { const k = clamp(t / DURATION);
  g.globalAlpha = 1; crossSection(g, '#060a14', '#2a1420', '#1a2a3a');
  if (k < 0.28) { const b = ease.in(clamp((k - 0.2) / 0.08)); g.fillStyle = '#1a2a3a'; g.beginPath(); g.ellipse(W / 2, H * 0.36, 300 * b + 1, 90 * b + 1, 0, Math.PI, 0); g.fill(); }
  if (k >= 0.28) { const tt = (k - 0.28) * DURATION; for (const s of spray) { const u = tt - s.d; if (u <= 0) continue; const x = W / 2 + Math.sin(s.a) * s.v * u * 0.4, y = H * 0.36 - s.v * u * 0.6 + 900 * u * u; if (y < H * 0.37) { g.fillStyle = 'rgba(220,235,245,0.8)'; g.fillRect(x, y, 5, 5); } } }
  if (k >= 0.3) { const u = clamp((k - 0.3) / 0.65); g.fillStyle = 'rgba(225,228,232,0.85)'; const rise = ease.out(clamp(u * 2)); for (let i = 0; i < 9; i++) { g.beginPath(); g.ellipse(W / 2 - i * 20 + Math.sin(t + i) * 10, H * 0.36 - rise * (80 + i * 14), 220 + i * 25, 70, 0, 0, 6.283); g.fill(); }
    const flow = ease.inOut(clamp((u - 0.4) / 0.6)); for (let i = 0; i < 10; i++) { const p = clamp(flow * 1.3 - i * 0.07); if (p <= 0) continue; g.beginPath(); g.ellipse(W * 0.28 - p * W * 0.45, H * 0.33 - i * 6, 160 + p * 140, 50 + i * 4, 0, 0, 6.283); g.fill(); } }
  if (k > 0.2 && k < 0.24) { g.fillStyle = 'rgba(255,255,255,0.15)'; g.fillRect(0, 0, W, H); }
  const dark = clamp((k - 0.45) / 0.3); for (let i = 0; i < 4; i++) { g.fillStyle = `rgba(255,214,120,${0.8 * (1 - dark)})`; g.fillRect(W * 0.84 + i * 38 + 8, H * 0.36 - 18, 8, 10); } };
