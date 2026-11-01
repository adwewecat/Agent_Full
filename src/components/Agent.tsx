/**
 * @file Agent.tsx
 * @description Component nhân vật 3D đại diện cho AI Agent trong văn phòng điều hành công nghệ.
 * Tích hợp phong cách doanh nhân/chuyên gia công nghệ hiện đại và chân thực (Realistic Executive):
 * - Gương mặt người thật tinh tế (mắt hạnh nhân, lông mày, mũi 3D, môi tự nhiên, mái tóc công sở).
 * - Trang phục vest / blazer doanh nhân (cổ áo sơ mi, ve áo vest, cà vạt lụa, thẻ ID chip an ninh, thắt lưng da).
 * - Đồng hồ thông minh Smartwatch trên cổ tay trái.
 * - Hệ thống định vị tọa độ ngồi ghế công thái học chuẩn xác (Seating Alignment),
 *   bù trừ độ võng trọng tâm hoạt ảnh (Sit Y Compensation) ngăn chặn triệt để lỗi chìm sàn hay ngồi dưới ghế.
 */

import { useRef, useEffect, useMemo, useState, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Html } from '@react-three/drei';
import * as THREE from 'three';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import { AgentStatus } from '../types/agent';
import { createAgentFace } from './AgentFace';
import { createTorsoAttire, createWristWatch } from './AgentAttire';

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
  accessory?: string;
  thoughtIcon?: string;
  thoughtText?: string;
  speechText?: string | null;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onArrival?: (id: string, finalPosition: [number, number, number]) => void;
  modelUrl?: string;
}

