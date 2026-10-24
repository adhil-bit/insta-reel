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
const cx = W / 2, cy = H * 0.36;
const bg = layer(x => { x.fillStyle = '#020208'; x.fillRect(0, 0, W, H);
  const n = x.createRadialGradient(W * 0.3, H * 0.25, 10, W * 0.3, H * 0.25, 600); n.addColorStop(0, 'rgba(120,40,90,0.35)'); n.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = n; x.fillRect(0, 0, W, H); });
const stars = Array.from({length: 320}, () => ({x: rand() * W, y: rand() * H * 0.75, z: rand()}));
const cells = Array.from({length: 26}, () => ({a: rand() * 6.283, d: 40 + rand() * 120, r: 14 + rand() * 18, s: 0.4 + rand() * 0.6}));
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.88)), out = ease.inOut(k);
  g.globalAlpha = 1; g.drawImage(bg, 0, 0);
  for (const s of stars) { const y = (s.y + t * 30 * s.z) % (H * 0.75); g.fillStyle = `rgba(220,225,255,${0.3 + 0.6 * s.z})`; g.fillRect(s.x, y, 1 + 2 * s.z, 1 + 2 * s.z); }
  // comet
  const cxm = lerp(W + 200, -300, ease.inOut(clamp((k - 0.2) / 0.7))), cym = lerp(H * 0.08, H * 0.3, ease.inOut(clamp((k - 0.2) / 0.7)));
  const tl = g.createLinearGradient(cxm, cym, cxm + 420, cym - 120); tl.addColorStop(0, 'rgba(200,230,255,0.9)'); tl.addColorStop(1, 'rgba(200,230,255,0)');
  g.fillStyle = tl; g.beginPath(); g.moveTo(cxm, cym - 10); g.lineTo(cxm + 420, cym - 150); g.lineTo(cxm + 420, cym - 70); g.lineTo(cxm, cym + 10); g.fill();
  g.fillStyle = '#fff'; g.beginPath(); g.arc(cxm, cym, 10, 0, 6.283); g.fill();
  // cells spiral outward from the centre and glow like strange life
  for (const cl of cells) {
    const a = cl.a + t * 0.4 * cl.s, d = cl.d + out * 300;
    const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d * 0.8;
    const gl = g.createRadialGradient(x, y, 0, x, y, cl.r * 3); gl.addColorStop(0, rgba(ACCENT, 0.5)); gl.addColorStop(1, rgba(ACCENT, 0));
    g.fillStyle = gl; g.beginPath(); g.arc(x, y, cl.r * 3, 0, 6.283); g.fill();
    g.fillStyle = ACCENT; g.beginPath(); g.arc(x, y, cl.r, 0, 6.283); g.fill();
    g.fillStyle = 'rgba(80,0,15,0.6)'; g.beginPath(); g.arc(x + cl.r * 0.2, y, cl.r * 0.35, 0, 6.283); g.fill();
  }
  // a pulsing question ring in the centre
  const p = (t * 0.8) % 1; g.strokeStyle = rgba(ACCENT, (1 - p) * 0.8); g.lineWidth = 4;
  g.beginPath(); g.arc(cx, cy, 30 + p * 220, 0, 6.283); g.stroke();
};
