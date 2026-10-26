const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
const ROCK = ['#4a3a2e', '#3e2f25', '#33271f', '#2a2019', '#241b15', '#1d1511', '#17100c', '#0f0a07'];
function rockBands(g, y0 = H * 0.33) { const h = (H - y0) / ROCK.length; ROCK.forEach((c, i) => { g.fillStyle = c; g.fillRect(0, y0 + i * h, W, h + 1); }); }
function night(g, t) { g.fillStyle = '#070a14'; g.fillRect(0, 0, W, H * 0.33); for (let i = 0; i < 60; i++) { g.fillStyle = `rgba(255,255,255,${0.4 + 0.5 * Math.abs(Math.sin(i * 3 + t))})`; g.fillRect((i * 173) % W, (i * 97) % (H * 0.3), 2, 2); }
  for (let j = 0; j < 3; j++) { g.strokeStyle = `rgba(90,230,140,${0.12 - j * 0.03})`; g.lineWidth = 40; g.beginPath(); for (let x = 0; x <= W; x += 20) { const y = H * (0.1 + j * 0.04) + Math.sin(x / 180 + t * 0.4 + j) * 30; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
  g.fillStyle = '#e8eef5'; g.fillRect(0, H * 0.33 - 14, W, 14); }
function tower(g) { g.strokeStyle = '#9aa0aa'; g.lineWidth = 4; g.beginPath(); g.moveTo(W / 2 - 90, H * 0.33); g.lineTo(W / 2, H * 0.14); g.lineTo(W / 2 + 90, H * 0.33); g.stroke(); for (let i = 1; i < 6; i++) { const y = H * 0.14 + (H * 0.19) * i / 6, w = 90 * i / 6; g.beginPath(); g.moveTo(W / 2 - w, y); g.lineTo(W / 2 + w, y); g.moveTo(W / 2 - w, y); g.lineTo(W / 2 + w * 0.9, y - (H * 0.19) / 6 * 0.9); g.stroke(); } }
const c = makeCanvas(), g = c.getContext('2d'); const chips = Array.from({length: 20}, () => ({x: (rand() - 0.5) * 240, p: rand(), s: 0.5 + rand()}));
window.renderFrame = function (t) { const k = clamp(t / DURATION), y = lerp(H * 0.3, H * 0.62, ease.inOut(k));
  g.globalAlpha = 1; rockBands(g, H * 0.2); g.fillStyle = '#070a14'; g.fillRect(0, 0, W, H * 0.2);
  const h = (H - H * 0.2) / ROCK.length; for (let i = 0; i < ROCK.length; i++) { const by = H * 0.2 + i * h; if (y > by) { g.fillStyle = ACCENT; g.fillRect(40, by - 2, 40, 4); } }
  g.fillStyle = '#1a1612'; g.fillRect(W / 2 - 16, H * 0.2, 32, y - H * 0.2);
  g.fillStyle = '#8a8f98'; g.fillRect(W / 2 - 12, H * 0.2, 24, y - H * 0.2 - 10);
  g.save(); g.translate(W / 2, y); g.fillStyle = '#c8ccd4'; g.beginPath(); g.moveTo(-40, -30); g.lineTo(40, -30); g.lineTo(0, 40); g.closePath(); g.fill(); g.save(); g.beginPath(); g.moveTo(-40, -30); g.lineTo(40, -30); g.lineTo(0, 40); g.closePath(); g.clip(); const ph = (t * 8) % 1; g.fillStyle = '#3a3a40'; for (let i = -4; i < 5; i++) g.fillRect(-40 + ((i + ph) * 16), -30, 8, 80); g.restore(); g.restore();
  for (const c2 of chips) { const u = (t * 0.7 * c2.s + c2.p) % 1; const cx = W / 2 + c2.x * u, cy = y - 120 * Math.sin(u * Math.PI) + u * 40; g.fillStyle = '#6a5a4a'; g.fillRect(cx, cy, 8, 6); } };
