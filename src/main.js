import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const app = document.querySelector('.app');
const canvas = document.querySelector('#webgl');
const introCopy = document.querySelector('.scene-copy.intro');
const teamCopy = document.querySelector('.scene-copy.team');
const nextButtons = document.querySelectorAll('[data-next]');
const backButtons = document.querySelectorAll('[data-back]');
const trackFill = document.querySelector('.track-fill');
const transitionNote = document.querySelector('.transition-note');
const brandEl = document.querySelector('.brand');
const headerContactEl = document.querySelector('.header-contact');
const quietLinks = document.querySelectorAll('.quiet-link');

const scene = new THREE.Scene();
const bgLight = new THREE.Color(0xeeeff4);
const bgCool = new THREE.Color(0xe2e7f8);
const bgDeep = new THREE.Color(0x242a54);
const bgDark = new THREE.Color(0x050711);
scene.background = bgLight.clone();

const camera = new THREE.PerspectiveCamera(34, innerWidth / innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.65));
renderer.setSize(innerWidth, innerHeight, false);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.96;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
pmrem.dispose();

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.13, 0.62, 0.94);
composer.addPass(bloom);

const hemi = new THREE.HemisphereLight(0xffffff, 0x5963a8, 1.62);
scene.add(hemi);
const keyLight = new THREE.DirectionalLight(0xffffff, 1.96);
keyLight.position.set(4.5, 5.5, 7);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048, 2048);
keyLight.shadow.camera.near = 0.1;
keyLight.shadow.camera.far = 25;
keyLight.shadow.camera.left = -8;
keyLight.shadow.camera.right = 8;
keyLight.shadow.camera.top = 8;
keyLight.shadow.camera.bottom = -8;
scene.add(keyLight);
const purpleLight = new THREE.PointLight(0x8c44ff, 4.8, 16, 2);
purpleLight.position.set(-4.2, 1.4, 4.5);
scene.add(purpleLight);
const blueLight = new THREE.PointLight(0x2799ff, 4.6, 16, 2);
blueLight.position.set(4.1, 1.8, 4.2);
scene.add(blueLight);
const rimLight = new THREE.PointLight(0xffffff, 3.4, 14, 2);
rimLight.position.set(0, 4.5, -3.5);
scene.add(rimLight);

const world = new THREE.Group();
scene.add(world);
const xRoot = new THREE.Group();
world.add(xRoot);
const networkRoot = new THREE.Group();
world.add(networkRoot);

function makeRadialTexture(stops = [
  [0, 'rgba(255,255,255,1)'],
  [0.13, 'rgba(180,196,255,.72)'],
  [0.42, 'rgba(119,91,255,.23)'],
  [1, 'rgba(119,91,255,0)'],
]) {
  const size = 128;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  stops.forEach(([stop, color]) => g.addColorStop(stop, color));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function shapeFrom(points) {
  const shape = new THREE.Shape();
  shape.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) shape.lineTo(points[i][0], points[i][1]);
  shape.closePath();
  return shape;
}

function barPolygon(start, end, thickness) {
  const [x1, y1] = start;
  const [x2, y2] = end;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const px = -dy / len * thickness / 2;
  const py = dx / len * thickness / 2;
  return [
    [x1 + px, y1 + py],
    [x2 + px, y2 + py],
    [x2 - px, y2 - py],
    [x1 - px, y1 - py],
  ];
}

const leftChevron = [
  [-2.62, 2.76],
  [-1.89, 2.76],
  [0.28, 0.0],
  [-1.89, -2.76],
  [-2.62, -2.76],
  [-0.52, 0.0],
];
const upperRight = barPolygon([0.62, 0.46], [2.38, 2.78], 0.60);
const lowerRight = barPolygon([0.62, -0.46], [2.38, -2.78], 0.60);

const extrudeSettings = {
  depth: 0.54,
  bevelEnabled: true,
  bevelSegments: 5,
  steps: 1,
  bevelSize: 0.075,
  bevelThickness: 0.095,
  curveSegments: 6,
};

function makeMaterial(color, emissive) {
  return new THREE.MeshPhysicalMaterial({
    color,
    emissive,
    emissiveIntensity: 0.11,
    roughness: 0.14,
    metalness: 0.0,
    transmission: 0.05,
    thickness: 1.05,
    ior: 1.42,
    transparent: true,
    opacity: 0.992,
    clearcoat: 1,
    clearcoatRoughness: 0.11,
    side: THREE.DoubleSide,
  });
}

const lightPalette = {
  left: new THREE.Color(0x892eff),
  right: new THREE.Color(0x4ea5ff),
  leftEmissive: new THREE.Color(0x35106f),
  rightEmissive: new THREE.Color(0x0b3f9c),
};
const darkPalette = {
  left: new THREE.Color(0x36107f),
  right: new THREE.Color(0x0756c7),
  leftEmissive: new THREE.Color(0x25005e),
  rightEmissive: new THREE.Color(0x003b93),
};

