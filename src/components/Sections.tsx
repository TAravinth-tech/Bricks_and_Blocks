import { useEffect, useRef, useState } from 'react'
import { ArrowRight, ArrowUpRight, Check, Quote, Star } from 'lucide-react'
import { brand, features, marqueeProducts, processSteps, stats, testimonials } from '../data/site-data'



import * as THREE from "three";

/* =========================================================
   Three.js backdrop
   - dim brick wall that assembles itself (background)
   - paver floor with a travelling ripple
   - a HOUSE on the right, built piece by piece:
       concrete-block plinth -> brick walls (running bond, door,
       windows) -> gable ends -> red roof tiles -> chimney -> smoke
   - camera + scene react to the mouse

   SPEED TUNING (all in one place):
   - SPEED      : global speed dial (1 = old speed, 1.6 = faster)
   - LOOP       : seconds (in animation time) before the build replays; 0 = play once
   - DROP_HOUSE : how long each house piece takes to fall (smaller = faster)
   - DROP_WALL  : how long each background brick takes to fall
   ========================================================= */
const SPEED = 1.6;
const LOOP = 0; // e.g. 12 to rebuild every 12s (must be bigger than houseDone)
const DROP_HOUSE = 0.6;
const DROP_WALL = 1.0;

const easeOutBack = (t: number) => {
  const c1 = 1.2;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
const rnd = (a = 0, b = 1) => a + Math.random() * (b - a);

function ThreeBackdrop() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    const section = mount?.parentElement;
    if (!mount || !section) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return; // no WebGL: the CSS background still looks fine
    }
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x08152f, 12, 32);
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    let baseZ = 11;
    camera.position.set(0, 0.5, baseZ);

    /* ---------- lights ---------- */
    scene.add(new THREE.AmbientLight(0x8fb0ff, 0.95));
    const sun = new THREE.DirectionalLight(0xffffff, 1.8);
    sun.position.set(5, 8, 8);
    scene.add(sun);
    const goldLight = new THREE.PointLight(0xffc400, 120, 30);
    goldLight.position.set(-8, 2, 4);
    scene.add(goldLight);
    const redLight = new THREE.PointLight(0xe30613, 70, 30);
    redLight.position.set(9, -2, 3);
    scene.add(redLight);

    const rig = new THREE.Group();
    scene.add(rig);

    const disposables: { dispose(): void }[] = [];
    const color = new THREE.Color();

    /* ---------- background brick wall (dimmed so the house stands out) ---------- */
    const COLS = 12;
    const ROWS = 9;
    const BW = 1.7;
    const BH = 0.8;
    const brickGeo = new THREE.BoxGeometry(BW - 0.08, BH - 0.08, 0.9);
    const brickMat = new THREE.MeshStandardMaterial({ roughness: 0.55, metalness: 0.15 });
    const wall = new THREE.InstancedMesh(brickGeo, brickMat, COLS * ROWS);
    disposables.push(brickGeo, brickMat, wall);
    rig.add(wall);

    const palette = [0x123a73, 0x16407f, 0x0f2f5f, 0x143c78];
    const bricks = Array.from({ length: COLS * ROWS }, (_, i) => {
      const r = Math.floor(i / COLS);
      const c = i % COLS;
      const target = new THREE.Vector3(
        (c - COLS / 2) * BW + (r % 2 ? BW / 2 : 0) + BW / 2,
        (r - ROWS / 2) * BH + 1.2,
        -6
      );
      const start = new THREE.Vector3(
        target.x * 1.5 + (Math.random() - 0.5) * 4,
        10 + Math.random() * 8,
        -2 + Math.random() * 6
      );
      const rot = new THREE.Vector3(
        (Math.random() - 0.5) * Math.PI * 2,
        (Math.random() - 0.5) * Math.PI * 2,
        (Math.random() - 0.5) * Math.PI * 2
      );
      // faster: delays halved
      const delay = r * 0.04 + c * 0.02 + Math.random() * 0.15 + 0.1;
      const roll = Math.random();
      color.setHex(roll < 0.05 ? 0xb88a00 : roll < 0.09 ? 0x9c0a14 : palette[i % palette.length]);
      wall.setColorAt(i, color);
      return { target, start, rot, delay, c };
    });
    if (wall.instanceColor) wall.instanceColor.needsUpdate = true;

    /* ---------- paver floor ---------- */
    const PX = 17;
    const PZ = 10;
    const paverGeo = new THREE.BoxGeometry(1.32, 0.14, 1.32);
    const paverMat = new THREE.MeshStandardMaterial({ roughness: 0.7, metalness: 0.05 });
    const floor = new THREE.InstancedMesh(paverGeo, paverMat, PX * PZ);
    disposables.push(paverGeo, paverMat, floor);
    rig.add(floor);
    const pavers = Array.from({ length: PX * PZ }, (_, i) => {
      const x = ((i % PX) - PX / 2) * 1.5;
      const z = Math.floor(i / PX) * 1.5 - 9;
      const roll = Math.random();
      color.setHex(roll < 0.04 ? 0xffc400 : (i + Math.floor(i / PX)) % 2 ? 0x2a4a7f : 0x335b9e);
      floor.setColorAt(i, color);
      return { x, z };
    });
    if (floor.instanceColor) floor.instanceColor.needsUpdate = true;

    /* ---------- floating blocks (kept to the right half) ---------- */
    const floatGeo = new THREE.BoxGeometry(1.2, 0.55, 0.65);
    disposables.push(floatGeo);
    const floatSpecs: [number, number, number, number, number][] = [
      [1.6, 3.7, 1.5, 0xffc400, 0.0],
      [8.8, 3.4, 0.2, 0x2a62c4, 2.1],
      [9.0, -1.8, 2.4, 0xe30613, 1.2],
    ];
    const floaters = floatSpecs.map(([x, y, z, hex, phase]) => {
      const mat = new THREE.MeshStandardMaterial({
        color: hex,
        roughness: 0.4,
        metalness: 0.2,
        emissive: hex,
        emissiveIntensity: 0.12,
      });
      disposables.push(mat);
      const mesh = new THREE.Mesh(floatGeo, mat);
      mesh.position.set(x, y, z);
      rig.add(mesh);
      return { mesh, y, phase };
    });

    /* =====================================================
       HOUSE — bricks, blocks and roof tiles that build themselves
       ===================================================== */
    type Piece = {
      pos: [number, number, number];
      size: [number, number, number];
      rot?: [number, number, number];
      hex: number;
      delay: number;
      glow?: boolean;
    };
    const pieces: Piece[] = [];

    const BL = 0.6; // brick length
    const BHT = 0.3; // brick height
    const BT = 0.4; // wall thickness
    const GAP = 0.025;
    const HW = 5.4; // house width  (x)
    const HDP = 4.4; // house depth  (z)
    const Y0 = 0.22; // plinth height
    const WALL_ROWS = 9;
    const rowY = (r: number) => Y0 + (r + 0.5) * BHT;
    // faster: starts at 0.6s (was 1.3) and each row every 0.12s (was 0.22)
    const tRow = (r: number) => 0.6 + r * 0.12;

    const tones = [0xe9dcc0, 0xdfd0b0, 0xefe3ca, 0xd8c8a6];
    const tone = () => tones[Math.floor(Math.random() * tones.length)];

    /* 1. plinth of concrete blocks */
    const PNX = 10;
    const PNZ = 8;
    const pbz = (HDP + 0.6) / PNZ;
    for (let i = 0; i < PNX; i++) {
      for (let j = 0; j < PNZ; j++) {
        if (i !== 0 && i !== PNX - 1 && j !== 0 && j !== PNZ - 1) continue;
        pieces.push({
          pos: [(i - (PNX - 1) / 2) * BL, Y0 / 2, (j - (PNZ - 1) / 2) * pbz],
          size: [BL - 0.02, Y0, pbz - 0.02],
          hex: (i + j) % 2 ? 0x8b98ad : 0x7d8aa1,
          delay: rnd(0.2, 0.6),
        });
      }
    }
    // front step
    pieces.push({ pos: [0, 0.06, HDP / 2 + 0.6], size: [1.5, 0.12, 0.5], hex: 0xa0acc0, delay: 0.6 });

    /* 2. brick walls in running bond, with door + window openings */
    const brick = (x: number, y: number, z: number, len: number, rotY: number, r: number) =>
      pieces.push({
        pos: [x, y, z],
        size: [len - GAP, BHT - GAP, BT],
        rot: [0, rotY, 0],
        hex: tone(),
        delay: tRow(r) + rnd(0, 0.1),
      });
    // fills [a,b] with bricks; odd rows start with a half brick (running bond)
    const lay = (a: number, b: number, r: number, place: (c: number, len: number) => void) => {
      let p = a;
      let first = true;
      while (b - p > 0.01) {
        let len = Math.min(BL, b - p);
        if (first && r % 2 === 1) len = Math.min(BL / 2, b - p);
        place(p + len / 2, len);
        p += len;
        first = false;
      }
    };
    // solid stretches of a wall once the openings are cut out
    const segments = (from: number, to: number, opens: [number, number][]) => {
      const segs: [number, number][] = [];
      let cur = from;
      [...opens]
        .sort((p, q) => p[0] - q[0])
        .forEach(([x0, x1]) => {
          if (x0 > cur) segs.push([cur, x0]);
          cur = Math.max(cur, x1);
        });
      if (cur < to) segs.push([cur, to]);
      return segs;
    };
    type Open = [number, number, number, number]; // from, to, firstRow, lastRow
    const frontOpen: Open[] = [
      [-0.6, 0.6, 0, 6], // door
      [-2.1, -1.2, 3, 5], // window
      [1.2, 2.1, 3, 5], // window
    ];
    const leftOpen: Open[] = [[-0.6, 0.6, 3, 5]]; // side window
    const openingsFor = (list: Open[], r: number) =>
      list.filter((o) => r >= o[2] && r <= o[3]).map((o) => [o[0], o[1]] as [number, number]);

    const zf = HDP / 2 - BT / 2; // front / back wall centre
    const xs = HW / 2 - BT / 2; // side wall centre
    const zin = HDP / 2 - BT; // side wall half-length

    for (let r = 0; r < WALL_ROWS; r++) {
      const y = rowY(r);
      segments(-HW / 2, HW / 2, openingsFor(frontOpen, r)).forEach(([a, b]) =>
        lay(a, b, r, (c, len) => brick(c, y, zf, len, 0, r))
      );
      lay(-HW / 2, HW / 2, r, (c, len) => brick(c, y, -zf, len, 0, r));
      segments(-zin, zin, openingsFor(leftOpen, r)).forEach(([a, b]) =>
        lay(a, b, r, (c, len) => brick(-xs, y, c, len, Math.PI / 2, r))
      );
      lay(-zin, zin, r, (c, len) => brick(xs, y, c, len, Math.PI / 2, r));
    }

    /* 3. gable ends: brick rows that shrink up to the roof line */
    const TAN = 0.62;
    const THETA = Math.atan(TAN);
    const yEave = Y0 + WALL_ROWS * BHT - 0.1;
    const zEave = HDP / 2 + 0.35;
    const yRidge = yEave + zEave * TAN;
    for (let r = WALL_ROWS; r < WALL_ROWS + 6; r++) {
      const zmax = Math.min(zEave - (rowY(r) + BHT / 2 - yEave) / TAN, zin);
      if (zmax < 0.2) break;
      lay(-zmax, zmax, r, (c, len) => {
        brick(-xs, rowY(r), c, len, Math.PI / 2, r);
        brick(xs, rowY(r), c, len, Math.PI / 2, r);
      });
    }

    /* 4. door, windows, sills */
    const doorT = tRow(7) + 0.3;
    pieces.push({ pos: [0, Y0 + 1.05, zf], size: [1.16, 2.06, 0.12], hex: 0xffc400, delay: doorT });
    pieces.push({ pos: [0.4, Y0 + 1.0, zf + 0.08], size: [0.08, 0.08, 0.08], hex: 0x7a1118, delay: doorT + 0.12 });
    for (const x of [-1.65, 1.65]) {
      pieces.push({ pos: [x, Y0 + 1.35, zf], size: [0.86, 0.86, 0.08], hex: 0xfff1b0, glow: true, delay: tRow(6) + 0.3 });
      pieces.push({ pos: [x, Y0 + 0.86, zf + 0.1], size: [1.0, 0.08, 0.2], hex: 0x8b98ad, delay: tRow(4) });
    }
    pieces.push({
      pos: [-xs, Y0 + 1.35, 0],
      size: [0.08, 0.86, 1.16],
      hex: 0xfff1b0,
      glow: true,
      delay: tRow(6) + 0.35,
    });

    /* 5. roof tiles (two slopes) + ridge cap */
    const ROOF_STEP = 0.15; // was 0.28 -> faster roof
    const roofStart = tRow(WALL_ROWS + 4) + 0.4;
    const TLEN = 0.5;
    const TROWS = Math.round(zEave / Math.cos(THETA) / TLEN);
    const TNX = 10;
    for (const side of [1, -1]) {
      for (let i = 0; i < TROWS; i++) {
        const s = (i + 0.5) * TLEN; // distance from ridge along the slope
        for (let k = 0; k < TNX; k++) {
          pieces.push({
            pos: [(k - (TNX - 1) / 2) * 0.6, yRidge - s * Math.sin(THETA) + 0.035, side * s * Math.cos(THETA)],
            size: [0.58, 0.07, TLEN + 0.04],
            rot: [side * THETA, 0, 0],
            hex: (i + k) % 2 ? 0xe30613 : 0xc90612,
            delay: roofStart + (TROWS - 1 - i) * ROOF_STEP + k * 0.015 + rnd(0, 0.05), // eaves first
          });
        }
      }
    }
    for (let k = 0; k < TNX; k++) {
      pieces.push({
        pos: [(k - (TNX - 1) / 2) * 0.6, yRidge + 0.07, 0],
        size: [0.58, 0.14, 0.28],
        hex: 0x7a1118,
        delay: roofStart + TROWS * ROOF_STEP + 0.08 + k * 0.025,
      });
    }

    /* 6. chimney */
    const CHIM_STEP = 0.12; // was 0.22 -> faster chimney
    const chimStart = roofStart + TROWS * ROOF_STEP + 0.4;
    for (let k = 0; k < 6; k++) {
      pieces.push({
        pos: [1.6, 3.75 + k * 0.3, -0.7],
        size: [0.5, 0.28, 0.5],
        hex: k % 2 ? 0x8f1a21 : 0x7a1118,
        delay: chimStart + k * CHIM_STEP,
      });
    }
    pieces.push({ pos: [1.6, 5.45, -0.7], size: [0.64, 0.1, 0.64], hex: 0x56607a, delay: chimStart + 6 * CHIM_STEP });

    const houseDone = Math.max(...pieces.map((p) => p.delay)) + 0.8;

    /* ---- turn the pieces into two instanced meshes (solid + glowing) ---- */
    const unitGeo = new THREE.BoxGeometry(1, 1, 1);
    const solidMat = new THREE.MeshStandardMaterial({ roughness: 0.65, metalness: 0.05 });
    const glowMat = new THREE.MeshStandardMaterial({
      roughness: 0.4,
      emissive: 0xffd35a,
      emissiveIntensity: 0.9,
    });
    const solidList = pieces.filter((p) => !p.glow);
    const glowList = pieces.filter((p) => p.glow);
    const solidMesh = new THREE.InstancedMesh(unitGeo, solidMat, solidList.length);
    const glowMesh = new THREE.InstancedMesh(unitGeo, glowMat, glowList.length);
    disposables.push(unitGeo, solidMat, glowMat, solidMesh, glowMesh);

    const makeItems = (list: Piece[], mesh: THREE.InstancedMesh) =>
      list.map((p, i) => {
        const target = new THREE.Vector3(...p.pos);
        const trot = new THREE.Vector3(...(p.rot ?? [0, 0, 0]));
        const size = new THREE.Vector3(...p.size);
        const start = new THREE.Vector3(target.x + rnd(-3, 3), target.y + rnd(5, 10), target.z + rnd(-3, 3));
        const srot = new THREE.Vector3(rnd(-3, 3), rnd(-3, 3), rnd(-3, 3));
        color.setHex(p.hex);
        mesh.setColorAt(i, color);
        return { target, trot, size, start, srot, delay: p.delay };
      });
    const houseParts = [
      { mesh: solidMesh, items: makeItems(solidList, solidMesh) },
      { mesh: glowMesh, items: makeItems(glowList, glowMesh) },
    ];
    if (solidMesh.instanceColor) solidMesh.instanceColor.needsUpdate = true;
    if (glowMesh.instanceColor) glowMesh.instanceColor.needsUpdate = true;

    const house = new THREE.Group();
    house.add(solidMesh, glowMesh);
    house.position.set(4.9, -3.38, -1.2);
    house.scale.setScalar(1.15);
    house.rotation.y = 0.5; // front turned slightly, so the front and left side show
    rig.add(house);

    // warm light from the windows once the house is finished
    const windowLight = new THREE.PointLight(0xffc400, 0, 7);
    windowLight.position.set(0, 1.4, 2.8);
    house.add(windowLight);

    // chimney smoke
    const smokeGeo = new THREE.SphereGeometry(0.16, 12, 12);
    disposables.push(smokeGeo);
    const smoke = Array.from({ length: 6 }, () => {
      const mat = new THREE.MeshBasicMaterial({
        color: 0xdbe5f3,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      disposables.push(mat);
      const mesh = new THREE.Mesh(smokeGeo, mat);
      house.add(mesh);
      return { mesh, mat };
    });

    /* ---------- animation ---------- */
    const dummy = new THREE.Object3D();
    const hd = new THREE.Object3D();
    const update = (time: number) => {
      bricks.forEach((b, i) => {
        const t = clamp01((time - b.delay) / DROP_WALL);
        const e = easeOutBack(t);
        dummy.position.lerpVectors(b.start, b.target, e);
        if (t >= 1) {
          dummy.position.y += Math.sin(time * 0.8 + i * 0.5) * 0.05;
          dummy.position.z += Math.sin(time * 0.6 + b.c * 0.5) * 0.15;
        }
        dummy.rotation.set(b.rot.x * (1 - e), b.rot.y * (1 - e), b.rot.z * (1 - e));
        dummy.updateMatrix();
        wall.setMatrixAt(i, dummy.matrix);
      });
      wall.instanceMatrix.needsUpdate = true;

      pavers.forEach((p, i) => {
        const d = Math.hypot(p.x, p.z + 2);
        dummy.position.set(p.x, -3.4 + Math.sin(d * 0.6 - time * 1.4) * 0.15, p.z);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        floor.setMatrixAt(i, dummy.matrix);
      });
      floor.instanceMatrix.needsUpdate = true;

      floaters.forEach((f, i) => {
        f.mesh.rotation.x = time * 0.3 + f.phase;
        f.mesh.rotation.y = time * 0.45 + f.phase;
        f.mesh.position.y = f.y + Math.sin(time * 0.9 + f.phase) * 0.35;
        if (i % 2) f.mesh.rotation.z = time * 0.2;
      });

      // house: every piece drops in from above and snaps into place
      houseParts.forEach(({ mesh, items }) => {
        items.forEach((c, i) => {
          const t = clamp01((time - c.delay) / DROP_HOUSE);
          const e = easeOutBack(t);
          hd.position.lerpVectors(c.start, c.target, e);
          hd.rotation.set(
            c.srot.x + (c.trot.x - c.srot.x) * e,
            c.srot.y + (c.trot.y - c.srot.y) * e,
            c.srot.z + (c.trot.z - c.srot.z) * e
          );
          hd.scale.copy(c.size).multiplyScalar(t > 0 ? 1 : 0); // hidden until its turn
          hd.updateMatrix();
          mesh.setMatrixAt(i, hd.matrix);
        });
        mesh.instanceMatrix.needsUpdate = true;
      });

      // finished: windows glow, chimney smokes
      const done = time > houseDone;
      windowLight.intensity = done ? 22 + Math.sin(time * 2) * 4 : 0;
      smoke.forEach((s, i) => {
        if (!done) {
          s.mat.opacity = 0;
          return;
        }
        const p = (time * 0.22 + i / smoke.length) % 1;
        s.mesh.position.set(1.6 + Math.sin(p * 5 + i) * 0.14 + p * 0.45, 5.65 + p * 1.5, -0.7);
        s.mesh.scale.setScalar(0.6 + p * 1.7);
        s.mat.opacity = Math.sin(p * Math.PI) * 0.32;
      });
    };

    /* ---------- pointer parallax ---------- */
    const pointer = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      const r = section.getBoundingClientRect();
      pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.y = ((e.clientY - r.top) / r.height) * 2 - 1;
    };
    section.addEventListener("pointermove", onPointer);

    /* ---------- size ---------- */
    const lookAt = new THREE.Vector3(0, 0.4, -3);
    const render = () => {
      camera.lookAt(lookAt);
      renderer.render(scene, camera);
    };
    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      baseZ = camera.aspect < 1 ? 16 : camera.aspect < 1.4 ? 13 : 11;
      // on narrow screens the house moves in and gets smaller
      const narrow = camera.aspect < 1.2;
      house.position.set(narrow ? 1.6 : 4.9, -3.38, -1.2);
      house.scale.setScalar(narrow ? 0.8 : 1.15);
      camera.updateProjectionMatrix();
      if (reduceMotion) {
        camera.position.z = baseZ;
        render();
      }
    };
    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    resize();

    let raf = 0;
    const clock = new THREE.Clock();
    const frame = () => {
      raf = requestAnimationFrame(frame);
      // one speed dial for the whole scene
      let t = clock.getElapsedTime() * SPEED;
      if (LOOP > 0) t %= LOOP;
      update(t);
      // camera follows the mouse a little quicker too
      camera.position.x += (pointer.x * 0.9 - camera.position.x) * 0.06;
      camera.position.y += (0.5 - pointer.y * 0.5 - camera.position.y) * 0.06;
      camera.position.z += (baseZ - camera.position.z) * 0.06;
      rig.rotation.y += (pointer.x * 0.08 - rig.rotation.y) * 0.06;
      render();
    };

    let io: IntersectionObserver | undefined;
    if (reduceMotion) {
      update(100); // final, fully built state
      render();
    } else {
      frame();
      // pause rendering while the hero is off-screen
      io = new IntersectionObserver(([entry]) => {
        cancelAnimationFrame(raf);
        if (entry.isIntersecting) frame();
      });
      io.observe(section);
    }

    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
      ro.disconnect();
      section.removeEventListener("pointermove", onPointer);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div className="h3-canvas" ref={mountRef} aria-hidden="true" />;
}

