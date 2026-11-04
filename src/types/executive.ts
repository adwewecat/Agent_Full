/**
 * @file executive.ts
 * @description Định nghĩa các kiểu dữ liệu cho Hội Đồng Lãnh Đạo C-Suite (3 Giám đốc F&B & Xuất nhập khẩu),
 * cấu hình Gemini API Keys riêng biệt, tiến trình tranh luận và Báo cáo Thống nhất Chiến lược.
 */

export type ExecutiveRole = 'COO' | 'CFO' | 'CRO';

export interface ExecutiveConfig {
  id: string;
  role: ExecutiveRole;
  title: string; // "Giám đốc Vận hành (COO)"
  name: string; // "Bác Nam"
  experience: string; // "40+ năm kinh nghiệm F&B & Xuất Nhập Khẩu"
  expertise: string[];
  color: string;
  accentColor: string;
  avatarIcon: string;
  systemPrompt: string;
}

export interface ExecutiveKeyConfig {
  cooKey: string;
  cfoKey: string;
  croKey: string;
}

export interface DebateMessage {
  id: string;
  round: 1 | 2 | 3; // Vòng 1: Đánh giá, Vòng 2: Phản biện, Vòng 3: Thống nhất
  senderId: string;
  senderName: string;
  senderRole: ExecutiveRole;
  senderColor: string;
  text: string;
  citations: string[]; // Dẫn chứng, số liệu thực tế
  predictions: string[]; // Dự đoán, nhận định chuyên gia 40 năm
  timestamp: string;
}

export interface ConsensusReport {
  id: string;
  problem: string;
  finalDecision: string; // "DUYỆT TRIỂN KHAI CÓ ĐIỀU KIỆN" | "TẠM HOÃN & TÁI CẤU TRÚC" | ...
  summary: string;
  pros: string[]; // Mặt lợi (Ưu điểm chiến lược)
  cons: string[]; // Mặt hại (Thách thức & Điểm yếu)
  risks: {
    risk: string;
    mitigation: string;
  }[]; // Rủi ro trọng yếu & Giải pháp phòng ngừa
  consensusCriteria: string[]; // Tiêu chí cả 3 bên thống nhất
  factsAndEvidence: string[]; // Danh mục dẫn chứng & số liệu thực tế
  expertPredictions: string[]; // Danh mục dự đoán của chuyên gia
  createdAt: string;
}

export interface DebateSession {
  id: string;
  title: string;
  problem: string;
  status: 'idle' | 'gathering' | 'debating' | 'completed';
  currentRound: number;
  messages: DebateMessage[];
  consensusReport: ConsensusReport | null;
  createdAt: string;
}

