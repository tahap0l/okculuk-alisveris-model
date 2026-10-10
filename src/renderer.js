import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { calculateModelDimensions, getRiserLengthInches } from "./modeling.js?v=3d-model-3";

const DEFAULTS = { riser: "#7652b2", limbs: "#ded9e7", sight: "#28242e", string: "#ece5f4", longRod: "#28242e", shortRod: "#28242e", vbar: "#9b8cae" };
const COMPONENTS = ["riser", "limbs", "sight", "string", "accessories"];
const IMPORTED_COMPONENTS = [...COMPONENTS];
const safeColor = (value, fallback) => /^#[\da-f]{6}$/i.test(value ?? "") ? value : fallback;
const v3 = point => new THREE.Vector3(...point);

function material(color, { metalness = 0.55, roughness = 0.3, tint = 1, clearcoat = 0.2 } = {}) {
  const result = new THREE.MeshStandardMaterial({ color, metalness, roughness, side: THREE.DoubleSide, clearcoat, clearcoatRoughness: 0.3 });
  result.userData.tint = tint;
  return result;
}
function addBox(group, dimensions, position, mat, bevel = 0) {
  const geometry = bevel ? new THREE.BoxGeometry(...dimensions, 3, 3, 3) : new THREE.BoxGeometry(...dimensions);
  const mesh = new THREE.Mesh(geometry, mat);
  mesh.position.set(...position);
  mesh.castShadow = true;
  group.add(mesh);
  return mesh;
}
function addCylinder(group, radius, length, position, mat, axis = "z", radialSegments = 24) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, radialSegments), mat);
  mesh.position.set(...position);
  if (axis === "z") mesh.rotation.x = Math.PI / 2;
  if (axis === "x") mesh.rotation.z = Math.PI / 2;
  mesh.castShadow = true;
  group.add(mesh);
  return mesh;
}
function addRod(group, start, end, radius, mat, tipRadius = radius) {
  const from = v3(start), to = v3(end), axis = to.clone().sub(from);
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(tipRadius, radius, axis.length(), 20, 1, false), mat);
  mesh.position.copy(from.add(to).multiplyScalar(0.5));
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), axis.normalize());
  mesh.castShadow = true;
  group.add(mesh);
  return mesh;
}

function makeRiser(group, lengthMm, color) {
  const half = lengthMm / 2;
  const outline = new THREE.Shape();
  outline.moveTo(-25, -half + 30);
  outline.quadraticCurveTo(-20, -half + 12, 6, -half + 8);
  outline.lineTo(25, -half + 4);
  outline.quadraticCurveTo(34, -half + 10, 31, -half + 38);
  outline.lineTo(20, -170);
  outline.quadraticCurveTo(15, -96, 36, -55);
  outline.lineTo(50, -31);
  outline.quadraticCurveTo(57, -18, 48, -9);
  outline.quadraticCurveTo(41, 0, 48, 9);
  outline.quadraticCurveTo(57, 18, 50, 31);
  outline.lineTo(36, 55);
  outline.quadraticCurveTo(15, 96, 20, 170);
  outline.lineTo(31, half - 38);
  outline.quadraticCurveTo(34, half - 10, 25, half - 4);
  outline.lineTo(6, half - 8);
  outline.quadraticCurveTo(-20, half - 12, -25, half - 30);
  outline.lineTo(-19, 78);
  outline.quadraticCurveTo(-16, 0, -19, -78);
  outline.closePath();
  const shape = new THREE.ExtrudeGeometry(outline, { depth: 66, bevelEnabled: true, bevelSegments: 4, steps: 1, bevelSize: 4, bevelThickness: 4, curveSegments: 16 });
  shape.translate(0, 0, -33);
  const shell = new THREE.Mesh(shape, material(color, { metalness: 0.78, roughness: 0.24, clearcoat: 0.42 }));
  shell.castShadow = true;
  group.add(shell);

  // Separate ergonomic grip, limb pockets and visible threaded fittings.
  const gripShape = new THREE.Shape();
  gripShape.moveTo(36, -62); gripShape.quadraticCurveTo(57, -69, 62, -45);
  gripShape.lineTo(61, 43); gripShape.quadraticCurveTo(56, 69, 35, 60);
  gripShape.lineTo(28, 36); gripShape.lineTo(31, -37); gripShape.closePath();
  const gripGeo = new THREE.ExtrudeGeometry(gripShape, { depth: 34, bevelEnabled: true, bevelSegments: 5, steps: 1, bevelSize: 5, bevelThickness: 5 });
  gripGeo.translate(0, 0, -17);
  const grip = new THREE.Mesh(gripGeo, material("#4e382e", { metalness: 0.08, roughness: 0.62, clearcoat: 0.08 }));
  grip.castShadow = true; group.add(grip);

  const dark = material("#17141d", { metalness: 0.68, roughness: 0.32 });
  const steel = material("#c4bfce", { metalness: 0.9, roughness: 0.19 });
  const accent = material("#d7b9ff", { metalness: 0.7, roughness: 0.22 });
  for (const sign of [-1, 1]) {
    const y = sign * (half - 30);
    addBox(group, [42, 42, 74], [2, y, 0], dark);
    addBox(group, [48, 7, 79], [2, y, 0], material("#554d5d", { metalness: 0.72, roughness: 0.3 }));
    addCylinder(group, 9, 7, [4, sign * (half - 39), 39], steel, "z");
    addCylinder(group, 4.6, 8, [4, sign * (half - 39), 44], accent, "z");
    for (let i = -1; i <= 1; i++) addCylinder(group, 2, 2, [i * 9, sign * (half - 39), 40], steel, "z", 12);
  }
  // Threaded accessory sockets and a clear arrow shelf / pressure-button boss.
  for (const [x, y, z, r] of [[0, -34, 37, 7], [0, 33, 37, 5], [0, -8, 39, 4]]) addCylinder(group, r, 5, [x, y, z], steel, "z");
  addBox(group, [50, 5, 28], [41, -7, 38], steel);
  addCylinder(group, 7, 22, [40, -9, 49], steel, "x");
  const slot = addBox(group, [4, 74, 4], [-5, 95, 36], accent);
  slot.material.userData.categoryNeutral = true;
}

