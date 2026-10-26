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
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, H * 0.42); s.addColorStop(0, '#1a2a4a'); s.addColorStop(1, '#c86a4a'); x.fillStyle = s; x.fillRect(0, 0, W, H);
  x.fillStyle = '#2e5a3a'; x.beginPath(); x.ellipse(W * 0.2, H * 0.5, 520, 220, 0, 0, 6.283); x.ellipse(W * 0.85, H * 0.48, 480, 200, 0, 0, 6.283); x.fill();
  x.fillStyle = '#1e3a2a'; x.beginPath(); x.ellipse(W * 0.05, H * 0.66, 520, 220, 0, 0, 6.283); x.ellipse(W * 0.95, H * 0.66, 520, 220, 0, 0, 6.283); x.fill(); x.fillRect(0, H * 0.66, W, H);
  for (let i = 0; i < 5; i++) { const hx = W * 0.1 + i * 30, hy = H * 0.5 - 20; x.fillStyle = '#d8d0c0'; x.fillRect(hx, hy, 14, 14); x.fillStyle = '#5a2a20'; x.fillRect(hx - 2, hy - 6, 18, 6); } });
window.renderFrame = function (t) { const k = clamp(t / DURATION);
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  const lg = g.createLinearGradient(0, H * 0.45, 0, H * 0.6); lg.addColorStop(0, '#1f3a4a'); lg.addColorStop(1, '#0b1a26'); g.fillStyle = lg; g.beginPath(); g.ellipse(W / 2, H * 0.52, 410, 130, 0, 0, 6.283); g.fill();
  g.strokeStyle = 'rgba(255,255,255,0.16)'; g.lineWidth = 2; for (let i = 0; i < 8; i++) { const y = H * 0.46 + i * 24, w = 300 - Math.abs(i - 3.5) * 40; g.beginPath(); g.moveTo(W / 2 - w + Math.sin(t + i) * 10, y); g.lineTo(W / 2 + w + Math.sin(t + i) * 10, y); g.stroke(); }
  const m = clamp((k - 0.4) / 0.5) * 0.35; for (let i = 0; i < 6; i++) { g.fillStyle = `rgba(255,255,255,${m})`; g.beginPath(); g.ellipse(W / 2 + Math.sin(t * 0.3 + i) * 120 + (i - 2.5) * 110, H * 0.5 + (i % 2) * 18, 150, 22, 0, 0, 6.283); g.fill(); } };
