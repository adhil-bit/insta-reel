const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
function pillar(g, x, base, h, s) {                 // tapered iron shaft with a bell-shaped capital
  const gr = g.createLinearGradient(x - 40 * s, 0, x + 40 * s, 0); gr.addColorStop(0, '#1e1c1a'); gr.addColorStop(0.35, '#5a524a'); gr.addColorStop(0.6, '#3a3430'); gr.addColorStop(1, '#151412');
  g.fillStyle = gr; g.beginPath(); g.moveTo(x - 40 * s, base); g.lineTo(x - 30 * s, base - h); g.lineTo(x + 30 * s, base - h); g.lineTo(x + 40 * s, base); g.fill();
  const top = base - h;
  g.beginPath(); g.moveTo(x - 30 * s, top); g.bezierCurveTo(x - 70 * s, top - 30 * s, x - 70 * s, top - 70 * s, x - 40 * s, top - 90 * s); g.lineTo(x + 40 * s, top - 90 * s);
  g.bezierCurveTo(x + 70 * s, top - 70 * s, x + 70 * s, top - 30 * s, x + 30 * s, top); g.fill();
  g.fillRect(x - 46 * s, top - 110 * s, 92 * s, 20 * s); g.fillRect(x - 30 * s, top - 140 * s, 60 * s, 30 * s);
  g.strokeStyle = 'rgba(255,255,255,0.12)'; g.lineWidth = 4 * s; g.beginPath(); g.moveTo(x - 12 * s, base - 10); g.lineTo(x - 9 * s, top + 10); g.stroke();
}
function fadeBottom(g) { const f = g.createLinearGradient(0, H * 0.55, 0, H * 0.8); f.addColorStop(0, 'rgba(4,6,10,0)'); f.addColorStop(1, 'rgba(4,6,10,1)'); g.fillStyle = f; g.fillRect(0, H * 0.55, W, H); }
const c = makeCanvas(), g = c.getContext('2d');
const base = H * 0.6;
window.renderFrame = function (t) {
  const k = clamp(t / DURATION), day = (t * 1.6) % 1, night = Math.sin(day * Math.PI);
  const sk = g.createLinearGradient(0, 0, 0, base); sk.addColorStop(0, `rgb(${10 + 60 * night},${14 + 90 * night},${30 + 140 * night})`); sk.addColorStop(1, `rgb(${30 + 160 * night},${30 + 130 * night},${40 + 90 * night})`);
  g.globalAlpha = 1; g.fillStyle = sk; g.fillRect(0, 0, W, base); g.fillStyle = '#16120e'; g.fillRect(0, base, W, H);
  const sx = lerp(-80, W + 80, day), sy = base - Math.sin(day * Math.PI) * (base - 150);
  g.fillStyle = '#ffd98a'; g.beginPath(); g.arc(sx, sy, 50, 0, 6.283); g.fill();
  pillar(g, W / 2, base, 700, 1.4);
  const ring = g.createRadialGradient(W * 0.82, H * 0.1, 10, W * 0.82, H * 0.1, 90); ring.addColorStop(0, rgba(ACCENT, 0.3)); ring.addColorStop(1, rgba(ACCENT, 0));
  g.fillStyle = ring; g.fillRect(W / 2 - 90, H * 0.12 - 90, 180, 180);
  g.strokeStyle = ACCENT; g.lineWidth = 8; g.beginPath(); g.arc(W * 0.82, H * 0.1, 60, -Math.PI / 2, -Math.PI / 2 + ease.inOut(k) * 6.283); g.stroke();
  fadeBottom(g);
};
