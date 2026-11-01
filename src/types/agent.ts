/**
 * @file agent.ts
 * @description Định nghĩa các kiểu dữ liệu cốt lõi cho Agent, Trạng thái hoạt động, Trạm làm việc,
 * Hệ thống điểm neo chỗ ngồi (Seating Anchor System) và Thú cưng văn phòng (GitCat).
 */

export type AgentStatus = 'idle' | 'working' | 'moving' | 'reviewing' | 'praying';

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
  /** Hướng xoay cố định khi đang ngồi/đứng làm việc tại trạm (radian, null nếu tự do xoay khi đi) */
  targetRotation?: number | null;
  /** Có đang ngồi trên ghế/sofa không (để nâng Y bù trừ độ trũng root bone sit) */
  isSeated?: boolean;
  /** Trạng thái hiện tại: idle, working, moving, reviewing, praying */
  status: AgentStatus;
  /** ID trạm làm việc hiện tại đang gắn kết */
  currentStationId?: string | null;
  /** Trạm tiếp theo sẽ đến sau khi bái Phật xong */
  pendingStationId?: string | null;
  /** Đã được Phật phù hộ / ban phước (Zero Bug Buff) */
  blessed?: boolean;
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
  /** Tọa độ gốc của trạm [X, Y, Z] */
  position: [number, number, number];
  /** Hướng quay của trạm tính theo radian (Y axis) */
  rotation: number;
  /** Loại trạm (coding, research, server, meeting, arcade, shrine) */
  type: 'coding' | 'research' | 'server' | 'lounge' | 'arcade' | 'shrine';
  /** Độ dời tương đối của vị trí ngồi/đứng so với tâm trạm [X, Y, Z] */
  seatOffset: [number, number, number];
  /** Góc xoay của nhân vật khi ngồi/đứng tại trạm (so với góc quay của trạm) */
  seatRotationOffset: number;
  /** Trạm này là ngồi ghế/sofa hay đứng làm việc */
  isSeated: boolean;
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

/**
 * Tính toán tọa độ thế giới thực tế và góc quay chuẩn xác cho vị trí ngồi/đứng của một trạm làm việc.
 * Ngăn chặn hoàn toàn việc nhân vật bị ngồi dưới ghế, chui vào gầm bàn hay xuyên qua vật thể.
 */
export function getWorkstationSeatTransform(station: WorkstationData): {
  worldPosition: [number, number, number];
  worldRotation: number;
  isSeated: boolean;
} {
  const [posX, posY, posZ] = station.position;
  const [offX, offY, offZ] = station.seatOffset;
  const rot = station.rotation;

  // Xoay vector offset theo góc quay của trạm xung quanh trục Y
  const cosR = Math.cos(rot);
  const sinR = Math.sin(rot);

  const worldX = posX + (offX * cosR + offZ * sinR);
  const worldY = posY + offY;
  const worldZ = posZ + (-offX * sinR + offZ * cosR);
  const worldRotation = rot + station.seatRotationOffset;

  return {
    worldPosition: [worldX, worldY, worldZ],
    worldRotation,
    isSeated: station.isSeated
  };
}
