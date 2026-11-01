/**
 * @file Agent.tsx
 * @description Component nhân vật 3D đại diện cho AI Agent trong văn phòng ảo.
 * Xử lý tương thích hình học và tọa độ điểm ngồi chuẩn xác (Seating Alignment),
 * hỗ trợ xoay người hướng về màn hình khi ngồi làm việc, điều chỉnh cao độ bù trừ
 * trọng tâm hoạt ảnh (Sit Y Compensation) để không bao giờ bị ngồi dưới ghế hay chìm sàn.
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
  targetRotation?: number | null;
  isSeated?: boolean;
  status: AgentStatus;
  blessed?: boolean;
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
      return (
        <group position={[0, 1.15, 0]}>
          <mesh position={[0, 0.1, 0]}>
            <torusGeometry args={[0.2, 0.025, 8, 24, Math.PI]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} />
          </mesh>
          <mesh position={[-0.2, -0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.07, 0.07, 0.06, 16]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
          </mesh>
          <mesh position={[0.2, -0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.07, 0.07, 0.06, 16]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
          </mesh>
        </group>
      );

    case 'cat-ears':
      return (
        <group position={[0, 1.25, 0]}>
          <mesh position={[0, 0, 0]}>
            <torusGeometry args={[0.18, 0.02, 8, 24, Math.PI]} />
            <meshStandardMaterial color="#1e1b4b" />
          </mesh>
          <mesh position={[-0.12, 0.06, 0]} rotation={[0, 0, 0.25]}>
            <coneGeometry args={[0.06, 0.12, 4]} />
            <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0.12, 0.06, 0]} rotation={[0, 0, -0.25]}>
            <coneGeometry args={[0.06, 0.12, 4]} />
            <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.5} />
          </mesh>
        </group>
      );

    case 'cap':
      return (
        <group position={[0, 1.2, -0.04]} rotation={[-0.15, 0, 0]}>
          <mesh position={[0, 0.02, 0]}>
            <sphereGeometry args={[0.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={color} roughness={0.7} />
          </mesh>
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
  targetRotation,
  isSeated = false,
  status,
  blessed = false,
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

  // Tải model GLTF và tách instance skeleton độc lập
  const gltf = useGLTF(modelUrl);
  const clone = useMemo(() => {
    const clonedScene = SkeletonUtils.clone(gltf.scene);
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

  // Ánh xạ clip hoạt ảnh linh hoạt (hỗ trợ sit khi ngồi ghế, interact-right khi đứng làm việc)
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
      sit: findClip(['Sit', 'sit', 'crouch', 'idle']),
      typing: findClip(['Interact-right', 'interact-right', 'interact-left', 'Typing', 'typing', 'idle']),
      pray: findClip(['emote-yes', 'holding-both', 'pick-up', 'idle'])
    };
  }, [names]);

  // Quản lý chuyển đổi mượt mà giữa các animation
  useEffect(() => {
    let targetClipName: string | null = null;

    if (status === 'moving') {
      targetClipName = animationMap.walk;
    } else if (status === 'praying') {
      // Khi bái Phật: phát clip gật đầu vái lạy (emote-yes) hoặc chắp tay (holding-both)
      targetClipName = animationMap.pray;
    } else if (status === 'working' || status === 'reviewing') {
      // Khi ngồi ghế: chơi animation sit; khi đứng trước tủ server/arcade: chơi typing/interact
      targetClipName = isSeated ? animationMap.sit : animationMap.typing;
    } else {
      // Khi nghỉ (Idle): nếu ngồi trên sofa thì ngồi, nếu ở sàn thì đứng
      targetClipName = isSeated ? animationMap.sit : animationMap.idle;
    }

    if (targetClipName && actions[targetClipName]) {
      const nextAction = actions[targetClipName];
      if (nextAction) {
        nextAction.reset().fadeIn(0.2).play();
        return () => {
          nextAction.fadeOut(0.2);
        };
      }
    }
  }, [status, isSeated, actions, animationMap]);

  // Đồng bộ vị trí khi props position thay đổi từ bên ngoài
  useEffect(() => {
    if (!targetPosition) {
      currentPos.current.set(...position);
      if (group.current) {
        group.current.position.copy(currentPos.current);
      }
    }
  }, [position, targetPosition]);

  // Vòng lặp cập nhật chuyển động, góc quay và tư thế vái lạy trong useFrame
  useFrame((state, delta) => {
    if (!group.current) return;

    // Xử lý góc cúi người vái lạy Phật nhịp nhàng khi đang ở trạng thái bái Phật
    if (status === 'praying') {
      const bowAngle = Math.max(0, Math.sin(state.clock.getElapsedTime() * 3.8) * 0.28);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, bowAngle, 0.2);
    } else {
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, 0, 0.2);
    }

    if (targetPosition) {
      const targetVec = new THREE.Vector3(targetPosition[0], targetPosition[1], targetPosition[2]);
      // Tính khoảng cách trên mặt phẳng XZ
      const dx = targetVec.x - currentPos.current.x;
      const dz = targetVec.z - currentPos.current.z;
      const distHorizontal = Math.sqrt(dx * dx + dz * dz);

      if (distHorizontal > 0.08) {
        // Đang đi bộ: Hướng mặt theo hướng bước chân
        const targetAngle = Math.atan2(dx, dz);
        let diff = targetAngle - group.current.rotation.y;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        group.current.rotation.y += diff * Math.min(delta * 12, 1);

        // Trong lúc bước đi, chân luôn tiếp đất ở sàn nhà (Y = 0)
        const step = Math.min((delta * 3.2) / distHorizontal, 1);
        currentPos.current.x = THREE.MathUtils.lerp(currentPos.current.x, targetVec.x, step);
        currentPos.current.z = THREE.MathUtils.lerp(currentPos.current.z, targetVec.z, step);
        currentPos.current.y = THREE.MathUtils.lerp(currentPos.current.y, 0, Math.min(delta * 10, 1));
        group.current.position.copy(currentPos.current);
      } else {
        // Đã tới đích thành công:
        // Đặt vị trí chính xác (bao gồm độ cao ngồi trên ghế nếu có)
        currentPos.current.copy(targetVec);
        group.current.position.copy(targetVec);

        // Xoay mặt chính xác về hướng bàn làm việc/màn hình
        if (targetRotation !== null && targetRotation !== undefined) {
          let diff = targetRotation - group.current.rotation.y;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          group.current.rotation.y += diff * Math.min(delta * 10, 1);
        }

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
      // Khi đứng/ngồi yên tại chỗ: Duy trì hướng xoay chuẩn xác
      group.current.position.copy(currentPos.current);
      if (targetRotation !== null && targetRotation !== undefined) {
        let diff = targetRotation - group.current.rotation.y;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        group.current.rotation.y += diff * Math.min(delta * 10, 1);
      }
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

      {/* Vòng hào quang sen vàng linh thiêng dưới chân khi đang bái Phật */}
      {status === 'praying' && (
        <group position={[0, 0.03, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.38, 0.72, 32]} />
            <meshBasicMaterial color="#f59e0b" transparent opacity={0.88} side={THREE.DoubleSide} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.38, 32]} />
            <meshBasicMaterial color="#fef08a" transparent opacity={0.35} />
          </mesh>
        </group>
      )}

      {/* Vòng hào quang phát sáng dưới chân khi được chọn (chỉ hiện khi đứng trên sàn) */}
      {isSelected && !isSeated && (
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

      {/* Đĩa bóng tiếp đất mềm (chỉ hiện khi đứng trên sàn) */}
      {!isSeated && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.38, 32]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.28} />
        </mesh>
      )}

      {/* 🗨️ BONG BÓNG SUY NGHĨ / HỘI THOẠI (Thought Bubble) */}
      <Html
        position={[0, isSeated ? 2.0 : 2.25, 0]}
        center
        distanceFactor={14}
        style={{ pointerEvents: 'none' }}
      >
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
          <div className="thought-arrow" style={{ borderTopColor: color }} />
        </div>
      </Html>

      {/* 🏷️ Thẻ định danh & Trạng thái nổi trên đầu Agent */}
      <Html
        position={[0, isSeated ? 1.55 : 1.8, 0]}
        center
        distanceFactor={14}
        style={{ pointerEvents: 'none' }}
      >
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
                status === 'working'
                  ? '#10b981'
                  : status === 'moving'
                  ? '#f59e0b'
                  : status === 'praying'
                  ? '#eab308'
                  : '#64748b',
              boxShadow:
                status === 'working'
                  ? '0 0 10px #10b981'
                  : status === 'moving'
                  ? '0 0 10px #f59e0b'
                  : status === 'praying'
                  ? '0 0 14px #eab308'
                  : 'none'
            }}
          />
          <span style={{ color }}>{codename}</span>
          <span style={{ color: '#94a3b8', fontSize: '9.5px', fontWeight: 500 }}>({name} • {role})</span>
          {blessed && (
            <span
              title="Đã được Phật phù hộ: 0% Bug, 100% Green Test!"
              style={{
                fontSize: '9px',
                color: '#fef08a',
                backgroundColor: 'rgba(245, 158, 11, 0.35)',
                border: '1px solid #fbbf24',
                padding: '1px 5px',
                borderRadius: '8px',
                fontWeight: 700
              }}
            >
              🙏 0% Bug
            </span>
          )}
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