function buildLimb(sign, dimensions) {
  const rings = 56, sides = 12, positions = [], indices = [];
  const sample = t => ({
    y: sign * (dimensions.riserLengthMm / 2 - 4 + (dimensions.limbTipOffsetMm - dimensions.riserLengthMm / 2) * t),
    x: 1 + 14 * Math.sin(Math.PI * t) - 4 * t,
    z: 2 + 102 * Math.sin(Math.PI * t) + 28 * t,
    width: THREE.MathUtils.lerp(31, 8.5, Math.pow(t, 0.84)),
    depth: THREE.MathUtils.lerp(8.5, 3.3, t)
  });
  for (let i = 0; i <= rings; i++) {
    const t = i / rings, s = sample(t);
    for (let j = 0; j < sides; j++) {
      const angle = j / sides * Math.PI * 2;
      positions.push(s.x + Math.cos(angle) * s.width, s.y, s.z + Math.sin(angle) * s.depth);
    }
    if (i < rings) for (let j = 0; j < sides; j++) {
      const a = i * sides + j, b = i * sides + (j + 1) % sides, c = (i + 1) * sides + j, d = (i + 1) * sides + (j + 1) % sides;
      indices.push(a, c, b, b, c, d);
    }
  }
  const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3)); geo.setIndex(indices); geo.computeVertexNormals();
  return { geo, sample };
}
function makeLimbs(group, dimensions, color) {
  const finish = material(color, { metalness: 0.24, roughness: 0.3, clearcoat: 0.62 });
  const laminate = material("#4b344f", { metalness: 0.15, roughness: 0.44 });
  const edge = material("#cbb6e8", { metalness: 0.53, roughness: 0.24 });
  for (const sign of [-1, 1]) {
    const { geo, sample } = buildLimb(sign, dimensions);
    const limb = new THREE.Mesh(geo, finish.clone()); limb.castShadow = true; group.add(limb);
    for (const side of [-1, 1]) {
      const points = [];
      for (let i = 0; i <= 40; i++) {
        const t = i / 40, s = sample(t);
        points.push(new THREE.Vector3(s.x + side * s.width * 0.78, s.y, s.z + s.depth * 0.78));
      }
      const piping = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 48, 1.25, 6, false), edge.clone());
      group.add(piping);
    }
    for (const side of [-1, 1]) {
      const s = sample(0.95);
      addBox(group, [8, 16, 10], [s.x + side * 3.5, s.y, s.z], laminate.clone());
    }
    const tip = sample(1);
    addBox(group, [17, 17, 10], [tip.x, tip.y - sign * 3, tip.z], material("#372d40", { metalness: 0.62, roughness: 0.3 }));
  }
}

