const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), pan = ease.inOut(k);
  SK.sky(g, 'dawn', 0.55); SK.sea(g, H * 0.55, t, ['#5a6a8a', '#3a4a6a', '#24324a'], false, H * 0.72); g.fillStyle = '#14161c'; g.fillRect(0, H * 0.72, W, H);
  g.save(); g.translate(-pan * 200, 0);
  g.fillStyle = '#2a3040'; g.beginPath(); g.moveTo(80, H * 0.56); g.lineTo(820, H * 0.56); g.lineTo(880, H * 0.5); g.lineTo(760, H * 0.505); g.lineTo(60, H * 0.53); g.closePath(); g.fill(); g.fillRect(560, H * 0.44, 90, H * 0.06); g.fillRect(590, H * 0.4, 30, H * 0.04);
  g.fillStyle = '#1a1e28'; g.fillRect(980, H * 0.25, 22, H * 0.47); g.fillRect(860, H * 0.25, 300, 18); g.fillRect(1140, H * 0.25, 10, 120);
  g.restore();
  g.fillStyle = 'rgba(8,10,16,0.75)'; g.beginPath(); g.roundRect(W * 0.08, H * 0.76, 340, 56, 28); g.fill(); g.fillStyle = '#F59E3B'; g.font = '800 30px Inter'; g.textAlign = 'center'; g.fillText('INS VIKRANT', W * 0.08 + 170, H * 0.76 + 38);
  SK.grain(g, t, 0.05); };
