function mudi(g, x, y, r, t, c1 = '#c0302a', c2 = '#f2b632', a = 1) {   // circular Theyyam headdress
  g.save(); g.globalAlpha = a; g.translate(x, y);
  for (let i = 0; i < 24; i++) { const an = i / 24 * 6.283 + Math.sin(t) * 0.02; g.strokeStyle = i % 2 ? c2 : c1; g.lineWidth = 10; g.beginPath(); g.moveTo(Math.cos(an) * r * 0.35, Math.sin(an) * r * 0.35); g.lineTo(Math.cos(an) * r, Math.sin(an) * r); g.stroke(); }
  for (const [rr, col] of [[1, c1], [0.82, c2], [0.62, c1], [0.42, '#2a120a']]) { g.strokeStyle = col; g.lineWidth = r * 0.08; g.beginPath(); g.arc(0, 0, r * rr, 0, 6.283); g.stroke(); }
  g.fillStyle = '#fff6d8'; for (let i = 0; i < 36; i++) { const an = i / 36 * 6.283; g.beginPath(); g.arc(Math.cos(an) * r * 1.04, Math.sin(an) * r * 1.04, r * 0.025, 0, 6.283); g.fill(); }
  const gl = g.createRadialGradient(0, 0, r * 0.3, 0, 0, r * 1.6); gl.addColorStop(0, 'rgba(255,170,80,0.25)'); gl.addColorStop(1, 'rgba(255,170,80,0)'); g.fillStyle = gl; g.fillRect(-r * 1.6, -r * 1.6, r * 3.2, r * 3.2);
  g.restore(); }
function torch(g, x, y, t, h = 220) { g.fillStyle = '#2a1608'; g.fillRect(x - 5, y - h, 10, h); const f = 1 + 0.2 * Math.sin(t * 11 + x); g.fillStyle = '#ffb43a'; g.beginPath(); g.ellipse(x, y - h - 18, 14, 30 * f, 0, 0, 6.283); g.fill();
  const gl = g.createRadialGradient(x, y - h - 18, 4, x, y - h - 18, 180); gl.addColorStop(0, 'rgba(255,160,60,0.45)'); gl.addColorStop(1, 'rgba(255,160,60,0)'); g.fillStyle = gl; g.fillRect(x - 180, y - h - 200, 360, 360); }
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), walk = ease.inOut(clamp(k / 0.9)), burn = 1 - clamp(k / 0.6);
  SK.sky(g, 'dawn', 0.62); SK.sun(g, W * 0.5, H * 0.6, 90, '#ffd8a0', 0.5); g.fillStyle = '#1a120c'; g.fillRect(0, H * 0.62, W, H);
  mudi(g, W * 0.26, H * 0.6, 110, t, '#7a2a20', '#9a7a3a', 0.85); for (let i = 0; i < 3; i++) { const x = W * (0.1 + i * 0.12); g.fillStyle = '#2a1608'; g.fillRect(x - 5, H * 0.62 - 200, 10, 200); if (burn > 0) { g.fillStyle = '#ffb43a'; g.beginPath(); g.ellipse(x, H * 0.62 - 218, 12 * burn, 26 * burn, 0, 0, 6.283); g.fill(); } }
  SK.person(g, lerp(W * 0.45, W * 0.82, walk), H * 0.65, 340, 'stand', '#120a06', t * 3); SK.birds(g, t, 4, 0.22); SK.grain(g, t, 0.06); };
