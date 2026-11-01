/**
 * @file Workstation.tsx
 * @description Mô hình 3D trạm làm việc (Workstation) tối ưu hình học và điểm ngồi/đứng chuẩn xác.
 * Cấu trúc bàn ghế phân tách rõ ràng, ghế xoay công thái học đặt đúng khoảng cách,
 * không bao giờ để nhân vật bị chìm dưới gầm ghế, ngồi lên bàn hay kẹt vào thùng máy server.
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
  const isArcade = type === 'arcade';

  return (
    <group
      position={position}
      rotation={[0, rotation, 0]}
      onClick={(e) => {
        e.stopPropagation();
        if (onSelectStation) onSelectStation(id);
      }}
    >
      {/* 1. Bàn làm việc công nghệ cao (Coding / Research / QA Bench) */}
      {!isServer && !isLounge && !isArcade && (
        <group>
          {/* Mặt bàn gỗ ấm áp (Tâm bàn tại Z = 0) */}
          <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.7, 0.06, 0.8]} />
            <meshStandardMaterial color="#b45309" roughness={0.5} />
          </mesh>

          {/* Chân bàn kim loại đen mờ */}
          <mesh position={[-0.78, 0.22, 0]} castShadow>
            <boxGeometry args={[0.06, 0.44, 0.7]} />
            <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0.78, 0.22, 0]} castShadow>
            <boxGeometry args={[0.06, 0.44, 0.7]} />
            <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
          </mesh>

          {/* Màn hình kép công thái học đặt ở mép sau bàn (Z = -0.28) */}
          {/* Màn hình chính bên trái */}
          <group position={[-0.32, 0.8, -0.28]} rotation={[0, 0.12, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.62, 0.38, 0.025]} />
              <meshStandardMaterial color="#020617" roughness={0.2} metalness={0.8} />
            </mesh>
            <mesh position={[0, 0, 0.015]}>
              <planeGeometry args={[0.58, 0.34]} />
              <meshBasicMaterial color="#0284c7" />
            </mesh>
            <mesh position={[0, 0, 0.018]}>
              <planeGeometry args={[0.54, 0.28]} />
              <meshBasicMaterial color="#38bdf8" wireframe />
            </mesh>
          </group>

          {/* Màn hình phụ bên phải */}
          <group position={[0.32, 0.8, -0.28]} rotation={[0, -0.15, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.62, 0.38, 0.025]} />
              <meshStandardMaterial color="#020617" roughness={0.2} metalness={0.8} />
            </mesh>
            <mesh position={[0, 0, 0.015]}>
              <planeGeometry args={[0.58, 0.34]} />
              <meshBasicMaterial color="#a855f7" />
            </mesh>
          </group>

          {/* Chân đế màn hình */}
          <mesh position={[0, 0.52, -0.28]} castShadow>
            <cylinderGeometry args={[0.03, 0.05, 0.16, 12]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>

          {/* Bàn phím cơ & Chuột ở mép trước bàn (Z = 0.12) */}
          <mesh position={[0, 0.48, 0.12]}>
            <boxGeometry args={[0.42, 0.02, 0.14]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, 0.495, 0.12]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.4, 0.12]} />
            <meshBasicMaterial color="#38bdf8" wireframe />
          </mesh>

          {/* Chuột gaming & Lót chuột */}
          <mesh position={[0, 0.472, 0.12]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[0.7, 0.28]} />
            <meshStandardMaterial color="#1e1b4b" roughness={0.8} />
          </mesh>
          <mesh position={[0.26, 0.485, 0.12]}>
            <boxGeometry args={[0.06, 0.02, 0.1]} />
            <meshStandardMaterial color="#f43f5e" />
          </mesh>

          {/* Đèn bàn ấm áp */}
          <group position={[-0.7, 0.47, -0.2]}>
            <mesh position={[0, 0.02, 0]}>
              <cylinderGeometry args={[0.06, 0.08, 0.04, 16]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.6} />
            </mesh>
            <mesh position={[0, 0.22, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.4, 8]} />
              <meshStandardMaterial color="#475569" />
            </mesh>
            <mesh position={[0.08, 0.38, 0]} rotation={[0, 0, -0.6]}>
              <coneGeometry args={[0.08, 0.14, 16]} />
              <meshStandardMaterial color="#f59e0b" />
            </mesh>
            <pointLight position={[0.1, 0.35, 0]} color="#fef08a" intensity={0.9} distance={2.5} />
          </group>

          {/* Cốc cà phê & Chậu sen đá */}
          <group position={[0.65, 0.47, 0.1]}>
            <mesh position={[0, 0.04, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.035, 0.08, 16]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.075, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.035, 16]} />
              <meshStandardMaterial color="#3b1d11" />
            </mesh>
          </group>
          <group position={[0.68, 0.47, -0.2]}>
            <mesh position={[0, 0.03, 0]}>
              <cylinderGeometry args={[0.05, 0.04, 0.06, 12]} />
              <meshStandardMaterial color="#ea580c" roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.08, 0]}>
              <dodecahedronGeometry args={[0.05, 0]} />
              <meshStandardMaterial color="#10b981" roughness={0.5} />
            </mesh>
          </group>

          {/* Ghế công thái học đặt lùi về sau bàn (Z = 0.52) */}
          <group position={[0, 0, 0.52]}>
            {/* Đệm ngồi ghế tại Y = 0.35 */}
            <mesh position={[0, 0.35, 0]} castShadow>
              <boxGeometry args={[0.5, 0.07, 0.5]} />
              <meshStandardMaterial color="#0284c7" roughness={0.4} />
            </mesh>
            {/* Tựa lưng ghế tại Z = 0.22 */}
            <mesh position={[0, 0.68, 0.22]} castShadow>
              <boxGeometry args={[0.46, 0.55, 0.06]} />
              <meshStandardMaterial color="#0369a1" roughness={0.4} />
            </mesh>
            {/* Trụ thủy lực nâng ghế */}
            <mesh position={[0, 0.17, 0]} castShadow>
              <cylinderGeometry args={[0.035, 0.035, 0.34, 12]} />
              <meshStandardMaterial color="#64748b" metalness={0.9} />
            </mesh>
            {/* 5 Chân bánh xe */}
            <mesh position={[0, 0.03, 0]}>
              <cylinderGeometry args={[0.24, 0.24, 0.02, 5]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
          </group>
        </group>
      )}

      {/* 2. Máy chơi game Arcade cổ điển (Đứng phía trước cần gạt Z = 0.65) */}
      {isArcade && (
        <group position={[0, 0, -0.2]}>
          <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.9, 2.0, 0.8]} />
            <meshStandardMaterial color="#3b0764" metalness={0.4} roughness={0.3} />
          </mesh>
          <mesh position={[0, 1.25, 0.41]} rotation={[-0.2, 0, 0]}>
            <planeGeometry args={[0.65, 0.5]} />
            <meshBasicMaterial color="#ec4899" />
          </mesh>
          <mesh position={[0, 0.85, 0.45]} rotation={[0.3, 0, 0]}>
            <boxGeometry args={[0.8, 0.25, 0.08]} />
            <meshStandardMaterial color="#f43f5e" />
          </mesh>
          <mesh position={[-0.15, 0.95, 0.48]}>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.6} />
          </mesh>
          <mesh position={[0.15, 0.95, 0.48]}>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.6} />
          </mesh>
          <mesh position={[0, 1.85, 0.42]}>
            <planeGeometry args={[0.75, 0.18]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>
      )}

      {/* 3. Trạm máy chủ Server Rack (Đứng thao tác phía trước Z = 0.75) */}
      {isServer && (
        <group position={[0, 0, -0.2]}>
          <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.1, 2.2, 0.9]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 1.1, 0.46]}>
            <planeGeometry args={[0.95, 2.0]} />
            <meshBasicMaterial color="#10b981" wireframe transparent opacity={0.7} />
          </mesh>
          <pointLight position={[0, 1.5, 0.6]} color="#34d399" intensity={0.7} distance={2.5} />
        </group>
      )}

      {/* 4. Khu vực Lounge nghỉ ngơi (Ngồi trên đệm Sofa) */}
      {isLounge && (
        <group position={[0, 0, 0]}>
          {/* Ghế Sofa bọc nỉ màu cam đất ấm áp */}
          <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.0, 0.32, 0.8]} />
            <meshStandardMaterial color="#c2410c" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.58, -0.32]} castShadow>
            <boxGeometry args={[2.0, 0.48, 0.18]} />
            <meshStandardMaterial color="#9a3412" roughness={0.7} />
          </mesh>
          <mesh position={[-0.65, 0.45, -0.18]}>
            <boxGeometry args={[0.3, 0.25, 0.1]} />
            <meshStandardMaterial color="#38bdf8" />
          </mesh>
          <mesh position={[0.65, 0.45, -0.18]}>
            <boxGeometry args={[0.3, 0.25, 0.1]} />
            <meshStandardMaterial color="#facc15" />
          </mesh>
          {/* Bàn cafe mặt tròn */}
          <mesh position={[0, 0.18, 0.85]} castShadow>
            <cylinderGeometry args={[0.4, 0.4, 0.22, 24]} />
            <meshStandardMaterial color="#78350f" roughness={0.4} />
          </mesh>
        </group>
      )}

      {/* 🏷️ Tên trạm nổi trên 3D */}
      <Html
        position={[0, isServer ? 2.4 : isArcade ? 2.1 : 1.45, isServer || isArcade ? 0.3 : 0]}
        center
        distanceFactor={16}
        style={{ pointerEvents: 'none' }}
      >
        <div
          style={{
            padding: '3px 10px',
            borderRadius: '16px',
            backgroundColor: occupiedBy ? 'rgba(16, 185, 129, 0.25)' : 'rgba(15, 23, 42, 0.85)',
            border: `1.5px solid ${occupiedBy ? '#10b981' : '#64748b'}`,
            fontSize: '10.5px',
            fontWeight: 700,
            color: occupiedBy ? '#34d399' : '#e2e8f0',
            whiteSpace: 'nowrap',
            backdropFilter: 'blur(6px)',
            boxShadow: occupiedBy ? '0 0 10px rgba(16, 185, 129, 0.4)' : '0 2px 8px rgba(0,0,0,0.3)'
          }}
        >
          {name} {occupiedBy ? '• (Đang hoạt động)' : '• (Sẵn sàng)'}
        </div>
      </Html>
    </group>
  );
}
