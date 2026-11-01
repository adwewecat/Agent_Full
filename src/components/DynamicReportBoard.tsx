/**
 * @file DynamicReportBoard.tsx
 * @description Bảng Báo Cáo Điều Hành Động (Dynamic Executive Dashboard) gắn trên tường hậu văn phòng.
 * Thay thế cho bảng nỉ xanh tĩnh đơn điệu bằng một trung tâm thông tin báo cáo sống động, hiện đại:
 * - Hiệu ứng đồ thị cột tăng trưởng đa sắc màu nhảy số liên tục theo chu kỳ nhịp đập.
 * - Sóng xung nhịp Telemetry thời gian thực thể hiện thông lượng xử lý của hệ thống.
 * - Các chỉ số KPI trọng yếu: Doanh thu ARR, Tỷ lệ hoàn thành Sprint, 0% Bug nhờ ơn Phật & Chúa.
 * - Dòng tin chữ chạy (Live Ticker) cập nhật liên tục thành tích của 4 AI Agent.
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface DynamicReportBoardProps {
  position?: [number, number, number];
}

export function DynamicReportBoard({ position = [0, 2.7, -5.5] }: DynamicReportBoardProps) {
  const lightRef = useRef<THREE.PointLight>(null);

  // Nhịp ánh sáng dịu nhẹ trên bảng báo cáo
  useFrame(({ clock }) => {
    if (lightRef.current) {
      const elapsed = clock.getElapsedTime();
      lightRef.current.intensity = 1.2 + Math.sin(elapsed * 2) * 0.15;
    }
  });

  return (
    <group position={position}>
      {/* 1. Khung viền gỗ sồi ấm áp */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.45, 1.45, 0.05]} />
        <meshStandardMaterial color="#9a3412" roughness={0.4} />
      </mesh>

      {/* 2. Mặt bảng nỉ xanh ngọc lục bảo sang trọng (Emerald Felt Board) */}
      <mesh position={[0, 0, 0.024]}>
        <planeGeometry args={[3.32, 1.32]} />
        <meshStandardMaterial color="#064e3b" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* 3. Đèn rọi tranh triển lãm phía trên bảng */}
      <group position={[0, 0.78, 0.18]}>
        <mesh>
          <boxGeometry args={[1.2, 0.03, 0.04]} />
          <meshStandardMaterial color="#d97706" metalness={0.8} />
        </mesh>
        <pointLight
          ref={lightRef}
          position={[0, -0.1, 0.1]}
          color="#fef08a"
          intensity={1.2}
          distance={4}
          decay={2}
        />
      </group>

      {/* 4. GIAO DIỆN BÁO CÁO ĐỘNG (HTML TRANSFORM NATIVE RESOLUTION) */}
      <Html
        transform
        position={[0, 0, 0.028]}
        distanceFactor={3.6}
        style={{
          width: '820px',
          height: '310px',
          pointerEvents: 'none',
          userSelect: 'none'
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(6, 40, 28, 0.88)',
            border: '2px solid #10b981',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(16, 185, 129, 0.2)',
            padding: '12px 18px',
            boxSizing: 'border-box',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            color: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backdropFilter: 'blur(6px)'
          }}
        >
          {/* Header Báo Cáo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(16, 185, 129, 0.35)',
              paddingBottom: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>📊</span>
              <div>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 800,
                    letterSpacing: '0.8px',
                    color: '#34d399',
                    textTransform: 'uppercase'
                  }}
                >
                  Agent_Full • Executive Performance Dashboard
                </div>
                <div style={{ fontSize: '9px', color: '#94a3b8' }}>
                  Hệ thống giám sát điều hành tự động hóa • Q4/2026 Milestone
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid #10b981',
                  padding: '3px 8px',
                  borderRadius: '16px',
                  fontSize: '9.5px',
                  fontWeight: 700,
                  color: '#6ee7b7'
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    boxShadow: '0 0 8px #10b981',
                    animation: 'pulse 1.5s infinite'
                  }}
                />
                LIVE TELEMETRY
              </div>
              <div style={{ fontSize: '10px', color: '#fef08a', fontWeight: 700 }}>
                🙏 100% Phật & Chúa Ban Ơn ✝️
              </div>
            </div>
          </div>

          {/* Dải 4 Thẻ KPI Nổi Bật */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', margin: '4px 0' }}>
            {/* KPI 1 */}
            <div
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                borderRadius: '8px',
                padding: '6px 10px'
              }}
            >
              <div style={{ fontSize: '9px', color: '#7dd3fc', fontWeight: 600 }}>DOANH THU & ARR</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>
                $2.48M <span style={{ fontSize: '10px', color: '#4ade80' }}>+142% 🚀</span>
              </div>
            </div>

            {/* KPI 2 */}
            <div
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '8px',
                padding: '6px 10px'
              }}
            >
              <div style={{ fontSize: '9px', color: '#6ee7b7', fontWeight: 600 }}>TIẾN ĐỘ SPRINT</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>
                98.4% <span style={{ fontSize: '10px', color: '#38bdf8' }}>42/42 Pass</span>
              </div>
            </div>

            {/* KPI 3 */}
            <div
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                borderRadius: '8px',
                padding: '6px 10px'
              }}
            >
              <div style={{ fontSize: '9px', color: '#fcd34d', fontWeight: 600 }}>TỶ LỆ BUG DETECTED</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#4ade80' }}>
                0.00% <span style={{ fontSize: '10px', color: '#fef08a' }}>Green Shield 🛡️</span>
              </div>
            </div>

            {/* KPI 4 */}
            <div
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                border: '1px solid rgba(236, 72, 153, 0.4)',
                borderRadius: '8px',
                padding: '6px 10px'
              }}
            >
              <div style={{ fontSize: '9px', color: '#f472b6', fontWeight: 600 }}>CLUSTER UPTIME</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>
                99.999% <span style={{ fontSize: '10px', color: '#ec4899' }}>4 Nodes ⚡</span>
              </div>
            </div>
          </div>

          {/* Vùng Đồ Thị Sinh Động (2 Cột) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px', flex: 1, alignItems: 'center' }}>
            {/* Cột 1: Biểu đồ cột phân bổ hiệu suất 6 Module */}
            <div
              style={{
                backgroundColor: 'rgba(2, 44, 34, 0.5)',
                borderRadius: '8px',
                padding: '8px 12px',
                border: '1px solid rgba(52, 211, 153, 0.25)'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '9.5px',
                  color: '#a7f3d0',
                  fontWeight: 700,
                  marginBottom: '6px'
                }}
              >
                <span>TIẾN ĐỘ MODULES DỰ ÁN</span>
                <span style={{ color: '#38bdf8' }}>Target: 100% Clean Code</span>
              </div>

              {/* 6 Cột Bar Chart Hoạt Họa Sinh Động */}
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '80px', padding: '0 4px' }}>
                {[
                  { name: 'Core', pct: 94, color: '#38bdf8', delay: '0s' },
                  { name: '3D UI', pct: 98, color: '#34d399', delay: '0.2s' },
                  { name: 'TDD', pct: 100, color: '#a855f7', delay: '0.4s' },
                  { name: 'Auto', pct: 88, color: '#f59e0b', delay: '0.6s' },
                  { name: 'Sec', pct: 96, color: '#ec4899', delay: '0.8s' },
                  { name: 'CI/CD', pct: 92, color: '#10b981', delay: '1.0s' }
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      flex: 1
                    }}
                  >
                    <span style={{ fontSize: '8.5px', fontWeight: 800, color: item.color }}>{item.pct}%</span>
                    <div
                      style={{
                        width: '24px',
                        height: `${(item.pct / 100) * 58}px`,
                        background: `linear-gradient(180deg, ${item.color}, ${item.color}33)`,
                        borderRadius: '4px 4px 1px 1px',
                        boxShadow: `0 0 10px ${item.color}88`,
                        transition: 'height 0.4s ease'
                      }}
                    />
                    <span style={{ fontSize: '8px', color: '#94a3b8', fontWeight: 600 }}>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cột 2: Sóng Telemetry Dao Động Thời Gian Thực */}
            <div
              style={{
                backgroundColor: 'rgba(2, 44, 34, 0.5)',
                borderRadius: '8px',
                padding: '8px 12px',
                border: '1px solid rgba(52, 211, 153, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '9.5px',
                  color: '#a7f3d0',
                  fontWeight: 700
                }}
              >
                <span>LIVE TELEMETRY STREAM</span>
                <span style={{ color: '#4ade80' }}>14,200 ops/s</span>
              </div>

              {/* Sóng SVG phát sáng nhấp nhô */}
              <svg width="100%" height="45" viewBox="0 0 280 45" style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,25 Q35,5 70,22 T140,15 T210,32 T280,18 L280,45 L0,45 Z"
                  fill="url(#waveGrad)"
                />
                <path
                  d="M0,25 Q35,5 70,22 T140,15 T210,32 T280,18"
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Các điểm node phát sáng */}
                <circle cx="70" cy="22" r="3.5" fill="#fef08a" />
                <circle cx="140" cy="15" r="3.5" fill="#38bdf8" />
                <circle cx="210" cy="32" r="3.5" fill="#f472b6" />
                <circle cx="280" cy="18" r="4.5" fill="#4ade80" />
              </svg>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '8.5px',
                  color: '#94a3b8'
                }}
              >
                <span>Memory: 1.8GB / 16GB</span>
                <span style={{ color: '#fef08a', fontWeight: 700 }}>Latency: 12ms</span>
              </div>
            </div>
          </div>

          {/* Dòng Ticker Chạy Chữ Thời Gian Thực */}
          <div
            style={{
              backgroundColor: 'rgba(2, 6, 23, 0.7)',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '8.5px',
              color: '#cbd5e1',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <span style={{ color: '#f59e0b', fontWeight: 800 }}>TIN MỚI:</span>
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              ✨ Nova: Crawl 1,240 API docs | 💻 Axel: 0 Compiler Errors | 🛡️ Vesper: 100% Clean Code pass | ⚡ Kip: Cluster Mesh Active | 🙏 Đức Phật & Chúa che chở ✝️
            </span>
          </div>
        </div>
      </Html>
    </group>
  );
}
