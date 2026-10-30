const c = makeCanvas(), g = c.getContext('2d');
function cross(x, y, a) { g.strokeStyle = `rgba(192,57,43,${a})`; g.lineWidth = 10; g.beginPath(); g.arc(x, y, 92, 0, 6.283); g.stroke(); g.beginPath(); g.moveTo(x - 65, y - 65); g.lineTo(x + 65, y + 65); g.stroke(); }
window.renderFrame = function (t) { const k = clamp(t / DURATION);
  g.fillStyle = '#0e141c'; g.fillRect(0, 0, W, H); g.strokeStyle = 'rgba(120,160,200,0.12)'; g.lineWidth = 2; for (let i = 0; i < 20; i++) { g.beginPath(); g.moveTo(i * 60, 0); g.lineTo(i * 60, H); g.stroke(); g.beginPath(); g.moveTo(0, i * 100); g.lineTo(W, i * 100); g.stroke(); }
  const zone = ease.out(clamp(k / 0.3)); g.fillStyle = `rgba(192,57,43,${0.25 * zone})`; g.strokeStyle = `rgba(192,57,43,${zone})`; g.lineWidth = 6; g.setLineDash([16, 10]); g.beginPath(); g.roundRect(W * 0.12, H * 0.2, W * 0.76, H * 0.25, 30); g.fill(); g.stroke(); g.setLineDash([]);
  g.fillStyle = `rgba(255,255,255,${zone})`; g.font = '800 44px Inter'; g.textAlign = 'center'; g.fillText('PROHIBITED PLACE', W / 2, H * 0.33);
  const items = [['cam', 0.22], ['pen', 0.5], ['plan', 0.78]];
  items.forEach(([kind, fx], i) => { const a = ease.out(clamp((k - 0.3 - i * 0.12) / 0.15)); if (a <= 0) return; const x = W * fx, y = H * 0.58; g.save(); g.globalAlpha = a; g.fillStyle = '#e8e8e8';
    if (kind === 'cam') { g.beginPath(); g.roundRect(x - 55, y - 32, 110, 66, 10); g.fill(); g.fillStyle = '#0e141c'; g.beginPath(); g.arc(x, y + 2, 20, 0, 6.283); g.fill(); }
    if (kind === 'pen') { g.save(); g.translate(x, y); g.rotate(-0.7); g.fillRect(-10, -60, 20, 100); g.beginPath(); g.moveTo(-10, 40); g.lineTo(10, 40); g.lineTo(0, 64); g.fill(); g.restore(); }
    if (kind === 'plan') { g.fillRect(x - 50, y - 60, 100, 120); g.strokeStyle = '#0e141c'; g.lineWidth = 4; g.strokeRect(x - 34, y - 40, 40, 40); g.strokeRect(x + 6, y - 10, 30, 50); }
    g.restore(); cross(x, y, a); });
  SK.grain(g, t, 0.05); };
