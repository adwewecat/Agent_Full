/**
 * @file Workstation.tsx
 * @description Mô hình 3D bàn làm việc công nghệ cao (Workstation) kèm màn hình máy tính phát sáng, ghế xoay và tên trạm.
 * Cho phép người dùng nhấp trực tiếp vào bàn để điều Agent tới làm việc.
 */

import { Html } from '@react-three/drei';
import { WorkstationData } from '../types/agent';

interface WorkstationProps {
  data: WorkstationData;
  onSelectStation?: (stationId: string) => void;
}

export function Workstation({ data, onSelectStation }: WorkstationProps) {
  const { id, name, position, rotation, type, occupiedBy } = data;

  const isServer = type === 'server';
  const isLounge = type === 'lounge';

  return (
    <group
      position={position}
      rotation={[0, rotation, 0]}
      onClick={(e) => {
        e.stopPropagation();
        if (onSelectStation) onSelectStation(id);
      }}
    >
      {/* 1. Mặt bàn chính */}
      {!isServer && !isLounge && (
        <>
          {/* Bàn làm việc chữ L cách điệu */}
          <mesh position={[0, 0.42, -0.2]} castShadow receiveShadow>
            <boxGeometry args={[1.5, 0.05, 0.8]} />
            <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.2} />
          </mesh>

          {/* Chân bàn kim loại */}
          <mesh position={[-0.7, 0.2, -0.2]} castShadow>
            <boxGeometry args={[0.06, 0.4, 0.7]} />
            <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0.7, 0.2, -0.2]} castShadow>
            <boxGeometry args={[0.06, 0.4, 0.7]} />
            <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Màn hình máy tính cong phát sáng */}
          <mesh position={[0, 0.75, -0.4]} rotation={[0, 0, 0]} castShadow>
            <boxGeometry args={[0.8, 0.45, 0.03]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
          </mesh>

          {/* Màn hình hiển thị phát quang (Emissive Screen) */}
          <mesh position={[0, 0.75, -0.38]}>
            <planeGeometry args={[0.76, 0.41]} />
            <meshBasicMaterial
              color={type === 'research' ? '#06b6d4' : '#3b82f6'}
              toneMapped={false}
            />
          </mesh>

          {/* Đế màn hình */}
          <mesh position={[0, 0.48, -0.4]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.12, 16]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} />
          </mesh>

          {/* Bàn phím & Chuột */}
          <mesh position={[0, 0.45, -0.15]}>
            <boxGeometry args={[0.4, 0.015, 0.12]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          <mesh position={[0.3, 0.45, -0.15]}>
            <boxGeometry args={[0.06, 0.015, 0.1]} />
            <meshStandardMaterial color="#38bdf8" />
          </mesh>

          {/* Ghế công thái học */}
          <group position={[0, 0, 0.35]}>
            {/* Đệm ngồi */}
            <mesh position={[0, 0.32, 0]} castShadow>
              <boxGeometry args={[0.45, 0.06, 0.45]} />
              <meshStandardMaterial color="#0f172a" roughness={0.5} />
            </mesh>
            {/* Tựa lưng */}
            <mesh position={[0, 0.6, 0.2]} castShadow>
              <boxGeometry args={[0.42, 0.5, 0.05]} />
              <meshStandardMaterial color="#1e293b" roughness={0.4} />
            </mesh>
            {/* Chân ghế */}
            <mesh position={[0, 0.15, 0]} castShadow>
              <cylinderGeometry args={[0.03, 0.03, 0.3, 12]} />
              <meshStandardMaterial color="#64748b" metalness={0.9} />
            </mesh>
          </group>
        </>
      )}

      {/* 2. Trạm máy chủ Server Rack */}
      {isServer && (
        <group position={[0, 0, 0]}>
          <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.0, 2.0, 0.8]} />
            <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Dải đèn LED tín hiệu máy chủ */}
          <mesh position={[0, 1.0, 0.41]}>
            <planeGeometry args={[0.8, 1.8]} />
            <meshBasicMaterial color="#10b981" wireframe transparent opacity={0.6} />
          </mesh>
        </group>
      )}

      {/* 3. Khu vực Lounge nghỉ ngơi */}
      {isLounge && (
        <group position={[0, 0, 0]}>
          {/* Ghế Sofa */}
          <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.8, 0.3, 0.7]} />
            <meshStandardMaterial color="#334155" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.55, -0.3]} castShadow>
            <boxGeometry args={[1.8, 0.45, 0.15]} />
            <meshStandardMaterial color="#1e293b" roughness={0.6} />
          </mesh>
          {/* Bàn cafe nhỏ */}
          <mesh position={[0, 0.2, 0.7]} castShadow>
            <cylinderGeometry args={[0.35, 0.35, 0.25, 24]} />
            <meshStandardMaterial color="#475569" roughness={0.2} metalness={0.1} />
          </mesh>
        </group>
      )}

      {/* Tên trạm nổi trên 3D */}
      <Html position={[0, isServer ? 2.2 : 1.3, 0]} center distanceFactor={16} style={{ pointerEvents: 'none' }}>
        <div
          style={{
            padding: '2px 8px',
            borderRadius: '12px',
            backgroundColor: occupiedBy ? 'rgba(16, 185, 129, 0.15)' : 'rgba(30, 41, 59, 0.85)',
            border: `1px solid ${occupiedBy ? '#10b981' : '#475569'}`,
            fontSize: '10px',
            fontWeight: 600,
            color: occupiedBy ? '#34d399' : '#cbd5e1',
            whiteSpace: 'nowrap',
            backdropFilter: 'blur(4px)'
          }}
        >
          {name} {occupiedBy ? '• (Đang hoạt động)' : '• (Trống)'}
        </div>
      </Html>
    </group>
  );
}
