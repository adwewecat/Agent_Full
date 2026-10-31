/**
 * @file Agent.tsx
 * @description Component nhân vật 3D đại diện cho AI Agent trong văn phòng ảo.
 * Xử lý tải model .gltf/.glb, quản lý animation clips ("Idle", "Walk", "Typing"),
 * và thực hiện di chuyển nội suy mượt mà (lerp position & slerp rotation) trong `useFrame`.
 */

import { useRef, useEffect, useMemo, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Html } from '@react-three/drei';
import * as THREE from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import { AgentStatus } from '../types/agent';

export interface AgentProps {
  /** Mã định danh của Agent */
  id: string;
  /** Tên hiển thị */
  name?: string;
  /** Vai trò của Agent (vd: Researcher, Coder, Reviewer) */
  role?: string;
  /** Tọa độ khởi tạo / hiện tại [X, Y, Z] */
  position: [number, number, number];
  /** Tọa độ đích đến (Vector3 [X, Y, Z]) khi người dùng click-to-move */
  targetPosition?: [number, number, number] | null;
  /** Trạng thái hiện tại: 'idle' | 'working' | 'moving' | 'reviewing' */
  status: AgentStatus;
  /** Màu sắc điểm nhấn của Agent */
  color?: string;
  /** Agent có đang được chọn trên Dashboard không */
  isSelected?: boolean;
  /** Callback khi người dùng nhấp chọn Agent */
  onSelect?: (id: string) => void;
  /** Callback kích hoạt khi Agent đã đi tới tọa độ đích */
  onArrival?: (id: string, finalPosition: [number, number, number], nextStatus: AgentStatus) => void;
  /** Đường dẫn file model 3D (mặc định '/models/agent.glb') */
  modelUrl?: string;
}

/**
 * Component con trực tiếp tải model và quản lý animation qua useAnimations
 */
function AgentModel({
  id,
  name = 'AI Agent',
  role = 'Agent',
  position,
  targetPosition,
  status,
  color = '#3b82f6',
  isSelected = false,
  onSelect,
  onArrival,
  modelUrl = '/models/agent.glb'
}: AgentProps) {
  const group = useRef<THREE.Group>(null);
  const currentPos = useRef(new THREE.Vector3(...position));

  // Tải model GLTF và tách instance skeleton độc lập cho từng Agent
  const gltf = useGLTF(modelUrl);
  const clone = useMemo(() => SkeletonUtils.clone(gltf.scene), [gltf.scene]);
  const { actions, names } = useAnimations(gltf.animations, group);

  // Ánh xạ tên clip hoạt ảnh theo yêu cầu ("Idle", "Walk", "Typing")
  // Đồng thời hỗ trợ linh hoạt các tên clip viết thường từ asset Kenney ("idle", "walk", "sit", "interact-right")
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

  // Quản lý chuyển đổi mượt mà giữa các animation (cross-fade)
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

      // Nếu khoảng cách đến đích lớn hơn ngưỡng sai số (0.05m)
      if (distance > 0.06) {
        // 1. Tính toán góc quay hướng về đích
        const dx = targetVec.x - currentPos.current.x;
        const dz = targetVec.z - currentPos.current.z;
        const targetAngle = Math.atan2(dx, dz);

        // Xoay mượt mà sử dụng lerp góc quay (xử lý wrap around -PI đến +PI)
        let diff = targetAngle - group.current.rotation.y;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        group.current.rotation.y += diff * Math.min(delta * 12, 1);

        // 2. Nội suy vị trí di chuyển mượt mà (Lerp Position)
        // Tốc độ di chuyển khoảng 2.8 m/s
        const step = Math.min((delta * 3.0) / distance, 1);
        currentPos.current.lerp(targetVec, step);
        group.current.position.copy(currentPos.current);
      } else {
        // Đã tới đích thành công
        group.current.position.copy(targetVec);
        currentPos.current.copy(targetVec);

        // Kích hoạt callback hoàn thành di chuyển
        if (onArrival) {
          // Nếu đích là một trạm làm việc (tọa độ đặc biệt hoặc trạng thái chuyển về working/idle)
          const isAtWorkstation = targetVec.x !== 0 || targetVec.z !== 0;
          onArrival(
            id,
            [targetVec.x, targetVec.y, targetVec.z],
            isAtWorkstation ? 'working' : 'idle'
          );
        }
      }
    } else {
      // Đảm bảo vị trí đồng bộ khi không di chuyển
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
      <primitive object={clone} scale={1.2} />

      {/* Vòng hào quang hiển thị lựa chọn trên sàn nhà */}
      {isSelected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.45, 0.55, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.85} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Đĩa bóng tiếp đất nhẹ (Contact drop shadow) */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.35, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.25} />
      </mesh>

      {/* Floating UI HUD (Thẻ định danh & trạng thái nổi trên đầu Agent) */}
      <Html position={[0, 1.8, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 8px',
            borderRadius: '20px',
            backgroundColor: isSelected ? 'rgba(15, 23, 42, 0.92)' : 'rgba(15, 23, 42, 0.75)',
            border: `1.5px solid ${isSelected ? color : 'rgba(255, 255, 255, 0.15)'}`,
            boxShadow: isSelected ? `0 0 12px ${color}66` : '0 2px 6px rgba(0,0,0,0.3)',
            whiteSpace: 'nowrap',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '11px',
            color: '#ffffff',
            fontWeight: 600,
            backdropFilter: 'blur(4px)',
            transition: 'all 0.2s ease'
          }}
        >
          {/* Chấm tròn biểu thị trạng thái */}
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor:
                status === 'working' ? '#10b981' : status === 'moving' ? '#f59e0b' : '#64748b',
              boxShadow:
                status === 'working'
                  ? '0 0 8px #10b981'
                  : status === 'moving'
                  ? '0 0 8px #f59e0b'
                  : 'none'
            }}
          />
          <span>{name}</span>
          <span style={{ color: '#94a3b8', fontSize: '9px', fontWeight: 500 }}>• {role}</span>
        </div>
      </Html>
    </group>
  );
}

/**
 * Fallback geometry tinh tế khi file model đang được tải
 */
function AgentFallback({ position, color = '#3b82f6', name = 'Agent' }: Partial<AgentProps>) {
  return (
    <group position={position}>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 0.8, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 1.15, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#fcd34d" />
      </mesh>
      <Html position={[0, 1.6, 0]} center>
        <div style={{ color: '#ffffff', fontSize: '10px', background: '#0f172a', padding: '2px 6px', borderRadius: '4px' }}>
          {name} (Loading...)
        </div>
      </Html>
    </group>
  );
}

/**
 * Component chính Agent bọc trong Suspense để đảm bảo ứng dụng không bao giờ bị crash
 */
export function Agent(props: AgentProps) {
  return (
    <Suspense fallback={<AgentFallback {...props} />}>
      <AgentModel {...props} />
    </Suspense>
  );
}

// Preload model để tối ưu hiệu năng
useGLTF.preload('/models/agent.glb');
