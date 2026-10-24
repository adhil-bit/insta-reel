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
const trackY = H * 0.42;
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#06080e'); s.addColorStop(0.45, '#1a2230'); s.addColorStop(1, '#03050a'); x.fillStyle = s; x.fillRect(0, 0, W, H);
  const sd = x.createLinearGradient(0, trackY, 0, H * 0.7); sd.addColorStop(0, '#4a4030'); sd.addColorStop(1, '#05070b'); x.fillStyle = sd; x.fillRect(0, trackY, W, H); });
function train(x) { for (let i = 0; i < 4; i++) { const cx = x - i * 210; g.fillStyle = i ? '#3a4452' : '#2a323e'; g.fillRect(cx - 95, trackY - 110, 190, 96);
    g.fillStyle = 'rgba(255,214,140,0.85)'; for (let w = 0; w < 4; w++) g.fillRect(cx - 80 + w * 44, trackY - 96, 28, 26);
    g.fillStyle = '#111'; for (const d of [-60, 60]) { g.beginPath(); g.arc(cx + d, trackY - 10, 14, 0, 6.283); g.fill(); } }
  g.fillStyle = '#ffe9a8'; g.beginPath(); g.arc(x + 95, trackY - 50, 10, 0, 6.283); g.fill(); }
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.9));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  g.strokeStyle = '#8a8f99'; g.lineWidth = 4; g.beginPath(); g.moveTo(0, trackY); g.lineTo(W, trackY); g.stroke();
  const fade = clamp((k - 0.62) * 4);
  g.globalAlpha = 1 - fade; train(lerp(150, W * 0.8, ease.out(clamp(k * 1.6)))); g.globalAlpha = 1;
  const wv = ease.inOut(clamp((k - 0.35) / 0.4)), wx = lerp(-W * 0.6, W * 1.3, wv), crest = H * 0.18;
  if (wv > 0 && wv < 1) { const gr = g.createLinearGradient(wx - 600, 0, wx, 0); gr.addColorStop(0, 'rgba(20,50,80,0.95)'); gr.addColorStop(1, 'rgba(70,120,160,0.95)');
    g.fillStyle = gr; g.beginPath(); g.moveTo(wx - 1400, H * 0.62); g.lineTo(wx - 1400, crest + 80); g.quadraticCurveTo(wx - 300, crest - 20, wx, crest + 60);
    g.quadraticCurveTo(wx + 80, crest + 160, wx + 40, H * 0.62); g.fill();
    g.strokeStyle = 'rgba(240,248,255,0.8)'; g.lineWidth = 8; g.beginPath(); g.moveTo(wx - 700, crest + 40); g.quadraticCurveTo(wx - 300, crest - 20, wx, crest + 60); g.stroke(); }
  if (wv >= 1) sea(g, trackY - 30, 12, t, 1.8, 'rgba(24,60,90,0.92)');
  if (fade > 0) { const p = (t * 0.7) % 1; g.strokeStyle = rgba(ACCENT, fade * (1 - p)); g.lineWidth = 5; g.beginPath(); g.arc(W * 0.55, trackY - 40, 30 + p * 120, 0, 6.283); g.stroke(); }
  fadeBottom(g);
};
