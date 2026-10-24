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
const hz = H * 0.42;
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, hz); s.addColorStop(0, '#1a1428'); s.addColorStop(0.6, '#a04a3a'); s.addColorStop(1, '#f0a050'); x.fillStyle = s; x.fillRect(0, 0, W, H); });
const birds = Array.from({length: 6}, () => ({x: rand() * W, y: H * 0.1 + rand() * H * 0.15, s: 0.6 + rand() * 0.5, p: rand() * 6}));
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.9));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  const sy = lerp(hz - 160, hz + 20, ease.inOut(k));
  g.save(); g.beginPath(); g.rect(0, 0, W, hz); g.clip(); g.fillStyle = '#ffd08a'; g.beginPath(); g.arc(W * 0.62, sy, 120, 0, 6.283); g.fill(); g.restore();
  sea(g, hz, 6, t, 1.2, '#3a2a40');
  g.fillStyle = 'rgba(255,200,130,0.5)'; for (let i = 0; i < 10; i++) g.fillRect(W * 0.62 - 90 + Math.sin(t * 2 + i) * 20, hz + 20 + i * 24, 180 - i * 14, 5);
  const sd = g.createLinearGradient(0, H * 0.5, 0, H * 0.8); sd.addColorStop(0, '#2a1e1a'); sd.addColorStop(1, '#05070b');
  g.fillStyle = sd; g.beginPath(); g.moveTo(0, H); g.lineTo(0, H * 0.52); g.quadraticCurveTo(W * 0.5, H * 0.48, W, H * 0.54); g.lineTo(W, H); g.fill();
  ruin(g, W * 0.3, H * 0.53, 1.0, '#0a0708'); ruin(g, W * 0.78, H * 0.54, 0.55, '#0a0708');
  g.strokeStyle = '#120c0c'; g.lineWidth = 3;
  for (const b of birds) { const x = (b.x + t * 40 * b.s) % (W + 80) - 40, f = Math.sin(t * 5 * b.s + b.p) * 9;
    g.beginPath(); g.moveTo(x - 16, b.y - f); g.quadraticCurveTo(x - 6, b.y - 3, x, b.y); g.quadraticCurveTo(x + 6, b.y - 3, x + 16, b.y - f); g.stroke(); }
};
