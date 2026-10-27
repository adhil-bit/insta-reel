function nightBase(g, t) { SK.sky(g, 'night', 0.64); SK.sun(g, W * 0.76, H * 0.17, 55, '#f4f0e0', 0.35); g.fillStyle = '#0a0c14'; g.fillRect(0, H * 0.64, W, H);
  g.fillStyle = '#1c2030'; g.beginPath(); g.moveTo(W * 0.42, H); g.quadraticCurveTo(W * 0.5, H * 0.75, W * 0.56, H * 0.64); g.lineTo(W * 0.6, H * 0.64); g.quadraticCurveTo(W * 0.6, H * 0.8, W * 0.66, H); g.fill(); }
function palaTree(g, x, t, flowers = 1) { g.fillStyle = '#0a0806'; g.beginPath(); g.moveTo(x - 50, H * 0.66); g.lineTo(x - 26, H * 0.38); g.lineTo(x + 26, H * 0.38); g.lineTo(x + 50, H * 0.66); g.fill();
  const can = [[0, -0.36, 260], [-150, -0.33, 180], [150, -0.33, 180], [-80, -0.27, 160], [90, -0.27, 160], [0, -0.25, 170]];
  for (const [dx, dy, r] of can) { g.beginPath(); g.ellipse(x + dx, H * (0.66 + dy), r, r * 0.6, 0, 0, 6.283); g.fill(); }
  for (let i = 0; i < 40; i++) { const fx = x + Math.sin(i * 7.3) * 230, fy = H * 0.31 + Math.cos(i * 3.1) * 90, tw = 0.5 + 0.5 * Math.sin(t * 2 + i); g.fillStyle = `rgba(245,240,225,${(0.4 + 0.6 * tw) * flowers})`; g.beginPath(); g.arc(fx, fy, 5, 0, 6.283); g.fill(); } }
function ghost(g, x, y, h, a, t) { g.save(); g.globalAlpha = a; g.translate(x, y); const s = h / 400; g.scale(s, s);
  const gr = g.createLinearGradient(0, -400, 0, 0); gr.addColorStop(0, 'rgba(255,255,255,0.95)'); gr.addColorStop(1, 'rgba(220,225,240,0.25)'); g.fillStyle = gr;
  g.beginPath(); g.moveTo(-30, -330); g.quadraticCurveTo(-90, -150, -70 + Math.sin(t * 2) * 10, 0); g.lineTo(70 + Math.sin(t * 2 + 1) * 10, 0); g.quadraticCurveTo(90, -150, 30, -330); g.fill();
  g.fillStyle = '#f4f0ea'; g.beginPath(); g.arc(0, -350, 30, 0, 6.283); g.fill(); g.fillStyle = '#0a0a0e';
  g.beginPath(); g.moveTo(-34, -370); for (let i = 0; i <= 10; i++) g.lineTo(-40 + i * 8 + Math.sin(t * 2 + i) * 6, -360 + 180 + Math.sin(i + t) * 10); g.lineTo(34, -370); g.fill(); g.restore();
  const gl = g.createRadialGradient(x, y - h * 0.5, 10, x, y - h * 0.5, h); gl.addColorStop(0, `rgba(200,210,255,${0.18 * a})`); gl.addColorStop(1, 'rgba(200,210,255,0)'); g.fillStyle = gl; g.fillRect(x - h, y - h * 1.5, h * 2, h * 2); }
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), nail = clamp((k - 0.4) / 0.1), burst = clamp((k - 0.7) / 0.15);
  SK.stage(g, t); SK.puppet(g, W * 0.35, H * 0.6, 400, t, true); g.save(); g.globalAlpha = 1 - 0.7 * burst; SK.puppet(g, W * 0.66, H * 0.6, 380, t, false); g.restore();
  if (nail > 0) { const nx = W * 0.35 + 80 * 400 / 380, ny = H * 0.6 - 390; g.fillStyle = `rgba(255,255,255,${nail})`; g.fillRect(nx - 4, ny - 60, 8, 60); g.fillStyle = `rgba(255,250,220,${nail})`; g.beginPath(); g.arc(nx, ny - 64, 10, 0, 6.283); g.fill();
    if (burst > 0) { g.save(); g.globalAlpha = burst; SK.rays(g, nx, ny - 64, 6.283, 500, 0.35); g.restore(); } }
  SK.grain(g, t, 0.06); };
