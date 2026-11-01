/**
 * @file Agent.tsx
 * @description Component nhân vật 3D đại diện cho AI Agent trong văn phòng ảo.
 * Nâng cấp phong cách nghệ thuật đa sắc màu (Artistic & Colorful), phụ kiện đặc trưng
 * (Cyber Visor, Gaming Headphones, Cat Ears, Cap), và bong bóng suy nghĩ hoạt hình
 * (Thought / Speech Bubbles) lấy cảm hứng trực tiếp từ pixel-agents-hq/pixel-agents.
 */

import { useRef, useEffect, useMemo, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Html } from '@react-three/drei';
import * as THREE from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import { AgentStatus } from '../types/agent';

export interface AgentProps {
  id: string;
  name?: string;
  codename?: string;
  role?: string;
  position: [number, number, number];
  targetPosition?: [number, number, number] | null;
  status: AgentStatus;
  color?: string;
  accentColor?: string;
  accessory?: 'cyber-visor' | 'headphones' | 'cat-ears' | 'cap';
  thoughtIcon?: string;
  thoughtText?: string;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onArrival?: (id: string, finalPosition: [number, number, number], nextStatus: AgentStatus) => void;
  modelUrl?: string;
}

/**
 * Phụ kiện 3D đặc trưng cho từng nhân vật để tạo cá tính và màu sắc rực rỡ
 */