/* Counts up once the hero mounts (faster: starts sooner, finishes sooner) */
function CountUp({ to, delay = 500, duration = 1100 }: { to: number; delay?: number; duration?: number }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(to);
      return;
    }
    let raf = 0;
    const timer = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        setValue(Math.round(to * (1 - Math.pow(1 - t, 3))));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [to, delay, duration]);
  return <>{value}</>;
}

/* Splits a line into words that rise up one by one */
function Line({ text, start, gold = false }: { text: string; start: number; gold?: boolean }) {
  return (
    <span className={`h3-line${gold ? " h3-gold" : ""}`}>
      {text.split(" ").map((w, i) => (
        <span className="h3-word" style={{ ["--i" as string]: start + i }} key={w + i}>
          {w}&nbsp;
        </span>
      ))}
    </span>
  );
}

const heroCss = `
.h3 {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  min-height: 700px;
  color: #fff;
  background: radial-gradient(ellipse at 70% 40%, #0b2d66 0%, #08152f 72%);
}
.h3-canvas {
  position: absolute;
  inset: 0;
  z-index: 0;
}
.h3-canvas canvas {
  display: block;
  width: 100%;
  height: 100%;
}
/* darker on the left (text side), clear on the right (house side) */
.h3-vignette {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    linear-gradient(90deg, rgb(8 21 47 / 90%) 0%, rgb(8 21 47 / 66%) 36%, rgb(8 21 47 / 12%) 60%, transparent 100%),
    linear-gradient(0deg, rgb(8 21 47 / 80%), transparent 26%),
    linear-gradient(180deg, rgb(8 21 47 / 50%), transparent 20%);
}

/* ---------- left-aligned content ---------- */
.h3-inner {
  position: relative;
  z-index: 2;
  display: flex;
  min-height: 700px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 64px 0 110px;
  text-align: left;
}
.h3-inner > * {
  max-width: min(100%, 620px);
  animation: h3-fade-up 0.55s cubic-bezier(0.2, 0.8, 0.2, 1) backwards;
}
.h3-inner > h1 {
  max-width: none;
}
.h3-badge {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 24px;
  padding: 8px 15px;
  color: #fff4bf;
  border: 1px solid rgb(255 196 0 / 32%);
  border-radius: 999px;
  background: rgb(255 196 0 / 9%);
  backdrop-filter: blur(6px);
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  animation-delay: 0.03s;
}
.h3-badge .badge-dot {
  animation: h3-ping 1.4s ease-out infinite;
}
.h3 h1 {
  margin: 0;
  font: 800 clamp(3rem, 6.2vw, 5.4rem) / 1 var(--font-heading);
  letter-spacing: -0.075em;
  text-shadow: 0 10px 40px rgb(0 0 0 / 40%);
  animation: none;
}
.h3-line {
  display: block;
  overflow: hidden;
  padding-bottom: 0.1em;
  margin-bottom: -0.06em;
}
.h3-word {
  display: inline-block;
  transform: translateY(115%) rotate(4deg);
  animation: h3-rise 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  animation-delay: calc(0.15s + var(--i) * 0.08s);
}
.h3-gold .h3-word {
  color: transparent;
  background: linear-gradient(100deg, var(--brand-gold) 0 38%, #fff6c9 50%, var(--brand-gold) 62% 100%) 0 0 / 260% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  text-shadow: none;
  animation:
    h3-rise 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards,
    h3-shimmer 3s linear 1s infinite;
  animation-delay: calc(0.15s + var(--i) * 0.08s), 1s;
}
.h3-underline {
  display: block;
  width: 230px;
  height: 6px;
  margin: 12px 0 24px;
  border-radius: 6px;
  background: linear-gradient(90deg, var(--brand-red), var(--brand-gold));
  transform: scaleX(0);
  transform-origin: left;
  animation: h3-draw 0.6s cubic-bezier(0.6, 0, 0.2, 1) 0.7s forwards;
}
.h3-lead {
  margin: 0;
  color: #dbe5f3;
  font-size: 17px;
  line-height: 1.8;
  animation-delay: 0.5s;
}
.h3-tamil {
  margin: 16px 0 26px;
  color: #ffdc56;
  font-family: "Noto Sans Tamil", sans-serif;
  font-size: 15px;
  line-height: 1.8;
  animation-delay: 0.6s;
}
.h3-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 12px;
  animation-delay: 0.7s;
}
.h3-btn {
  position: relative;
  display: inline-flex;
  min-height: 56px;
  align-items: center;
  justify-content: center;
  gap: 11px;
  overflow: hidden;
  padding: 0 28px;
  border: 1px solid transparent;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 800;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.h3-btn > * {
  position: relative;
  z-index: 1;
}
.h3-btn::before {
  position: absolute;
  inset: 0;
  content: "";
  background: linear-gradient(110deg, transparent 30%, rgb(255 255 255 / 38%) 50%, transparent 70%);
  transform: translateX(-120%);
}
.h3-btn:hover {
  transform: translateY(-3px);
}
.h3-btn:hover::before {
  transform: translateX(120%);
  transition: transform 0.5s ease;
}
.h3-btn--red {
  color: #fff;
  background: var(--brand-red);
  box-shadow: 0 10px 24px rgb(227 6 19 / 30%);
  animation: h3-glow 2s ease-in-out infinite;
}
.h3-btn--red svg {
  transition: transform 0.2s ease;
}
.h3-btn--red:hover svg {
  transform: translateX(6px);
}
.h3-btn--ghost {
  color: #fff;
  border-color: rgb(255 255 255 / 38%);
  background: rgb(255 255 255 / 8%);
  backdrop-filter: blur(8px);
}
.h3-btn--ghost:hover {
  border-color: var(--brand-gold);
  box-shadow: 0 10px 26px rgb(255 196 0 / 15%);
}

/* glass stats bar */
.h3-stats {
  display: flex;
  margin-top: 36px;
  padding: 16px 8px;
  border: 1px solid rgb(255 255 255 / 16%);
  border-radius: 18px;
  background: rgb(255 255 255 / 7%);
  backdrop-filter: blur(14px);
  box-shadow: 0 20px 50px rgb(0 0 0 / 25%);
  animation-delay: 0.8s;
}
.h3-stats > div {
  display: grid;
  gap: 4px;
  min-width: 124px;
  padding: 2px 26px;
  text-align: center;
}
.h3-stats > div + div {
  border-left: 1px solid rgb(255 255 255 / 16%);
}
.h3-stats strong {
  color: #fff;
  font: 800 30px/1 var(--font-heading);
  letter-spacing: -0.05em;
  font-variant-numeric: tabular-nums;
}
.h3-stats strong span {
  color: var(--brand-gold);
}
.h3-stats small {
  color: #bbcbe0;
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

/* rotating stamp (top right) */
.h3-stamp {
  position: absolute;
  z-index: 2;
  top: 9%;
  right: 4%;
  display: grid;
  width: 112px;
  height: 112px;
  place-items: center;
  color: var(--deep-navy);
  border-radius: 50%;
  background: var(--brand-gold);
  box-shadow: 0 10px 28px rgb(0 0 0 / 30%), 0 0 0 5px var(--deep-navy), 0 0 0 7px var(--brand-gold);
  opacity: 0;
  animation: h3-pop 0.55s cubic-bezier(0.3, 1.5, 0.5, 1) 1s forwards;
}
.h3-stamp svg {
  position: absolute;
  inset: 0;
  animation: h3-spin 9s linear infinite;
}
.h3-stamp text {
  fill: var(--deep-navy);
  font: 800 11px var(--font-heading);
  letter-spacing: 0.1em;
}
.h3-stamp > span {
  font: 800 27px/1 var(--font-heading);
  letter-spacing: -0.08em;
}

/* scroll cue */
.h3-scroll {
  position: absolute;
  z-index: 2;
  bottom: 20px;
  left: max(calc((100% - 1160px) / 2), 24px);
  display: flex;
  align-items: center;
  gap: 11px;
  color: #bbcbe0;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: color 0.2s ease;
}
.h3-scroll:hover {
  color: var(--brand-gold);
}
.h3-mouse {
  position: relative;
  width: 18px;
  height: 28px;
  border: 1.5px solid var(--brand-gold);
  border-radius: 10px;
}
.h3-mouse i {
  position: absolute;
  top: 5px;
  left: 50%;
  width: 3px;
  height: 6px;
  margin-left: -1.5px;
  border-radius: 3px;
  background: var(--brand-gold);
  animation: h3-wheel 1.2s ease-in-out infinite;
}

/* ---------- keyframes ---------- */
@keyframes h3-fade-up { from { opacity: 0; transform: translateY(24px); } }
@keyframes h3-rise { to { transform: none; } }
@keyframes h3-shimmer { to { background-position: -260% 0; } }
@keyframes h3-draw { to { transform: scaleX(1); } }
@keyframes h3-ping {
  0% { box-shadow: 0 0 0 0 rgb(255 196 0 / 70%); }
  100% { box-shadow: 0 0 0 10px rgb(255 196 0 / 0%); }
}
@keyframes h3-glow {
  0%, 100% { box-shadow: 0 10px 24px rgb(227 6 19 / 30%); }
  50% { box-shadow: 0 12px 34px rgb(227 6 19 / 55%); }
}
@keyframes h3-pop {
  from { opacity: 0; transform: scale(0.4) rotate(-20deg); }
  to { opacity: 1; transform: none; }
}
@keyframes h3-spin { to { transform: rotate(360deg); } }
@keyframes h3-wheel {
  0% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(10px); }
}

/* ---------- responsive ---------- */
@media (max-width: 1100px) {
  .h3-stamp { display: none; }
}
@media (max-width: 800px) {
  .h3-vignette {
    background: linear-gradient(0deg, rgb(8 21 47 / 78%), rgb(8 21 47 / 70%));
  }
  .h3-scroll { display: none; }
  .h3-inner { padding: 70px 0 70px; }
}
@media (max-width: 560px) {
  .h3 h1 { font-size: clamp(2.9rem, 13vw, 4.4rem); }
  .h3-badge { font-size: 10px; letter-spacing: 0.08em; }
  .h3-lead { font-size: 15px; }
  .h3-tamil { font-size: 13px; }
  .h3-actions { flex-direction: column; width: 100%; max-width: 310px; }
  .h3-stats > div { min-width: 0; padding: 2px 14px; }
  .h3-stats strong { font-size: 24px; }
  .h3-stats small { font-size: 10px; }
}
@media (prefers-reduced-motion: reduce) {
  .h3-word, .h3-stamp, .h3-inner > * {
    opacity: 1 !important;
    transform: none !important;
  }
  .h3-underline { transform: scaleX(1); }
}
`;

export function Hero() {
  return (
    <section className="h3" id="home">
      <style>{heroCss}</style>

      <ThreeBackdrop />
      <div className="h3-vignette" aria-hidden="true" />

      <div className="h3-stamp" aria-hidden="true">
        <svg viewBox="0 0 120 120">
          <defs>
            <path id="h3-circle" d="M60,60 m-47,0 a47,47 0 1,1 94,0 a47,47 0 1,1 -94,0" />
          </defs>
          <text>
            <textPath href="#h3-circle">BUILT ON GOOD WORK • BUILT ON GOOD WORK •</textPath>
          </text>
        </svg>
        <span>JPS</span>
      </div>

      <div className="container h3-inner">
        <div className="h3-badge">
          <span className="badge-dot" />5 years of trust <span className="badge-divider">·</span> Peraiyur, Madurai
        </div>

        <h1>
          <Line text="Solid quality." start={0} />
          <Line text="Strong trust." start={2} gold />
          <span className="h3-underline" />
        </h1>

        <p className="h3-lead">
          JPS Bricks &amp; Blocks manufactures precision-cast solid concrete blocks, fairface blocks, paver blocks and
          highway stones for builders across Madurai district — dimensionally accurate, properly cured and delivered on
          time.
        </p>
        <p className="h3-tamil" lang="ta">{brand.tamilTagline}</p>

        <div className="h3-actions">
          <a className="h3-btn h3-btn--red" href="#products">
            <span>View our products</span>
            <ArrowRight size={17} />
          </a>
          <a
            className="h3-btn h3-btn--ghost"
            href={`https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(
              "Hello JPS Bricks & Blocks, I would like to enquire about your products."
            )}`}
            target="_blank"
            rel="noreferrer"
          >
            <WhatsAppMini /> <span>Enquire on WhatsApp</span>
          </a>
        </div>

        <div className="h3-stats" aria-label="JPS at a glance">
          <div>
            <strong><CountUp to={5} /><span>+</span></strong>
            <small>Years strong</small>
          </div>
          <div>
            <strong><CountUp to={11} /></strong>
            <small>Product lines</small>
          </div>
          <div>
            <strong><CountUp to={450} /><span>+</span></strong>
            <small>Sites served</small>
          </div>
        </div>
      </div>

      <a className="h3-scroll" href="#why" aria-label="Scroll to explore">
        <span className="h3-mouse"><i /></span>
        Scroll to explore
      </a>
    </section>
  );
}









export function ProductMarquee() {
  const items = [...marqueeProducts, ...marqueeProducts]
  return (
    <div className="marquee" aria-label={`Products: ${marqueeProducts.join(', ')}`}>
      <div className="marquee-track" aria-hidden="true">
        {items.map((item, index) => <span className="marquee-item" key={`${item}-${index}`}>{item}<b>✳</b></span>)}
      </div>
    </div>
  )
}








