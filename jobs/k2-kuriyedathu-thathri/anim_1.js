const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION);
  SK.sky(g, 'night', 0.62); SK.sun(g, W * 0.78, H * 0.15, 46, '#f4f0e0', 0.3); SK.palm(g, W * 0.07, H * 0.64, 480, 40, SK.ink, t); SK.palm(g, W * 0.93, H * 0.64, 440, -40, SK.ink, t);
  SK.house(g, W * 0.5, H * 0.62, 1.15, '#0c0a0e', 0.5, t); g.fillStyle = '#0c0a0e'; g.fillRect(0, H * 0.62, W, H); SK.lamp(g, W * 0.36, H * 0.66, 0.6, t);
  g.fillStyle = 'rgba(112,66,20,0.25)'; g.fillRect(0, 0, W, H); SK.grain(g, t, 0.09); };
