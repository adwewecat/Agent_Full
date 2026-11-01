/**
 * @file GitCat.tsx
 * @description Linh vật văn phòng GitCat 🐱 (lấy cảm hứng trực tiếp từ pet gitcat của pixel-agents).
 * Chú mèo cam 3D dễ thương tự do đi dạo, nằm sưởi nắng trên thảm, vẫy đuôi hoạt ảnh mượt mà,
 * và tương tác kêu "Meow~" khi người dùng nhấp chuột vào!
 */

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface GitCatProps {
  onPetCat?: () => void;
}

export function GitCat({ onPetCat }: GitCatProps) {
  const catGroup = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Group>(null);
  const [purring, setPurring] = useState(false);

  // Vị trí tuần tra tự nhiên của GitCat quanh phòng
  const patrolWaypoints = [
    new THREE.Vector3(0.5, 0, 1.8),
    new THREE.Vector3(-1.2, 0, 0.5),
    new THREE.Vector3(1.5, 0, -0.5),
    new THREE.Vector3(0, 0, 2.5)
  ];
  const currentWaypoint = useRef(0);
  const catPos = useRef(new THREE.Vector3(0.5, 0, 1.8));

  useFrame((state, delta) => {
    if (!catGroup.current || !tailRef.current) return;
    const t = state.clock.getElapsedTime();

    // 1. Hoạt ảnh vẫy đuôi nhẹ nhàng (Tail Wagging)
    tailRef.current.rotation.z = Math.sin(t * 3.5) * 0.35;
    tailRef.current.rotation.x = 0.5 + Math.cos(t * 2) * 0.1;

    // 2. Hoạt ảnh nhấp nhô đầu khi thở / ngắm nhìn
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 1.2) * 0.2;
    }

    // 3. Di chuyển tuần tra nhàn nhã trong văn phòng
    const target = patrolWaypoints[currentWaypoint.current];
    const dist = catPos.current.distanceTo(target);

    if (dist > 0.05) {
      // Hướng mặt về điểm đích
      const dx = target.x - catPos.current.x;
      const dz = target.z - catPos.current.z;
      const targetAngle = Math.atan2(dx, dz);
      catGroup.current.rotation.y = THREE.MathUtils.lerp(
        catGroup.current.rotation.y,
        targetAngle,
        delta * 4
      );

      // Đi bộ chậm rãi (Tốc độ mèo đi dạo ~0.6 m/s)
      catPos.current.lerp(target, (delta * 0.6) / dist);
      // Bước đi nhấp nhô chân
      catPos.current.y = Math.abs(Math.sin(t * 6)) * 0.03;
      catGroup.current.position.copy(catPos.current);
    } else {
      // Dừng lại nghỉ hoặc chuyển điểm tuần tra tiếp theo sau vài giây
      if (Math.sin(t * 0.5) > 0.98) {
        currentWaypoint.current = (currentWaypoint.current + 1) % patrolWaypoints.length;
      }
    }
  });

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setPurring(true);
    if (onPetCat) onPetCat();
    setTimeout(() => setPurring(false), 2500);
  };

  return (
    <group
      ref={catGroup}
      position={[0.5, 0, 1.8]}
      onClick={handleClick}
      scale={0.55}
    >
      {/* Thân mèo màu cam Tabby (Orange Tabby Body) */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.35, 0.25, 0.55]} />
        <meshStandardMaterial color="#ea580c" roughness={0.6} />
      </mesh>

      {/* Đốm vằn trên lưng */}
      <mesh position={[0, 0.38, 0]}>
        <boxGeometry args={[0.22, 0.01, 0.35]} />
        <meshStandardMaterial color="#9a3412" roughness={0.6} />
      </mesh>

      {/* Bụng mèo màu trắng sữa */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.3, 0.08, 0.45]} />
        <meshStandardMaterial color="#ffedd5" roughness={0.7} />
      </mesh>

      {/* Đầu mèo */}
      <group ref={headRef} position={[0, 0.4, 0.32]}>
        <mesh castShadow>
          <boxGeometry args={[0.32, 0.28, 0.28]} />
          <meshStandardMaterial color="#ea580c" roughness={0.6} />
        </mesh>

        {/* Mõm trắng */}
        <mesh position={[0, -0.06, 0.15]}>
          <boxGeometry args={[0.18, 0.1, 0.05]} />
          <meshStandardMaterial color="#ffedd5" />
        </mesh>
        {/* Mũi hồng */}
        <mesh position={[0, -0.02, 0.18]}>
          <boxGeometry args={[0.04, 0.03, 0.02]} />
          <meshBasicMaterial color="#f472b6" />
        </mesh>

        {/* Mắt to tròn long lanh */}
        <mesh position={[-0.09, 0.04, 0.15]}>
          <boxGeometry args={[0.06, 0.07, 0.02]} />
          <meshBasicMaterial color="#0284c7" />
        </mesh>
        <mesh position={[0.09, 0.04, 0.15]}>
          <boxGeometry args={[0.06, 0.07, 0.02]} />
          <meshBasicMaterial color="#0284c7" />
        </mesh>

        {/* Tai trái & Tai phải tam giác */}
        <mesh position={[-0.11, 0.2, 0]} rotation={[0, 0, 0.2]}>
          <coneGeometry args={[0.08, 0.14, 4]} />
          <meshStandardMaterial color="#ea580c" />
        </mesh>
        <mesh position={[0.11, 0.2, 0]} rotation={[0, 0, -0.2]}>
          <coneGeometry args={[0.08, 0.14, 4]} />
          <meshStandardMaterial color="#ea580c" />
        </mesh>
      </group>

      {/* 4 Chân mèo */}
      <mesh position={[-0.12, 0.08, 0.18]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.16, 8]} />
        <meshStandardMaterial color="#ffedd5" />
      </mesh>
      <mesh position={[0.12, 0.08, 0.18]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.16, 8]} />
        <meshStandardMaterial color="#ffedd5" />
      </mesh>
      <mesh position={[-0.12, 0.08, -0.18]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.16, 8]} />
        <meshStandardMaterial color="#ffedd5" />
      </mesh>
      <mesh position={[0.12, 0.08, -0.18]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.16, 8]} />
        <meshStandardMaterial color="#ffedd5" />
      </mesh>

      {/* Đuôi mèo cong vút */}
      <mesh ref={tailRef} position={[0, 0.32, -0.28]} castShadow>
        <cylinderGeometry args={[0.03, 0.04, 0.35, 8]} />
        <meshStandardMaterial color="#9a3412" />
      </mesh>

      {/* Bong bóng biểu cảm khi được vuốt ve hoặc đang đi dạo */}
      <Html position={[0, 0.9, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            border: '2px solid #ea580c',
            borderRadius: '16px',
            padding: '3px 8px',
            fontSize: '11px',
            fontWeight: 700,
            color: '#9a3412',
            boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            whiteSpace: 'nowrap',
            animation: 'catBounce 2s infinite ease-in-out'
          }}
        >
          <span>{purring ? '😻 *Purr purr~*' : '🐾 GitCat'}</span>
        </div>
      </Html>
    </group>
  );
}

