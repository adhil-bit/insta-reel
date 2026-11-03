const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), fall = ease.in(clamp((k - 0.35) / 0.35)), dawn = ease.out(clamp((k - 0.5) / 0.4));
  g.fillStyle = '#120c0c'; g.fillRect(0, 0, W, H); const sky = g.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, `rgba(255,190,120,${0.35 * dawn})`); sky.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = sky; g.fillRect(0, 0, W, H);
  SK.person(g, W / 2, H * 0.74, 520, 'stand', '#06040a', t);
  g.save(); g.translate(W / 2 + 40 * fall, H * 0.74 - 470 + fall * 700); g.rotate(fall * 1.8); g.fillStyle = '#e8dcc0'; g.beginPath(); g.ellipse(0, 0, 60, 76, 0, 0, 6.283); g.fill(); g.fillStyle = '#120c0c'; g.beginPath(); g.ellipse(-22, -10, 12, 8, 0, 0, 6.283); g.ellipse(22, -10, 12, 8, 0, 0, 6.283); g.fill(); g.strokeStyle = '#120c0c'; g.lineWidth = 4; g.beginPath(); g.arc(0, 26, 20, 0.2, Math.PI - 0.2); g.stroke(); g.restore();
  SK.grain(g, t, 0.07); };
