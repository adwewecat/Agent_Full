/**
 * @file ExecutiveDebateModal.tsx
 * @description Modal hiển thị Báo Cáo Thống Nhất Chiến Lược của Ban Giám Đốc C-Suite F&B & Xuất Nhập Khẩu.
 * Trình bày chi tiết Mặt Lợi, Mặt Hại, Quản Trị Rủi Ro, Tiêu Chí Thống Nhất,
 * và phân định minh bạch tuyệt đối giữa [DẪN CHỨNG / SỐ LIỆU THỰC TẾ] và [DỰ ĐOÁN CHUYÊN GIA 40 NĂM].
 */

import { useState } from 'react';
import {
  CheckCircle,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  Search,
  Copy,
  Check,
  X,
  Scale
} from 'lucide-react';
import { ConsensusReport } from '../types/executive';

interface ExecutiveDebateModalProps {
  report: ConsensusReport | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ExecutiveDebateModal({ report, isOpen, onClose }: ExecutiveDebateModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !report) return null;

  const handleCopyMarkdown = () => {
    const md = `
# 📑 BÁO CÁO THỐNG NHẤT CHIẾN LƯỢC BAN GIÁM ĐỐC C-SUITE (F&B & XUẤT NHẬP KHẨU)
*Thời gian lập: ${report.createdAt}*
*Chủ trì: Bác Nam (COO), Bác Thắng (CFO), Bác Hoàng (CRO) - 40+ năm kinh nghiệm*

---

### 🎯 VẤN ĐỀ CHIẾN LƯỢC:
> ${report.problem}

### 🏆 QUYẾT ĐỊNH CUỐI CÙNG:
**${report.finalDecision}**

### 📋 TÓM TẮT ĐIỀU HÀNH:
${report.summary}

---

### 📈 MẶT LỢI (ƯU ĐIỂM CHIẾN LƯỢC):
${report.pros.map((p) => `- ${p}`).join('\n')}

### 📉 MẶT HẠI (THÁCH THỨC & RỦI RO CHI PHÍ):
${report.cons.map((c) => `- ${c}`).join('\n')}

---

### 🛡️ MA TRẬN QUẢN TRỊ RỦI RO & PHÒNG NGỪA (HEDGING):
| Rủi ro trọng yếu | Giải pháp phòng ngừa & Kiểm soát |
| :--- | :--- |
${report.risks.map((r) => `| **${r.risk}** | ${r.mitigation} |`).join('\n')}

---

### 🤝 TIÊU CHÍ THỐNG NHẤT CUỐI CÙNG (3 GIÁM ĐỐC CÙNG KÝ DUYỆT):
${report.consensusCriteria.map((c, i) => `${i + 1}. ${c}`).join('\n')}

---

### 🔍 PHÂN ĐỊNH NGUỒN DỮ LIỆU:

#### 📌 [DẪN CHỨNG / SỐ LIỆU THỰC TẾ]:
${report.factsAndEvidence.map((f) => `- [THỰC TẾ] ${f}`).join('\n')}

#### 🔮 [DỰ ĐOÁN / DỰ BÁO CHUYÊN GIA 40 NĂM]:
${report.expertPredictions.map((p) => `- [DỰ BÁO 40 NĂM] ${p}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '880px', maxHeight: '90vh' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              className="modal-icon-badge"
              style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1.5px solid #10b981' }}
            >
              <Scale size={20} color="#34d399" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 className="modal-title">BÁO CÁO THỐNG NHẤT CHIẾN LƯỢC</h2>
                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(2, 132, 199, 0.2)',
                    color: '#38bdf8',
                    border: '1px solid rgba(56, 189, 248, 0.4)'
                  }}
                >
                  Ban Giám Đốc 40 Năm Kinh Nghiệm
                </span>
              </div>
              <p className="modal-subtitle">
                Đồng thuận bởi COO Bác Nam • CFO Bác Thắng • CRO Bác Hoàng
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="modal-body" style={{ overflowY: 'auto', paddingRight: '6px' }}>
          {/* 1. Problem Statement */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '12px 14px',
              marginBottom: '14px'
            }}
          >
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
              🎯 Vấn Đề Chiến Lược Được Giao:
            </div>
            <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#f8fafc', lineHeight: 1.45 }}>
              "{report.problem}"
            </div>
          </div>

          {/* 2. Final Decision Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(2, 132, 199, 0.2))',
              border: '1.5px solid #10b981',
              borderRadius: '12px',
              padding: '14px 18px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: '#6ee7b7', fontWeight: 700, textTransform: 'uppercase' }}>
                🏆 QUYẾT ĐỊNH ĐỒNG THUẬN CUỐI CÙNG:
              </div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
                {report.finalDecision}
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '20px',
                background: 'rgba(16, 185, 129, 0.3)',
                color: '#a7f3d0',
                fontSize: '11px',
                fontWeight: 700,
                border: '1px solid #34d399'
              }}
            >
              <CheckCircle size={14} color="#34d399" />
              <span>3/3 Giám Đốc Ký Duyệt</span>
            </div>
          </div>

          {/* 3. Executive Summary */}
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '12px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>
              📋 Tóm Tắt Định Hướng Điều Hành:
            </h3>
            <p style={{ fontSize: '12.5px', color: '#e2e8f0', lineHeight: 1.6, background: 'rgba(30, 41, 59, 0.5)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              {report.summary}
            </p>
          </div>

          {/* 4. Pros & Cons Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            {/* Pros */}
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '10px',
                padding: '12px 14px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <TrendingUp size={16} color="#34d399" />
                <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#34d399', textTransform: 'uppercase' }}>
                  MẶT LỢI (Ưu Điểm & Tiềm Năng)
                </h4>
              </div>
              <ul style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {report.pros.map((pro, idx) => (
                  <li key={idx} style={{ fontSize: '11.5px', color: '#cbd5e1', lineHeight: 1.45 }}>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>

            {/* Cons */}
            <div
              style={{
                background: 'rgba(244, 63, 94, 0.08)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                borderRadius: '10px',
                padding: '12px 14px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <TrendingDown size={16} color="#fb7185" />
                <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#fb7185', textTransform: 'uppercase' }}>
                  MẶT HẠI (Thách Thức & Chi Phí)
                </h4>
              </div>
              <ul style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {report.cons.map((con, idx) => (
                  <li key={idx} style={{ fontSize: '11.5px', color: '#cbd5e1', lineHeight: 1.45 }}>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 5. Risk & Mitigation Matrix */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <ShieldAlert size={16} color="#f59e0b" />
              <h3 style={{ fontSize: '12px', fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase' }}>
                🛡️ MA TRẬN QUẢN TRỊ RỦI RO & GIẢI PHÁP PHÒNG NGỪA (HEDGING):
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {report.risks.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(15, 23, 42, 0.65)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '10px 12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, background: 'rgba(239, 68, 68, 0.25)', color: '#fca5a5', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
                      RỦI RO {idx + 1}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#f1f5f9' }}>
                      {item.risk}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', paddingLeft: '4px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                      GIẢI PHÁP
                    </span>
                    <span style={{ fontSize: '11.5px', color: '#94a3b8', lineHeight: 1.45 }}>
                      {item.mitigation}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Consensus Criteria */}
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '12px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
              🤝 TIÊU CHÍ THỐNG NHẤT CỦA CẢ 3 BÊN:
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {report.consensusCriteria.map((criterion, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(2, 132, 199, 0.1)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    padding: '8px 12px',
                    borderRadius: '8px'
                  }}
                >
                  <span style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 800 }}>✓</span>
                  <span style={{ fontSize: '12px', color: '#e0f2fe', fontWeight: 500 }}>{criterion}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 7. EVIDENCE VS PREDICTIONS (BẮT BUỘC THEO YÊU CẦU USER: CÁI NÀO DẪN CHỨNG, CÁI NÀO DỰ ĐOÁN PHẢI GHI RÕ) */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '12px',
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Search size={16} color="#38bdf8" />
              <h3 style={{ fontSize: '12.5px', fontWeight: 800, color: '#f8fafc', textTransform: 'uppercase' }}>
                🔍 BẢNG MINH BẠCH: DẪN CHỨNG THỰC TẾ vs. DỰ ĐOÁN CHUYÊN GIA
              </h3>
            </div>

            {/* Facts and Evidence */}
            <div style={{ borderLeft: '3px solid #10b981', paddingLeft: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    color: '#34d399',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: '1px solid #10b981'
                  }}
                >
                  [DẪN CHỨNG / SỐ LIỆU THỰC TẾ]
                </span>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>Tra cứu mạng (Google Search Grounding) & Dữ liệu ngành xác thực</span>
              </div>
              <ul style={{ paddingLeft: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {report.factsAndEvidence.map((fact, i) => (
                  <li key={i} style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: 1.45 }}>
                    <strong>{fact}</strong>
                  </li>
                ))}
              </ul>
            </div>

            {/* Expert Predictions */}
            <div style={{ borderLeft: '3px solid #a855f7', paddingLeft: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    backgroundColor: 'rgba(168, 85, 247, 0.2)',
                    color: '#c084fc',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: '1px solid #a855f7'
                  }}
                >
                  [DỰ ĐOÁN / DỰ BÁO CHUYÊN GIA]
                </span>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>Dự báo xác suất & Nhận định từ hơn 40 năm thương trường</span>
              </div>
              <ul style={{ paddingLeft: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {report.expertPredictions.map((pred, i) => (
                  <li key={i} style={{ fontSize: '11px', color: '#e9d5ff', lineHeight: 1.45 }}>
                    <em>{pred}</em>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="modal-footer" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px' }}>
          <div style={{ fontSize: '11px', color: '#64748b' }}>
            Phiên họp được lưu tự động trong Lịch Sử Hệ Thống
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-secondary" onClick={handleCopyMarkdown}>
              {copied ? (
                <>
                  <Check size={14} color="#10b981" />
                  <span>Đã Sao Chép!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Sao Chép Markdown</span>
                </>
              )}
            </button>
            <button className="btn-primary" onClick={onClose} style={{ minWidth: '100px' }}>
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