const pieceEntries = [];

function addPiece(points, material, sideName) {
  const geometry = new THREE.ExtrudeGeometry(shapeFrom(points), extrudeSettings);
  geometry.translate(0, 0, -extrudeSettings.depth / 2);
  geometry.computeVertexNormals();

  const sideMaterial = material.clone();
  sideMaterial.color.multiplyScalar(0.54);
  sideMaterial.emissive.multiplyScalar(0.55);
  sideMaterial.transmission = 0.06;
  sideMaterial.opacity = 0.94;
  sideMaterial.roughness = 0.2;

  const mesh = new THREE.Mesh(geometry, [material, sideMaterial]);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  xRoot.add(mesh);

  const inner = new THREE.Mesh(
    geometry.clone(),
    new THREE.MeshBasicMaterial({
      color: material.color.clone().lerp(new THREE.Color(0xffffff), 0.24),
      transparent: true,
      opacity: 0.026,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  inner.scale.set(0.976, 0.976, 0.9);
  inner.position.z = 0.02;
  xRoot.add(inner);

  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry, 24),
    new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.46, depthWrite: false }),
  );
  edges.renderOrder = 4;
  xRoot.add(edges);

  const facetLines = new THREE.LineSegments(
    new THREE.WireframeGeometry(geometry),
    new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.035, depthWrite: false }),
  );
  facetLines.renderOrder = 3;
  xRoot.add(facetLines);

  pieceEntries.push({
    sideName,
    mesh,
    primary: material,
    side: sideMaterial,
    inner: inner.material,
    edges: edges.material,
    wire: facetLines.material,
  });
}

addPiece(leftChevron, makeMaterial(lightPalette.left.clone(), lightPalette.leftEmissive.clone()), 'left');
addPiece(upperRight, makeMaterial(lightPalette.right.clone(), lightPalette.rightEmissive.clone()), 'right');
addPiece(lowerRight, makeMaterial(lightPalette.right.clone(), lightPalette.rightEmissive.clone()), 'right');

const centerGlow = new THREE.Mesh(
  new THREE.SphereGeometry(0.055, 24, 16),
  new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.34 }),
);
centerGlow.position.set(0.31, 0, 0.18);
xRoot.add(centerGlow);

const halo = new THREE.Sprite(new THREE.SpriteMaterial({
  map: makeRadialTexture(),
  color: 0xb8c5ff,
  transparent: true,
  opacity: 0.18,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
}));
halo.scale.set(0.72, 0.72, 1);
halo.position.set(0.31, 0, -0.1);
xRoot.add(halo);

const floorShadow = new THREE.Mesh(
  new THREE.PlaneGeometry(5.2, 5.2),
  new THREE.MeshBasicMaterial({
    map: makeRadialTexture([
      [0, 'rgba(0,0,0,.65)'],
      [0.28, 'rgba(0,0,0,.32)'],
      [0.7, 'rgba(33,49,108,.08)'],
      [1, 'rgba(0,0,0,0)'],
    ]),
    transparent: true,
    opacity: 0,
    depthWrite: false,
  }),
);
floorShadow.rotation.x = -Math.PI / 2;
floorShadow.position.set(0.26, -3.12, -0.1);
scene.add(floorShadow);

const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x6e6cff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false });
const floorRings = [];
for (const [inner, outer] of [[2.35, 2.365], [2.85, 2.865], [3.34, 3.355]]) {
  const ring = new THREE.Mesh(new THREE.RingGeometry(inner, outer, 180), ringMaterial.clone());
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = -3.18;
  scene.add(ring);
  floorRings.push(ring);
}

function seededRandom(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = seededRandom(845731);
const nodeCount = 56;
const nodeBase = [];
const nodeData = [];
const nodeGeometry = new THREE.SphereGeometry(0.036, 10, 7);
const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.96 });
const nodes = new THREE.InstancedMesh(nodeGeometry, nodeMaterial, nodeCount);
nodes.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
networkRoot.add(nodes);

for (let i = 0; i < nodeCount; i++) {
  const theta = rand() * Math.PI * 2;
  const phi = Math.acos(THREE.MathUtils.clamp(rand() * 2 - 1, -1, 1));
  const radius = 2.75 + rand() * 1.35;
  const x = Math.cos(theta) * Math.sin(phi) * radius * 1.08;
  const y = Math.cos(phi) * radius * 0.84;
  const z = Math.sin(theta) * Math.sin(phi) * radius * 0.42;
  nodeBase.push(new THREE.Vector3(x, y, z));
  nodeData.push({
    phase: rand() * Math.PI * 2,
    speed: 0.08 + rand() * 0.16,
    amp: 0.04 + rand() * 0.12,
    scale: 0.44 + rand() * 0.76,
    colorMix: rand(),
  });
  const color = new THREE.Color(0x8b54ff).lerp(new THREE.Color(0x3b9cff), nodeData[i].colorMix);
  nodes.setColorAt(i, color);
}
nodes.instanceColor.needsUpdate = true;

