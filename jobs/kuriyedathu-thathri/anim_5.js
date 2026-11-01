const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), q = ease.out(clamp((k - 0.6) / 0.2));
  g.fillStyle = '#100a08'; g.fillRect(0, 0, W, H);
  g.fillStyle = '#c9a25a'; g.beginPath(); g.roundRect(W * 0.16, H * 0.4, W * 0.68, 80, 40); g.fill(); g.fillStyle = '#5a3a1a'; g.font = '800 46px Inter'; g.textAlign = 'center'; g.fillText('65 · ? ? ? ? ?', W / 2, H * 0.4 + 56);
  g.font = '800 300px Inter'; g.fillStyle = `rgba(250,204,21,${0.6 + 0.3 * Math.sin(t * 2)})`; g.fillText('?', W / 2, H * 0.34);
  if (q > 0) { g.save(); g.globalAlpha = q; g.font = '800 44px Inter'; for (const [x, txt, col] of [[W * 0.28, 'VICTIM?', '#38BDF8'], [W * 0.72, 'FIGHTER?', '#F59E3B']]) { g.fillStyle = 'rgba(8,6,10,0.8)'; g.beginPath(); g.roundRect(x - 160, H * 0.6, 320, 84, 42); g.fill(); g.strokeStyle = col; g.lineWidth = 4; g.stroke(); g.fillStyle = col; g.fillText(txt, x, H * 0.6 + 58); } g.restore(); }
  SK.lamp(g, W * 0.86, H * 0.7, 0.7, t); SK.grain(g, t, 0.08); };
