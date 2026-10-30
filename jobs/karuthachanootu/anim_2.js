const c = makeCanvas(), g = c.getContext('2d');
function book(x, y, w, h, col, title, a) { g.save(); g.globalAlpha = a; g.fillStyle = col; g.fillRect(x, y, w, h); g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(x, y, 22, h); g.fillStyle = '#efe4c8'; g.font = '800 34px Inter'; g.textAlign = 'center'; title.split('|').forEach((l, i) => g.fillText(l, x + w / 2 + 10, y + 90 + i * 44)); g.restore(); }
window.renderFrame = function (t) { const k = clamp(t / DURATION);
  g.fillStyle = '#100a0a'; g.fillRect(0, 0, W, H); g.fillStyle = '#3a2416'; g.fillRect(0, H * 0.62, W, H);
  book(W * 0.12, H * 0.3, 360, 480, '#5a1a1a', 'FRANCIS|ITTY CORA', ease.out(clamp(k / 0.25)));
  book(W * 0.52, H * 0.32, 360, 460, '#1a2a4a', 'MANJAVEYIL|MARANANGAL', ease.out(clamp((k - 0.3) / 0.25)));
  SK.lamp(g, W * 0.88, H * 0.66, 0.8, t); SK.grain(g, t, 0.07); };
