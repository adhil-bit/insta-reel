const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
const ROCK = ['#4a3a2e', '#3e2f25', '#33271f', '#2a2019', '#241b15', '#1d1511', '#17100c', '#0f0a07'];
function rockBands(g, y0 = H * 0.33) { const h = (H - y0) / ROCK.length; ROCK.forEach((c, i) => { g.fillStyle = c; g.fillRect(0, y0 + i * h, W, h + 1); }); }
function night(g, t) { g.fillStyle = '#070a14'; g.fillRect(0, 0, W, H * 0.33); for (let i = 0; i < 60; i++) { g.fillStyle = `rgba(255,255,255,${0.4 + 0.5 * Math.abs(Math.sin(i * 3 + t))})`; g.fillRect((i * 173) % W, (i * 97) % (H * 0.3), 2, 2); }
  for (let j = 0; j < 3; j++) { g.strokeStyle = `rgba(90,230,140,${0.12 - j * 0.03})`; g.lineWidth = 40; g.beginPath(); for (let x = 0; x <= W; x += 20) { const y = H * (0.1 + j * 0.04) + Math.sin(x / 180 + t * 0.4 + j) * 30; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
  g.fillStyle = '#e8eef5'; g.fillRect(0, H * 0.33 - 14, W, 14); }
function tower(g) { g.strokeStyle = '#9aa0aa'; g.lineWidth = 4; g.beginPath(); g.moveTo(W / 2 - 90, H * 0.33); g.lineTo(W / 2, H * 0.14); g.lineTo(W / 2 + 90, H * 0.33); g.stroke(); for (let i = 1; i < 6; i++) { const y = H * 0.14 + (H * 0.19) * i / 6, w = 90 * i / 6; g.beginPath(); g.moveTo(W / 2 - w, y); g.lineTo(W / 2 + w, y); g.moveTo(W / 2 - w, y); g.lineTo(W / 2 + w * 0.9, y - (H * 0.19) / 6 * 0.9); g.stroke(); } }
const c = makeCanvas(), g = c.getContext('2d');
window.renderFrame = function (t) { const k = clamp(t / (DURATION * 0.6)), tip = lerp(H * 0.33, H * 0.9, ease.inOut(k));
  g.globalAlpha = 1; rockBands(g); night(g, t); tower(g);
  g.fillStyle = ACCENT; g.fillRect(W / 2 - 5, H * 0.33, 10, tip - H * 0.33); const gl = g.createRadialGradient(W / 2, tip, 2, W / 2, tip, 70); gl.addColorStop(0, rgba(ACCENT, 0.8)); gl.addColorStop(1, rgba(ACCENT, 0)); g.fillStyle = gl; g.fillRect(W / 2 - 70, tip - 70, 140, 140); };
