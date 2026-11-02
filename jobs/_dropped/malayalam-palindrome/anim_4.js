const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
try { document.fonts.load('80px Noto'); document.fonts.load('80px Baloo'); } catch (e) {}
const ML_FONT = '"Noto", "Noto Sans Malayalam", sans-serif';
const bgL = () => layer(x => { const b = x.createRadialGradient(W / 2, H * 0.38, 40, W / 2, H * 0.38, H * 0.8); b.addColorStop(0, '#2a1630'); b.addColorStop(1, '#07040a'); x.fillStyle = b; x.fillRect(0, 0, W, H); });
const c = makeCanvas(), g = c.getContext('2d');
const bg = layer(x => { const b = x.createRadialGradient(W / 2, H * 0.36, 40, W / 2, H * 0.36, H * 0.8); b.addColorStop(0, '#3a2a14'); b.addColorStop(1, '#080503'); x.fillStyle = b; x.fillRect(0, 0, W, H); });
function parrot(x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s); const bob = Math.sin(t * 3) * 0.05; g.rotate(bob);
  g.fillStyle = '#2f9e44'; g.beginPath(); g.moveTo(-10, 60); g.lineTo(-60, 230); g.lineTo(-20, 220); g.lineTo(10, 70); g.fill();
  g.fillStyle = '#37b24d'; g.beginPath(); g.ellipse(0, 0, 70, 110, 0.2, 0, 6.283); g.fill();
  g.fillStyle = '#2b8a3e'; g.beginPath(); g.ellipse(20, 20, 40, 80, 0.4, 0, 6.283); g.fill();
  g.fillStyle = '#40c057'; g.beginPath(); g.arc(-10, -110, 52, 0, 6.283); g.fill();
  g.fillStyle = '#e03131'; g.beginPath(); g.moveTo(-50, -115); g.quadraticCurveTo(-95, -100, -70, -70); g.lineTo(-48, -92); g.fill();
  g.fillStyle = '#fff'; g.beginPath(); g.arc(-20, -122, 10, 0, 6.283); g.fill(); g.fillStyle = '#111'; g.beginPath(); g.arc(-22, -122, 5, 0, 6.283); g.fill();
  g.strokeStyle = '#212529'; g.lineWidth = 6; g.beginPath(); g.moveTo(-25, -82); g.quadraticCurveTo(10, -60, 40, -90); g.stroke(); g.restore(); }
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.88)), unroll = ease.inOut(clamp(k * 1.4));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  for (let i = 0; i < 5; i++) { const y = H * 0.46 + i * 34, w = 760 * unroll; g.fillStyle = i % 2 ? '#c8a463' : '#d6b574'; g.fillRect(W / 2 - 380, y, w, 26);
    g.strokeStyle = 'rgba(60,40,20,0.6)'; g.lineWidth = 2; for (let j = 0; j < w - 40; j += 26) { g.beginPath(); g.moveTo(W / 2 - 360 + j, y + 13); g.lineTo(W / 2 - 348 + j, y + 13); g.stroke(); } }
  g.strokeStyle = '#6a4a20'; g.lineWidth = 4; g.beginPath(); g.moveTo(W / 2 - 380, H * 0.46 - 10); g.lineTo(W / 2 - 380, H * 0.46 + 180); g.stroke();
  parrot(W / 2 + 60, H * 0.46 - 120 + Math.sin(t * 2) * 6, 1.4, t);
  const gl = g.createRadialGradient(W / 2, H * 0.36, 40, W / 2, H * 0.36, 460); gl.addColorStop(0, rgba(ACCENT, 0.18)); gl.addColorStop(1, rgba(ACCENT, 0)); g.fillStyle = gl; g.fillRect(0, 0, W, H);
};
