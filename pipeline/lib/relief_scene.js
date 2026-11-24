// Relief fly-in: Kerala -> the town. Needs RL (config) and the rl_* <img> tags. Spec: docs/design-methods.md.
const c = makeCanvas(), g = c.getContext('2d');
const KX = 111.32 * Math.cos(RL.lat * Math.PI / 180), KY = 110.57;          // km per degree
const wx = lon => (lon - RL.lon) * KX, wz = lat => -(lat - RL.lat) * KY;
const sm = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const GOLD = RL.ink ? '#7A2E1F' : '#F5C542', TXT = RL.ink ? '#2A1D14' : '#FFFFFF';
const PANEL = RL.ink ? 'rgba(239,230,210,0.92)' : 'rgba(6,10,18,0.78)', CHIPTXT = RL.ink ? '#EFE6D2' : '#0A1220';
const SEA = RL.ink ? 0xEFE6D2 : 0x050B14;
let S = null;

function heights(img) {
  const k = document.createElement('canvas'); k.width = img.naturalWidth; k.height = img.naturalHeight;
  const x = k.getContext('2d'); x.drawImage(img, 0, 0); return { w: k.width, h: k.height, d: x.getImageData(0, 0, k.width, k.height).data };
}
function tile(name, order) {
  const T = RL.tiles[name], b = T.b;
  const tex = new THREE.Texture(document.getElementById('rl_' + name)); tex.needsUpdate = true;
  tex.encoding = THREE.sRGBEncoding; tex.anisotropy = 8; tex.minFilter = THREE.LinearMipmapLinearFilter;
  const hm = heights(document.getElementById('rl_' + name + 'h'));
  const geo = new THREE.PlaneGeometry((b[2] - b[0]) * KX, (b[3] - b[1]) * KY, hm.w - 1, hm.h - 1); geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) pos.setY(i, hm.d[((Math.floor(i / hm.w)) * hm.w + i % hm.w) * 4] / 255 * T.hk);
  geo.translate(wx((b[0] + b[2]) / 2), 0, wz((b[1] + b[3]) / 2));
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: order > 0, opacity: order > 0 ? 0 : 1 });
  if (order > 0) { mat.depthTest = false; mat.depthWrite = false; }
  const m = new THREE.Mesh(geo, mat); m.renderOrder = order; m.userData = { hm, b, hk: T.hk }; return m;
}
function hAt(m, lon, lat) {                       // terrain height (km, before scale) under a point of a tile
  const { hm, b, hk } = m.userData, u = (lon - b[0]) / (b[2] - b[0]), v = (b[3] - lat) / (b[3] - b[1]);
  if (u < 0 || u > 1 || v < 0 || v > 1) return 0;
  return hm.d[(Math.round(v * (hm.h - 1)) * hm.w + Math.round(u * (hm.w - 1))) * 4] / 255 * hk;
}
function init() {
  const gl = document.createElement('canvas'); gl.width = W; gl.height = H;
  const r = new THREE.WebGLRenderer({ canvas: gl, antialias: true, preserveDrawingBuffer: true });
  r.setSize(W, H, false); r.outputEncoding = THREE.sRGBEncoding;
  const sc = new THREE.Scene(); sc.background = new THREE.Color(SEA); sc.fog = new THREE.Fog(SEA, 1000, 3000);
  const wide = tile('wide', 0), mid = tile('mid', 1), near = tile('near', 2);
  sc.add(wide); sc.add(mid); sc.add(near);
  const cam = new THREE.PerspectiveCamera(30, W / H, 0.05, 6000);
  cam.setViewOffset(W, H, 0, 140, W, H);           // the town sits at y≈820, not dead centre
  S = { r, gl, sc, cam, wide, mid, near };
}

// camera: 0-12% hold at 900 km, 12-62% log descent to 38 km, 62-100% slow orbit drift
function camAt(t) {
  const q = t / DURATION, dsc = ease.inOut(clamp((q - 0.12) / 0.5));
  const late = clamp((q - 0.62) / 0.38);
  const d = Math.max(30, q < 0.62 ? Math.exp(lerp(Math.log(1400), Math.log(38), dsc)) : lerp(38, 34, late));
  const pitch = (q < 0.62 ? lerp(62, 40, dsc) : 40) * Math.PI / 180;
  const yaw = (q < 0.62 ? lerp(-6, 18, dsc) : lerp(18, 24, late)) * Math.PI / 180;
  const k = ease.inOut(clamp(dsc * 1.25));
  return { tx: lerp(wx(RL.kerala[1]), 0, k), tz: lerp(wz(RL.kerala[0]), 0, k), d, pitch, yaw, q };
}
function scr(x, y, z) { const v = new THREE.Vector3(x, y, z).project(S.cam); return [(v.x + 1) / 2 * W, (1 - v.y) / 2 * H, v.z]; }
function spaced(s, x, y, px) {                     // letter-spaced text
  if (g.letterSpacing !== undefined) { g.letterSpacing = px + 'px'; g.fillText(s, x, y); g.letterSpacing = '0px'; return; }
  g.fillText(s, x, y);
}

