/**
 * @file agent.ts
 * @description Định nghĩa các kiểu dữ liệu cốt lõi cho Agent, Trạng thái hoạt động, Trạm làm việc,
 * Bong bóng hội thoại (Thought/Speech Bubbles) và Thú cưng văn phòng (GitCat).
 */

export type AgentStatus = 'idle' | 'working' | 'moving' | 'reviewing';

export interface AgentData {
  /** Định danh duy nhất của Agent */
  id: string;
  /** Tên hiển thị */
  name: string;
  /** Biệt danh / Tên nhân vật (vd: Nova, Axel, Vesper, Kip) */
  codename?: string;
  /** Vai trò / Chuyên môn */
  role: string;
  /** Tọa độ hiện tại [X, Y, Z] */
  position: [number, number, number];
  /** Tọa độ đích khi di chuyển (null nếu đang đứng yên) */
  targetPosition: [number, number, number] | null;
  /** Trạng thái hiện tại: idle, working, moving, reviewing */
  status: AgentStatus;
  /** Tác vụ đang xử lý */
  currentTask: string;
  /** Tiến độ hoàn thành tác vụ (0 - 100%) */
  progress: number;
  /** Màu sắc chủ đạo của Agent */
  color: string;
  /** Màu phụ trợ / Điểm nhấn neon */
  accentColor: string;
  /** Phụ kiện đặc trưng: 'cyber-visor' | 'headphones' | 'cat-ears' | 'cap' */
  accessory: 'cyber-visor' | 'headphones' | 'cat-ears' | 'cap';
  /** Biểu tượng cảm xúc / Thought bubble icon */
  thoughtIcon: string;
  /** Câu thoại / Suy nghĩ hiện tại */
  thoughtText: string;
  /** Đường dẫn file model 3D */
  modelUrl: string;
}

export interface WorkstationData {
  /** Mã định danh trạm */
  id: string;
  /** Tên hiển thị trạm làm việc */
  name: string;
  /** Tọa độ vị trí ngồi của trạm [X, Y, Z] */
  position: [number, number, number];
  /** Hướng quay của trạm tính theo radian (Y axis) */
  rotation: number;
  /** Loại trạm (coding, research, server, meeting, arcade) */
  type: 'coding' | 'research' | 'server' | 'lounge' | 'arcade';
  /** ID của Agent đang ngồi làm việc tại trạm (nếu có) */
  occupiedBy?: string | null;
}

export interface DialogueLog {
  id: string;
  timestamp: string;
  senderName: string;
  senderColor: string;
  message: string;
  icon: string;
}
