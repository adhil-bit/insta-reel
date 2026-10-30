const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION);
  g.fillStyle = '#120a08'; g.fillRect(0, 0, W, H); const gl = g.createRadialGradient(W / 2, H * 0.45, 10, W / 2, H * 0.45, 600); gl.addColorStop(0, 'rgba(255,190,100,0.35)'); gl.addColorStop(1, 'rgba(255,190,100,0)'); g.fillStyle = gl; g.fillRect(0, 0, W, H);
  SK.lamp(g, W * 0.5, H * 0.55, 1.6, t);
  g.fillStyle = '#2f6a2a'; g.beginPath(); g.ellipse(W * 0.5, H * 0.66, 260, 50, 0, 0, 6.283); g.fill(); g.fillStyle = '#efe4c8'; for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(W * (0.44 + i * 0.06), H * 0.655, 18, 0, 6.283); g.fill(); }
  for (let i = 0; i < 4; i++) { const a = ease.out(clamp((k - 0.2 - i * 0.1) / 0.2)); g.save(); g.globalAlpha = a; SK.person(g, W * (0.14 + i * 0.24) + (i > 1 ? 60 : -60), H * 0.78, 220, 'stand', '#0a0606', t + i); g.restore(); }
  SK.grain(g, t, 0.07); };