function AgentModel({
  id,
  name = 'AI Agent',
  codename = 'Agent',
  position,
  targetPosition,
  targetRotation,
  isSeated = false,
  status,
  blessed = false,
  color = '#3b82f6',
  accentColor = '#f59e0b',
  thoughtIcon = '💬',
  thoughtText = 'Sẵn sàng nhận lệnh...',
  speechText = null,
  isSelected = false,
  onSelect,
  onArrival,
  modelUrl = '/models/agent.glb'
}: AgentProps) {
  const [isHovered, setIsHovered] = useState(false);
  const group = useRef<THREE.Group>(null);
  const currentPos = useRef(new THREE.Vector3(...position));

  // Xác định màu vest/trang phục công sở chuẩn của từng Agent
  const suitColor = useMemo(() => {
    if (codename === 'Pé Na') return '#1e293b'; // Vest xanh Navy lãnh đạo
    if (codename === 'Pé Ken') return '#0f172a'; // Vest xám đen than chì
    if (codename === 'Lão Lục') return '#831843'; // Vest đỏ mận quý phái
    if (codename === 'Lão Cửu') return '#334155'; // Áo len cổ sơ mi xám slate
    return '#1e293b';
  }, [codename]);

  // Tải model GLTF và tách instance skeleton độc lập
  const gltf = useGLTF(modelUrl);
  const clone = useMemo(() => {
    const clonedScene = SkeletonUtils.clone(gltf.scene);

    // Xác định tone màu da tự nhiên và ấm áp theo từng Agent
    const skinColor =
      codename === 'Pé Na'
        ? '#fed7aa' // Trắng hồng tự nhiên
        : codename === 'Pé Ken'
        ? '#fde68a' // Tươi tắn khỏe khoắn
        : codename === 'Lão Lục'
        ? '#fff1f2' // Hồng phấn thanh tú
        : '#fed7aa'; // Ấm áp

    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.name === 'head-mesh') {
          // Tô màu da mặt ấm áp tự nhiên, xóa tan hoàn toàn vẻ trắng bệch ma-nơ-canh
          mesh.material = new THREE.MeshStandardMaterial({
            color: skinColor,
            roughness: 0.55,
            metalness: 0.05
          });
        } else if (mesh.name === 'body-mesh') {
          // Tô màu trang phục Vest công sở thanh lịch
          mesh.material = new THREE.MeshStandardMaterial({
            color: suitColor,
            roughness: 0.45,
            metalness: 0.08
          });
        } else if (mesh.material) {
          const mat = (mesh.material as THREE.Material).clone() as THREE.MeshStandardMaterial;
          mat.roughness = 0.45;
          mat.metalness = 0.08;
          mesh.material = mat;
        }
      }
    });
    return clonedScene;
  }, [gltf.scene, codename, suitColor]);

  // Gắn phụ kiện & trang phục chuyên nghiệp vào các khớp xương tương ứng
  useEffect(() => {
    // 1. Gương mặt người thật tinh tế & mái tóc gắn vào xương 'head'
    const headBone = clone.getObjectByName('head');
    let faceGroup: THREE.Group | null = null;
    if (headBone) {
      const existingFace = headBone.getObjectByName('agent-face-group');
      if (existingFace) headBone.remove(existingFace);

      faceGroup = createAgentFace({
        codename: codename || name,
        color,
        accentColor
      });
      headBone.add(faceGroup);
    }

    // 2. Trang phục công sở (Cổ sơ mi, ve áo Vest, cà vạt, thẻ ID, thắt lưng) gắn vào xương 'torso'
    const torsoBone = clone.getObjectByName('torso');
    let attireGroup: THREE.Group | null = null;
    if (torsoBone) {
      const existingAttire = torsoBone.getObjectByName('agent-torso-attire');
      if (existingAttire) torsoBone.remove(existingAttire);

      attireGroup = createTorsoAttire({
        codename: codename || name,
        suitColor
      });
      torsoBone.add(attireGroup);
    }

    // 3. Đồng hồ thông minh Smartwatch gắn vào xương 'arm-left'
    const armLeftBone = clone.getObjectByName('arm-left');
    let watchGroup: THREE.Group | null = null;
    if (armLeftBone) {
      const existingWatch = armLeftBone.getObjectByName('agent-wrist-watch');
      if (existingWatch) armLeftBone.remove(existingWatch);

      watchGroup = createWristWatch();
      armLeftBone.add(watchGroup);
    }

    return () => {
      if (headBone && faceGroup) headBone.remove(faceGroup);
      if (torsoBone && attireGroup) torsoBone.remove(attireGroup);
      if (armLeftBone && watchGroup) armLeftBone.remove(watchGroup);
    };
  }, [clone, codename, name, color, accentColor, suitColor]);

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
      pray: findClip(['emote-yes', 'holding-both', 'pick-up', 'idle']),
      dodge: findClip(['crouch', 'sit', 'fall', 'idle'])
    };
  }, [names]);

  // Quản lý chuyển đổi mượt mà giữa các animation
  useEffect(() => {
    let targetClipName: string | null = null;

    if (status === 'moving') {
      targetClipName = animationMap.walk;
    } else if (status === 'praying') {
      // Khi bái Phật: phát clip gật đầu vái lạy trang nghiêm (emote-yes)
      targetClipName = animationMap.pray;
    } else if (status === 'dodging') {
      // Khi né đinh / tràng hạt: cúi rạp người né tránh (crouch)
      targetClipName = animationMap.dodge;
    } else if (isSeated) {
      // Khi ngồi ghế (Ghế Giám đốc, ghế xoay hội nghị, sofa VIP)
      targetClipName = animationMap.sit;
    } else {
      // Khi đứng tự do trên sàn: luôn đứng phong thái đĩnh đạc (idle), tuyệt đối không ngồi bệt trên sàn
      targetClipName = animationMap.idle;
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

  // useFrame xử lý di chuyển Lerp 2D trên sàn, xoay người và bù trừ cao độ ngồi ghế chuẩn xác
  useFrame((_, delta) => {
    if (!group.current) return;

    if (targetPosition) {
      const targetVec = new THREE.Vector3(...targetPosition);
      // Tính khoảng cách ngang 2D trên mặt sàn (X, Z) để bước đi tự nhiên
      const diffX = targetVec.x - currentPos.current.x;
      const diffZ = targetVec.z - currentPos.current.z;
      const dist2D = Math.hypot(diffX, diffZ);

      if (dist2D > 0.05) {
        // Tốc độ di chuyển bước chân tự nhiên
        const moveSpeed = 3.2;
        const moveStep = Math.min(dist2D, moveSpeed * delta);
        const dirX = diffX / dist2D;
        const dirZ = diffZ / dist2D;

        currentPos.current.x += dirX * moveStep;
        currentPos.current.z += dirZ * moveStep;
        currentPos.current.y = 0; // Khi đang bước đi, luôn ở cao độ sàn Y = 0

        // Xoay mặt hướng theo chiều bước đi
        const angle = Math.atan2(dirX, dirZ);
        group.current.rotation.y = THREE.MathUtils.lerp(
          group.current.rotation.y,
          angle,
          delta * 12
        );

        // Vị trí khi di chuyển luôn tiếp xúc mặt sàn tại Y = 0
        group.current.position.set(currentPos.current.x, 0, currentPos.current.z);
      } else {
        // Đã bước tới điểm đích an toàn
        currentPos.current.copy(targetVec);
        group.current.position.set(targetVec.x, targetVec.y, targetVec.z);

        if (targetRotation !== undefined && targetRotation !== null) {
          group.current.rotation.y = targetRotation;
        }

        if (onArrival) {
          onArrival(id, [targetVec.x, targetVec.y, targetVec.z]);
        }
      }
    } else {
      // Đang ở trạng thái cố định tại trạm làm việc hoặc trên sàn
      const [destX, destY, destZ] = position;
      currentPos.current.set(destX, destY, destZ);
      group.current.position.set(destX, destY, destZ);

      // Nếu có góc xoay chỉ định sẵn, giữ vững góc đó
      if (targetRotation !== undefined && targetRotation !== null) {
        group.current.rotation.y = THREE.MathUtils.lerp(
          group.current.rotation.y,
          targetRotation,
          delta * 8
        );
      }
    }
  });

  return (
    <group
      ref={group}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setIsHovered(true);
      }}
      onPointerOut={() => setIsHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        if (onSelect) onSelect(id);
      }}
    >
      {/* Mô hình 3D nhân vật */}
      <primitive object={clone} />

      {/* Vòng hào quang phát sáng dưới chân khi được chọn */}
      {isSelected && (
        <mesh position={[0, isSeated ? -0.4 : 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.42, 0.52, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.85} />
        </mesh>
      )}

      {/* Vòng hào quang hoa sen vàng dưới chân khi đang bái Phật */}
      {status === 'praying' && (
        <group position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.65, 32]} />
          <meshBasicMaterial color="#eab308" transparent opacity={0.9} />
        </group>
      )}

      {/* Bóng đổ chân thực mềm mại dưới sàn khi đứng trên sàn */}
      {!isSeated && (
        <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.3, 16]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.28} />
        </mesh>
      )}

      {/* Vòng cảnh báo đỏ rực dưới chân khi đang né đinh / tràng hạt */}
      {status === 'dodging' && (
        <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.35, 0.52, 32]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.85} />
        </mesh>
      )}

      {/* 💬 HỘP THOẠI CHAT TRỰC TIẾP TRÊN ĐẦU NHÂN VẬT (Rõ nét, dễ đọc, tự động hiển thị khi nói) */}
      {speechText && (
        <Html
          position={[0, isSeated ? 2.35 : 2.65, 0]}
          center
          distanceFactor={12}
          style={{ pointerEvents: 'none' }}
        >
          <div
            style={{
              minWidth: '150px',
              maxWidth: '240px',
              padding: '8px 12px',
              borderRadius: '12px',
              backgroundColor: 'rgba(15, 23, 42, 0.96)',
              border: `2px solid ${color}`,
              boxShadow: `0 8px 24px ${color}55, 0 3px 10px rgba(0,0,0,0.6)`,
              backdropFilter: 'blur(8px)',
              color: '#ffffff',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '11px',
              fontWeight: 700,
              lineHeight: '1.45',
              textAlign: 'center',
              userSelect: 'none',
              position: 'relative'
            }}
          >
            <div
              style={{
                fontSize: '9.5px',
                color,
                fontWeight: 800,
                marginBottom: '3px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              <span>💬</span>
              <span>{codename || name} vừa nói:</span>
            </div>
            <div style={{ color: '#f8fafc', fontWeight: 600 }}>
              "{speechText}"
            </div>
            {/* Mũi tên trỏ xuống đầu nhân vật */}
            <div
              style={{
                position: 'absolute',
                bottom: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '7px solid transparent',
                borderRight: '7px solid transparent',
                borderTop: `8px solid ${color}`
              }}
            />
          </div>
        </Html>
      )}

      {/* 🗨️ BONG BÓNG SUY NGHĨ / HỘP THOẠI HÌNH CHỮ NHẬT (Chỉ hiển thị khi không có chat đang nói) */}
      {(isSelected || isHovered || status === 'praying' || status === 'dodging') && !speechText && (
        <Html
          position={[0, isSeated ? 2.15 : 2.45, 0]}
          center
          distanceFactor={14}
          style={{ pointerEvents: 'none' }}
        >
          <div className="thought-bubble-wrapper">
            <div
              className="thought-bubble"
              style={{
                borderColor: status === 'dodging' ? '#ef4444' : color,
                boxShadow:
                  status === 'dodging'
                    ? '0 4px 18px rgba(239, 68, 68, 0.6), 0 2px 8px rgba(0,0,0,0.5)'
                    : `0 4px 18px ${color}44, 0 2px 8px rgba(0,0,0,0.5)`
              }}
            >
              <span className="thought-icon">{status === 'dodging' ? '⚠️' : thoughtIcon}</span>
              <span className="thought-text">{thoughtText}</span>
            </div>
            <div
              className="thought-arrow"
              style={{ borderTopColor: status === 'dodging' ? '#ef4444' : color }}
            />
          </div>
        </Html>
      )}

      {/* 🏷️ Thẻ tên nhỏ gọn và tinh tế nổi trên đầu Agent */}
      <Html
        position={[0, isSeated ? 1.45 : 1.7, 0]}
        center
        distanceFactor={14}
        style={{ pointerEvents: 'none' }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '2px 8px',
            borderRadius: '10px',
            backgroundColor: isSelected ? 'rgba(15, 23, 42, 0.95)' : 'rgba(15, 23, 42, 0.78)',
            border: `1.5px solid ${isSelected ? color : 'rgba(255, 255, 255, 0.18)'}`,
            boxShadow: isSelected ? `0 0 12px ${color}88` : '0 2px 6px rgba(0,0,0,0.3)',
            whiteSpace: 'nowrap',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '10.5px',
            color: '#ffffff',
            fontWeight: 800,
            backdropFilter: 'blur(6px)',
            transition: 'all 0.2s ease'
          }}
        >
          {/* Chấm tròn trạng thái nhỏ xinh */}
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor:
                status === 'dodging'
                  ? '#ef4444'
                  : status === 'working'
                  ? '#10b981'
                  : status === 'moving'
                  ? '#f59e0b'
                  : status === 'praying'
                  ? '#eab308'
                  : '#64748b',
              boxShadow:
                status === 'dodging'
                  ? '0 0 10px #ef4444'
                  : status === 'working'
                  ? '0 0 8px #10b981'
                  : status === 'moving'
                  ? '0 0 8px #f59e0b'
                  : status === 'praying'
                  ? '0 0 10px #eab308'
                  : 'none'
            }}
          />
          {/* Chỉ hiển thị tên ngắn gọn */}
          <span style={{ color }}>{codename || name}</span>
          {blessed && (
            <span title="Được Phật phù hộ: 0% Bug" style={{ fontSize: '9px', lineHeight: 1 }}>
              🙏
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

useGLTF.preload('/models/character-female-a.glb');
useGLTF.preload('/models/character-male-a.glb');
useGLTF.preload('/models/character-female-c.glb');
useGLTF.preload('/models/character-male-c.glb');
useGLTF.preload('/models/agent_researcher.glb');
useGLTF.preload('/models/agent_coder.glb');
useGLTF.preload('/models/agent_reviewer.glb');
useGLTF.preload('/models/agent_devops.glb');