function makeSight(group, handedness, color) {
  const side = handedness === "left" ? -1 : 1;
  const railMat = material(color, { metalness: 0.78, roughness: 0.2, clearcoat: 0.32 });
  const black = material("#211d27", { metalness: 0.82, roughness: 0.23 });
  const scale = material("#d6cfdf", { metalness: 0.65, roughness: 0.24 });
  const apertureMat = material(color, { metalness: 0.82, roughness: 0.18 });
  addBox(group, [194, 8, 8], [side * 111, 30, 51], railMat);
  addBox(group, [38, 48, 25], [side * 203, 29, 52], black);
  addBox(group, [8, 96, 9], [side * 203, 23, 70], railMat);
  addBox(group, [8, 26, 9], [side * 203, 61, 70], scale);
  for (let y = -14; y <= 64; y += 9) addBox(group, [3, 1.6, 2], [side * 207, y, 78], scale);
  addCylinder(group, 9, 18, [side * 203, 2, 52], black, "x");
  addCylinder(group, 7, 21, [side * 203, 56, 52], railMat, "x");
  const aperture = new THREE.Mesh(new THREE.TorusGeometry(27, 3.4, 12, 56), apertureMat);
  aperture.position.set(side * 250, 32, 51); group.add(aperture);
  const inner = new THREE.Mesh(new THREE.TorusGeometry(20, 1.1, 8, 48), scale);
  inner.position.copy(aperture.position); group.add(inner);
  const pin = new THREE.Mesh(new THREE.SphereGeometry(2.4, 14, 12), material("#ff795f", { metalness: 0.08, roughness: 0.5 }));
  pin.position.set(side * 250, 32, 55); group.add(pin);
}
function makeString(group, dimensions, color) {
  const tip = dimensions.limbTipOffsetMm;
  const points = [new THREE.Vector3(-3, -tip, 30), new THREE.Vector3(-1, -tip * 0.48, 31), new THREE.Vector3(0, 0, 32), new THREE.Vector3(1, tip * 0.48, 31), new THREE.Vector3(3, tip, 30)];
  const curve = new THREE.CatmullRomCurve3(points);
  const stringMat = material(color, { metalness: 0.08, roughness: 0.24, clearcoat: 0.65 });
  const line = new THREE.Mesh(new THREE.TubeGeometry(curve, 90, 1.65, 8, false), stringMat); group.add(line);
  const serving = material("#a990c5", { metalness: 0.22, roughness: 0.58 });
  const centre = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 100, 12), serving); centre.position.set(0, 1, 31); group.add(centre);
  addBox(group, [37, 5, 20], [42, -6, 40], material("#d9d4df", { metalness: 0.62, roughness: 0.25 }));
  addBox(group, [4, 28, 6], [27, 4, 44], material("#17141d", { metalness: 0.55, roughness: 0.32 }));
  const nock = new THREE.Mesh(new THREE.SphereGeometry(5, 16, 12), material("#f3c96e", { metalness: 0.18, roughness: 0.3 })); nock.position.set(0, 0, 35); group.add(nock);
}

