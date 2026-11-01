/**
 * @file DynamicReportBoard.tsx
 * @description Bảng Báo Cáo Điều Hành Động (Dynamic Executive Dashboard) gắn trên tường hậu văn phòng.
 * Được render 100% bằng WebGL Native CanvasTexture trên bề mặt Mesh 3D,
 * đảm bảo tuân thủ nghiêm ngặt Depth Buffer (Z-Buffer) của GPU:
 * - Nằm sâu sát mặt tường hậu (Z = -5.54), tuyệt đối KHÔNG đè che hay chắn tầm nhìn tượng Phật và Thánh Giá.
 * - Hiệu ứng đồ thị cột tăng trưởng đa sắc màu nhảy số liên tục theo chu kỳ nhịp đập.
 * - Sóng xung nhịp Telemetry thời gian thực thể hiện thông lượng xử lý của hệ thống.
 * - Các chỉ số KPI trọng yếu: Doanh thu ARR $2.48M, Tiến độ Sprint 98.4%, 0% Bug nhờ ơn Phật & Chúa.
 * - Dòng tin chữ chạy (Live Ticker) cập nhật liên tục thành tích của 4 AI Agent.
 */

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DynamicReportBoardProps {
  position?: [number, number, number];
}

export function DynamicReportBoard({ position = [0, 2.8, -5.53] }: DynamicReportBoardProps) {
  const lightRef = useRef<THREE.PointLight>(null);

  // Tạo Canvas 2D độ phân giải cao để vẽ giao diện báo cáo
  const canvas = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 512;
    return c;
  }, []);

  // Khởi tạo CanvasTexture native WebGL
  const texture = useMemo(() => {
    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    return tex;
  }, [canvas]);

  // Hủy texture khi unmount để tránh rò rỉ bộ nhớ
  useEffect(() => {
    return () => {
      texture.dispose();
    };
  }, [texture]);

  // Vòng lặp animation: vẽ giao diện báo cáo động lên canvas mỗi frame
  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();

    // Nhịp ánh sáng dịu nhẹ trên đèn rọi bảng
    if (lightRef.current) {
      lightRef.current.intensity = 1.1 + Math.sin(elapsed * 2) * 0.15;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // 1. Nền bảng nỉ xanh ngọc lục bảo công nghệ cao (Deep Emerald Slate Gradient)
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, '#042419');
    bgGrad.addColorStop(1, '#02160f');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Lưới ô vuông công nghệ mờ ảo (Cyber Grid Lines)
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.07)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Đường viền phát sáng ngoài cùng (Glowing Neon Border)
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 4;
    ctx.strokeRect(6, 6, w - 12, h - 12);

    // Góc bo viền công nghệ
    ctx.fillStyle = '#34d399';
    ctx.fillRect(4, 4, 16, 4);
    ctx.fillRect(4, 4, 4, 16);
    ctx.fillRect(w - 20, 4, 16, 4);
    ctx.fillRect(w - 8, 4, 4, 16);
    ctx.fillRect(4, h - 8, 16, 4);
    ctx.fillRect(4, h - 20, 4, 16);
    ctx.fillRect(w - 20, h - 8, 16, 4);
    ctx.fillRect(w - 8, h - 20, 4, 16);

    // 2. HEADER: Tiêu đề báo cáo & Live Telemetry Badge
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.fillText('📊 AGENT_FULL • EXECUTIVE PERFORMANCE DASHBOARD', 28, 42);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '13px Inter, sans-serif';
    ctx.fillText('Hệ thống giám sát điều hành tự động hóa • Q4/2026 Milestone', 28, 64);

    // Nút Live Telemetry nhấp nháy bên phải
    ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(w - 380, 24, 150, 32, 16);
    ctx.fill();
    ctx.stroke();

    // Chấm xanh nhấp nháy
    const pulseAlpha = 0.5 + Math.sin(elapsed * 4) * 0.5;
    ctx.fillStyle = `rgba(16, 185, 129, ${pulseAlpha})`;
    ctx.beginPath();
    ctx.arc(w - 365, 40, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#6ee7b7';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillText('LIVE TELEMETRY', w - 350, 44);

    // Phước lành Phật & Chúa
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillText('🙏 100% Phật & Chúa Ban Ơn ✝️', w - 210, 44);

    // Đường gạch ngang phân cách
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(24, 76);
    ctx.lineTo(w - 24, 76);
    ctx.stroke();

    // 3. DẢI 4 THẺ KPI NỔI BẬT (4 KPI Mini Cards)
    const kpiCards = [
      { label: 'DOANH THU & ARR', value: '$2.48M', sub: '+142% 🚀', color: '#38bdf8' },
      { label: 'TIẾN ĐỘ SPRINT', value: '98.4%', sub: '42/42 Pass', color: '#34d399' },
      { label: 'TỶ LỆ BUG DETECTED', value: '0.00%', sub: 'Green Shield 🛡️', color: '#4ade80' },
      { label: 'CLUSTER UPTIME', value: '99.999%', sub: '4 Nodes ⚡', color: '#ec4899' }
    ];

    const cardW = (w - 48 - 36) / 4;
    kpiCards.forEach((kpi, idx) => {
      const cardX = 24 + idx * (cardW + 12);
      const cardY = 88;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.strokeStyle = `${kpi.color}55`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, 64, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = kpi.color;
      ctx.font = '600 11px Inter, sans-serif';
      ctx.fillText(kpi.label, cardX + 12, cardY + 22);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px Inter, sans-serif';
      ctx.fillText(kpi.value, cardX + 12, cardY + 48);

      ctx.fillStyle = kpi.color;
      ctx.font = '600 11px Inter, sans-serif';
      ctx.fillText(kpi.sub, cardX + 110, cardY + 48);
    });

    // 4. KHU VỰC ĐỒ THỊ BÊN TRÁI: BIỂU ĐỒ CỘT TIẾN ĐỘ 6 MODULE (Animated Multi-Bar Chart)
    const chartX = 24;
    const chartY = 168;
    const chartW = 540;
    const chartH = 270;

    ctx.fillStyle = 'rgba(2, 44, 34, 0.6)';
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(chartX, chartY, chartW, chartH, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#a7f3d0';
    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.fillText('TIẾN ĐỘ CÁC MODULE DỰ ÁN', chartX + 16, chartY + 26);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '600 12px Inter, sans-serif';
    ctx.fillText('Target: 100% Clean Code', chartX + chartW - 165, chartY + 26);

    // 6 Cột Bar Chart Hoạt Họa Sinh Động
    const modules = [
      { name: 'Core AI', basePct: 94, color: '#38bdf8' },
      { name: '3D UI', basePct: 98, color: '#34d399' },
      { name: 'TDD Test', basePct: 100, color: '#a855f7' },
      { name: 'Automation', basePct: 88, color: '#f59e0b' },
      { name: 'Security', basePct: 96, color: '#ec4899' },
      { name: 'CI/CD', basePct: 92, color: '#10b981' }
    ];

    const barW = 44;
    const barGap = (chartW - 32 - modules.length * barW) / (modules.length - 1);
    const maxBarH = 175;

    modules.forEach((mod, idx) => {
      // Chiều cao nhấp nhô nhẹ nhàng tự nhiên
      const wave = Math.sin(elapsed * 2.5 + idx * 0.9) * 4;
      const currentPct = Math.min(100, Math.max(70, mod.basePct + wave));
      const barH = (currentPct / 100) * maxBarH;

      const bx = chartX + 16 + idx * (barW + barGap);
      const by = chartY + chartH - 42 - barH;

      // Cột gradient phát sáng
      const barGrad = ctx.createLinearGradient(0, by, 0, by + barH);
      barGrad.addColorStop(0, mod.color);
      barGrad.addColorStop(1, `${mod.color}22`);

      ctx.fillStyle = barGrad;
      ctx.beginPath();
      ctx.roundRect(bx, by, barW, barH, [6, 6, 2, 2]);
      ctx.fill();

      // Số % trên đỉnh cột
      ctx.fillStyle = mod.color;
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${Math.round(currentPct)}%`, bx + barW / 2, by - 8);

      // Tên module dưới chân cột
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '600 11px Inter, sans-serif';
      ctx.fillText(mod.name, bx + barW / 2, chartY + chartH - 18);
    });
    ctx.textAlign = 'left';

    // 5. KHU VỰC ĐỒ THỊ BÊN PHẢI: SÓNG TELEMETRY VÀ THÔNG LƯỢNG HỆ THỐNG
    const waveBoxX = chartX + chartW + 16;
    const waveBoxY = 168;
    const waveBoxW = w - 48 - chartW - 16;
    const waveBoxH = chartH;

    ctx.fillStyle = 'rgba(2, 44, 34, 0.6)';
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(waveBoxX, waveBoxY, waveBoxW, waveBoxH, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#a7f3d0';
    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.fillText('LIVE TELEMETRY STREAM', waveBoxX + 16, waveBoxY + 26);

    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillText('14,200 ops/s', waveBoxX + waveBoxW - 100, waveBoxY + 26);

    // Vẽ sóng hình sin thời gian thực dao động
    const waveCenterY = waveBoxY + 115;
    const waveH = 45;

    ctx.beginPath();
    ctx.moveTo(waveBoxX + 16, waveCenterY);
    for (let px = waveBoxX + 16; px <= waveBoxX + waveBoxW - 16; px += 4) {
      const relX = (px - waveBoxX) * 0.035;
      const py =
        waveCenterY +
        Math.sin(relX + elapsed * 3.5) * waveH * 0.6 +
        Math.cos(relX * 1.5 - elapsed * 2.2) * waveH * 0.4;
      ctx.lineTo(px, py);
    }
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Vùng gradient dưới chân sóng
    ctx.lineTo(waveBoxX + waveBoxW - 16, waveBoxY + 175);
    ctx.lineTo(waveBoxX + 16, waveBoxY + 175);
    ctx.closePath();
    const waveAreaGrad = ctx.createLinearGradient(0, waveCenterY - 40, 0, waveBoxY + 175);
    waveAreaGrad.addColorStop(0, 'rgba(52, 211, 153, 0.35)');
    waveAreaGrad.addColorStop(1, 'rgba(52, 211, 153, 0.0)');
    ctx.fillStyle = waveAreaGrad;
    ctx.fill();

    // Các điểm node phát sáng trên sóng
    const nodePoints = [0.25, 0.5, 0.75];
    nodePoints.forEach((ratio, i) => {
      const nx = waveBoxX + 16 + (waveBoxW - 32) * ratio;
      const relX = (nx - waveBoxX) * 0.035;
      const ny =
        waveCenterY +
        Math.sin(relX + elapsed * 3.5) * waveH * 0.6 +
        Math.cos(relX * 1.5 - elapsed * 2.2) * waveH * 0.4;

      ctx.fillStyle = i === 0 ? '#38bdf8' : i === 1 ? '#fef08a' : '#ec4899';
      ctx.beginPath();
      ctx.arc(nx, ny, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // Thông số tài nguyên bên dưới
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText('Memory Load: 1.8GB / 16GB', waveBoxX + 16, waveBoxY + 205);
    ctx.fillText('CPU Cores: 12.4% Active', waveBoxX + 16, waveBoxY + 225);

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillText('Latency: 12ms (Optimal)', waveBoxX + waveBoxW - 150, waveBoxY + 205);
    ctx.fillStyle = '#4ade80';
    ctx.fillText('Health Score: 100/100', waveBoxX + waveBoxW - 150, waveBoxY + 225);

    // Vòng tròn Radar tròn (Circular Score)
    const dialX = waveBoxX + waveBoxW - 55;
    const dialY = waveBoxY + 245;
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.3)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(dialX, dialY, 16, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(dialX, dialY, 16, -Math.PI / 2, Math.PI * 1.3);
    ctx.stroke();

    // 6. FOOTER TICKER: DÒNG TIN CHỮ CHẠY CẬP NHẬT LIÊN TỤC
    const tickerY = h - 42;
    ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(24, tickerY, w - 48, 28, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillText('TIN MỚI:', 36, tickerY + 18);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText(
      '✨ Nova: Crawl 1,240 API docs | 💻 Axel: 0 Compiler Errors | 🛡️ Vesper: 100% Clean Code pass | ⚡ Kip: Cluster Mesh Active | 🙏 Đức Phật & Chúa Che Chở ✝️',
      95,
      tickerY + 18
    );

    // Cập nhật texture lên GPU WebGL
    texture.needsUpdate = true;
  });

  return (
    <group position={position}>
      {/* 1. Khung viền gỗ sồi ấm áp gắn sát mặt tường hậu */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.45, 1.45, 0.04]} />
        <meshStandardMaterial color="#9a3412" roughness={0.4} />
      </mesh>

      {/* 2. Mặt bảng báo cáo WebGL Texture Native (Depth-tested 100%, không bị tràn layer DOM) */}
      <mesh position={[0, 0, 0.022]}>
        <planeGeometry args={[3.35, 1.35]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      {/* 3. Đèn rọi tranh nghệ thuật phía trên bảng */}
      <group position={[0, 0.76, 0.12]}>
        <mesh>
          <boxGeometry args={[1.2, 0.025, 0.03]} />
          <meshStandardMaterial color="#d97706" metalness={0.8} />
        </mesh>
        <pointLight
          ref={lightRef}
          position={[0, -0.08, 0.08]}
          color="#fef08a"
          intensity={1.1}
          distance={3.5}
          decay={2}
        />
      </group>
    </group>
  );
}
