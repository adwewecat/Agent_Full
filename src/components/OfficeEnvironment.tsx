/**
 * @file OfficeEnvironment.tsx
 * @description Môi trường văn phòng điều hành & phòng họp hội nghị sang trọng, sáng sủa, đẳng cấp
 * thiết kế chính xác theo hình ảnh tham chiếu thực tế Pinterest:
 * - Tường sơn 2 màu phân tầng đặc trưng: Nửa trên trắng tinh khôi, nửa dưới xanh dương Địa Trung Hải (Two-tone White & Sky Blue) kèm nẹp chỉ gỗ.
 * - Sàn gạch sứ men bóng trắng ngà sang trọng, liền mạch 100%, không tì vết, phản chiếu ánh sáng tự nhiên.
 * - Tường hậu: Bảng xanh nẹp gỗ trung tâm, biểu trưng mặt trời vàng quyền uy phía trên, 2 tủ sách gỗ mặt kính 2 bên và tủ búp-phê gỗ thấp.
 * - Bàn làm việc Giám đốc điều hành quyền uy (phía trên) kèm ghế da đen cao cấp.
 * - Bàn hội nghị họp nhóm gỗ sồi lớn trung tâm kèm 8 ghế xoay da đen chân sao mạ chrome.
 * - Khu sofa VIP tiếp khách bọc da màu kem taupe êm ái hai bên phòng kèm bàn trà gỗ sồi.
 * - Cửa sổ kính lớn đón nắng tự nhiên bên trái, cửa ra vào bên phải, tranh biểu đồ tổ chức treo tường.
 */

import { useState, Suspense } from 'react';
import { useTexture, Html } from '@react-three/drei';
import { DynamicReportBoard } from './DynamicReportBoard';

export function OfficeEnvironment() {
  return (
    <group>
      {/* 1. Sàn gạch sứ men bóng trắng ngà cao cấp */}
      <PorcelainFloor />

      {/* 2. Hệ thống tường 2 màu (Trắng & Xanh dương Địa Trung Hải) kèm nẹp chỉ gỗ */}
      <TwoToneWalls />

      {/* 3. Tường hậu: Bảng xanh, Biểu trưng vàng, Tủ tài liệu gỗ kính */}
      <BackWallDecor />

      {/* 4. Cửa sổ kính lớn lấy sáng bên trái & Cửa ra vào bên phải */}
      <WindowsAndDoors />

      {/* 5. Bàn Giám đốc điều hành & Ghế da đen (Director Executive Desk Area) */}
      <DirectorDeskArea />

      {/* 6. Bàn hội nghị họp nhóm trung tâm & 8 Ghế xoay da chân sao (Conference Hub) */}
      <ConferenceTableArea />

      {/* 7. Khu vực Sofa tiếp khách VIP bọc da kem taupe & Bàn trà hai bên phòng */}
      <SideLounges />

      {/* 8. Cây xanh văn phòng trong chậu gốm sứ trắng thanh lịch */}
      <OfficePlants />
    </group>
  );
}

/**
 * 🏢 1. Sàn gạch men sứ trắng ngà siêu bóng cao cấp (Seamless Glossy Porcelain Floor)
 */
