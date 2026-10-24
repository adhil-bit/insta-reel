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
const hz = H * 0.34, vx = W / 2;
const bg = layer(x => { const s = x.createLinearGradient(0, 0, 0, H); s.addColorStop(0, '#0a0c12'); s.addColorStop(0.32, '#3a3430'); s.addColorStop(0.5, '#1a1612'); s.addColorStop(1, '#040302');
  x.fillStyle = s; x.fillRect(0, 0, W, H);
  hill(x, hz, 60, 0.005, 2, '#262624'); });
const mist = Array.from({length: 10}, () => ({x: rand() * W, y: hz + rand() * 120, r: 180 + rand() * 180, s: 6 + rand() * 10}));
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.9));
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  // sleepers and rusty rails in perspective, overgrown with grass
  const bottom = H * 0.66;
  for (let i = 0; i < 26; i++) { const f = Math.pow(i / 25, 2.2), y = lerp(hz, bottom, f), w = lerp(30, 640, f);
    g.fillStyle = `rgba(60,44,30,${0.4 + 0.6 * f})`; g.fillRect(vx - w / 2, y, w, 4 + 14 * f); }
  g.strokeStyle = '#7a4a2a'; g.lineWidth = 6;
  for (const side of [-1, 1]) { g.beginPath(); g.moveTo(vx + side * 8, hz); g.lineTo(vx + side * 250, bottom); g.stroke(); }
  g.strokeStyle = 'rgba(90,120,60,0.6)'; g.lineWidth = 3;
  for (let i = 0; i < 40; i++) { const f = (i * 0.618) % 1, y = lerp(hz + 20, bottom, f * f), x = vx + (i % 2 ? 1 : -1) * lerp(20, 330, f * f);
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.sin(t + i) * 4, y - 14 - 20 * f); g.stroke(); }
  // ghost train receding into the mist
  const go = ease.inOut(k), s = lerp(1.25, 0.12, go), y = lerp(H * 0.6, hz + 6, go);
  g.save(); g.globalAlpha = (1 - go * 0.9) * 0.8;
  g.translate(vx, y); g.scale(s, s);
  // front view of a small steam engine, drawn as a glowing ghost
  g.fillStyle = rgba(ACCENT, 0.25); g.strokeStyle = rgba(ACCENT, 0.95); g.lineWidth = 6;
  g.beginPath(); g.roundRect(-150, -330, 300, 150, 16); g.fill(); g.stroke();          // cab behind
  g.beginPath(); g.arc(0, -180, 115, 0, 6.283); g.fill(); g.stroke();                   // boiler face
  g.beginPath(); g.roundRect(-28, -390, 56, 110, 8); g.fill(); g.stroke();              // chimney
  g.beginPath(); g.rect(-170, -60, 340, 34); g.fill(); g.stroke();                       // buffer beam
  for (const x of [-120, 120]) { g.beginPath(); g.arc(x, -10, 32, 0, 6.283); g.stroke(); }
  g.fillStyle = '#fff3d0'; g.shadowColor = ACCENT; g.shadowBlur = 40;
  g.beginPath(); g.arc(0, -180, 30, 0, 6.283); g.fill(); g.shadowBlur = 0;
  g.restore();
  for (const m of mist) puff(g, (m.x + t * m.s) % (W + 360) - 180, m.y, m.r, 0.12);
};
