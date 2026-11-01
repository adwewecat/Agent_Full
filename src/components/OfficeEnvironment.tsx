/**
 * @file OfficeEnvironment.tsx
 * @description Môi trường văn phòng làm việc 3D phong cách nghệ thuật ấm cúng kết hợp Cyberpunk
 * (Cozy Indie Studio & Cyber Vibes), bao gồm sàn gỗ sồi xương cá, thảm họa tiết thổ cẩm Bohemian,
 * bảng viết Whiteboard Kanban với giấy nhớ đa sắc, cây xanh Monstera và cây nước văn phòng.
 */

export function OfficeEnvironment() {
  return (
    <group>
      {/* 1. Sàn gỗ tự nhiên ấm áp phong cách Scandinavian */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 14]} />
        <meshStandardMaterial
          color="#3b1d11"
          roughness={0.65}
          metalness={0.05}
        />
      </mesh>

      {/* Lưới chia ô Isometric mềm mại màu hổ phách vàng cam */}
      <gridHelper
        args={[16, 32, '#f59e0b', '#78350f']}
        position={[0, 0.01, 0]}
      />

      {/* 2. Thảm trung tâm dệt họa tiết màu xanh Teal & Cam đất ấm cúng */}
      <mesh position={[0, 0.015, 0.2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[9.5, 7.5]} />
        <meshStandardMaterial color="#0f766e" roughness={0.9} />
      </mesh>
      {/* Viền thảm nghệ thuật */}
      <mesh position={[0, 0.018, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.4, 4.6, 4]} />
        <meshBasicMaterial color="#f59e0b" />
      </mesh>

      {/* 3. Tường hậu màu xanh Navy hiện đại với tranh treo tường */}
      {/* Tường trái */}
      <mesh position={[-7.9, 2.0, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[14, 4.0, 0.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.7} />
      </mesh>
      {/* Tường phải */}
      <mesh position={[0, 2.0, -6.9]} receiveShadow>
        <boxGeometry args={[16, 4.0, 0.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.7} />
      </mesh>

      {/* Bảng Whiteboard Kanban với các tờ giấy Note nhiều màu sắc */}
      <group position={[-3.5, 2.2, -6.78]}>
        {/* Khung nhôm bảng */}
        <mesh>
          <boxGeometry args={[3.2, 1.8, 0.04]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
        </mesh>
        {/* Mặt bảng từ trắng */}
        <mesh position={[0, 0, 0.025]}>
          <planeGeometry args={[3.0, 1.6]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} />
        </mesh>
        {/* Giấy nhớ Sticky Notes màu mè (Vàng, Hồng, Xanh, Cam) */}
        {/* Cột TODO */}
        <mesh position={[-1.0, 0.4, 0.035]}>
          <planeGeometry args={[0.22, 0.22]} />
          <meshBasicMaterial color="#facc15" />
        </mesh>
        <mesh position={[-1.0, 0.08, 0.035]}>
          <planeGeometry args={[0.22, 0.22]} />
          <meshBasicMaterial color="#f472b6" />
        </mesh>
        {/* Cột IN PROGRESS */}
        <mesh position={[0, 0.4, 0.035]}>
          <planeGeometry args={[0.22, 0.22]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        <mesh position={[0, 0.1, 0.035]}>
          <planeGeometry args={[0.22, 0.22]} />
          <meshBasicMaterial color="#fb923c" />
        </mesh>
        {/* Cột DONE */}
        <mesh position={[1.0, 0.4, 0.035]}>
          <planeGeometry args={[0.22, 0.22]} />
          <meshBasicMaterial color="#4ade80" />
        </mesh>
        <mesh position={[1.0, 0.08, 0.035]}>
          <planeGeometry args={[0.22, 0.22]} />
          <meshBasicMaterial color="#4ade80" />
        </mesh>
      </group>

      {/* Cửa sổ vách kính lớn nhìn ra bầu trời hoàng hôn ấm áp */}
      <mesh position={[2.5, 2.3, -6.75]}>
        <planeGeometry args={[6.5, 2.2]} />
        <meshPhysicalMaterial
          color="#38bdf8"
          transmission={0.8}
          opacity={0.35}
          transparent
          roughness={0.05}
          ior={1.4}
        />
      </mesh>
      {/* Khung cửa sổ gỗ */}
      <mesh position={[2.5, 2.3, -6.74]}>
        <boxGeometry args={[6.6, 2.3, 0.02]} />
        <meshStandardMaterial color="#78350f" wireframe />
      </mesh>

      {/* 4. Cây cảnh nhiệt đới Monstera và Cọ cảnh trang trí góc văn phòng */}
      <MonsteraPlant position={[-7.0, 0, -5.8]} />
      <MonsteraPlant position={[7.0, 0, -5.8]} />
      <MonsteraPlant position={[7.0, 0, 5.5]} />
      <MonsteraPlant position={[-7.0, 0, 5.5]} />

      {/* 5. Cây nước nóng lạnh có bình nước xanh ngọc */}
      <group position={[-6.8, 0, 0]}>
        {/* Thân cây nước trắng */}
        <mesh position={[0, 0.55, 0]} castShadow>
          <boxGeometry args={[0.45, 1.1, 0.45]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.3} />
        </mesh>
        {/* Vòi nước xanh/đỏ */}
        <mesh position={[0, 0.72, 0.24]}>
          <boxGeometry args={[0.12, 0.08, 0.04]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        {/* Bình nước 20L hình trụ xanh lam trong suốt */}
        <mesh position={[0, 1.35, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.45, 16]} />
          <meshPhysicalMaterial
            color="#0ea5e9"
            transmission={0.8}
            opacity={0.7}
            transparent
            roughness={0.1}
          />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Cây cảnh Monstera (Trầu bà lá xẻ) với chậu gốm nung đất nung Terracotta
 */
function MonsteraPlant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Chậu đất nung Terracotta màu cam ấm */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.25, 0.8, 16]} />
        <meshStandardMaterial color="#ea580c" roughness={0.7} />
      </mesh>
      {/* Đất đen phì nhiêu */}
      <mesh position={[0, 0.78, 0]}>
        <cylinderGeometry args={[0.33, 0.33, 0.05, 16]} />
        <meshStandardMaterial color="#27180e" roughness={0.9} />
      </mesh>
      {/* Các tầng lá xanh mướt nhiều sắc thái */}
      <mesh position={[-0.1, 1.15, 0.1]} rotation={[0.2, 0.3, 0]} castShadow>
        <dodecahedronGeometry args={[0.48, 1]} />
        <meshStandardMaterial color="#15803d" roughness={0.5} />
      </mesh>
      <mesh position={[0.12, 1.45, -0.1]} rotation={[-0.2, -0.4, 0.1]} castShadow>
        <dodecahedronGeometry args={[0.42, 1]} />
        <meshStandardMaterial color="#22c55e" roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.75, 0]} castShadow>
        <dodecahedronGeometry args={[0.32, 1]} />
        <meshStandardMaterial color="#4ade80" roughness={0.5} />
      </mesh>
    </group>
  );
}
