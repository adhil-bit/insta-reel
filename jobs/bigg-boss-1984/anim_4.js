function eye(g, x, y, r, open, t) { g.save(); g.translate(x, y); const h = r * 0.62 * open;
  g.beginPath(); g.moveTo(-r, 0); g.quadraticCurveTo(0, -h * 1.6, r, 0); g.quadraticCurveTo(0, h * 1.6, -r, 0); g.closePath(); g.fillStyle = '#f2ece0'; g.fill(); g.save(); g.clip();
  const lx = Math.sin(t * 0.7) * r * 0.18; const ir = g.createRadialGradient(lx, 0, r * 0.05, lx, 0, r * 0.42); ir.addColorStop(0, '#0a0a0a'); ir.addColorStop(0.35, '#1a1a1a'); ir.addColorStop(0.4, '#c0392b'); ir.addColorStop(1, '#4a0a0a');
  g.fillStyle = ir; g.beginPath(); g.arc(lx, 0, r * 0.42, 0, 6.283); g.fill(); g.fillStyle = 'rgba(255,255,255,0.8)'; g.beginPath(); g.arc(lx - r * 0.12, -r * 0.12, r * 0.06, 0, 6.283); g.fill(); g.restore();
  g.strokeStyle = '#0a0a0a'; g.lineWidth = r * 0.05; g.beginPath(); g.moveTo(-r, 0); g.quadraticCurveTo(0, -h * 1.6, r, 0); g.quadraticCurveTo(0, h * 1.6, -r, 0); g.stroke(); g.restore(); }
function screens(g, t, alpha) { for (let r = 0; r < 5; r++) for (let c = 0; c < 4; c++) { const x = 40 + c * 255, y = H * 0.16 + r * 200, f = 0.5 + 0.5 * Math.sin(t * 3 + r * 2 + c); g.fillStyle = `rgba(40,60,90,${alpha * (0.35 + 0.25 * f)})`; g.fillRect(x, y, 230, 170); g.strokeStyle = `rgba(120,160,220,${alpha * 0.4})`; g.lineWidth = 3; g.strokeRect(x, y, 230, 170); } }
function rec(g, x, y, t) { if (Math.sin(t * 6) > 0) { g.fillStyle = '#ff2a2a'; g.beginPath(); g.arc(x, y, 12, 0, 6.283); g.fill(); } g.fillStyle = '#fff'; g.font = '800 26px Inter'; g.textAlign = 'left'; g.fillText('REC', x + 22, y + 9); }
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), close = ease.inOut(clamp((k - 0.8) / 0.18));
  g.fillStyle = '#0c0a10'; g.fillRect(0, 0, W, H); g.fillStyle = '#1a1622'; g.fillRect(0, H * 0.66, W, H);
  g.fillStyle = '#22202a'; g.fillRect(W * 0.18, H * 0.2, W * 0.64, H * 0.36); g.fillStyle = '#0a0a0e'; g.fillRect(W * 0.21, H * 0.22, W * 0.58, H * 0.32); eye(g, W / 2, H * 0.38, 200, 1 - close, t);
  const gl = g.createRadialGradient(W / 2, H * 0.4, 50, W / 2, H * 0.6, 700); gl.addColorStop(0, 'rgba(120,160,255,0.25)'); gl.addColorStop(1, 'rgba(120,160,255,0)'); g.fillStyle = gl; g.fillRect(0, 0, W, H);
  g.fillStyle = '#050407'; g.beginPath(); g.roundRect(W * 0.12, H * 0.68, W * 0.76, 120, 40); g.fill(); for (let i = 0; i < 4; i++) SK.person(g, W * (0.24 + i * 0.17), H * 0.74, 200, i === 2 ? 'arm_up' : 'stand', '#050407', t + i);
  const a = ease.out(clamp((k - 0.4) / 0.15)), b = ease.out(clamp((k - 0.55) / 0.15)); g.font = '800 40px Inter'; g.textAlign = 'center';
  for (const [x, y, txt, col, al] of [[W * 0.3, H * 0.1, 'ENTERTAINMENT?', '#34D399', a], [W * 0.7, H * 0.17, 'TRP MARKETING?', '#FF4D5E', b]]) { if (al <= 0) continue; g.save(); g.globalAlpha = al * (1 - close); const w = g.measureText(txt).width + 56; g.fillStyle = 'rgba(8,6,10,0.85)'; g.beginPath(); g.roundRect(x - w / 2, y - 40, w, 76, 38); g.fill(); g.strokeStyle = col; g.lineWidth = 4; g.stroke(); g.fillStyle = col; g.fillText(txt, x, y + 12); g.restore(); }
  for (let i = 0; i < 6; i++) { const u = (t * 0.5 + i / 6) % 1; g.fillStyle = `rgba(250,204,21,${0.6 * (1 - u) * b})`; g.font = '800 46px Inter'; g.fillText(['₹', '📈', 'TRP', '₹', '📺', '%'][i], W * (0.25 + i * 0.1), H * 0.62 - u * 200); }
  SK.grain(g, t, 0.06); };
