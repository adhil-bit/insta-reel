const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
function palm(x, base, h, lean, g2, color) {        // coconut palm silhouette
  g2.strokeStyle = color; g2.lineWidth = 12; g2.lineCap = 'round';
  const tx = x + lean, ty = base - h;
  g2.beginPath(); g2.moveTo(x, base); g2.quadraticCurveTo(x + lean * 0.2, base - h * 0.5, tx, ty); g2.stroke();
  g2.lineWidth = 7;
  for (let i = 0; i < 8; i++) { const a = -Math.PI / 2 + (i - 3.5) * 0.42, L = 120 + (i % 2) * 30;
    g2.beginPath(); g2.moveTo(tx, ty); g2.quadraticCurveTo(tx + Math.cos(a) * L * 0.6, ty + Math.sin(a) * L * 0.6 - 20, tx + Math.cos(a) * L, ty + Math.sin(a) * L + 50); g2.stroke(); }
}
function mixc(a, b, t) { return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')})`; }
const c = makeCanvas(), g = c.getContext('2d');
const lineY = H * 0.2;
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#16141c'); s.addColorStop(0.6, '#0d0b0f'); s.addColorStop(1, '#030203'); x.fillStyle = s; x.fillRect(0, 0, W, H);
  x.fillStyle = '#2a2420'; x.fillRect(60, lineY - 40, 16, 700); x.fillRect(W - 76, lineY - 40, 16, 700); });
const cloths = [{x: 150, w: 210, h: 300}, {x: 400, w: 170, h: 380}, {x: 610, w: 200, h: 260}, {x: 850, w: 150, h: 330}];
const drops = Array.from({length: 360}, () => ({x: rand() * W, y: rand() * H, s: 0.8 + rand() * 0.5}));
const stains = Array.from({length: 140}, () => ({c: Math.floor(rand() * 4), u: rand(), v: rand(), r: 8 + rand() * 26, at: rand()}));
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.85));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  g.strokeStyle = '#8a8070'; g.lineWidth = 4; g.beginPath(); g.moveTo(68, lineY); g.quadraticCurveTo(W / 2, lineY + 50, W - 68, lineY); g.stroke();
  cloths.forEach((cl, i) => {
    const sway = Math.sin(t * 1.6 + i) * 0.04, y0 = lineY + 18 + Math.sin(cl.x / W * Math.PI) * 40;
    g.save(); g.translate(cl.x + cl.w / 2, y0); g.rotate(sway);
    g.fillStyle = mixc([235, 232, 225], [255, 190, 200], ease.inOut(clamp(k * 1.2 - i * 0.08)));
    g.beginPath(); g.moveTo(-cl.w / 2, 0); g.lineTo(cl.w / 2, 0); g.lineTo(cl.w / 2 + 8, cl.h); g.quadraticCurveTo(0, cl.h + 18, -cl.w / 2 - 8, cl.h); g.closePath(); g.fill();
    g.save(); g.clip();
    for (const s of stains) if (s.c === i && k > s.at * 0.8) {
      const a = clamp((k - s.at * 0.8) * 4); g.fillStyle = rgba(ACCENT, 0.35 * a);
      g.beginPath(); g.arc((s.u - 0.5) * cl.w, s.v * cl.h, s.r * a, 0, 6.283); g.fill(); }
    g.restore();
    g.fillStyle = '#6a5a40'; g.fillRect(-cl.w / 2 + 14, -10, 12, 24); g.fillRect(cl.w / 2 - 26, -10, 12, 24);
    g.restore();
  });
  g.strokeStyle = rgba(ACCENT, 0.75); g.lineWidth = 3; g.beginPath();
  for (const d of drops) { const y = (d.y + t * 1200 * d.s) % H; g.moveTo(d.x - y * 0.1, y); g.lineTo(d.x - y * 0.1 - 4, y + 30); } g.stroke();
};
