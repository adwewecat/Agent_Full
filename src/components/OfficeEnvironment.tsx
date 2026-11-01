/**
 * @file OfficeEnvironment.tsx
 * @description Môi trường văn phòng điều hành AI cao cấp (High-Tech Executive AI Command Center)
 * theo phong cách tham chiếu hiện đại và chân thực (NOVUS AI & Isometric Penthouse Suite).
 * Bao gồm:
 * 1. Sàn bê tông kiến trúc mài bóng (Polished Architectural Terrazzo Floor) với viền chỉ LED.
 * 2. Vách kính toàn cảnh Panorama kịch trần nhìn ra đường chân trời thành phố hoàng hôn (City Skyline 3D).
 * 3. Màn hình Hologram cong siêu lớn treo trần hiển thị biểu đồ tăng trưởng và viễn cảnh kinh doanh (Overhead Curved Metrics Screen).
 * 4. Bàn tương tác Hologram AI trung tâm (Central Interactive Hologram Table) với địa cầu wireframe xoay 3D và các nút dữ liệu lơ lửng.
 * 5. Hệ thống dầm trần công nghiệp và đèn LED thả tuyến tính hiện đại.
 * 6. Cây xanh văn phòng cao cấp (Fiddle Leaf Fig & Snake Plants) trong chậu gốm sứ trắng tinh tế.
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function OfficeEnvironment() {
  return (
    <group>
      {/* 1. Sàn bê tông kiến trúc mài bóng cao cấp & Thảm điều hành trung tâm */}
      <ExecutiveFloor />

      {/* 2. Vách kính Panorama kịch trần & Đường chân trời thành phố 3D */}
      <CitySkylineView />

      {/* 3. Màn hình Hologram cong siêu lớn treo trần (Overhead Curved Metrics Display) */}
      <OverheadCurvedDisplay />

      {/* 4. Bàn tương tác Hologram AI Core trung tâm (The Heart of Command Center) */}
      <CentralHologramTable />

      {/* 5. Cây xanh cảnh quan văn phòng hiện đại (Indoor Executive Plants) */}
      <ExecutivePlant position={[-6.8, 0, -5.2]} scale={1.1} />
      <ExecutivePlant position={[6.8, 0, -5.2]} scale={1.1} />
      <ExecutivePlant position={[-6.8, 0, 5.0]} scale={1.0} />
      <ExecutivePlant position={[6.8, 0, 5.0]} scale={1.0} />

      {/* Cụm chậu cây lưỡi hổ dài hiện đại dọc theo chân vách kính */}
      <SnakePlanter position={[2.5, 0, -6.6]} width={3.2} />
      <SnakePlanter position={[-4.5, 0, -6.6]} width={2.2} />
    </group>
  );
}

/**
 * 🏢 1. Sàn bê tông mài bóng cao cấp với phân khu điều hành trung tâm
 */
function ExecutiveFloor() {
  return (
    <group>
      {/* Sàn chính: Bê tông kiến trúc xám sáng sang trọng với độ phản chiếu nhẹ */}
      <mesh position={[0, -0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 16]} />
        <meshStandardMaterial
          color="#cbd5e1"
          roughness={0.25}
          metalness={0.12}
        />
      </mesh>

      {/* Khu vực thảm sàn trung tâm màu xám than sang trọng bên dưới bàn Hologram */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[7.2, 5.6]} />
        <meshStandardMaterial color="#0f172a" roughness={0.85} metalness={0.1} />
      </mesh>

      {/* Dải LED phát sáng màu xanh Cyan định vị khu vực điều hành trung tâm */}
      <mesh position={[0, 0.008, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.45, 3.5, 4]} />
        <meshBasicMaterial color="#06b6d4" />
      </mesh>
      <mesh position={[0, 0.009, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.7, 1.74, 32]} />
        <meshBasicMaterial color="#0284c7" />
      </mesh>
    </group>
  );
}

/**
 * 🌆 2. Vách kính Panorama kịch trần nhìn ra đường chân trời thành phố (Skyline)
 * Bao gồm các tòa cao ốc 3D với hàng trăm ô cửa sổ phát sáng, ánh hoàng hôn và xe bay tương lai
 */
