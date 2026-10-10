import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { calculateModelDimensions, getRiserLengthInches } from "./modeling.js";

const DEFAULTS = { riser: "#7752b2", limbs: "#d9d4de", sight: "#262332", string: "#af486d" };
const COMPONENTS = ["riser", "limbs", "sight", "string"];
const safeColor = (value, fallback) => /^#[\da-f]{6}$/i.test(value ?? "") ? value : fallback;

function createMaterial(color, { metalness = 0.45, roughness = 0.34, tint = 1 } = {}) {
  const material = new THREE.MeshStandardMaterial({ color, metalness, roughness, side: THREE.DoubleSide });
  material.userData.tint = tint;
  return material;
}

function addBox(group, dimensions, position, material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...dimensions), material);
  mesh.position.set(...position);
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  group.add(mesh);
  return mesh;
}

function makeRiser(group, lengthMm, color) {
  const half = lengthMm / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-23, -half + 16);
  shape.lineTo(15, -half);
  shape.lineTo(24, -half + 22);
  shape.lineTo(17, -half * 0.29);
  shape.quadraticCurveTo(11, -78, 9, -43);
  shape.quadraticCurveTo(9, -23, 26, -14);
  shape.lineTo(44, -9);
  shape.lineTo(42, -2);
  shape.lineTo(15, -2);
  shape.lineTo(13, 25);
  shape.quadraticCurveTo(11, 56, 18, 92);
  shape.lineTo(24, half - 22);
  shape.lineTo(15, half);
  shape.lineTo(-22, half - 14);
  shape.lineTo(-20, half * 0.25);
  shape.quadraticCurveTo(-16, 0, -21, -half * 0.2);
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: 66, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 3, bevelThickness: 3, curveSegments: 10 });
  geometry.translate(0, 0, -33);
  const body = new THREE.Mesh(geometry, createMaterial(color, { metalness: 0.72, roughness: 0.27 }));
  body.castShadow = true;
  group.add(body);

  // Grip, limb pockets and visible mounting hardware remain separate meshes.
  addBox(group, [26, 112, 54], [-5, 0, 1], createMaterial(color, { metalness: 0.12, roughness: 0.56, tint: 0.76 }));
  const boltMaterial = createMaterial("#d7d1df", { metalness: 0.86, roughness: 0.22 });
  for (const sign of [-1, 1]) {
    const bolt = new THREE.Mesh(new THREE.CylinderGeometry(7, 7, 6, 20), boltMaterial);
    bolt.rotation.x = Math.PI / 2;
    bolt.position.set(0, sign * (half - 28), 39);
    group.add(bolt);
  }
}

function makeLimbGeometry(sign, dimensions) {
  const rings = 36;
  const positions = [];
  const indices = [];
  for (let i = 0; i <= rings; i++) {
    const t = i / rings;
    const y = sign * (dimensions.riserLengthMm / 2 + dimensions.limbLengthMm * t);
    const x = 3 + 17 * Math.sin(Math.PI * t) - 4 * t;
    const z = -4 + 19 * Math.sin(Math.PI * t) - 11 * t;
    const halfWidth = THREE.MathUtils.lerp(24, 8, t);
    const halfDepth = THREE.MathUtils.lerp(11, 5, t);
    positions.push(x - halfWidth, y, z - halfDepth, x + halfWidth, y, z - halfDepth, x + halfWidth, y, z + halfDepth, x - halfWidth, y, z + halfDepth);
    if (i < rings) {
      const a = i * 4, b = a + 4;
      for (let edge = 0; edge < 4; edge++) {
        const next = (edge + 1) % 4;
        indices.push(a + edge, b + edge, a + next, a + next, b + edge, b + next);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function makeLimbs(group, dimensions, color) {
  const limbMaterial = createMaterial(color, { metalness: 0.18, roughness: 0.4 });
  for (const sign of [-1, 1]) {
    const limb = new THREE.Mesh(makeLimbGeometry(sign, dimensions), limbMaterial.clone());
    limb.material.userData.tint = 1;
    limb.castShadow = true;
    group.add(limb);
    const pocket = addBox(group, [49, 28, 76], [0, sign * (dimensions.riserLengthMm / 2 - 8), 0], createMaterial("#34303c", { metalness: 0.72, roughness: 0.28 }));
    pocket.material.userData.categoryNeutral = true;
  }
  limbMaterial.dispose();
}

function makeSight(group, handedness, color) {
  const side = handedness === "left" ? -1 : 1;
  const material = createMaterial(color, { metalness: 0.78, roughness: 0.24 });
  addBox(group, [178, 8, 8], [side * 98, 16, 48], material);
  addBox(group, [28, 32, 20], [side * 177, 16, 48], material.clone());
  const aperture = new THREE.Mesh(new THREE.TorusGeometry(29, 3.2, 10, 48), material.clone());
  aperture.position.set(side * 222, 19, 48);
  group.add(aperture);
  const pin = new THREE.Mesh(new THREE.SphereGeometry(2.8, 12, 8), createMaterial("#ff765d", { metalness: 0.15, roughness: 0.5 }));
  pin.position.copy(aperture.position);
  pin.position.x -= side * 4;
  group.add(pin);
}

function makeString(group, dimensions, color) {
  const tip = dimensions.limbTipOffsetMm;
  const geometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, -tip, 5),
    new THREE.Vector3(0, tip, 5)
  ]);
  const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color, linewidth: 2 }));
  group.add(line);
  const nock = new THREE.Mesh(new THREE.SphereGeometry(5.5, 14, 10), createMaterial(color, { metalness: 0.12, roughness: 0.48 }));
  nock.position.set(0, 0, 7);
  group.add(nock);
  const rest = new THREE.Mesh(new THREE.BoxGeometry(45, 5, 18), createMaterial("#bbb3c7", { metalness: 0.35, roughness: 0.4 }));
  rest.position.set(36, 0, 33);
  group.add(rest);
}

