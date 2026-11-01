/**
 * @file DashboardHUD.tsx
 * @description Giao diện điều khiển và giám sát (HUD Overlay) phong cách nghệ thuật ấm cúng kết hợp Pixel-Agents.
 * Cung cấp thẻ nhân vật Chibi màu mè, bảng phân công nhiệm vụ,
 * hộp thoại tin nhắn thời gian thực (Dialogue Feed), nút giả lập sự kiện backend và tương tác với GitCat.
 */

import { useState } from 'react';
import { AgentData, WorkstationData, DialogueLog } from '../types/agent';
import {
  Activity,
  Bot,
  Compass,
  Cpu,
  Layers,
  MessageSquare,
  Play,
  Sparkles,
  Terminal,
  Wifi,
  Heart
} from 'lucide-react';

interface DashboardHUDProps {
  agents: AgentData[];
  workstations: WorkstationData[];
  selectedAgentId: string | null;
  dialogueLogs: DialogueLog[];
  onSelectAgent: (id: string) => void;
  onDispatchToStation: (agentId: string, stationId: string) => void;
  onSimulateBackendEvent: () => void;
  onPetCat?: () => void;
}

export function DashboardHUD({
  agents,
  workstations,
  selectedAgentId,
  dialogueLogs,
  onSelectAgent,
  onDispatchToStation,
  onSimulateBackendEvent,
  onPetCat
}: DashboardHUDProps) {
  const [showLogs, setShowLogs] = useState(true);
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
            <h1 className="hud-title">Agent_Full • Cozy Pixel & 3D Command Center</h1>
            <p className="hud-subtitle">Góc nhìn God-View Isometric • Giám sát & Điều phối AI Agents</p>
          </div>
        </div>

        {/* Thống kê nhanh */}
        <div className="hud-stats">
          <div className="hud-stat-pill">
            <Wifi size={14} color="#10b981" />
            <span>Backend Sync: Live</span>
          </div>
          <div className="hud-stat-pill">
            <Activity size={14} color="#f59e0b" />
            <span>
              {workingCount} Working • {movingCount} Moving • {agents.length} Agents
            </span>
          </div>
        </div>
      </header>

      {/* Vùng giữa: Sidebar bên trái & Hộp thoại bên phải */}
      <div className="hud-middle-layout">
        {/* 2. Sidebar bên trái: Danh sách và điều khiển Agent */}
        <aside className="hud-sidebar">
          <div className="hud-panel-title">
            <Bot size={16} color="#38bdf8" />
            <span>ĐỘI NGŨ AI AGENT (4 NHÂN SỰ)</span>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="hud-agent-avatar" style={{ backgroundColor: `${agent.color}22`, borderColor: agent.color }}>
                        {agent.thoughtIcon}
                      </span>
                      <div>
                        <span className="hud-agent-name">{agent.codename}</span>
                        <span className="hud-agent-subname"> ({agent.name})</span>
                      </div>
                    </div>

                    <span className={`hud-status-badge ${agent.status}`}>
                      {agent.status === 'working'
                        ? 'Typing'
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
                <span>ĐIỀU PHỐI: {(selectedAgent.codename || selectedAgent.name).toUpperCase()}</span>
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

        {/* 3. Hộp thoại tin nhắn & Suy nghĩ trực tiếp (Real-time Dialogue Feed phong cách Pixel-Agents) */}
        {showLogs && (
          <aside className="hud-dialogue-box">
            <div className="hud-dialogue-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MessageSquare size={14} color="#f59e0b" />
                <span className="hud-dialogue-title">TIẾNG NÓI VĂN PHÒNG (DIALOGUE FEED)</span>
              </div>
              <button
                className="hud-dialogue-toggle"
                onClick={() => setShowLogs(false)}
                title="Thu gọn nhật ký"
              >
                ✕
              </button>
            </div>

            <div className="hud-dialogue-messages">
              {dialogueLogs.map((log) => (
                <div key={log.id} className="hud-dialogue-item">
                  <span className="hud-dialogue-time">{log.timestamp}</span>
                  <span
                    className="hud-dialogue-sender"
                    style={{ color: log.senderColor }}
                  >
                    {log.icon} {log.senderName}:
                  </span>
                  <span className="hud-dialogue-text">{log.message}</span>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>

      {/* 4. Thanh điều khiển phía dưới đáy (Bottom Control Bar) */}
      <footer className="hud-footer">
        <div className="hud-tip">
          <Compass size={16} color="#38bdf8" />
          <span>
            <strong>Hướng dẫn:</strong> Chọn 1 Agent, sau đó <strong>click bất kỳ vị trí nào trên sàn</strong> để di chuyển. Nhấp vào <strong>GitCat 🐱</strong> để vuốt ve!
          </span>
        </div>

        <div className="hud-actions">
          {/* Nút vuốt ve GitCat */}
          <button
            className="hud-action-btn cat"
            onClick={onPetCat}
            title="Tương tác với chú mèo văn phòng GitCat"
          >
            <Heart size={15} color="#ea580c" />
            <span>Vuốt ve GitCat 🐱</span>
          </button>

          {/* Nút giả lập Backend Push Event */}
          <button
            className="hud-action-btn primary"
            onClick={onSimulateBackendEvent}
            title="Mô phỏng tín hiệu thay đổi trạng thái từ backend đẩy về"
          >
            <Sparkles size={15} />
            <span>Sự Kiện Backend</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
