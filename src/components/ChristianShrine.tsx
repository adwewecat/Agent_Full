/**
 * @file ChristianShrine.tsx
 * @description Bàn Thờ Chúa và Thánh Giá uy nghi mạ vàng (Christian Altar & Holy Crucifix).
 * Được đặt ở góc tường hậu bên phải đối xứng hoàn hảo với Đài Sen Phật bên trái,
 * mang lại không gian tôn nghiêm, hòa hợp tâm linh, ban phước lành và sự bình an cho đội ngũ AI Agent.
 */

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface ChristianShrineProps {
  position?: [number, number, number];
  rotation?: number;
  onPray?: () => void;
  isPrayingAny?: boolean;
}

export function ChristianShrine({
  position = [2.4, 0, -4.8],
  rotation = 0,
  onPray,
  isPrayingAny = false
}: ChristianShrineProps) {
  const [isHovered, setIsHovered] = useState(false);
  const haloRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const flame1Ref = useRef<THREE.Mesh>(null);
  const flame2Ref = useRef<THREE.Mesh>(null);

  // Vòng lặp hoạt ảnh: xoay nhẹ hào quang thiên thần và nhấp nháy ánh nến thánh
  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();

    // Hào quang vàng xoay êm đềm và xung nhịp phát sáng
    if (haloRef.current) {
      haloRef.current.rotation.z = Math.sin(elapsed * 0.4) * 0.08;
      const pulse = 1 + Math.sin(elapsed * 2.5) * 0.04;
      haloRef.current.scale.set(pulse, pulse, 1);
    }

    // Ánh sáng nến thờ lung linh ấm áp
    if (lightRef.current) {
      lightRef.current.intensity = 1.6 + Math.sin(elapsed * 6) * 0.25 + (isPrayingAny ? 0.9 : 0);
    }

    // Ngọn lửa nến bập bùng
    if (flame1Ref.current) {
      flame1Ref.current.scale.y = 1 + Math.sin(elapsed * 8) * 0.15;
    }
    if (flame2Ref.current) {
      flame2Ref.current.scale.y = 1 + Math.cos(elapsed * 7) * 0.15;
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
      {/* 1. Bệ tam cấp bằng đá cẩm thạch trắng thanh khiết */}
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <boxGeometry args={[1.7, 0.08, 1.2]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.11, 0]} receiveShadow>
        <boxGeometry args={[1.5, 0.06, 1.05]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.25} />
      </mesh>

      {/* 2. Bàn thờ gỗ sồi trắng ngà phủ khăn ren thánh thêu chỉ vàng */}
      <group position={[0, 0.14, 0]}>
        {/* Thân bàn thờ gỗ sồi sang trọng */}
        <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.35, 0.64, 0.78]} />
          <meshStandardMaterial color="#b45309" roughness={0.4} />
        </mesh>

        {/* Khăn trải bàn ren trắng tinh khôi phủ rủ xuống 4 góc */}
        <mesh position={[0, 0.645, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.4, 0.03, 0.82]} />
          <meshStandardMaterial color="#ffffff" roughness={0.6} />
        </mesh>
        {/* Diềm viền thêu chỉ vàng kim quanh mép khăn ren */}
        <mesh position={[0, 0.62, 0.415]}>
          <boxGeometry args={[1.38, 0.08, 0.015]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.62, -0.415]}>
          <boxGeometry args={[1.38, 0.08, 0.015]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Biểu tượng Thánh Giá mạ vàng chạm khắc ở mặt chính diện bàn thờ */}
        <group position={[0, 0.32, 0.395]}>
          <mesh>
            <boxGeometry args={[0.06, 0.28, 0.01]} />
            <meshStandardMaterial color="#fef08a" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[0.2, 0.05, 0.01]} />
            <meshStandardMaterial color="#fef08a" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* 3. CÂY THÁNH GIÁ CHÚA GIÊ-SU UY NGHI MẠ VÀNG (Holy Golden Crucifix) */}
      <group position={[0, 0.78, -0.15]}>
        {/* Bệ đỡ Thánh Giá bằng gỗ gụ tam giác */}
        <mesh position={[0, 0.08, 0]} castShadow>
          <boxGeometry args={[0.34, 0.16, 0.22]} />
          <meshStandardMaterial color="#78350f" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.18, 0]} castShadow>
          <boxGeometry args={[0.24, 0.06, 0.16]} />
          <meshStandardMaterial color="#d97706" metalness={0.8} />
        </mesh>

        {/* Trục dọc Thánh Giá (Gỗ gụ viền vàng) */}
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[0.08, 1.1, 0.05]} />
          <meshStandardMaterial color="#451a03" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.75, 0.026]}>
          <boxGeometry args={[0.06, 1.08, 0.005]} />
          <meshStandardMaterial color="#fef08a" metalness={0.95} roughness={0.2} />
        </mesh>

        {/* Trục ngang Thánh Giá */}
        <mesh position={[0, 1.05, 0]} castShadow>
          <boxGeometry args={[0.62, 0.08, 0.05]} />
          <meshStandardMaterial color="#451a03" roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.05, 0.026]}>
          <boxGeometry args={[0.6, 0.06, 0.005]} />
          <meshStandardMaterial color="#fef08a" metalness={0.95} roughness={0.2} />
        </mesh>

        {/* Tấm bảng khắc chữ thánh INRI trên đỉnh Thánh Giá */}
        <mesh position={[0, 1.25, 0.03]}>
          <boxGeometry args={[0.12, 0.05, 0.015]} />
          <meshStandardMaterial color="#fde047" metalness={0.9} />
        </mesh>

        {/* TƯỢNG CHÚA GIÊ-SU MẠ VÀNG (Corpus of Christ) */}
        <group position={[0, 0.98, 0.045]}>
          {/* Đầu Chúa cúi nhẹ từ ái với vương miện gai */}
          <mesh position={[0, 0.18, 0.02]} rotation={[0.15, 0, 0]}>
            <sphereGeometry args={[0.045, 16, 16]} />
            <meshStandardMaterial color="#fef08a" metalness={0.85} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.21, 0.02]}>
            <torusGeometry args={[0.038, 0.006, 8, 24]} />
            <meshStandardMaterial color="#b45309" roughness={0.7} />
          </mesh>

          {/* Thân mình Chúa */}
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[0.07, 0.22, 0.04]} />
            <meshStandardMaterial color="#fef08a" metalness={0.85} roughness={0.2} />
          </mesh>

          {/* Khăn thánh trắng quanh hông (Perizoma) */}
          <mesh position={[0, -0.06, 0.01]}>
            <cylinderGeometry args={[0.05, 0.045, 0.07, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} />
          </mesh>

          {/* Hai cánh tay Chúa dang rộng bao dung trên xà ngang */}
          {[-0.18, 0.18].map((x, idx) => (
            <mesh
              key={idx}
              position={[x, 0.14, 0]}
              rotation={[0, 0, idx === 0 ? -0.15 : 0.15]}
            >
              <cylinderGeometry args={[0.016, 0.016, 0.24, 12]} />
              <meshStandardMaterial color="#fef08a" metalness={0.85} roughness={0.2} />
            </mesh>
          ))}

          {/* Đôi chân Chúa */}
          <mesh position={[0, -0.22, 0.01]} rotation={[-0.1, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.015, 0.24, 12]} />
            <meshStandardMaterial color="#fef08a" metalness={0.85} roughness={0.2} />
          </mesh>
        </group>

        {/* 4. VÒNG HÀO QUANG THIÊN THẦN TỎA SÁNG (Divine Radiant Nimbus) */}
        <group ref={haloRef} position={[0, 1.05, -0.04]}>
          {/* Vành hào quang tròn mạ vàng */}
          <mesh>
            <torusGeometry args={[0.26, 0.014, 16, 48]} />
            <meshStandardMaterial
              color="#fde047"
              emissive="#f59e0b"
              emissiveIntensity={0.6}
              metalness={0.9}
            />
          </mesh>
          {/* Các tia sáng thánh thiện tỏa ra 4 phương 8 hướng */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * Math.PI) / 4;
            return (
              <mesh key={i} rotation={[0, 0, angle]}>
                <boxGeometry args={[0.015, 0.42, 0.005]} />
                <meshBasicMaterial color="#fef08a" />
              </mesh>
            );
          })}
        </group>
      </group>

      {/* 5. ĐÔI CHÂN NẾN ĐỒNG & NGỌN LỬA NẾN PHỤNG VỤ LUNG LINH */}
      {[-0.45, 0.45].map((x, idx) => (
        <group key={idx} position={[x, 0.78, 0.05]}>
          {/* Chân đế nến bằng đồng mạ vàng */}
          <mesh position={[0, 0.03, 0]}>
            <cylinderGeometry args={[0.07, 0.09, 0.06, 16]} />
            <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Thân chân nến thanh mảnh */}
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.02, 0.03, 0.14, 16]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.05, 0.03, 0.03, 16]} />
            <meshStandardMaterial color="#d97706" metalness={0.9} />
          </mesh>

          {/* Cây nến sáp trắng thánh thiện */}
          <mesh position={[0, 0.32, 0]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.22, 16]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} />
          </mesh>

          {/* Tim nến */}
          <mesh position={[0, 0.44, 0]}>
            <cylinderGeometry args={[0.002, 0.002, 0.02, 8]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>

          {/* Ngọn lửa nến bập bùng */}
          <mesh
            ref={idx === 0 ? flame1Ref : flame2Ref}
            position={[0, 0.46, 0]}
          >
            <coneGeometry args={[0.016, 0.045, 12]} />
            <meshBasicMaterial color="#fbbf24" />
          </mesh>
        </group>
      ))}

      {/* 6. CUỐN KINH THÁNH MẠ VÀNG MỞ TRANG (Holy Bible) */}
      <group position={[0, 0.81, 0.18]} rotation={[0.2, 0, 0]}>
        {/* Giá đỡ kinh bằng gỗ sồi */}
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[0.24, 0.04, 0.16]} />
          <meshStandardMaterial color="#78350f" roughness={0.4} />
        </mesh>
        {/* Bìa da nâu bọc chỉ vàng */}
        <mesh position={[0, 0.045, 0]}>
          <boxGeometry args={[0.26, 0.015, 0.18]} />
          <meshStandardMaterial color="#451a03" roughness={0.5} />
        </mesh>
        {/* 2 Trang sách giấy trắng mở ra */}
        {[-0.06, 0.06].map((x, i) => (
          <mesh
            key={i}
            position={[x, 0.06, 0]}
            rotation={[0, 0, i === 0 ? 0.08 : -0.08]}
          >
            <boxGeometry args={[0.11, 0.018, 0.16]} />
            <meshStandardMaterial color="#fef9c3" roughness={0.8} />
          </mesh>
        ))}
        {/* Dải ruy băng đánh dấu trang màu đỏ thánh */}
        <mesh position={[0, 0.075, 0]}>
          <boxGeometry args={[0.01, 0.005, 0.18]} />
          <meshBasicMaterial color="#dc2626" />
        </mesh>
      </group>

      {/* 7. BÌNH HOA HUỆ TRẮNG THANH KHIẾT (Vase of White Lilies) */}
      <group position={[-0.5, 0.8, -0.05]}>
        {/* Bình gốm sứ trắng thanh lịch */}
        <mesh position={[0, 0.1, 0]} castShadow>
          <cylinderGeometry args={[0.045, 0.035, 0.18, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.15} />
        </mesh>
        {/* Những bông hoa huệ trắng hòa bình */}
        {[
          [0, 0.24, 0],
          [-0.03, 0.28, 0.02],
          [0.03, 0.27, -0.02]
        ].map(([x, y, z], idx) => (
          <group key={idx} position={[x, y, z]}>
            <mesh>
              <sphereGeometry args={[0.022, 12, 12]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.01, 0]}>
              <cylinderGeometry args={[0.003, 0.003, 0.03, 8]} />
              <meshBasicMaterial color="#fde047" />
            </mesh>
          </group>
        ))}
      </group>

      {/* 8. NGUỒN ÁNH SÁNG THÁNH THIỆN ẤM ÁP (Warm Divine Holy Light) */}
      <pointLight
        ref={lightRef}
        position={[0, 1.4, 0.2]}
        color="#fffbeb"
        intensity={1.8}
        distance={6}
        decay={2}
      />

      {/* 9. VÙNG TƯƠNG TÁC HOVER & CLICK TOOLTIP */}
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[1.5, 1.6, 1.0]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Vòng hào quang sáng dưới chân bệ khi rê chuột */}
      {isHovered && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.9, 1.15, 32]} />
          <meshBasicMaterial color="#fde047" transparent opacity={0.6} />
        </mesh>
      )}

      {/* Tooltip khi rê chuột */}
      {isHovered && (
        <Html
          position={[0, 2.2, 0]}
          center
          distanceFactor={16}
          style={{ pointerEvents: 'none' }}
        >
          <div
            style={{
              padding: '5px 12px',
              borderRadius: '14px',
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              border: '1.5px solid #fbbf24',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              boxShadow: '0 8px 24px rgba(251, 191, 36, 0.3)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>✝️</span>
            <span>Bàn Thờ Chúa & Thánh Giá • Cầu Bình An & Sáng Suốt</span>
          </div>
        </Html>
      )}
    </group>
  );
}