const connectionPairs = [];
for (let i = 0; i < nodeCount; i++) {
  const nearest = [];
  for (let j = i + 1; j < nodeCount; j++) {
    const d = nodeBase[i].distanceTo(nodeBase[j]);
    if (d < 1.58) nearest.push([d, j]);
  }
  nearest.sort((a, b) => a[0] - b[0]);
  for (let k = 0; k < Math.min(2, nearest.length); k++) connectionPairs.push([i, nearest[k][1]]);
}
const linePositions = new Float32Array(connectionPairs.length * 6);
const lineGeometry = new THREE.BufferGeometry();
lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
const networkLines = new THREE.LineSegments(
  lineGeometry,
  new THREE.LineBasicMaterial({ color: 0x6f84e9, transparent: true, opacity: 0.14, depthWrite: false }),
);
networkRoot.add(networkLines);

const cursorLineCount = 8;
const cursorLinePositions = new Float32Array(cursorLineCount * 6);
const cursorLineGeometry = new THREE.BufferGeometry();
cursorLineGeometry.setAttribute('position', new THREE.BufferAttribute(cursorLinePositions, 3));
const cursorLines = new THREE.LineSegments(
  cursorLineGeometry,
  new THREE.LineBasicMaterial({ color: 0x2d9fff, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }),
);
scene.add(cursorLines);
const cursorOrb = new THREE.Sprite(new THREE.SpriteMaterial({
  map: makeRadialTexture([
    [0, 'rgba(120,205,255,1)'],
    [0.16, 'rgba(64,165,255,.96)'],
    [0.42, 'rgba(26,112,255,.55)'],
    [0.72, 'rgba(10,72,255,.14)'],
    [1, 'rgba(10,72,255,0)'],
  ]),
  color: 0xffffff,
  transparent: true,
  opacity: 0,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
}));
cursorOrb.scale.set(0.36, 0.36, 1);
scene.add(cursorOrb);

const pointer = new THREE.Vector2(0, 0);
const pointerTarget = new THREE.Vector2(0, 0);
const pointerWorld = new THREE.Vector3();
const pointerPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const raycaster = new THREE.Raycaster();
let pointerActive = false;
let pointerInside = false;

addEventListener('pointermove', (event) => {
  pointerTarget.x = event.clientX / innerWidth * 2 - 1;
  pointerTarget.y = -(event.clientY / innerHeight) * 2 + 1;
  pointerActive = true;
  pointerInside = true;
});
addEventListener('pointerleave', () => {
  pointerActive = false;
  pointerInside = false;
});

const pose0 = {
  camera: new THREE.Vector3(0.22, 0.14, 11.88),
  target: new THREE.Vector3(1.02, -0.05, 0),
  rootPos: new THREE.Vector3(3.15, -0.08, 0),
  rootEuler: new THREE.Euler(0.06, -0.34, -0.02),
  scale: 0.72,
  networkPos: new THREE.Vector3(3.02, -0.02, -0.1),
  networkEuler: new THREE.Euler(0.04, -0.16, 0.02),
};
const pose1 = {
  camera: new THREE.Vector3(-1.08, 0.60, 11.02),
  target: new THREE.Vector3(-1.18, -0.08, 0),
  rootPos: new THREE.Vector3(-4.18, -0.10, 0),
  rootEuler: new THREE.Euler(0.18, 0.58, -0.10),
  scale: 0.60,
  networkPos: new THREE.Vector3(-4.02, -0.03, -0.16),
  networkEuler: new THREE.Euler(0.08, 0.44, -0.04),
};

let progress = 0;
let targetProgress = 0;
let progressVelocity = 0;
let motionEnergy = 0;
let navigationTween = null;
let currentScene = 0;
let transitionProgressOverride = null;
let lastWheelAt = 0;
let paused = false;
let previousTime = performance.now();
let swirl = 0;
let liveProgress = 0;

const currentCamera = pose0.camera.clone();
const currentTarget = pose0.target.clone();
const currentRootPos = pose0.rootPos.clone();
const currentNetworkPos = pose0.networkPos.clone();
const currentRootQuat = new THREE.Quaternion().setFromEuler(pose0.rootEuler);
const currentNetworkQuat = new THREE.Quaternion().setFromEuler(pose0.networkEuler);
let currentScale = pose0.scale;

