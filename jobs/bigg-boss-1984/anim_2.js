function eye(g, x, y, r, open, t) { g.save(); g.translate(x, y); const h = r * 0.62 * open;
  g.beginPath(); g.moveTo(-r, 0); g.quadraticCurveTo(0, -h * 1.6, r, 0); g.quadraticCurveTo(0, h * 1.6, -r, 0); g.closePath(); g.fillStyle = '#f2ece0'; g.fill(); g.save(); g.clip();
  const lx = Math.sin(t * 0.7) * r * 0.18; const ir = g.createRadialGradient(lx, 0, r * 0.05, lx, 0, r * 0.42); ir.addColorStop(0, '#0a0a0a'); ir.addColorStop(0.35, '#1a1a1a'); ir.addColorStop(0.4, '#c0392b'); ir.addColorStop(1, '#4a0a0a');
  g.fillStyle = ir; g.beginPath(); g.arc(lx, 0, r * 0.42, 0, 6.283); g.fill(); g.fillStyle = 'rgba(255,255,255,0.8)'; g.beginPath(); g.arc(lx - r * 0.12, -r * 0.12, r * 0.06, 0, 6.283); g.fill(); g.restore();
  g.strokeStyle = '#0a0a0a'; g.lineWidth = r * 0.05; g.beginPath(); g.moveTo(-r, 0); g.quadraticCurveTo(0, -h * 1.6, r, 0); g.quadraticCurveTo(0, h * 1.6, -r, 0); g.stroke(); g.restore(); }
function screens(g, t, alpha) { for (let r = 0; r < 5; r++) for (let c = 0; c < 4; c++) { const x = 40 + c * 255, y = H * 0.16 + r * 200, f = 0.5 + 0.5 * Math.sin(t * 3 + r * 2 + c); g.fillStyle = `rgba(40,60,90,${alpha * (0.35 + 0.25 * f)})`; g.fillRect(x, y, 230, 170); g.strokeStyle = `rgba(120,160,220,${alpha * 0.4})`; g.lineWidth = 3; g.strokeRect(x, y, 230, 170); } }
function rec(g, x, y, t) { if (Math.sin(t * 6) > 0) { g.fillStyle = '#ff2a2a'; g.beginPath(); g.arc(x, y, 12, 0, 6.283); g.fill(); } g.fillStyle = '#fff'; g.font = '800 26px Inter'; g.textAlign = 'left'; g.fillText('REC', x + 22, y + 9); }
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION);
  g.fillStyle = '#0e1016'; g.fillRect(0, 0, W, H); const x0 = W * 0.08, y0 = H * 0.24, w = W * 0.84, h = H * 0.48;
  g.fillStyle = '#2a2430'; g.beginPath(); g.moveTo(x0 - 30, y0); g.lineTo(W / 2, y0 - 160); g.lineTo(x0 + w + 30, y0); g.fill();
  const rooms = [[0, 0, 0.5, 0.5, '#3a3448'], [0.5, 0, 0.5, 0.5, '#34404a'], [0, 0.5, 0.35, 0.5, '#403a34'], [0.35, 0.5, 0.65, 0.5, '#363a44']];
  rooms.forEach(([rx, ry, rw, rh, col], i) => { g.fillStyle = col; g.fillRect(x0 + rx * w + 6, y0 + ry * h + 6, rw * w - 12, rh * h - 12); rec(g, x0 + rx * w + 24, y0 + ry * h + 34, t + i * 0.4);
    for (let p = 0; p < 2; p++) SK.person(g, x0 + (rx + rw * (0.35 + p * 0.3)) * w, y0 + (ry + rh) * h - 14, 110, p ? 'arm_up' : 'stand', '#0a0a0e', t + i + p); });
  g.fillStyle = '#ff2a2a'; for (const [cx, cy] of [[x0, y0], [x0 + w, y0], [x0, y0 + h / 2], [x0 + w, y0 + h / 2]]) { g.beginPath(); g.arc(cx, cy, 10, 0, 6.283); g.fill(); }
  SK.grain(g, t, 0.05); };
