const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION);
  SK.sky(g, 'day', 0.62); g.fillStyle = '#6a5a3a'; g.fillRect(0, H * 0.62, W, H);
  g.fillStyle = '#4a3020'; g.fillRect(W * 0.5, H * 0.34, W * 0.42, H * 0.28); g.fillStyle = '#2a6a3a'; g.beginPath(); g.moveTo(W * 0.48, H * 0.36); g.lineTo(W * 0.94, H * 0.36); g.lineTo(W * 0.9, H * 0.31); g.lineTo(W * 0.52, H * 0.31); g.fill();
  for (let r = 0; r < 3; r++) for (let i = 0; i < 6; i++) { g.fillStyle = ['#c0392b', '#2a6aa5', '#d4a020'][(r + i) % 3]; g.fillRect(W * 0.53 + i * 64, H * 0.39 + r * 66, 50, 56); }
  SK.person(g, W * 0.2, H * 0.74, 300, 'stand', '#14100e', t); SK.person(g, W * 0.32, H * 0.74, 220, 'stand', '#14100e', t + 1);
  for (let i = 0; i < 6; i++) { const u = (t * 0.6 + i / 6) % 1; g.fillStyle = `rgba(250,204,21,${1 - u})`; g.beginPath(); g.arc(W * 0.42 + u * 80, H * 0.5 - Math.sin(u * Math.PI) * 120, 12, 0, 6.283); g.fill(); }
  SK.grain(g, t, 0.05); };
