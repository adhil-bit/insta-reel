const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
// shared cross-section: sky, rock bowl holding the lake, houses on the right rim, trees on the left rim
function crossSection(g, sky, deepTint, waterTop = '#2a5a6a') {
  g.fillStyle = sky; g.fillRect(0, 0, W, H);
  g.fillStyle = '#3a2e26'; g.beginPath(); g.moveTo(0, H * 0.36); g.lineTo(W * 0.2, H * 0.36); g.quadraticCurveTo(W * 0.22, H * 0.62, W * 0.5, H * 0.64); g.quadraticCurveTo(W * 0.78, H * 0.62, W * 0.8, H * 0.36); g.lineTo(W, H * 0.36); g.lineTo(W, H); g.lineTo(0, H); g.fill();
  const wg = g.createLinearGradient(0, H * 0.36, 0, H * 0.63); wg.addColorStop(0, waterTop); wg.addColorStop(1, deepTint); g.fillStyle = wg; g.beginPath(); g.moveTo(W * 0.2, H * 0.36); g.quadraticCurveTo(W * 0.22, H * 0.62, W * 0.5, H * 0.64); g.quadraticCurveTo(W * 0.78, H * 0.62, W * 0.8, H * 0.36); g.closePath(); g.fill();
  for (let i = 0; i < 4; i++) { const x = W * 0.84 + i * 38, y = H * 0.36 - 26; g.fillStyle = '#d8d0c0'; g.fillRect(x, y, 26, 26); g.fillStyle = '#7a3a2a'; g.beginPath(); g.moveTo(x - 4, y); g.lineTo(x + 13, y - 16); g.lineTo(x + 30, y); g.fill(); }
  for (let i = 0; i < 3; i++) { const x = W * 0.06 + i * 40, y = H * 0.36; g.fillStyle = '#4a3220'; g.fillRect(x - 3, y - 40, 6, 40); g.fillStyle = '#2e6a3a'; g.beginPath(); g.arc(x, y - 52, 20, 0, 6.283); g.fill(); }
}
const c = makeCanvas(), g = c.getContext('2d'); const full = layer(x => crossSection(x, '#6aa7d8', '#0c1c26'));
window.renderFrame = function (t) { const k = clamp(t / DURATION), w = ease.inOut(clamp(k / 0.3));
  g.globalAlpha = 1; g.fillStyle = '#6aa7d8'; g.fillRect(0, 0, W, H); g.save(); g.beginPath(); g.rect(0, 0, W * w, H); g.clip(); g.drawImage(full, 0, 0); g.restore();
  if (k > 0.5) { g.strokeStyle = 'rgba(255,255,255,0.7)'; g.lineWidth = 3; g.setLineDash([12, 10]); g.beginPath(); g.moveTo(W / 2, H * 0.36); g.lineTo(W / 2, H * 0.63); g.stroke(); g.setLineDash([]); } };