function CitySkylineView() {
  const flyingCarsRef = useRef<THREE.Group>(null);

  // Sinh ngẫu nhiên dữ liệu các tòa nhà chọc trời ngoài cửa sổ
  const buildings = useMemo(() => {
    const list = [];
    const count = 18;
    for (let i = 0; i < count; i++) {
      const angle = (i / (count - 1)) * (Math.PI * 0.7) - Math.PI * 0.35;
      const dist = 14 + (i % 3) * 2.2;
      const x = Math.sin(angle) * dist + (i % 2 === 0 ? 1 : -1) * 1.5;
      const z = -Math.cos(angle) * dist - 3;
      const width = 1.4 + (i % 4) * 0.4;
      const depth = 1.4 + (i % 3) * 0.4;
      const height = 7 + (i % 7) * 2.4;
      list.push({ id: i, x, z, width, depth, height });
    }
    return list;
  }, []);

  // Di chuyển các vệt sáng xe bay tương lai (Flying Aircabs) ngoài bầu trời
  useFrame((state) => {
    if (flyingCarsRef.current) {
      const t = state.clock.getElapsedTime();
      flyingCarsRef.current.children.forEach((child, idx) => {
        const speed = 1.2 + idx * 0.4;
        child.position.x = ((t * speed + idx * 8) % 36) - 18;
      });
    }
  });

  return (
    <group>
      {/* Khung vách kính kịch trần phía sau */}
      <group position={[0, 2.5, -7.1]}>
        {/* Tấm kính cường lực trong suốt phản quang nhẹ */}
        <mesh>
          <planeGeometry args={[17, 5.0]} />
          <meshPhysicalMaterial
            color="#38bdf8"
            transmission={0.88}
            opacity={0.35}
            transparent
            roughness={0.05}
            ior={1.5}
            reflectivity={0.9}
          />
        </mesh>
        {/* Các cột đố kính kim loại màu xám titan (Mullions) */}
        {[-8.0, -5.3, -2.6, 0, 2.6, 5.3, 8.0].map((x, idx) => (
          <mesh key={idx} position={[x, 0, 0.02]}>
            <boxGeometry args={[0.08, 5.0, 0.12]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}
        {/* Thanh ngang đố kính */}
        {[-1.2, 1.2].map((y, idx) => (
          <mesh key={idx} position={[0, y, 0.02]}>
            <boxGeometry args={[17, 0.08, 0.1]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Vách kính phía bên trái */}
      <group position={[-8.1, 2.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <planeGeometry args={[15, 5.0]} />
          <meshPhysicalMaterial
            color="#38bdf8"
            transmission={0.88}
            opacity={0.35}
            transparent
            roughness={0.05}
            ior={1.5}
          />
        </mesh>
        {[-6.0, -3.0, 0, 3.0, 6.0].map((x, idx) => (
          <mesh key={idx} position={[x, 0, 0.02]}>
            <boxGeometry args={[0.08, 5.0, 0.12]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Bầu trời hoàng hôn chuyển sắc tím indigo ấm áp */}
      <mesh position={[0, 8, -26]} rotation={[0, 0, 0]}>
        <planeGeometry args={[65, 28]} />
        <meshBasicMaterial color="#1e1b4b" />
      </mesh>
      {/* Vầng sáng hoàng hôn ấm áp dưới đường chân trời */}
      <mesh position={[0, 4, -25.8]}>
        <planeGeometry args={[65, 14]} />
        <meshBasicMaterial color="#7c2d12" transparent opacity={0.65} />
      </mesh>
      <mesh position={[0, 2, -25.6]}>
        <planeGeometry args={[65, 8]} />
        <meshBasicMaterial color="#ea580c" transparent opacity={0.45} />
      </mesh>

      {/* 🏙️ Quần thể các tòa nhà chọc trời ngoài cửa sổ */}
      {buildings.map((b) => (
        <group key={b.id} position={[b.x, b.height / 2 - 1, b.z]}>
          {/* Khối tháp cao ốc bê tông & kính */}
          <mesh>
            <boxGeometry args={[b.width, b.height, b.depth]} />
            <meshStandardMaterial color="#090d16" roughness={0.4} metalness={0.6} />
          </mesh>
          {/* Lưới ô cửa sổ văn phòng phát sáng lung linh */}
          <mesh position={[0, 0, b.depth / 2 + 0.02]}>
            <planeGeometry args={[b.width * 0.85, b.height * 0.9]} />
            <meshBasicMaterial
              color={b.id % 3 === 0 ? '#fef08a' : b.id % 2 === 0 ? '#38bdf8' : '#fb923c'}
              wireframe
              transparent
              opacity={0.35}
            />
          </mesh>
          {/* Cột ăng-ten đỉnh tòa nhà có đèn hiệu đỏ nhấp nháy an toàn hàng không */}
          <mesh position={[0, b.height / 2 + 0.6, 0]}>
            <cylinderGeometry args={[0.02, 0.04, 1.2, 6]} />
            <meshStandardMaterial color="#475569" metalness={0.9} />
          </mesh>
          <mesh position={[0, b.height / 2 + 1.2, 0]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
        </group>
      ))}

      {/* 🚀 Các vệt sáng xe bay tương lai (Aircabs) lướt qua đường chân trời */}
      <group ref={flyingCarsRef} position={[0, 4.5, -15]}>
        {[-3, 0, 2.5].map((y, idx) => (
          <group key={idx} position={[0, y, (idx - 1) * 2]}>
            <mesh>
              <boxGeometry args={[0.6, 0.12, 0.25]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
            {/* Vệt đuôi đèn xe bay */}
            <mesh position={[-0.45, 0, 0]}>
              <boxGeometry args={[0.6, 0.05, 0.15]} />
              <meshBasicMaterial color="#06b6d4" transparent opacity={0.6} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

/**
 * 📊 3. Màn hình Hologram cong siêu lớn treo trần (Overhead Curved Metrics Screen)
 * Mô phỏng chính xác màn hình cong khổng lồ trong ảnh tham chiếu NOVUS AI:
 * "BUSINESS METRICS & SCALING VISION", biểu đồ cột Revenue +48%, Funding +55%, Q4 Growth +66%
 */
function OverheadCurvedDisplay() {
  const meshRef = useRef<THREE.Group>(null);

  // Hiệu ứng nhịp đập dữ liệu viễn thông nhẹ nhàng
  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      meshRef.current.position.y = 3.65 + Math.sin(t * 1.5) * 0.02;
    }
  });

  return (
    <group ref={meshRef} position={[-2.8, 3.65, -4.6]} rotation={[0.15, 0.32, 0]}>
      {/* 2 Cáp treo thép từ trần */}
      <mesh position={[-2.2, 0.65, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 1.3, 6]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} />
      </mesh>
      <mesh position={[2.2, 0.65, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 1.3, 6]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} />
      </mesh>

      {/* Khung viền màn hình kim loại mỏng */}
      <mesh castShadow>
        <boxGeometry args={[5.2, 1.8, 0.08]} />
        <meshStandardMaterial color="#020617" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Mặt hiển thị OLED cong công nghệ cao phát sáng */}
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[5.0, 1.65]} />
        <meshStandardMaterial
          color="#030712"
          emissive="#082f49"
          emissiveIntensity={0.5}
          roughness={0.1}
        />
      </mesh>

      {/* Thanh tiêu đề màn hình: NOVUS AI • BUSINESS METRICS & SCALING VISION */}
      <group position={[0, 0.65, 0.052]}>
        <mesh position={[-1.4, 0, 0]}>
          <planeGeometry args={[1.6, 0.14]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[0.8, 0, 0]}>
          <planeGeometry args={[2.8, 0.08]} />
          <meshBasicMaterial color="#94a3b8" />
        </mesh>
      </group>

      {/* Biểu đồ cột doanh thu REVENUE (Cột tăng trưởng đa sắc cầu vồng như ảnh tham chiếu) */}
      <group position={[-1.5, -0.05, 0.052]}>
        {/* Nền lưới biểu đồ */}
        <mesh position={[0, 0, -0.002]}>
          <planeGeometry args={[1.7, 0.9]} />
          <meshBasicMaterial color="#0f172a" transparent opacity={0.6} />
        </mesh>
        {/* 6 Cột tăng trưởng với gradient màu: Xanh tím -> Hồng -> Cam -> Xanh lá */}
        {[
          { h: 0.28, color: '#6366f1' },
          { h: 0.38, color: '#8b5cf6' },
          { h: 0.48, color: '#ec4899' },
          { h: 0.60, color: '#f43f5e' },
          { h: 0.72, color: '#f97316' },
          { h: 0.82, color: '#10b981' }
        ].map((bar, i) => (
          <mesh key={i} position={[-0.65 + i * 0.26, -0.42 + bar.h / 2, 0]}>
            <planeGeometry args={[0.18, bar.h]} />
            <meshBasicMaterial color={bar.color} />
          </mesh>
        ))}
      </group>

      {/* Biểu đồ tròn Donut Chart (KPi & Funding Allocation) */}
      <group position={[0.4, 0.05, 0.052]}>
        <mesh rotation={[0, 0, 0]}>
          <ringGeometry args={[0.22, 0.36, 32, 1, 0, Math.PI * 1.3]} />
          <meshBasicMaterial color="#06b6d4" />
        </mesh>
        <mesh rotation={[0, 0, Math.PI * 1.3]}>
          <ringGeometry args={[0.22, 0.36, 32, 1, 0, Math.PI * 0.45]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
        <mesh rotation={[0, 0, Math.PI * 1.75]}>
          <ringGeometry args={[0.22, 0.36, 32, 1, 0, Math.PI * 0.25]} />
          <meshBasicMaterial color="#ec4899" />
        </mesh>
      </group>

      {/* Biểu đồ đường dao động thời gian thực (Real-time Line Curve) */}
      <group position={[1.7, -0.15, 0.052]}>
        <mesh position={[0, 0, -0.002]}>
          <planeGeometry args={[1.2, 0.6]} />
          <meshBasicMaterial color="#0f172a" transparent opacity={0.6} />
        </mesh>
        {/* Đường cong tín hiệu viễn thông */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[1.1, 0.45]} />
          <meshBasicMaterial color="#34d399" wireframe />
        </mesh>
      </group>

      {/* Nguồn sáng xanh Cyberpunk hắt nhẹ từ màn hình */}
      <pointLight position={[0, 0, 0.4]} color="#38bdf8" intensity={0.8} distance={3.5} />
    </group>
  );
}

/**
 * 🌐 4. Bàn tương tác Hologram AI Core trung tâm (Central Interactive Hologram Table)
 * Trung tâm điều phối của văn phòng chỉ huy theo đúng ảnh tham chiếu NOVUS AI:
 * - Bàn pedestal kính đen sang trọng với chân đế kim loại vát cạnh.
 * - Quả địa cầu AI 3D phát sáng rực rỡ xoay tròn liên tục.
 * - Vòng radar dữ liệu đồng tâm xoay ngược chiều.
 * - 6 Thẻ icon dữ liệu Hologram lơ lửng xung quanh (Growth, Data, Revenue, Operations, Innovation, Security).
 */
function CentralHologramTable() {
  const globeRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Group>(null);
  const dataNodesRef = useRef<THREE.Group>(null);

  // Hiệu ứng hoạt họa xoay quả cầu và các vòng dữ liệu đồng tâm
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (globeRef.current) {
      globeRef.current.rotation.y = t * 0.45;
      globeRef.current.rotation.x = Math.sin(t * 0.3) * 0.15;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = -t * 0.3;
    }
    if (dataNodesRef.current) {
      dataNodesRef.current.children.forEach((node, idx) => {
        const offset = (idx * Math.PI) / 3;
        node.position.y = 1.35 + Math.sin(t * 2 + offset) * 0.04;
      });
    }
  });

  return (
    <group position={[0, 0, 0.1]}>
      {/* Chân đế bàn kim loại đen mờ vát cạnh hiện đại */}
      <mesh position={[0, 0.08, 0]} castShadow>
        <boxGeometry args={[1.5, 0.16, 1.1]} />
        <meshStandardMaterial color="#020617" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Trụ nâng trung tâm hình thoi */}
      <mesh position={[0, 0.42, 0]} castShadow>
        <boxGeometry args={[0.55, 0.52, 0.45]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Mặt bàn kính cường lực đen mờ hiển thị giao diện cảm ứng */}
      <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.6, 0.06, 1.8]} />
        <meshStandardMaterial
          color="#020617"
          roughness={0.15}
          metalness={0.85}
        />
      </mesh>

      {/* Viền LED neon xanh Cyan bọc quanh mép bàn */}
      <mesh position={[0, 0.752, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.18, 1.22, 4]} />
        <meshBasicMaterial color="#06b6d4" />
      </mesh>

      {/* Vòng tròn giao diện cảm ứng trung tâm trên mặt bàn */}
      <mesh position={[0, 0.753, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.62, 32]} />
        <meshBasicMaterial color="#082f49" transparent opacity={0.65} />
      </mesh>
      <mesh position={[0, 0.755, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.58, 0.6, 32]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>

      {/* 🌐 QUẢ ĐỊA CẦU AI HOLOGRAPHIC PHÁT SÁNG XOAY TRÒN (Central Hologram AI Core) */}
      <group position={[0, 1.35, 0]}>
        {/* Quả cầu lưới Wireframe bên ngoài */}
        <group ref={globeRef}>
          <mesh>
            <icosahedronGeometry args={[0.38, 2]} />
            <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.75} />
          </mesh>
          {/* Lõi năng lượng AI bên trong phát sáng */}
          <mesh>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshBasicMaterial color="#06b6d4" transparent opacity={0.85} />
          </mesh>
        </group>

        {/* Vòng radar dữ liệu xoay tròn */}
        <group ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
          <mesh>
            <ringGeometry args={[0.52, 0.55, 32]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} />
          </mesh>
          <mesh>
            <ringGeometry args={[0.62, 0.635, 32]} />
            <meshBasicMaterial color="#0ea5e9" transparent opacity={0.4} />
          </mesh>
        </group>

        {/* Nguồn sáng xanh Cyberpunk từ tâm quả cầu tỏa sáng xung quanh */}
        <pointLight color="#38bdf8" intensity={1.5} distance={4} />
      </group>

      {/* 🏷️ CÁC THẺ ICON HOLOGRAPHIC LƠ LỬNG (Floating Interactive UI Nodes) */}
      <group ref={dataNodesRef}>
        {[
          { label: 'GROWTH', icon: '📈', pos: [-0.95, 1.35, -0.55] as [number, number, number], color: '#38bdf8' },
          { label: 'DATA', icon: '☁️', pos: [0.95, 1.35, -0.55] as [number, number, number], color: '#38bdf8' },
          { label: 'REVENUE', icon: '💰', pos: [-1.05, 1.35, 0.45] as [number, number, number], color: '#34d399' },
          { label: 'OPERATIONS', icon: '⚙️', pos: [1.05, 1.35, 0.45] as [number, number, number], color: '#38bdf8' },
          { label: 'INNOVATION', icon: '💡', pos: [0, 1.35, 0.85] as [number, number, number], color: '#facc15' },
          { label: 'SECURITY', icon: '🛡️', pos: [0, 1.35, -0.85] as [number, number, number], color: '#ec4899' }
        ].map((item, idx) => (
          <group key={idx} position={item.pos}>
            {/* Khung thẻ kính trong suốt phát sáng viền */}
            <mesh>
              <boxGeometry args={[0.42, 0.42, 0.02]} />
              <meshBasicMaterial color="#0284c7" transparent opacity={0.25} />
            </mesh>
            <mesh>
              <boxGeometry args={[0.43, 0.43, 0.015]} />
              <meshBasicMaterial color={item.color} wireframe />
            </mesh>
            {/* Đốm sáng tâm icon */}
            <mesh position={[0, 0.04, 0.02]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshBasicMaterial color={item.color} />
            </mesh>
            {/* Vạch kẻ chỉ số mini dưới thẻ */}
            <mesh position={[0, -0.1, 0.02]}>
              <planeGeometry args={[0.26, 0.04]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

/**
 * 🌿 6. Cây xanh cảnh quan cao cấp (Fiddle Leaf Fig / Bàng Singapore)
 * Chậu gốm trụ tròn màu trắng mờ thanh lịch, đất hữu cơ ẩm và các phiến lá xanh bóng to bản
 */
function ExecutivePlant({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      {/* Chậu gốm sứ trắng thanh lịch phong cách Scandinavian / Minimalism */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.26, 0.9, 24]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.05} />
      </mesh>
      {/* Vành mạ kim loại vàng đồng sang trọng của miệng chậu */}
      <mesh position={[0, 0.9, 0]}>
        <torusGeometry args={[0.32, 0.02, 12, 24]} />
        <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Lớp đất hữu cơ sẫm màu */}
      <mesh position={[0, 0.88, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.04, 16]} />
        <meshStandardMaterial color="#1c1917" roughness={0.9} />
      </mesh>

      {/* Thân cây gỗ chính */}
      <mesh position={[0, 1.35, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.06, 0.95, 12]} />
        <meshStandardMaterial color="#451a03" roughness={0.8} />
      </mesh>

      {/* Các tán lá xanh mướt xếp tầng tự nhiên như thật */}
      {[
        { y: 1.15, rot: [0.35, 0.4, 0] as [number, number, number], r: 0.28 },
        { y: 1.35, rot: [-0.3, 1.8, 0.1] as [number, number, number], r: 0.32 },
        { y: 1.55, rot: [0.25, 3.2, -0.2] as [number, number, number], r: 0.3 },
        { y: 1.75, rot: [-0.2, 4.5, 0.15] as [number, number, number], r: 0.28 },
        { y: 1.95, rot: [0.1, 0.8, -0.1] as [number, number, number], r: 0.24 }
      ].map((leaf, i) => (
        <group key={i} position={[0, leaf.y, 0]} rotation={leaf.rot}>
          <mesh position={[0.18, 0.08, 0]} rotation={[0, 0, -0.3]} castShadow>
            <cylinderGeometry args={[0.16, 0.24, 0.015, 8]} />
            <meshStandardMaterial color="#15803d" roughness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * 🪴 7. Bồn cây lưỡi hổ hiện đại (Snake Plant Modern Planter Box)
 * Đặt dọc theo chân vách kính tạo cảm giác không gian sinh thái xanh
 */
function SnakePlanter({ position, width = 2.0 }: { position: [number, number, number]; width?: number }) {
  const leafCount = Math.floor(width / 0.25);
  return (
    <group position={position}>
      {/* Khối bồn composite xám than */}
      <mesh position={[0, 0.22, 0]} castShadow>
        <boxGeometry args={[width, 0.44, 0.36]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.2} />
      </mesh>
      {/* Mặt sỏi trắng rải mặt */}
      <mesh position={[0, 0.445, 0]}>
        <boxGeometry args={[width - 0.04, 0.02, 0.32]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.7} />
      </mesh>

      {/* Các bẹ lá lưỡi hổ mọc thẳng đứng với viền vàng đặc trưng */}
      {Array.from({ length: leafCount }).map((_, i) => {
        const x = -width / 2 + 0.18 + i * 0.24;
        const h = 0.55 + (i % 3) * 0.15;
        return (
          <group key={i} position={[x, 0.45 + h / 2, (i % 2 === 0 ? 0.04 : -0.04)]}>
            <mesh castShadow>
              <boxGeometry args={[0.08, h, 0.018]} />
              <meshStandardMaterial color="#15803d" roughness={0.4} />
            </mesh>
            {/* Viền vàng dọc lá */}
            <mesh position={[0, 0, 0.01]}>
              <planeGeometry args={[0.075, h]} />
              <meshBasicMaterial color="#eab308" wireframe />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
