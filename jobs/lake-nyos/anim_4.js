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
window.renderFrame = function (t) { const k = clamp(t / DURATION), lvl = lerp(H * 0.62, H * 0.44, ease.inOut(clamp((k - 0.1) / 0.5)));
  g.globalAlpha = 1; g.fillStyle = '#0d1016'; g.fillRect(0, 0, W, H);
  const ground = x => H * 0.3 + (H * 0.3) * Math.pow(Math.sin(Math.PI * (x - W * 0.05) / (W * 0.9)), 1.2);
  g.strokeStyle = '#3a3a44'; g.lineWidth = 6; g.beginPath(); for (let x = 0; x <= W; x += 8) { const gy = ground(x); x ? g.lineTo(x, gy) : g.moveTo(x, gy); } g.stroke();
  g.fillStyle = '#2a2d36'; g.beginPath(); g.moveTo(0, H); for (let x = 0; x <= W; x += 8) g.lineTo(x, ground(x)); g.lineTo(W, H); g.fill();
  g.save(); g.beginPath(); g.moveTo(0, 0); g.lineTo(W, 0); for (let x = W; x >= 0; x -= 8) g.lineTo(x, ground(x)); g.closePath(); g.clip();
  g.fillStyle = 'rgba(160,165,175,0.45)'; g.beginPath(); g.moveTo(0, H); g.lineTo(0, lvl); for (let x = 0; x <= W; x += 8) g.lineTo(x, lvl + Math.sin(x / 60 + t * 2) * 6); g.lineTo(W, H); g.fill(); g.restore();
  g.strokeStyle = '#d8d0c0'; g.lineWidth = 2; for (let i = 0; i < 6; i++) { const x = W * (0.25 + i * 0.1), y = ground(x) - 2; g.strokeRect(x - 10, y - 18, 20, 18); g.beginPath(); g.moveTo(x - 13, y - 18); g.lineTo(x, y - 30); g.lineTo(x + 13, y - 18); g.stroke(); }
  if (k > 0.6) { g.strokeStyle = rgba(ACCENT, 0.9); g.lineWidth = 2; g.beginPath(); g.moveTo(W * 0.2, H * 0.68); g.lineTo(W * 0.8, H * 0.68); g.stroke(); } };