function PorcelainFloor() {
  return (
    <mesh position={[0, -0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[16, 16]} />
      <meshStandardMaterial
        color="#fbfcfd"
        roughness={0.12}
        metalness={0.06}
      />
    </mesh>
  );
}

/**
 * 🎨 2. Hệ thống tường phân tầng 2 màu (Two-Tone Walls: Pure White & Sky Blue)
 * Tường hậu (Z = -5.6), Tường trái (X = -5.8), Tường phải (X = 5.8)
 */
function TwoToneWalls() {
  const wallHeight = 5.4;
  const blueHeight = 1.45;
  const whiteHeight = wallHeight - blueHeight;

  return (
    <group>
      {/* === TƯỜNG HẬU (Back Wall Z = -5.6) === */}
      {/* Nửa dưới màu xanh dương Sky Blue */}
      <mesh position={[0, blueHeight / 2, -5.6]} receiveShadow>
        <boxGeometry args={[11.8, blueHeight, 0.15]} />
        <meshStandardMaterial color="#0284c7" roughness={0.3} />
      </mesh>
      {/* Nẹp chỉ gỗ ngăn cách 2 dải màu */}
      <mesh position={[0, blueHeight, -5.52]}>
        <boxGeometry args={[11.8, 0.04, 0.02]} />
        <meshStandardMaterial color="#b45309" roughness={0.4} />
      </mesh>
      {/* Nửa trên màu trắng tinh khôi */}
      <mesh position={[0, blueHeight + whiteHeight / 2, -5.6]} receiveShadow>
        <boxGeometry args={[11.8, whiteHeight, 0.15]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      {/* Vạch nẹp xanh dương trên đỉnh tường */}
      <mesh position={[0, wallHeight - 0.1, -5.52]}>
        <boxGeometry args={[11.8, 0.2, 0.02]} />
        <meshStandardMaterial color="#0284c7" />
      </mesh>

      {/* === TƯỜNG TRÁI (Left Wall X = -5.8) === */}
      <group position={[-5.8, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[0, blueHeight / 2, 0]} receiveShadow>
          <boxGeometry args={[11.4, blueHeight, 0.15]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} />
        </mesh>
        <mesh position={[0, blueHeight, 0.08]}>
          <boxGeometry args={[11.4, 0.04, 0.02]} />
          <meshStandardMaterial color="#b45309" roughness={0.4} />
        </mesh>
        <mesh position={[0, blueHeight + whiteHeight / 2, 0]} receiveShadow>
          <boxGeometry args={[11.4, whiteHeight, 0.15]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        <mesh position={[0, wallHeight - 0.1, 0.08]}>
          <boxGeometry args={[11.4, 0.2, 0.02]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
      </group>

      {/* === TƯỜNG PHẢI (Right Wall X = 5.8) === */}
      <group position={[5.8, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh position={[0, blueHeight / 2, 0]} receiveShadow>
          <boxGeometry args={[11.4, blueHeight, 0.15]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} />
        </mesh>
        <mesh position={[0, blueHeight, 0.08]}>
          <boxGeometry args={[11.4, 0.04, 0.02]} />
          <meshStandardMaterial color="#b45309" roughness={0.4} />
        </mesh>
        <mesh position={[0, blueHeight + whiteHeight / 2, 0]} receiveShadow>
          <boxGeometry args={[11.4, whiteHeight, 0.15]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        <mesh position={[0, wallHeight - 0.1, 0.08]}>
          <boxGeometry args={[11.4, 0.2, 0.02]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
      </group>
    </group>
  );
}

/**
 * 📜 3. Trang trí tường hậu: Bảng xanh nẹp gỗ, Biểu trưng vàng, Tủ sách kính 2 bên
 */
function BackWallDecor() {
  return (
    <group position={[0, 0, -5.5]}>
      {/* 1. Bảng Báo Cáo Điều Hành Động (Dynamic Executive Dashboard) với biểu đồ & sóng Telemetry */}
      <DynamicReportBoard position={[0, 2.7, 0]} />

      {/* 2. Biểu trưng mặt trời / Huân chương vàng kim phía trên bảng (Golden Emblem) */}
      <group position={[0, 3.8, 0.02]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.32, 0.32, 0.03, 32]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Vành hoa văn hướng dương tỏa sáng */}
        <mesh position={[0, 0, 0.02]}>
          <ringGeometry args={[0.22, 0.3, 16]} />
          <meshStandardMaterial color="#d97706" metalness={0.8} />
        </mesh>
        {/* Biểu tượng trung tâm */}
        <mesh position={[0, 0, 0.022]}>
          <circleGeometry args={[0.18, 24]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
      </group>

      {/* 3. Bảng nội quy / Thông báo viền xanh bên phải bảng xanh */}
      <group position={[2.4, 2.9, 0]}>
        <mesh>
          <boxGeometry args={[0.75, 1.1, 0.02]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh position={[0, 0, 0.015]}>
          <planeGeometry args={[0.7, 1.05]} />
          <meshBasicMaterial color="#0284c7" />
        </mesh>
        {/* Các dòng chữ thông báo */}
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[0.62, 0.9]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* 4. Tủ sách đứng gỗ sồi mặt kính bên trái (Left Bookcase) */}
      <BookcaseCabinet position={[-4.0, 0, 0.35]} />

      {/* 5. Tủ sách đứng gỗ sồi mặt kính bên phải (Right Bookcase) */}
      <BookcaseCabinet position={[4.0, 0, 0.35]} />
    </group>
  );
}

/**
 * 📚 Tủ tài liệu đứng cao cấp gỗ sồi cánh kính (Executive Wooden Glass Bookcase)
 */
function BookcaseCabinet({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Khung tủ gỗ đứng */}
      <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 2.5, 0.46]} />
        <meshStandardMaterial color="#b45309" roughness={0.45} />
      </mesh>
      {/* Phần cánh kính trên trong suốt nhìn thấy các tập hồ sơ */}
      <mesh position={[0, 1.7, 0.235]}>
        <planeGeometry args={[1.05, 1.3]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.88}
          opacity={0.35}
          transparent
          roughness={0.1}
          ior={1.45}
        />
      </mesh>
      {/* Các ngăn đựng tài liệu bên trong tủ */}
      {[1.3, 1.7, 2.1].map((y, idx) => (
        <group key={idx} position={[0, y, 0.05]}>
          <mesh>
            <boxGeometry args={[1.05, 0.03, 0.38]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          {/* Các gáy bìa hồ sơ tài liệu nhiều màu */}
          {[-0.35, -0.15, 0.05, 0.25].map((x, j) => (
            <mesh key={j} position={[x, 0.14, 0]}>
              <boxGeometry args={[0.14, 0.25, 0.3]} />
              <meshStandardMaterial
                color={j % 3 === 0 ? '#0284c7' : j % 3 === 1 ? '#15803d' : '#f59e0b'}
              />
            </mesh>
          ))}
        </group>
      ))}
      {/* Phần cánh gỗ dưới */}
      <mesh position={[0, 0.55, 0.235]}>
        <boxGeometry args={[1.05, 0.9, 0.02]} />
        <meshStandardMaterial color="#9a3412" roughness={0.4} />
      </mesh>
      {/* Tay nắm kim loại mạ vàng */}
      {[-0.05, 0.05].map((x, i) => (
        <mesh key={i} position={[x, 1.1, 0.25]}>
          <cylinderGeometry args={[0.01, 0.01, 0.12, 8]} />
          <meshStandardMaterial color="#fef08a" metalness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * 🪟 4. Cửa sổ kính lớn lấy sáng bên trái & Cửa ra vào bên phải
 */
function HotGirlPortrait() {
  const texture = useTexture('/images/hot_girl.jpg');
  return (
    <mesh position={[0, 0, -0.012]}>
      <planeGeometry args={[2.22, 2.02]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

function WindowWithMuse() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <group
      position={[-5.72, 3.2, -2.2]}
      rotation={[0, Math.PI / 2, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setIsHovered(true);
      }}
      onPointerOut={() => setIsHovered(false)}
    >
      {/* Khung cửa sổ trắng */}
      <mesh castShadow>
        <boxGeometry args={[2.4, 2.2, 0.06]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>

      {/* Ảnh Hot Girl xinh đẹp rạng rỡ đón nắng bên cửa sổ */}
      <Suspense fallback={null}>
        <HotGirlPortrait />
      </Suspense>

      {/* Kính trong suốt đón nắng ngập tràn bảo vệ */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[2.2, 2.0]} />
        <meshPhysicalMaterial
          color="#e0f2fe"
          transmission={0.82}
          opacity={0.25}
          transparent
          roughness={0.06}
        />
      </mesh>

      {/* Nan chia ô cửa kính */}
      {[-0.55, 0, 0.55].map((x, i) => (
        <mesh key={i} position={[x, 0, 0.02]}>
          <boxGeometry args={[0.03, 2.0, 0.02]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}
      {[-0.5, 0, 0.5].map((y, i) => (
        <mesh key={i} position={[0, y, 0.02]}>
          <boxGeometry args={[2.2, 0.03, 0.02]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}

      {/* Tooltip khi rê chuột vào Nàng thơ bên cửa sổ */}
      {isHovered && (
        <Html
          position={[0, 1.3, 0.1]}
          center
          distanceFactor={16}
          style={{ pointerEvents: 'none' }}
        >
          <div
            style={{
              padding: '5px 12px',
              borderRadius: '14px',
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              border: '1.5px solid #f472b6',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 20px rgba(244, 114, 182, 0.45)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>🌸</span>
            <span>Nàng Thơ Văn Phòng (Office Muse) • Luôn Tươi Cười Truyền Cảm Hứng!</span>
          </div>
        </Html>
      )}
    </group>
  );
}

function WindowsAndDoors() {
  return (
    <group>
      {/* Cửa sổ 1: Tích hợp hình ảnh Nàng thơ xinh đẹp đón nắng rực rỡ */}
      <WindowWithMuse />

      {/* Cửa sổ 2: Kính trong suốt đón nắng ban mai ngập tràn */}
      <group position={[-5.72, 3.2, 2.5]} rotation={[0, Math.PI / 2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[2.4, 2.2, 0.06]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[2.2, 2.0]} />
          <meshPhysicalMaterial
            color="#e0f2fe"
            transmission={0.92}
            opacity={0.3}
            transparent
            roughness={0.05}
          />
        </mesh>
        {[-0.55, 0, 0.55].map((x, i) => (
          <mesh key={i} position={[x, 0, 0.02]}>
            <boxGeometry args={[0.03, 2.0, 0.02]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        ))}
        {[-0.5, 0, 0.5].map((y, i) => (
          <mesh key={i} position={[0, y, 0.02]}>
            <boxGeometry args={[2.2, 0.03, 0.02]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>

      {/* Bảng sơ đồ tổ chức treo tường bên trái */}
      <group position={[-5.72, 2.2, 0.2]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <boxGeometry args={[1.4, 1.8, 0.03]} />
          <meshStandardMaterial color="#b45309" />
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[1.3, 1.7]} />
          <meshBasicMaterial color="#0284c7" />
        </mesh>
        <mesh position={[0, 0, 0.025]}>
          <planeGeometry args={[1.2, 1.58]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Cửa ra vào màu trắng bên tường phải (Right Door) */}
      <group position={[5.72, 1.5, -3.2]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Khung bao cửa trắng */}
        <mesh>
          <boxGeometry args={[1.3, 2.8, 0.06]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </mesh>
        {/* Cánh cửa gỗ sơn trắng */}
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[1.15, 2.65]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
        </mesh>
        {/* Tay nắm khóa inox */}
        <mesh position={[0.42, -0.1, 0.05]}>
          <cylinderGeometry args={[0.015, 0.015, 0.12, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
        </mesh>
      </group>

      {/* Bảng thông báo treo tường bên phải */}
      <group position={[5.72, 2.4, 1.6]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh>
          <boxGeometry args={[1.4, 1.8, 0.03]} />
          <meshStandardMaterial color="#b45309" />
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[1.3, 1.7]} />
          <meshBasicMaterial color="#0284c7" />
        </mesh>
        <mesh position={[0, 0, 0.025]}>
          <planeGeometry args={[1.2, 1.58]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
    </group>
  );
}

/**
 * 👑 5. Bàn Giám đốc điều hành & Ghế da đen (Director Executive Desk Area)
 * Tọa độ bàn: [0, 0, -3.4]
 */
function DirectorDeskArea() {
  return (
    <group position={[0, 0, -3.4]}>
      {/* Mặt bàn Giám đốc gỗ sồi ấm áp */}
      <mesh position={[0, 0.74, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.3, 0.06, 1.05]} />
        <meshStandardMaterial color="#d97706" roughness={0.35} />
      </mesh>

      {/* Tấm yếm che chân phía trước bàn (Modesty Panel) */}
      <mesh position={[0, 0.38, -0.46]} castShadow>
        <boxGeometry args={[2.1, 0.68, 0.04]} />
        <meshStandardMaterial color="#c2410c" roughness={0.4} />
      </mesh>

      {/* 2 Khối hộc tủ ngăn kéo bên trái và bên phải chân bàn */}
      {[-0.85, 0.85].map((x, i) => (
        <group key={i} position={[x, 0.35, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.48, 0.7, 0.95]} />
            <meshStandardMaterial color="#b45309" roughness={0.4} />
          </mesh>
          {/* Tay nắm ngăn kéo mạ vàng */}
          {[-0.15, 0.1, 0.25].map((y, j) => (
            <mesh key={j} position={[0, y, 0.49]}>
              <boxGeometry args={[0.16, 0.02, 0.02]} />
              <meshStandardMaterial color="#fef08a" metalness={0.9} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Thảm da bàn làm việc màu đen (Desk Pad) */}
      <mesh position={[0, 0.772, 0.08]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[0.75, 0.48]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} />
      </mesh>

      {/* Hồ sơ tài liệu trắng & Laptop mỏng trên bàn */}
      <mesh position={[-0.45, 0.78, 0.1]}>
        <boxGeometry args={[0.26, 0.02, 0.34]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <mesh position={[0.48, 0.78, 0.05]}>
        <boxGeometry args={[0.34, 0.02, 0.24]} />
        <meshStandardMaterial color="#334155" metalness={0.8} />
      </mesh>

      {/* 💺 Ghế Giám đốc bọc da đen cao cấp (High-Back Executive Chair) phía sau bàn Z = -0.7 */}
      <group position={[0, 0, -0.75]}>
        {/* Đệm ngồi da đen */}
        <mesh position={[0, 0.46, 0]} castShadow>
          <boxGeometry args={[0.58, 0.1, 0.54]} />
          <meshStandardMaterial color="#090d16" roughness={0.3} />
        </mesh>
        {/* Tựa lưng da cao có tựa đầu */}
        <mesh position={[0, 0.88, -0.24]} castShadow>
          <boxGeometry args={[0.54, 0.78, 0.1]} />
          <meshStandardMaterial color="#090d16" roughness={0.3} />
        </mesh>
        {/* 2 Tay vịn da êm ái */}
        {[-0.32, 0.32].map((x, idx) => (
          <mesh key={idx} position={[x, 0.62, 0]} castShadow>
            <boxGeometry args={[0.08, 0.04, 0.38]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} />
          </mesh>
        ))}
        {/* Trụ thủy lực nâng ghế & Chân sao 5 cánh */}
        <mesh position={[0, 0.23, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.36, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} />
        </mesh>
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.03, 5]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </group>
    </group>
  );
}

/**
 * 🤝 6. Bàn hội nghị họp nhóm trung tâm & 8 Ghế xoay da chân sao (Conference Hub)
 * Tọa độ bàn: [0, 0, 0.8]
 */
function ConferenceTableArea() {
  return (
    <group position={[0, 0, 0.8]}>
      {/* Mặt bàn hội nghị gỗ sồi ấm áp vát cạnh */}
      <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.55, 0.06, 3.6]} />
        <meshStandardMaterial color="#d97706" roughness={0.35} />
      </mesh>

      {/* Hộp nắp nhôm luồn dây điện thoại & máy tính trung tâm mặt bàn */}
      <mesh position={[0, 0.752, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.18, 0.75]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* 2 Chân bàn tấm lớn gỗ sồi chịu lực vững chãi */}
      {[-1.2, 1.2].map((z, i) => (
        <mesh key={i} position={[0, 0.35, z]} castShadow>
          <boxGeometry args={[1.2, 0.68, 0.12]} />
          <meshStandardMaterial color="#9a3412" roughness={0.4} />
        </mesh>
      ))}
      {/* Thanh giằng ngang chịu lực dưới gầm bàn */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.1, 0.08, 2.5]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>

      {/* 💻 Thiết bị công nghệ đặt sẵn trên mặt bàn hội nghị trước các vị trí ghế ngồi */}
      {[-1.0, 0, 1.0].map((z, idx) => (
        <group key={`props-${idx}`}>
          {/* Laptop bên trái quay màn hình hướng về ghế trái (-X) */}
          <group position={[-0.48, 0.752, z]} rotation={[0, Math.PI / 2, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.3, 0.012, 0.22]} />
              <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
            </mesh>
            <group position={[0, 0.006, -0.1]} rotation={[-1.2, 0, 0]}>
              <mesh castShadow>
                <boxGeometry args={[0.3, 0.22, 0.008]} />
                <meshStandardMaterial color="#1e293b" metalness={0.9} />
              </mesh>
              <mesh position={[0, 0, 0.005]}>
                <planeGeometry args={[0.28, 0.2]} />
                <meshBasicMaterial color="#0284c7" />
              </mesh>
            </group>
          </group>

          {/* Sổ tay ghi chép bên trái */}
          <mesh position={[-0.48, 0.754, z + 0.22]} rotation={[0, 0.1, 0]}>
            <boxGeometry args={[0.16, 0.01, 0.12]} />
            <meshStandardMaterial color="#78350f" roughness={0.6} />
          </mesh>

          {/* Ly nước gốm sứ bên trái */}
          <mesh position={[-0.48, 0.78, z - 0.22]} castShadow>
            <cylinderGeometry args={[0.03, 0.025, 0.06, 16]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.2} />
          </mesh>

          {/* Laptop bên phải quay màn hình hướng về ghế phải (+X) */}
          <group position={[0.48, 0.752, z]} rotation={[0, -Math.PI / 2, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.3, 0.012, 0.22]} />
              <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
            </mesh>
            <group position={[0, 0.006, -0.1]} rotation={[-1.2, 0, 0]}>
              <mesh castShadow>
                <boxGeometry args={[0.3, 0.22, 0.008]} />
                <meshStandardMaterial color="#1e293b" metalness={0.9} />
              </mesh>
              <mesh position={[0, 0, 0.005]}>
                <planeGeometry args={[0.28, 0.2]} />
                <meshBasicMaterial color="#10b981" />
              </mesh>
            </group>
          </group>

          {/* Sổ tay ghi chép bên phải */}
          <mesh position={[0.48, 0.754, z + 0.22]} rotation={[0, -0.1, 0]}>
            <boxGeometry args={[0.16, 0.01, 0.12]} />
            <meshStandardMaterial color="#1e293b" roughness={0.6} />
          </mesh>

          {/* Ly nước gốm sứ bên phải */}
          <mesh position={[0.48, 0.78, z - 0.22]} castShadow>
            <cylinderGeometry args={[0.03, 0.025, 0.06, 16]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* 💺 8 GHẾ XOAY DA ĐEN CHÂN SAO BỐ TRÍ CHUẨN XÁC QUANH BÀN HỘP */}
      {/* Ghế đầu bàn phía trên (quay nhìn xuống +Z) */}
      <ConferenceChair position={[0, 0, -2.1]} rotation={0} />

      {/* 3 Ghế bên trái bàn (X = -1.15, quay nhìn vào bàn +X) */}
      <ConferenceChair position={[-1.15, 0, -1.0]} rotation={Math.PI / 2} />
      <ConferenceChair position={[-1.15, 0, 0]} rotation={Math.PI / 2} />
      <ConferenceChair position={[-1.15, 0, 1.0]} rotation={Math.PI / 2} />

      {/* 3 Ghế bên phải bàn (X = 1.15, quay nhìn vào bàn -X) */}
      <ConferenceChair position={[1.15, 0, -1.0]} rotation={-Math.PI / 2} />
      <ConferenceChair position={[1.15, 0, 0]} rotation={-Math.PI / 2} />
      <ConferenceChair position={[1.15, 0, 1.0]} rotation={-Math.PI / 2} />

      {/* Ghế cuối bàn phía dưới (quay nhìn lên -Z) */}
      <ConferenceChair position={[0, 0, 2.1]} rotation={Math.PI} />
    </group>
  );
}

/**
 * 🪑 Ghế xoay hội nghị chân sao mạ chrome chuẩn đẹp (Executive Conference Chair)
 */
function ConferenceChair({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Đệm ngồi da đen tại Y = 0.44 */}
      <mesh position={[0, 0.44, 0]} castShadow>
        <boxGeometry args={[0.48, 0.07, 0.46]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} />
      </mesh>
      {/* Tựa lưng da đen có bo viền */}
      <mesh position={[0, 0.74, -0.2]} castShadow>
        <boxGeometry args={[0.45, 0.54, 0.06]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} />
      </mesh>
      {/* Đôi tay vịn thép mạ chrome */}
      {[-0.26, 0.26].map((x, idx) => (
        <group key={idx} position={[x, 0.54, 0]}>
          <mesh>
            <cylinderGeometry args={[0.012, 0.012, 0.16, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.08, 0]}>
            <boxGeometry args={[0.04, 0.02, 0.28]} />
            <meshStandardMaterial color="#020617" />
          </mesh>
        </group>
      ))}
      {/* Trụ thủy lực nâng mạ chrome */}
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.028, 0.028, 0.36, 12]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.1} />
      </mesh>
      {/* Chân sao 5 cánh có bánh xe con lăn */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.025, 5]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} />
      </mesh>
    </group>
  );
}

/**
 * 🛋️ 7. Khu vực Sofa tiếp khách VIP bọc da kem taupe & Bàn trà hai bên phòng
 */
function SideLounges() {
  return (
    <group>
      {/* === KHU SOFA VIP BÊN TRÁI (Left VIP Lounge X = -4.2) === */}
      <group position={[-4.2, 0, 0.6]}>
        {/* Ghế Sofa băng dài 3 chỗ bọc đệm da kem Taupe sang trọng */}
        <group position={[-0.4, 0, 0]}>
          {/* Đệm ngồi màu kem Taupe ấm áp */}
          <mesh position={[0, 0.24, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.85, 0.32, 2.3]} />
            <meshStandardMaterial color="#d4b896" roughness={0.6} />
          </mesh>
          {/* Tựa lưng màu kem Taupe */}
          <mesh position={[-0.35, 0.56, 0]} castShadow>
            <boxGeometry args={[0.18, 0.48, 2.3]} />
            <meshStandardMaterial color="#c5a882" roughness={0.6} />
          </mesh>
          {/* 2 Tay vịn ốp gỗ sồi ấm áp */}
          {[-1.18, 1.18].map((z, i) => (
            <mesh key={i} position={[-0.05, 0.42, z]} castShadow>
              <boxGeometry args={[0.85, 0.42, 0.12]} />
              <meshStandardMaterial color="#b45309" roughness={0.4} />
            </mesh>
          ))}
        </group>

        {/* Bàn trà gỗ sồi hình chữ nhật đặt phía trước sofa */}
        <group position={[0.6, 0, 0]}>
          <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.55, 0.04, 1.4]} />
            <meshStandardMaterial color="#d97706" roughness={0.35} />
          </mesh>
          {/* 4 Chân bàn gỗ */}
          {[
            [-0.22, 0.17, -0.6],
            [0.22, 0.17, -0.6],
            [-0.22, 0.17, 0.6],
            [0.22, 0.17, 0.6]
          ].map(([x, y, z], i) => (
            <mesh key={i} position={[x, y, z]} castShadow>
              <boxGeometry args={[0.04, 0.34, 0.04]} />
              <meshStandardMaterial color="#b45309" />
            </mesh>
          ))}
        </group>
      </group>

      {/* === KHU SOFA VIP BÊN PHẢI (Right VIP Lounge X = 4.2) === */}
      <group position={[4.2, 0, 0.6]}>
        {/* Bộ ghế bành rời / Sofa ghép màu kem Taupe */}
        <group position={[0.4, 0, 0]}>
          {/* Ghế bành 1 */}
          <group position={[0, 0, -0.65]}>
            <mesh position={[0, 0.24, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.85, 0.32, 0.95]} />
              <meshStandardMaterial color="#d4b896" roughness={0.6} />
            </mesh>
            <mesh position={[0.35, 0.56, 0]} castShadow>
              <boxGeometry args={[0.18, 0.48, 0.95]} />
              <meshStandardMaterial color="#c5a882" roughness={0.6} />
            </mesh>
            {[-0.5, 0.5].map((z, i) => (
              <mesh key={i} position={[0.05, 0.42, z]} castShadow>
                <boxGeometry args={[0.85, 0.42, 0.1]} />
                <meshStandardMaterial color="#b45309" roughness={0.4} />
              </mesh>
            ))}
          </group>

          {/* Ghế bành 2 */}
          <group position={[0, 0, 0.65]}>
            <mesh position={[0, 0.24, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.85, 0.32, 0.95]} />
              <meshStandardMaterial color="#d4b896" roughness={0.6} />
            </mesh>
            <mesh position={[0.35, 0.56, 0]} castShadow>
              <boxGeometry args={[0.18, 0.48, 0.95]} />
              <meshStandardMaterial color="#c5a882" roughness={0.6} />
            </mesh>
            {[-0.5, 0.5].map((z, i) => (
              <mesh key={i} position={[0.05, 0.42, z]} castShadow>
                <boxGeometry args={[0.85, 0.42, 0.1]} />
                <meshStandardMaterial color="#b45309" roughness={0.4} />
              </mesh>
            ))}
          </group>
        </group>

        {/* Bàn trà gỗ sồi hình chữ nhật đặt phía trước sofa */}
        <group position={[-0.6, 0, 0]}>
          <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.55, 0.04, 1.4]} />
            <meshStandardMaterial color="#d97706" roughness={0.35} />
          </mesh>
          {[
            [-0.22, 0.17, -0.6],
            [0.22, 0.17, -0.6],
            [-0.22, 0.17, 0.6],
            [0.22, 0.17, 0.6]
          ].map(([x, y, z], i) => (
            <mesh key={i} position={[x, y, z]} castShadow>
              <boxGeometry args={[0.04, 0.34, 0.04]} />
              <meshStandardMaterial color="#b45309" />
            </mesh>
          ))}
          {/* Tách trà & Đĩa sứ trên bàn trà */}
          <mesh position={[0, 0.38, 0.2]}>
            <cylinderGeometry args={[0.035, 0.03, 0.05, 12]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/**
 * 🌿 8. Cây xanh cảnh quan văn phòng trong chậu gốm sứ trắng thanh lịch
 */
function OfficePlants() {
  return (
    <group>
      {/* Chậu cây góc tường hậu bên phải (giống hệt trong ảnh) */}
      <group position={[4.6, 0, -4.8]}>
        <mesh position={[0, 0.25, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.18, 0.5, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.04, 16]} />
          <meshStandardMaterial color="#27180e" />
        </mesh>
        {/* Tán lá xanh bóng nhiều tầng */}
        <mesh position={[0, 0.8, 0]} castShadow>
          <dodecahedronGeometry args={[0.28, 1]} />
          <meshStandardMaterial color="#15803d" roughness={0.5} />
        </mesh>
        <mesh position={[0.05, 1.05, -0.05]} castShadow>
          <dodecahedronGeometry args={[0.22, 1]} />
          <meshStandardMaterial color="#22c55e" roughness={0.5} />
        </mesh>
      </group>

      {/* Chậu cây nhỏ cạnh sofa bên trái */}
      <group position={[-5.1, 0, -1.2]}>
        <mesh position={[0, 0.18, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.14, 0.36, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.55, 0]} castShadow>
          <dodecahedronGeometry args={[0.22, 1]} />
          <meshStandardMaterial color="#16a34a" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}