function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
function smoothStep(t) { return t * t * (3 - 2 * t); }
function clamp01(v) { return THREE.MathUtils.clamp(v, 0, 1); }
function lerpColor(a, b, t) { return a.clone().lerp(b, t); }

function updateProgressUI(t) {
  if (trackFill) {
    const width = 24 + t * 76;
    trackFill.style.width = `${width}%`;
  }
  if (transitionNote) {
    transitionNote.style.opacity = `${Math.max(0, 1 - Math.abs(t - 0.5) * 2.2) * 0.9}`;
  }
}

function setDomScene(progressValue) {
  const introActive = progressValue < 0.62;
  const teamActive = progressValue > 0.38;
  const transitioning = progressValue > 0.02 && progressValue < 0.98;
  const dark = progressValue > 0.50;
  app.dataset.scene = progressValue > 0.5 ? '1' : '0';
  app.dataset.transition = transitioning ? '1' : '0';
  app.style.color = dark ? '#f6f7fb' : '#101116';
  document.body.style.background = dark ? '#050711' : '#eeeff4';
  app.style.setProperty('--muted', dark ? 'rgba(226,230,242,.72)' : '#696d79');
  app.style.setProperty('--hairline', dark ? 'rgba(212,217,238,.22)' : 'rgba(18,20,30,.16)');
  if (brandEl) brandEl.style.color = dark ? '#f5f7ff' : '#101116';
  if (headerContactEl) {
    headerContactEl.style.color = dark ? '#f5f7ff' : '#101116';
    headerContactEl.style.background = dark ? 'rgba(5,12,20,.78)' : 'rgba(255,255,255,.82)';
    headerContactEl.style.borderColor = dark ? 'rgba(37,211,102,.26)' : 'rgba(18,20,30,.14)';
  }
  quietLinks.forEach((link) => {
    link.style.color = dark ? '#f5f7ff' : '#101116';
    link.style.background = dark ? 'rgba(8,14,31,.48)' : 'rgba(255,255,255,.44)';
    link.style.borderColor = dark ? 'rgba(207,216,255,.20)' : 'rgba(21,25,39,.17)';
  });

  const introShift = -70 * Math.min(1, progressValue / 0.46);
  const teamShift = 70 * Math.max(0, 1 - (progressValue - 0.54) / 0.46);

  introCopy.setAttribute('aria-hidden', introActive ? 'false' : 'true');
  introCopy.style.opacity = introActive ? String(1 - smoothStep(clamp01((progressValue - 0.20) / 0.40))) : '0';
  introCopy.style.pointerEvents = progressValue < 0.46 ? 'auto' : 'none';
  introCopy.style.transform = introActive
    ? `translate(${introShift}px, -50%) scale(${1 - progressValue * 0.03})`
    : 'translate(-70px, -50%) scale(.98)';

  teamCopy.setAttribute('aria-hidden', teamActive ? 'false' : 'true');
  teamCopy.style.opacity = teamActive ? String(smoothStep(clamp01((progressValue - 0.38) / 0.40))) : '0';
  teamCopy.style.pointerEvents = progressValue > 0.54 ? 'auto' : 'none';
  teamCopy.style.transform = teamActive
    ? `translate(${Math.max(0, teamShift)}px, -50%) scale(${0.985 + progressValue * 0.02})`
    : 'translate(70px, -50%) scale(.98)';

  updateProgressUI(progressValue);
}

