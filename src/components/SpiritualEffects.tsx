/**
 * @file SpiritualEffects.tsx
 * @description Hệ thống Hiệu ứng Tâm Linh Thần Kỳ:
 * 1. Đinh Thánh (Holy Nails) bắn ra từ Thánh Giá Chúa xoay tít xé gió trong không gian.
 * 2. Chuỗi Tràng Hạt Bồ Đề (Prayer Beads) phóng ra từ Đài Sen Phật xoay vòng lốc xoáy.
 * 3. Hiện thân Đức Phật (Buddha Apparition): Hào quang hoa sen rực sáng, hình bóng Phật Tổ hiện lên rồi vụt mất.
 * 4. Hiện thân Thánh Giá Chúa (Christian Apparition): Luồng sáng thiên đàng và đôi cánh thiên thần ánh sáng hiện lên rồi vụt mất.
 * 5. Cơ chế phát hiện va chạm & kích hoạt phản xạ né tránh (Dodge Reaction) cho các AI Agent.
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SpiritualProjectile, AgentData } from '../types/agent';

interface SpiritualEffectsProps {
  projectiles: SpiritualProjectile[];
  buddhaMiracleActive: boolean;
  christianMiracleActive: boolean;
  agents: AgentData[];
  onDodgeTrigger?: (agentId: string, threatType: 'nail' | 'bead') => void;
}

/**
 * Mô hình 3D chiếc Đinh Thánh (Holy Nail) đang bay xé gió
 */
function HolyNailModel({ position, progress }: { position: [number, number, number]; progress: number }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      // Xoay tít đinh sắt trong không trung
      meshRef.current.rotation.x += delta * 18;
      meshRef.current.rotation.z += delta * 12;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Thân đinh sắt dài mạ vàng phát quang */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.012, 0.38, 8]} />
        <meshStandardMaterial
          color="#f59e0b"
          metalness={0.9}
          roughness={0.2}
          emissive="#fbbf24"
          emissiveIntensity={0.8}
        />
      </mesh>
      {/* Đầu nhọn đinh */}
      <mesh position={[0, 0, 0.21]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.015, 0.08, 8]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#f59e0b"
          emissiveIntensity={1.2}
        />
      </mesh>
      {/* Mũ đinh vuông/dẹt phía sau */}
      <mesh position={[0, 0, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.02, 8]} />
        <meshStandardMaterial color="#d97706" metalness={0.9} />
      </mesh>

      {/* Tia sáng vàng bao bọc chiếc đinh */}
      <pointLight color="#fde047" intensity={2.2} distance={2.5} decay={2} />

      {/* Vệt đuôi hạt sáng nhỏ (Sparkle Tail) */}
      <mesh position={[0, 0, -0.28]}>
        <sphereGeometry args={[0.035 * (1 - progress * 0.3), 8, 8]} />
        <meshBasicMaterial color="#fef08a" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

/**
 * Mô hình 3D Chuỗi Tràng Hạt Bồ Đề (Flying Prayer Beads)
 */
function PrayerBeadsModel({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const elapsed = clock.getElapsedTime();
      groupRef.current.rotation.y = elapsed * 8;
      groupRef.current.rotation.x = Math.sin(elapsed * 4) * 0.4;
    }
  });

  // Tạo vòng 7 hạt bồ đề quay tròn quanh tâm
  const beadOffsets = useMemo(() => {
    const count = 7;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      return {
        x: Math.cos(angle) * 0.12,
        y: Math.sin(angle) * 0.12,
        z: Math.sin(angle * 2) * 0.03
      };
    });
  }, []);

  return (
    <group ref={groupRef} position={position}>
      {beadOffsets.map((b, i) => (
        <mesh key={i} position={[b.x, b.y, b.z]}>
          <sphereGeometry args={[0.032, 12, 12]} />
          <meshStandardMaterial
            color="#ea580c"
            roughness={0.3}
            emissive="#f97316"
            emissiveIntensity={0.9}
          />
        </mesh>
      ))}

      {/* Hạt chủ trung tâm (Guru Bead) phát sáng ngọc bích */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.042, 14, 14]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#34d399"
          emissiveIntensity={1.4}
        />
      </mesh>

      {/* Ánh sáng ấm áp từ chuỗi tràng hạt */}
      <pointLight color="#f97316" intensity={2.4} distance={2.8} decay={2} />
    </group>
  );
}

/**
 * Hiện thân Đức Phật (Buddha Apparition) hiện lên uy nghi rồi vụt mất
 */
function BuddhaApparition({ active }: { active: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const opacityRef = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (active) {
      // Hiện lên bừng sáng nhanh (fade in 0.4s)
      opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, 0.9, delta * 4);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 2.6, delta * 3);
      groupRef.current.rotation.y += delta * 0.4;
    } else {
      // Vụt tắt biến mất
      opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, 0, delta * 6);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 2.1, delta * 4);
    }

    groupRef.current.visible = opacityRef.current > 0.02;

    // Cập nhật opacity cho các material con
    groupRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mat = (child as THREE.Mesh).material as THREE.Material;
        if (mat) {
          mat.transparent = true;
          mat.opacity = opacityRef.current;
        }
      }
    });
  });

  return (
    <group ref={groupRef} position={[-2.4, 2.1, -4.8]} visible={false}>
      {/* Vòng hào quang đại quang minh Phật Tổ */}
      <mesh position={[0, 0.45, 0]}>
        <ringGeometry args={[0.45, 0.95, 32]} />
        <meshBasicMaterial color="#fef08a" side={THREE.DoubleSide} transparent />
      </mesh>
      <mesh position={[0, 0.45, -0.02]}>
        <circleGeometry args={[0.45, 32]} />
        <meshBasicMaterial color="#fbbf24" side={THREE.DoubleSide} transparent />
      </mesh>

      {/* Đài sen ánh sáng ngàn cánh đỡ Đức Phật */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.6, 0.3, 0.12, 16]} />
        <meshStandardMaterial color="#f472b6" emissive="#fb7185" emissiveIntensity={0.8} />
      </mesh>

      {/* Kim thân Đức Phật tỏa ánh vàng thanh tịnh */}
      {/* Thân tọa thiền */}
      <mesh position={[0, 0.12, 0]}>
        <coneGeometry args={[0.35, 0.5, 12]} />
        <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={1.1} />
      </mesh>
      {/* Đầu & Tóc búi Ushnisha */}
      <mesh position={[0, 0.48, 0]}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color="#fef08a" emissive="#fbbf24" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0, 0.65, 0]}>
        <coneGeometry args={[0.06, 0.14, 8]} />
        <meshStandardMaterial color="#fde047" emissive="#eab308" emissiveIntensity={1.2} />
      </mesh>

      {/* Luồng sáng thần thánh chiếu sáng rực rỡ */}
      <pointLight color="#fef08a" intensity={4.5} distance={7} decay={2} />
    </group>
  );
}