function disposeChildren(group) {
  for (const child of group.children) {
    child.traverse(object => {
      object.geometry?.dispose();
      if (Array.isArray(object.material)) object.material.forEach(material => material.dispose());
      else object.material?.dispose();
    });
  }
  group.clear();
}

export function createBowRenderer(canvas) {
  let webgl;
  try {
    webgl = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "low-power", alpha: false });
  } catch {
    throw new Error("Bu tarayıcı WebGL 2D/3D önizlemesini desteklemiyor. Güncel bir tarayıcı deneyin.");
  }
  webgl.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  webgl.outputColorSpace = THREE.SRGBColorSpace;
  webgl.toneMapping = THREE.ACESFilmicToneMapping;
  webgl.toneMappingExposure = 1.12;
  webgl.setClearColor("#17111f", 1);

  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight("#e8dcff", "#120d19", 2.0));
  const keyLight = new THREE.DirectionalLight("#fff1dc", 2.4);
  keyLight.position.set(-900, 1200, 1400);
  scene.add(keyLight);
  const rimLight = new THREE.DirectionalLight("#a583ff", 1.4);
  rimLight.position.set(850, 300, -900);
  scene.add(rimLight);

  const camera = new THREE.PerspectiveCamera(38, 1, 1, 16000);
  const controls = new OrbitControls(camera, webgl.domElement);
  controls.enableDamping = false;
  controls.enablePan = false;
  controls.minPolarAngle = 0.25;
  controls.maxPolarAngle = Math.PI - 0.25;
  controls.minDistance = 650;
  controls.maxDistance = 9000;
  const modelRoot = new THREE.Group();
  scene.add(modelRoot);
  const groups = Object.fromEntries(COMPONENTS.map(key => {
    const group = new THREE.Group();
    group.userData.category = key;
    modelRoot.add(group);
    return [key, group];
  }));
  const visible = Object.fromEntries(COMPONENTS.map(key => [key, true]));
  let signature = "";
  let framePending = false;
  let disposed = false;

  function renderOnce() {
    if (framePending || disposed) return;
    framePending = true;
    requestAnimationFrame(() => {
      framePending = false;
      if (!disposed) webgl.render(scene, camera);
    });
  }
  controls.addEventListener("change", renderOnce);

  function resize() {
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return;
    webgl.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderOnce();
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  window.addEventListener("resize", resize);

  function update({ selection, colors, bowLengthInches = 68, handedness = "right" }) {
    const riserLength = getRiserLengthInches(selection.riserPart);
    const dimensions = calculateModelDimensions(riserLength, bowLengthInches);
    const nextSignature = [selection.riser, selection.limbs, selection.sight, selection.string, dimensions.bowLengthInches, dimensions.riserLengthInches, handedness].join("|");
    if (signature !== nextSignature) {
      for (const key of COMPONENTS) disposeChildren(groups[key]);
      makeRiser(groups.riser, dimensions.riserLengthMm, safeColor(colors.riser, DEFAULTS.riser));
      makeLimbs(groups.limbs, dimensions, safeColor(colors.limbs, DEFAULTS.limbs));
      makeSight(groups.sight, handedness, safeColor(colors.sight, DEFAULTS.sight));
      makeString(groups.string, dimensions, safeColor(colors.string, DEFAULTS.string));
      signature = nextSignature;
      const distance = dimensions.bowLengthMm * 1.52;
      camera.position.set(dimensions.bowLengthMm * 0.11, dimensions.bowLengthMm * 0.035, distance);
      camera.near = Math.max(1, dimensions.bowLengthMm / 1200);
      camera.far = dimensions.bowLengthMm * 12;
      camera.updateProjectionMatrix();
      controls.target.set(0, 0, 0);
      controls.minDistance = dimensions.bowLengthMm * 0.72;
      controls.maxDistance = dimensions.bowLengthMm * 4.2;
      controls.update();
      controls.saveState();
    } else {
      for (const key of COMPONENTS) {
        const tint = new THREE.Color(safeColor(colors[key], DEFAULTS[key]));
        groups[key].traverse(object => {
          const material = object.material;
          if (!material?.color || material.userData.categoryNeutral) return;
          material.color.copy(tint).multiplyScalar(material.userData.tint ?? 1);
        });
      }
    }
    for (const key of COMPONENTS) groups[key].visible = visible[key];
    renderOnce();
    return dimensions;
  }

  function setComponentVisibility(category, isVisible) {
    if (!groups[category]) return;
    visible[category] = Boolean(isVisible);
    groups[category].visible = visible[category];
    renderOnce();
  }

  function resetView() {
    controls.reset();
    controls.target.set(0, 0, 0);
    controls.update();
    renderOnce();
  }

  function dispose() {
    disposed = true;
    resizeObserver.disconnect();
    window.removeEventListener("resize", resize);
    controls.removeEventListener("change", renderOnce);
    controls.dispose();
    for (const key of COMPONENTS) disposeChildren(groups[key]);
    webgl.dispose();
  }

  resize();
  return { update, setComponentVisibility, resetView, dispose };
}

