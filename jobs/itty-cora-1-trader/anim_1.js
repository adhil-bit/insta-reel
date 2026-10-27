const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), open = ease.inOut(clamp((k - 0.25) / 0.4));
  g.fillStyle = '#140c08'; g.fillRect(0, 0, W, H); SK.lamp(g, W * 0.8, H * 0.58, 1.1, t);
  g.fillStyle = '#3a2416'; g.fillRect(0, H * 0.58, W, H * 0.1);
  const cx = W * 0.45, cy = H * 0.5, pw = 300; g.fillStyle = '#5a2a1a'; g.fillRect(cx - pw, cy - 10, pw * 2, 24);
  g.save(); g.translate(cx, cy); g.fillStyle = '#efe4c8'; g.fillRect(0, -380, pw, 380 - 10); g.restore();
  g.save(); g.translate(cx, cy); g.scale(lerp(1, -1, open), 1); g.fillStyle = open < 0.5 ? '#6a2a1a' : '#efe4c8'; g.fillRect(0, -380, pw, 370); g.restore();
  if (open > 0.6) { g.fillStyle = '#6a5a4a'; for (const side of [-1, 1]) for (let i = 0; i < 10; i++) g.fillRect(cx + side * 40 + (side < 0 ? -240 : 0), cy - 330 + i * 30, 200 - (i * 37) % 60, 8);
    const gl = g.createRadialGradient(cx, cy - 200, 20, cx, cy - 200, 500); gl.addColorStop(0, `rgba(255,210,130,${0.4 * (open - 0.6) * 2.5})`); gl.addColorStop(1, 'rgba(255,210,130,0)'); g.fillStyle = gl; g.fillRect(0, 0, W, H); }
  SK.grain(g, t, 0.07); };
