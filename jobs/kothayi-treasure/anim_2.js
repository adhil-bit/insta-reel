function chest(g, x, y, s, glow, t) { g.save(); g.translate(x, y); g.scale(s, s);
  if (glow > 0) { const gl = g.createRadialGradient(0, -20, 10, 0, -20, 260); gl.addColorStop(0, `rgba(255,200,80,${0.6 * glow * (0.85 + 0.15 * Math.sin(t * 4))})`); gl.addColorStop(1, 'rgba(255,200,80,0)'); g.fillStyle = gl; g.fillRect(-260, -280, 520, 520); }
  g.fillStyle = '#5a3416'; g.fillRect(-90, -50, 180, 90); g.fillStyle = '#7a4a22'; g.beginPath(); g.moveTo(-90, -50); g.quadraticCurveTo(0, -110, 90, -50); g.fill();
  g.fillStyle = '#d8a83a'; g.fillRect(-94, -54, 188, 10); g.fillRect(-10, -60, 20, 40); g.fillRect(-94, 30, 188, 10);
  for (let i = 0; i < 6; i++) { g.fillStyle = '#ffd34a'; g.beginPath(); g.ellipse(-60 + i * 24, -58 - (i % 2) * 8, 12, 6, 0, 0, 6.283); g.fill(); } g.restore(); }
function streetlight(g, x, base, t) { g.fillStyle = '#2a2a30'; g.fillRect(x - 6, base - 520, 12, 520); g.fillRect(x - 6, base - 520, 120, 10); const f = 0.85 + 0.15 * Math.sin(t * 13);
  const gl = g.createRadialGradient(x + 110, base - 500, 5, x + 110, base - 300, 420); gl.addColorStop(0, `rgba(255,214,140,${0.45 * f})`); gl.addColorStop(1, 'rgba(255,214,140,0)'); g.fillStyle = gl; g.beginPath(); g.moveTo(x + 110, base - 505); g.lineTo(x - 160, base); g.lineTo(x + 380, base); g.fill(); g.fillStyle = '#ffe2a0'; g.fillRect(x + 92, base - 512, 36, 10); }
function road(g, top, t) { g.fillStyle = '#16161c'; g.fillRect(0, top, W, H - top); g.fillStyle = '#2a2a32'; g.beginPath(); g.moveTo(W * 0.3, top); g.lineTo(W * 0.7, top); g.lineTo(W, H); g.lineTo(0, H); g.fill(); g.fillStyle = 'rgba(255,255,255,0.55)'; for (let i = 0; i < 6; i++) { const y = top + 40 + i * i * 22; g.fillRect(W / 2 - 4 - i * 3, y, 8 + i * 6, 16 + i * 6); } }
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), years = Math.floor(1 + ease.inOut(clamp(k / 0.5)) * 20), build = ease.out(clamp((k - 0.4) / 0.4));
  SK.sky(g, 'day', 1);
  g.fillStyle = '#7a8a9a'; for (let i = 0; i < 6; i++) { const bh = (180 + (i * 67) % 200) * build; g.fillRect(W * (0.02 + i * 0.17), H * 0.72 - bh, W * 0.13, bh); g.fillStyle = 'rgba(255,255,255,0.35)'; for (let r = 0; r < bh / 40; r++) g.fillRect(W * (0.04 + i * 0.17), H * 0.72 - 30 - r * 40, 20, 14); g.fillStyle = '#7a8a9a'; }
  road(g, H * 0.72, t); SK.person(g, W * 0.5, H * 0.86, 220, 'stand', '#0a0806', t);
  g.fillStyle = 'rgba(10,14,20,0.92)'; g.fillRect(0, 0, W, H * 0.44); g.strokeStyle = '#6a6e76'; g.lineWidth = 14; for (let i = 0; i < 7; i++) { g.beginPath(); g.moveTo(W * (0.14 + i * 0.12), H * 0.2); g.lineTo(W * (0.14 + i * 0.12), H * 0.42); g.stroke(); }
  g.fillStyle = '#efe4c8'; g.font = '800 72px Inter'; g.textAlign = 'center'; g.fillText(years + (years === 1 ? ' YEAR' : ' YEARS'), W / 2, H * 0.33);
  g.fillStyle = 'rgba(20,20,30,0.9)'; g.font = '800 120px Inter'; g.fillText('?', W * 0.5, H * 0.62 + 40 * (1 - build)); SK.grain(g, t, 0.05); };