/**
 * @file AgentFace.ts
 * @description Hệ thống tạo gương mặt Chibi 3D sống động và đáng yêu cho từng AI Agent.
 * Bao gồm: Mắt to tròn long lanh phong cách Anime (có đồng tử & đốm sáng phản quang),
 * Lông mày biểu cảm, Mũi nhỏ xinh, Nụ cười rạng rỡ, Đôi má hồng ửng đào (Kawaii Blush)
 * và Mái tóc 3D đặc trưng theo cá tính từng nhân vật.
 */

import * as THREE from 'three';

export interface AgentFaceConfig {
  codename: string;
  color: string;
  accentColor: string;
}

/**
 * Xây dựng nhóm hình học 3D biểu cảm khuôn mặt để gắn trực tiếp vào xương 'head' của nhân vật
 */
export function createAgentFace({ codename }: AgentFaceConfig): THREE.Group {
  const faceGroup = new THREE.Group();
  faceGroup.name = 'agent-face-group';

  // 1. Tùy biến màu mắt và màu tóc theo nhân vật
  let eyeColor = 0x0284c7; // Nova: Xanh Cyan
  let hairColor = 0xa855f7; // Nova: Tím pastel
  let eyebrowColor = 0x1e293b;

  if (codename === 'Axel') {
    eyeColor = 0xea580c; // Axel: Hổ phách rực lửa
    hairColor = 0x451a03; // Nâu socola
    eyebrowColor = 0x271202;
  } else if (codename === 'Vesper') {
    eyeColor = 0x9333ea; // Vesper: Tím ruby quyến rũ
    hairColor = 0xec4899; // Hồng ngọt ngào
    eyebrowColor = 0x831843;
  } else if (codename === 'Kip') {
    eyeColor = 0x10b981; // Kip: Xanh ngọc lục bảo
    hairColor = 0x78350f; // Nâu hạt dẻ
    eyebrowColor = 0x451a03;
  }

  // Material dùng chung
  const scleraMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const irisMat = new THREE.MeshBasicMaterial({ color: eyeColor });
  const pupilMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
  const sparkleMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const eyebrowMat = new THREE.MeshBasicMaterial({ color: eyebrowColor });
  const blushMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e, transparent: true, opacity: 0.65 });
  const noseMat = new THREE.MeshStandardMaterial({ color: 0xfb923c, roughness: 0.5 });
  const mouthMat = new THREE.MeshBasicMaterial({ color: 0xbe123c });
  const hairMat = new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.5 });

  // 2. TẠO ĐÔI MẮT ANIME TO TRÒN LONG LANH (Left & Right Eyes)
  [-0.066, 0.066].forEach((eyeX, idx) => {
    const isLeft = idx === 0;

    // Lòng trắng mắt (Sclera)
    const sclera = new THREE.Mesh(new THREE.BoxGeometry(0.046, 0.056, 0.006), scleraMat);
    sclera.position.set(eyeX, 0.185, 0.171);
    faceGroup.add(sclera);

    // Tròng mắt có màu (Iris)
    const iris = new THREE.Mesh(new THREE.CylinderGeometry(0.017, 0.017, 0.008, 16), irisMat);
    iris.rotation.x = Math.PI / 2;
    iris.position.set(eyeX, 0.182, 0.174);
    faceGroup.add(iris);

    // Con ngươi đen (Pupil)
    const pupil = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.009, 12), pupilMat);
    pupil.rotation.x = Math.PI / 2;
    pupil.position.set(eyeX, 0.182, 0.175);
    faceGroup.add(pupil);

    // Đốm sáng phản quang lớn (Main Sparkle)
    const sparkleMain = new THREE.Mesh(new THREE.SphereGeometry(0.0065, 8, 8), sparkleMat);
    sparkleMain.position.set(eyeX + (isLeft ? -0.007 : -0.005), 0.195, 0.178);
    faceGroup.add(sparkleMain);

    // Đốm sáng phản quang nhỏ (Sub Sparkle)
    const sparkleSub = new THREE.Mesh(new THREE.SphereGeometry(0.0035, 6, 6), sparkleMat);
    sparkleSub.position.set(eyeX + (isLeft ? 0.006 : 0.008), 0.173, 0.178);
    faceGroup.add(sparkleSub);
  });

  // 3. LÔNG MÀY BIỂU CẢM (Eyebrows)
  const leftBrow = new THREE.Mesh(new THREE.BoxGeometry(0.044, 0.008, 0.006), eyebrowMat);
  leftBrow.position.set(-0.066, 0.226, 0.173);
  leftBrow.rotation.z = 0.08;
  faceGroup.add(leftBrow);

  const rightBrow = new THREE.Mesh(new THREE.BoxGeometry(0.044, 0.008, 0.006), eyebrowMat);
  rightBrow.position.set(0.066, 0.226, 0.173);
  rightBrow.rotation.z = -0.08;
  faceGroup.add(rightBrow);

  // 4. CHIẾC MŨI NHỎ XINH (Cute Button Nose)
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.011, 8, 8), noseMat);
  nose.position.set(0, 0.142, 0.176);
  faceGroup.add(nose);

  // 5. ĐÔI MÁ HỒNG ĐÀO ĐÁNG YÊU (Kawaii Blush)
  [-0.108, 0.108].forEach((cheekX) => {
    const cheek = new THREE.Mesh(new THREE.CircleGeometry(0.024, 16), blushMat);
    cheek.position.set(cheekX, 0.134, 0.172);
    faceGroup.add(cheek);
  });

  // 6. NỤ CƯỜI RẠNG RỠ (Happy Smile)
  const smile = new THREE.Mesh(
    new THREE.TorusGeometry(0.026, 0.0055, 6, 16, Math.PI),
    mouthMat
  );
  smile.rotation.z = Math.PI; // Lật ngược để tạo đường cong mỉm cười
  smile.position.set(0, 0.092, 0.174);
  faceGroup.add(smile);

  // 7. MÁI TÓC 3D CÁ TÍNH CHO TỪNG AGENT (Character 3D Hairstyle)
  if (codename === 'Nova') {
    // Nova: Tóc mái uốn lượn tím pastel và lọn tóc 2 bên
    const bangMid = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.09, 4), hairMat);
    bangMid.position.set(-0.02, 0.27, 0.173);
    bangMid.rotation.set(0.1, 0, -0.2);
    faceGroup.add(bangMid);

    const bangRight = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.08, 4), hairMat);
    bangRight.position.set(0.04, 0.275, 0.173);
    bangRight.rotation.set(0.1, 0, 0.25);
    faceGroup.add(bangRight);

    // Tóc 2 bên thái dương
    [-0.18, 0.18].forEach((x, i) => {
      const sideHair = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.14, 0.14), hairMat);
      sideHair.position.set(x, 0.23, 0.04);
      sideHair.rotation.z = i === 0 ? 0.1 : -0.1;
      faceGroup.add(sideHair);
    });
  } else if (codename === 'Axel') {
    // Axel: Mái tóc vuốt dựng spiky mạnh mẽ
    [-0.08, 0, 0.08].forEach((x, i) => {
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.12, 4), hairMat);
      spike.position.set(x, 0.35, 0.05);
      spike.rotation.set(-0.15, 0, (i - 1) * 0.25);
      faceGroup.add(spike);
    });

    // Mái tóc rủ nhẹ trước trán
    const frontSpike = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.08, 4), hairMat);
    frontSpike.position.set(-0.03, 0.28, 0.174);
    frontSpike.rotation.set(0.1, 0, -0.3);
    faceGroup.add(frontSpike);
  } else if (codename === 'Vesper') {
    // Vesper: Mái tóc hồng dịu dàng với lọn tóc 2 bên
    const bangCenter = new THREE.Mesh(new THREE.ConeGeometry(0.038, 0.08, 4), hairMat);
    bangCenter.position.set(0, 0.27, 0.174);
    bangCenter.rotation.set(0.1, 0, 0.1);
    faceGroup.add(bangCenter);

    // 2 Bím tóc phồng nữ tính ôm 2 bên tai
    [-0.19, 0.19].forEach((x) => {
      const bun = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 10), hairMat);
      bun.position.set(x, 0.22, 0.02);
      faceGroup.add(bun);
    });
  } else if (codename === 'Kip') {
    // Kip: Lọn tóc nâu hạt dẻ lấp ló dưới nón lưỡi trai
    const tuft1 = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.065, 4), hairMat);
    tuft1.position.set(-0.04, 0.26, 0.174);
    tuft1.rotation.set(0.1, 0, -0.2);
    faceGroup.add(tuft1);

    const tuft2 = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.065, 4), hairMat);
    tuft2.position.set(0.04, 0.26, 0.174);
    tuft2.rotation.set(0.1, 0, 0.2);
    faceGroup.add(tuft2);
  }

  return faceGroup;
}

