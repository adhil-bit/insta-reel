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
const drops = Array.from({length: 40}, () => ({a: (rand() - 0.5) * 1.6, v: 500 + rand() * 500, p: rand()}));
function mix(a, b, t) { return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')})`; }
window.renderFrame = function (t) { const k = clamp(t / DURATION);
  g.globalAlpha = 1; crossSection(g, '#6aa7d8', mix([42, 20, 32], [12, 28, 38], k));
  g.fillStyle = '#9aa0aa'; g.fillRect(W / 2 - 7, H * 0.44, 14, H * 0.26); g.fillStyle = '#e8e0d0'; g.fillRect(W / 2 - 50, H * 0.43, 100, 18);
  if (k > 0.25) { const f = ease.out(clamp((k - 0.25) / 0.2)); g.fillStyle = 'rgba(240,248,255,0.9)'; g.fillRect(W / 2 - 12, H * 0.2 + (1 - f) * H * 0.24, 24, f * H * 0.24);
    for (const d of drops) { const u = (t * 0.9 + d.p) % 1; const x = W / 2 + Math.sin(d.a) * d.v * u * 0.3, y = H * 0.2 - d.v * u * 0.4 + 1400 * u * u; if (y < H * 0.44) { g.fillStyle = `rgba(240,248,255,${0.9 * (1 - u)})`; g.beginPath(); g.arc(x, y, 5, 0, 6.283); g.fill(); } } }
  g.fillStyle = 'rgba(255,255,255,0.15)'; g.fillRect(W * 0.86, H * 0.36, 16, H * 0.26); const f2 = lerp(0.9, 0.1, ease.inOut(k)); g.fillStyle = ACCENT; g.fillRect(W * 0.86, H * 0.62 - f2 * H * 0.26, 16, f2 * H * 0.26); };
