/**
 * @file App.tsx
 * @description Component trung tâm liên kết Scene 3D Isometric và Dashboard HUD điều khiển AI Agents.
 * Tích hợp Hội Đồng Lãnh Đạo C-Suite (COO Bác Nam, CFO Bác Thắng, CRO Bác Hoàng),
 * Modal cấu hình 3 Gemini AI Key và Modal Báo Cáo Thống Nhất Chiến Lược.
 */

import { useState, useCallback } from 'react';
import { useAgentStore } from './hooks/useAgentStore';
import { OfficeScene } from './components/OfficeScene';
import { DashboardHUD } from './components/DashboardHUD';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ExecutiveDebateModal } from './components/ExecutiveDebateModal';
import { getRandomGitCatReaction } from './data/dialogueBank';

export function App() {
  const {
    agents,
    workstations,
    selectedAgentId,
    clickTarget,
    dialogueLogs,
    isPrayingAny,
    projectiles,
    buddhaSpeech,
    christianSpeech,
    buddhaMiracleActive,
    christianMiracleActive,
    isDebating,
    activeDebateSession,
    pastSessions,
    consensusModalReport,
    setConsensusModalReport,
    startExecutiveDebate,
    selectAgent,
    setAgentTarget,
    completeMovement,
    dispatchToWorkstation,
    teamPrayer,
    christianPrayer,
    castBuddhaMiracle,
    castChristianMiracle,
    triggerAgentDodge,
    simulateBackendEvent,
    addDialogue
  } = useAgentStore();

  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

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

  /**
   * Tương tác với chú mèo văn phòng GitCat 🐱
   */
  const handlePetCat = useCallback(() => {
    const reaction = getRandomGitCatReaction();
    addDialogue(
      'GitCat',
      '#ea580c',
      reaction,
      '🐾',
      undefined,
      'casual'
    );
  }, [addDialogue]);

  return (
    <div className="app-container">
      {/* 1. Canvas 3D mô phỏng văn phòng góc nhìn Isometric God-View */}
      <OfficeScene
        agents={agents}
        workstations={workstations}
        selectedAgentId={selectedAgentId}
        clickTarget={clickTarget}
        projectiles={projectiles}
        buddhaSpeech={buddhaSpeech}
        christianSpeech={christianSpeech}
        buddhaMiracleActive={buddhaMiracleActive}
        christianMiracleActive={christianMiracleActive}
        onSelectAgent={selectAgent}
        onFloorClick={handleFloorClick}
        onArrival={completeMovement}
        onSelectWorkstation={handleSelectWorkstation}
        onPetCat={handlePetCat}
        onPray={castBuddhaMiracle}
        onPrayChristian={castChristianMiracle}
        isPrayingAny={isPrayingAny}
        onDodgeTrigger={triggerAgentDodge}
      />

      {/* 2. Giao diện HUD giám sát và điều hành Ban Giám Đốc C-Suite */}
      <DashboardHUD
        agents={agents}
        selectedAgentId={selectedAgentId}
        dialogueLogs={dialogueLogs}
        isDebating={isDebating}
        activeDebateSession={activeDebateSession}
        pastSessions={pastSessions}
        onSelectAgent={selectAgent}
        onStartDebate={startExecutiveDebate}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenReportModal={(report) => setConsensusModalReport(report)}
        onSimulateBackendEvent={simulateBackendEvent}
        onPetCat={handlePetCat}
        onTeamPrayer={teamPrayer}
        onTeamChristianPrayer={christianPrayer}
        onCastBuddhaMiracle={castBuddhaMiracle}
        onCastChristianMiracle={castChristianMiracle}
      />

      {/* 3. Modal Cấu Hình 3 Gemini API Key Độc Lập */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />

      {/* 4. Modal Hiển Thị Báo Cáo Thống Nhất Chiến Lược (Consensus Report) */}
      <ExecutiveDebateModal
        report={consensusModalReport}
        isOpen={!!consensusModalReport}
        onClose={() => setConsensusModalReport(null)}
      />
    </div>
  );
}

export default App;
