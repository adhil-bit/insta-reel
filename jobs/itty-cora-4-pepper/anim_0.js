const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / DURATION), gold = ease.inOut(clamp((k - 0.4) / 0.4));
  g.fillStyle = '#0c140c'; g.fillRect(0, 0, W, H); const bg = g.createRadialGradient(W / 2, H * 0.42, 50, W / 2, H * 0.42, 800); bg.addColorStop(0, '#2a3a1a'); bg.addColorStop(1, '#0a100a'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
  for (const [x, y, r, s] of [[0.28, 0.32, 0.5, -1], [0.72, 0.3, -0.5, 1]]) { g.save(); g.translate(W * x, H * y); g.rotate(r); g.fillStyle = '#3a7a3a'; g.beginPath(); g.ellipse(0, 0, 170, 90, 0, 0, 6.283); g.fill(); g.strokeStyle = '#2a5a2a'; g.lineWidth = 4; g.beginPath(); g.moveTo(-160, 0); g.lineTo(160, 0); g.stroke(); g.restore(); }
  g.strokeStyle = '#4a6a2a'; g.lineWidth = 6; g.beginPath(); g.moveTo(W / 2, H * 0.22); g.quadraticCurveTo(W / 2 + 20, H * 0.4, W / 2 - 10, H * 0.6); g.stroke();
  for (let i = 0; i < 26; i++) { const u = i / 25, x = W / 2 + Math.sin(u * 7) * 40 + (u * 30 - 15), y = H * 0.26 + u * H * 0.34, col = i < 8 ? '#c0302a' : i < 16 ? '#2a1a12' : '#4a8a2a';
    g.fillStyle = gold > 0 ? `rgb(${lerp(parseInt(col.slice(1, 3), 16), 242, gold) | 0},${lerp(parseInt(col.slice(3, 5), 16), 182, gold) | 0},${lerp(parseInt(col.slice(5, 7), 16), 50, gold) | 0})` : col;
    g.beginPath(); g.arc(x, y, 16, 0, 6.283); g.fill(); }
  if (gold > 0) { const gl = g.createRadialGradient(W / 2, H * 0.42, 20, W / 2, H * 0.42, 500); gl.addColorStop(0, `rgba(255,210,120,${0.35 * gold})`); gl.addColorStop(1, 'rgba(255,210,120,0)'); g.fillStyle = gl; g.fillRect(0, 0, W, H); }
  SK.grain(g, t, 0.06); };
