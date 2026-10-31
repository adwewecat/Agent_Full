/**
 * @file App.tsx
 * @description Component trung tâm liên kết Scene 3D Isometric và Dashboard HUD điều khiển AI Agents.
 */

import { useCallback } from 'react';
import { useAgentStore } from './hooks/useAgentStore';
import { OfficeScene } from './components/OfficeScene';
import { DashboardHUD } from './components/DashboardHUD';

export function App() {
  const {
    agents,
    workstations,
    selectedAgentId,
    clickTarget,
    selectAgent,
    setAgentTarget,
    completeMovement,
    dispatchToWorkstation,
    simulateBackendEvent
  } = useAgentStore();

  /**
   * Xử lý khi người dùng click chuột vào sàn nhà (Click-to-Move)
   */
  const handleFloorClick = useCallback(
    (point: [number, number, number]) => {
      if (!selectedAgentId) return;
      setAgentTarget(selectedAgentId, point);
    },
    [selectedAgentId, setAgentTarget]
  );

  /**
   * Xử lý khi người dùng nhấp trực tiếp vào một trạm làm việc trong 3D
   */
  const handleSelectWorkstation = useCallback(
    (stationId: string) => {
      if (!selectedAgentId) return;
      dispatchToWorkstation(selectedAgentId, stationId);
    },
    [selectedAgentId, dispatchToWorkstation]
  );

  return (
    <div className="app-container">
      {/* 1. Canvas 3D mô phỏng văn phòng góc nhìn Isometric God-View */}
      <OfficeScene
        agents={agents}
        workstations={workstations}
        selectedAgentId={selectedAgentId}
        clickTarget={clickTarget}
        onSelectAgent={selectAgent}
        onFloorClick={handleFloorClick}
        onArrival={completeMovement}
        onSelectWorkstation={handleSelectWorkstation}
      />

      {/* 2. Giao diện HUD giám sát và ra lệnh cho AI Agents */}
      <DashboardHUD
        agents={agents}
        workstations={workstations}
        selectedAgentId={selectedAgentId}
        onSelectAgent={selectAgent}
        onDispatchToStation={dispatchToWorkstation}
        onSimulateBackendEvent={simulateBackendEvent}
      />
    </div>
  );
}

export default App;
