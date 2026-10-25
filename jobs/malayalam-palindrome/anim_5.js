const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
try { document.fonts.load('80px Noto'); document.fonts.load('80px Baloo'); } catch (e) {}
const ML_FONT = '"Noto", "Noto Sans Malayalam", sans-serif';
const bgL = () => layer(x => { const b = x.createRadialGradient(W / 2, H * 0.38, 40, W / 2, H * 0.38, H * 0.8); b.addColorStop(0, '#2a1630'); b.addColorStop(1, '#07040a'); x.fillStyle = b; x.fillRect(0, 0, W, H); });
const c = makeCanvas(), g = c.getContext('2d'); const bg = bgL();
function crown(x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); const gr = g.createLinearGradient(0, -120, 0, 60); gr.addColorStop(0, '#FFE58A'); gr.addColorStop(1, '#C8901E');
  g.fillStyle = gr; g.beginPath(); g.moveTo(-170, 60); g.lineTo(-190, -70); g.lineTo(-95, 0); g.lineTo(0, -120); g.lineTo(95, 0); g.lineTo(190, -70); g.lineTo(170, 60); g.closePath(); g.fill();
  g.fillStyle = '#B07A14'; g.fillRect(-172, 40, 344, 34); for (const [px, py] of [[-190, -70], [0, -120], [190, -70]]) { g.fillStyle = ACCENT; g.beginPath(); g.arc(px, py, 18, 0, 6.283); g.fill(); } g.restore(); }
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.85)), d = ease.out(clamp(k * 1.5));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  const y = H * 0.44; const gl = g.createRadialGradient(W / 2, y - 120, 20, W / 2, y - 120, 500); gl.addColorStop(0, `rgba(255,210,110,${0.35 * d})`); gl.addColorStop(1, 'rgba(255,210,110,0)'); g.fillStyle = gl; g.fillRect(0, 0, W, H);
  g.font = `800 150px ${ML_FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#f5ecff'; g.fillText('മലയാളം', W / 2, y);
  crown(W / 2, lerp(-200, y - 230, d) + Math.sin(t * 2) * 6, 0.8);
  for (let i = 0; i < 24; i++) { const a = i / 24 * 6.283 + t * 0.3, r = 300 * d; g.fillStyle = `rgba(255,229,138,${0.5 * d * Math.abs(Math.sin(t * 2 + i))})`; g.fillRect(W / 2 + Math.cos(a) * r, y - 60 + Math.sin(a) * r * 0.5, 5, 5); }
};
