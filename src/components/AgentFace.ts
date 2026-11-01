/**
 * @file AgentFace.ts
 * @description Hệ thống tạo diện mạo khuôn mặt người thật tinh tế và chuyên nghiệp (Realistic Executive Face)
 * cho từng AI Agent theo phong cách tham chiếu lãnh đạo & chuyên gia công nghệ:
 * - Đôi mắt hạnh nhân tự nhiên có chiều sâu, tròng mắt màu (Iris), con ngươi đen và ánh sáng phản quang giác mạc.
 * - Lông mày tạo dáng sắc nét theo cấu trúc giải phẫu.
 * - Mũi 3D có sống mũi và đầu mũi rõ nét.
 * - Đôi môi tạo hình tự nhiên với sắc thái ấm áp.
 * - Kiểu tóc doanh nhân/chuyên gia công nghệ hiện đại.
 * - Mắt kính gọng kim loại thanh lịch cho các chuyên gia phân tích và kiểm toán.
 */

import * as THREE from 'three';

export interface AgentFaceConfig {
  codename: string;
  color: string;
  accentColor: string;
}

/**
 * Xây dựng nhóm hình học 3D biểu cảm khuôn mặt chân thực để gắn trực tiếp vào xương 'head' của nhân vật
 */
export function createAgentFace({ codename }: AgentFaceConfig): THREE.Group {
  const faceGroup = new THREE.Group();
  faceGroup.name = 'agent-face-group';

  // 1. Phối màu mắt, tóc và sắc thái nhân vật theo phong cách công sở chuyên nghiệp
  let eyeColor = 0x0284c7; // Nova: Xanh lam Sapphire thông tuệ
  let hairColor = 0x1e1b4b; // Nova: Đen ánh xanh huyền bí
  let eyebrowColor = 0x0f172a;
  let lipColor = 0xc2410c; // Màu môi tự nhiên
  let hasGlasses = false;

  if (codename === 'Nova') {
    eyeColor = 0x0284c7;
    hairColor = 0x1e293b;
    eyebrowColor = 0x0f172a;
    lipColor = 0xbe123c;
    hasGlasses = true; // Kính gọng titan trí tuệ
  } else if (codename === 'Axel') {
    eyeColor = 0x78350f; // Nâu hổ phách quyết đoán
    hairColor = 0x1c1917; // Tóc đen tự nhiên
    eyebrowColor = 0x0c0a09;
    lipColor = 0x9a3412;
    hasGlasses = false;
  } else if (codename === 'Vesper') {
    eyeColor = 0x4c1d95; // Tím thạch anh sắc sảo
    hairColor = 0x451a03; // Nâu hạt dẻ ấm áp
    eyebrowColor = 0x271202;
    lipColor = 0x9f1239;
    hasGlasses = true; // Kính gọng mắt mèo thanh lịch
  } else if (codename === 'Kip') {
    eyeColor = 0x047857; // Xanh lục bảo điềm tĩnh
    hairColor = 0x292524; // Nâu đen than chì
    eyebrowColor = 0x1c1917;
    lipColor = 0xa16207;
    hasGlasses = false;
  }

  // Material dùng chung chuẩn PBR chân thực
  const scleraMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
  const irisMat = new THREE.MeshStandardMaterial({ color: eyeColor, roughness: 0.1 });
  const pupilMat = new THREE.MeshBasicMaterial({ color: 0x050505 });
  const sparkleMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const eyelidMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.6 });
  const eyebrowMat = new THREE.MeshStandardMaterial({ color: eyebrowColor, roughness: 0.8 });
  const noseMat = new THREE.MeshStandardMaterial({ color: 0xfb923c, roughness: 0.6 });
  const lipMat = new THREE.MeshStandardMaterial({ color: lipColor, roughness: 0.4 });
  const hairMat = new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.4, metalness: 0.05 });

  // 2. 👁️ ĐÔI MẮT HẠNH NHÂN TỰ NHIÊN CHÂN THỰC (Refined Human Eyes)
  [-0.058, 0.058].forEach((eyeX, idx) => {
    const isLeft = idx === 0;

    // Lòng trắng mắt (Sclera) hình elip tinh tế
    const sclera = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.024, 0.008), scleraMat);
    sclera.position.set(eyeX, 0.182, 0.172);
    faceGroup.add(sclera);

    // Tròng mắt tròn có màu (Iris)
    const iris = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.009, 16), irisMat);
    iris.rotation.x = Math.PI / 2;
    iris.position.set(eyeX, 0.182, 0.174);
    faceGroup.add(iris);

    // Con ngươi trung tâm (Pupil)
    const pupil = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.01, 12), pupilMat);
    pupil.rotation.x = Math.PI / 2;
    pupil.position.set(eyeX, 0.182, 0.175);
    faceGroup.add(pupil);

    // Điểm sáng phản quang giác mạc (Corneal Specular Glint)
    const glint = new THREE.Mesh(new THREE.SphereGeometry(0.0035, 6, 6), sparkleMat);
    glint.position.set(eyeX + (isLeft ? -0.004 : -0.003), 0.187, 0.177);
    faceGroup.add(glint);

    // Đường viền mi mắt trên (Upper Eyelid Crease)
    const eyelid = new THREE.Mesh(new THREE.BoxGeometry(0.042, 0.004, 0.009), eyelidMat);
    eyelid.position.set(eyeX, 0.196, 0.174);
    eyelid.rotation.z = isLeft ? 0.05 : -0.05;
    faceGroup.add(eyelid);
  });

  // 3. LÔNG MÀY ĐỊNH HÌNH TỰ NHIÊN (Defined Eyebrows)
  [-0.058, 0.058].forEach((browX, idx) => {
    const isLeft = idx === 0;
    const brow = new THREE.Mesh(new THREE.BoxGeometry(0.046, 0.006, 0.008), eyebrowMat);
    brow.position.set(browX, 0.218, 0.174);
    brow.rotation.z = isLeft ? 0.08 : -0.08;
    faceGroup.add(brow);
  });

  // 4. 👃 SỐNG MŨI VÀ ĐẦU MŨI 3D (Sculpted 3D Nose)
  // Sống mũi dọc
  const noseBridge = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.045, 0.012), noseMat);
  noseBridge.position.set(0, 0.165, 0.175);
  faceGroup.add(noseBridge);

  // Đầu mũi tròn nhẹ
  const noseTip = new THREE.Mesh(new THREE.SphereGeometry(0.012, 10, 10), noseMat);
  noseTip.position.set(0, 0.14, 0.18);
  faceGroup.add(noseTip);

  // 5. 👄 ĐÔI MÔI TỰ NHIÊN (Sculpted Human Lips)
  // Môi trên
  const upperLip = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.007, 0.008), lipMat);
  upperLip.position.set(0, 0.104, 0.174);
  faceGroup.add(upperLip);

  // Môi dưới đầy đặn nhẹ
  const lowerLip = new THREE.Mesh(new THREE.BoxGeometry(0.034, 0.008, 0.008), lipMat);
  lowerLip.position.set(0, 0.094, 0.173);
  faceGroup.add(lowerLip);

  // 6. 👓 MẮT KÍNH DOANH NHÂN / CHUYÊN GIA (Executive Wireframe Glasses)
  if (hasGlasses) {
    const glassesGroup = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.9,
      roughness: 0.2
    });
    const glassLensMat = new THREE.MeshPhysicalMaterial({
      color: 0xe2e8f0,
      transmission: 0.9,
      opacity: 0.4,
      transparent: true,
      roughness: 0.1
    });

    [-0.058, 0.058].forEach((gx) => {
      // Gọng kính mạ kim loại titan
      const frame = new THREE.Mesh(new THREE.TorusGeometry(0.024, 0.003, 8, 20), frameMat);
      frame.position.set(gx, 0.182, 0.182);
      glassesGroup.add(frame);

      // Tròng kính trong suốt
      const lens = new THREE.Mesh(new THREE.CircleGeometry(0.022, 16), glassLensMat);
      lens.position.set(gx, 0.182, 0.183);
      glassesGroup.add(lens);
    });

    // Cầu nối kính giữa 2 mắt
    const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.003, 0.003), frameMat);
    bridge.position.set(0, 0.184, 0.183);
    glassesGroup.add(bridge);

    faceGroup.add(glassesGroup);
  }

  // 7. 💇 MÁI TÓC 3D CỦA CHUYÊN GIA / DOANH NHÂN (Executive Hairstyle)
  if (codename === 'Nova') {
    // Nova: Tóc ngắn cá tính chải ngôi lệch sang trọng
    const hairTop = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.12, 0.32), hairMat);
    hairTop.position.set(0, 0.32, 0.02);
    faceGroup.add(hairTop);

    // Mái tóc vuốt nhẹ sang bên trái
    const sideSwoop = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.08, 0.14), hairMat);
    sideSwoop.position.set(-0.06, 0.26, 0.165);
    sideSwoop.rotation.set(0.1, 0, -0.2);
    faceGroup.add(sideSwoop);

    // 2 Bên mai tóc ôm gọn gàng
    [-0.17, 0.17].forEach((x) => {
      const side = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.16, 0.18), hairMat);
      side.position.set(x, 0.22, 0.04);
      faceGroup.add(side);
    });
  } else if (codename === 'Axel') {
    // Axel: Tóc nam công sở hiện đại vuốt pomade gọn gàng
    const topHair = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.14, 0.3), hairMat);
    topHair.position.set(0, 0.33, 0.02);
    faceGroup.add(topHair);

    // Mái tóc chải bồng nhẹ phía trước
    const frontHair = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.06, 0.1), hairMat);
    frontHair.position.set(0, 0.28, 0.16);
    frontHair.rotation.x = 0.2;
    faceGroup.add(frontHair);

    // Râu quai nón tỉa gọn gàng tăng vẻ nam tính chững chạc
    const beard = new THREE.Mesh(
      new THREE.TorusGeometry(0.14, 0.016, 6, 16, Math.PI),
      hairMat
    );
    beard.rotation.z = Math.PI;
    beard.position.set(0, 0.07, 0.155);
    faceGroup.add(beard);
  } else if (codename === 'Vesper') {
    // Vesper: Búi tóc doanh nhân nữ sang trọng (Chic Executive French Bun)
    const topHair = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.14, 0.3), hairMat);
    topHair.position.set(0, 0.32, 0.02);
    faceGroup.add(topHair);

    // Búi tóc cao phía sau đầu
    const bun = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), hairMat);
    bun.position.set(0, 0.26, -0.16);
    faceGroup.add(bun);

    // Đôi hoa tai ngọc trai thanh lịch (Pearl Stud Earrings)
    [-0.18, 0.18].forEach((x) => {
      const pearl = new THREE.Mesh(
        new THREE.SphereGeometry(0.014, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, metalness: 0.3 })
      );
      pearl.position.set(x, 0.14, 0.04);
      faceGroup.add(pearl);
    });
  } else if (codename === 'Kip') {
    // Kip: Tóc nam Undercut ngắn năng động hiện đại
    const cropHair = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.11, 0.3), hairMat);
    cropHair.position.set(0, 0.31, 0.02);
    faceGroup.add(cropHair);

    // Tóc mái ngắn tỉa layer
    const bang = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.04, 0.06), hairMat);
    bang.position.set(0, 0.26, 0.165);
    faceGroup.add(bang);
  }

  return faceGroup;
}
