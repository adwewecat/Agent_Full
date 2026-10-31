/**
 * @file agent.ts
 * @description Định nghĩa các kiểu dữ liệu cốt lõi cho Agent, Trạng thái hoạt động, Trạm làm việc và Sự kiện.
 */

export type AgentStatus = 'idle' | 'working' | 'moving' | 'reviewing';

export interface AgentData {
  /** Định danh duy nhất của Agent */
  id: string;
  /** Tên hiển thị */
  name: string;
  /** Vai trò / Chuyên môn (vd: Researcher, Coder, Reviewer) */
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
  /** Màu sắc nhận diện của Agent */
  color: string;
  /** Đường dẫn file model 3D (mặc định '/models/agent.glb') */
  modelUrl?: string;
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
  /** Loại trạm (coding, research, server, meeting) */
  type: 'coding' | 'research' | 'server' | 'lounge';
  /** ID của Agent đang ngồi làm việc tại trạm (nếu có) */
  occupiedBy?: string | null;
}
