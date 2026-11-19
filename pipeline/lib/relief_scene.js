// Relief fly-in: whole of Kerala -> down to the town. Needs RL (config) and the rl_* <img> tags.
const c = makeCanvas(), g = c.getContext('2d');
const KX = 111.32 * Math.cos(RL.lat * Math.PI / 180), KY = 110.57;          // km per degree
const wx = lon => (lon - RL.lon) * KX, wz = lat => -(lat - RL.lat) * KY;
const sm = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
let S = null;

function heights(img) {
  const k = document.createElement('canvas'); k.width = img.naturalWidth; k.height = img.naturalHeight;
  const x = k.getContext('2d'); x.drawImage(img, 0, 0); return { w: k.width, h: k.height, d: x.getImageData(0, 0, k.width, k.height).data };
}
function plane(texId, hId, b, y0) {
  const tex = new THREE.Texture(document.getElementById(texId)); tex.needsUpdate = true;
  tex.encoding = THREE.sRGBEncoding; tex.anisotropy = 8; tex.minFilter = THREE.LinearMipmapLinearFilter;
  const hm = heights(document.getElementById(hId));
  const wkm = (b[2] - b[0]) * KX, hkm = (b[3] - b[1]) * KY;
  const geo = new THREE.PlaneGeometry(wkm, hkm, hm.w - 1, hm.h - 1); geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const u = i % hm.w, v = Math.floor(i / hm.w);
    pos.setY(i, hm.d[(v * hm.w + u) * 4] / 255 * 2.8);
  }
  geo.translate(wx((b[0] + b[2]) / 2), 0, wz((b[1] + b[3]) / 2));
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 1, depthWrite: true });
  return new THREE.Mesh(geo, mat);
}
function init() {
  const gl = document.createElement('canvas'); gl.width = W; gl.height = H;
  const r = new THREE.WebGLRenderer({ canvas: gl, antialias: true, preserveDrawingBuffer: true });
  r.setSize(W, H, false); r.outputEncoding = THREE.sRGBEncoding;
  const sc = new THREE.Scene();
  const bg = RL.ink ? 0xefe6d2 : 0x06111c; sc.background = new THREE.Color(bg); sc.fog = new THREE.Fog(bg, 400, 1600);
  const wide = plane('rl_wide', 'rl_wideh', RL.wide, 0);
  const near = plane('rl_near', 'rl_nearh', RL.near, 0.05); near.material.opacity = 0; near.renderOrder = 2; near.material.depthTest = false; near.material.depthWrite = false;
  sc.add(wide); sc.add(near);
  const cam = new THREE.PerspectiveCamera(38, W / H, 0.05, 5000);
  S = { r, gl, sc, cam, wide, near, bg };
}

function camAt(t) {
  const D = DURATION, p = ease.inOut(clamp(t / (D * 0.78)));
  const kx = wx(RL.kerala[1]), kz = wz(RL.kerala[0]);
  const tx = lerp(kx, 0, ease.inOut(clamp(p * 1.15))), tz = lerp(kz, 0, ease.inOut(clamp(p * 1.15)));
  const d = Math.exp(lerp(Math.log(1000), Math.log(16), p)) * (1 - 0.06 * clamp((t - D * 0.78) / (D * 0.22)));
  const pitch = lerp(80, 48, ease.inOut(p)) * Math.PI / 180, yaw = lerp(-8, 14, p) * Math.PI / 180 + 0.01 * t;
  return { tx, tz, d, pitch, yaw, p };
}

function chip(s, x, y, size, fg, bgc, a) {
  if (a <= 0 || !s) return; g.save(); g.globalAlpha = a; g.font = `700 ${size}px Inter`; const w = g.measureText(s).width + size * 1.1;
  g.fillStyle = bgc; g.fillRect(x - w / 2, y - size * 0.95, w, size * 1.6); g.strokeStyle = fg; g.lineWidth = 2; g.strokeRect(x - w / 2 + 4, y - size * 0.95 + 4, w - 8, size * 1.6 - 8);
  g.fillStyle = fg; g.textAlign = 'center'; g.fillText(s, x, y + size * 0.3); g.restore();
}

