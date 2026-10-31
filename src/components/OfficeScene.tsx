/**
 * @file OfficeScene.tsx
 * @description Scene 3D chính mô phỏng văn phòng làm việc nhìn từ góc độ trên cao (God view / Isometric).
 * Tích hợp Canvas, PerspectiveCamera Isometric, OrbitControls có giới hạn góc xoay,
 * ánh sáng dịu tạo bóng nhẹ (Soft Shadows), sàn nhà raycaster tương tác Click-to-Move,
 * các trạm làm việc và đội ngũ AI Agent.
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

interface OfficeSceneProps {
  agents: AgentData[];
  workstations: WorkstationData[];
  selectedAgentId: string | null;
  clickTarget: [number, number, number] | null;
  onSelectAgent: (id: string | null) => void;
  onFloorClick: (point: [number, number, number]) => void;
  onArrival: (id: string, finalPosition: [number, number, number], nextStatus: AgentStatus) => void;
  onSelectWorkstation: (stationId: string) => void;
}

export function OfficeScene({
  agents,
  workstations,
  selectedAgentId,
  clickTarget,
  onSelectAgent,
  onFloorClick,
  onArrival,
  onSelectWorkstation
}: OfficeSceneProps) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        shadows
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05
        }}
      >
        {/* 1. Camera góc nhìn Isometric / God-View (nghiêng ~50 độ từ trên cao nhìn xuống) */}
        <PerspectiveCamera
          makeDefault
          position={[11, 13, 11]}
          fov={36}
          near={0.1}
          far={100}
        />

        {/* 2. OrbitControls điều hướng với giới hạn góc xoay để giữ vững góc nhìn văn phòng */}
        <OrbitControls
          target={[0, 0, 0]}
          minPolarAngle={Math.PI / 6} // Không cho camera đi quá thẳng từ trên đỉnh đầu (giới hạn 30 độ)
          maxPolarAngle={Math.PI / 2.15} // Không cho camera chìm xuống dưới sàn nhà (giới hạn ~80 độ)
          minDistance={6} // Khoảng cách zoom vào gần nhất
          maxDistance={26} // Khoảng cách zoom ra xa nhất
          enableDamping
          dampingFactor={0.06}
          rotateSpeed={0.7}
        />

        {/* 3. Hệ thống ánh sáng dịu (Ambient + Directional Shadows) */}
        {/* Ánh sáng môi trường tổng thể dịu mắt */}
        <ambientLight intensity={0.9} color="#e0f2fe" />

        {/* Đèn chính chiếu góc xiên tạo bóng đổ mềm mại (Key Directional Light) */}
        <directionalLight
          position={[12, 18, 10]}
          intensity={1.6}
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

        {/* Đèn phụ hắt ánh xanh công nghệ nhẹ nhàng (Fill Light) */}
        <directionalLight
          position={[-10, 8, -10]}
          intensity={0.5}
          color="#38bdf8"
        />

        {/* 4. Sàn nhà tương tác raycaster Click-to-Move */}
        {/* Bề mặt sàn bắt sự kiện click chuột */}
        <mesh
          position={[0, 0, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          onPointerDown={(event) => {
            event.stopPropagation();
            // Lấy tọa độ Vector3 tương ứng từ raycaster
            const { point } = event;
            onFloorClick([point.x, 0, point.z]);
          }}
          receiveShadow
        >
          <planeGeometry args={[20, 18]} />
          {/* Vật liệu bắt bóng đổ nhưng trong suốt (Shadow Catcher) */}
          <shadowMaterial opacity={0.25} />
        </mesh>

        {/* 5. Không gian môi trường văn phòng (Tường, thảm, cây xanh, grid) */}
        <OfficeEnvironment />

        {/* 6. Vòng chỉ thị điểm đích khi click (Target Marker) */}
        <TargetMarker position={clickTarget} />

        {/* 7. Danh sách các trạm làm việc (Workstations) */}
        {workstations.map((station) => (
          <Workstation
            key={station.id}
            data={station}
            onSelectStation={onSelectWorkstation}
          />
        ))}

        {/* 8. Danh sách AI Agents với model GLTF, Animations và di chuyển useFrame */}
        <Suspense fallback={null}>
          {agents.map((agent) => (
            <Agent
              key={agent.id}
              id={agent.id}
              name={agent.name}
              role={agent.role}
              position={agent.position}
              targetPosition={agent.targetPosition}
              status={agent.status}
              color={agent.color}
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
