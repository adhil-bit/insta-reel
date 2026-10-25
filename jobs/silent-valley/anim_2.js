const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
function tree(x2, x, base, h, col) { x2.fillStyle = col; x2.fillRect(x - 6, base - h * 0.4, 12, h * 0.4); for (let i = 0; i < 3; i++) { x2.beginPath(); x2.arc(x + (i - 1) * h * 0.12, base - h * (0.55 + i * 0.12), h * (0.22 - i * 0.04), 0, 6.283); x2.fill(); } }
function forest(x2, base, n, hmin, hmax, col, seed) { let s = seed; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280; for (let i = 0; i < n; i++) tree(x2, r() * W, base + r() * 30, hmin + r() * (hmax - hmin), col); }
const sky = (a, b) => layer(x => { const g = x.createLinearGradient(0, 0, 0, H * 0.6); g.addColorStop(0, a); g.addColorStop(1, b); x.fillStyle = g; x.fillRect(0, 0, W, H); });
function fadeBottom(g) { const f = g.createLinearGradient(0, H * 0.55, 0, H * 0.8); f.addColorStop(0, 'rgba(4,6,10,0)'); f.addColorStop(1, 'rgba(4,6,10,1)'); g.fillStyle = f; g.fillRect(0, H * 0.55, W, H); }
const c = makeCanvas(), g = c.getContext('2d');
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, H * 0.6); s.addColorStop(0, '#1a2430'); s.addColorStop(1, '#3a4a46'); x.fillStyle = s; x.fillRect(0, 0, W, H);
  x.fillStyle = '#1e3a2a'; x.beginPath(); x.moveTo(0, H * 0.2); x.lineTo(W * 0.35, H * 0.52); x.lineTo(W * 0.65, H * 0.52); x.lineTo(W, H * 0.2); x.lineTo(W, H); x.lineTo(0, H); x.fill(); forest(x, H * 0.52, 30, 100, 180, '#0e2a1a', 4); });
window.renderFrame = function (t) { const k = clamp(t / (DURATION * 0.88)), dam = ease.out(clamp(k * 2)), lvl = ease.inOut(clamp((k - 0.35) * 1.6));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  const wy = lerp(H * 0.56, H * 0.3, lvl); const wg = g.createLinearGradient(0, wy, 0, H * 0.6); wg.addColorStop(0, 'rgba(50,100,140,0.92)'); wg.addColorStop(1, 'rgba(20,40,60,0.95)'); g.fillStyle = wg; g.fillRect(0, wy, W * 0.62, H * 0.6 - wy);
  g.fillStyle = '#7a7a80'; g.fillRect(W * 0.6, lerp(H * 0.56, H * 0.24, dam), 70, H * 0.56 - lerp(H * 0.56, H * 0.24, dam));
  g.strokeStyle = rgba('#FF4D5E', 0.6 + 0.4 * Math.sin(t * 6)); g.lineWidth = 6; g.strokeRect(W * 0.6 - 10, H * 0.24 - 10, 90, H * 0.32 + 20); fadeBottom(g); };
