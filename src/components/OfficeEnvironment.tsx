/**
 * @file OfficeEnvironment.tsx
 * @description Môi trường văn phòng làm việc 3D Isometric hiện đại.
 * Bao gồm sàn nhà gạch công nghệ cao, thảm sàn, cây xanh trang trí, vách kính và đèn trần.
 */

export function OfficeEnvironment() {
  return (
    <group>
      {/* 1. Thảm trải sàn văn phòng phong cách hiện đại */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 12]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Lưới grid công nghệ cao trên sàn để dễ ước lượng khoảng cách */}
      <gridHelper
        args={[14, 28, '#38bdf8', '#1e293b']}
        position={[0, 0.01, 0]}
      />

      {/* 2. Thảm trung tâm màu xanh Navy */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[9, 7]} />
        <meshStandardMaterial color="#1e1e38" roughness={0.9} />
      </mesh>

      {/* 3. Vách tường hậu và vách kính văn phòng */}
      {/* Tường phía sau bên trái */}
      <mesh position={[-7.1, 1.8, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[12, 3.6, 0.2]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>
      {/* Tường phía sau bên phải */}
      <mesh position={[0, 1.8, -6.1]} receiveShadow>
        <boxGeometry args={[14.2, 3.6, 0.2]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>

      {/* Dải kính văn phòng nhìn ra không gian công nghệ */}
      <mesh position={[0, 2.0, -5.95]}>
        <planeGeometry args={[12, 1.6]} />
        <meshPhysicalMaterial
          color="#38bdf8"
          transmission={0.85}
          opacity={0.3}
          transparent
          roughness={0.1}
          metalness={0.1}
          ior={1.5}
        />
      </mesh>

      {/* 4. Cây xanh trang trí góc văn phòng (Potted Office Plants) */}
      <Plant position={[-6.0, 0, -5.0]} />
      <Plant position={[6.0, 0, -5.0]} />
      <Plant position={[6.0, 0, 5.0]} />
      <Plant position={[-6.0, 0, 5.0]} />

      {/* 5. Cây nước & Máy pha cà phê văn phòng */}
      <group position={[-5.8, 0, 0]}>
        {/* Máy pha cà phê */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[0.5, 1.0, 0.5]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.7, 0.26]}>
          <boxGeometry args={[0.2, 0.1, 0.05]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Cây cảnh trang trí văn phòng với chậu gốm và tán lá
 */
function Plant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Chậu cây hình nón cụt */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.2, 0.7, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} />
      </mesh>
      {/* Đất trong chậu */}
      <mesh position={[0, 0.68, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.05, 16]} />
        <meshStandardMaterial color="#3f2e21" roughness={0.9} />
      </mesh>
      {/* Tán lá xanh */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <dodecahedronGeometry args={[0.45, 1]} />
        <meshStandardMaterial color="#10b981" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.45, 0]} castShadow>
        <dodecahedronGeometry args={[0.35, 1]} />
        <meshStandardMaterial color="#34d399" roughness={0.6} />
      </mesh>
    </group>
  );
}
