function eye(g, x, y, r, open, t) { g.save(); g.translate(x, y); const h = r * 0.62 * open;
  g.beginPath(); g.moveTo(-r, 0); g.quadraticCurveTo(0, -h * 1.6, r, 0); g.quadraticCurveTo(0, h * 1.6, -r, 0); g.closePath(); g.fillStyle = '#f2ece0'; g.fill(); g.save(); g.clip();
  const lx = Math.sin(t * 0.7) * r * 0.18; const ir = g.createRadialGradient(lx, 0, r * 0.05, lx, 0, r * 0.42); ir.addColorStop(0, '#0a0a0a'); ir.addColorStop(0.35, '#1a1a1a'); ir.addColorStop(0.4, '#c0392b'); ir.addColorStop(1, '#4a0a0a');
  g.fillStyle = ir; g.beginPath(); g.arc(lx, 0, r * 0.42, 0, 6.283); g.fill(); g.fillStyle = 'rgba(255,255,255,0.8)'; g.beginPath(); g.arc(lx - r * 0.12, -r * 0.12, r * 0.06, 0, 6.283); g.fill(); g.restore();
  g.strokeStyle = '#0a0a0a'; g.lineWidth = r * 0.05; g.beginPath(); g.moveTo(-r, 0); g.quadraticCurveTo(0, -h * 1.6, r, 0); g.quadraticCurveTo(0, h * 1.6, -r, 0); g.stroke(); g.restore(); }
function screens(g, t, alpha) { for (let r = 0; r < 5; r++) for (let c = 0; c < 4; c++) { const x = 40 + c * 255, y = H * 0.16 + r * 200, f = 0.5 + 0.5 * Math.sin(t * 3 + r * 2 + c); g.fillStyle = `rgba(40,60,90,${alpha * (0.35 + 0.25 * f)})`; g.fillRect(x, y, 230, 170); g.strokeStyle = `rgba(120,160,220,${alpha * 0.4})`; g.lineWidth = 3; g.strokeRect(x, y, 230, 170); } }
function rec(g, x, y, t) { if (Math.sin(t * 6) > 0) { g.fillStyle = '#ff2a2a'; g.beginPath(); g.arc(x, y, 12, 0, 6.283); g.fill(); } g.fillStyle = '#fff'; g.font = '800 26px Inter'; g.textAlign = 'left'; g.fillText('REC', x + 22, y + 9); }
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION);
  g.fillStyle = '#0c0c10'; g.fillRect(0, 0, W, H); g.fillStyle = '#16161c'; for (let i = 0; i < 8; i++) { const bh = 300 + (i * 97) % 300; g.fillRect(i * 140, H * 0.72 - bh, 120, bh); }
  g.fillStyle = '#2a2a32'; g.fillRect(W * 0.14, H * 0.22, W * 0.72, H * 0.4); g.fillStyle = '#0a0a0c'; g.fillRect(W * 0.17, H * 0.24, W * 0.66, H * 0.36); eye(g, W / 2, H * 0.42, 230, 1, t);
  g.fillStyle = '#c0392b'; g.fillRect(W * 0.1, H * 0.66, W * 0.8, 90); g.fillStyle = '#fff'; g.font = '800 40px Inter'; g.textAlign = 'center'; g.fillText('BIG BROTHER IS WATCHING YOU', W / 2, H * 0.66 + 58);
  SK.crowd(g, W * 0.05, W * 0.95, H * 0.86, 10, 160, t, '#050506'); SK.grain(g, t, 0.07); };