window.renderFrame = function (t) {
  if (!S) init();
  const C = camAt(t), { cam } = S, q = C.q;
  const ex = lerp(1.0, RL.exag, sm(40, 400, C.d));
  S.wide.scale.y = ex; S.mid.scale.y = ex;
  S.mid.material.opacity = sm(300, 150, C.d); S.near.material.opacity = sm(120, 60, C.d);
  cam.position.set(C.tx + C.d * Math.cos(C.pitch) * Math.sin(C.yaw), C.d * Math.sin(C.pitch), C.tz + C.d * Math.cos(C.pitch) * Math.cos(C.yaw));
  cam.lookAt(C.tx, 0, C.tz);
  S.sc.fog.near = C.d * 1.2; S.sc.fog.far = C.d * 3.5;
  S.r.render(S.sc, cam);
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#' + SEA.toString(16).padStart(6, '0'); g.fillRect(0, 0, W, H); g.restore();
  g.drawImage(S.gl, 0, 0);
  const hz = m => (lon, lat) => hAt(m, lon, lat) * (m === S.near ? 1 : ex);

  // Kerala outline: drawn live so it can fade (wide view only)
  const oa = sm(70, 150, C.d);
  if (oa > 0) {
    const H0 = hz(S.wide), pts = RL.outline.map(p => scr(wx(p[0]), H0(p[0], p[1]) + 0.3, wz(p[1])));
    g.save(); g.lineJoin = 'round'; g.strokeStyle = GOLD; g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.closePath();
    if (!RL.ink) { g.globalAlpha = 0.35 * oa; g.lineWidth = 24; g.filter = 'blur(8px)'; g.stroke(); g.filter = 'none'; }
    g.globalAlpha = (RL.ink ? 0.25 : 1) * oa; g.lineWidth = RL.ink ? 10 : 5; g.stroke();
    if (RL.ink) { g.globalAlpha = oa; g.lineWidth = 3; g.stroke(); }
    g.restore();
  }
  // state label in the sea: കേരളം / KERALA · INDIA
  const la = 1 - sm(0.25, 0.35, q);
  if (la > 0) {
    const p = scr(wx(RL.kerala[1] - 1.3), 0, wz(RL.kerala[0]));
    g.save(); g.globalAlpha = la; g.textAlign = 'center'; g.fillStyle = TXT; g.font = '800 88px Baloo'; g.fillText('കേരളം', p[0], p[1]);
    g.fillStyle = GOLD; g.font = '600 24px Inter'; spaced('KERALA · INDIA', p[0], p[1] + 44, 8); g.restore();
  }
  // distance thread: nearest city -> town, dashed marching arc + counter chip (45-62%)
  const town = scr(0, hAt(S.near, RL.lon, RL.lat) + 0.05, 0);
  if (RL.road && RL.city && q > 0.40) {                // real road from the nearest town: glowing blue line + van (40-62%)
    const ta = ease.inOut(sm(0.40, 0.62, q)), Lr = RL.road.line, n = Math.max(2, Math.round(Lr.length * ta)), nb = RL.tiles.near.b;
    const hR = (lat, lon) => (lon > nb[0] && lon < nb[2] && lat > nb[1] && lat < nb[3]) ? hAt(S.near, lon, lat) : hAt(S.mid, lon, lat) * ex;
    const pts = []; for (let i = 0; i < n; i++) pts.push(scr(wx(Lr[i][1]), hR(Lr[i][0], Lr[i][1]) + 0.03, wz(Lr[i][0])));
    g.save(); g.lineJoin = 'round'; g.lineCap = 'round'; g.globalAlpha = 1 - sm(0.92, 1.0, q) * 0.4;
    g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]));
    g.strokeStyle = 'rgba(30,120,255,0.35)'; g.lineWidth = 24; g.stroke();
    g.strokeStyle = '#2f8bff'; g.lineWidth = 11; g.stroke(); g.strokeStyle = '#cfe6ff'; g.lineWidth = 3; g.stroke();
    const c0 = pts[0];
    g.fillStyle = '#fff'; g.strokeStyle = '#2f8bff'; g.lineWidth = 5; g.beginPath(); g.arc(c0[0], c0[1], 11, 0, 6.283); g.fill(); g.stroke();
    const onS = p => p[0] > 40 && p[0] < W - 40 && p[1] > 330 && p[1] < 1340, off = !onS(c0), e0 = off ? (pts.find(onS) || c0) : c0, la = 1 - sm(0.64, 0.70, q);
    if (off && e0 !== c0) { g.fillStyle = '#2f8bff'; g.beginPath(); g.arc(e0[0], e0[1], 9, 0, 6.283); g.fill(); }
    const lx = clamp(e0[0] + (e0[0] > W - 320 ? -360 : 22), 40, W - 320), ly = clamp(e0[1] + (off ? 50 : 0), 360, 1330);
    g.globalAlpha = la; g.shadowColor = 'rgba(0,0,0,0.9)'; g.shadowBlur = 12; g.fillStyle = '#fff'; g.textAlign = 'left';
    g.font = '800 30px Inter'; spaced((off ? 'FROM ' : '') + (RL.city.en || ''), lx, ly - 6, 3); g.font = '700 30px Baloo'; g.fillText(RL.city.name, lx, ly + 30); g.shadowColor = 'transparent'; g.globalAlpha = 1 - sm(0.92, 1.0, q) * 0.4;
    if (ta < 0.995) {
      const a1 = pts[pts.length - 1], a0 = pts[Math.max(0, pts.length - 5)], ang = Math.atan2(a1[1] - a0[1], a1[0] - a0[0]);
      g.save(); g.translate(a1[0], a1[1]); g.rotate(ang); g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 14;
      g.fillStyle = '#f4f6f8'; g.beginPath(); g.roundRect(-32, -17, 64, 34, 9); g.fill(); g.shadowColor = 'transparent';
      g.fillStyle = '#25384d'; g.beginPath(); g.roundRect(10, -13, 15, 26, 4); g.fill(); g.fillStyle = '#2f8bff'; g.fillRect(-26, -3, 30, 6); g.restore();
    }
    const kmS = (RL.road.km * ta).toFixed(1) + ' km by road'; g.font = '800 38px Inter'; const kw = g.measureText(kmS).width + 48;
    g.fillStyle = 'rgba(8,16,28,0.78)'; g.beginPath(); g.roundRect(60, 1200, kw, 60, 30); g.fill();
    g.fillStyle = '#2f8bff'; g.beginPath(); g.arc(88, 1230, 8, 0, 6.283); g.fill(); g.fillStyle = '#fff'; g.fillText(kmS, 108, 1243);
    g.restore();
  } else if (RL.city && q > 0.45) {
    const ta = sm(0.45, 0.62, q), N = 48, Hm = hz(C.d < 120 ? S.mid : S.wide), cx = wx(RL.city.lon), cz = wz(RL.city.lat);
    const lift = 0.12 * RL.city.km, pts = [];
    for (let i = 0; i <= Math.round(N * ta); i++) {
      const s = i / N, lon = lerp(RL.city.lon, RL.lon, s), lat = lerp(RL.city.lat, RL.lat, s);
      pts.push(scr(lerp(cx, 0, s), Hm(lon, lat) + Math.sin(Math.PI * s) * lift + 0.1, lerp(cz, 0, s)));
    }
    if (pts.length > 1) {
      g.save(); g.globalAlpha = 1 - sm(0.9, 1.0, q) * 0.5; g.strokeStyle = GOLD; g.lineWidth = 4; g.setLineDash([18, 12]); g.lineDashOffset = -t * 60;
      g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.stroke(); g.setLineDash([]);
      const c0 = pts[0]; g.fillStyle = GOLD; g.beginPath(); g.arc(c0[0], c0[1], 9, 0, 6.283); g.fill();
      g.font = '700 34px Baloo'; g.textAlign = 'center'; g.fillStyle = TXT; g.fillText(RL.city.name, c0[0], c0[1] - 22);
      if (ta > 0.3) {
        const vis = pts.filter(p => p[0] > 120 && p[0] < W - 120 && p[1] > 760 && p[1] < 1450), mp = vis.length ? vis[Math.floor(vis.length / 2)] : pts[Math.floor(pts.length / 2)], km = Math.round(RL.city.km * sm(0.3, 1, ta));
        const s = km + ' km'; g.font = '800 44px Inter'; const w = g.measureText(s).width + 40;
        g.fillStyle = PANEL; g.fillRect(mp[0] - w / 2, mp[1] - 74, w, 62); g.strokeStyle = GOLD; g.lineWidth = 2; g.strokeRect(mp[0] - w / 2 + 4, mp[1] - 70, w - 8, 54);
        g.fillStyle = GOLD; g.fillText(s, mp[0], mp[1] - 27);
      }
      g.restore();
    }
  }
  // pin: drops 220 px in 0.3 s at 62% with an 8 px overshoot; rings 3 px, 1.6 s period
  const tp = (q - 0.62) * DURATION;
  if (tp > 0) {
    const k = clamp(tp / 0.3), off = k < 1 ? -220 * (1 - ease.in(k)) : 8 * Math.sin(clamp((tp - 0.3) / 0.15) * Math.PI);
    const ry = Math.sin(C.pitch);
    for (let r = 0; r < 2; r++) {
      const ph = ((tp + r * 0.8) % 1.6) / 1.6, rad = 20 + ph * 90;
      g.save(); g.globalAlpha = (1 - ph) * 0.9; g.strokeStyle = GOLD; g.lineWidth = 3;
      g.beginPath(); g.ellipse(town[0], town[1], rad, rad * ry, 0, 0, 6.283); g.stroke(); g.restore();
    }
    g.save(); g.translate(town[0], town[1] + off); g.globalAlpha = clamp(tp / 0.1);
    if (RL.ink) {                                   // ink page: a square seal stamp
      const sc = 1 + 0.3 * (1 - clamp(tp / 0.15)); g.scale(sc, sc); g.fillStyle = '#B3261E'; g.fillRect(-45, -110, 90, 90);
      g.strokeStyle = '#EFE6D2'; g.lineWidth = 4; g.strokeRect(-36, -101, 72, 72);
    } else {
      g.fillStyle = GOLD; g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(-40, -46, -48, -76, -48, -96); g.arc(0, -96, 48, Math.PI, 0); g.bezierCurveTo(48, -76, 40, -46, 0, 0); g.fill();
      g.fillStyle = '#0A1220'; g.beginPath(); g.arc(0, -96, 18, 0, 6.283); g.fill();
    }
    g.restore();
  }
  // callout above the pin: box x 90-990, y 430-660; leader drawn in 0.35 s at 68%
  const tc = (q - 0.66) * DURATION;
  if (tc > 0 && RL.town) {
    const a = clamp(tc / 0.25), x0 = 90, x1 = 990, y0 = 430, y1 = 680;
    g.save(); g.globalAlpha = a; g.fillStyle = PANEL; g.fillRect(x0, y0, x1 - x0, y1 - y0);
    g.strokeStyle = GOLD; g.lineWidth = 2; g.strokeRect(x0 + 6, y0 + 6, x1 - x0 - 12, y1 - y0 - 12);
    const lk = ease.out(clamp((tc - 0.1) / 0.35)), ly0 = y1, ly1 = town[1] - 150;
    if (lk > 0 && ly1 > ly0) {
      g.lineWidth = 3; g.beginPath(); g.moveTo(town[0], ly0); g.lineTo(town[0], lerp(ly0, ly1, lk)); g.stroke();
      g.fillStyle = GOLD; g.beginPath(); g.arc(town[0], ly0, 10, 0, 6.283); g.fill();
    }
    const st = i => ease.out(clamp((tc - 0.08 * i) / 0.3));
    g.textAlign = 'left';
    g.globalAlpha = a * st(0); g.font = '700 24px Inter'; const kw = g.measureText(RL.kicker).width + RL.kicker.length * 4 + 36;
    g.fillStyle = GOLD; g.fillRect(x0 + 36, y0 + 30, kw, 44); g.fillStyle = CHIPTXT; spaced(RL.kicker, x0 + 54, y0 + 61, 4);
    g.globalAlpha = a * st(1); g.fillStyle = TXT; g.font = '800 120px Baloo'; g.fillText(RL.town, x0 + 34, y0 + 172 - 10 * (1 - st(1)));
    g.globalAlpha = a * st(2); g.fillStyle = GOLD; g.font = '600 26px Inter'; spaced(RL.sub, x0 + 38, y0 + 220, 3);
    g.restore();
  }
  // source line: baseline y 1500, x 60, no box
  if (!RL.ink) { const sg = g.createLinearGradient(0, 1500, 0, 1720); sg.addColorStop(0, 'rgba(0,0,0,0)'); sg.addColorStop(0.5, 'rgba(0,0,0,0.5)'); sg.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = sg; g.fillRect(0, 1500, W, 220); }
  g.save(); g.globalAlpha = 0.7; g.fillStyle = RL.ink ? '#2A1D14' : '#FFFFFF'; g.font = '500 20px Inter'; g.textAlign = 'left';
  const sw = [], parts = RL.source.split(' · '); let ln = '';
  parts.forEach(s => { const tr = ln ? ln + ' · ' + s : s; if (g.measureText(tr).width > W - 120 && ln) { sw.push(ln); ln = s; } else ln = tr; }); sw.push(ln);
  sw.forEach((s, i) => g.fillText(s, 60, 1650 - (sw.length - 1 - i) * 26)); g.restore();
  if (RL.light) { g.save(); g.fillStyle = 'rgba(241,223,184,0.9)'; g.beginPath(); g.roundRect(70, 268, W - 140, 140, 24); g.fill(); g.restore(); }   // light designs: cream plate under the dark scene title
};
