/**
 * @file OfficeScene.tsx
 * @description Scene 3D chính mô phỏng văn phòng làm việc nhìn từ góc độ trên cao (God view / Isometric).
 * Tích hợp Canvas, PerspectiveCamera Isometric, OrbitControls có giới hạn góc xoay,
 * ánh sáng nghệ thuật ấm cúng (Cozy Golden Key Light + Cyber Cyan Fill Light),
 * linh vật mèo GitCat, sàn nhà raycaster tương tác Click-to-Move,
 * các trạm làm việc và đội ngũ AI Agent đầy màu sắc.
 */

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { AgentData, WorkstationData, AgentStatus } from '../types/agent';
import { Agent } from './Agent';
import { OfficeEnvironment } from './OfficeEnvironment';
import { Workstation } from './Workstation';
import { TargetMarker } from './TargetMarker';
import { GitCat } from './GitCat';
import { BuddhaShrine } from './BuddhaShrine';

interface OfficeSceneProps {
  agents: AgentData[];
  workstations: WorkstationData[];
  selectedAgentId: string | null;
  clickTarget: [number, number, number] | null;
  onSelectAgent: (id: string | null) => void;
  onFloorClick: (point: [number, number, number]) => void;
  onArrival: (id: string, finalPosition: [number, number, number], nextStatus: AgentStatus) => void;
  onSelectWorkstation: (stationId: string) => void;
  onPetCat?: () => void;
  onPray?: () => void;
  isPrayingAny?: boolean;
}

export function OfficeScene({
  agents,
  workstations,
  selectedAgentId,
  clickTarget,
  onSelectAgent,
  onFloorClick,
  onArrival,
  onSelectWorkstation,
  onPetCat,
  onPray,
  isPrayingAny
}: OfficeSceneProps) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        shadows
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15
        }}
      >
        {/* 1. Camera góc nhìn Isometric / God-View (nghiêng ~50 độ từ trên cao nhìn xuống) */}
        <PerspectiveCamera
          makeDefault
          position={[11.5, 13.5, 11.5]}
          fov={36}
          near={0.1}
          far={100}
        />

        {/* 2. OrbitControls điều hướng với giới hạn góc xoay để giữ vững góc nhìn văn phòng */}
        <OrbitControls
          target={[0, 0, 0]}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.15}
          minDistance={6}
          maxDistance={26}
          enableDamping
          dampingFactor={0.06}
          rotateSpeed={0.7}
        />

        {/* 3. Hệ thống ánh sáng kiến trúc cao cấp & tương phản (Artistic Executive Cinematic Lighting) */}
        {/* Ánh sáng môi trường dịu sáng tự nhiên */}
        <ambientLight intensity={1.1} color="#f8fafc" />

        {/* Đèn chính chiếu xiên góc màu nắng hoàng hôn ấm áp tạo bóng đổ mềm sắc nét */}
        <directionalLight
          position={[14, 18, 12]}
          intensity={1.9}
          color="#fffbeb"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={45}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
          shadow-bias={-0.0001}
        />

        {/* Đèn phụ hắt ánh xanh Cyberpunk Hologram tạo viền sáng công nghệ cao */}
        <directionalLight
          position={[-12, 10, -12]}
          intensity={0.8}
          color="#38bdf8"
        />

        {/* 4. Sàn nhà tương tác raycaster Click-to-Move */}
        <mesh
          position={[0, 0, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          onPointerDown={(event) => {
            event.stopPropagation();
            const { point } = event;
            onFloorClick([point.x, 0, point.z]);
          }}
          receiveShadow
        >
          <planeGeometry args={[22, 20]} />
          <shadowMaterial opacity={0.28} />
        </mesh>

        {/* 5. Không gian môi trường văn phòng nghệ thuật (Sàn gỗ, thảm, cây xanh, whiteboard) */}
        <OfficeEnvironment />

        {/* 6. Vòng chỉ thị điểm đích khi click (Target Marker) */}
        <TargetMarker position={clickTarget} />

        {/* 6.5. Bàn thờ & Kim Thân Tượng Phật trang nghiêm (Buddha Shrine) */}
        <BuddhaShrine
          position={[-0.5, 0, -5.4]}
          rotation={0}
          onPray={onPray}
          isPrayingAny={isPrayingAny}
        />

        {/* 7. Danh sách các trạm làm việc (Workstations) */}
        {workstations.map((station) => (
          <Workstation
            key={station.id}
            data={station}
            onSelectStation={onSelectWorkstation}
          />
        ))}

        {/* 8. Linh vật văn phòng GitCat 🐱 đi dạo tự do */}
        <GitCat onPetCat={onPetCat} />

        {/* 9. Đội ngũ AI Agents đầy màu sắc với model GLTF, Animations và Thought Bubbles */}
        <Suspense fallback={null}>
          {agents.map((agent) => (
            <Agent
              key={agent.id}
              id={agent.id}
              name={agent.name}
              codename={agent.codename}
              role={agent.role}
              position={agent.position}
              targetPosition={agent.targetPosition}
              targetRotation={agent.targetRotation}
              isSeated={agent.isSeated}
              status={agent.status}
              blessed={agent.blessed}
              color={agent.color}
              accentColor={agent.accentColor}
              accessory={agent.accessory}
              thoughtIcon={agent.thoughtIcon}
              thoughtText={agent.thoughtText}
              isSelected={selectedAgentId === agent.id}
              onSelect={onSelectAgent}
              onArrival={onArrival}
              modelUrl={agent.modelUrl}
            />
          ))}
        </Suspense>
      </Canvas>
    </div>
  );
}
