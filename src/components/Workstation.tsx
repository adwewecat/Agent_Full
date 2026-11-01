/**
 * @file Workstation.tsx
 * @description Mô hình tương tác trạm làm việc (Workstation Interactivity) trong phòng điều hành & hội nghị:
 * - Hiển thị thiết bị công nghệ (Laptop doanh nhân siêu mỏng, sổ tay ghi chép, ly cà phê sứ)
 *   tại từng vị trí ngồi quanh bàn họp và bàn Giám đốc.
 * - Nhãn định vị 3D hiển thị tinh tế khi rê chuột (hover) để giữ không gian sạch sẽ, không rối mắt.
 * - Hỗ trợ click chuột để điều phối Agent tới vị trí trạm.
 */

import { useState } from 'react';
import { Html } from '@react-three/drei';
import { WorkstationData } from '../types/agent';

interface WorkstationProps {
  data: WorkstationData;
  onSelectStation?: (stationId: string) => void;
}

export function Workstation({ data, onSelectStation }: WorkstationProps) {
  const { id, name, position, rotation, type, occupiedBy } = data;
  const [isHovered, setIsHovered] = useState(false);

  // Nếu là trạm đài sen bái Phật, giao diện 3D được render chuyên biệt bởi <BuddhaShrine />
  if (type === 'shrine') {
    return null;
  }

  return (
    <group
      position={position}
      rotation={[0, rotation, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setIsHovered(true);
      }}
      onPointerOut={() => setIsHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        if (onSelectStation) onSelectStation(id);
      }}
    >
      {/* Vùng cảm ứng click & Vòng hiển thị tương tác tinh tế khi rê chuột */}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[0.9, 0.8, 0.9]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {isHovered && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.45, 0.52, 32]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.8} />
        </mesh>
      )}

      {/* 🏷️ Tên trạm nổi trên 3D: Chỉ hiển thị khi rê chuột vào để không che khuất không gian */}
      {isHovered && (
        <Html
          position={[0, 1.4, 0]}
          center
          distanceFactor={16}
          style={{ pointerEvents: 'none' }}
        >
          <div
            style={{
              padding: '3px 8px',
              borderRadius: '12px',
              backgroundColor: occupiedBy ? 'rgba(16, 185, 129, 0.94)' : 'rgba(15, 23, 42, 0.94)',
              border: `1.5px solid ${occupiedBy ? '#34d399' : '#0284c7'}`,
              fontSize: '10px',
              fontWeight: 700,
              color: '#ffffff',
              whiteSpace: 'nowrap',
              backdropFilter: 'blur(6px)',
              boxShadow: '0 4px 14px rgba(0,0,0,0.45)',
              transition: 'all 0.2s ease'
            }}
          >
            {name} {occupiedBy ? '• (Đang làm việc)' : '• (Sẵn sàng)'}
          </div>
        </Html>
      )}
    </group>
  );
}
