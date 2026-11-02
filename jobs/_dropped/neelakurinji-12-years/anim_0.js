const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
function hills(x, base, amp, f, ph, col) { x.fillStyle = col; x.beginPath(); x.moveTo(0, H); for (let X = 0; X <= W; X += 12) x.lineTo(X, base - amp * (0.6 * Math.sin(X * f + ph) + 0.4 * Math.sin(X * f * 2.7 + ph * 2))); x.lineTo(W, H); x.fill(); }
function ridgeY(X, base, amp, f, ph) { return base - amp * (0.6 * Math.sin(X * f + ph) + 0.4 * Math.sin(X * f * 2.7 + ph * 2)); }
function flower(g, x, y, s, a, col) {             // small bell-shaped kurinji flower cluster
  g.save(); g.translate(x, y); g.scale(s, s); g.globalAlpha = a;
  for (let i = 0; i < 5; i++) { const an = i / 5 * 6.283; g.fillStyle = col; g.beginPath(); g.ellipse(Math.cos(an) * 10, Math.sin(an) * 10, 9, 14, an, 0, 6.283); g.fill(); }
  g.fillStyle = '#f5f0ff'; g.beginPath(); g.arc(0, 0, 5, 0, 6.283); g.fill(); g.restore(); g.globalAlpha = 1;
}
function fadeBottom(g) { const f = g.createLinearGradient(0, H * 0.55, 0, H * 0.8); f.addColorStop(0, 'rgba(4,6,10,0)'); f.addColorStop(1, 'rgba(4,6,10,1)'); g.fillStyle = f; g.fillRect(0, H * 0.55, W, H); }
const BLUES = ['#7b6cf0', '#5b6ee8', '#9a7cf2', '#6a5ae0'];
const c = makeCanvas(), g = c.getContext('2d');
const sky = layer(x => { const s = x.createLinearGradient(0, 0, 0, H * 0.5); s.addColorStop(0, '#0e1630'); s.addColorStop(1, '#6a6a9a'); x.fillStyle = s; x.fillRect(0, 0, W, H); });
const pts = []; for (let i = 0; i < 1600; i++) { const X = rand() * W, layerI = rand() < 0.5 ? 0 : 1, base = layerI ? H * 0.5 : H * 0.42, amp = layerI ? 60 : 90, ph = layerI ? 3 : 1, f = layerI ? 0.006 : 0.004;
  const top = ridgeY(X, base, amp, f, ph); pts.push({x: X, y: top + 8 + rand() * (H * 0.62 - top), l: layerI, col: BLUES[i % 4], s: 0.5 + rand() * 0.6}); }
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.85)), wave = ease.inOut(k) * (W + 300) - 150;
  g.globalAlpha = 1; g.drawImage(sky, 0, 0);
  hills(g, H * 0.42, 90, 0.004, 1, '#2a4a3a'); 
  for (const p of pts) if (p.l === 0 && p.x < wave) flower(g, p.x, p.y, p.s, clamp((wave - p.x) / 150), p.col);
  hills(g, H * 0.5, 60, 0.006, 3, '#1e3a2c');
  for (const p of pts) if (p.l === 1 && p.x < wave - 80) flower(g, p.x, p.y, p.s * 1.3, clamp((wave - 80 - p.x) / 150), p.col);
  for (let i = 0; i < 6; i++) { const x = ((i * 240 + t * 15) % (W + 500)) - 250, y = H * 0.36 + (i * 37) % 80, gr = g.createRadialGradient(x, y, 0, x, y, 260);
    gr.addColorStop(0, 'rgba(230,230,245,0.2)'); gr.addColorStop(1, 'rgba(230,230,245,0)'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, 260, 0, 6.283); g.fill(); }
  fadeBottom(g);
};
