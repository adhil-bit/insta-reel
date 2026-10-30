const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), walk = ease.inOut(clamp(k / 0.6)), pour = clamp((k - 0.6) / 0.35);
  SK.sky(g, 'dusk', 0.6); SK.house(g, W * 0.2, H * 0.6, 0.6, '#140c10', 0.4, t); SK.house(g, W * 0.8, H * 0.6, 0.75, '#140c10', 0.9, t);
  g.fillStyle = '#1a1214'; g.fillRect(0, H * 0.6, W, H);
  const x = lerp(W * 0.28, W * 0.62, walk); SK.person(g, x, H * 0.7, 300, 'stand', '#08060a', t * 3);
  g.fillStyle = '#b07a3a'; g.beginPath(); g.ellipse(W * 0.68, H * 0.69, 34, 40, 0, 0, 6.283); g.fill(); g.fillRect(W * 0.68 - 14, H * 0.69 - 60, 28, 24);
  if (pour > 0) { g.strokeStyle = 'rgba(160,210,255,0.8)'; g.lineWidth = 8; g.beginPath(); g.moveTo(W * 0.66, H * 0.5); g.quadraticCurveTo(W * 0.64, H * 0.56, W * 0.63, H * 0.5 + 220 * pour); g.stroke();
    for (let i = 0; i < 8; i++) { const u = (t * 1.5 + i / 8) % 1; g.fillStyle = `rgba(160,210,255,${0.7 * (1 - u)})`; g.beginPath(); g.arc(W * 0.63 + Math.sin(i) * 30, H * 0.5 + 240 * u, 5, 0, 6.283); g.fill(); } }
  SK.grain(g, t, 0.07); };