/**
 * Hiện thân Thánh Giá Chúa & Đôi Cánh Thiên Thần (Christian Apparition)
 */
function ChristianApparition({ active }: { active: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const opacityRef = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (active) {
      opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, 0.95, delta * 4);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 2.7, delta * 3);
      groupRef.current.rotation.z = Math.sin(delta * 2) * 0.04;
    } else {
      opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, 0, delta * 6);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 2.2, delta * 4);
    }

    groupRef.current.visible = opacityRef.current > 0.02;

    groupRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mat = (child as THREE.Mesh).material as THREE.Material;
        if (mat) {
          mat.transparent = true;
          mat.opacity = opacityRef.current;
        }
      }
    });
  });

  return (
    <group ref={groupRef} position={[2.4, 2.2, -4.8]} visible={false}>
      {/* Thánh Giá khổng lồ bằng hào quang ánh sáng trắng vàng */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.1, 1.2, 0.04]} />
        <meshStandardMaterial color="#ffffff" emissive="#fde047" emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[0.75, 0.1, 0.04]} />
        <meshStandardMaterial color="#ffffff" emissive="#fde047" emissiveIntensity={1.5} />
      </mesh>

      {/* Đôi cánh thiên thần ánh sáng vươn rộng hai bên */}
      <group position={[-0.45, 0.5, -0.05]} rotation={[0, 0, 0.3]}>
        <mesh>
          <planeGeometry args={[0.7, 0.9]} />
          <meshBasicMaterial color="#e0f2fe" side={THREE.DoubleSide} transparent />
        </mesh>
      </group>
      <group position={[0.45, 0.5, -0.05]} rotation={[0, 0, -0.3]}>
        <mesh>
          <planeGeometry args={[0.7, 0.9]} />
          <meshBasicMaterial color="#e0f2fe" side={THREE.DoubleSide} transparent />
        </mesh>
      </group>

      {/* Vòng hào quang thiên thần rực rỡ */}
      <mesh position={[0, 0.85, 0]}>
        <torusGeometry args={[0.22, 0.025, 8, 24]} />
        <meshBasicMaterial color="#fef08a" />
      </mesh>

      {/* Ánh sáng thiên đàng tỏa khắp phòng */}
      <pointLight color="#fffbeb" intensity={5.0} distance={7} decay={2} />
    </group>
  );
}

/**
 * Quản lý tổng thể các hiệu ứng thần tích tâm linh và va chạm đạn đạo
 */
export function SpiritualEffects({
  projectiles,
  buddhaMiracleActive,
  christianMiracleActive,
  agents,
  onDodgeTrigger
}: SpiritualEffectsProps) {
  const dodgedTracker = useRef<Record<string, number>>({});

  // Kiểm tra va chạm / khoảng cách giữa projectiles và các Agent để kích hoạt né tránh
  useFrame(() => {
    if (!onDodgeTrigger) return;
    const now = Date.now();

    projectiles.forEach((proj) => {
      // Chỉ kích hoạt khi đạn đang ở giữa quỹ đạo bay (progress từ 0.25 đến 0.85)
      if (proj.progress > 0.25 && proj.progress < 0.85) {
        agents.forEach((agent) => {
          // Tính khoảng cách 3D giữa projectile và Agent
          const [ax, ay, az] = agent.position;
          const [px, py, pz] = proj.currentPosition;
          const dist = Math.hypot(ax - px, (ay + 0.6) - py, az - pz);

          // Nếu bay sát Agent trong bán kính 1.7m và chưa né projectile này gần đây
          const dodgeKey = `${agent.id}_${proj.id}`;
          if (dist < 1.75 && (!dodgedTracker.current[dodgeKey] || now - dodgedTracker.current[dodgeKey] > 3000)) {
            dodgedTracker.current[dodgeKey] = now;
            onDodgeTrigger(agent.id, proj.type);
          }
        });
      }
    });
  });

  return (
    <group name="spiritual-effects-system">
      {/* 1. Hiện thân Đức Phật */}
      <BuddhaApparition active={buddhaMiracleActive} />

      {/* 2. Hiện thân Thánh Giá Chúa */}
      <ChristianApparition active={christianMiracleActive} />

      {/* 3. Render các đạn đạo đang bay */}
      {projectiles.map((p) => {
        if (p.type === 'nail') {
          return (
            <HolyNailModel
              key={p.id}
              position={p.currentPosition}
              progress={p.progress}
            />
          );
        } else {
          return (
            <PrayerBeadsModel
              key={p.id}
              position={p.currentPosition}
            />
          );
        }
      })}
    </group>
  );
}

