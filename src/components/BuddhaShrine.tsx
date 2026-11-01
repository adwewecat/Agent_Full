/**
 * @file BuddhaShrine.tsx
 * @description Bàn thờ Phật và Đài sen trang nghiêm mạ vàng phong cách nghệ thuật ấm cúng.
 * Nơi các AI Agent đến thắp hương, cúi đầu vái lạy bái Phật cầu bình an,
 * giải trừ mọi lỗi bug và nhận phước lành (Zero Bug Blessing) trước khi bắt tay vào làm việc.
 */

import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface BuddhaShrineProps {
  position?: [number, number, number];
  rotation?: number;
  onPray?: () => void;
  isPrayingAny?: boolean;
  speechText?: string | null;
  isMiracleActive?: boolean;
}

export function BuddhaShrine({
  position = [-0.5, 0, -5.4],
  rotation = 0,
  onPray,
  isPrayingAny = false,
  speechText = null,
  isMiracleActive = false
}: BuddhaShrineProps) {
  const [isHovered, setIsHovered] = useState(false);
  const haloRef = useRef<THREE.Mesh>(null);
  const smokeGroupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  // Tạo các hạt khói hương nghi ngút bay lên
  const smokeParticles = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      baseX: (Math.random() - 0.5) * 0.08,
      baseZ: (Math.random() - 0.5) * 0.08,
      speedY: 0.15 + Math.random() * 0.12,
      phase: Math.random() * Math.PI * 2,
      scale: 0.03 + Math.random() * 0.03
    }));
  }, []);

  // Vòng lặp animation: xoay hào quang và nâng các hạt khói hương bay lên
  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();

    // Hào quang vàng xoay nhẹ và xung nhịp phát sáng (khi có phép màu thì bừng sáng gấp 1.8 lần)
    if (haloRef.current) {
      haloRef.current.rotation.z = elapsed * (isMiracleActive ? 1.2 : 0.25);
      const baseScale = isMiracleActive ? 1.6 : 1.0;
      const scale = baseScale + Math.sin(elapsed * (isMiracleActive ? 8 : 2)) * 0.08;
      haloRef.current.scale.set(scale, scale, 1);
    }

    // Ánh sáng nến thờ lung linh
    if (lightRef.current) {
      const miracleBoost = isMiracleActive ? 2.5 : 0;
      lightRef.current.intensity = 1.4 + Math.sin(elapsed * 5) * 0.2 + (isPrayingAny ? 0.8 : 0) + miracleBoost;
    }

    // Khói hương bay lượn uốn cong
    if (smokeGroupRef.current) {
      smokeGroupRef.current.children.forEach((child, i) => {
        const p = smokeParticles[i];
        if (p) {
          const currentY = ((elapsed * p.speedY + p.phase) % 1.2);
          child.position.y = 0.55 + currentY;
          child.position.x = p.baseX + Math.sin(elapsed * 2 + p.phase) * 0.04 * (currentY + 0.2);
          child.position.z = p.baseZ + Math.cos(elapsed * 1.5 + p.phase) * 0.04 * (currentY + 0.2);
          // Hạt khói nở to và mờ dần khi lên cao
          const prog = currentY / 1.2;
          child.scale.setScalar(p.scale * (1 + prog * 2.5));
          const mesh = child as THREE.Mesh;
          if (mesh.material) {
            (mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.45 * (1 - prog));
          }
        }
      });
    }
  });

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
        if (onPray) onPray();
      }}
    >
      {/* 1. BÀN THỜ GỖ GỤ TRẦM ẤM (Altar Table) */}
      <group position={[0, 0, 0]}>
        {/* Mặt bàn thờ chính */}
        <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.12, 1.3]} />
          <meshStandardMaterial color="#451a03" roughness={0.4} metalness={0.1} />
        </mesh>

        {/* Viền nẹp mạ vàng kim trang nghiêm */}
        <mesh position={[0, 0.65, 0.66]}>
          <boxGeometry args={[2.22, 0.04, 0.02]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.65, -0.66]}>
          <boxGeometry args={[2.22, 0.04, 0.02]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.3} metalness={0.8} />
        </mesh>

        {/* 4 Chân bàn thờ chạm khắc */}
        {[
          [-0.98, 0.3, 0.52],
          [0.98, 0.3, 0.52],
          [-0.98, 0.3, -0.52],
          [0.98, 0.3, -0.52]
        ].map(([x, y, z], idx) => (
          <mesh key={idx} position={[x, y, z]} castShadow>
            <cylinderGeometry args={[0.06, 0.07, 0.6, 8]} />
            <meshStandardMaterial color="#361502" roughness={0.5} />
          </mesh>
        ))}

        {/* Bệ đỡ trung tâm dưới bàn */}
        <mesh position={[0, 0.28, 0]} castShadow>
          <boxGeometry args={[1.9, 0.45, 0.9]} />
          <meshStandardMaterial color="#2d1202" roughness={0.6} />
        </mesh>

        {/* Khăn trải bàn thờ màu hoàng yến / đỏ thêu rồng */}
        <mesh position={[0, 0.715, 0]}>
          <boxGeometry args={[1.6, 0.015, 1.1]} />
          <meshStandardMaterial color="#dc2626" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.725, 0]}>
          <boxGeometry args={[1.3, 0.01, 0.9]} />
          <meshStandardMaterial color="#fbbf24" roughness={0.5} />
        </mesh>
      </group>

      {/* 2. ĐÀI SEN TỎA NGÁT HƯƠNG (Multi-Tier Lotus Pedestal) */}
      <group position={[0, 0.73, -0.15]}>
        {/* Tầng đế lục giác */}
        <mesh position={[0, 0.05, 0]} castShadow>
          <cylinderGeometry args={[0.42, 0.48, 0.1, 8]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.3} metalness={0.8} />
        </mesh>

        {/* Tầng cánh sen nở (16 cánh sen xếp vòng) */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 0.36, 0.12, Math.sin(angle) * 0.36]}
              rotation={[0.3, -angle, 0]}
              castShadow
            >
              <sphereGeometry args={[0.09, 8, 8]} />
              <meshStandardMaterial
                color="#fbbf24"
                emissive="#d97706"
                emissiveIntensity={0.2}
                roughness={0.25}
                metalness={0.85}
              />
            </mesh>
          );
        })}

        {/* Mặt đài sen phẳng */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.08, 16]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.25} metalness={0.9} />
        </mesh>
      </group>

      {/* 3. KIM THÂN TƯỢNG PHẬT MẠ VÀNG (Golden Buddha Figure) */}
      <group position={[0, 0.95, -0.15]}>
        {/* Chân kiết già tọa thiền (Folded crossed legs) */}
        <mesh position={[0, 0.08, 0.04]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <capsuleGeometry args={[0.13, 0.34, 8, 16]} />
          <meshStandardMaterial
            color="#f59e0b"
            roughness={0.25}
            metalness={0.85}
            emissive="#b45309"
            emissiveIntensity={0.25}
          />
        </mesh>

        {/* Thân mình Phật & Áo cà sa (Torso & Monastic Robe) */}
        <mesh position={[0, 0.32, 0]} castShadow>
          <coneGeometry args={[0.26, 0.42, 16]} />
          <meshStandardMaterial
            color="#f59e0b"
            roughness={0.25}
            metalness={0.85}
            emissive="#b45309"
            emissiveIntensity={0.25}
          />
        </mesh>

        {/* Cà sa vắt chéo qua vai */}
        <mesh position={[0.06, 0.34, 0.04]} rotation={[0, 0, -0.3]}>
          <cylinderGeometry args={[0.07, 0.14, 0.38, 12]} />
          <meshStandardMaterial color="#d97706" roughness={0.35} metalness={0.7} />
        </mesh>

        {/* Đôi tay thủ ấn thiền định (Dhyana Mudra) trước bụng */}
        <mesh position={[0, 0.22, 0.16]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.05, 0.16, 6, 12]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.3} metalness={0.8} />
        </mesh>

        {/* Cổ Phật */}
        <mesh position={[0, 0.54, 0]}>
          <cylinderGeometry args={[0.08, 0.09, 0.08, 12]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.3} metalness={0.8} />
        </mesh>

        {/* Đầu tượng Phật trang nghiêm */}
        <mesh position={[0, 0.69, 0]} castShadow>
          <sphereGeometry args={[0.15, 20, 20]} />
          <meshStandardMaterial
            color="#fbbf24"
            roughness={0.22}
            metalness={0.85}
            emissive="#d97706"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Nhục kế Ushnisha trên đỉnh đầu */}
        <mesh position={[0, 0.85, 0]}>
          <sphereGeometry args={[0.065, 12, 12]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.2} metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.91, 0]}>
          <coneGeometry args={[0.025, 0.06, 8]} />
          <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.6} />
        </mesh>

        {/* Dái tai dài từ bi */}
        <mesh position={[-0.14, 0.66, 0]}>
          <capsuleGeometry args={[0.025, 0.07, 4, 8]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0.14, 0.66, 0]}>
          <capsuleGeometry args={[0.025, 0.07, 4, 8]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.3} metalness={0.8} />
        </mesh>

        {/* 4. VÒNG HÀO QUANG VÀNG KIM TỎA SÁNG (Buddha Halo Ring) */}
        <mesh ref={haloRef} position={[0, 0.68, -0.1]}>
          <ringGeometry args={[0.22, 0.38, 32]} />
          <meshStandardMaterial
            color="#fef08a"
            emissive="#eab308"
            emissiveIntensity={1.2}
            side={THREE.DoubleSide}
            transparent
            opacity={0.92}
          />
        </mesh>
        {/* Đĩa hào quang ánh sáng bên trong */}
        <mesh position={[0, 0.68, -0.11]}>
          <circleGeometry args={[0.22, 32]} />
          <meshBasicMaterial color="#fef08a" transparent opacity={0.35} />
        </mesh>
      </group>

      {/* 5. BÁT HƯƠNG ĐỒNG & KHÓI HƯƠNG BAY BỔNG (Bronze Incense Burner & Rising Smoke) */}
      <group position={[0, 0.73, 0.32]}>
        {/* Thân bát hương */}
        <mesh position={[0, 0.08, 0]} castShadow>
          <cylinderGeometry args={[0.13, 0.1, 0.16, 16]} />
          <meshStandardMaterial color="#92400e" roughness={0.3} metalness={0.85} />
        </mesh>
        {/* Vành bát hương mạ đồng */}
        <mesh position={[0, 0.16, 0]}>
          <torusGeometry args={[0.13, 0.02, 8, 24]} />
          <meshStandardMaterial color="#b45309" roughness={0.3} metalness={0.9} />
        </mesh>
        {/* Tro hương bên trong */}
        <mesh position={[0, 0.14, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.11, 16]} />
          <meshStandardMaterial color="#6b7280" roughness={0.9} />
        </mesh>

        {/* 3 Nén hương thơm thành tâm cắm trên bát hương */}
        {[
          [-0.03, 0.32, -0.01, -0.08],
          [0, 0.36, 0.01, 0],
          [0.03, 0.32, -0.01, 0.08]
        ].map(([x, y, z, rotZ], idx) => (
          <group key={idx} position={[x, y, z]} rotation={[0, 0, rotZ]}>
            {/* Chân hương */}
            <mesh>
              <cylinderGeometry args={[0.005, 0.005, 0.34, 6]} />
              <meshStandardMaterial color="#b91c1c" roughness={0.6} />
            </mesh>
            {/* Tàn hương đỏ rực phát sáng ở đầu nén hương */}
            <mesh position={[0, 0.17, 0]}>
              <sphereGeometry args={[0.012, 8, 8]} />
              <meshBasicMaterial color="#ef4444" />
            </mesh>
            <pointLight position={[0, 0.17, 0]} intensity={0.25} distance={0.6} color="#ef4444" />
          </group>
        ))}

        {/* Làn khói hương nghi ngút bay lên không trung */}
        <group ref={smokeGroupRef}>
          {smokeParticles.map((p) => (
            <mesh key={p.id} position={[0, 0.5, 0]}>
              <sphereGeometry args={[1, 8, 8]} />
              <meshBasicMaterial color="#e2e8f0" transparent opacity={0.3} />
            </mesh>
          ))}
        </group>
      </group>

      {/* 6. ĐÈN HOA SEN & ĐỒ CÚNG THANH TỊNH (Lotus Lamps & Offerings) */}
      {/* Đèn hoa sen bên trái */}
      <group position={[-0.65, 0.73, 0.22]}>
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 0.12, 12]} />
          <meshStandardMaterial color="#b45309" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.15, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#f43f5e" emissive="#fb7185" emissiveIntensity={0.6} />
        </mesh>
        {/* Ngọn lửa đèn lung linh */}
        <mesh position={[0, 0.24, 0]}>
          <coneGeometry args={[0.025, 0.07, 8]} />
          <meshBasicMaterial color="#fde047" />
        </mesh>
      </group>

      {/* Đèn hoa sen bên phải */}
      <group position={[0.65, 0.73, 0.22]}>
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 0.12, 12]} />
          <meshStandardMaterial color="#b45309" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.15, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#f43f5e" emissive="#fb7185" emissiveIntensity={0.6} />
        </mesh>
        {/* Ngọn lửa đèn lung linh */}
        <mesh position={[0, 0.24, 0]}>
          <coneGeometry args={[0.025, 0.07, 8]} />
          <meshBasicMaterial color="#fde047" />
        </mesh>
      </group>

      {/* Đĩa hoa quả tươi & chén nước thanh tịnh */}
      <group position={[-0.32, 0.73, 0.28]}>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.12, 0.09, 0.04, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} />
        </mesh>
        {/* Quả đào / cam vàng */}
        <mesh position={[0, 0.06, 0]}>
          <sphereGeometry args={[0.05, 10, 10]} />
          <meshStandardMaterial color="#f97316" roughness={0.5} />
        </mesh>
        <mesh position={[-0.04, 0.05, 0.03]}>
          <sphereGeometry args={[0.045, 10, 10]} />
          <meshStandardMaterial color="#84cc16" roughness={0.5} />
        </mesh>
      </group>

      {/* 3 Chén nước thanh tịnh */}
      {[-0.07, 0, 0.07].map((offsetZ, i) => (
        <group key={i} position={[0.32, 0.73, 0.24 + offsetZ]}>
          <mesh position={[0, 0.03, 0]}>
            <cylinderGeometry args={[0.035, 0.025, 0.06, 10]} />
            <meshStandardMaterial color="#e0f2fe" roughness={0.1} transparent opacity={0.85} />
          </mesh>
        </group>
      ))}

      {/* 7. ÁNH SÁNG VÀNG LINH THIÊNG (Spiritual Point Light) */}
      <pointLight
        ref={lightRef}
        position={[0, 1.8, 0.2]}
        color="#fef08a"
        intensity={1.5}
        distance={6}
        decay={2}
      />

      {/* 8. THẺ THÔNG TIN TÂM LINH & NÚT TƯƠNG TÁC (Chỉ hiện khi rê chuột vào hoặc khi có Agent đang bái Phật) */}
      {(isHovered || isPrayingAny) && (
        <Html
          position={[0, 2.3, 0]}
          center
          distanceFactor={14}
          style={{ pointerEvents: 'auto' }}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (onPray) onPray();
            }}
            className="shrine-label-badge"
            style={{
              cursor: 'pointer',
              padding: '5px 12px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.95), rgba(217, 119, 6, 0.95))',
              color: '#ffffff',
              boxShadow: '0 4px 18px rgba(245, 158, 11, 0.5), 0 2px 8px rgba(0,0,0,0.4)',
              border: '1.5px solid #fef08a',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              whiteSpace: 'nowrap',
              userSelect: 'none',
              transform: 'scale(1)',
              transition: 'transform 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '11.5px', letterSpacing: '0.5px' }}>
              <span>🙏</span>
              <span>ĐÀI SEN BÁI PHẬT</span>
            </div>
            <div style={{ fontSize: '9.5px', color: '#fef3c7', fontWeight: 600 }}>
              {isPrayingAny ? '✨ Đang truyền năng lượng an lạc...' : 'Cầu Bình An • Xóa Hết Lỗi Bug 0%'}
            </div>
          </div>
        </Html>
      )}

      {/* 8.5. HỘP THOẠI HÀI HƯỚC CỦA ĐỨC PHẬT (Buddha Speech Bubble) */}
      {speechText && (
        <Html
          position={[0, 2.5, 0]}
          center
          distanceFactor={13}
          style={{ pointerEvents: 'none' }}
        >
          <div className="thought-bubble-wrapper">
            <div
              className="thought-bubble"
              style={{
                width: '180px',
                minHeight: '52px',
                padding: '8px 12px',
                borderRadius: '10px',
                backgroundColor: 'rgba(217, 119, 6, 0.96)',
                borderColor: '#fef08a',
                borderWidth: '2px',
                borderStyle: 'solid',
                boxShadow: '0 6px 24px rgba(245, 158, 11, 0.6), 0 2px 10px rgba(0,0,0,0.5)',
                color: '#ffffff',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '11px',
                fontWeight: 700,
                lineHeight: '1.4',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span style={{ fontSize: '12px', color: '#fef3c7' }}>📿 Đức Phật Từ Bi:</span>
              <span style={{ color: '#ffffff' }}>"{speechText}"</span>
            </div>
            <div className="thought-arrow" style={{ borderTopColor: '#d97706' }} />
          </div>
        </Html>
      )}
    </group>
  );
}

