const c = makeCanvas(), g = c.getContext('2d'); const bugs = Array.from({length: 26}, () => [rand(), rand(), rand() * 6.283]);
function microbe(x, y, r, a) { g.fillStyle = `rgba(120,200,90,${a})`; g.beginPath(); g.ellipse(x, y, r, r * 0.6, 0, 0, 6.283); g.fill(); g.strokeStyle = `rgba(120,200,90,${a})`; g.lineWidth = 3; for (let i = 0; i < 6; i++) { const q = i / 6 * 6.283; g.beginPath(); g.moveTo(x + Math.cos(q) * r, y + Math.sin(q) * r * 0.6); g.lineTo(x + Math.cos(q) * r * 1.5, y + Math.sin(q) * r * 0.9); g.stroke(); } }
window.renderFrame = function (t) { const k = clamp(t / DURATION), wash = ease.inOut(clamp((k - 0.45) / 0.45));
  SK.sky(g, 'dusk', 0.5); for (let i = 0; i < 4; i++) SK.house(g, W * (0.12 + i * 0.25), H * 0.5, 0.45, '#140c12', 0.3, t);
  g.fillStyle = '#1a1416'; g.fillRect(0, H * 0.5, W, H); const wg = g.createLinearGradient(0, H * 0.58, 0, H * 0.78); wg.addColorStop(0, '#3a6a8a'); wg.addColorStop(1, '#14283a'); g.fillStyle = wg; g.fillRect(W * 0.15, H * 0.58, W * 0.7, H * 0.2);
  for (let i = 0; i < 3; i++) SK.person(g, W * (0.32 + i * 0.18), H * 0.66, 180, 'stand', '#08060a', t + i);
  for (const [x, y, a] of bugs) microbe(W * x + Math.sin(t + a) * 20, H * (0.15 + y * 0.4) + wash * 500, 14, (1 - wash) * 0.85);
  SK.grain(g, t, 0.07); };
