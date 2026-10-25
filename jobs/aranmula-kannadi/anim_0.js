// Cover: the globe spins and zooms to Aranmula, Kerala; then the mirror fades in
const LAT = 9.33, LON = 76.69;
const gl = makeCanvas(), top2 = makeCanvas(), g = top2.getContext('2d');
const renderer = new THREE.WebGLRenderer({canvas: gl, antialias: true, preserveDrawingBuffer: true}); renderer.setSize(W, H, false);
const scene = new THREE.Scene(); const cam = new THREE.PerspectiveCamera(32, W / H, 0.1, 100);
const tex = new THREE.Texture(document.getElementById('earthTex')); tex.needsUpdate = true;
const earth = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 64), new THREE.MeshPhongMaterial({map: tex, shininess: 12}));
const halo = new THREE.Mesh(new THREE.SphereGeometry(1.06, 64, 48), new THREE.MeshBasicMaterial({color: 0x5aa8ff, transparent: true, opacity: 0.12, side: THREE.BackSide}));
const globe = new THREE.Group(); globe.add(earth); scene.add(globe); scene.add(halo);
scene.add(new THREE.AmbientLight(0x8090a0, 0.9)); const sun = new THREE.DirectionalLight(0xffffff, 1.0); sun.position.set(-3, 2, 5); scene.add(sun);
const stars = Array.from({length: 180}, () => [rand() * W, rand() * H, rand()]);
const lonRot = -(LON + 90) * Math.PI / 180, latRot = LAT * Math.PI / 180;
// the 2D mirror (drawn on the top canvas)
function mirror(x, y, s, t, shine) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = '#8a5a20'; g.fillRect(-18, 190, 36, 120); g.beginPath(); g.ellipse(0, 320, 110, 26, 0, 0, 6.283); g.fill();
  const fr = g.createLinearGradient(-200, -260, 200, 260); fr.addColorStop(0, '#f2c14e'); fr.addColorStop(0.5, '#a8721e'); fr.addColorStop(1, '#f2d27a');
  g.fillStyle = fr; g.beginPath(); g.ellipse(0, 0, 200, 250, 0, 0, 6.283); g.fill();
  for (let i = 0; i < 16; i++) { const a = i / 16 * 6.283; g.fillStyle = '#c8902e'; g.beginPath(); g.arc(Math.cos(a) * 214, Math.sin(a) * 264, 14, 0, 6.283); g.fill(); }
  g.save(); g.beginPath(); g.ellipse(0, 0, 165, 215, 0, 0, 6.283); g.clip();
  const sf = g.createLinearGradient(-165, -215, 165, 215); sf.addColorStop(0, '#d8dce4'); sf.addColorStop(0.5, '#8a909a'); sf.addColorStop(1, '#e8ecf2'); g.fillStyle = sf; g.fillRect(-170, -220, 340, 440);
  const sx = ((t * 0.5) % 1.6 - 0.3) * 500; const sh = g.createLinearGradient(sx - 80, -220, sx + 80, 220); sh.addColorStop(0, 'rgba(255,255,255,0)'); sh.addColorStop(0.5, `rgba(255,255,255,${0.7 * shine})`); sh.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = sh; g.fillRect(-170, -220, 340, 440); g.restore(); g.restore();
}
window.renderFrame = function (t) {
  const k = clamp(t / (DURATION * 0.45)), z = lerp(6.2, 2.15, ease.inOut(k));
  globe.rotation.set(latRot * ease.inOut(k), lonRot + (1 - ease.inOut(k)) * 1.6, 0);
  cam.position.set(0, 0, z); cam.lookAt(0, 0, 0);
  renderer.setClearColor(0x03060c, 1); renderer.render(scene, cam);
  g.clearRect(0, 0, W, H);
  if (k < 1) { for (const s of stars) { g.fillStyle = `rgba(255,255,255,${0.25 + 0.5 * s[2]})`; g.fillRect(s[0], s[1], 2, 2); } }
  if (k > 0.75) { const p = (t * 1.2) % 1; g.strokeStyle = rgba(ACCENT, (1 - p)); g.lineWidth = 5; g.beginPath(); g.arc(W / 2, H / 2, 14 + p * 70, 0, 6.283); g.stroke();
    g.fillStyle = ACCENT; g.beginPath(); g.arc(W / 2, H / 2, 12, 0, 6.283); g.fill(); }
  const m = ease.inOut(clamp((t / DURATION - 0.5) / 0.18));
  if (m > 0) { g.fillStyle = `rgba(20,6,10,${0.92 * m})`; g.fillRect(0, 0, W, H);
    const glow = g.createRadialGradient(W / 2, H * 0.34, 40, W / 2, H * 0.34, 560); glow.addColorStop(0, rgba(ACCENT, 0.3 * m)); glow.addColorStop(1, rgba(ACCENT, 0)); g.fillStyle = glow; g.fillRect(0, 0, W, H);
    g.globalAlpha = m; mirror(W / 2, H * 0.34 + (1 - m) * 60, 1.2, t, 0.9); g.globalAlpha = 1; }
};
