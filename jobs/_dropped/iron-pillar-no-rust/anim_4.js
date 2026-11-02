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
const surf = H * 0.36;
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#0c1422'); s.addColorStop(1, '#03050a'); x.fillStyle = s; x.fillRect(0, 0, W, H); });
const drops = Array.from({length: 14}, () => ({x: rand() * W, p: rand(), s: 0.6 + rand() * 0.6}));
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.88)), lay = ease.inOut(clamp(k * 1.5));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  for (let r = 0; r < 7; r++) for (let q = 0; q < 12; q++) { const x = 60 + q * 88 + (r % 2) * 44, y = surf + 50 + r * 76;
    g.fillStyle = '#4a4e58'; g.beginPath(); g.arc(x, y, 30, 0, 6.283); g.fill(); g.fillStyle = 'rgba(255,255,255,0.15)'; g.beginPath(); g.arc(x - 9, y - 9, 10, 0, 6.283); g.fill(); }
  for (let q = 0; q < 24; q++) { const x = q * 46 + 20; if (x / W > lay) continue; g.fillStyle = 'rgba(255,170,90,0.9)'; g.beginPath(); g.arc(x, surf + 50 + 40, 7, 0, 6.283); g.fill(); }
  g.fillStyle = rgba(ACCENT, 0.35 * lay); g.fillRect(0, surf - 6, W * lay, 22);
  g.strokeStyle = rgba(ACCENT, 0.9); g.lineWidth = 4; g.beginPath(); g.moveTo(0, surf - 6); g.lineTo(W * lay, surf - 6); g.stroke();
  for (const d of drops) { const ph = (t * d.s * 0.6 + d.p) % 1, y = ph < 0.6 ? lerp(-20, surf - 26, ph / 0.6) : surf - 26 - Math.sin((ph - 0.6) / 0.4 * Math.PI) * 160;
    const x = d.x + (ph > 0.6 ? (ph - 0.6) * 300 : 0); g.fillStyle = 'rgba(150,200,255,0.85)'; g.beginPath(); g.ellipse(x, y, 10, 14, 0, 0, 6.283); g.fill(); }
  fadeBottom(g);
};
