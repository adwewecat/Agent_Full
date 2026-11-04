/**
 * @file DashboardHUD.tsx
 * @description Giao diện HUD điều hành Ban Giám Đốc C-Suite F&B & Xuất Nhập Khẩu (COO Bác Nam, CFO Bác Thắng, CRO Bác Hoàng).
 * Tích hợp:
 * 1. Khung CHAT công việc / tranh luận chiến lược ở bên trái, ưu tiên mới nhất lên trước, lọc chỉ hiện trao đổi công việc.
 * 2. Tab lịch sử phiên họp để xem lại các quyết định chiến lược đã lưu trong localStorage.
 * 3. Thanh nhập đề bài chiến lược và nút khởi động tranh luận 3 vòng phản biện độc lập.
 * 4. Nút cấu hình 3 Gemini API Key riêng biệt cho từng Giám Đốc.
 */

import { useState } from 'react';
import { AgentData, DialogueLog } from '../types/agent';
import { DebateSession, ConsensusReport } from '../types/executive';
import {
  Cpu,
  MessageSquare,
  Sparkles,
  Send,
  Key,
  FileText,
  History,
  Search,
  HelpCircle,
  Compass,
  Heart,
  ChevronRight,
  Flame
} from 'lucide-react';

interface DashboardHUDProps {
  agents: AgentData[];
  selectedAgentId: string | null;
  dialogueLogs: DialogueLog[];
  isDebating: boolean;
  activeDebateSession: DebateSession | null;
  pastSessions: DebateSession[];
  onSelectAgent: (id: string) => void;
  onStartDebate: (problem: string) => void;
  onOpenApiKeyModal: () => void;
  onOpenReportModal: (report: ConsensusReport) => void;
  onSimulateBackendEvent: () => void;
  onPetCat?: () => void;
  onTeamPrayer?: () => void;
  onTeamChristianPrayer?: () => void;
  onCastBuddhaMiracle?: () => void;
  onCastChristianMiracle?: () => void;
}

