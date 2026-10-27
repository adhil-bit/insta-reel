const c = makeCanvas(), g = c.getContext('2d');
const land = (pts, col) => { g.fillStyle = col; g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0] * W, p[1] * H) : g.moveTo(p[0] * W, p[1] * H)); g.closePath(); g.fill(); };
window.renderFrame = function (t) { const k = clamp(t / DURATION), p = ease.inOut(clamp((k - 0.1) / 0.7));
  g.fillStyle = '#1a2a3a'; g.fillRect(0, 0, W, H); g.strokeStyle = 'rgba(240,220,180,0.06)'; for (let i = 0; i < W; i += 90) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, H); g.stroke(); }
  land([[0.05, 0.22], [0.4, 0.2], [0.45, 0.3], [0.3, 0.36], [0.12, 0.34]], '#6a5a3a'); land([[0.5, 0.36], [0.7, 0.34], [0.78, 0.42], [0.72, 0.62], [0.66, 0.68], [0.6, 0.5]], '#6a5a3a'); land([[0.3, 0.38], [0.48, 0.36], [0.5, 0.46], [0.38, 0.5]], '#6a5a3a');
  const a = [0.66 * W, 0.64 * H], b = [0.2 * W, 0.28 * H], cp = [0.42 * W, 0.62 * H];
  g.strokeStyle = ACCENT; g.lineWidth = 5; g.setLineDash([16, 12]); g.beginPath(); for (let u = 0; u <= p; u += 0.01) { const x = (1 - u) ** 2 * a[0] + 2 * (1 - u) * u * cp[0] + u * u * b[0], y = (1 - u) ** 2 * a[1] + 2 * (1 - u) * u * cp[1] + u * u * b[1]; u ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); g.setLineDash([]);
  const u = p, sx = (1 - u) ** 2 * a[0] + 2 * (1 - u) * u * cp[0] + u * u * b[0], sy = (1 - u) ** 2 * a[1] + 2 * (1 - u) * u * cp[1] + u * u * b[1];
  g.fillStyle = '#efe4c8'; g.beginPath(); g.moveTo(sx, sy - 40); g.lineTo(sx + 28, sy - 4); g.lineTo(sx, sy - 4); g.fill(); g.fillStyle = '#2a1a10'; g.fillRect(sx - 26, sy - 4, 52, 12);
  for (let i = 0; i < 20; i++) { const q = (t * 0.4 + i / 20) % 1; g.fillStyle = `rgba(30,20,10,${1 - q})`; g.beginPath(); g.arc(0.66 * W + Math.sin(i) * 30, 0.64 * H + 30 + q * 20, 6, 0, 6.283); g.fill(); }
  g.fillStyle = ACCENT; g.beginPath(); g.arc(a[0], a[1], 10, 0, 6.283); g.fill(); SK.grain(g, t, 0.06); };