import { type CSSProperties } from "react";


/* ------------------------------------------------------------------ */
/*  CONSTANTS                                                          */
/* ------------------------------------------------------------------ */
const TOP = 110; // px: where the first card pins (keep in sync with --qc-top in CSS)
const STEP = 16; // px: how much each stacked card peeks out above the next

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const pad = (n: number) => String(n).padStart(2, "0");

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */
function useInViewOnce<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen] as const;
}

function Words({ text, start = 0 }: { text: string; start?: number }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span className="qc-w" key={w + i}>
          <i style={{ ["--i" as string]: start + i } as CSSProperties}>{w}</i>{" "}
        </span>
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  STYLES (embedded so this stays a single file)                      */
/* ------------------------------------------------------------------ */
const css = `
.qc {
  --qb: var(--brand-blue, #003a8f);
  --qg: var(--brand-gold, #ffc400);
  --qr: var(--brand-red, #e11d2a);
  --qh: var(--heading-ink, #08152f);
  --qi: var(--body-ink, #47536a);
  --qf: var(--font-heading, inherit);
  --qc-top: 110px;
  position: relative;
  overflow: clip;
}

/* ---------- blueprint background ---------- */
.qc-bg { position: absolute; inset: 0; pointer-events: none; }
.qc-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgb(0 58 143 / 6%) 1px, transparent 1px),
    linear-gradient(90deg, rgb(0 58 143 / 6%) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, #000 20%, transparent 80%);
}
.qc-blob { position: absolute; border-radius: 50%; filter: blur(80px); animation: qc-float 14s ease-in-out infinite alternate; }
.qc-blob--b { top: -8%; left: -6%; width: 380px; height: 380px; background: rgb(0 58 143 / 13%); }
.qc-blob--g { right: -6%; bottom: 6%; width: 340px; height: 340px; background: rgb(255 196 0 / 20%); animation-delay: -6s; }
.qc .container { position: relative; z-index: 1; }

/* ---------- layout ---------- */
.qc-layout { display: grid; grid-template-columns: minmax(280px, .82fr) 1.18fr; gap: clamp(32px, 5vw, 72px); align-items: start; }
.qc-side { position: sticky; top: var(--qc-top); padding-bottom: 24px; }

/* ---------- heading ---------- */
.qc-eyebrow { display: inline-flex; align-items: center; gap: 10px; color: var(--qb); font-size: 12px; font-weight: 800; letter-spacing: .15em; text-transform: uppercase; opacity: 0; }
.qc-eyebrow::before { content: ""; width: 26px; height: 2px; background: var(--qg); transform: scaleX(0); transform-origin: right; }
.qc-head h2 { margin: 16px 0 14px; color: var(--qh); font: 800 clamp(2rem, 3.6vw, 3rem) / 1.14 var(--qf); letter-spacing: -.055em; }
.qc-w { display: inline-block; overflow: hidden; vertical-align: top; padding-bottom: .14em; margin-bottom: -.14em; }
.qc-w > i { display: inline-block; font-style: normal; transform: translateY(115%) rotate(5deg); }
.qc-mark { position: relative; color: var(--qb); z-index: 0; }
.qc-mark::after { content: ""; position: absolute; z-index: -1; left: -4px; right: -4px; bottom: .06em; height: .34em; border-radius: 3px; background: linear-gradient(90deg, rgb(255 196 0 / 70%), rgb(255 196 0 / 25%)); transform: scaleX(0); transform-origin: left; }
.qc-lead { max-width: 460px; margin: 0; color: var(--qi); font-size: 16px; line-height: 1.8; opacity: 0; }
.qc-head.is-in .qc-eyebrow { animation: qc-fade .6s ease .05s forwards; }
.qc-head.is-in .qc-eyebrow::before { animation: qc-draw .7s cubic-bezier(.6, 0, .2, 1) .2s forwards; }
.qc-head.is-in .qc-w > i { animation: qc-rise .9s cubic-bezier(.2, .8, .2, 1) forwards; animation-delay: calc(.25s + var(--i) * .11s); }
.qc-head.is-in .qc-mark::after { animation: qc-draw .9s cubic-bezier(.6, 0, .2, 1) 1.2s forwards; }
.qc-head.is-in .qc-lead { animation: qc-fade-up .8s ease .9s forwards; }

/* ---------- spirit level ---------- */
.qc-level { --bx: 0; margin-top: 30px; max-width: 400px; }
.qc-level__bar {
  position: relative; display: grid; place-items: center; height: 58px; border-radius: 10px;
  background: linear-gradient(180deg, #ffd84a, #e6a800);
  box-shadow: inset 0 2px 0 rgb(255 255 255 / 55%), inset 0 -3px 0 rgb(0 0 0 / 18%), 0 14px 26px -12px rgb(8 21 47 / 40%);
}
.qc-level__bar::before, .qc-level__bar::after {
  content: ""; position: absolute; top: 50%; width: 10px; height: 10px; border-radius: 50%;
  background: rgb(0 0 0 / 28%); transform: translateY(-50%);
}
.qc-level__bar::before { left: 14px; }
.qc-level__bar::after { right: 14px; }
.qc-level__vial {
  position: relative; width: 190px; height: 32px; overflow: hidden; border-radius: 999px;
  background: linear-gradient(180deg, rgb(255 255 255 / 85%), rgb(190 235 200 / 70%) 45%, rgb(150 210 170 / 90%));
  box-shadow: inset 0 2px 5px rgb(0 0 0 / 30%), 0 0 0 3px rgb(8 21 47 / 80%);
}
.qc-level__vial > b { position: absolute; top: 0; bottom: 0; width: 2px; background: rgb(8 21 47 / 55%); transition: background .3s, box-shadow .3s; }
.qc-level__vial > b:nth-of-type(1) { left: calc(50% - 24px); }
.qc-level__vial > b:nth-of-type(2) { left: calc(50% + 22px); }
.qc-level[data-level='true'] .qc-level__vial > b { background: #15a34a; box-shadow: 0 0 8px #15a34a; }
.qc-level__bubble {
  position: absolute; top: 5px; left: calc(50% - 19px); width: 38px; height: 22px; border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #fff, rgb(255 255 255 / 55%) 40%, rgb(120 190 150 / 70%));
  box-shadow: inset 0 -2px 3px rgb(0 80 40 / 35%);
  transform: translateX(calc(var(--bx) * 66px));
}
.qc-level__lbl { display: flex; align-items: center; gap: 8px; margin-top: 12px; height: 22px; font-size: 12px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; color: var(--qi); position: relative; }
.qc-level__lbl span { position: absolute; left: 0; transition: opacity .3s, transform .3s; white-space: nowrap; }
.qc-level__lbl .ok { color: #15a34a; opacity: 0; transform: translateY(8px); }
.qc-level[data-level='true'] .qc-level__lbl .ok { opacity: 1; transform: none; }
.qc-level[data-level='true'] .qc-level__lbl .mv { opacity: 0; transform: translateY(-8px); }

/* ---------- counter + ticks ---------- */
.qc-meter { display: flex; align-items: center; gap: 18px; margin-top: 26px; }
.qc-count { display: flex; align-items: flex-end; gap: 8px; color: var(--qh); font: 800 40px / 1 var(--qf); }
.qc-count__win { height: 1em; overflow: hidden; }
.qc-count__col { display: flex; flex-direction: column; transform: translateY(calc(var(--k, 0) * -1em)); transition: transform .8s cubic-bezier(.7, 0, .2, 1); }
.qc-count__col span { height: 1em; line-height: 1; display: block; }
.qc-count small { font-size: 15px; font-weight: 700; opacity: .45; margin-bottom: 4px; }
.qc-ticks { flex: 1; display: flex; align-items: flex-end; gap: 5px; height: 26px; }
.qc-ticks i { flex: 1; height: 10px; border-radius: 2px; background: rgb(0 58 143 / 15%); transform-origin: bottom; transition: height .4s cubic-bezier(.3, 1.5, .5, 1), background .3s; }
.qc-ticks i[data-on='true'] { background: var(--qb); }
.qc-ticks i[data-cur='true'] { height: 22px; background: var(--qr); }

/* ---------- card stack ---------- */
.qc-stack { display: grid; gap: 18vh; padding-bottom: 6vh; }
.qc-wrap { position: sticky; top: calc(var(--qc-top) + var(--i) * ${STEP}px); }
.qc-card {
  --en: 1; --cv: 0; --ex: 0;
  --dx: 90px; --tilt: 5deg;
  position: relative; min-height: 310px; padding: 40px 34px 52px; border: 1px solid #e3e8f0; border-radius: 16px; background: #fff;
  box-shadow: 0 22px 44px -22px rgb(8 21 47 / 28%);
  transform-origin: 50% 0;
  transform:
    translateX(calc((1 - var(--en)) * var(--dx)))
    rotate(calc((1 - var(--en)) * var(--tilt)))
    scale(calc(1 - var(--cv) * .05 - var(--ex) * .03));
  will-change: transform;
}
.qc-wrap:nth-child(even) .qc-card { --dx: -90px; --tilt: -5deg; }
.qc-card::after { content: ""; position: absolute; inset: 0; border-radius: inherit; background: #0a2250; opacity: calc(var(--cv) * .5); pointer-events: none; z-index: 6; }
.qc-card__in { position: relative; z-index: 1; display: grid; gap: 4px; }
.qc-tab {
  position: absolute; z-index: 2; top: -1px; left: 34px; padding: 6px 14px 7px; border-radius: 0 0 10px 10px;
  background: var(--qb); color: #fff; font-size: 11px; font-weight: 800; letter-spacing: .18em; text-transform: uppercase;
  box-shadow: inset 0 -3px 0 var(--qg);
}
.qc-icon { position: relative; display: grid; width: 56px; height: 56px; place-items: center; margin-top: 6px; color: #fff; border-radius: 50%; background: var(--qb); box-shadow: inset -3px -3px 0 rgb(255 196 0 / 85%); transform: scale(.6); opacity: 0; }
.qc-card h3 { margin: 16px 0 8px; color: var(--qh); font: 800 clamp(1.3rem, 2.2vw, 1.7rem) / 1.25 var(--qf); letter-spacing: -.03em; max-width: 62%; }
.qc-card p { margin: 0; max-width: 430px; color: #657184; font-size: 15.5px; line-height: 1.75; }
.qc-tamil { display: inline-block; margin-top: 12px; color: var(--qb); font: 600 15.5px "Noto Sans Tamil", sans-serif; }

/* line reveal (runs once when the card is first reached) */
.qc-line { display: block; overflow: hidden; }
.qc-line > * { display: block; transform: translateY(110%); opacity: 0; transition: transform .75s cubic-bezier(.2, .9, .2, 1) calc(var(--s, 0) * 90ms + 150ms), opacity .5s calc(var(--s, 0) * 90ms + 150ms); }
.qc-card[data-on='true'] .qc-line > * { transform: none; opacity: 1; }
.qc-card[data-on='true'] .qc-icon { animation: qc-pop .6s cubic-bezier(.3, 1.6, .5, 1) .05s forwards; }

/* ruler along the bottom edge: draws itself */
.qc-ruler {
  position: absolute; z-index: 1; left: 0; right: 0; bottom: 0; height: 20px; border-radius: 0 0 16px 16px; clip-path: inset(0 100% 0 0);
  background:
    repeating-linear-gradient(90deg, rgb(0 58 143 / 55%) 0 2px, transparent 2px 60px) left bottom / 100% 16px no-repeat,
    repeating-linear-gradient(90deg, rgb(0 58 143 / 35%) 0 1px, transparent 1px 12px) left bottom / 100% 9px no-repeat;
  transition: clip-path 1.4s cubic-bezier(.6, 0, .2, 1) .3s;
}
.qc-card[data-on='true'] .qc-ruler { clip-path: inset(0 0 0 0); }

/* QC stamp: slams on when the card lands */
.qc-stamp {
  position: absolute; z-index: 3; right: 28px; bottom: 44px; display: flex; align-items: center; gap: 8px; padding: 8px 14px 8px 10px;
  border: 3px double var(--qr); border-radius: 10px; color: var(--qr); font: 800 14px / 1 var(--qf); letter-spacing: .16em; text-transform: uppercase;
  mix-blend-mode: multiply; opacity: 0; transform: rotate(-9deg) scale(2.6); transform-origin: 50% 50%; pointer-events: none;
}
.qc-stamp::after { content: ""; position: absolute; inset: -6px; border: 2px solid var(--qr); border-radius: 14px; opacity: 0; }
.qc-card[data-on='true'] .qc-stamp { animation: qc-slam .5s cubic-bezier(.2, .9, .3, 1.15) .55s forwards; }
.qc-card[data-on='true'] .qc-stamp::after { animation: qc-shock .7s ease-out 1s forwards; }
.qc-card[data-on='true'] .qc-card__in { animation: qc-thud .45s ease 1s; }

/* ---------- keyframes ---------- */
@keyframes qc-float { to { transform: translate(40px, 30px) scale(1.12); } }
@keyframes qc-fade { to { opacity: 1; } }
@keyframes qc-fade-up { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
@keyframes qc-rise { to { transform: none; } }
@keyframes qc-draw { to { transform: scaleX(1); } }
@keyframes qc-pop { 0% { opacity: 0; transform: scale(.6) rotate(-20deg); } 100% { opacity: 1; transform: none; } }
@keyframes qc-slam {
  0% { opacity: 0; transform: rotate(-22deg) scale(2.6); }
  55% { opacity: 1; }
  100% { opacity: .92; transform: rotate(-9deg) scale(1); }
}
@keyframes qc-shock { 0% { opacity: .7; transform: scale(1); } 100% { opacity: 0; transform: scale(1.5, 1.9); } }
@keyframes qc-thud { 0%, 100% { transform: none; } 30% { transform: translateY(5px); } 60% { transform: translateY(-2px); } }

/* ---------- responsive ---------- */
@media (max-width: 900px) {
  .qc { --qc-top: 84px; }
  .qc-layout { grid-template-columns: 1fr; gap: 28px; }
  .qc-side { position: static; }
  .qc-meter { display: none; }
  .qc-stack { gap: 14vh; }
  .qc-wrap { top: calc(var(--qc-top) + var(--i) * 12px); }
  .qc-card { min-height: 0; padding: 40px 22px 54px; }
  .qc-card h3 { max-width: 100%; }
  .qc-stamp { right: 16px; bottom: 36px; font-size: 12px; }
}

/* static fallback: reduced motion */
.qc.is-static .qc-stack { gap: 22px; }
.qc.is-static .qc-wrap { position: static; }
.qc.is-static .qc-card { transform: none; }
.qc.is-static .qc-card::after { display: none; }
.qc.is-static .qc-eyebrow, .qc.is-static .qc-lead { opacity: 1; animation: none !important; }
.qc.is-static .qc-eyebrow::before, .qc.is-static .qc-mark::after { transform: scaleX(1); animation: none !important; }
.qc.is-static .qc-w > i { transform: none; animation: none !important; }
.qc.is-static .qc-line > * { transform: none; opacity: 1; transition: none; }
.qc.is-static .qc-icon { opacity: 1; transform: none; animation: none !important; }
.qc.is-static .qc-ruler { clip-path: none; transition: none; }
.qc.is-static .qc-stamp { opacity: .92; transform: rotate(-9deg); animation: none !important; }
.qc.is-static .qc-stamp::after { display: none; }
.qc.is-static .qc-blob { animation: none; }
`;

/* ------------------------------------------------------------------ */
/*  SECTION                                                            */
/* ------------------------------------------------------------------ */
export function WhyChoose() {
  const [headRef, headSeen] = useInViewOnce<HTMLDivElement>(0.3);
  const sectionRef = useRef<HTMLElement>(null);
  const levelRef = useRef<HTMLDivElement>(null);
  const wrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  const [reduced, setReduced] = useState(false);
  const [active, setActive] = useState(0); // counter / ticks
  const [reached, setReached] = useState(-1); // highest card that has landed (stamped)
  const n = features.length;

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const level = levelRef.current;
    const wraps = wrapRefs.current.filter(Boolean) as HTMLDivElement[];
    const cards = cardRefs.current.filter(Boolean) as HTMLElement[];
    if (!section || wraps.length === 0) return;

    const step = window.matchMedia("(max-width: 900px)").matches ? 12 : STEP;
    const top = window.matchMedia("(max-width: 900px)").matches ? 84 : TOP;

    let raf = 0;
    let visible = true;
    let lastY = window.scrollY;
    let v = 0; // smoothed scroll speed (px / frame)
    let pos = 0; // bubble position (-1..1)
    let bv = 0; // bubble velocity
    let lastActive = -1;
    let lastReached = -1;

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { rootMargin: "200px" });
    io.observe(section);

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;

      const y = window.scrollY;
      v += (y - lastY - v) * 0.25;
      lastY = y;

      /* spirit-level bubble: underdamped spring, pushed by scroll speed, settles at centre */
      const target = clamp(-v * 0.07, -1, 1);
      bv += (target - pos) * 0.09 - bv * 0.1;
      pos = clamp(pos + bv, -1.1, 1.1);
      if (level) {
        level.style.setProperty("--bx", pos.toFixed(3));
        const settled = Math.abs(pos) < 0.05 && Math.abs(bv) < 0.012 && Math.abs(v) < 0.4;
        const flag = settled ? "true" : "false";
        if (level.dataset.level !== flag) level.dataset.level = flag;
      }

      /* card stack */
      const vh = window.innerHeight;
      let act = 0;
      let rch = -1;
      const rects = wraps.map((w) => w.getBoundingClientRect());
      for (let i = 0; i < wraps.length; i++) {
        const stick = top + i * step;
        if (rects[i].top <= stick + 90) { act = i; rch = i; }
      }
      for (let i = 0; i < wraps.length; i++) {
        const stick = top + i * step;
        const enter = clamp(1 - (rects[i].top - stick) / (vh * 0.55));
        let cover = 0;
        if (i < wraps.length - 1) cover = clamp(1 - (rects[i + 1].top - stick) / rects[i].height);
        const extra = Math.max(0, act - i - 1);
        const c = cards[i];
        if (!c) continue;
        c.style.setProperty("--en", enter.toFixed(3));
        c.style.setProperty("--cv", cover.toFixed(3));
        c.style.setProperty("--ex", String(extra));
      }
      if (act !== lastActive) { lastActive = act; setActive(act); }
      if (rch > lastReached) { lastReached = rch; setReached(rch); }
    };
    raf = requestAnimationFrame(loop);

    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [reduced, n]);

  return (
    <section ref={sectionRef} className={`section section--paper qc${reduced ? " is-static" : ""}`} id="why">
      <style>{css}</style>

      <div className="qc-bg" aria-hidden="true">
        <span className="qc-grid" />
        <span className="qc-blob qc-blob--b" />
        <span className="qc-blob qc-blob--g" />
      </div>

      <div className="container">
        <div className="qc-layout">
          {/* ---------- sticky left column ---------- */}
          <div className="qc-side">
            <div className={`qc-head${headSeen ? " is-in" : ""}`} ref={headRef}>
              <span className="qc-eyebrow">Why builders choose JPS</span>
              <h2>
                <Words text="Quality &nbsp;is&nbsp; our identity," />
                <br />
                <span className="qc-mark">
                  <Words text="not &nbsp;our &nbsp;slogan." start={4} />
                </span>
              </h2>
              <p className="qc-lead">
                Every batch leaves our Peraiyur yard only after full curing and dimension checks — because a wall is only as
                straight as the block behind it.
              </p>
            </div>

            {!reduced && (
              <div className="qc-level" ref={levelRef} data-level="true" aria-hidden="true">
                <div className="qc-level__bar">
                  <div className="qc-level__vial">
                    <b />
                    <b />
                    <i className="qc-level__bubble" />
                  </div>
                </div>
                <div className="qc-level__lbl">
                  <span className="mv">Finding level…</span>
                  <span className="ok">Dead level ✓</span>
                </div>
              </div>
            )}

            {!reduced && (
              <div className="qc-meter" aria-hidden="true">
                <div className="qc-count">
                  <div className="qc-count__win">
                    <div className="qc-count__col" style={{ ["--k" as string]: active } as CSSProperties}>
                      {features.map((_, i) => <span key={i}>{pad(i + 1)}</span>)}
                    </div>
                  </div>
                  <small>/ {pad(n)}</small>
                </div>
                <div className="qc-ticks">
                  {features.map((_, i) => (
                    <i key={i} data-on={i <= active} data-cur={i === active} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ---------- stacking cards ---------- */}
          <div className="qc-stack">
            {features.map((feature, i) => {
              const { icon: Icon, title, description, tamil } = feature;
              const on = reduced || i <= reached;
              return (
                <div
                  className="qc-wrap"
                  key={title}
                  ref={(el) => { wrapRefs.current[i] = el; }}
                  style={{ ["--i" as string]: i, zIndex: i + 1 } as CSSProperties}
                >
                  <article
                    className="qc-card"
                    data-on={on}
                    ref={(el) => { cardRefs.current[i] = el; }}
                  >
                    <span className="qc-tab">Check {pad(i + 1)}</span>
                    <div className="qc-card__in">
                      <div className="qc-icon"><Icon size={22} strokeWidth={1.8} /></div>
                      <div className="qc-line" style={{ ["--s"as string]: 1 } as CSSProperties}><h3>{title}</h3></div>
                      <div className="qc-line" style={{ ["--s" as string]: 2 } as CSSProperties}><p>{description}</p></div>
                      <div className="qc-line" style={{ ["--s" as string]: 3 } as CSSProperties}>
                        <span className="qc-tamil" lang="ta">{tamil}</span>
                      </div>
                    </div>
                    <span className="qc-stamp" aria-hidden="true">
                      <Check size={18} strokeWidth={3.2} /> Checked
                    </span>
                    <span className="qc-ruler" aria-hidden="true" />
                  </article>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}











/* =========================================================
   Stats band — "JPS builds the city"  (Three.js edition)

   Every stat is a brick tower. A conveyor belt feeds bricks which are
   flung in arcs onto the tower, one by one, like a bricklayer
   tossing them up. The number climbs with every brick that lands.

   When a tower is finished:
     roof drops on and squashes -> windows light up one by one ->
     beacon starts blinking -> fireworks burst -> ground shockwave.

   Always alive: stars twinkle, moon bobs, clouds drift, a shooting
   star passes now and then, a JPS truck drives through the yard,
   a tower crane swings its jib, the belt keeps rolling.

   Interactive: move the mouse -> the sky parallaxes, the golden
   key-light follows you, and the tower under the cursor lifts up,
   ripples its windows and throws sparks.

   Robust by design:
   - no CSS animation delays, no IntersectionObserver needed
   - one requestAnimationFrame loop decides when the section is
     visible (getBoundingClientRect) and starts the build
   - numbers are written straight to the DOM (no React re-render
     per frame)
   - if WebGL is missing, final numbers are shown immediately
   ========================================================= */

/* ---------- tuning ---------- */
const SB_ROWS = [14, 22, 17, 20, 15, 18]; // brick rows per tower (cycled)
const SB_START_DELAY = 0.3; // s before the first brick flies
const SB_STAGGER = 0.38; // s between towers starting
const SB_ROW_SEC = 0.15; // build seconds per brick row (smaller = faster)
const SB_FLIGHT = 0.75; // s a brick is in the air
const SB_ROOF_SEC = 0.55; // roof drop time

/* ---------- brick geometry (1 world unit = 1 px at z = 0) ---------- */
const SB_BL = 26; // brick length
const SB_BH = 12; // brick height
const SB_BD = 14; // brick depth
const SB_TW = 104; // tower width  (4 bricks)
const SB_TD = 52; // tower depth
const SB_PL = 6; // plinth height
const SB_GROUND_PX = 80; // px of floor below the tower line

const sbClamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
const sbSmooth = (t: number) => t * t * (3 - 2 * t);
const sbEaseOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const sbEaseOutBack = (t: number) => {
  const c1 = 1.7;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
const sbRnd = (a = 0, b = 1) => a + Math.random() * (b - a);

const SB_PALETTES = [
  [0xc8452f, 0xb83a28, 0xd2553a], // red clay brick
  [0xe9dcc0, 0xdfd0b0, 0xefe3ca], // sandstone
  [0x6f86b0, 0x5f78a4, 0x7d93bb], // steel blue block
  [0xf0b800, 0xdba800, 0xffc933], // gold
];
const SB_LIT = [0xffe08a, 0xffc400, 0xfff1b0, 0xffd35a];
const SB_SPARK = [0xffc400, 0xffe08a, 0xff3b45, 0xffffff];

function sbMakeGlow(inner: string, outer: string) {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  if (g) {
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, inner);
    grd.addColorStop(1, outer);
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
  }
  return new THREE.CanvasTexture(c);
}

type SB_BrickD = {
  sl: THREE.Vector3; // slot (final position)
  st: THREE.Vector3; // start (on the conveyor)
  spin: THREE.Vector3;
  len: number;
  rotY: number;
  row: number;
  j: number; // build order
  arc: number;
  state: number; // 0 hidden, 1 flying, 2 final
  landed: boolean;
};
type SB_WinD = { x: number; y: number; row: number; onAt: number; dark: boolean; phase: number; flick: boolean };
type SB_Tower = {
  i: number;
  value: number;
  rows: number;
  n: number;
  step: number;
  start: number;
  lastLand: number;
  roofAt: number;
  done: number;
  rowLand: number[];
  group: THREE.Group;
  bricks: SB_BrickD[];
  mesh: THREE.InstancedMesh;
  plinth: THREE.Mesh;
  roof: THREE.Mesh;
  beacon: THREE.Mesh;
  beaconMat: THREE.MeshBasicMaterial;
  halo: THREE.Sprite;
  haloMat: THREE.SpriteMaterial;
  winMesh: THREE.InstancedMesh;
  wins: SB_WinD[];
  door: THREE.Mesh;
  ring: THREE.Mesh;
  ringMat: THREE.MeshBasicMaterial;
  x: number;
  hover: number;
  burst: boolean;
  lastCount: number;
  roofTop: number;
};

export function StatsBand() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const infosRef = useRef<HTMLDivElement>(null);
  const numRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const infos = infosRef.current;
    if (!section || !stage || !infos) return;
    const items = Array.from(infos.children) as HTMLElement[];

    const setFinal = () => {
      items.forEach((el, i) => {
        const n = numRefs.current[i];
        if (n) n.textContent = String(stats[i].value);
        el.classList.add('is-live', 'is-done');
      });
    };

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setFinal(); // no WebGL: still show the numbers
      return;
    }
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    stage.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 10, 3000);
    const disposables: { dispose(): void }[] = [];
    const track = <T extends { dispose(): void }>(d: T): T => {
      disposables.push(d);
      return d;
    };

    /* ---------- lights (distance-independent, so px-scale is fine) ---------- */
    scene.add(new THREE.AmbientLight(0x9db8ff, 1.05));
    const moonLight = new THREE.DirectionalLight(0xbcd2ff, 1.5);
    moonLight.position.set(300, 500, 400);
    scene.add(moonLight);
    const keyLight = new THREE.DirectionalLight(0xffc400, 1.1);
    keyLight.position.set(-300, 120, 400);
    scene.add(keyLight);

    const color = new THREE.Color();
    const dummy = new THREE.Object3D();
    const glowGold = track(sbMakeGlow('rgba(255,214,90,1)', 'rgba(255,196,0,0)'));
    const glowRed = track(sbMakeGlow('rgba(255,90,100,1)', 'rgba(227,6,19,0)'));
    const glowSoft = track(sbMakeGlow('rgba(255,255,255,0.9)', 'rgba(255,255,255,0)'));

    /* =====================================================
       BACKGROUND (parallax group): stars, moon, clouds, skyline
       ===================================================== */
    const bg = new THREE.Group();
    scene.add(bg);

    // stars: two sets so they twinkle out of phase
    const STAR_N = 90;
    const starNorm = [0, 1].map(() =>
      Array.from({ length: STAR_N }, () => ({ x: sbRnd(-1, 1), y: sbRnd(-0.25, 1) }))
    );
    const starPts = starNorm.map((arr) => {
      const geo = track(new THREE.BufferGeometry());
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(arr.length * 3), 3));
      const mat = track(
        new THREE.PointsMaterial({
          color: 0xffffff,
          size: 2.4 * Math.min(window.devicePixelRatio, 2),
          sizeAttenuation: false,
          transparent: true,
          opacity: 0.8,
          depthWrite: false,
        })
      );
      const pts = new THREE.Points(geo, mat);
      pts.frustumCulled = false;
      bg.add(pts);
      return { pts, mat, geo };
    });

    // moon with craters + halo
    const moon = new THREE.Group();
    const moonDisc = track(new THREE.CircleGeometry(1, 48));
    const moonMat = track(new THREE.MeshBasicMaterial({ color: 0xfff2b3 }));
    moon.add(new THREE.Mesh(moonDisc, moonMat));
    const craterMat = track(new THREE.MeshBasicMaterial({ color: 0xe7d58f }));
    ([[-0.3, 0.25, 0.22], [0.28, -0.1, 0.16], [-0.05, -0.4, 0.12]] as [number, number, number][]).forEach(([x, y, r]) => {
      const c = new THREE.Mesh(moonDisc, craterMat);
      c.position.set(x, y, 0.01);
      c.scale.setScalar(r);
      moon.add(c);
    });
    const moonHaloMat = track(
      new THREE.SpriteMaterial({ map: glowSoft, color: 0xfff2b3, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    const moonHalo = new THREE.Sprite(moonHaloMat);
    moonHalo.position.z = -0.5;
    moon.add(moonHalo);
    bg.add(moon);

    // drifting clouds
    const cloudMat = track(
      new THREE.SpriteMaterial({ map: glowSoft, color: 0x9fb6ff, transparent: true, opacity: 0.1, depthWrite: false })
    );
    const clouds = Array.from({ length: 4 }, (_, i) => {
      const s = new THREE.Sprite(cloudMat);
      s.userData = { y: sbRnd(0.25, 0.8), speed: sbRnd(10, 22), off: i / 4, sz: sbRnd(0.9, 1.4) };
      bg.add(s);
      return s;
    });

    // distant skyline (grows up at the start)
    const SKY_N = 30;
    const skyGeo = track(new THREE.BoxGeometry(1, 1, 1));
    const skyMat = track(new THREE.MeshBasicMaterial({ color: 0xffffff }));
    const skyline = new THREE.InstancedMesh(skyGeo, skyMat, SKY_N);
    skyline.frustumCulled = false;
    bg.add(skyline);
    const skyData = Array.from({ length: SKY_N }, (_, i) => {
      color.setHex([0x0d2a5e, 0x10316d, 0x0a2350][i % 3]);
      skyline.setColorAt(i, color);
      return { hN: sbRnd(0.12, 0.42), delay: sbRnd(0, 0.9), wN: sbRnd(0.7, 1.1) };
    });
    if (skyline.instanceColor) skyline.instanceColor.needsUpdate = true;

    // shooting star
    const shootMat = track(new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 }));
    const shootGeo = track(new THREE.PlaneGeometry(110, 2));
    const shoot = new THREE.Mesh(shootGeo, shootMat);
    shoot.rotation.z = Math.PI * 0.14;
    bg.add(shoot);

    /* =====================================================
       YARD: ground, conveyor belt, truck, crane
       ===================================================== */
    const groundMat = track(new THREE.MeshBasicMaterial({ color: 0x0a1736 }));
    const groundGeo = track(new THREE.BoxGeometry(1, 60, 300));
    const ground = new THREE.Mesh(groundGeo, groundMat);
    scene.add(ground);

    const laneMat = track(new THREE.MeshBasicMaterial({ color: 0x17305e }));
    const laneGeo = track(new THREE.BoxGeometry(1, 1, 1));
    const lane = new THREE.Mesh(laneGeo, laneMat);
    scene.add(lane);

    const edgeMat = track(new THREE.MeshBasicMaterial({ color: 0xffc400 }));
    const edge = new THREE.Mesh(laneGeo, edgeMat);
    scene.add(edge);

    const DASH_N = 40;
    const dashMat = track(new THREE.MeshBasicMaterial({ color: 0xffc400 }));
    const dashes = new THREE.InstancedMesh(laneGeo, dashMat, DASH_N);
    dashes.frustumCulled = false;
    scene.add(dashes);

    // truck (faces +x)
    const truck = new THREE.Group();
    const std = (hex: number, rough = 0.5, metal = 0.2) =>
      track(new THREE.MeshStandardMaterial({ color: hex, roughness: rough, metalness: metal }));
    const boxGeo = track(new THREE.BoxGeometry(1, 1, 1));
    const addBox = (g: THREE.Group, m: THREE.Material, sx: number, sy: number, sz: number, x: number, y: number, z: number) => {
      const b = new THREE.Mesh(boxGeo, m);
      b.scale.set(sx, sy, sz);
      b.position.set(x, y, z);
      g.add(b);
      return b;
    };
    addBox(truck, std(0x1c2a4a), 150, 8, 44, 0, 13, 0); // chassis
    addBox(truck, std(0xffc400), 98, 6, 44, -22, 20, 0); // bed floor
    addBox(truck, std(0xdba800), 98, 18, 3, -22, 29, 22); // side boards
    addBox(truck, std(0xdba800), 98, 18, 3, -22, 29, -22);
    addBox(truck, std(0xdba800), 3, 18, 44, -71, 29, 0);
    const load = [0xe9dcc0, 0xdfd0b0, 0xefe3ca];
    for (let r = 0; r < 3; r++)
      for (let c = 0; c < 3; c++)
        addBox(truck, std(load[(r + c) % 3]), 28, 11, 38, -48 + c * 30, 26 + r * 12, 0);
    addBox(truck, std(0xe30613), 46, 34, 44, 48, 33, 0); // cab
    addBox(truck, std(0xcfe4ff, 0.2, 0.6), 2, 16, 34, 71.5, 40, 0); // windscreen
    const lampMat = track(new THREE.MeshBasicMaterial({ color: 0xfff1b0 }));
    addBox(truck, lampMat, 3, 7, 9, 72, 24, 14);
    addBox(truck, lampMat, 3, 7, 9, 72, 24, -14);
    const beam = new THREE.Sprite(
      track(new THREE.SpriteMaterial({ map: glowGold, color: 0xffe9a0, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }))
    );
    beam.scale.set(120, 60, 1);
    beam.position.set(110, 24, 0);
    truck.add(beam);
    const wheelGeo = track(new THREE.CylinderGeometry(13, 13, 9, 18));
    wheelGeo.rotateX(Math.PI / 2);
    const wheelMat = std(0x0b1630, 0.8, 0.1);
    const rimMat = std(0xc6d0e4, 0.4, 0.6);
    const rimGeo = track(new THREE.CylinderGeometry(6, 6, 10, 12));
    rimGeo.rotateX(Math.PI / 2);
    const wheels: THREE.Group[] = [];
    for (const wx of [-58, -8, 56]) {
      for (const wz of [-24, 24]) {
        const w = new THREE.Group();
        w.add(new THREE.Mesh(wheelGeo, wheelMat), new THREE.Mesh(rimGeo, rimMat));
        addBox(w, rimMat, 2, 22, 2, 0, 0, wz > 0 ? 5 : -5); // spoke so rotation is visible
        w.position.set(wx, 13, wz);
        truck.add(w);
        wheels.push(w);
      }
    }
    scene.add(truck);

    // tower crane (far left, decorative)
    const crane = new THREE.Group();
    const craneMat = track(new THREE.MeshStandardMaterial({ color: 0xffc400, roughness: 0.5, metalness: 0.3, emissive: 0x6b4d00, emissiveIntensity: 0.4 }));
    const MAST_H = 330;
    addBox(crane, craneMat, 4, MAST_H, 4, -9, MAST_H / 2, 0);
    addBox(crane, craneMat, 4, MAST_H, 4, 9, MAST_H / 2, 0);
    for (let k = 0; k < MAST_H / 26; k++) {
      const br = addBox(crane, craneMat, 26, 2.4, 2.4, 0, 13 + k * 26, 0);
      br.rotation.z = k % 2 ? 0.7 : -0.7;
    }
    const jib = new THREE.Group();
    jib.position.y = MAST_H + 4;
    crane.add(jib);
    addBox(jib, craneMat, 260, 5, 5, 100, 0, 0);
    addBox(jib, craneMat, 260, 3, 3, 100, 12, 0);
    for (let k = 0; k < 11; k++) {
      const br = addBox(jib, craneMat, 26, 2, 2, -20 + k * 24, 6, 0);
      br.rotation.z = k % 2 ? 0.9 : -0.9;
    }
    addBox(jib, std(0x44587c), 26, 18, 14, -42, -8, 0); // counterweight
    const trolley = new THREE.Group();
    jib.add(trolley);
    addBox(trolley, craneMat, 10, 6, 8, 0, -4, 0);
    const cableMat = track(new THREE.MeshBasicMaterial({ color: 0xdbe5f3 }));
    const cable = addBox(trolley, cableMat, 1.4, 1, 1.4, 0, 0, 0);
    const pallet = new THREE.Group();
    addBox(pallet, std(0xe9dcc0), 30, 14, 20, 0, -7, 0);
    addBox(pallet, std(0xc8452f), 30, 14, 20, 0, 7, 0);
    trolley.add(pallet);
    const craneLampMat = track(new THREE.MeshBasicMaterial({ color: 0xff3b45 }));
    const craneLamp = new THREE.Mesh(track(new THREE.SphereGeometry(4, 10, 10)), craneLampMat);
    craneLamp.position.set(0, MAST_H + 24, 0);
    crane.add(craneLamp);
    scene.add(crane);

    /* =====================================================
       PARTICLES (sparks, fireworks)
       ===================================================== */
    const NP = 1000;
    const pPos = new Float32Array(NP * 3);
    const pCol = new Float32Array(NP * 3);
    const pVel = new Float32Array(NP * 3);
    const pBase = new Float32Array(NP * 3);
    const pLife = new Float32Array(NP);
    const pMax = new Float32Array(NP);
    for (let i = 0; i < NP; i++) pPos[i * 3 + 1] = -99999;
    const pGeo = track(new THREE.BufferGeometry());
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
    const pMat = track(
      new THREE.PointsMaterial({
        size: 4.5 * Math.min(window.devicePixelRatio, 2),
        sizeAttenuation: false,
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    const particles = new THREE.Points(pGeo, pMat);
    particles.frustumCulled = false;
    scene.add(particles);
    let pHead = 0;
    const emit = (x: number, y: number, z: number, vx: number, vy: number, vz: number, life: number, hex: number) => {
      const i = pHead;
      pHead = (pHead + 1) % NP;
      color.setHex(hex);
      pPos[i * 3] = x;
      pPos[i * 3 + 1] = y;
      pPos[i * 3 + 2] = z;
      pVel[i * 3] = vx;
      pVel[i * 3 + 1] = vy;
      pVel[i * 3 + 2] = vz;
      pBase[i * 3] = color.r;
      pBase[i * 3 + 1] = color.g;
      pBase[i * 3 + 2] = color.b;
      pLife[i] = life;
      pMax[i] = life;
    };

    /* =====================================================
       TOWERS
       ===================================================== */
    const brickGeo = track(new THREE.BoxGeometry(SB_BL - 1.6, SB_BH - 1.6, SB_BD - 1.6));
    const brickMat = track(new THREE.MeshStandardMaterial({ roughness: 0.7, metalness: 0.05 }));
    const plinthGeo = track(new THREE.BoxGeometry(SB_TW + 14, SB_PL, SB_TD + 14));
    const plinthMat = std(0x8b98ad, 0.8, 0.05);
    const winGeo = track(new THREE.BoxGeometry(14, 16, 2));
    const winMat = track(new THREE.MeshBasicMaterial({ color: 0xffffff }));
    const doorGeo = track(new THREE.BoxGeometry(24, 36, 2.5));
    const doorMat = std(0xe30613, 0.5, 0.1);
    const ringGeo = track(new THREE.RingGeometry(0.9, 1, 72));
    const beaconGeo = track(new THREE.SphereGeometry(4.5, 12, 12));

    // gable roof: triangle profile extruded along the tower width
    const roofShape = new THREE.Shape();
    roofShape.moveTo(-(SB_TD + 16) / 2, 0);
    roofShape.lineTo((SB_TD + 16) / 2, 0);
    roofShape.lineTo(0, 36);
    roofShape.closePath();
    const roofGeo = track(new THREE.ExtrudeGeometry(roofShape, { depth: SB_TW + 16, bevelEnabled: false }));
    roofGeo.translate(0, 0, -(SB_TW + 16) / 2);
    roofGeo.rotateY(Math.PI / 2);
    const roofMat = std(0xe30613, 0.6, 0.1);

    const towers: SB_Tower[] = stats.map((stat, i) => {
      const rows = SB_ROWS[i % SB_ROWS.length];
      const pal = SB_PALETTES[i % SB_PALETTES.length];
      const bricks: SB_BrickD[] = [];
      const rowLastJ: number[] = [];
      let j = 0;
      const frontZ = SB_TD / 2 - SB_BD / 2;
      for (let r = 0; r < rows; r++) {
        const y = SB_PL + r * SB_BH + SB_BH / 2;
        const lens = r % 2 ? [13, 26, 26, 26, 13] : [26, 26, 26, 26];
        const slots: { x: number; z: number; len: number; rotY: number }[] = [];
        let x = -SB_TW / 2;
        lens.forEach((l) => {
          slots.push({ x: x + l / 2, z: frontZ, len: l, rotY: 0 });
          x += l;
        });
        slots.push({ x: SB_TW / 2 - SB_BD / 2, z: 0, len: SB_TD - 2 * SB_BD, rotY: Math.PI / 2 });
        x = SB_TW / 2;
        [...lens].reverse().forEach((l) => {
          slots.push({ x: x - l / 2, z: -frontZ, len: l, rotY: 0 });
          x -= l;
        });
        slots.push({ x: -SB_TW / 2 + SB_BD / 2, z: 0, len: SB_TD - 2 * SB_BD, rotY: Math.PI / 2 });
        slots.forEach((s) => {
          const sl = new THREE.Vector3(s.x, y, s.z);
          bricks.push({
            sl,
            st: new THREE.Vector3(-300, 10, 100),
            spin: new THREE.Vector3(sbRnd(-4, 4), sbRnd(-4, 4), sbRnd(-4, 4)),
            len: s.len,
            rotY: s.rotY,
            row: r,
            j: j++,
            arc: sbRnd(90, 190) + y * 0.25,
            state: 0,
            landed: false,
          });
        });
        rowLastJ[r] = j - 1;
      }
      const n = bricks.length;
      const step = (rows * SB_ROW_SEC) / n;
      const start = SB_START_DELAY + i * SB_STAGGER;
      const lastLand = start + (n - 1) * step + SB_FLIGHT;
      const roofAt = lastLand + 0.05;
      const done = roofAt + SB_ROOF_SEC;
      const rowLand = rowLastJ.map((lj) => start + lj * step + SB_FLIGHT);

      const group = new THREE.Group();
      scene.add(group);

      const mesh = new THREE.InstancedMesh(brickGeo, brickMat, n);
      mesh.frustumCulled = false;
      bricks.forEach((_b, k) => {
        color.setHex(pal[Math.floor(Math.random() * pal.length)]).offsetHSL(0, 0, sbRnd(-0.035, 0.035));
        mesh.setColorAt(k, color);
        dummy.position.set(0, 0, 0);
        dummy.scale.set(0, 0, 0);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        mesh.setMatrixAt(k, dummy.matrix);
      });
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      group.add(mesh);

      const plinth = new THREE.Mesh(plinthGeo, plinthMat);
      plinth.position.y = SB_PL / 2;
      plinth.scale.setScalar(0);
      group.add(plinth);

      const roof = new THREE.Mesh(roofGeo, roofMat);
      roof.visible = false;
      group.add(roof);
      const roofTop = SB_PL + rows * SB_BH + 36;

      const beaconMat = track(new THREE.MeshBasicMaterial({ color: 0x5a0a10 }));
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.set(0, roofTop + 4, 0);
      beacon.visible = false;
      group.add(beacon);
      const haloMat = track(
        new THREE.SpriteMaterial({ map: glowRed, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      const halo = new THREE.Sprite(haloMat);
      halo.scale.setScalar(60);
      halo.position.copy(beacon.position);
      group.add(halo);

      // windows
      const wins: SB_WinD[] = [];
      for (let r = 3; r < rows - 1; r += 2)
        for (const wx of [-30, 0, 30])
          wins.push({
            x: wx,
            y: SB_PL + r * SB_BH + SB_BH,
            row: r,
            onAt: done + sbRnd(0.05, 0.5) + r * 0.04 + (wx + 30) * 0.004,
            dark: Math.random() < 0.26,
            phase: sbRnd(0, 6),
            flick: Math.random() < 0.14,
          });
      const winMesh = new THREE.InstancedMesh(winGeo, winMat, Math.max(wins.length, 1));
      winMesh.frustumCulled = false;
      wins.forEach((_, k) => {
        color.setHex(0x0b1736);
        winMesh.setColorAt(k, color);
        dummy.scale.set(0, 0, 0);
        dummy.updateMatrix();
        winMesh.setMatrixAt(k, dummy.matrix);
      });
      if (winMesh.instanceColor) winMesh.instanceColor.needsUpdate = true;
      group.add(winMesh);

      const door = new THREE.Mesh(doorGeo, doorMat);
      door.position.set(0, SB_PL + 18, SB_TD / 2 + 0.8);
      door.scale.setScalar(0);
      group.add(door);

      const ringMat = track(new THREE.MeshBasicMaterial({ color: 0xffc400, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }));
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.visible = false;
      scene.add(ring);

      return {
        i,
        value: stat.value,
        rows,
        n,
        step,
        start,
        lastLand,
        roofAt,
        done,
        rowLand,
        group,
        bricks,
        mesh,
        plinth,
        roof,
        beacon,
        beaconMat,
        halo,
        haloMat,
        winMesh,
        wins,
        door,
        ring,
        ringMat,
        x: 0,
        hover: 0,
        burst: false,
        lastCount: -1,
        roofTop,
      };
    });
    towers.forEach((t) => disposables.push(t.mesh, t.winMesh));

    /* ---------- layout (called on resize) ---------- */
    let W = 1;
    let H = 1;
    let D = 500;
    let groundY = -100;
    let farY = -100; // screen y of the far ground edge
    let colW = 100;
    let towerScale = 1;
    let skyBuilt = 0;

    const layout = () => {
      W = stage.clientWidth || 1;
      H = stage.clientHeight || 1;
      renderer.setSize(W, H);
      D = H / 2 / Math.tan(THREE.MathUtils.degToRad(25));
      camera.aspect = W / H;
      camera.near = 10;
      camera.far = D + 2500;
      camera.position.set(0, 0, D);
      camera.updateProjectionMatrix();

      groundY = -H / 2 + SB_GROUND_PX;
      farY = (groundY * D) / (D + 40);
      ground.scale.x = W * 1.6;
      ground.position.set(0, groundY - 30, 110);
      lane.scale.set(W * 1.6, 0.6, 30);
      lane.position.set(0, groundY + 0.4, 100);
      edge.scale.set(W * 1.6, 2.4, 3);
      edge.position.set(0, groundY - 1.2, 165);

      // tower x from the DOM columns
      const sr = stage.getBoundingClientRect();
      const maxRows = Math.max(...towers.map((t) => t.rows));
      const availH = H - SB_GROUND_PX - 26;
      const needH = SB_PL + maxRows * SB_BH + 36 + 24;
      let colMin = W;
      items.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        towers[i].x = r.left + r.width / 2 - sr.left - W / 2;
        colMin = Math.min(colMin, r.width);
      });
      colW = colMin;
      towerScale = Math.min(1, (colW * 0.8) / (SB_TW + 14), availH / needH);
      towers.forEach((t) => {
        t.group.position.set(t.x, groundY, 0);
        t.group.scale.setScalar(towerScale);
        t.ring.position.set(t.x, groundY + 1.5, 10);
      });

      // brick start points: on the belt, left of each tower
      towers.forEach((t) => {
        t.bricks.forEach((b) => {
          b.st.set(-(160 + sbRnd(0, 150)) / towerScale - 40, 8, 100 / towerScale);
        });
      });

      // far layers
      const fMoon = (D + 300) / D;
      const fStar = (D + 450) / D;
      starPts.forEach((s, k) => {
        const arr = starNorm[k];
        const pos = s.geo.getAttribute('position') as THREE.BufferAttribute;
        arr.forEach((p, i) => pos.setXYZ(i, p.x * (W / 2) * fStar, p.y * (H / 2) * fStar, -450));
        pos.needsUpdate = true;
      });
      moon.position.set((W / 2 - Math.min(90, W * 0.14)) * fMoon, (H / 2 - 70) * fMoon, -300);
      moon.scale.setScalar(Math.min(26, W * 0.05) * fMoon);
      moonHalo.scale.setScalar(5);
      clouds.forEach((c) => {
        c.scale.set(420 * c.userData.sz * fStar, 70 * c.userData.sz * fStar, 1);
        c.position.y = (c.userData.y - 0.5) * H * fStar * 0.9 + H * 0.12;
        c.position.z = -430;
      });
      skyBuilt = 0; // skyline is (re)built in the loop, growing up from 0
    };

    const layoutSky = (time: number) => {
      const f = (D + 260) / D;
      const baseY = farY * f;
      const cw = (W * f * 1.1) / SKY_N;
      let growing = false;
      skyData.forEach((s, i) => {
        const g = sbEaseOutCubic(sbClamp01((time - s.delay) / 1.1));
        if (g < 1) growing = true;
        const h = s.hN * H * f * g + 0.01;
        dummy.position.set((i / (SKY_N - 1) - 0.5) * W * f * 1.1, baseY + h / 2, -260);
        dummy.scale.set(cw * s.wN, h, 40);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        skyline.setMatrixAt(i, dummy.matrix);
      });
      skyline.instanceMatrix.needsUpdate = true;
      skyBuilt = growing ? 0 : 1;
    };

    const ro = new ResizeObserver(layout);
    ro.observe(stage);
    ro.observe(infos);

    /* ---------- pointer ---------- */
    const pointer = { x: 0, y: 0, cx: -9999, cy: -9999 };
    const onPointer = (e: PointerEvent) => {
      const r = section.getBoundingClientRect();
      pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.y = ((e.clientY - r.top) / r.height) * 2 - 1;
      pointer.cx = e.clientX;
      pointer.cy = e.clientY;
    };
    const onLeave = () => {
      pointer.cx = pointer.cy = -9999;
    };
    section.addEventListener('pointermove', onPointer);
    section.addEventListener('pointerleave', onLeave);

    /* =====================================================
       UPDATE
       ===================================================== */
    const tmpPos = new THREE.Vector3();
    const worldOf = (t: SB_Tower, p: THREE.Vector3) =>
      tmpPos.set(t.x + p.x * towerScale, groundY + t.group.position.y * 0 + p.y * towerScale, p.z * towerScale);

    const update = (time: number, now: number, dt: number) => {
      /* --- ambient world (always running) --- */
      starPts[0].mat.opacity = 0.35 + 0.45 * (0.5 + 0.5 * Math.sin(now * 1.7));
      starPts[1].mat.opacity = 0.35 + 0.45 * (0.5 + 0.5 * Math.sin(now * 1.7 + Math.PI));
      moon.position.y += Math.sin(now * 0.7) * 0.05;
      const fStar = (D + 450) / D;
      clouds.forEach((c) => {
        const span = W * fStar * 1.5;
        const x = ((c.userData.off * span + now * c.userData.speed) % span) - span / 2;
        c.position.x = x;
      });
      // shooting star every ~8s
      const cyc = now % 8;
      if (cyc < 1) {
        const q = cyc;
        shootMat.opacity = Math.sin(q * Math.PI) * 0.9;
        shoot.position.set((W * 0.4 - q * W * 0.5) * fStar, (H * 0.34 - q * H * 0.28) * fStar, -440);
      } else shootMat.opacity = 0;

      // parallax of the far layers; gold key light follows the mouse
      bg.position.x += (-pointer.x * 26 - bg.position.x) * 0.06;
      bg.position.y += (pointer.y * 10 - bg.position.y) * 0.06;
      keyLight.position.x += ((pointer.x * 500) - keyLight.position.x) * 0.05;

      if (!skyBuilt) layoutSky(Math.max(time, 0));

      // belt dashes
      const span = DASH_N * 46;
      for (let k = 0; k < DASH_N; k++) {
        const x = ((k * 46 + now * 150) % span) - span / 2 - 0;
        dummy.position.set((x / span) * (W * 1.5), groundY + 0.9, 100);
        dummy.scale.set(22, 0.8, 3);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        dashes.setMatrixAt(k, dummy.matrix);
      }
      dashes.instanceMatrix.needsUpdate = true;

      // truck
      const tSpeed = 120;
      const tSpan = W + 520;
      const tPeriod = tSpan / tSpeed + 3.5;
      const tt = (now + 2) % tPeriod;
      const tDist = Math.min(tt * tSpeed, tSpan);
      truck.position.set(-W / 2 - 260 + tDist, groundY, 62);
      truck.scale.setScalar(W < 700 ? 0.75 : 1);
      truck.position.y = groundY + Math.abs(Math.sin(now * 9)) * 0.7;
      wheels.forEach((w) => (w.rotation.z = -tDist / 13));
      truck.visible = tt * tSpeed < tSpan;

      // crane
      crane.visible = W > 700;
      if (crane.visible) {
        crane.position.set(-W / 2 + 56, (farY * (D + 80)) / D, -80);
        jib.rotation.y = Math.sin(now * 0.35) * 0.42 + 0.35;
        const tx = 90 + (Math.sin(now * 0.5) * 0.5 + 0.5) * 140;
        const drop = 70 + (Math.sin(now * 0.8) * 0.5 + 0.5) * 70;
        trolley.position.set(tx, 0, 0);
        cable.scale.y = drop;
        cable.position.y = -drop / 2 - 2;
        pallet.position.y = -drop - 4;
        pallet.rotation.y = Math.sin(now * 0.9) * 0.25;
        craneLampMat.color.setHex(Math.sin(now * 4) > 0 ? 0xff3b45 : 0x4a0a10);
      }

      /* --- hover --- */
      const sr = stage.getBoundingClientRect();
      let hoverIdx = -1;
      if (pointer.cy > sr.top && pointer.cy < sr.bottom) {
        const px = pointer.cx - sr.left - W / 2;
        towers.forEach((t) => {
          if (Math.abs(px - t.x) < colW / 2) hoverIdx = t.i;
        });
      }

      /* --- towers --- */
      towers.forEach((tw) => {
        const el = items[tw.i];
        tw.hover += ((tw.i === hoverIdx ? 1 : 0) - tw.hover) * Math.min(1, dt * 8);
        const doneQ = sbClamp01((time - tw.done) / 0.55);
        const bounce = time > tw.done ? Math.sin(doneQ * Math.PI) * (1 - doneQ) * 9 : 0;
        tw.group.position.y = groundY + tw.hover * 7 + bounce;

        if (time >= tw.start - 0.1) el.classList.add('is-live');

        // plinth pops in
        const pp = sbClamp01((time - tw.start + 0.2) / 0.35);
        tw.plinth.scale.setScalar(pp > 0 ? sbEaseOutBack(pp) : 0);

        // bricks
        let changed = false;
        for (let k = 0; k < tw.bricks.length; k++) {
          const b = tw.bricks[k];
          if (b.state === 2) continue;
          const launch = tw.start + b.j * tw.step;
          if (time < launch) continue;
          const land = launch + SB_FLIGHT;
          changed = true;
          if (time >= land + 0.3) {
            dummy.position.copy(b.sl);
            dummy.rotation.set(0, b.rotY, 0);
            dummy.scale.set(b.len / SB_BL, 1, 1);
            b.state = 2;
            if (!b.landed) b.landed = true;
          } else {
            const p = sbClamp01((time - launch) / SB_FLIGHT);
            const e = sbSmooth(p);
            dummy.position.lerpVectors(b.st, b.sl, e);
            dummy.position.y += Math.sin(Math.PI * p) * b.arc;
            const q = (1 - p) * (1 - p);
            dummy.rotation.set(b.spin.x * q, b.rotY + b.spin.y * q, b.spin.z * q);
            const pop = sbSmooth(sbClamp01(p * 12));
            let sx = (b.len / SB_BL) * pop;
            let sy = pop;
            let sz = pop;
            if (p >= 1) {
              if (!b.landed) {
                b.landed = true;
                if (time - land < 0.25 && b.j % 2 === 0) {
                  const w = worldOf(tw, b.sl);
                  for (let s = 0; s < 2; s++)
                    emit(w.x, w.y, w.z + 12, sbRnd(-70, 70), sbRnd(40, 150), sbRnd(0, 40), sbRnd(0.4, 0.8), SB_SPARK[Math.floor(Math.random() * 2)]);
                }
              }
              const sq = sbClamp01((time - land) / 0.3);
              const k2 = Math.sin(sq * Math.PI) * (1 - sq);
              sx *= 1 + 0.2 * k2;
              sz *= 1 + 0.2 * k2;
              sy *= 1 - 0.3 * k2;
            }
            dummy.scale.set(sx, sy, sz);
          }
          dummy.updateMatrix();
          tw.mesh.setMatrixAt(k, dummy.matrix);
        }
        if (changed) tw.mesh.instanceMatrix.needsUpdate = true;

        // counter
        const frac = sbClamp01((time - tw.start - SB_FLIGHT) / (tw.step * tw.n));
        const count = time >= tw.lastLand ? tw.value : Math.round(tw.value * frac);
        if (count !== tw.lastCount) {
          tw.lastCount = count;
          const n = numRefs.current[tw.i];
          if (n) n.textContent = String(count);
        }

        // door
        const dp = sbClamp01((time - (tw.rowLand[2] ?? 0)) / 0.3);
        tw.door.scale.setScalar(time >= (tw.rowLand[2] ?? 0) ? sbEaseOutBack(dp) : 0);

        // roof
        const rp = sbClamp01((time - tw.roofAt) / SB_ROOF_SEC);
        if (rp > 0) {
          tw.roof.visible = true;
          const e = sbEaseOutBack(rp);
          tw.roof.position.y = SB_PL + tw.rows * SB_BH + (1 - e) * 320;
          const land = rp >= 1 ? sbClamp01((time - tw.done) / 0.3) : 0;
          const k2 = Math.sin(land * Math.PI) * (1 - land);
          tw.roof.scale.set(1 + 0.08 * k2, 1 - 0.15 * k2, 1 + 0.08 * k2);
          tw.roof.rotation.z = (1 - rp) * (tw.i % 2 ? 0.5 : -0.5);
        }

        // celebration
        if (time >= tw.done && !tw.burst) {
          tw.burst = true;
          el.classList.add('is-done');
          if (time - tw.done < 0.5) {
            const w = worldOf(tw, new THREE.Vector3(0, tw.roofTop, 0));
            for (let s = 0; s < 54; s++) {
              const a = sbRnd(0, Math.PI * 2);
              const sp = sbRnd(90, 300);
              emit(w.x, w.y, 10, Math.cos(a) * sp, Math.sin(a) * sp + 80, sbRnd(-30, 30), sbRnd(0.9, 1.5), SB_SPARK[Math.floor(Math.random() * SB_SPARK.length)]);
            }
          }
        }
        // ring shockwave
        const ringQ = sbClamp01((time - tw.done) / 0.9);
        tw.ring.visible = time >= tw.done && ringQ < 1;
        if (tw.ring.visible) {
          tw.ring.scale.setScalar(30 + sbEaseOutCubic(ringQ) * 230);
          tw.ringMat.opacity = (1 - ringQ) * 0.75;
        }

        // beacon blink
        if (time >= tw.done) {
          tw.beacon.visible = true;
          const on = Math.sin(time * 5 + tw.i) > 0;
          tw.beaconMat.color.setHex(on ? 0xff5a62 : 0x5a0a10);
          tw.haloMat.opacity = on ? 0.9 : 0.12;
          tw.halo.scale.setScalar(on ? 64 : 40);
        }

        // windows
        let wchanged = false;
        for (let k = 0; k < tw.wins.length; k++) {
          const w = tw.wins[k];
          const rl = tw.rowLand[w.row] ?? 0;
          if (time < rl) continue;
          wchanged = true;
          const pop = sbEaseOutBack(sbClamp01((time - rl) / 0.3));
          dummy.position.set(w.x, w.y, SB_TD / 2 + 1.3);
          dummy.rotation.set(0, 0, 0);
          dummy.scale.setScalar(pop);
          dummy.updateMatrix();
          tw.winMesh.setMatrixAt(k, dummy.matrix);
          let lit = w.dark ? 0 : sbClamp01((time - w.onAt) / 0.25);
          if (w.flick && lit > 0 && Math.sin(now * 2.2 + w.phase) > 0.93) lit *= 0.35;
          color.setHex(0x0b1736);
          if (lit > 0) color.lerp(new THREE.Color(SB_LIT[(k + tw.i) % SB_LIT.length]), lit);
          const wave = tw.hover * Math.max(0, Math.sin(now * 7 - w.y * 0.05));
          if (wave > 0.02) color.lerp(new THREE.Color(0xffffff), wave * 0.8);
          tw.winMesh.setColorAt(k, color);
        }
        if (wchanged) {
          tw.winMesh.instanceMatrix.needsUpdate = true;
          if (tw.winMesh.instanceColor) tw.winMesh.instanceColor.needsUpdate = true;
        }

        // hover sparks from the roof
        if (tw.hover > 0.5 && time > tw.done && Math.random() < dt * 14) {
          const w = worldOf(tw, new THREE.Vector3(sbRnd(-40, 40), tw.roofTop, 0));
          emit(w.x, w.y, 10, sbRnd(-40, 40), sbRnd(60, 160), 0, sbRnd(0.5, 0.9), SB_SPARK[Math.floor(Math.random() * SB_SPARK.length)]);
        }
      });

      /* --- particles --- */
      for (let i = 0; i < NP; i++) {
        if (pLife[i] <= 0) continue;
        pLife[i] -= dt;
        if (pLife[i] <= 0) {
          pPos[i * 3 + 1] = -99999;
          continue;
        }
        pVel[i * 3 + 1] -= 480 * dt;
        pPos[i * 3] += pVel[i * 3] * dt;
        pPos[i * 3 + 1] += pVel[i * 3 + 1] * dt;
        pPos[i * 3 + 2] += pVel[i * 3 + 2] * dt;
        const f = pLife[i] / pMax[i];
        pCol[i * 3] = pBase[i * 3] * f;
        pCol[i * 3 + 1] = pBase[i * 3 + 1] * f;
        pCol[i * 3 + 2] = pBase[i * 3 + 2] * f;
      }
      pGeo.attributes.position.needsUpdate = true;
      pGeo.attributes.color.needsUpdate = true;
    };

    /* ---------- loop ---------- */
    layout();
    let raf = 0;
    let startedAt = -1;
    let last = performance.now() / 1000;

    if (reduceMotion) {
      update(999, 0, 0);
      setFinal();
      renderer.render(scene, camera);
      const rr = new ResizeObserver(() => {
        layout();
        update(999, 0, 0);
        renderer.render(scene, camera);
      });
      rr.observe(stage);
      return () => {
        rr.disconnect();
        ro.disconnect();
        section.removeEventListener('pointermove', onPointer);
        section.removeEventListener('pointerleave', onLeave);
        disposables.forEach((d) => d.dispose());
        renderer.dispose();
        renderer.domElement.remove();
      };
    }

    const frame = () => {
      raf = requestAnimationFrame(frame);
      const now = performance.now() / 1000;
      const dt = Math.min(0.05, now - last);
      last = now;
      const r = section.getBoundingClientRect();
      const onScreen = r.bottom > 0 && r.top < window.innerHeight;
      if (!onScreen) return;
      if (startedAt < 0 && r.top < window.innerHeight - 100) startedAt = now;
      const time = startedAt < 0 ? -1 : now - startedAt;
      update(time, now, dt);
      renderer.render(scene, camera);
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      section.removeEventListener('pointermove', onPointer);
      section.removeEventListener('pointerleave', onLeave);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  const style = { ['--n' as string]: stats.length } as CSSProperties;

  return (
    <section className="sb" ref={sectionRef} aria-label="JPS by the numbers" style={style}>
      <style>{sbCss}</style>

      <div className="sb-stage" ref={stageRef} aria-hidden="true" />

      <div className="sb-body">
        <div className="container">
          <div className="sb-infos" ref={infosRef}>
            {stats.map(({ value, suffix, label, icon: Icon }, index) => (
              <div className="sb-info" key={label} style={{ ['--i' as string]: index } as CSSProperties}>
                <span className="sb-sr">
                  {value}
                  {suffix}
                </span>
                <span className="sb-icon" aria-hidden="true">
                  <Icon size={21} strokeWidth={1.9} />
                </span>
                <strong className="sb-num" aria-hidden="true">
                  <b
                    ref={(el) => {
                      numRefs.current[index] = el;
                    }}
                  >
                    0
                  </b>
                  <span>{suffix}</span>
                </strong>
                <small>{label}</small>
                <span className="sb-bar" aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const sbCss = `
.sb {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  color: #fff;
  background: linear-gradient(180deg, #030a1e 0%, #082058 62%, #103a8a 100%);
}
.sb-stage {
  position: relative;
  height: clamp(380px, 46vw, 470px);
}
.sb-stage canvas {
  display: block;
  width: 100% !important;
  height: 100% !important;
}
/* floor colour in the canvas == this colour, so the two join seamlessly */
.sb-body {
  position: relative;
  z-index: 1;
  padding: 6px 0 clamp(40px, 5vw, 64px);
  background: #0a1736;
}
.sb-infos {
  display: grid;
  grid-template-columns: repeat(var(--n), 1fr);
}
.sb-info {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding-inline: 6px;
  text-align: center;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.sb-info.is-live { opacity: 1; transform: none; }
.sb-icon {
  position: relative;
  display: grid;
  width: 52px;
  height: 52px;
  place-items: center;
  color: #fff;
  border-radius: 14px;
  background: var(--brand-red);
  box-shadow: 0 10px 24px rgb(227 6 19 / 40%);
  transition: transform 0.4s cubic-bezier(0.3, 1.5, 0.5, 1);
}
.sb-icon::after {
  position: absolute;
  inset: 0;
  border: 2px solid var(--brand-red);
  border-radius: 14px;
  content: "";
  opacity: 0;
}
.sb-info.is-done .sb-icon::after { animation: sb-ring 2.8s ease-out infinite; }
.sb-info:hover .sb-icon { transform: rotate(-10deg) scale(1.12); }
.sb-num {
  display: block;
  font: 800 clamp(28px, 4.8vw, 58px) / 1 var(--font-heading);
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
}
.sb-num b { font-weight: inherit; }
.sb-num span {
  margin-left: 2px;
  color: var(--brand-gold);
}
.sb-info.is-done .sb-num { animation: sb-glow 3.4s ease-in-out infinite; }
.sb-info small {
  color: rgb(255 255 255 / 82%);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.sb-bar {
  width: 44px;
  height: 3px;
  border-radius: 3px;
  background: linear-gradient(90deg, var(--brand-red), var(--brand-gold));
  transform: scaleX(0);
  transition: transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.sb-info.is-done .sb-bar { transform: scaleX(1); }
.sb-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
@keyframes sb-ring {
  0% { opacity: 0.5; transform: scale(1); }
  70%, 100% { opacity: 0; transform: scale(1.6); }
}
@keyframes sb-glow {
  0%, 100% { text-shadow: 0 0 0 rgb(255 196 0 / 0%); }
  50% { text-shadow: 0 0 22px rgb(255 196 0 / 38%); }
}
@media (max-width: 560px) {
  .sb-icon { width: 40px; height: 40px; border-radius: 11px; }
  .sb-info { gap: 8px; padding-inline: 2px; }
  .sb-info small { font-size: 9.5px; letter-spacing: 0.04em; }
  .sb-num { font-size: 24px; }
}
@media (prefers-reduced-motion: reduce) {
  .sb-info { opacity: 1; transform: none; transition: none; }
  .sb-info .sb-bar { transform: scaleX(1); }
  .sb-icon::after, .sb-num { animation: none !important; }
}
`;































import { Fragment,  type PointerEvent } from "react";
// ↓ adjust to match your project (processSteps = [{ title, description }, ...])


/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */
const limit = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

function useRevealOnce<T extends HTMLElement>(threshold = 0.3) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen] as const;
}

/* Each word rises out of a mask. The space sits OUTSIDE the mask, so words keep their gap. */
function RiseWords({ text, start = 0 }: { text: string; start?: number }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <Fragment key={w + i}>
          <span className="stg-w">
            <i style={{ ["--i" as string]: start + i } as CSSProperties}>{w}</i>
          </span>{" "}
        </Fragment>
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  STYLES (embedded so this stays a single file)                      */
/* ------------------------------------------------------------------ */
const stagesCss = `
.stg {
  --st-blue: var(--brand-blue, #003a8f);
  --st-gold: var(--brand-gold, #ffc400);
  --st-red: var(--brand-red, #e11d2a);
  --st-ink: var(--heading-ink, #08152f);
  --st-text: var(--body-ink, #47536a);
  --st-font: var(--font-heading, inherit);
  position: relative;
  overflow: clip;
}
.stg .container { position: relative; z-index: 1; }

/* ---------- blueprint background ---------- */
.stg-bg { position: absolute; inset: 0; pointer-events: none; }
.stg-grid-bg {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgb(0 58 143 / 6%) 1px, transparent 1px),
    linear-gradient(90deg, rgb(0 58 143 / 6%) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse 80% 60% at 50% 45%, #000 20%, transparent 80%);
}
.stg-blob { position: absolute; border-radius: 50%; filter: blur(80px); animation: stg-float 14s ease-in-out infinite alternate; }
.stg-blob--b { top: 4%; right: -6%; width: 360px; height: 360px; background: rgb(0 58 143 / 12%); }
.stg-blob--g { bottom: 2%; left: -6%; width: 340px; height: 340px; background: rgb(255 196 0 / 20%); animation-delay: -6s; }

/* ---------- heading ---------- */
.stg-head { max-width: 720px; margin: 0 auto; text-align: center; }
.stg-eyebrow { display: inline-flex; align-items: center; gap: 10px; color: var(--st-blue); font-size: 13px; font-weight: 800; letter-spacing: .12em; opacity: 0; }
.stg-eyebrow::before, .stg-eyebrow::after { content: ""; width: 28px; height: 2px; background: var(--st-gold); transform: scaleX(0); }
.stg-eyebrow::before { transform-origin: right; }
.stg-eyebrow::after { transform-origin: left; }
.stg-head h2 { margin: 16px 0 14px; color: var(--st-ink); font: 800 clamp(2rem, 3.8vw, 3.2rem) / 1.14 var(--st-font); letter-spacing: -.05em; }
.stg-w { display: inline-block; overflow: hidden; vertical-align: top; padding-bottom: .14em; margin-bottom: -.14em; }
.stg-w > i { display: inline-block; font-style: normal; transform: translateY(115%) rotate(5deg); }
.stg-mark { position: relative; color: var(--st-blue); z-index: 0; }
.stg-mark::after { content: ""; position: absolute; z-index: -1; left: -4px; right: -4px; bottom: .06em; height: .34em; border-radius: 3px; background: linear-gradient(90deg, rgb(255 196 0 / 70%), rgb(255 196 0 / 25%)); transform: scaleX(0); transform-origin: left; }
.stg-lead { max-width: 560px; margin: 0 auto; color: var(--st-text); font-size: 16px; line-height: 1.8; opacity: 0; }
.stg-head.is-in .stg-eyebrow { animation: stg-fade .6s ease .05s forwards; }
.stg-head.is-in .stg-eyebrow::before, .stg-head.is-in .stg-eyebrow::after { animation: stg-draw .7s cubic-bezier(.6, 0, .2, 1) .2s forwards; }
.stg-head.is-in .stg-w > i { animation: stg-rise .9s cubic-bezier(.2, .8, .2, 1) forwards; animation-delay: calc(.25s + var(--i) * .1s); }
.stg-head.is-in .stg-mark::after { animation: stg-draw .9s cubic-bezier(.6, 0, .2, 1) 1.2s forwards; }
.stg-head.is-in .stg-lead { animation: stg-fade-up .8s ease .9s forwards; }

/* ---------- stage grid + conveyor track ---------- */
.stg-stages {
  position: relative; display: grid; grid-template-columns: repeat(var(--n, 4), minmax(0, 1fr));
  gap: 22px; margin-top: 40px; padding-top: 84px;
}

.stg-track {
  position: absolute; z-index: 1; left: var(--ax, 0px); top: var(--ay, 0px); width: var(--len, 0px); height: 4px;
  transform: translateY(-50%); border-radius: 4px; pointer-events: none;
  background: repeating-linear-gradient(90deg, rgb(0 58 143 / 22%) 0 10px, transparent 10px 18px);
}
.stg-fill {
  position: absolute; inset: 0; border-radius: 4px;
  background: linear-gradient(90deg, var(--st-blue), var(--st-gold));
  transform-origin: left; transform: scaleX(var(--fp, 0));
}
.stg-brick {
  position: absolute; top: 50%; left: calc(var(--fp, 0) * 100%); z-index: 3; width: 40px; height: 22px; border-radius: 3px;
  background: linear-gradient(180deg, #e2573f, #b3321f);
  box-shadow: inset 0 2px 0 rgb(255 255 255 / 30%), inset 0 -3px 0 rgb(0 0 0 / 22%), 0 14px 14px -8px rgb(8 21 47 / 50%);
  transform: translate(-50%, -62%) rotate(var(--rot, 0deg));
}
.stg-brick::before, .stg-brick::after { content: ""; position: absolute; top: 6px; width: 9px; height: 8px; border-radius: 2px; background: rgb(0 0 0 / 22%); }
.stg-brick::before { left: 7px; }
.stg-brick::after { right: 7px; }

/* ---------- node on the track ---------- */
.stg-item { position: relative; perspective: 900px; }
.stg-node {
  position: absolute; z-index: 2; left: 50%; top: -70px; width: 28px; height: 28px; margin-left: -14px; border-radius: 50%;
  background: #fff; border: 3px solid rgb(0 58 143 / 25%); transition: background .4s, border-color .4s, transform .5s cubic-bezier(.3, 1.6, .5, 1);
}
.stg-node::after { content: ""; position: absolute; inset: -3px; border-radius: 50%; border: 2px solid var(--st-gold); opacity: 0; }
.stg-item[data-on='true'] .stg-node { background: var(--st-blue); border-color: var(--st-gold); transform: scale(1.2); }
.stg-item[data-on='true'] .stg-node::after { animation: stg-ping 1.1s ease-out; }

/* ---------- card ---------- */
.stg-step {
  --mx: 50%; --my: 50%; --rx: 0deg; --ry: 0deg;
  position: relative; overflow: hidden; height: 100%; min-height: 300px; padding: 28px 24px 34px; border: 1px solid #e3e8f0; border-radius: 16px; background: #fff;
  box-shadow: 0 22px 44px -26px rgb(8 21 47 / 30%);
  opacity: 0; translate: 0 54px; transform: rotateX(var(--rx)) rotateY(var(--ry));
  transition: opacity .8s ease, translate .9s cubic-bezier(.2, .9, .2, 1), transform .25s ease-out, box-shadow .3s;
}
.stg-item[data-on='true'] .stg-step { opacity: 1; translate: 0 0; }
.stg-step:hover { box-shadow: 0 30px 52px -24px rgb(8 21 47 / 40%); }
.stg-step::before {
  content: ""; position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity .3s;
  background: radial-gradient(260px circle at var(--mx) var(--my), rgb(255 196 0 / 20%), rgb(0 58 143 / 5%) 45%, transparent 70%);
}
.stg-step:hover::before { opacity: 1; }

/* big outlined number that fills up when the brick arrives */
.stg-num { position: relative; display: inline-block; color: transparent; font: 800 68px / 1 var(--st-font); letter-spacing: -.04em; -webkit-text-stroke: 1.5px rgb(0 58 143 / 28%); }
.stg-num::after {
  content: attr(data-n); position: absolute; left: 0; top: 0; -webkit-text-stroke: 0;
  background: linear-gradient(180deg, var(--st-gold), var(--st-blue) 85%); -webkit-background-clip: text; background-clip: text; color: transparent;
  clip-path: inset(100% 0 0 0); transition: clip-path 1.1s cubic-bezier(.6, 0, .2, 1) .25s;
}
.stg-item[data-on='true'] .stg-num::after { clip-path: inset(0 0 0 0); }

.stg-kicker { display: block; margin-top: 14px; color: var(--st-blue); font-size: 13px; font-weight: 800; letter-spacing: .06em; }
.stg-step h3 { margin: 6px 0 8px; color: var(--st-ink); font: 800 clamp(1.15rem, 1.7vw, 1.4rem) / 1.25 var(--st-font); letter-spacing: -.03em; }
.stg-step p { margin: 0; color: #657184; font-size: 15px; line-height: 1.75; }

.stg-line { display: block; overflow: hidden; }
.stg-line > * { display: block; transform: translateY(110%); opacity: 0; transition: transform .75s cubic-bezier(.2, .9, .2, 1) calc(var(--s, 0) * 90ms + 250ms), opacity .5s calc(var(--s, 0) * 90ms + 250ms); }
.stg-item[data-on='true'] .stg-line > * { transform: none; opacity: 1; }

/* bottom bar that draws itself */
.stg-bar { position: absolute; left: 0; right: 0; bottom: 0; height: 5px; background: linear-gradient(90deg, var(--st-blue), var(--st-gold)); transform: scaleX(0); transform-origin: left; transition: transform 1.2s cubic-bezier(.6, 0, .2, 1) .4s; }
.stg-item[data-on='true'] .stg-bar { transform: scaleX(1); }

/* ---------- mini scenes: one per stage ---------- */
.stg-scene { position: absolute; top: 22px; right: 22px; width: 64px; height: 64px; overflow: hidden; border-radius: 14px; background: rgb(0 58 143 / 6%); border: 1px solid rgb(0 58 143 / 10%); }
.stg-scene i, .stg-scene::after { position: absolute; display: block; content: ""; }
.stg-scene i { animation-play-state: paused; }
.stg-item[data-on='true'] .stg-scene i { animation-play-state: running; }

/* 1: aggregate pours into a heap */
.stg-scene[data-k='0'] i { top: -8px; width: 7px; height: 7px; border-radius: 50%; background: #7d8aa3; animation: stg-fall 1.5s linear infinite; }
.stg-scene[data-k='0'] i:nth-child(1) { left: 16px; }
.stg-scene[data-k='0'] i:nth-child(2) { left: 29px; animation-delay: -.5s; }
.stg-scene[data-k='0'] i:nth-child(3) { left: 42px; animation-delay: -1s; }
.stg-scene[data-k='0']::after { left: 8px; right: 8px; bottom: 0; height: 24px; background: #95a1b8; clip-path: polygon(0 100%, 50% 10%, 100% 100%); }

/* 2: drum mixing */
.stg-scene[data-k='1'] i:nth-child(1) { left: 10px; top: 10px; width: 44px; height: 44px; border-radius: 50%; background: conic-gradient(var(--st-blue), var(--st-gold), var(--st-blue) 50%, var(--st-gold) 75%, var(--st-blue)); animation: stg-spin 2.2s linear infinite; }
.stg-scene[data-k='1'] i:nth-child(n + 2) { display: none; }
.stg-scene[data-k='1']::after { left: 24px; top: 24px; width: 16px; height: 16px; border-radius: 50%; background: #fff; box-shadow: 0 0 0 3px rgb(8 21 47 / 15%); }

/* 3: press into the mould */
.stg-scene[data-k='2'] i:nth-child(1) { left: 14px; top: 6px; width: 36px; height: 9px; border-radius: 2px; background: var(--st-gold); animation: stg-press 1.6s ease-in-out infinite; }
.stg-scene[data-k='2'] i:nth-child(2) { left: 10px; bottom: 8px; width: 44px; height: 26px; border: 3px solid var(--st-blue); border-top: 0; border-radius: 0 0 4px 4px; }
.stg-scene[data-k='2'] i:nth-child(3) { display: none; }

/* 4: cure — steam over a finished brick */
.stg-scene[data-k='3']::after { left: 12px; bottom: 10px; width: 40px; height: 17px; border-radius: 3px; background: linear-gradient(180deg, #e2573f, #b3321f); box-shadow: inset 0 2px 0 rgb(255 255 255 / 30%); }
.stg-scene[data-k='3'] i { bottom: 30px; width: 3px; height: 14px; border-radius: 3px; background: rgb(0 58 143 / 45%); animation: stg-steam 1.8s ease-in infinite; }
.stg-scene[data-k='3'] i:nth-child(1) { left: 20px; }
.stg-scene[data-k='3'] i:nth-child(2) { left: 31px; animation-delay: -.6s; }
.stg-scene[data-k='3'] i:nth-child(3) { left: 42px; animation-delay: -1.2s; }

/* ---------- keyframes ---------- */
@keyframes stg-float { to { transform: translate(40px, 30px) scale(1.12); } }
@keyframes stg-fade { to { opacity: 1; } }
@keyframes stg-fade-up { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
@keyframes stg-rise { to { transform: none; } }
@keyframes stg-draw { to { transform: scaleX(1); } }
@keyframes stg-ping { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(2.6); } }
@keyframes stg-fall { 0% { transform: translateY(0); opacity: 0; } 15% { opacity: 1; } 100% { transform: translateY(46px); opacity: 1; } }
@keyframes stg-spin { to { transform: rotate(360deg); } }
@keyframes stg-press { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(27px); } }
@keyframes stg-steam { 0% { transform: translateY(8px) scaleY(.6); opacity: 0; } 30% { opacity: 1; } 100% { transform: translateY(-22px) scaleY(1.2); opacity: 0; } }

/* ---------- responsive: track turns vertical ---------- */
@media (max-width: 900px) {
  .stg-stages { grid-template-columns: 1fr; gap: 22px; padding: 0 0 0 46px; margin-top: 32px; }
  .stg-track { left: var(--ax, 0px); top: var(--ay, 0px); width: 4px; height: var(--len, 0px); transform: translateX(-50%); background: repeating-linear-gradient(180deg, rgb(0 58 143 / 22%) 0 10px, transparent 10px 18px); }
  .stg-fill { background: linear-gradient(180deg, var(--st-blue), var(--st-gold)); transform-origin: top; transform: scaleY(var(--fp, 0)); }
  .stg-brick { left: 50%; top: calc(var(--fp, 0) * 100%); transform: translate(-50%, -50%) rotate(calc(var(--rot, 0deg) + 90deg)); }
  .stg-node { left: -46px; top: 28px; margin-left: 0; }
  .stg-step { min-height: 0; }
}

/* ---------- reduced motion: everything visible, nothing moves ---------- */
.stg.is-static .stg-eyebrow, .stg.is-static .stg-lead { opacity: 1; animation: none !important; }
.stg.is-static .stg-eyebrow::before, .stg.is-static .stg-eyebrow::after, .stg.is-static .stg-mark::after { transform: scaleX(1); animation: none !important; }
.stg.is-static .stg-w > i { transform: none; animation: none !important; }
.stg.is-static .stg-step { opacity: 1; translate: 0 0; transition: none; }
.stg.is-static .stg-line > * { transform: none; opacity: 1; transition: none; }
.stg.is-static .stg-num::after { clip-path: none; transition: none; }
.stg.is-static .stg-bar { transform: none; transition: none; }
.stg.is-static .stg-scene i { animation: none !important; }
.stg.is-static .stg-node { background: var(--st-blue); border-color: var(--st-gold); }
.stg.is-static .stg-node::after, .stg.is-static .stg-brick { display: none; }
.stg.is-static .stg-blob { animation: none; }
.stg.is-static .stg-fill { transform: none; }
`;

/* ------------------------------------------------------------------ */
/*  SECTION                                                            */
/* ------------------------------------------------------------------ */
export function Process() {
  const [titleRef, titleSeen] = useRevealOnce<HTMLDivElement>(0.3);
  const stagesRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const [reduced, setReduced] = useState(false);
  const [doneCount, setDoneCount] = useState(0); // how many stages the brick has reached
  const n = processSteps.length;

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  /* scroll-driven conveyor: the brick rides the track and switches each stage on */
  useEffect(() => {
    if (reduced) return;
    const grid = stagesRef.current;
    const track = railRef.current;
    if (!grid || !track) return;

    let raf = 0;
    let visible = true;
    let smooth = 0; // smoothed progress 0..1 along the track
    let lastCount = -1;

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { rootMargin: "200px" });
    io.observe(grid);

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;

      const nodes = dotRefs.current.filter(Boolean) as HTMLSpanElement[];
      if (nodes.length < 2) return;

      const g = grid.getBoundingClientRect();
      const vh = window.innerHeight;
      const vertical = window.matchMedia("(max-width: 900px)").matches;

      const pts = nodes.map((nd) => {
        const r = nd.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
      const first = pts[0];
      const last = pts[pts.length - 1];
      const len = Math.max(1, vertical ? last.y - first.y : last.x - first.x);

      grid.style.setProperty("--ax", `${first.x - g.left}px`);
      grid.style.setProperty("--ay", `${first.y - g.top}px`);
      grid.style.setProperty("--len", `${len}px`);

      /* target progress from scroll position */
      let target: number;
      let started: boolean;
      if (vertical) {
        const anchor = vh * 0.7;
        started = anchor > first.y;
        target = limit((anchor - first.y) / len);
      } else {
        const p = (vh * 0.85 - first.y) / (vh * 0.4);
        started = p > 0;
        target = limit(p);
      }

      const prev = smooth;
      smooth += ((started ? target : 0) - smooth) * 0.1; // ease toward the target
      const rot = limit((smooth - prev) * len * 0.9, -14, 14); // tilt with speed

      track.style.setProperty("--fp", smooth.toFixed(4));
      track.style.setProperty("--rot", `${rot.toFixed(2)}deg`);

      /* a stage switches on when the brick reaches its node */
      let count = 0;
      if (started) {
        const pos = smooth * len;
        pts.forEach((p, i) => {
          const off = vertical ? p.y - first.y : p.x - first.x;
          if (off <= pos + 2) count = i + 1;
        });
      }
      if (count !== lastCount) { lastCount = count; setDoneCount(count); }
    };
    raf = requestAnimationFrame(loop);

    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [reduced, n]);

  /* card tilt + spotlight that follows the cursor */
  const handleTilt = (e: PointerEvent<HTMLElement>) => {
    if (reduced || e.pointerType === "touch") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
    el.style.setProperty("--ry", `${((px - 0.5) * 8).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${((0.5 - py) * 6).toFixed(2)}deg`);
  };
  const handleTiltEnd = (e: PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <section className={`section section--paper stg${reduced ? " is-static" : ""}`} id="process">
      <style>{stagesCss}</style>

      <div className="stg-bg" aria-hidden="true">
        <span className="stg-grid-bg" />
        <span className="stg-blob stg-blob--b" />
        <span className="stg-blob stg-blob--g" />
      </div>

      <div className="container">
        <div className={`stg-head${titleSeen ? " is-in" : ""}`} ref={titleRef}>
          <span className="stg-eyebrow">How we work</span>
          <h2>
            <RiseWords text="From raw aggregate to" />
            <br />
            <span className="stg-mark">
              <RiseWords text="a wall you can trust." start={4} />
            </span>
          </h2>
          <p className="stg-lead">
            Four disciplined stages. Skip any one of them and a block can crack on site — so we skip none.
          </p>
        </div>

        <div className="stg-stages" ref={stagesRef} style={{ ["--n" as string]: n } as CSSProperties}>
          {/* conveyor track: fills with scroll, brick rides it */}
          <div className="stg-track" ref={railRef} aria-hidden="true">
            <span className="stg-fill" />
            <span className="stg-brick" />
          </div>

          {processSteps.map((step, i) => {
            const on = reduced || i < doneCount;
            return (
              <div className="stg-item" key={step.title} data-on={on}>
                <span className="stg-node" aria-hidden="true" ref={(el) => { dotRefs.current[i] = el; }} />
                <article className="stg-step" onPointerMove={handleTilt} onPointerLeave={handleTiltEnd}>
                  <div className="stg-scene" data-k={i % 4} aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </div>
                  <div className="stg-num" data-n={`0${i + 1}`} aria-hidden="true">0{i + 1}</div>
                  <span className="stg-kicker">Stage 0{i + 1}</span>
                  <div className="stg-line" style={{ ["--s" as string]: 1 } as CSSProperties}><h3>{step.title}</h3></div>
                  <div className="stg-line" style={{ ["--s" as string]: 2 } as CSSProperties}><p>{step.description}</p></div>
                  <span className="stg-bar" aria-hidden="true" />
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}























































// ↓ adjust to match your project (testimonials = [{ quote, name, role, initials }, ...])


type Review = (typeof testimonials)[number];

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

/* fires once when the element scrolls into view */
function useSeenOnce<T extends HTMLElement>(still: boolean, threshold = 0.25) {
  const holder = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (still || typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const el = holder.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [still, threshold]);
  return [holder, seen] as const;
}

/* running bond: rows alternate 3 bricks, then 2 bricks + a half brick at each end */
function layCourses(list: Review[]) {
  const courses: { stagger: boolean; bricks: { review: Review; idx: number }[] }[] = [];
  let at = 0;
  let c = 0;
  while (at < list.length) {
    const size = c % 2 === 0 ? 3 : 2;
    const bricks = list.slice(at, at + size).map((review, k) => ({ review, idx: at + k }));
    courses.push({ stagger: c % 2 === 1, bricks });
    at += size;
    c += 1;
  }
  return courses;
}

/* ------------------------------------------------------------------ */
/*  PARTS                                                              */
/* ------------------------------------------------------------------ */
function ReviewBrick({ review, idx, lag, still }: { review: Review; idx: number; lag: number; still: boolean }) {
  const [holder, seen] = useSeenOnce<HTMLDivElement>(still);
  return (
    <div
      ref={holder}
      className="wom-brick"
      data-on={seen}
      data-hero={idx === 0}
      data-side={idx % 2 === 0 ? "l" : "r"}
      style={{ ["--lag" as string]: `${lag}ms` } as CSSProperties}
    >
      <article className="wom-card">
        <Quote className="wom-quote" size={44} fill="currentColor" strokeWidth={1} aria-hidden="true" />
        <div className="wom-stars" role="img" aria-label="5 out of 5 stars">
          {Array.from({ length: 5 }, (_, k) => (
            <Star key={k} size={16} fill="currentColor" strokeWidth={0} style={{ ["--k" as string]: k } as CSSProperties} />
          ))}
        </div>
        <blockquote>“{review.quote}”</blockquote>
        <div className="wom-who">
          <span className="wom-initials">{review.initials}</span>
          <span className="wom-name">
            <strong>{review.name}</strong>
            <small>{review.role}</small>
          </span>
          <span className="wom-verified" title="Verified customer">
            <Check size={13} strokeWidth={3.2} aria-label="Verified customer" />
          </span>
        </div>
      </article>
    </div>
  );
}

function HalfBrick({ lag, still }: { lag: number; still: boolean }) {
  const [holder, seen] = useSeenOnce<HTMLSpanElement>(still);
  return (
    <span
      ref={holder}
      className="wom-half"
      data-on={seen}
      aria-hidden="true"
      style={{ ["--lag" as string]: `${lag}ms` } as CSSProperties}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  STYLES (embedded so this stays a single file)                      */
/* ------------------------------------------------------------------ */
const wallCss = `
.wom {
  --wm-blue: var(--brand-blue, #003a8f);
  --wm-gold: var(--brand-gold, #ffc400);
  --wm-red: var(--brand-red, #e11d2a);
  --wm-ink: var(--heading-ink, #08152f);
  --wm-text: var(--body-ink, #47536a);
  --wm-font: var(--font-heading, inherit);
  --wm-mortar: #d9dee8;
  position: relative;
  overflow: clip;
  background: linear-gradient(180deg, #f6f8fb, #eef1f6);
}
.wom .container { position: relative; z-index: 1; }

/* ---------- heading: a gold trowel sweeps across each line ---------- */
.wom-head { display: grid; grid-template-columns: 1.15fr .85fr; gap: clamp(24px, 5vw, 72px); align-items: end; }
.wom-eyebrow { display: inline-flex; align-items: center; gap: 10px; color: var(--wm-blue); font-size: 14px; font-weight: 800; opacity: 0; }
.wom-eyebrow::before { content: ""; width: 22px; height: 12px; border-radius: 2px; background: linear-gradient(180deg, #e2573f, #b3321f); box-shadow: inset 0 2px 0 rgb(255 255 255 / 30%); transform: translateX(-14px) rotate(-12deg); opacity: 0; }
.wom-head h2 { margin: 14px 0 0; font: 800 clamp(2.1rem, 4vw, 3.4rem) / 1.12 var(--wm-font); letter-spacing: -.05em; }
.wom-ln { position: relative; display: block; width: fit-content; overflow: hidden; padding-bottom: .12em; }
.wom-ln b { display: block; font-weight: inherit; color: var(--wm-ink); opacity: 0; }
.wom-ln--b b { color: var(--wm-blue); }
.wom-ln::after { content: ""; position: absolute; inset: 0 0 .12em; background: var(--wm-gold); transform: translateX(-101%); }
.wom-ln--b::after { background: var(--wm-red); }
.wom-sub { max-width: 440px; margin: 0; color: var(--wm-text); font-size: 16px; line-height: 1.8; opacity: 0; }

.wom-head.is-in .wom-eyebrow { animation: wom-fade .6s ease .05s forwards; }
.wom-head.is-in .wom-eyebrow::before { animation: wom-drop-in .7s cubic-bezier(.3, 1.5, .5, 1) .25s forwards; }
.wom-head.is-in .wom-ln::after { animation: wom-sweep .95s cubic-bezier(.7, 0, .2, 1) calc(.2s + var(--ln) * .35s) forwards; }
.wom-head.is-in .wom-ln b { animation: wom-fade 0s linear calc(.2s + var(--ln) * .35s + .46s) forwards; }
.wom-head.is-in .wom-sub { animation: wom-fade-up .8s ease 1s forwards; }

/* ---------- the wall ---------- */
.wom-wall {
  position: relative; display: grid; gap: 10px; margin-top: 44px; padding: 10px; border-radius: 16px;
  background: radial-gradient(rgb(8 21 47 / 9%) 1px, transparent 1.6px) 0 0 / 7px 7px, var(--wm-mortar);
  box-shadow: inset 0 2px 10px rgb(8 21 47 / 14%);
}
.wom-course { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 10px; }

/* a brick is laid: drops in, thuds, settles, kicks up dust */
.wom-brick { position: relative; grid-column: span 2; opacity: 0; }
.wom-brick::before, .wom-brick::after {
  content: ""; position: absolute; z-index: 0; bottom: -5px; width: 30px; height: 14px; border-radius: 50%;
  background: rgb(8 21 47 / 22%); filter: blur(3px); opacity: 0; pointer-events: none;
}
.wom-brick::before { left: 12%; }
.wom-brick::after { right: 12%; }
.wom-brick[data-on='true'] { animation: wom-lay 1.05s cubic-bezier(.3, .7, .3, 1) var(--lag) both; }
.wom-brick[data-on='true']::before { animation: wom-dust .8s ease-out calc(var(--lag) + .58s) forwards; }
.wom-brick[data-on='true']::after { animation: wom-dust .8s ease-out calc(var(--lag) + .62s) forwards; }

.wom-card {
  position: relative; z-index: 1; display: flex; flex-direction: column; height: 100%; min-height: 270px; padding: 26px 24px 22px;
  overflow: hidden; border-radius: 8px; background: #fff; border: 1px solid rgb(8 21 47 / 6%);
  box-shadow: 0 2px 0 rgb(255 255 255 / 80%) inset, 0 10px 18px -12px rgb(8 21 47 / 35%);
  transition: transform .45s cubic-bezier(.2, .9, .2, 1), box-shadow .45s, opacity .35s, filter .35s;
}
.wom-wall:has(.wom-brick:hover) .wom-brick:not(:hover) .wom-card { opacity: .55; filter: saturate(.6); }
.wom-brick:hover { z-index: 3; }
.wom-brick:hover .wom-card { transform: translateY(-8px) scale(1.028) rotate(-.5deg); box-shadow: 0 30px 44px -20px rgb(8 21 47 / 50%); }
.wom-brick:hover .wom-quote { transform: rotate(-8deg) scale(1.1); }

.wom-quote { position: absolute; top: 14px; right: 16px; color: rgb(0 58 143 / 9%); transition: transform .5s cubic-bezier(.3, 1.6, .5, 1); }

/* stars light up one after another once the brick has landed */
.wom-stars { display: flex; gap: 3px; }
.wom-stars svg { color: rgb(0 58 143 / 16%); transform: scale(.7); }
.wom-brick[data-on='true'] .wom-stars svg { animation: wom-star .55s cubic-bezier(.3, 1.8, .5, 1) calc(var(--lag) + .8s + var(--k) * .09s) forwards; }

.wom-card blockquote { margin: 16px 0 22px; color: var(--wm-ink); font-size: 16px; line-height: 1.75; font-weight: 500; }
.wom-brick:not([data-on='true']) .wom-card blockquote { opacity: 0; }
.wom-brick[data-on='true'] .wom-card blockquote { animation: wom-focus .8s ease calc(var(--lag) + .6s) both; }

.wom-who { display: flex; align-items: center; gap: 12px; margin-top: auto; padding-top: 16px; border-top: 1px dashed rgb(8 21 47 / 16%); }
.wom-initials {
  display: grid; flex: none; width: 44px; height: 44px; place-items: center; border-radius: 50%;
  background: var(--wm-blue); color: #fff; font: 800 14px / 1 var(--wm-font); letter-spacing: .02em;
  box-shadow: inset -3px -3px 0 rgb(255 196 0 / 85%);
}
.wom-name { display: grid; min-width: 0; line-height: 1.3; }
.wom-name strong { color: var(--wm-ink); font-size: 15px; }
.wom-name small { color: var(--wm-text); font-size: 13px; }
.wom-verified { display: grid; flex: none; width: 24px; height: 24px; margin-left: auto; place-items: center; border-radius: 50%; background: #15a34a; color: #fff; transform: scale(0); }
.wom-brick[data-on='true'] .wom-verified { animation: wom-pop .5s cubic-bezier(.3, 1.8, .5, 1) calc(var(--lag) + 1.3s) forwards; }

/* the first brick is the clay one */
.wom-brick[data-hero='true'] .wom-card { background: linear-gradient(165deg, #e2573f, #a92c1b); border-color: rgb(0 0 0 / 15%); box-shadow: inset 0 3px 0 rgb(255 255 255 / 25%), inset 0 -5px 0 rgb(0 0 0 / 18%), 0 14px 22px -14px rgb(120 30 15 / 70%); }
.wom-brick[data-hero='true'] .wom-card::before { content: ""; position: absolute; inset: 0; background: radial-gradient(rgb(0 0 0 / 14%) 1px, transparent 1.6px) 0 0 / 9px 9px; pointer-events: none; }
.wom-brick[data-hero='true'] .wom-quote { color: rgb(255 255 255 / 16%); }
.wom-brick[data-hero='true'] blockquote, .wom-brick[data-hero='true'] .wom-name strong { color: #fff; }
.wom-brick[data-hero='true'] .wom-name small { color: rgb(255 255 255 / 78%); }
.wom-brick[data-hero='true'] .wom-stars svg { color: rgb(255 255 255 / 25%); }
.wom-brick[data-hero='true'] .wom-who { border-top-color: rgb(255 255 255 / 30%); }
.wom-brick[data-hero='true'] .wom-initials { background: var(--wm-gold); color: var(--wm-ink); box-shadow: inset -3px -3px 0 rgb(0 0 0 / 15%); }

/* half bricks that close the staggered courses */
.wom-half { grid-column: span 1; border-radius: 8px; opacity: 0; background: repeating-linear-gradient(135deg, rgb(8 21 47 / 5%) 0 6px, transparent 6px 12px), #e6e9f0; box-shadow: inset 0 2px 5px rgb(8 21 47 / 12%); }
.wom-half[data-on='true'] { animation: wom-lay 1.05s cubic-bezier(.3, .7, .3, 1) var(--lag) both; }

/* ---------- link ---------- */
.wom-more {
  position: relative; display: inline-flex; align-items: center; gap: 12px; margin-top: 34px; padding: 8px 8px 8px 22px; overflow: hidden;
  border: 2px solid var(--wm-ink); border-radius: 999px; color: var(--wm-ink); font-weight: 800; text-decoration: none; isolation: isolate;
}
.wom-more::before { content: ""; position: absolute; inset: 0; z-index: -1; background: var(--wm-gold); transform: translateX(-101%); transition: transform .5s cubic-bezier(.7, 0, .2, 1); }
.wom-more:hover::before, .wom-more:focus-visible::before { transform: none; }
.wom-more i { display: grid; width: 34px; height: 34px; place-items: center; border-radius: 50%; background: var(--wm-ink); color: #fff; transition: transform .5s cubic-bezier(.3, 1.6, .5, 1); }
.wom-more:hover i { transform: rotate(45deg); }

/* ---------- keyframes ---------- */
@keyframes wom-fade { to { opacity: 1; } }
@keyframes wom-fade-up { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
@keyframes wom-drop-in { to { opacity: 1; transform: none; } }
@keyframes wom-sweep { 0% { transform: translateX(-101%); } 48% { transform: translateX(0); } 100% { transform: translateX(101%); } }
@keyframes wom-lay {
  0% { opacity: 0; transform: translateY(-90px) rotate(-3deg); }
  50% { opacity: 1; transform: translateY(0) rotate(.7deg); }
  68% { transform: translateY(5px) scaleY(.985); }
  84% { transform: translateY(-1px); }
  100% { opacity: 1; transform: none; }
}
@keyframes wom-dust { 0% { opacity: .75; transform: translateY(0) scale(.3); } 100% { opacity: 0; transform: translateY(8px) scale(1.9); } }
@keyframes wom-star { 0% { transform: scale(.7); } 60% { transform: scale(1.35) rotate(12deg); } 100% { color: var(--wm-gold); transform: scale(1); } }
@keyframes wom-pop { to { transform: scale(1); } }
@keyframes wom-focus { from { opacity: 0; filter: blur(6px); } to { opacity: 1; filter: blur(0); } }

/* ---------- responsive ---------- */
@media (max-width: 900px) {
  .wom-head { grid-template-columns: 1fr; align-items: start; }
}
@media (max-width: 760px) {
  .wom-course { grid-template-columns: 1fr; }
  .wom-half { display: none; }
  .wom-brick { grid-column: auto; width: 93%; }
  .wom-brick[data-side='r'] { justify-self: end; }
  .wom-card { min-height: 0; }
}

/* ---------- reduced motion: everything in place, nothing moves ---------- */
.wom.is-still .wom-eyebrow, .wom.is-still .wom-sub, .wom.is-still .wom-ln b, .wom.is-still .wom-brick, .wom.is-still .wom-half { opacity: 1; animation: none !important; }
.wom.is-still .wom-eyebrow::before { opacity: 1; transform: rotate(-12deg); animation: none !important; }
.wom.is-still .wom-ln::after, .wom.is-still .wom-brick::before, .wom.is-still .wom-brick::after { display: none; }
.wom.is-still .wom-stars svg { color: var(--wm-gold); transform: none; animation: none !important; }
.wom.is-still .wom-brick[data-hero='true'] .wom-stars svg { color: var(--wm-gold); }
.wom.is-still .wom-verified { transform: none; animation: none !important; }
.wom.is-still .wom-card blockquote { opacity: 1; animation: none !important; }
.wom.is-still .wom-card, .wom.is-still .wom-more::before, .wom.is-still .wom-more i, .wom.is-still .wom-quote { transition: none; }
`;

/* ------------------------------------------------------------------ */
/*  SECTION                                                            */
/* ------------------------------------------------------------------ */
export function Testimonials() {
  const [still, setStill] = useState(false);
  useEffect(() => {
    setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const [titleRef, titleSeen] = useSeenOnce<HTMLDivElement>(still, 0.3);
  const courses = layCourses(testimonials);

  return (
    <section className={`section wom${still ? " is-still" : ""}`} id="testimonials">
      <style>{wallCss}</style>

      <div className="container">
        <div className={`wom-head${titleSeen ? " is-in" : ""}`} ref={titleRef}>
          <div>
            <span className="wom-eyebrow">Built on good word</span>
            <h2>
              <span className="wom-ln" style={{ ["--ln" as string]: 0 } as CSSProperties}>
                <b>Trusted on site,</b>
              </span>
              <span className="wom-ln wom-ln--b" style={{ ["--ln" as string]: 1 } as CSSProperties}>
                <b>order after order.</b>
              </span>
            </h2>
          </div>
          <p className="wom-sub">
            Good work travels by word of mouth. Here’s what local builders and customers have to say about working with JPS.
          </p>
        </div>

        <div className="wom-wall">
          {courses.map((course, r) => (
            <div className="wom-course" key={r}>
              {course.stagger && <HalfBrick lag={0} still={still} />}
              {course.bricks.map(({ review, idx }, k) => (
                <ReviewBrick key={review.name} review={review} idx={idx} lag={(k + (course.stagger ? 1 : 0)) * 140} still={still} />
              ))}
              {course.stagger && course.bricks.length === 2 && <HalfBrick lag={420} still={still} />}
            </div>
          ))}
        </div>

        <a className="wom-more" href="#contact">
          <span>Let’s build something together</span>
          <i>
            <ArrowUpRight size={18} />
          </i>
        </a>
      </div>
    </section>
  );
}



function WhatsAppMini() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M20.52 3.48A11.81 11.81 0 0 0 12.1 0C5.55 0 .22 5.33.22 11.88c0 2.1.55 4.16 1.6 5.97L.12 24l6.3-1.65a11.9 11.9 0 0 0 5.68 1.44h.01c6.55 0 11.88-5.33 11.88-11.88a11.8 11.8 0 0 0-3.47-8.43ZM12.1 21.77h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.74.98 1-3.65-.23-.37a9.87 9.87 0 0 1-1.52-5.26c0-5.46 4.45-9.91 9.91-9.91a9.85 9.85 0 0 1 7.01 2.9 9.85 9.85 0 0 1 2.9 7.01c0 5.46-4.45 9.9-9.92 9.9Zm5.44-7.42c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.8-1.49-1.78-1.67-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.08-.8.38-.28.3-1.05 1.02-1.05 2.49s1.08 2.89 1.23 3.09c.15.2 2.12 3.24 5.14 4.55.72.31 1.28.5 1.72.64.73.23 1.39.2 1.91.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" /></svg>
}