export function DashboardHUD({
  agents,
  selectedAgentId,
  dialogueLogs,
  isDebating,
  activeDebateSession,
  pastSessions,
  onSelectAgent,
  onStartDebate,
  onOpenApiKeyModal,
  onOpenReportModal,
  onSimulateBackendEvent,
  onPetCat,
  onTeamPrayer,
  onTeamChristianPrayer,
  onCastBuddhaMiracle,
  onCastChristianMiracle
}: DashboardHUDProps) {
  const [activeTab, setActiveTab] = useState<'live' | 'history'>('live');
  const [inputProblem, setInputProblem] = useState('');
  const [showAmbientFeed, setShowAmbientFeed] = useState(false);

  // Lọc chỉ những tin nhắn công việc / tranh luận chiến lược, sắp xếp MỚI NHẤT LÊN TRƯỚC
  const workDebateLogs = dialogueLogs
    .filter((log) => log.category === 'work')
    .slice()
    .reverse();

  const handleStartDebateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputProblem.trim() || isDebating) return;
    onStartDebate(inputProblem.trim());
    setInputProblem('');
    setActiveTab('live');
  };

  return (
    <div className="hud-container">
      {/* 1. Header trên cùng */}
      <header className="hud-header">
        <div className="hud-logo">
          <div className="hud-logo-icon">
            <Cpu size={20} color="#38bdf8" />
          </div>
          <div>
            <h1 className="hud-title">Agent_Full • C-Suite Executive Command Center</h1>
            <p className="hud-subtitle">Hội Đồng Lãnh Đạo F&B & Xuất Nhập Khẩu • 40+ Năm Kinh Nghiệm</p>
          </div>
        </div>

        {/* Thanh Nhập Đề Bài Chiến Lược Trọng Tâm */}
        <form className="hud-strategic-bar" onSubmit={handleStartDebateSubmit}>
          <Search size={16} color="#38bdf8" style={{ flexShrink: 0 }} />
          <input
            type="text"
            className="strategic-input"
            placeholder="Nhập vấn đề chiến lược F&B & XNK cần Ban Giám Đốc họp tranh luận..."
            value={inputProblem}
            onChange={(e) => setInputProblem(e.target.value)}
            disabled={isDebating}
          />
          <button
            type="submit"
            className="strategic-submit-btn"
            disabled={isDebating || !inputProblem.trim()}
          >
            {isDebating ? (
              <>
                <Flame size={14} className="animate-spin" color="#fef08a" />
                <span>Đang Tranh Luận...</span>
              </>
            ) : (
              <>
                <Send size={13} />
                <span>Họp Ban Giám Đốc</span>
              </>
            )}
          </button>
        </form>

        {/* Cấu hình Keys & Báo Cáo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {activeDebateSession?.consensusReport && (
            <button
              className="strategic-submit-btn"
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                boxShadow: '0 0 12px rgba(16, 185, 129, 0.4)'
              }}
              onClick={() => onOpenReportModal(activeDebateSession.consensusReport!)}
              title="Xem Báo Cáo Thống Nhất Chiến Lược của phiên họp hiện tại"
            >
              <FileText size={14} />
              <span>Xem Báo Cáo</span>
            </button>
          )}

          <button
            className="api-key-config-btn"
            onClick={onOpenApiKeyModal}
            title="Cấu hình 3 Gemini API Key độc lập cho COO Bác Nam, CFO Bác Thắng, CRO Bác Hoàng"
          >
            <Key size={14} color="#38bdf8" />
            <span>3 Gemini Keys</span>
          </button>
        </div>
      </header>

      {/* Vùng giữa: Sidebar bên trái (Nhật ký Chat & Lịch sử phiên họp) */}
      <div className="hud-middle-layout">
        <aside className="hud-sidebar" style={{ width: '380px' }}>
          {/* Header Hội Đồng Lãnh Đạo */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="hud-panel-title">
              <Sparkles size={16} color="#38bdf8" />
              <span>BAN GIÁM ĐỐC C-SUITE (3 GIÁM ĐỐC)</span>
            </div>

            {/* Quick Director Selector Badges */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
              {agents.map((agent) => {
                const isSelected = agent.id === selectedAgentId;
                return (
                  <div
                    key={agent.id}
                    onClick={() => onSelectAgent(agent.id)}
                    style={{
                      background: isSelected ? 'rgba(30, 41, 59, 0.95)' : 'rgba(15, 23, 42, 0.6)',
                      border: `1.5px solid ${isSelected ? agent.color : 'rgba(255, 255, 255, 0.08)'}`,
                      borderRadius: '8px',
                      padding: '6px 8px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '2px',
                      transition: 'all 0.15s ease'
                    }}
                    title={`${agent.role} (Nhấp để chọn trong 3D)`}
                  >
                    <span style={{ fontSize: '15px' }}>{agent.thoughtIcon}</span>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: agent.color }}>
                      {agent.codename || agent.name}
                    </span>
                    <span style={{ fontSize: '9px', color: '#94a3b8' }}>
                      {agent.id === 'agent_coo' ? 'COO Vận Hành' : agent.id === 'agent_cfo' ? 'CFO Tài Chính' : 'CRO Rủi Ro'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Tabs: Tranh Luận Trực Tiếp vs Lịch Sử Phiên Họp */}
            <div className="hud-tab-header">
              <button
                className={`hud-tab-btn ${activeTab === 'live' ? 'active' : ''}`}
                onClick={() => setActiveTab('live')}
              >
                <MessageSquare size={13} />
                <span>Tranh Luận Trực Tiếp</span>
              </button>
              <button
                className={`hud-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                <History size={13} />
                <span>Lịch Sử ({pastSessions.length})</span>
              </button>
            </div>
          </div>

          {/* TAB 1: TRANH LUẬN TRỰC TIẾP (ƯU TIÊN MỚI NHẤT LÊN TRƯỚC, CHỈ HIỆN CÔNG VIỆC) */}
          {activeTab === 'live' && (
            <div className="hud-work-debate-list">
              {isDebating && (
                <div
                  style={{
                    background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.25), rgba(37, 99, 235, 0.25))',
                    border: '1px solid #38bdf8',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    animation: 'pulse 1.8s infinite'
                  }}
                >
                  <Flame size={16} color="#38bdf8" />
                  <div style={{ fontSize: '11px', color: '#e0f2fe', fontWeight: 700 }}>
                    Đang họp & phản biện Vòng {activeDebateSession?.currentRound || 1}/3...
                    <br />
                    <span style={{ fontSize: '10px', color: '#93c5fd', fontWeight: 400 }}>
                      Cả 3 Giám Đốc đang tranh luận kịch liệt tại bàn họp
                    </span>
                  </div>
                </div>
              )}

              {workDebateLogs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 10px', color: '#64748b', fontSize: '11.5px' }}>
                  <HelpCircle size={24} style={{ margin: '0 auto 8px', opacity: 0.6 }} />
                  Chưa có phiên tranh luận nào.
                  <br />
                  Nhập vấn đề chiến lược F&B & XNK ở thanh trên để Ban Giám Đốc họp bàn phản biện!
                </div>
              ) : (
                workDebateLogs.map((log) => (
                  <div
                    key={log.id}
                    className="hud-work-debate-card"
                    style={{ borderLeft: `3px solid ${log.senderColor}` }}
                  >
                    {/* Header Card */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '14px' }}>{log.icon}</span>
                        <span style={{ fontSize: '12px', fontWeight: 800, color: log.senderColor }}>
                          {log.senderName}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {log.round && (
                          <span
                            className="badge-round"
                            style={{
                              backgroundColor: `${log.senderColor}22`,
                              color: log.senderColor,
                              border: `1px solid ${log.senderColor}55`
                            }}
                          >
                            Vòng {log.round}
                          </span>
                        )}
                        <span style={{ fontSize: '9.5px', fontFamily: 'var(--font-mono)', color: '#64748b' }}>
                          {log.timestamp}
                        </span>
                      </div>
                    </div>

                    {/* Message Body */}
                    <div style={{ fontSize: '11.5px', color: '#e2e8f0', lineHeight: 1.5 }}>
                      {log.message}
                    </div>

                    {/* Citations & Predictions Badges */}
                    {(log.citations && log.citations.length > 0) || (log.predictions && log.predictions.length > 0) ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '2px' }}>
                        {log.citations && log.citations.length > 0 && (
                          <span className="badge-citation-tag" title={log.citations.join(' | ')}>
                            <Search size={10} />
                            <span>{log.citations.length} Dẫn Chứng Thực Tế</span>
                          </span>
                        )}
                        {log.predictions && log.predictions.length > 0 && (
                          <span className="badge-prediction-tag" title={log.predictions.join(' | ')}>
                            <Sparkles size={10} />
                            <span>{log.predictions.length} Dự Báo 40 Năm</span>
                          </span>
                        )}
                      </div>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: LỊCH SỬ PHIÊN HỌP (LƯU TRONG LOCALSTORAGE) */}
          {activeTab === 'history' && (
            <div className="hud-work-debate-list">
              {pastSessions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 10px', color: '#64748b', fontSize: '11.5px' }}>
                  <History size={24} style={{ margin: '0 auto 8px', opacity: 0.6 }} />
                  Chưa có lịch sử phiên họp nào được lưu.
                </div>
              ) : (
                pastSessions.map((session) => (
                  <div
                    key={session.id}
                    className="hud-work-debate-card"
                    style={{ borderLeft: '3px solid #10b981' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '10px', color: '#34d399', fontWeight: 700 }}>
                        {session.createdAt}
                      </span>
                      <span
                        style={{
                          fontSize: '9.5px',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          background: 'rgba(16, 185, 129, 0.2)',
                          color: '#6ee7b7'
                        }}
                      >
                        Đã Thống Nhất
                      </span>
                    </div>

                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#f8fafc', lineHeight: 1.4 }}>
                      {session.title}
                    </div>

                    {session.consensusReport && (
                      <div
                        style={{
                          fontSize: '11px',
                          color: '#fbbf24',
                          fontWeight: 600,
                          background: 'rgba(245, 158, 11, 0.1)',
                          padding: '4px 6px',
                          borderRadius: '4px'
                        }}
                      >
                        Quyết định: {session.consensusReport.finalDecision}
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                      <button
                        className="btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '10.5px' }}
                        onClick={() => {
                          if (session.consensusReport) {
                            onOpenReportModal(session.consensusReport);
                          }
                        }}
                      >
                        <FileText size={12} />
                        <span>Xem Báo Cáo</span>
                        <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </aside>

        {/* Khung chat phụ bên phải: Tiếng Nói Văn Phòng (Tùy chọn mở để xem tin tức, meme, dâng hương) */}
        {showAmbientFeed && (
          <aside className="hud-dialogue-box">
            <div className="hud-dialogue-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MessageSquare size={14} color="#f59e0b" />
                <span className="hud-dialogue-title">TIẾNG NÓI ĐỜI THƯỜNG (AMBIENT)</span>
              </div>
              <button
                className="hud-dialogue-toggle"
                onClick={() => setShowAmbientFeed(false)}
                title="Đóng hộp thoại"
              >
                ✕
              </button>
            </div>

            <div className="hud-dialogue-messages">
              {dialogueLogs
                .filter((l) => l.category !== 'work')
                .slice(-15)
                .map((log) => (
                  <div key={log.id} className="hud-dialogue-item">
                    <span className="hud-dialogue-time">{log.timestamp}</span>
                    <span className="hud-dialogue-sender" style={{ color: log.senderColor }}>
                      {log.icon} {log.senderName}:
                    </span>
                    <span className="hud-dialogue-text">{log.message}</span>
                  </div>
                ))}
            </div>
          </aside>
        )}
      </div>

      {/* 4. Thanh điều khiển phía dưới đáy (Footer) */}
      <footer className="hud-footer">
        <div className="hud-tip">
          <Compass size={16} color="#38bdf8" />
          <span>
            <strong>Hướng dẫn:</strong> Nhập bài toán ở thanh trên để 3 Giám Đốc họp tranh luận. Click vào sàn để di chuyển, click <strong>GitCat 🐱</strong> để vuốt ve!
          </span>
        </div>

        <div className="hud-actions">
          {/* Nút bật tắt feed chuyện phiếm */}
          <button
            className="hud-action-btn cat"
            onClick={() => setShowAmbientFeed((prev) => !prev)}
            title="Bật/tắt hộp thoại chuyện phiếm & đời thường"
          >
            <MessageSquare size={14} />
            <span>{showAmbientFeed ? 'Ẩn Thoại Phụ' : 'Hiện Thoại Phụ'}</span>
          </button>

          {/* Nút Toàn Đội Bái Phật */}
          <button
            className="hud-action-btn shrine"
            onClick={onTeamPrayer}
            title="Ban Giám Đốc dâng hương bái Phật cầu an lạc, 0% rủi ro!"
            style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(217, 119, 6, 0.35))',
              border: '1.5px solid #fbbf24',
              color: '#fef08a'
            }}
          >
            <span>🙏</span>
            <span>Bái Phật Cầu An</span>
          </button>

          {/* Nút Cầu Nguyện Chúa */}
          <button
            className="hud-action-btn shrine"
            onClick={onTeamChristianPrayer}
            title="Ban Giám Đốc cầu nguyện trước Thánh Giá Chúa!"
            style={{
              background: 'linear-gradient(135deg, rgba(253, 224, 71, 0.25), rgba(202, 138, 4, 0.35))',
              border: '1.5px solid #fde047',
              color: '#fef08a'
            }}
          >
            <span>✝️</span>
            <span>Cầu Nguyện Chúa</span>
          </button>

          {/* Nút Phật Phóng Tràng Hạt */}
          <button
            className="hud-action-btn shrine"
            onClick={onCastBuddhaMiracle}
            title="Đức Phật phóng chuỗi tràng hạt bồ đề qua phòng họp!"
            style={{
              background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.3), rgba(180, 83, 9, 0.4))',
              border: '1.5px solid #f97316',
              color: '#fdba74'
            }}
          >
            <span>📿</span>
            <span>Phật Phóng Hạt</span>
          </button>

          {/* Nút Chúa Ban Đinh */}
          <button
            className="hud-action-btn shrine"
            onClick={onCastChristianMiracle}
            title="Thánh Giá ban Đinh Thánh qua phòng họp!"
            style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(161, 98, 7, 0.4))',
              border: '1.5px solid #fbbf24',
              color: '#fef08a'
            }}
          >
            <span>🔨</span>
            <span>Chúa Ban Đinh</span>
          </button>

          {/* Nút vuốt ve GitCat */}
          <button
            className="hud-action-btn cat"
            onClick={onPetCat}
            title="Tương tác với chú mèo văn phòng GitCat"
          >
            <Heart size={15} color="#ea580c" />
            <span>GitCat 🐱</span>
          </button>

          {/* Nút giả lập sự kiện trao đổi */}
          <button
            className="hud-action-btn primary"
            onClick={onSimulateBackendEvent}
            title="Mô phỏng trao đổi công việc nhanh giữa 3 Giám Đốc"
          >
            <Sparkles size={15} />
            <span>Thảo Luận Nhanh</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
