/**
 * @file TargetMarker.tsx
 * @description Hiệu ứng vòng tròn điểm đích (Cyber Target Marker) hiển thị khi người dùng click vào sàn nhà để di chuyển Agent.
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TargetMarkerProps {
  position: [number, number, number] | null;
  color?: string;
}

export function TargetMarker({ position, color = '#38bdf8' }: TargetMarkerProps) {
  const ringRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ringRef.current || !coreRef.current) return;
    const t = state.clock.getElapsedTime();
    // Hiệu ứng thở nhẹ và xoay của vòng tròn đích
    const scale = 1 + Math.sin(t * 6) * 0.15;
    ringRef.current.scale.set(scale, scale, 1);
    ringRef.current.rotation.z = t * 1.5;
  });

  if (!position) return null;

  return (
    <group position={[position[0], 0.02, position[2]]}>
      {/* Vòng tròn bên ngoài xoay nhẹ */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.38, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} side={THREE.DoubleSide} />
      </mesh>

      {/* Điểm tâm phát sáng */}
      <mesh ref={coreRef} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.1, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>
    </group>
  );
}