function applyMaterialState(t) {
  const darkMix = smoothStep(Math.max(0, (t - 0.10) / 0.90));
  pieceEntries.forEach((entry) => {
    const isLeft = entry.sideName === 'left';
    const baseLight = isLeft ? lightPalette.left : lightPalette.right;
    const baseDark = isLeft ? darkPalette.left : darkPalette.right;
    const emissiveLight = isLeft ? lightPalette.leftEmissive : lightPalette.rightEmissive;
    const emissiveDark = isLeft ? darkPalette.leftEmissive : darkPalette.rightEmissive;

    entry.primary.color.copy(lerpColor(baseLight, baseDark, darkMix));
    entry.primary.emissive.copy(lerpColor(emissiveLight, emissiveDark, darkMix));
    entry.primary.transmission = THREE.MathUtils.lerp(0.05, 0.035, darkMix);
    entry.primary.opacity = THREE.MathUtils.lerp(0.992, 0.996, darkMix);
    entry.primary.roughness = THREE.MathUtils.lerp(0.16, 0.16, darkMix);
    entry.primary.clearcoatRoughness = THREE.MathUtils.lerp(0.11, 0.08, darkMix);

    entry.side.color.copy(entry.primary.color).multiplyScalar(0.52);
    entry.side.emissive.copy(entry.primary.emissive).multiplyScalar(0.62);
    entry.side.transmission = THREE.MathUtils.lerp(0.06, 0.015, darkMix);
    entry.side.opacity = THREE.MathUtils.lerp(0.94, 0.985, darkMix);
    entry.side.roughness = THREE.MathUtils.lerp(0.2, 0.24, darkMix);

    entry.inner.color.copy(entry.primary.color).lerp(new THREE.Color(0xffffff), THREE.MathUtils.lerp(0.24, 0.08, darkMix));
    entry.inner.opacity = THREE.MathUtils.lerp(0.026, 0.012, darkMix);
    entry.edges.color.copy(lerpColor(new THREE.Color(0xffffff), isLeft ? new THREE.Color(0xb67cff) : new THREE.Color(0x58b8ff), darkMix));
    entry.edges.opacity = THREE.MathUtils.lerp(0.52, 0.86, darkMix);
    entry.wire.opacity = THREE.MathUtils.lerp(0.035, 0.025, darkMix);
  });

  centerGlow.material.opacity = THREE.MathUtils.lerp(0.54, 0.34, darkMix);
  halo.material.color.copy(lerpColor(new THREE.Color(0xb8c5ff), new THREE.Color(0x7a6dff), darkMix));
  halo.material.opacity = THREE.MathUtils.lerp(0.22, 0.18, darkMix);
  floorShadow.visible = false;
  floorRings.forEach((ring, i) => {
    ring.material.opacity = THREE.MathUtils.lerp(0.0, 0.085 - i * 0.015, darkMix);
    ring.material.color.copy(lerpColor(new THREE.Color(0x7a6dff), new THREE.Color(0x295ec9), darkMix * 0.7));
  });
  networkLines.material.opacity = THREE.MathUtils.lerp(0.14, 0.16, darkMix);

  keyLight.intensity = THREE.MathUtils.lerp(1.96, 0.78, darkMix);
  hemi.intensity = THREE.MathUtils.lerp(1.62, 0.58, darkMix);
  purpleLight.intensity = THREE.MathUtils.lerp(4.8, 2.85, darkMix);
  blueLight.intensity = THREE.MathUtils.lerp(4.6, 3.05, darkMix);
  rimLight.intensity = THREE.MathUtils.lerp(3.4, 1.75, darkMix);
  purpleLight.color.copy(lerpColor(new THREE.Color(0x8c44ff), new THREE.Color(0x6545d8), darkMix));
  blueLight.color.copy(lerpColor(new THREE.Color(0x2799ff), new THREE.Color(0x4f7dff), darkMix));
}

function applyPoseBlend(t, nowSeconds = 0) {
  const eased = ease(t);
  const smooth = smoothStep(t);
  const sinArc = Math.sin(Math.PI * t);
  const orbitArc = Math.sin(Math.PI * t) * Math.cos(Math.PI * t * 0.5);
  const micro = Math.sin(nowSeconds * 0.8 + t * 5.4) * sinArc * 0.012 * motionEnergy;

  currentCamera.lerpVectors(pose0.camera, pose1.camera, eased);
  currentCamera.x += sinArc * 0.58 + orbitArc * 0.10;
  currentCamera.y += sinArc * 0.22 + micro;
  currentCamera.z -= sinArc * 0.64;

  currentTarget.lerpVectors(pose0.target, pose1.target, smooth);
  currentTarget.x += Math.sin(Math.PI * t) * -0.05;
  currentTarget.y += Math.sin(Math.PI * t * 1.3) * 0.02;

  currentRootPos.lerpVectors(pose0.rootPos, pose1.rootPos, eased);
  currentRootPos.y += sinArc * 0.10;
  currentRootPos.z += orbitArc * 0.08;

  currentNetworkPos.lerpVectors(pose0.networkPos, pose1.networkPos, eased);
  currentNetworkPos.y += sinArc * 0.06;
  currentNetworkPos.z -= sinArc * 0.04;

  currentRootQuat.slerpQuaternions(
    new THREE.Quaternion().setFromEuler(pose0.rootEuler),
    new THREE.Quaternion().setFromEuler(pose1.rootEuler),
    eased,
  );
  currentNetworkQuat.slerpQuaternions(
    new THREE.Quaternion().setFromEuler(pose0.networkEuler),
    new THREE.Quaternion().setFromEuler(pose1.networkEuler),
    eased,
  );

  currentRootQuat.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0, sinArc * 0.30, -sinArc * 0.10)));
  currentNetworkQuat.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(sinArc * 0.10, sinArc * 0.78, sinArc * 0.12)));

  currentScale = THREE.MathUtils.lerp(pose0.scale, pose1.scale, eased) * (1 + sinArc * 0.024);
  swirl = sinArc;
  bloom.strength = THREE.MathUtils.lerp(0.12, 0.28, t) + sinArc * 0.018;
  if (t < 0.34) {
    scene.background.copy(bgLight).lerp(bgCool, smoothStep(t / 0.34));
  } else if (t < 0.72) {
    scene.background.copy(bgCool).lerp(bgDeep, smoothStep((t - 0.34) / 0.38));
  } else {
    scene.background.copy(bgDeep).lerp(bgDark, smoothStep((t - 0.72) / 0.28));
  }
  renderer.toneMappingExposure = THREE.MathUtils.lerp(0.96, 0.90, t);
  applyMaterialState(t);
  setDomScene(t);
  liveProgress = t;
}