function AgentAccessory({
  type,
  color = '#38bdf8',
  accentColor = '#f43f5e'
}: {
  type?: 'cyber-visor' | 'headphones' | 'cat-ears' | 'cap';
  color?: string;
  accentColor?: string;
}) {
  if (!type) return null;

  switch (type) {
    case 'cyber-visor':
      // Kính bảo hộ Cyberpunk phát quang neon
      return (
        <group position={[0, 1.08, 0.16]}>
          <mesh>
            <boxGeometry args={[0.3, 0.08, 0.08]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.6}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
          <mesh position={[0, 0, 0.045]}>
            <boxGeometry args={[0.26, 0.05, 0.02]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      );

    case 'headphones':
      // Tai nghe chụp tai Gaming cỡ lớn phát sáng
      return (
        <group position={[0, 1.15, 0]}>
          {/* Vòm tai nghe trên đỉnh đầu */}
          <mesh position={[0, 0.1, 0]}>
            <torusGeometry args={[0.2, 0.025, 8, 24, Math.PI]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} />
          </mesh>
          {/* Củ tai nghe trái */}
          <mesh position={[-0.2, -0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.07, 0.07, 0.06, 16]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
          </mesh>
          {/* Củ tai nghe phải */}
          <mesh position={[0.2, -0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.07, 0.07, 0.06, 16]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
          </mesh>
        </group>
      );

    case 'cat-ears':
      // Tai mèo phát quang phong cách streamer công nghệ
      return (
        <group position={[0, 1.25, 0]}>
          {/* Băng đô */}
          <mesh position={[0, 0, 0]}>
            <torusGeometry args={[0.18, 0.02, 8, 24, Math.PI]} />
            <meshStandardMaterial color="#1e1b4b" />
          </mesh>
          {/* Tai mèo trái */}
          <mesh position={[-0.12, 0.06, 0]} rotation={[0, 0, 0.25]}>
            <coneGeometry args={[0.06, 0.12, 4]} />
            <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.5} />
          </mesh>
          {/* Tai mèo phải */}
          <mesh position={[0.12, 0.06, 0]} rotation={[0, 0, -0.25]}>
            <coneGeometry args={[0.06, 0.12, 4]} />
            <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.5} />
          </mesh>
        </group>
      );

    case 'cap':
      // Mũ lưỡi trai snapback đội ngược phong cách streetwear năng động
      return (
        <group position={[0, 1.2, -0.04]} rotation={[-0.15, 0, 0]}>
          <mesh position={[0, 0.02, 0]}>
            <sphereGeometry args={[0.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={color} roughness={0.7} />
          </mesh>
          {/* Lưỡi mũ quay về phía sau */}
          <mesh position={[0, 0, -0.18]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.22, 0.02, 0.12]} />
            <meshStandardMaterial color={accentColor} />
          </mesh>
        </group>
      );

    default:
      return null;
  }
}

function AgentModel({
  id,
  name = 'AI Agent',
  codename = 'Agent',
  role = 'Agent',
  position,
  targetPosition,
  status,
  color = '#3b82f6',
  accentColor = '#f59e0b',
  accessory = 'headphones',
  thoughtIcon = '💬',
  thoughtText = 'Sẵn sàng nhận lệnh...',
  isSelected = false,
  onSelect,
  onArrival,
  modelUrl = '/models/agent.glb'
}: AgentProps) {
  const group = useRef<THREE.Group>(null);
  const currentPos = useRef(new THREE.Vector3(...position));

  // Tải model GLTF
  const gltf = useGLTF(modelUrl);
  const clone = useMemo(() => {
    const clonedScene = SkeletonUtils.clone(gltf.scene);
    // Tinh chỉnh vật liệu để nhân vật có màu sắc tươi tắn và nổi khối nghệ thuật
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material) {
          const mat = (mesh.material as THREE.Material).clone() as THREE.MeshStandardMaterial;
          mat.roughness = 0.45;
          mat.metalness = 0.1;
          mesh.material = mat;
        }
      }
    });
    return clonedScene;
  }, [gltf.scene]);

  const { actions, names } = useAnimations(gltf.animations, group);

  // Ánh xạ clip hoạt ảnh linh hoạt
  const animationMap = useMemo(() => {
    const findClip = (candidates: string[]) => {
      for (const candidate of candidates) {
        const found = names.find((n) => n.toLowerCase() === candidate.toLowerCase());
        if (found) return found;
      }
      return names[0] || null;
    };

    return {
      idle: findClip(['Idle', 'idle', 'static']),
      walk: findClip(['Walk', 'walk', 'sprint']),
      typing: findClip(['Typing', 'typing', 'sit', 'interact-right', 'interact-left', 'idle'])
    };
  }, [names]);

  // Quản lý chuyển đổi mượt mà giữa các animation
  useEffect(() => {
    let targetClipName: string | null = null;

    if (status === 'moving') {
      targetClipName = animationMap.walk;
    } else if (status === 'working' || status === 'reviewing') {
      targetClipName = animationMap.typing;
    } else {
      targetClipName = animationMap.idle;
    }

    if (targetClipName && actions[targetClipName]) {
      const nextAction = actions[targetClipName];
      if (nextAction) {
        nextAction.reset().fadeIn(0.25).play();
        return () => {
          nextAction.fadeOut(0.25);
        };
      }
    }
  }, [status, actions, animationMap]);

  // Vòng lặp cập nhật chuyển động và xoay góc nhìn trong useFrame
  useFrame((_, delta) => {
    if (!group.current) return;

    if (targetPosition) {
      const targetVec = new THREE.Vector3(targetPosition[0], targetPosition[1], targetPosition[2]);
      const distance = currentPos.current.distanceTo(targetVec);

      if (distance > 0.06) {
        // Xoay hướng mặt về đích
        const dx = targetVec.x - currentPos.current.x;
        const dz = targetVec.z - currentPos.current.z;
        const targetAngle = Math.atan2(dx, dz);

        let diff = targetAngle - group.current.rotation.y;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        group.current.rotation.y += diff * Math.min(delta * 12, 1);

        // Nội suy vị trí di chuyển
        const step = Math.min((delta * 3.2) / distance, 1);
        currentPos.current.lerp(targetVec, step);
        group.current.position.copy(currentPos.current);
      } else {
        group.current.position.copy(targetVec);
        currentPos.current.copy(targetVec);

        if (onArrival) {
          const isAtWorkstation = targetVec.x !== 0 || targetVec.z !== 0;
          onArrival(
            id,
            [targetVec.x, targetVec.y, targetVec.z],
            isAtWorkstation ? 'working' : 'idle'
          );
        }
      }
    } else {
      group.current.position.copy(currentPos.current);
    }
  });

  return (
    <group
      ref={group}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        if (onSelect) onSelect(id);
      }}
    >
      {/* 3D Model nhân vật */}
      <primitive object={clone} scale={1.25} />

      {/* Phụ kiện độc đáo theo từng Agent */}
      <AgentAccessory type={accessory} color={color} accentColor={accentColor} />

      {/* Vòng hào quang phát sáng dưới chân khi được chọn */}
      {isSelected && (
        <group position={[0, 0.02, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.5, 0.62, 32]} />
            <meshBasicMaterial color={color} transparent opacity={0.9} side={THREE.DoubleSide} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.5, 32]} />
            <meshBasicMaterial color={color} transparent opacity={0.15} />
          </mesh>
        </group>
      )}

      {/* Đĩa bóng tiếp đất mềm */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.38, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.28} />
      </mesh>

      {/* 🗨️ BONG BÓNG SUY NGHĨ / HỘI THOẠI (Thought Bubble - Phong cách Pixel-Agents) */}
      <Html position={[0, 2.25, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
        <div className="thought-bubble-wrapper">
          <div
            className="thought-bubble"
            style={{
              borderColor: color,
              boxShadow: `0 4px 16px ${color}44, 0 2px 6px rgba(0,0,0,0.4)`
            }}
          >
            <span className="thought-icon">{thoughtIcon}</span>
            <span className="thought-text">{thoughtText}</span>
          </div>
          {/* Mũi tên đuôi bong bóng chỉ xuống nhân vật */}
          <div className="thought-arrow" style={{ borderTopColor: color }} />
        </div>
      </Html>

      {/* 🏷️ Thẻ định danh & Trạng thái nổi trên đầu Agent */}
      <Html position={[0, 1.8, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 10px',
            borderRadius: '20px',
            backgroundColor: isSelected ? 'rgba(15, 23, 42, 0.95)' : 'rgba(15, 23, 42, 0.78)',
            border: `1.5px solid ${isSelected ? color : 'rgba(255, 255, 255, 0.16)'}`,
            boxShadow: isSelected ? `0 0 14px ${color}88` : '0 2px 8px rgba(0,0,0,0.3)',
            whiteSpace: 'nowrap',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '11px',
            color: '#ffffff',
            fontWeight: 700,
            backdropFilter: 'blur(6px)',
            transition: 'all 0.25s ease'
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor:
                status === 'working' ? '#10b981' : status === 'moving' ? '#f59e0b' : '#64748b',
              boxShadow:
                status === 'working'
                  ? '0 0 10px #10b981'
                  : status === 'moving'
                  ? '0 0 10px #f59e0b'
                  : 'none'
            }}
          />
          <span style={{ color }}>{codename}</span>
          <span style={{ color: '#94a3b8', fontSize: '9.5px', fontWeight: 500 }}>({name} • {role})</span>
        </div>
      </Html>
    </group>
  );
}

export function Agent(props: AgentProps) {
  return (
    <Suspense fallback={null}>
      <AgentModel {...props} />
    </Suspense>
  );
}

useGLTF.preload('/models/agent_researcher.glb');
useGLTF.preload('/models/agent_coder.glb');
useGLTF.preload('/models/agent_reviewer.glb');
useGLTF.preload('/models/agent_devops.glb');
