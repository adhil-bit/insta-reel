const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
function sea(g, y0, amp, t, sp, col, x0 = 0, x1 = W) {
  g.fillStyle = col; g.beginPath(); g.moveTo(x0, H);
  for (let x = x0; x <= x1; x += 10) g.lineTo(x, y0 + Math.sin(x * 0.012 + t * sp) * amp + Math.sin(x * 0.033 - t * sp * 1.4) * amp * 0.4);
  g.lineTo(x1, H); g.closePath(); g.fill();
}

function fadeBottom(g) { const f = g.createLinearGradient(0, H * 0.55, 0, H * 0.8); f.addColorStop(0, 'rgba(4,6,10,0)'); f.addColorStop(1, 'rgba(4,6,10,1)'); g.fillStyle = f; g.fillRect(0, H * 0.55, W, H); }
function ruin(g, x, base, s, col) {      // broken church facade with an arched doorway
  g.save(); g.translate(x, base); g.scale(s, s); g.fillStyle = col;
  g.beginPath(); g.moveTo(-170, 0); g.lineTo(-170, -260); g.lineTo(-120, -300); g.lineTo(-90, -270); g.lineTo(-60, -340); g.lineTo(-10, -360);
  g.lineTo(30, -310); g.lineTo(70, -330); g.lineTo(110, -250); g.lineTo(150, -260); g.lineTo(170, -200); g.lineTo(170, 0); g.closePath(); g.fill();
  g.globalCompositeOperation = 'destination-out';
  g.beginPath(); g.moveTo(-45, 0); g.lineTo(-45, -150); g.arc(0, -150, 45, Math.PI, 0); g.lineTo(45, 0); g.fill();
  for (const wx of [-120, 100]) { g.beginPath(); g.moveTo(wx - 18, -150); g.lineTo(wx - 18, -210); g.arc(wx, -210, 18, Math.PI, 0); g.lineTo(wx + 18, -150); g.fill(); }
  g.restore();
}
const c = makeCanvas(), g = c.getContext('2d');
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#05070d'); s.addColorStop(1, '#0c1420'); x.fillStyle = s; x.fillRect(0, 0, W, H); });
const arms = Array.from({length: 1400}, () => { const arm = Math.floor(rand() * 3), r = 30 + rand() * 420; return {r, a: arm * 2.094 - r * 0.012 + (rand() - 0.5) * 0.7, s: 3 + rand() * 6}; });
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.88)), cx = lerp(W * 1.1, W * 0.55, ease.out(k)), cy = H * 0.34, grow = 1.0 + 0.45 * ease.out(k);
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  sea(g, H * 0.58, 8 + 18 * k, t, 2 + 2 * k, '#123048');
  g.fillStyle = '#3a3226'; g.beginPath(); g.moveTo(0, H * 0.6); g.lineTo(W * 0.3, H * 0.58); g.lineTo(W * 0.3, H); g.lineTo(0, H); g.fill();
  for (const p of arms) { const a = p.a + t * (2.4 - p.r / 300) + p.r * 0.012, r = p.r * grow;
    g.fillStyle = `rgba(225,232,245,${0.3 + 0.5 * (1 - p.r / 450)})`; g.fillRect(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.75, p.s, p.s); }
  g.fillStyle = '#05070d'; g.beginPath(); g.ellipse(cx, cy, 34 * grow, 26 * grow, 0, 0, 6.283); g.fill();
  g.strokeStyle = rgba(ACCENT, 0.7); g.lineWidth = 4; g.beginPath(); g.ellipse(cx, cy, 44 * grow, 34 * grow, 0, 0, 6.283); g.stroke();
  g.strokeStyle = 'rgba(180,200,230,0.35)'; g.lineWidth = 2; g.beginPath();
  for (let i = 0; i < 120; i++) { const x = (i * 97 + t * 900) % (W + 200) - 100, y = (i * 61) % (H * 0.55); g.moveTo(x, y); g.lineTo(x - 30, y + 14); } g.stroke();
  fadeBottom(g);
};
