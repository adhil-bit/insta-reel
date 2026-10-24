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
const base = H * 0.55;
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, base); s.addColorStop(0, '#2a2420'); s.addColorStop(1, '#6a5640'); x.fillStyle = s; x.fillRect(0, 0, W, H);
  const sd = x.createLinearGradient(0, base, 0, H * 0.8); sd.addColorStop(0, '#8a7454'); sd.addColorStop(1, '#05070b'); x.fillStyle = sd; x.fillRect(0, base, W, H);
  ruin(x, W * 0.18, base + 10, 0.6, '#2a221a'); ruin(x, W * 0.85, base + 10, 0.7, '#2a221a'); });
const grains = Array.from({length: 400}, () => ({y: rand() * H * 0.62, o: rand(), s: 0.5 + rand()}));
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.85));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  ruin(g, W / 2, base + 20, 1.35, '#15110d');
  const st = ease.inOut(k);
  g.strokeStyle = rgba(ACCENT, 0.85 * st); g.lineWidth = 8; g.beginPath(); g.moveTo(W / 2 - 260, base - 260); g.lineTo(lerp(W / 2 - 260, W / 2 + 260, st), lerp(base - 260, base + 20, st)); g.stroke();
  g.beginPath(); g.moveTo(W / 2 + 260, base - 260); g.lineTo(lerp(W / 2 + 260, W / 2 - 260, clamp(st * 1.3 - 0.3)), lerp(base - 260, base + 20, clamp(st * 1.3 - 0.3))); g.stroke();
  for (const p of grains) { const x = ((p.o * W * 1.5 + t * 220 * p.s) % (W + 100)) - 50; g.fillStyle = `rgba(220,190,140,${0.35 * p.s})`; g.fillRect(x, p.y + Math.sin(t * 2 + p.o * 9) * 10, 3, 2); }
};
