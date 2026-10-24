const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
function palm(g2, x, base, h, lean, color) { g2.strokeStyle = color; g2.lineWidth = 10; g2.lineCap = 'round'; const tx = x + lean, ty = base - h;
  g2.beginPath(); g2.moveTo(x, base); g2.quadraticCurveTo(x + lean * 0.2, base - h * 0.5, tx, ty); g2.stroke(); g2.lineWidth = 6;
  for (let i = 0; i < 8; i++) { const a = -Math.PI / 2 + (i - 3.5) * 0.42, L = 100 + (i % 2) * 24; g2.beginPath(); g2.moveTo(tx, ty); g2.quadraticCurveTo(tx + Math.cos(a) * L * 0.6, ty + Math.sin(a) * L * 0.6 - 16, tx + Math.cos(a) * L, ty + Math.sin(a) * L + 40); g2.stroke(); } }
function stonesRow(g, x0, x1, y, h, t, col) { for (let x = x0, i = 0; x < x1; x += 44, i++) { g.fillStyle = i % 2 ? col : '#6a6458'; g.beginPath(); g.roundRect(x, y - h + (i % 3) * 4, 46, h, 10); g.fill(); } }
function fadeBottom(g) { const f = g.createLinearGradient(0, H * 0.55, 0, H * 0.8); f.addColorStop(0, 'rgba(4,6,10,0)'); f.addColorStop(1, 'rgba(4,6,10,1)'); g.fillStyle = f; g.fillRect(0, H * 0.55, W, H); }
const c = makeCanvas(), g = c.getContext('2d');
const bed = H * 0.46;
const bg = layer(x => { const w = x.createLinearGradient(0, 0, 0, bed); w.addColorStop(0, '#1a3a5a'); w.addColorStop(1, '#2a5a7a'); x.fillStyle = w; x.fillRect(0, 0, W, bed);
  const s = x.createLinearGradient(0, bed, 0, H * 0.75); s.addColorStop(0, '#c8a870'); s.addColorStop(1, '#05070b'); x.fillStyle = s; x.fillRect(0, bed, W, H); });
const flows = Array.from({length: 50}, () => ({y: rand() * bed * 0.9, o: rand(), l: 60 + rand() * 120, s: 0.6 + rand()}));
const sand = Array.from({length: 80}, () => ({x: rand() * W, o: rand()}));
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.88)), sink = ease.inOut(k) * 80;
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  g.strokeStyle = 'rgba(220,240,255,0.35)'; g.lineWidth = 3; g.beginPath(); for (const f of flows) { const x = ((f.o * W * 1.4 + t * 300 * f.s) % (W + 300)) - 150; g.moveTo(x, f.y); g.lineTo(x + f.l, f.y); } g.stroke();
  for (const s of sand) { const ph = (t * 0.6 + s.o) % 1; g.fillStyle = `rgba(220,190,130,${0.8 * (1 - ph)})`; g.fillRect(s.x + ph * 160, bed - 6 - Math.sin(ph * Math.PI) * 40, 5, 4); }
  for (let i = 0; i < 5; i++) { const x = 120 + i * 190; g.fillStyle = ['#7a7266', '#8a8276', '#6a6458'][i % 3]; g.beginPath(); g.roundRect(x, bed - 130 + sink, 170, 130, 22); g.fill();
    g.fillStyle = 'rgba(255,255,255,0.1)'; g.fillRect(x + 12, bed - 120 + sink, 146, 10); }
  g.fillStyle = 'rgba(200,170,110,0.95)'; g.fillRect(0, bed, W, 12);
  g.strokeStyle = rgba(ACCENT, 0.8); g.lineWidth = 5; g.setLineDash([12, 10]); g.beginPath(); g.moveTo(80, bed); g.lineTo(W - 80, bed); g.stroke(); g.setLineDash([]);
  fadeBottom(g);
};
