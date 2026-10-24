const layer = f => { const l = document.createElement('canvas'); l.width = W; l.height = H; f(l.getContext('2d')); return l; };
function ridge(x, base, amp, f, ph) { return base - amp * (0.6 * Math.sin(x * f + ph) + 0.3 * Math.sin(x * f * 2.3 + ph * 1.7) + 0.1 * Math.sin(x * f * 5.1)); }
function hill(g, base, amp, f, ph, fill, shift = 0) {
  g.fillStyle = fill; g.beginPath(); g.moveTo(0, H);
  for (let x = 0; x <= W; x += 10) g.lineTo(x, ridge(x + shift, base, amp, f, ph));
  g.lineTo(W, H); g.closePath(); g.fill();
}
function puff(g, x, y, r, a) { const gr = g.createRadialGradient(x, y, 0, x, y, r);
  gr.addColorStop(0, `rgba(220,225,235,${a})`); gr.addColorStop(1, 'rgba(220,225,235,0)'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 6.283); g.fill(); }
// a small hill-railway steam engine with tea wagons, facing right; (x, y) = rail level under the engine
function train(g, x, y, s, t, lamp, smokeT) {
  g.save(); g.translate(x, y); g.scale(s, s);
  for (let w = 1; w <= 3; w++) {                      // wagons with tea sacks
    const wx = -w * 120;
    g.fillStyle = '#4a3423'; g.fillRect(wx - 50, -58, 100, 40);
    g.fillStyle = '#7a5a3a'; for (let i = 0; i < 3; i++) { g.beginPath(); g.ellipse(wx - 30 + i * 30, -64, 16, 11, 0, 0, 6.283); g.fill(); }
    g.fillStyle = '#151515'; for (const d of [-30, 30]) { g.beginPath(); g.arc(wx + d, -12, 12, 0, 6.283); g.fill(); }
    g.fillStyle = '#2a2a2a'; g.fillRect(wx - 60, -24, 10, 4);
  }
  g.fillStyle = '#23272e'; g.fillRect(-58, -96, 46, 76);               // cab
  g.fillStyle = '#3a414c'; g.fillRect(-66, -104, 62, 10);
  g.fillStyle = lamp ? '#ffd27a' : '#5a6270'; g.fillRect(-48, -86, 24, 20);   // cab window
  g.fillStyle = '#2f353f'; g.beginPath(); g.roundRect(-14, -74, 96, 50, 22); g.fill();   // boiler
  g.fillStyle = '#1c2026'; g.fillRect(52, -110, 18, 40);              // chimney
  g.fillRect(46, -116, 30, 8);
  g.fillStyle = '#151515'; for (const d of [-36, 6, 46]) { g.beginPath(); g.arc(d, -14, 16, 0, 6.283); g.fill();
    g.strokeStyle = '#555'; g.lineWidth = 3; const a = t * 6; g.beginPath(); g.moveTo(d, -14); g.lineTo(d + Math.cos(a) * 12, -14 + Math.sin(a) * 12); g.stroke(); }
  if (lamp) { g.fillStyle = '#ffe9a8'; g.beginPath(); g.arc(86, -54, 9, 0, 6.283); g.fill(); }
  g.restore();
  if (lamp) {                                          // headlamp beam
    const bx = x + 86 * s, by = y - 54 * s;
    const gr = g.createRadialGradient(bx, by, 0, bx, by, 260 * s);
    gr.addColorStop(0, rgba(ACCENT, 0.55 * lamp)); gr.addColorStop(1, rgba(ACCENT, 0));
    g.fillStyle = gr; g.beginPath(); g.moveTo(bx, by); g.lineTo(bx + 300 * s, by - 90 * s); g.lineTo(bx + 300 * s, by + 90 * s); g.closePath(); g.fill();
  }
  for (let i = 0; i < 7; i++) {                       // smoke trail drifting back
    const p = ((smokeT * 0.9) + i / 7) % 1;
    puff(g, x + (61 - p * 260) * s, y - (118 + p * 140) * s, (16 + p * 60) * s, 0.5 * (1 - p));
  }
}
const c = makeCanvas(), g = c.getContext('2d');
const trackY = H * 0.45;
const sky = layer(x => { const s = x.createLinearGradient(0, 0, 0, H * 0.6); s.addColorStop(0, '#0a0d18'); s.addColorStop(0.7, '#3a2a2a'); s.addColorStop(1, '#5a3a28');
  x.fillStyle = s; x.fillRect(0, 0, W, H);
  const sun = x.createRadialGradient(W * 0.7, H * 0.33, 10, W * 0.7, H * 0.33, 400); sun.addColorStop(0, 'rgba(255,170,90,0.6)'); sun.addColorStop(1, 'rgba(255,170,90,0)');
  x.fillStyle = sun; x.fillRect(0, 0, W, H);
  hill(x, H * 0.36, 90, 0.004, 1, '#2a2430'); hill(x, H * 0.41, 70, 0.006, 3, '#1f2a24'); });
const mist = Array.from({length: 9}, () => ({x: rand() * W, y: H * (0.38 + rand() * 0.1), r: 160 + rand() * 160, s: 10 + rand() * 20}));
window.renderFrame = function (t) {
  const k = clamp(t / DURATION);
  g.globalAlpha = 1; g.drawImage(sky, 0, 0);
  for (const m of mist) puff(g, (m.x + t * m.s) % (W + 300) - 150, m.y, m.r, 0.18);
  // near hill with tea rows, track along its shoulder
  hill(g, trackY + 30, 20, 0.003, 0.5, '#15241a');
  g.strokeStyle = 'rgba(80,140,80,0.35)'; g.lineWidth = 6;
  for (let r = 1; r < 9; r++) { g.beginPath(); for (let x = 0; x <= W; x += 20) { const y = trackY + 40 + r * r * 6 + Math.sin(x * 0.01 + r) * 6; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
  g.fillStyle = '#3a2c20'; g.fillRect(0, trackY, W, 10);
  g.strokeStyle = '#8a8f99'; g.lineWidth = 3; g.beginPath(); g.moveTo(0, trackY); g.lineTo(W, trackY); g.stroke();
  for (let x = (-t * 0) % 30; x < W; x += 30) { g.fillStyle = '#2a2018'; g.fillRect(x, trackY + 2, 16, 8); }
  const tx = lerp(-260, W * 0.78, ease.out(clamp(k * 1.15)));
  train(g, tx, trackY, 1.35, t, ease.inOut(clamp(k * 2 - 0.3)), t);
};
