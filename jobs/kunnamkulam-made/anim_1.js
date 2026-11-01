const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), pan = ease.inOut(k);
  SK.sky(g, 'sunset', 0.62); g.fillStyle = '#1a1210'; g.fillRect(0, H * 0.62, W, H);
  g.save(); g.translate(-pan * 160, 0);
  const cols = ['#7a2a1a', '#2a5a3a', '#2a3a6a', '#6a5a1a', '#5a2a5a', '#2a5a5a'];
  for (let i = 0; i < 7; i++) { const x = i * 200; g.fillStyle = '#14100e'; g.fillRect(x, H * 0.36, 190, H * 0.26); g.fillStyle = cols[i % 6]; g.beginPath(); g.moveTo(x - 6, H * 0.42); g.lineTo(x + 196, H * 0.42); g.lineTo(x + 180, H * 0.46); g.lineTo(x + 10, H * 0.46); g.fill(); g.fillStyle = 'rgba(255,214,140,0.8)'; g.fillRect(x + 30, H * 0.48, 130, 90); g.fillStyle = '#efe4c8'; g.fillRect(x + 20, H * 0.37, 150, 40); }
  g.restore();
  for (let i = 0; i < 5; i++) SK.person(g, (W * (0.1 + i * 0.2) + t * 40 * (i % 2 ? 1 : -1)) % W, H * 0.72, 220, 'stand', '#06040a', t + i);
  SK.grain(g, t, 0.06); };
