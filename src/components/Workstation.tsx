/**
 * @file Workstation.tsx
 * @description Mô hình 3D trạm làm việc (Workstation) chuẩn mực cao cấp theo phong cách tham chiếu
 * thực tế (High-End Corporate & NOVUS AI Command Center).
 * Bao gồm:
 * 1. Bàn điều hành hiện đại với mặt bàn vát cạnh, khung thép tĩnh điện, vách kính mờ riêng tư,
 *    hộc tủ di động 3 ngăn có logo phát sáng dưới gầm bàn.
 * 2. Ghế xoay công thái học cao cấp (Herman Miller Aeron Style) với chân sao 5 cánh có bánh xe con lăn,
 *    trụ nâng thủy lực mạ chrome, đệm ngồi uốn lượn, tựa lưng lưới thoáng khí và tay vịn 3D.
 * 3. Màn hình cong kép không viền gắn trên tay đòn kim loại, hiển thị code IDE và biểu đồ telemetry.
 * 4. Bàn phím cơ công thái học có LED nền, chuột quang, lót bàn da khâu chỉ và ly cà phê sứ.
 * 5. Tủ máy chủ Neural Server Rack và Khu vực Lounge nghỉ ngơi cao cấp.
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

  const isServer = type === 'server';
  const isLounge = type === 'lounge';
  const isArcade = type === 'arcade';

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
      {/* 💻 1. BÀN LÀM VIỆC ĐIỀU HÀNH HIỆN ĐẠI (Executive Workstation Bench) */}
      {!isServer && !isLounge && !isArcade && (
        <group>
          {/* Mặt bàn thạch anh trắng xám / gỗ sồi thanh lịch vát cạnh */}
          <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.8, 0.05, 0.85]} />
            <meshStandardMaterial
              color="#f8fafc"
              roughness={0.25}
              metalness={0.1}
            />
          </mesh>

          {/* Khung chân thép sơn tĩnh điện đen mờ chữ U */}
          <mesh position={[-0.82, 0.22, 0]} castShadow>
            <boxGeometry args={[0.06, 0.44, 0.78]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.25} />
          </mesh>
          <mesh position={[0.82, 0.22, 0]} castShadow>
            <boxGeometry args={[0.06, 0.44, 0.78]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.25} />
          </mesh>
          {/* Thanh giằng ngang chịu lực */}
          <mesh position={[0, 0.15, -0.32]}>
            <boxGeometry args={[1.6, 0.04, 0.04]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>

          {/* Vách ngăn kính mờ riêng tư phía sau bàn (Frosted Glass Privacy Panel) */}
          <group position={[0, 0.65, -0.4]}>
            <mesh>
              <boxGeometry args={[1.7, 0.38, 0.02]} />
              <meshPhysicalMaterial
                color="#e2e8f0"
                transmission={0.82}
                opacity={0.65}
                transparent
                roughness={0.2}
                ior={1.45}
              />
            </mesh>
            {/* 2 Ngàm kẹp kim loại cố định vách kính vào mặt bàn */}
            {[-0.6, 0.6].map((x, i) => (
              <mesh key={i} position={[x, -0.18, 0]}>
                <boxGeometry args={[0.06, 0.08, 0.05]} />
                <meshStandardMaterial color="#475569" metalness={0.9} />
              </mesh>
            ))}
          </group>

          {/* 🗄️ Hộc tủ di động 3 ngăn dưới gầm bàn (Under-desk Mobile Pedestal Cabinet) */}
          <group position={[0.55, 0.22, 0.05]}>
            {/* Thân hộc tủ trắng thanh lịch */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.38, 0.39, 0.58]} />
              <meshStandardMaterial color="#f1f5f9" roughness={0.35} />
            </mesh>
            {/* Các đường rãnh 3 ngăn kéo */}
            {[-0.08, 0.03, 0.14].map((y, idx) => (
              <group key={idx} position={[0, y, 0.295]}>
                {/* Tay nắm nhôm mạ kim loại */}
                <mesh position={[0, 0, 0]}>
                  <boxGeometry args={[0.16, 0.02, 0.015]} />
                  <meshStandardMaterial color="#64748b" metalness={0.9} />
                </mesh>
              </group>
            ))}
            {/* Logo công nghệ phát sáng xanh mờ ở mặt bên tủ (như ảnh tham chiếu NOVUS AI) */}
            <mesh position={[0.192, -0.05, 0]} rotation={[0, Math.PI / 2, 0]}>
              <planeGeometry args={[0.18, 0.18]} />
              <meshBasicMaterial color="#0284c7" transparent opacity={0.7} />
            </mesh>
          </group>

          {/* 🖥️ MÀN HÌNH CONG KÉP SIÊU MỎNG GẮN TAY ĐÒN (Dual Curved Ultrawide Monitors) */}
          {/* Màn hình 1 (Bên trái): Hiển thị IDE Code Editor */}
          <group position={[-0.38, 0.82, -0.26]} rotation={[0, 0.16, 0]}>
            {/* Thân màn hình viền siêu mỏng */}
            <mesh castShadow>
              <boxGeometry args={[0.72, 0.42, 0.02]} />
              <meshStandardMaterial color="#020617" roughness={0.2} metalness={0.9} />
            </mesh>
            {/* Màn hình hiển thị mã nguồn IDE VS Code */}
            <mesh position={[0, 0, 0.012]}>
              <planeGeometry args={[0.68, 0.38]} />
              <meshBasicMaterial color="#0f172a" />
            </mesh>
            {/* Các dòng mã nguồn syntax highlighting nhiều màu (Xanh, Vàng, Cam, Tím) */}
            {[-0.14, -0.09, -0.04, 0.01, 0.06, 0.11, 0.15].map((y, idx) => (
              <mesh key={idx} position={[-0.18 + (idx % 3) * 0.06, y, 0.014]}>
                <planeGeometry args={[0.26 + (idx % 2) * 0.12, 0.018]} />
                <meshBasicMaterial
                  color={
                    idx % 4 === 0
                      ? '#38bdf8'
                      : idx % 4 === 1
                      ? '#facc15'
                      : idx % 4 === 2
                      ? '#4ade80'
                      : '#ec4899'
                  }
                />
              </mesh>
            ))}
          </group>

          {/* Màn hình 2 (Bên phải): Hiển thị Telemetry & Analytics Dashboard */}
          <group position={[0.38, 0.82, -0.26]} rotation={[0, -0.16, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.72, 0.42, 0.02]} />
              <meshStandardMaterial color="#020617" roughness={0.2} metalness={0.9} />
            </mesh>
            <mesh position={[0, 0, 0.012]}>
              <planeGeometry args={[0.68, 0.38]} />
              <meshBasicMaterial color="#030712" />
            </mesh>
            {/* Đồ thị đường cong phát sáng */}
            <mesh position={[0, 0.02, 0.014]}>
              <planeGeometry args={[0.62, 0.22]} />
              <meshBasicMaterial color="#06b6d4" wireframe />
            </mesh>
            {/* Thanh đo tiến độ / metrics */}
            <mesh position={[-0.12, -0.12, 0.014]}>
              <planeGeometry args={[0.34, 0.04]} />
              <meshBasicMaterial color="#10b981" />
            </mesh>
          </group>

          {/* Tay đòn kim loại kép đỡ 2 màn hình (Articulated Dual Monitor Arm) */}
          <group position={[0, 0.58, -0.34]}>
            <mesh position={[0, 0, 0]} castShadow>
              <cylinderGeometry args={[0.025, 0.035, 0.24, 12]} />
              <meshStandardMaterial color="#334155" metalness={0.9} />
            </mesh>
            <mesh position={[-0.22, 0.14, 0.04]} rotation={[0, 0, -0.3]}>
              <boxGeometry args={[0.38, 0.025, 0.025]} />
              <meshStandardMaterial color="#1e293b" metalness={0.9} />
            </mesh>
            <mesh position={[0.22, 0.14, 0.04]} rotation={[0, 0, 0.3]}>
              <boxGeometry args={[0.38, 0.025, 0.025]} />
              <meshStandardMaterial color="#1e293b" metalness={0.9} />
            </mesh>
          </group>

          {/* ⌨️ BÀN PHÍM CƠ & CHUỘT QUANG TRÊN THẢM DA CAO CẤP */}
          {/* Thảm trải bàn bằng da viền chỉ (Executive Desk Mat) */}
          <mesh position={[-0.1, 0.468, 0.08]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[0.9, 0.42]} />
            <meshStandardMaterial color="#0f172a" roughness={0.8} />
          </mesh>

          {/* Bàn phím cơ low-profile có đèn nền */}
          <group position={[-0.18, 0.482, 0.12]}>
            <mesh castShadow>
              <boxGeometry args={[0.42, 0.016, 0.14]} />
              <meshStandardMaterial color="#020617" roughness={0.3} metalness={0.5} />
            </mesh>
            {/* Các phím bấm mini */}
            <mesh position={[0, 0.01, 0]}>
              <planeGeometry args={[0.39, 0.12]} />
              <meshBasicMaterial color="#38bdf8" wireframe />
            </mesh>
          </group>

          {/* Chuột công thái học không dây */}
          <group position={[0.18, 0.482, 0.12]}>
            <mesh castShadow>
              <boxGeometry args={[0.07, 0.022, 0.11]} />
              <meshStandardMaterial color="#1e293b" roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.012, -0.02]}>
              <boxGeometry args={[0.01, 0.01, 0.02]} />
              <meshStandardMaterial color="#06b6d4" />
            </mesh>
          </group>

          {/* ☕ Ly cà phê gốm sứ trắng & Chậu cây cảnh mini để bàn */}
          <group position={[-0.7, 0.47, 0.12]}>
            <mesh position={[0, 0.04, 0]} castShadow>
              <cylinderGeometry args={[0.045, 0.04, 0.085, 16]} />
              <meshStandardMaterial color="#ffffff" roughness={0.2} />
            </mesh>
            {/* Nước cà phê nâu sẫm */}
            <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.04, 16]} />
              <meshStandardMaterial color="#27180e" roughness={0.1} />
            </mesh>
          </group>
          <group position={[0.72, 0.47, -0.2]}>
            <mesh position={[0, 0.035, 0]}>
              <cylinderGeometry args={[0.055, 0.045, 0.07, 16]} />
              <meshStandardMaterial color="#e2e8f0" roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.09, 0]}>
              <dodecahedronGeometry args={[0.055, 1]} />
              <meshStandardMaterial color="#16a34a" roughness={0.4} />
            </mesh>
          </group>

          {/* 💺 GHẾ XOAY CÔNG THÁI HỌC CAO CẤP (Herman Miller Aeron Style Task Chair) */}
          {/* Tọa độ tâm ghế đặt tại Z = 0.52 chuẩn xác */}
          <group position={[0, 0, 0.52]}>
            {/* Đệm ngồi bọc vải công thái học uốn cong tại Y = 0.35 */}
            <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.54, 0.065, 0.5]} />
              <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.1} />
            </mesh>

            {/* Khung viền tựa lưng công thái học bọc lưới thoáng khí */}
            <group position={[0, 0.68, 0.22]}>
              {/* Khung viền ngoài nhựa đen cao cấp */}
              <mesh castShadow>
                <boxGeometry args={[0.5, 0.58, 0.05]} />
                <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.2} />
              </mesh>
              {/* Lưới dệt thoáng khí trong suốt nhẹ */}
              <mesh position={[0, 0, 0.01]}>
                <planeGeometry args={[0.44, 0.52]} />
                <meshStandardMaterial
                  color="#1e293b"
                  wireframe
                  transparent
                  opacity={0.75}
                />
              </mesh>
              {/* Đệm hỗ trợ cột sống thắt lưng (Lumbar Support) phía sau lưng ghế */}
              <mesh position={[0, -0.08, 0.04]}>
                <boxGeometry args={[0.34, 0.12, 0.03]} />
                <meshStandardMaterial color="#334155" roughness={0.4} />
              </mesh>
            </group>

            {/* Đôi tay vịn 3D bọc đệm êm ái */}
            {[-0.28, 0.28].map((x, idx) => (
              <group key={idx} position={[x, 0.46, 0.04]}>
                {/* Trụ đỡ tay vịn bằng kim loại */}
                <mesh position={[0, -0.06, 0]}>
                  <cylinderGeometry args={[0.018, 0.022, 0.16, 8]} />
                  <meshStandardMaterial color="#475569" metalness={0.8} />
                </mesh>
                {/* Miếng đệm tỳ tay êm ái */}
                <mesh position={[0, 0.02, 0.02]} castShadow>
                  <boxGeometry args={[0.08, 0.025, 0.24]} />
                  <meshStandardMaterial color="#0f172a" roughness={0.5} />
                </mesh>
              </group>
            ))}

            {/* Trụ nâng thủy lực mạ Chrome sáng bóng */}
            <mesh position={[0, 0.18, 0]} castShadow>
              <cylinderGeometry args={[0.032, 0.032, 0.3, 16]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.1} />
            </mesh>

            {/* 🌟 Chân sao 5 cánh kim loại mạ Chrome sang trọng */}
            <group position={[0, 0.05, 0]}>
              <mesh>
                <cylinderGeometry args={[0.07, 0.07, 0.04, 16]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
              </mesh>
              {/* 5 Cánh tay chân sao vươn đều ra 5 hướng */}
              {[0, 1, 2, 3, 4].map((i) => {
                const angle = (i * Math.PI * 2) / 5;
                const r = 0.26;
                return (
                  <group key={i} rotation={[0, angle, 0]}>
                    <mesh position={[0, 0, r / 2]} rotation={[0.1, 0, 0]}>
                      <boxGeometry args={[0.035, 0.025, r]} />
                      <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
                    </mesh>
                    {/* Bánh xe kép con lăn xoay linh hoạt (Twin Wheel Castors) */}
                    <mesh position={[0, -0.025, r]} rotation={[0, 0, Math.PI / 2]}>
                      <cylinderGeometry args={[0.025, 0.025, 0.03, 12]} />
                      <meshStandardMaterial color="#020617" roughness={0.5} />
                    </mesh>
                  </group>
                );
              })}
            </group>
          </group>
        </group>
      )}

      {/* 🕹️ 2. MÁY CHƠI GAME ARCADE CỔ ĐIỂN (Retro Arcade Station) */}
      {isArcade && (
        <group position={[0, 0, -0.2]}>
          <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.9, 2.0, 0.8]} />
            <meshStandardMaterial color="#1e1b4b" metalness={0.5} roughness={0.25} />
          </mesh>
          <mesh position={[0, 1.25, 0.41]} rotation={[-0.2, 0, 0]}>
            <planeGeometry args={[0.68, 0.52]} />
            <meshBasicMaterial color="#ec4899" />
          </mesh>
          <mesh position={[0, 0.85, 0.45]} rotation={[0.3, 0, 0]}>
            <boxGeometry args={[0.82, 0.25, 0.08]} />
            <meshStandardMaterial color="#020617" />
          </mesh>
          {/* Cần điều khiển Joystick & Nút bấm phát sáng */}
          <mesh position={[-0.16, 0.96, 0.48]}>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.8} />
          </mesh>
          <mesh position={[0.16, 0.96, 0.48]}>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.8} />
          </mesh>
          {/* Biển hiệu Arcade phát sáng neon */}
          <mesh position={[0, 1.88, 0.42]}>
            <planeGeometry args={[0.78, 0.16]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>
      )}

      {/* 🖥️ 3. TỦ MÁY CHỦ NEURAL SERVER RACK (Enterprise Cloud Server Rack) */}
      {isServer && (
        <group position={[0, 0, -0.2]}>
          <mesh position={[0, 1.15, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.15, 2.3, 0.95]} />
            <meshStandardMaterial color="#020617" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Cánh cửa kính cường lực hun khói trong suốt */}
          <mesh position={[0, 1.15, 0.48]}>
            <planeGeometry args={[1.0, 2.1]} />
            <meshPhysicalMaterial
              color="#0f172a"
              transmission={0.8}
              opacity={0.65}
              transparent
              roughness={0.1}
            />
          </mesh>
          {/* Các phiến máy chủ Rack Server bên trong với đèn LED nhấp nháy xanh */}
          {Array.from({ length: 8 }).map((_, i) => (
            <mesh key={i} position={[0, 0.35 + i * 0.22, 0.44]}>
              <planeGeometry args={[0.92, 0.18]} />
              <meshBasicMaterial
                color={i % 2 === 0 ? '#10b981' : '#0284c7'}
                wireframe
                transparent
                opacity={0.8}
              />
            </mesh>
          ))}
          <pointLight position={[0, 1.5, 0.65]} color="#10b981" intensity={0.9} distance={3} />
        </group>
      )}

      {/* 🛋️ 4. KHU VỰC LOUNGE NGHỈ NGƠI CAO CẤP (Executive Leather Lounge) */}
      {isLounge && (
        <group position={[0, 0, 0]}>
          {/* Ghế Sofa da màu nâu Cognac ấm cúng & sang trọng */}
          <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.1, 0.32, 0.85]} />
            <meshStandardMaterial color="#7c2d12" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.6, -0.34]} castShadow>
            <boxGeometry args={[2.1, 0.5, 0.18]} />
            <meshStandardMaterial color="#5c1d06" roughness={0.5} />
          </mesh>
          {/* Gối tựa lưng nhung cao cấp */}
          <mesh position={[-0.65, 0.46, -0.2]}>
            <boxGeometry args={[0.32, 0.28, 0.1]} />
            <meshStandardMaterial color="#0284c7" roughness={0.7} />
          </mesh>
          <mesh position={[0.65, 0.46, -0.2]}>
            <boxGeometry args={[0.32, 0.28, 0.1]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.7} />
          </mesh>
          {/* Bàn cafe mặt đá Marble tròn chân kim loại */}
          <mesh position={[0, 0.2, 0.9]} castShadow>
            <cylinderGeometry args={[0.44, 0.44, 0.04, 32]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.15} metalness={0.2} />
          </mesh>
          <mesh position={[0, 0.1, 0.9]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.18, 12]} />
            <meshStandardMaterial color="#d97706" metalness={0.9} />
          </mesh>
        </group>
      )}

      {/* 🏷️ Tên trạm nổi trên 3D: Chỉ hiển thị khi rê chuột vào để không che khuất không gian */}
      {isHovered && (
        <Html
          position={[0, isServer ? 2.45 : isArcade ? 2.15 : 1.5, isServer || isArcade ? 0.35 : 0]}
          center
          distanceFactor={16}
          style={{ pointerEvents: 'none' }}
        >
          <div
            style={{
              padding: '3px 8px',
              borderRadius: '12px',
              backgroundColor: occupiedBy ? 'rgba(16, 185, 129, 0.92)' : 'rgba(15, 23, 42, 0.92)',
              border: `1.5px solid ${occupiedBy ? '#34d399' : '#94a3b8'}`,
              fontSize: '10px',
              fontWeight: 700,
              color: '#ffffff',
              whiteSpace: 'nowrap',
              backdropFilter: 'blur(6px)',
              boxShadow: '0 4px 14px rgba(0,0,0,0.45)',
              transition: 'all 0.2s ease'
            }}
          >
            {name} {occupiedBy ? '• (Đang hoạt động)' : '• (Sẵn sàng)'}
          </div>
        </Html>
      )}
    </group>
  );
}
