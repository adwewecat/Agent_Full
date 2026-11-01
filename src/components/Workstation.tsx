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

  const isLounge = type === 'lounge';

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
      {/* 💻 Thiết bị công nghệ tại vị trí làm việc bàn họp (Conference Laptop & Desk Props) */}
      {!isLounge && (
        <group position={[0.42, 0.74, 0]}>
          {/* Laptop mỏng màu Space Gray */}
          <group position={[0, 0.015, 0]}>
            {/* Thân máy dưới */}
            <mesh castShadow>
              <boxGeometry args={[0.34, 0.012, 0.24]} />
              <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Màn hình mở nghiêng 110 độ */}
            <group position={[-0.16, 0.006, 0]} rotation={[0, 0, 1.2]}>
              <mesh castShadow>
                <boxGeometry args={[0.008, 0.24, 0.34]} />
                <meshStandardMaterial color="#1e293b" metalness={0.9} />
              </mesh>
              {/* Mặt màn hình hiển thị code phát sáng nhẹ */}
              <mesh position={[0.005, 0, 0]}>
                <planeGeometry args={[0.22, 0.32]} />
                <meshBasicMaterial color="#0284c7" />
              </mesh>
            </group>
          </group>

          {/* Sổ tay da cao cấp & Bút ký */}
          <mesh position={[0, 0.012, -0.22]}>
            <boxGeometry args={[0.2, 0.015, 0.14]} />
            <meshStandardMaterial color="#78350f" roughness={0.7} />
          </mesh>
          <mesh position={[0.08, 0.022, -0.22]}>
            <cylinderGeometry args={[0.004, 0.004, 0.12, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
          </mesh>

          {/* Ly nước gốm sứ trắng thanh lịch */}
          <group position={[0.18, 0.04, 0.2]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.035, 0.03, 0.075, 16]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.028, 16]} />
              <meshStandardMaterial color="#27180e" roughness={0.1} />
            </mesh>
          </group>
        </group>
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
