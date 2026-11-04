/**
 * @file ApiKeyModal.tsx
 * @description Modal cấu hình 3 Google Gemini API Keys độc lập cho 3 Giám Đốc C-Suite
 * (COO Bác Nam, CFO Bác Thắng, CRO Bác Hoàng).
 * Lưu trữ bảo mật tại localStorage trình duyệt, hỗ trợ tra cứu mạng Google Search Grounding.
 */

import { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, ShieldCheck, CheckCircle2, Sparkles, X } from 'lucide-react';
import { ExecutiveKeyConfig } from '../types/executive';
import { loadApiKeys, saveApiKeys } from '../services/geminiExecutiveService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ApiKeyModal({ isOpen, onClose }: ApiKeyModalProps) {
  const [keys, setKeys] = useState<ExecutiveKeyConfig>({
    cooKey: '',
    cfoKey: '',
    croKey: ''
  });
  const [showKey, setShowKey] = useState<Record<string, boolean>>({
    coo: false,
    cfo: false,
    cro: false
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const loaded = loadApiKeys();
      setKeys(loaded);
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    saveApiKeys(keys);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const toggleShow = (role: 'coo' | 'cfo' | 'cro') => {
    setShowKey((prev) => ({ ...prev, [role]: !prev[role] }));
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="modal-icon-badge" style={{ background: 'rgba(56, 189, 248, 0.2)', border: '1px solid #38bdf8' }}>
              <Key size={18} color="#38bdf8" />
            </div>
            <div>
              <h2 className="modal-title">Cấu Hình 3 Gemini AI Keys Độc Lập</h2>
              <p className="modal-subtitle">Ban Giám Đốc C-Suite F&B & Xuất Nhập Khẩu (40+ Năm Kinh Nghiệm)</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="modal-info-box">
            <Sparkles size={16} color="#fbbf24" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '11.5px', lineHeight: 1.5, color: '#cbd5e1' }}>
              <strong>Cơ chế hoạt động:</strong> Mỗi Giám đốc sẽ sử dụng một Gemini API Key độc lập (mô hình <code>gemini-2.0-flash</code> hoặc <code>gemini-1.5-flash</code>) tích hợp <strong>Google Search Grounding</strong> để tự động tra cứu dữ liệu thời gian thực trên mạng, đưa ra số liệu dẫn chứng cụ thể và phản biện kịch liệt.
              <br />
              <em>*Nếu bạn để trống, hệ thống sẽ tự động kích hoạt bộ máy mô phỏng tri thức F&B & XNK 40 năm kinh nghiệm mà không bị gián đoạn.</em>
            </div>
          </div>

          {/* Key 1: COO Bác Nam */}
          <div className="key-input-group" style={{ borderLeft: '3px solid #0284c7' }}>
            <div className="key-header">
              <span className="key-role-title" style={{ color: '#38bdf8' }}>
                🚢 Bác Nam — Giám đốc Vận hành (COO)
              </span>
              <span className="key-role-badge">Chuỗi cung ứng & Cold Chain</span>
            </div>
            <div className="input-with-toggle">
              <input
                type={showKey.coo ? 'text' : 'password'}
                placeholder="Nhập Gemini API Key cho Bác Nam (COO)..."
                value={keys.cooKey}
                onChange={(e) => setKeys({ ...keys, cooKey: e.target.value })}
                className="key-input-field"
              />
              <button
                type="button"
                className="toggle-visibility-btn"
                onClick={() => toggleShow('coo')}
              >
                {showKey.coo ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Key 2: CFO Bác Thắng */}
          <div className="key-input-group" style={{ borderLeft: '3px solid #10b981' }}>
            <div className="key-header">
              <span className="key-role-title" style={{ color: '#34d399' }}>
                💼 Bác Thắng — Giám đốc Tài chính (CFO)
              </span>
              <span className="key-role-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7' }}>
                Dòng tiền, FX & L/C Ngoại Thương
              </span>
            </div>
            <div className="input-with-toggle">
              <input
                type={showKey.cfo ? 'text' : 'password'}
                placeholder="Nhập Gemini API Key cho Bác Thắng (CFO)..."
                value={keys.cfoKey}
                onChange={(e) => setKeys({ ...keys, cfoKey: e.target.value })}
                className="key-input-field"
              />
              <button
                type="button"
                className="toggle-visibility-btn"
                onClick={() => toggleShow('cfo')}
              >
                {showKey.cfo ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Key 3: CRO Bác Hoàng */}
          <div className="key-input-group" style={{ borderLeft: '3px solid #f59e0b' }}>
            <div className="key-header">
              <span className="key-role-title" style={{ color: '#fbbf24' }}>
                ⚖️ Bác Hoàng — Giám đốc Quản trị Rủi ro (CRO)
              </span>
              <span className="key-role-badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fde047' }}>
                FDA, HACCP & Incoterms 2020
              </span>
            </div>
            <div className="input-with-toggle">
              <input
                type={showKey.cro ? 'text' : 'password'}
                placeholder="Nhập Gemini API Key cho Bác Hoàng (CRO)..."
                value={keys.croKey}
                onChange={(e) => setKeys({ ...keys, croKey: e.target.value })}
                className="key-input-field"
              />
              <button
                type="button"
                className="toggle-visibility-btn"
                onClick={() => toggleShow('cro')}
              >
                {showKey.cro ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#94a3b8' }}>
            <ShieldCheck size={14} color="#10b981" />
            <span>Khóa được lưu cục bộ trên trình duyệt của bạn (LocalStorage)</span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-secondary" onClick={onClose}>
              Đóng
            </button>
            <button className="btn-primary" onClick={handleSave} style={{ minWidth: '120px' }}>
              {savedSuccess ? (
                <>
                  <CheckCircle2 size={15} color="#ffffff" />
                  <span>Đã Lưu!</span>
                </>
              ) : (
                <>
                  <Key size={15} />
                  <span>Lưu 3 Khóa AI</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