function applyPoseInstant(index) {
  const p = index === 0 ? pose0 : pose1;
  currentCamera.copy(p.camera);
  currentTarget.copy(p.target);
  currentRootPos.copy(p.rootPos);
  currentNetworkPos.copy(p.networkPos);
  currentRootQuat.setFromEuler(p.rootEuler);
  currentNetworkQuat.setFromEuler(p.networkEuler);
  currentScale = p.scale;
  swirl = 0;
  liveProgress = index;
  bloom.strength = index === 0 ? 0.13 : 0.32;
  scene.background.copy(index === 0 ? bgCool.clone().lerp(bgLight, 0.45) : bgDark);
  renderer.toneMappingExposure = index === 0 ? 0.96 : 0.90;
  applyMaterialState(index);
  setDomScene(index);
}

function setSceneTarget(index) {
  targetProgress = clamp01(index);
  lastWheelAt = performance.now();
}

function goTo(index, instant = false) {
  const clamped = clamp01(index);
  transitionProgressOverride = null;
  if (instant) {
    progress = clamped;
    targetProgress = clamped;
    progressVelocity = 0;
    motionEnergy = 0;
    navigationTween = null;
    currentScene = clamped > 0.5 ? 1 : 0;
    applyPoseInstant(currentScene);
    return;
  }
  navigationTween = {
    from: progress,
    to: clamped,
    start: performance.now(),
    duration: 1280,
  };
  targetProgress = clamped;
  motionEnergy = Math.max(motionEnergy, 0.42);
}

document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-next], [data-back], [data-scene]');
  if (!trigger) return;
  event.preventDefault();
  if (trigger.hasAttribute('data-next')) {
    goTo(1);
    return;
  }
  if (trigger.hasAttribute('data-back')) {
    goTo(0);
    return;
  }
  if (trigger.hasAttribute('data-scene')) {
    goTo(Number(trigger.dataset.scene));
  }
});
addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight' || event.key === 'PageDown') goTo(1);
  if (event.key === 'ArrowLeft' || event.key === 'PageUp') goTo(0);
});

addEventListener('wheel', (event) => {
  if ((innerWidth <= 820 || (innerWidth <= 960 && innerHeight <= 540))) return;
  event.preventDefault();
  if (navigationTween) {
    navigationTween = null;
    targetProgress = progress;
  }
  const impulse = THREE.MathUtils.clamp(event.deltaY * 0.00102, -0.13, 0.13);
  targetProgress = clamp01(targetProgress + impulse * 0.90);
  motionEnergy = Math.min(1, motionEnergy + Math.abs(impulse) * 5.5);
  lastWheelAt = performance.now();
}, { passive: false });

const dummy = new THREE.Object3D();
const nodePositions = Array.from({ length: nodeCount }, () => new THREE.Vector3());
const tempLocalPointer = new THREE.Vector3();
const tempWorldNode = new THREE.Vector3();
const tempDistances = [];