window.renderFrame = function (t) {
  if (!S) init();
  const D = DURATION, C = camAt(t), { cam } = S;
  const hy = 0.6;
  cam.position.set(C.tx + C.d * Math.cos(C.pitch) * Math.sin(C.yaw), hy + C.d * Math.sin(C.pitch), C.tz + C.d * Math.cos(C.pitch) * Math.cos(C.yaw));
  cam.lookAt(C.tx, hy, C.tz);
  S.near.material.opacity = sm(150, 70, C.d);
  const ex = lerp(1.6, RL.exag, sm(30, 400, C.d)); S.wide.scale.y = ex; S.near.scale.y = ex; S.near.position.y = 0.05;
  S.sc.fog.near = C.d * 1.1; S.sc.fog.far = C.d * 3.2;
  S.r.render(S.sc, cam);
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#' + S.bg.toString(16).padStart(6, '0'); g.fillRect(0, 0, W, H); g.restore();
  g.drawImage(S.gl, 0, 0);

  const gold = RL.ink ? '#7a2e1f' : '#F5C542', ink = RL.ink ? '#2a1d14' : '#ffffff', panel = RL.ink ? 'rgba(243,234,214,0.92)' : 'rgba(6,10,18,0.78)';
  // "KERALA" label while we are high up
  const ka = 1 - sm(0.25, 0.45, C.p);
  if (ka > 0) {
    const v = new THREE.Vector3(wx(RL.kerala[1] + 0.35), 1, wz(RL.kerala[0] - 0.4)).project(cam);
    g.save(); g.globalAlpha = ka; g.font = '800 64px Inter'; g.textAlign = 'center'; g.fillStyle = gold;
    if (g.letterSpacing !== undefined) g.letterSpacing = '14px';
    g.fillText('KERALA', (v.x + 1) / 2 * W, (1 - v.y) / 2 * H); g.restore();
  }
  // pin on the town
  const v = new THREE.Vector3(0, hy * 0.3 + 0.1, 0).project(cam);
  const px = (v.x + 1) / 2 * W, py = (1 - v.y) / 2 * H;
  const pa = sm(0.55, 0.72, C.p);
  if (pa > 0) {
    const drop = (1 - ease.out(sm(0.55, 0.75, C.p))) * 160;
    for (let k = 0; k < 2; k++) {                                     // pulse rings
      const q = ((t * 0.8 + k * 0.5) % 1);
      g.save(); g.globalAlpha = pa * (1 - q) * 0.8; g.strokeStyle = gold; g.lineWidth = 4;
      g.beginPath(); g.ellipse(px, py, 20 + q * 90, (20 + q * 90) * 0.42, 0, 0, 6.283); g.stroke(); g.restore();
    }
    g.save(); g.globalAlpha = pa; g.translate(px, py - drop); g.fillStyle = gold;
    g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(-34, -40, -40, -66, -40, -84); g.arc(0, -84, 40, Math.PI, 0); g.bezierCurveTo(40, -66, 34, -40, 0, 0); g.fill();
    g.fillStyle = RL.ink ? '#f3ead6' : '#0a1220'; g.beginPath(); g.arc(0, -84, 15, 0, 6.283); g.fill(); g.restore();
  }
  // callout: leader line + box with kicker, town (Malayalam), district
  const ca = sm(0.68, 0.85, C.p);
  if (ca > 0 && RL.town) {
    const bx = clamp(px + 60, 180, W - 330), by = clamp(py - 330, 330, H - 700);
    g.save(); g.globalAlpha = ca; g.strokeStyle = gold; g.lineWidth = 3;
    const k = ease.out(ca);
    g.beginPath(); g.moveTo(px, py - 130); g.lineTo(lerp(px, bx, k), lerp(py - 130, by + 70, k)); g.stroke();
    g.font = '800 76px Baloo'; const tw = Math.max(g.measureText(RL.town).width, 260) + 70;
    g.fillStyle = panel; g.fillRect(bx, by - 70, tw, 205); g.strokeStyle = gold; g.lineWidth = 2; g.strokeRect(bx + 6, by - 64, tw - 12, 193);
    g.fillStyle = gold; g.font = '700 26px Inter'; g.textAlign = 'left'; g.fillText(RL.kicker, bx + 30, by - 22);
    g.fillStyle = ink; g.font = '800 76px Baloo'; g.fillText(RL.town, bx + 30, by + 62);
    if (RL.district) { g.fillStyle = gold; g.font = '600 24px Inter'; g.fillText(RL.district, bx + 30, by + 108); }
    g.restore();
  }
  // source line (always, small)
  g.save(); g.globalAlpha = 0.85; g.font = '600 21px Inter'; g.textAlign = 'center';
  const sw = g.measureText(RL.source).width + 30; g.fillStyle = panel; g.fillRect(W / 2 - sw / 2, 1612, sw, 36);
  g.fillStyle = gold; g.fillText(RL.source, W / 2, 1638); g.restore();
};
