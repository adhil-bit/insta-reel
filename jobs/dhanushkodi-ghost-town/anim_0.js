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
const shore = H * 0.5;
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, shore); s.addColorStop(0, '#070a14'); s.addColorStop(1, '#2a2a3a'); x.fillStyle = s; x.fillRect(0, 0, W, H);
  x.fillStyle = '#e8e6f0'; x.beginPath(); x.arc(W * 0.78, H * 0.12, 50, 0, 6.283); x.fill();
  const sd = x.createLinearGradient(0, shore, 0, H * 0.8); sd.addColorStop(0, '#5a4c3a'); sd.addColorStop(1, '#05070b'); x.fillStyle = sd; x.fillRect(0, shore, W, H); });
const clouds = Array.from({length: 10}, () => ({x: rand() * W, y: rand() * H * 0.2, r: 160 + rand() * 200, s: 6 + rand() * 12}));
window.renderFrame = function (t) {
  const k = clamp(t / DURATION);
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  const fl = Math.max(0, 1 - Math.abs(((t * 0.35) % 1) - 0.5) * 30);
  if (fl > 0) { g.fillStyle = `rgba(210,220,255,${0.25 * fl})`; g.fillRect(0, 0, W, shore); }
  for (const cl of clouds) { const x = (cl.x + t * cl.s) % (W + 400) - 200, gr = g.createRadialGradient(x, cl.y, 0, x, cl.y, cl.r);
    gr.addColorStop(0, 'rgba(60,64,84,0.75)'); gr.addColorStop(1, 'rgba(20,22,30,0)'); g.fillStyle = gr; g.beginPath(); g.arc(x, cl.y, cl.r, 0, 6.283); g.fill(); }
  sea(g, shore - 50 + Math.sin(t) * 6, 12, t, 1.4, '#1c3a52', 0, W);
  const sd = g.createLinearGradient(0, shore, 0, H * 0.8); sd.addColorStop(0, '#5a4c3a'); sd.addColorStop(1, '#05070b');
  g.fillStyle = sd; g.beginPath(); g.moveTo(0, H); g.lineTo(0, shore); g.quadraticCurveTo(W / 2, shore - 30, W, shore + 10); g.lineTo(W, H); g.fill();
  const gl = g.createRadialGradient(W / 2, shore - 120, 10, W / 2, shore - 120, 380); gl.addColorStop(0, rgba(ACCENT, 0.3)); gl.addColorStop(1, rgba(ACCENT, 0)); g.fillStyle = gl; g.fillRect(0, 0, W, H);
  ruin(g, W / 2, shore + 20, 1.5, '#0b0b0f');
  g.strokeStyle = 'rgba(255,255,255,0.35)'; g.lineWidth = 3;
  for (let i = 0; i < 6; i++) { const x = ((i * 190 + t * 60) % (W + 100)) - 50; g.beginPath(); g.moveTo(x, shore - 40); g.lineTo(x + 60, shore - 38); g.stroke(); }
};