function updateNetwork(time) {
  pointer.lerp(pointerTarget, 0.08);
  raycaster.setFromCamera(pointer, camera);
  if (raycaster.ray.intersectPlane(pointerPlane, pointerWorld)) {
    cursorOrb.position.lerp(pointerWorld, 0.16);
  }
  const pointerFade = pointerActive && pointerInside ? 1 : 0;
  const cursorColorLight = new THREE.Color(0x1f8fff);
  const cursorColorDark = new THREE.Color(0x5b6dff);
  const cursorColor = cursorColorLight.clone().lerp(cursorColorDark, smoothStep(liveProgress));
  cursorLines.material.color.copy(cursorColor);
  cursorOrb.material.color.copy(cursorColor.clone().lerp(new THREE.Color(0xc7eeff), 0.18));
  const interactionSceneFade = 1;
  cursorOrb.material.opacity = THREE.MathUtils.lerp(
    cursorOrb.material.opacity,
    pointerFade * 0.58 * interactionSceneFade,
    0.12,
  );
  cursorLines.material.opacity = THREE.MathUtils.lerp(
    cursorLines.material.opacity,
    pointerFade * 0.72 * interactionSceneFade,
    0.1,
  );
  networkLines.material.opacity = THREE.MathUtils.lerp(0.14, 0.16, smoothStep(liveProgress));

  tempLocalPointer.copy(cursorOrb.position);
  networkRoot.worldToLocal(tempLocalPointer);

  for (let i = 0; i < nodeCount; i++) {
    const base = nodeBase[i];
    const d = nodeData[i];
    const wobble = time * d.speed + d.phase;
    const pos = nodePositions[i];
    pos.set(
      base.x + Math.cos(wobble) * d.amp,
      base.y + Math.sin(wobble * 1.17) * d.amp,
      base.z + Math.sin(wobble * 0.82) * d.amp * 1.4,
    );
    if (pointerActive) {
      const dist = pos.distanceTo(tempLocalPointer);
      if (dist < 2.25) {
        const influence = Math.pow(1 - dist / 2.25, 2) * 0.055;
        pos.lerp(tempLocalPointer, influence);
      }
    }
    dummy.position.copy(pos);
    const pulse = 1 + Math.sin(time * 1.8 + d.phase) * 0.08 + swirl * 0.12;
    dummy.scale.setScalar(d.scale * pulse);
    dummy.updateMatrix();
    nodes.setMatrixAt(i, dummy.matrix);
  }
  nodes.instanceMatrix.needsUpdate = true;

  let offset = 0;
  for (const [a, b] of connectionPairs) {
    const pa = nodePositions[a];
    const pb = nodePositions[b];
    linePositions[offset++] = pa.x; linePositions[offset++] = pa.y; linePositions[offset++] = pa.z;
    linePositions[offset++] = pb.x; linePositions[offset++] = pb.y; linePositions[offset++] = pb.z;
  }
  lineGeometry.attributes.position.needsUpdate = true;

  tempDistances.length = 0;
  for (let i = 0; i < nodeCount; i++) tempDistances.push([nodePositions[i].distanceTo(tempLocalPointer), i]);
  tempDistances.sort((a, b) => a[0] - b[0]);

  for (let i = 0; i < cursorLineCount; i++) {
    const nodeIndex = tempDistances[i][1];
    const node = nodePositions[nodeIndex];
    tempWorldNode.copy(node);
    networkRoot.localToWorld(tempWorldNode);
    const baseIndex = i * 6;
    const arc = liveProgress < 0.56 ? 0.035 : 0.012;
    const jitterA = Math.sin(time * 18 + i * 1.7) * arc;
    const jitterB = Math.cos(time * 15 + i * 1.2) * arc * 0.8;
    cursorLinePositions[baseIndex] = tempWorldNode.x + jitterA;
    cursorLinePositions[baseIndex + 1] = tempWorldNode.y + jitterB;
    cursorLinePositions[baseIndex + 2] = tempWorldNode.z;
    cursorLinePositions[baseIndex + 3] = cursorOrb.position.x - jitterA * 0.35;
    cursorLinePositions[baseIndex + 4] = cursorOrb.position.y - jitterB * 0.35;
    cursorLinePositions[baseIndex + 5] = cursorOrb.position.z;
  }
  cursorLineGeometry.attributes.position.needsUpdate = true;
}

function updateCameraAndObjects(nowSeconds) {
  const mobile = (innerWidth <= 820 || (innerWidth <= 960 && innerHeight <= 540));
  if (mobile) {
    const mobileLandscape = innerWidth > innerHeight;
    camera.position.set(pointer.x * 0.03, mobileLandscape ? 0.10 : 0.16, mobileLandscape ? 11.8 : 11.45);
    camera.lookAt(0, mobileLandscape ? 0.02 : -0.03, 0);
    xRoot.position.set(0, mobileLandscape ? 0.02 : -0.02, 0);
    xRoot.quaternion.copy(currentRootQuat);
    xRoot.rotateX(pointer.y * 0.014);
    xRoot.rotateY(pointer.x * 0.022);
    xRoot.scale.setScalar(mobileLandscape ? 0.56 : 0.64);
    networkRoot.position.set(0, mobileLandscape ? 0.0 : -0.02, -0.15);
    networkRoot.quaternion.copy(currentNetworkQuat);
    networkRoot.scale.setScalar(mobileLandscape ? 0.74 : 0.82);
  } else {
    const px = pointer.x * 0.11;
    const py = pointer.y * 0.08;
    const drift = Math.sin(nowSeconds * 0.52 + liveProgress * 1.9) * 0.022 * motionEnergy;
    camera.position.copy(currentCamera).add(new THREE.Vector3(px + drift, py, 0));
    camera.lookAt(currentTarget.x + pointer.x * 0.05, currentTarget.y + pointer.y * 0.04, currentTarget.z);
    xRoot.position.copy(currentRootPos);
    xRoot.quaternion.copy(currentRootQuat);
    xRoot.rotateX(pointer.y * 0.022);
    xRoot.rotateY(pointer.x * 0.036);
    xRoot.scale.setScalar(currentScale);
    networkRoot.position.copy(currentNetworkPos);
    networkRoot.quaternion.copy(currentNetworkQuat);
    networkRoot.scale.setScalar(THREE.MathUtils.lerp(1, 0.84, smoothStep(liveProgress)));
  }
  networkRoot.rotateY(nowSeconds * 0.03 + pointer.x * 0.02);
}