function rodLength(product, fallback) {
  const selected = Number(product?.rodLengthInches);
  if (Number.isFinite(selected) && selected > 0) return selected * 25.4;
  const match = String(product?.dimensions ?? product?.label ?? "").match(/\b(10|11|12|26|28|30)\s*[″"']/);
  return (Number(match?.[1]) || fallback) * 25.4;
}
function makeStabilization(group, selectedAccessories, colors) {
  const carbon = material(safeColor(colors.longRod, DEFAULTS.longRod), { metalness: 0.68, roughness: 0.23, clearcoat: 0.38 });
  const shortCarbon = material(safeColor(colors.shortRod, DEFAULTS.shortRod), { metalness: 0.68, roughness: 0.23, clearcoat: 0.38 });
  const hardware = material(safeColor(colors.vbar, DEFAULTS.vbar), { metalness: 0.78, roughness: 0.2 });
  const hub = material("#34303b", { metalness: 0.72, roughness: 0.28 });
  const long = selectedAccessories.longRod;
  const longMm = rodLength(long, 28);
  addCylinder(group, 9, 32, [1, -24, 66], hardware, "z");
  addRod(group, [1, -24, 78], [1, -24, 78 + longMm], 8, carbon, 6);
  addCylinder(group, 13, 36, [1, -24, 78 + longMm], hub, "z");
  addCylinder(group, 14, 32, [1, -24, 91 + longMm], hardware, "z");
  const shortMm = rodLength(selectedAccessories.shortRod, 10);
  const vbar = selectedAccessories.vbar;
  const angleMatch = String(vbar?.dimensions ?? "").match(/\b(40|45)\s*°/);
  const vbarAngle = THREE.MathUtils.degToRad(Number(vbar?.previewAngleDegrees ?? angleMatch?.[1] ?? 40));
  const hubPos = [0, -39, 49];
  addBox(group, [46, 18, 24], hubPos, hub);
  addCylinder(group, 12, 25, [0, -39, 62], hardware, "z");
  for (const side of [-1, 1]) {
    const start = [side * 15, -39, 44];
    const end = [side * (shortMm * Math.cos(vbarAngle)), -39, 44 - shortMm * Math.sin(vbarAngle)];
    addRod(group, start, end, 7.2, shortCarbon, 5.5);
    addCylinder(group, 10, 23, end, hub, "x");
    addCylinder(group, 11, 22, [end[0] + side * 7, end[1], end[2]], hardware, "x");
  }
}

function makeImportedAccessory(group, part) {
  const color = part.color ?? "#94899d";
  if (part.modelKind === "stabilizer") {
    const length = rodLength(part, 10);
    addRod(group, [30, 0, 44], [30, 0, 44 + length], 6, material(color));
  } else if (part.modelKind === "vbar") {
    const mat = material(color);
    addRod(group, [35, 0, 51], [112, 40, 27], 5, mat);
    addRod(group, [35, 0, 51], [112, -40, 27], 5, mat);
  } else if (part.modelKind === "arrow-rest") {
    addBox(group, [32, 6, 20], [29, -7, 40], material(color));
    addBox(group, [5, 22, 10], [14, 2, 40], material(color));
  } else if (part.modelKind === "plunger") {
    addCylinder(group, 7, 28, [39, -8, 46], material(color), "x");
  } else if (part.modelKind === "clicker") {
    addBox(group, [3, 138, 3], [37, 72, 52], material(color));
    addBox(group, [12, 7, 5], [37, 4, 52], material(color));
  } else if (part.modelKind === "grip") addBox(group, [24, 92, 42], [-5, 0, 3], material(color, { metalness: 0.08, roughness: 0.6 }));
  else if (part.modelKind === "sight-pin") {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(8, 2, 8, 28), material(color)); ring.position.set(222, 19, 53); group.add(ring);
  }
}
function disposeChildren(group) {
  for (const child of group.children) child.traverse(object => {
    object.geometry?.dispose();
    if (Array.isArray(object.material)) object.material.forEach(mat => mat.dispose()); else object.material?.dispose();
  });
  group.clear();
}

export function createBowRenderer(canvas) {
  let webgl;
  try { webgl = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance", alpha: false }); }
  catch { throw new Error("Bu tarayıcı etkileşimli 3D önizlemeyi desteklemiyor. Güncel bir tarayıcı deneyin."); }
  webgl.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
  webgl.outputColorSpace = THREE.SRGBColorSpace;
  webgl.toneMapping = THREE.ACESFilmicToneMapping;
  webgl.toneMappingExposure = 1.08;
  webgl.setClearColor("#17111f", 1);
  webgl.shadowMap.enabled = true;
  webgl.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight("#f2eaff", "#201429", 2.2));
  const key = new THREE.DirectionalLight("#fff0d9", 3.2); key.position.set(-850, 950, 1550); key.castShadow = true; scene.add(key);
  const fill = new THREE.DirectionalLight("#d0b2ff", 1.25); fill.position.set(900, 200, 500); scene.add(fill);
  const rim = new THREE.DirectionalLight("#9772e6", 1.5); rim.position.set(-450, 300, -850); scene.add(rim);
  const camera = new THREE.PerspectiveCamera(33, 1, 1, 12000);
  const controls = new OrbitControls(camera, webgl.domElement);
  controls.enableDamping = false; controls.enablePan = false;
  controls.minPolarAngle = 0.28; controls.maxPolarAngle = Math.PI - 0.28;
  const root = new THREE.Group(); scene.add(root);
  const groups = Object.fromEntries(COMPONENTS.map(key => { const group = new THREE.Group(); group.userData.category = key; root.add(group); return [key, group]; }));
  const importedGroups = Object.fromEntries(IMPORTED_COMPONENTS.map(key => [key, new THREE.Group()]));
  Object.values(importedGroups).forEach(group => root.add(group));
  const visible = Object.fromEntries(COMPONENTS.map(key => [key, true]));
  let signature = "", framePending = false, disposed = false;

  function renderOnce() {
    if (framePending || disposed) return;
    framePending = true;
    requestAnimationFrame(() => { framePending = false; if (!disposed) webgl.render(scene, camera); });
  }
  controls.addEventListener("change", renderOnce);
  function resize() {
    const { width, height } = canvas.getBoundingClientRect(); if (!width || !height) return;
    webgl.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix(); renderOnce();
  }
  const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(canvas); window.addEventListener("resize", resize);

  function update({ selection, colors, bowLengthInches = 68, handedness = "right", importedParts = [], selectedAccessories = {} }) {
    const importedRiser = importedParts.find(part => part.modelKind === "riser");
    const riserLength = Number(importedRiser?.riserLengthInches) || getRiserLengthInches(selection.riserPart);
    const dimensions = calculateModelDimensions(riserLength, bowLengthInches);
    const detail = Object.fromEntries(Object.entries(selectedAccessories).map(([key, part]) => [key, [part?.id, part?.dimensions, part?.rodLengthInches].join(":")]));
    const importedSignature = importedParts.map(part => [part.id, part.modelKind, part.label, part.color, part.riserLengthInches].join(":" )).join(";");
    const next = [selection.riser, selection.limbs, selection.sight, selection.string, dimensions.bowLengthInches, dimensions.riserLengthInches, handedness, JSON.stringify(colors), JSON.stringify(detail), importedSignature].join("|");
    if (signature !== next) {
      COMPONENTS.forEach(key => disposeChildren(groups[key]));
      Object.values(importedGroups).forEach(disposeChildren);
      makeRiser(groups.riser, dimensions.riserLengthMm, safeColor(colors.riser, DEFAULTS.riser));
      makeLimbs(groups.limbs, dimensions, safeColor(colors.limbs, DEFAULTS.limbs));
      makeSight(groups.sight, handedness, safeColor(colors.sight, DEFAULTS.sight));
      makeString(groups.string, dimensions, safeColor(colors.string, DEFAULTS.string));
      makeStabilization(groups.accessories, selectedAccessories, colors);
      const importedKinds = new Set(importedParts.map(part => part.modelKind));
      for (const part of importedParts) {
        const kind = part.modelKind, color = part.color ?? (kind in DEFAULTS ? DEFAULTS[kind] : "#8a8491");
        if (kind === "riser") makeRiser(importedGroups.riser, dimensions.riserLengthMm, color);
        else if (kind === "limbs") makeLimbs(importedGroups.limbs, dimensions, color);
        else if (kind === "sight") makeSight(importedGroups.sight, part.handedness ?? handedness, color);
        else if (kind === "string") makeString(importedGroups.string, dimensions, color);
        else if (part.modelable) makeImportedAccessory(importedGroups.accessories, part);
      }
      for (const key of COMPONENTS.slice(0, 4)) groups[key].visible = visible[key] && !importedKinds.has(key);
      groups.accessories.visible = visible.accessories;
      for (const key of IMPORTED_COMPONENTS) importedGroups[key].visible = key === "accessories" ? visible.accessories : visible[key];
      const rodDepth = rodLength(selectedAccessories.longRod, 28) + 180;
      signature = next;
      const distance = dimensions.bowLengthMm * 1.72 + rodDepth * 0.32;
      camera.position.set(dimensions.bowLengthMm * 0.82, dimensions.bowLengthMm * 0.11, distance);
      camera.near = Math.max(1, dimensions.bowLengthMm / 1500); camera.far = dimensions.bowLengthMm * 10; camera.updateProjectionMatrix();
      controls.target.set(0, 0, rodDepth * 0.15); controls.minDistance = dimensions.bowLengthMm * 0.82; controls.maxDistance = dimensions.bowLengthMm * 3.7; controls.update(); controls.saveState();
    }
    for (const key of COMPONENTS) groups[key].visible = visible[key] && !importedParts.some(part => part.modelKind === key);
    for (const key of IMPORTED_COMPONENTS) importedGroups[key].visible = visible[key];
    renderOnce(); return dimensions;
  }
  function setComponentVisibility(category, isVisible) {
    if (!(category in visible)) return;
    visible[category] = Boolean(isVisible);
    if (groups[category]) groups[category].visible = visible[category];
    if (importedGroups[category]) importedGroups[category].visible = visible[category];
    renderOnce();
  }
  function resetView() { controls.reset(); controls.target.set(0, 0, 100); controls.update(); renderOnce(); }
  function dispose() {
    disposed = true; resizeObserver.disconnect(); window.removeEventListener("resize", resize); controls.removeEventListener("change", renderOnce); controls.dispose();
    COMPONENTS.forEach(key => disposeChildren(groups[key])); Object.values(importedGroups).forEach(disposeChildren); webgl.dispose();
  }
  resize(); return { update, setComponentVisibility, resetView, dispose };
}
