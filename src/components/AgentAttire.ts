/**
 * @file AgentAttire.ts
 * @description Hệ thống tạo trang phục công sở hiện đại và phụ kiện doanh nghiệp 3D
 * (Realistic Corporate & Tech Attire) cho từng AI Agent theo phong cách tham chiếu NOVUS AI:
 * - Cổ áo sơ mi trắng/xanh nhạt bẻ góc sắc nét.
 * - Ve áo vest / Blazer doanh nhân (Lapels) ôm theo thân hình.
 * - Cà vạt lụa cao cấp hoặc dây thẻ nhân viên công nghệ (Corporate Security Lanyard Badge).
 * - Thắt lưng da với khóa kim loại bạc xước.
 * - Đồng hồ thông minh Smartwatch trên cổ tay.
 */

import * as THREE from 'three';

export interface AttireConfig {
  codename: string;
  suitColor: string;
}

/**
 * Tạo nhóm hình học 3D trang phục công sở gắn vào xương 'torso'
 */
export function createTorsoAttire({ codename, suitColor }: AttireConfig): THREE.Group {
  const group = new THREE.Group();
  group.name = 'agent-torso-attire';

  const shirtMat = new THREE.MeshStandardMaterial({
    color: codename === 'Pé Ken' ? 0xe0f2fe : 0xffffff,
    roughness: 0.35
  });

  const suitMat = new THREE.MeshStandardMaterial({
    color: suitColor,
    roughness: 0.45,
    metalness: 0.05
  });

  const tieColor =
    codename === 'Pé Ken'
      ? 0x0284c7 // Cà vạt xanh coban sang trọng
      : codename === 'Pé Na'
      ? 0x4f46e5 // Xanh indigo trí tuệ
      : codename === 'Lão Lục'
      ? 0x9f1239 // Đỏ mận quý phái
      : 0x0f766e; // Xanh ngọc lục bảo (Lão Cửu)

  const tieMat = new THREE.MeshStandardMaterial({
    color: tieColor,
    roughness: 0.3,
    metalness: 0.1
  });

  const beltMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.4 });
  const buckleMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.1 });
  const lanyardMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
  const badgeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });

  // 1. Cổ áo sơ mi trắng bẻ góc sắc nét (Shirt Collar)
  const collarLeft = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.04, 0.02), shirtMat);
  collarLeft.position.set(-0.06, 0.22, 0.145);
  collarLeft.rotation.set(-0.25, 0.15, -0.45);
  group.add(collarLeft);

  const collarRight = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.04, 0.02), shirtMat);
  collarRight.position.set(0.06, 0.22, 0.145);
  collarRight.rotation.set(-0.25, -0.15, 0.45);
  group.add(collarRight);

  // V-Neck áo sơ mi trắng bên trong
  const vGeom = new THREE.BufferGeometry();
  const vVertices = new Float32Array([
    -0.065, 0.24, 0.142,
    0.065, 0.24, 0.142,
    0, 0.08, 0.146
  ]);
  vGeom.setAttribute('position', new THREE.BufferAttribute(vVertices, 3));
  vGeom.computeVertexNormals();
  const shirtV = new THREE.Mesh(vGeom, shirtMat);
  group.add(shirtV);

  // 2. Ve áo Vest / Blazer doanh nhân (Lapels)
  const lapelLeft = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.22, 0.02), suitMat);
  lapelLeft.position.set(-0.09, 0.12, 0.148);
  lapelLeft.rotation.set(-0.1, 0.1, -0.22);
  group.add(lapelLeft);

  const lapelRight = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.22, 0.02), suitMat);
  lapelRight.position.set(0.09, 0.12, 0.148);
  lapelRight.rotation.set(-0.1, -0.1, 0.22);
  group.add(lapelRight);

  // 3. Cà vạt lụa (cho Pé Ken, Lão Lục và Lão Cửu) hoặc Thẻ nhân viên an ninh (cho Pé Na)
  if (codename === 'Pé Ken' || codename === 'Lão Lục' || codename === 'Lão Cửu') {
    // Nút thắt cà vạt (Tie Knot)
    const knot = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.035, 0.02), tieMat);
    knot.position.set(0, 0.21, 0.152);
    group.add(knot);

    // Thân cà vạt lụa rủ thẳng xuống thắt lưng
    const tieBody = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.18, 0.015), tieMat);
    tieBody.position.set(0, 0.11, 0.15);
    group.add(tieBody);
  } else {
    // Dây đeo thẻ an ninh công nghệ (Tech Lanyard)
    const lanyard = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.005, 6, 20, Math.PI), lanyardMat);
    lanyard.position.set(0, 0.14, 0.148);
    lanyard.rotation.z = Math.PI;
    group.add(lanyard);

    // Thẻ ID nhân viên có ảnh
    const badge = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.065, 0.008), badgeMat);
    badge.position.set(0, 0.03, 0.155);
    group.add(badge);

    // Vạch chip màu xanh trên thẻ
    const chip = new THREE.Mesh(
      new THREE.PlaneGeometry(0.035, 0.015),
      new THREE.MeshBasicMaterial({ color: 0x0284c7 })
    );
    chip.position.set(0, 0.045, 0.16);
    group.add(chip);
  }

  // 4. Thắt lưng da cao cấp với khóa kim loại bạc xước
  const belt = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.032, 0.19), beltMat);
  belt.position.set(0, -0.12, 0);
  group.add(belt);

  const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.04, 0.015), buckleMat);
  buckle.position.set(0, -0.12, 0.1);
  group.add(buckle);

  return group;
}

/**
 * Tạo đồng hồ thông minh (Smartwatch) gắn vào xương cổ tay trái 'arm-left'
 */
export function createWristWatch(): THREE.Group {
  const watchGroup = new THREE.Group();
  watchGroup.name = 'agent-wrist-watch';

  // Dây đeo đồng hồ cao su đen
  const strap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.075, 0.075, 0.035, 16),
    new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 })
  );
  strap.rotation.z = Math.PI / 2;
  watchGroup.add(strap);

  // Mặt đồng hồ thông minh với viền nhôm xước
  const caseMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 0.045, 0.015),
    new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.2 })
  );
  caseMesh.position.set(0, 0, 0.075);
  watchGroup.add(caseMesh);

  // Màn hình OLED phát sáng xanh Cyan
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.032, 0.038),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
  );
  screen.position.set(0, 0, 0.084);
  watchGroup.add(screen);

  return watchGroup;
}