function updateMotion(now) {
  if (transitionProgressOverride !== null) {
    progress = transitionProgressOverride;
    targetProgress = transitionProgressOverride;
    progressVelocity = 0;
    motionEnergy = 0;
    navigationTween = null;
    currentScene = progress > 0.5 ? 1 : 0;
    return;
  }

  const dt = Math.min(0.10, Math.max(0.001, (now - previousTime) / 1000 || 0.016));
  if (navigationTween) {
    const raw = clamp01((now - navigationTween.start) / navigationTween.duration);
    const eased = ease(raw);
    progress = THREE.MathUtils.lerp(navigationTween.from, navigationTween.to, eased);
    targetProgress = navigationTween.to;
    motionEnergy = THREE.MathUtils.lerp(0.42, 0.05, eased);
    if (raw >= 1) {
      progress = navigationTween.to;
      targetProgress = navigationTween.to;
      navigationTween = null;
      motionEnergy = 0;
    }
  } else {
    const response = 10.2;
    progress = THREE.MathUtils.damp(progress, targetProgress, response, dt);
    if (Math.abs(targetProgress - progress) < 0.002) progress = targetProgress;
    motionEnergy = THREE.MathUtils.damp(motionEnergy, 0, 4.8, dt);
  }
  currentScene = progress > 0.5 ? 1 : 0;
}

function animate(now) {
  if (!paused) requestAnimationFrame(animate);
  const nowSeconds = now * 0.001;
  updateMotion(now);
  applyPoseBlend(progress, nowSeconds);
  updateCameraAndObjects(nowSeconds);
  updateNetwork(nowSeconds);
  composer.render();
  previousTime = now;
}

function onResize() {
  const w = innerWidth;
  const mobileLayout = innerWidth <= 820 || (innerWidth <= 960 && innerHeight <= 540);
  const h = mobileLayout ? (innerWidth > innerHeight ? innerHeight : Math.round(Math.min(innerHeight * 0.34, 310))) : innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h, false);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.65));
  composer.setSize(w, h);
  bloom.resolution.set(w, h);
}
addEventListener('resize', onResize);

window.__nexo = {
  goTo,
  setScene(index) { goTo(index, true); },
  setTransitionProgress(t) {
    transitionProgressOverride = clamp01(Number(t));
    navigationTween = null;
    progress = transitionProgressOverride;
    targetProgress = transitionProgressOverride;
    progressVelocity = 0;
    motionEnergy = 0;
    applyPoseBlend(transitionProgressOverride, performance.now() * 0.001);
  },
  clearTransitionOverride() {
    transitionProgressOverride = null;
    navigationTween = null;
    targetProgress = progress;
    applyPoseBlend(progress, performance.now() * 0.001);
  },
  pause() { paused = true; },
  resume() { if (paused) { paused = false; previousTime = performance.now(); requestAnimationFrame(animate); } },
  renderOnce() { applyPoseBlend(progress, performance.now() * 0.001); updateCameraAndObjects(performance.now() * 0.001); updateNetwork(performance.now() * 0.001); composer.render(); },
  getState() {
    return {
      scene: currentScene,
      progress,
      targetProgress,
      transitioning: Math.abs(progress - targetProgress) > 0.001 || transitionProgressOverride !== null,
      canvas: { width: renderer.domElement.width, height: renderer.domElement.height },
      viewport: { width: innerWidth, height: innerHeight },
    };
  },
};

const params = new URLSearchParams(location.search);
const initialScene = Number(window.__NEXO_INITIAL_SCENE__ ?? params.get('scene') ?? 0);
const transitionParam = window.__NEXO_TRANSITION__ ?? params.get('transition');
currentScene = initialScene === 1 ? 1 : 0;
progress = currentScene;
targetProgress = currentScene;
previousTime = performance.now();
applyPoseInstant(currentScene);
if (transitionParam !== null) {
  transitionProgressOverride = clamp01(Number(transitionParam));
  progress = transitionProgressOverride;
  targetProgress = transitionProgressOverride;
  applyPoseBlend(transitionProgressOverride, performance.now() * 0.001);
}
onResize();
updateCameraAndObjects(performance.now() * 0.001);
updateNetwork(performance.now() * 0.001);
composer.render();
requestAnimationFrame(animate);
