/**
 * @file DashboardHUD.tsx
 * @description Giao diện điều khiển và giám sát (HUD Overlay) phong cách Glassmorphism hiện đại.
 * Cung cấp danh sách Agents thời gian thực, bảng phân công nhiệm vụ,
 * nút giả lập sự kiện backend và hướng dẫn tương tác Click-to-Move.
 */

import { AgentData, WorkstationData } from '../types/agent';
import {
  Activity,
  Bot,
  Compass,
  Cpu,
  Layers,
  Play,
  Sparkles,
  Terminal,
  Wifi
} from 'lucide-react';

interface DashboardHUDProps {
  agents: AgentData[];
  workstations: WorkstationData[];
  selectedAgentId: string | null;
  onSelectAgent: (id: string) => void;
  onDispatchToStation: (agentId: string, stationId: string) => void;
  onSimulateBackendEvent: () => void;
}

export function DashboardHUD({
  agents,
  workstations,
  selectedAgentId,
  onSelectAgent,
  onDispatchToStation,
  onSimulateBackendEvent
}: DashboardHUDProps) {
  const selectedAgent = agents.find((a) => a.id === selectedAgentId);
  const workingCount = agents.filter((a) => a.status === 'working').length;
  const movingCount = agents.filter((a) => a.status === 'moving').length;

  return (
    <div className="hud-container">
      {/* 1. Header trên cùng */}
      <header className="hud-header">
        <div className="hud-logo">
          <div className="hud-logo-icon">
            <Cpu size={20} color="#38bdf8" />
          </div>
          <div>
            <h1 className="hud-title">Agent_Full • 3D Command Center</h1>
            <p className="hud-subtitle">Isometric God-View Multi-Agent Office Monitor</p>
          </div>
        </div>

        {/* Thống kê nhanh */}
        <div className="hud-stats">
          <div className="hud-stat-pill">
            <Wifi size={14} color="#10b981" />
            <span>Backend Sync: Live</span>
          </div>
          <div className="hud-stat-pill">
            <Activity size={14} color="#38bdf8" />
            <span>
              {workingCount} Working • {movingCount} Moving • {agents.length} Total Agents
            </span>
          </div>
        </div>
      </header>

      {/* 2. Sidebar bên trái: Danh sách và điều khiển Agent */}
      <aside className="hud-sidebar">
        <div className="hud-panel-title">
          <Bot size={16} color="#38bdf8" />
          <span>ĐỘI NGŨ AI AGENT</span>
        </div>

        <div className="hud-agent-list">
          {agents.map((agent) => {
            const isSelected = agent.id === selectedAgentId;
            return (
              <div
                key={agent.id}
                onClick={() => onSelectAgent(agent.id)}
                className={`hud-agent-card ${isSelected ? 'selected' : ''}`}
                style={{
                  borderLeft: `4px solid ${agent.color}`
                }}
              >
                <div className="hud-agent-card-header">
                  <span className="hud-agent-name">{agent.name}</span>
                  <span
                    className={`hud-status-badge ${agent.status}`}
                  >
                    {agent.status === 'working'
                      ? 'Typing / Working'
                      : agent.status === 'moving'
                      ? 'Walking'
                      : 'Idle'}
                  </span>
                </div>

                <div className="hud-agent-role">{agent.role}</div>

                <div className="hud-agent-task">
                  <Terminal size={12} color="#94a3b8" />
                  <span className="hud-task-text">{agent.currentTask}</span>
                </div>

                {/* Thanh tiến độ */}
                {agent.status === 'working' && (
                  <div className="hud-progress-bar">
                    <div
                      className="hud-progress-fill"
                      style={{ width: `${agent.progress}%`, backgroundColor: agent.color }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bảng điều phối nhanh trạm làm việc cho Agent đang chọn */}
        {selectedAgent && (
          <div className="hud-quick-dispatch">
            <div className="hud-panel-title small">
              <Layers size={14} color="#f59e0b" />
              <span>ĐIỀU PHỐI: {selectedAgent.name.toUpperCase()}</span>
            </div>
            <div className="hud-station-buttons">
              {workstations.map((st) => (
                <button
                  key={st.id}
                  className="hud-station-btn"
                  onClick={() => onDispatchToStation(selectedAgent.id, st.id)}
                >
                  <Play size={10} />
                  <span>{st.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* 3. Thanh điều khiển phía dưới đáy (Bottom Control Bar) */}
      <footer className="hud-footer">
        <div className="hud-tip">
          <Compass size={16} color="#38bdf8" />
          <span>
            <strong>Hướng dẫn:</strong> Nhấp chọn Agent trên danh sách hoặc trong 3D, sau đó <strong>click bất kỳ đâu trên sàn nhà</strong> để ra lệnh di chuyển (Click-to-Move).
          </span>
        </div>

        <div className="hud-actions">
          {/* Nút giả lập Backend Push Event */}
          <button
            className="hud-action-btn primary"
            onClick={onSimulateBackendEvent}
            title="Mô phỏng tín hiệu thay đổi trạng thái từ backend đẩy về"
          >
            <Sparkles size={16} />
            <span>Mô phỏng Sự Kiện Backend</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
