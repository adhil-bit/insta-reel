function eye(g, x, y, r, open, t) { g.save(); g.translate(x, y); const h = r * 0.62 * open;
  g.beginPath(); g.moveTo(-r, 0); g.quadraticCurveTo(0, -h * 1.6, r, 0); g.quadraticCurveTo(0, h * 1.6, -r, 0); g.closePath(); g.fillStyle = '#f2ece0'; g.fill(); g.save(); g.clip();
  const lx = Math.sin(t * 0.7) * r * 0.18; const ir = g.createRadialGradient(lx, 0, r * 0.05, lx, 0, r * 0.42); ir.addColorStop(0, '#0a0a0a'); ir.addColorStop(0.35, '#1a1a1a'); ir.addColorStop(0.4, '#c0392b'); ir.addColorStop(1, '#4a0a0a');
  g.fillStyle = ir; g.beginPath(); g.arc(lx, 0, r * 0.42, 0, 6.283); g.fill(); g.fillStyle = 'rgba(255,255,255,0.8)'; g.beginPath(); g.arc(lx - r * 0.12, -r * 0.12, r * 0.06, 0, 6.283); g.fill(); g.restore();
  g.strokeStyle = '#0a0a0a'; g.lineWidth = r * 0.05; g.beginPath(); g.moveTo(-r, 0); g.quadraticCurveTo(0, -h * 1.6, r, 0); g.quadraticCurveTo(0, h * 1.6, -r, 0); g.stroke(); g.restore(); }
function screens(g, t, alpha) { for (let r = 0; r < 5; r++) for (let c = 0; c < 4; c++) { const x = 40 + c * 255, y = H * 0.16 + r * 200, f = 0.5 + 0.5 * Math.sin(t * 3 + r * 2 + c); g.fillStyle = `rgba(40,60,90,${alpha * (0.35 + 0.25 * f)})`; g.fillRect(x, y, 230, 170); g.strokeStyle = `rgba(120,160,220,${alpha * 0.4})`; g.lineWidth = 3; g.strokeRect(x, y, 230, 170); } }
function rec(g, x, y, t) { if (Math.sin(t * 6) > 0) { g.fillStyle = '#ff2a2a'; g.beginPath(); g.arc(x, y, 12, 0, 6.283); g.fill(); } g.fillStyle = '#fff'; g.font = '800 26px Inter'; g.textAlign = 'left'; g.fillText('REC', x + 22, y + 9); }
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), open = ease.out(clamp(t / 0.8));
  g.fillStyle = '#05060a'; g.fillRect(0, 0, W, H); screens(g, t, 1); const gl = g.createRadialGradient(W / 2, H * 0.42, 40, W / 2, H * 0.42, 600); gl.addColorStop(0, 'rgba(192,57,43,0.35)'); gl.addColorStop(1, 'rgba(192,57,43,0)'); g.fillStyle = gl; g.fillRect(0, 0, W, H);
  eye(g, W / 2, H * 0.42, 380 * (1 + 0.05 * k), open, t); SK.grain(g, t, 0.05); };
