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
import { AgentData, WorkstationData, SpiritualProjectile } from '../types/agent';
import { Agent } from './Agent';
import { OfficeEnvironment } from './OfficeEnvironment';
import { Workstation } from './Workstation';
import { TargetMarker } from './TargetMarker';
import { GitCat } from './GitCat';
import { BuddhaShrine } from './BuddhaShrine';
import { ChristianShrine } from './ChristianShrine';
import { SpiritualEffects } from './SpiritualEffects';

interface OfficeSceneProps {
  agents: AgentData[];
  workstations: WorkstationData[];
  selectedAgentId: string | null;
  clickTarget: [number, number, number] | null;
  projectiles?: SpiritualProjectile[];
  buddhaSpeech?: string | null;
  christianSpeech?: string | null;
  buddhaMiracleActive?: boolean;
  christianMiracleActive?: boolean;
  onSelectAgent: (id: string | null) => void;
  onFloorClick: (point: [number, number, number]) => void;
  onArrival: (id: string, finalPosition: [number, number, number]) => void;
  onSelectWorkstation: (stationId: string) => void;
  onPetCat?: () => void;
  onPray?: () => void;
  onPrayChristian?: () => void;
  isPrayingAny?: boolean;
  onDodgeTrigger?: (agentId: string, threatType: 'nail' | 'bead') => void;
}

export function OfficeScene({
  agents,
  workstations,
  selectedAgentId,
  clickTarget,
  projectiles = [],
  buddhaSpeech = null,
  christianSpeech = null,
  buddhaMiracleActive = false,
  christianMiracleActive = false,
  onSelectAgent,
  onFloorClick,
  onArrival,
  onSelectWorkstation,
  onPetCat,
  onPray,
  onPrayChristian,
  isPrayingAny,
  onDodgeTrigger
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
        {/* 1. Camera góc nhìn từ tầng lửng Mezzanine nhìn xuống phòng hội nghị (High Executive Balcony View) */}
        <PerspectiveCamera
          makeDefault
          position={[0, 14.2, 9.6]}
          fov={38}
          near={0.1}
          far={100}
        />

        {/* 2. OrbitControls điều hướng với giới hạn góc xoay để giữ vững góc nhìn văn phòng */}
        <OrbitControls
          target={[0, 0.8, -0.6]}
          minPolarAngle={Math.PI / 8}
          maxPolarAngle={Math.PI / 2.2}
          minDistance={6}
          maxDistance={28}
          enableDamping
          dampingFactor={0.06}
          rotateSpeed={0.7}
        />

        {/* 3. Hệ thống ánh sáng tự nhiên ban ngày ngập tràn (Bright Natural Daylight Lighting) */}
        {/* Ánh sáng môi trường dịu sáng ngập tràn khắp phòng */}
        <ambientLight intensity={1.3} color="#ffffff" />

        {/* Ánh nắng tự nhiên chiếu xiên từ cụm cửa sổ kính bên trái (Left Windows Daylight) */}
        <directionalLight
          position={[-12, 16, 4]}
          intensity={1.8}
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

        {/* Đèn phụ hắt từ phía đối diện tạo cân bằng tương phản */}
        <directionalLight
          position={[10, 12, -4]}
          intensity={0.65}
          color="#f8fafc"
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

        {/* 6.5. Bàn thờ & Kim Thân Tượng Phật trang nghiêm (Buddha Shrine đặt góc tường hậu bên trái) */}
        <BuddhaShrine
          position={[-2.4, 0, -4.8]}
          rotation={0}
          onPray={onPray}
          isPrayingAny={isPrayingAny}
          speechText={buddhaSpeech}
          isMiracleActive={buddhaMiracleActive}
        />

        {/* 6.6. Bàn thờ Chúa & Cây Thánh Giá mạ vàng uy nghi (Christian Shrine đặt góc tường hậu bên phải) */}
        <ChristianShrine
          position={[2.4, 0, -4.8]}
          rotation={0}
          onPray={onPrayChristian}
          isPrayingAny={isPrayingAny}
          speechText={christianSpeech}
          isMiracleActive={christianMiracleActive}
        />

        {/* 6.7. Hệ thống Hiệu ứng Thần Tích & Đạn Đạo Tâm Linh (Holy Nails & Prayer Beads + Dodge Reactions) */}
        <SpiritualEffects
          projectiles={projectiles}
          buddhaMiracleActive={buddhaMiracleActive}
          christianMiracleActive={christianMiracleActive}
          agents={agents}
          onDodgeTrigger={onDodgeTrigger}
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
