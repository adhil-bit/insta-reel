const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
const bgL = (a, b) => layer(x => { const g = x.createRadialGradient(W * 0.7, H * 0.2, 40, W / 2, H * 0.4, H * 0.9); g.addColorStop(0, a); g.addColorStop(1, b); x.fillStyle = g; x.fillRect(0, 0, W, H); });
// curved sabre path from (x0,y0) to (x1,y1); width w
function bladePath(g, x0, y0, x1, y1, w) { const mx = (x0 + x1) / 2, my = (y0 + y1) / 2 - 90; g.beginPath(); g.moveTo(x0, y0 - w / 2); g.quadraticCurveTo(mx, my - w / 2, x1, y1); g.quadraticCurveTo(mx, my + w / 2, x0, y0 + w / 2); g.closePath(); }
function watered(g, phase, light, dark, amp = 6, wl = 90, rows = 25, y0 = 0, y1 = H) { const step = (y1 - y0) / rows;
  for (let i = 0; i < rows; i++) { g.fillStyle = i % 2 ? dark : light; g.beginPath(); const yb = y0 + i * step;
    g.moveTo(-10, yb); for (let x = -10; x <= W + 10; x += 12) g.lineTo(x, yb + Math.sin(x / wl * 6.283 + phase + i * 0.6) * amp); g.lineTo(W + 10, yb + step + 20); g.lineTo(-10, yb + step + 20); g.fill(); } }
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION);
  g.globalAlpha = 1; g.fillStyle = '#0a0b0e'; g.fillRect(0, 0, W, H);
  g.save(); g.beginPath(); g.rect(0, H * 0.25, W, H * 0.45); g.clip(); watered(g, t * 0.4, '#e6e9ef', '#5c6472', 7, 110, 40, H * 0.25, H * 0.7);
  const mg = g.createLinearGradient(0, H * 0.25, 0, H * 0.7); mg.addColorStop(0, 'rgba(255,255,255,0.18)'); mg.addColorStop(0.5, 'rgba(0,0,0,0.05)'); mg.addColorStop(1, 'rgba(0,0,0,0.3)'); g.fillStyle = mg; g.fillRect(0, 0, W, H);
  const d = clamp((k - 0.4) / 0.12); if (d > 0 && d < 1) { const y = lerp(H * 0.2, H * 0.47, ease.in(d)); g.fillStyle = 'rgba(220,235,255,0.9)'; g.beginPath(); g.ellipse(W / 2, y, 14, 22, 0, 0, 6.283); g.fill(); }
  if (k >= 0.52) { for (let i = 0; i < 3; i++) { const r = clamp((k - 0.52 - i * 0.08) / 0.4); if (r <= 0) continue; g.strokeStyle = `rgba(255,255,255,${0.7 * (1 - r)})`; g.lineWidth = 3; g.beginPath(); g.ellipse(W / 2, H * 0.47, 40 + r * 420, 14 + r * 120, 0, 0, 6.283); g.stroke(); } }
  g.restore(); g.strokeStyle = ACCENT; g.lineWidth = 3; g.beginPath(); g.moveTo(0, H * 0.25); g.lineTo(W, H * 0.25); g.moveTo(0, H * 0.7); g.lineTo(W, H * 0.7); g.stroke(); };
