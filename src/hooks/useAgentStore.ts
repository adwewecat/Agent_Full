/**
 * @file useAgentStore.ts
 * @description Hook quản lý trạng thái tập trung của đội ngũ AI Agent, điều phối di chuyển,
 * cập nhật bong bóng suy nghĩ, hệ thống định vị chỗ ngồi chuẩn xác (Seating Anchor System)
 * và Nghi thức bái Phật trang nghiêm trước khi nhận nhiệm vụ (Buddha Blessing Workflow).
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  AgentData,
  AgentStatus,
  WorkstationData,
  DialogueLog,
  SpiritualProjectile,
  getWorkstationSeatTransform
} from '../types/agent';
import {
  getSmartAmbientQuote,
  getRandomBuddhaMeme,
  getRandomChristianMeme,
  getRandomDodgeReaction,
  WORK_COLLABORATION_DIALOGUES,
  OFFICE_ROUTINE_SCRIPTS
} from '../data/dialogueBank';

export const INITIAL_WORKSTATIONS: WorkstationData[] = [
  {
    id: 'station_buddha',
    name: 'Đài Sen Bái Phật',
    position: [-2.4, 0, -4.8],
    rotation: 0,
    type: 'shrine',
    seatOffset: [0, 0, 1.2], // Đứng trang nghiêm trên mặt sàn trước bàn thờ
    seatRotationOffset: Math.PI, // Quay mặt 180 độ hướng về phía tượng Phật (-Z)
    isSeated: false,
    occupiedBy: null
  },
  {
    id: 'station_cross',
    name: 'Bàn Thờ Chúa & Thánh Giá',
    position: [2.4, 0, -4.8],
    rotation: 0,
    type: 'shrine',
    seatOffset: [0, 0, 1.2], // Đứng trang nghiêm trên mặt sàn trước bàn thờ Chúa
    seatRotationOffset: Math.PI, // Quay mặt 180 độ hướng về phía Thánh Giá (-Z)
    isSeated: false,
    occupiedBy: null
  },
  {
    id: 'station_director',
    name: 'Bàn Giám Đốc Pé Ken',
    position: [0, 0, -3.4],
    rotation: 0,
    type: 'coding',
    seatOffset: [0, 0.66, -0.75], // Ngồi trên ghế Giám đốc phía sau bàn (Y = 0.66 bù trừ độ võng sit animation)
    seatRotationOffset: 0, // Quay mặt nhìn xuống bao quát phòng (+Z)
    isSeated: true,
    occupiedBy: 'agent_2'
  },
  {
    id: 'station_research',
    name: 'Bàn Họp - Ghế Pé Na',
    position: [-1.15, 0, 0.8],
    rotation: Math.PI / 2,
    type: 'research',
    seatOffset: [0, 0.625, 0], // Ngồi trên ghế xoay hội nghị bên trái nhìn vào bàn họp (Y = 0.625)
    seatRotationOffset: 0,
    isSeated: true,
    occupiedBy: 'agent_1'
  },
  {
    id: 'station_qa',
    name: 'Bàn Họp - Ghế Lão Lục',
    position: [-1.15, 0, 1.8],
    rotation: Math.PI / 2,
    type: 'coding',
    seatOffset: [0, 0.625, 0],
    seatRotationOffset: 0,
    isSeated: true,
    occupiedBy: 'agent_3'
  },
  {
    id: 'station_server',
    name: 'Bàn Họp - Ghế Lão Cửu',
    position: [1.15, 0, 0.8],
    rotation: -Math.PI / 2,
    type: 'server',
    seatOffset: [0, 0.625, 0], // Ngồi trên ghế xoay hội nghị bên phải nhìn vào bàn họp (Y = 0.625)
    seatRotationOffset: 0,
    isSeated: true,
    occupiedBy: 'agent_4'
  },
  {
    id: 'station_lounge_left',
    name: 'Sofa Tiếp Khách VIP Trái',
    position: [-4.6, 0, 0.6],
    rotation: Math.PI / 2,
    type: 'lounge',
    seatOffset: [0, 0.55, 0], // Ngồi trên đệm Sofa kem Taupe (Y = 0.55)
    seatRotationOffset: 0,
    isSeated: true,
    occupiedBy: null
  },
  {
    id: 'station_lounge_right',
    name: 'Sofa Tiếp Khách VIP Phải',
    position: [4.6, 0, 0.6],
    rotation: -Math.PI / 2,
    type: 'lounge',
    seatOffset: [0, 0.55, 0],
    seatRotationOffset: 0,
    isSeated: true,
    occupiedBy: null
  },
  {
    id: 'station_coffee',
    name: 'Quầy Pha Cà Phê',
    position: [5.25, 0, -1.4],
    rotation: -Math.PI / 2,
    type: 'coffee',
    seatOffset: [0, 0, 0.85],
    seatRotationOffset: Math.PI,
    isSeated: false,
    occupiedBy: null
  },
  {
    id: 'station_cat',
    name: 'Bát Ăn Mèo GitCat',
    position: [-5.15, 0, -2.4],
    rotation: Math.PI / 2,
    type: 'cat',
    seatOffset: [0, 0, 0.8],
    seatRotationOffset: Math.PI,
    isSeated: false,
    occupiedBy: null
  },
  {
    id: 'station_restroom',
    name: 'Cửa Restroom',
    position: [5.72, 0, -3.2],
    rotation: -Math.PI / 2,
    type: 'restroom',
    seatOffset: [0, 0, 0.9],
    seatRotationOffset: Math.PI,
    isSeated: false,
    occupiedBy: null
  }
];

// Bản đồ vị trí trạm làm việc mặc định cho từng nhân sự
export const HOME_STATIONS: Record<string, string> = {
  agent_1: 'station_research',
  agent_2: 'station_director',
  agent_3: 'station_qa',
  agent_4: 'station_server'
};

// Tìm trạm làm việc chính xác cho từng Agent
const directorStation = INITIAL_WORKSTATIONS.find((s) => s.id === 'station_director')!;
const researchStation = INITIAL_WORKSTATIONS.find((s) => s.id === 'station_research')!;
const qaStation = INITIAL_WORKSTATIONS.find((s) => s.id === 'station_qa')!;
const serverStation = INITIAL_WORKSTATIONS.find((s) => s.id === 'station_server')!;

const initialKen = getWorkstationSeatTransform(directorStation);
const initialNa = getWorkstationSeatTransform(researchStation);
const initialLuc = getWorkstationSeatTransform(qaStation);
const initialCuu = getWorkstationSeatTransform(serverStation);

export const INITIAL_AGENTS: AgentData[] = [
  {
    id: 'agent_1',
    name: 'Pé Na',
    codename: 'Pé Na',
    role: 'Deep Web & Data Crawler',
    position: initialNa.worldPosition,
    targetPosition: null,
    targetRotation: initialNa.worldRotation,
    isSeated: initialNa.isSeated,
    status: 'working',
    currentStationId: 'station_research',
    pendingStationId: null,
    blessed: false,
    currentTask: 'Phân tích tài liệu và cấu trúc API mới...',
    progress: 78,
    color: '#06b6d4',
    accentColor: '#a855f7',
    accessory: 'cyber-visor',
    thoughtIcon: '🔍',
    thoughtText: 'Pé Na đang crawl dữ liệu tài liệu API...',
    modelUrl: '/models/agent_researcher.glb'
  },
  {
    id: 'agent_2',
    name: 'Pé Ken',
    codename: 'Pé Ken',
    role: 'Core Systems Developer',
    position: initialKen.worldPosition,
    targetPosition: null,
    targetRotation: initialKen.worldRotation,
    isSeated: initialKen.isSeated,
    status: 'working',
    currentStationId: 'station_director',
    pendingStationId: null,
    blessed: false,
    currentTask: 'Biên dịch Core Engine & TDD modules...',
    progress: 45,
    color: '#f97316',
    accentColor: '#38bdf8',
    accessory: 'headphones',
    thoughtIcon: '💻',
    thoughtText: 'Pé Ken vừa biên dịch xong 42 test units!',
    modelUrl: '/models/agent_coder.glb'
  },
  {
    id: 'agent_3',
    name: 'Lão Lục',
    codename: 'Lão Lục',
    role: 'Quality & Security Auditor',
    position: initialLuc.worldPosition,
    targetPosition: null,
    targetRotation: initialLuc.worldRotation,
    isSeated: initialLuc.isSeated,
    status: 'working',
    currentStationId: 'station_qa',
    pendingStationId: null,
    blessed: false,
    currentTask: 'Kiểm toán quy chuẩn Clean Code & Security...',
    progress: 92,
    color: '#ec4899',
    accentColor: '#8b5cf6',
    accessory: 'cat-ears',
    thoughtIcon: '🛡️',
    thoughtText: 'Lão Lục đã soi ra bug, đố ai lươn lẹo được!',
    modelUrl: '/models/agent_reviewer.glb'
  },
  {
    id: 'agent_4',
    name: 'Lão Cửu',
    codename: 'Lão Cửu',
    role: 'Infrastructure & Pod Deployment',
    position: initialCuu.worldPosition,
    targetPosition: null,
    targetRotation: initialCuu.worldRotation,
    isSeated: initialCuu.isSeated,
    status: 'working',
    currentStationId: 'station_server',
    pendingStationId: null,
    blessed: false,
    currentTask: 'Cấu hình cluster máy chủ & Docker mesh...',
    progress: 60,
    color: '#10b981',
    accentColor: '#facc15',
    accessory: 'cap',
    thoughtIcon: '⚡',
    thoughtText: 'Lão Cửu deploy pod thành công trên node 01!',
    modelUrl: '/models/agent_devops.glb'
  }
];

export const INITIAL_DIALOGUES: DialogueLog[] = [
  {
    id: 'dlg_1',
    timestamp: '09:00',
    senderName: 'Pé Ken',
    senderColor: '#f97316',
    message: 'Chào buổi sáng cả đội! Vừa thắp 3 nén hương bái Phật xin vía, hôm nay quyết tâm deploy 0 bug! 🙏',
    icon: '☕'
  },
  {
    id: 'dlg_2',
    timestamp: '09:05',
    senderName: 'Pé Na',
    senderColor: '#06b6d4',
    message: 'Dự báo hôm nay trời 27°C mát dịu, trà sữa đầu hẻm giảm giá 40%, ai ké đơn trân châu đường đen hông? 🧋',
    icon: '🌤️'
  },
  {
    id: 'dlg_3',
    timestamp: '09:12',
    senderName: 'Lão Lục',
    senderColor: '#ec4899',
    message: 'Lão Lục đang soi Clean Code, ai đặt tên biến `dung_xoa_nha_123` thì tự giác bao cả phòng trà sữa nha! 😂',
    icon: '🛡️'
  },
  {
    id: 'dlg_4',
    timestamp: '09:15',
    senderName: 'Lão Cửu',
    senderColor: '#10b981',
    message: 'Server node-01 uptime 99.999% mượt như bơ. Có Lão Cửu ở đây thì cluster vững như bàn thạch! 🚀',
    icon: '⚡'
  }
];

export function useAgentStore() {
  const [agents, setAgents] = useState<AgentData[]>(INITIAL_AGENTS);
  const [workstations, setWorkstations] = useState<WorkstationData[]>(INITIAL_WORKSTATIONS);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>('agent_2');
  const [clickTarget, setClickTarget] = useState<[number, number, number] | null>(null);
  const [dialogueLogs, setDialogueLogs] = useState<DialogueLog[]>(INITIAL_DIALOGUES);

  // Ref lưu trạng thái agents mới nhất để đọc đồng bộ từ timer/callback mà không cần dùng updater side-effect
  const agentsRef = useRef<AgentData[]>(INITIAL_AGENTS);
  agentsRef.current = agents;

  // Ref chống trùng lặp tin nhắn liên tiếp trong khoảng thời gian ngắn
  const lastDialogueRef = useRef<{ sender: string; message: string; time: number } | null>(null);

  // Trạng thái hiệu ứng tâm linh & đạn đạo
  const [projectiles, setProjectiles] = useState<SpiritualProjectile[]>([]);
  const [buddhaSpeech, setBuddhaSpeech] = useState<string | null>(null);
  const [christianSpeech, setChristianSpeech] = useState<string | null>(null);
  const [buddhaMiracleActive, setBuddhaMiracleActive] = useState<boolean>(false);
  const [christianMiracleActive, setChristianMiracleActive] = useState<boolean>(false);

  // Ref lưu hàm dispatch để giải quyết gọi lồng nhau trong completeMovement
  const dispatchRef = useRef<(agentId: string, stationId: string, requirePrayer?: boolean) => void>(() => {});

  /**
   * Thêm log hội thoại mới vào feed và hiển thị bong bóng chat trên đầu nhân vật.
   * Tích hợp bộ lọc chống trùng lặp: loại bỏ các tin nhắn giống hệt từ cùng 1 người trong vòng 2.5 giây.
   */
  const addDialogue = useCallback((senderName: string, senderColor: string, message: string, icon: string, targetAgentId?: string) => {
    const nowMs = Date.now();

    // 🛡️ BỘ LỌC CHỐNG TRÙNG LẶP LIÊN TIẾP:
    // Ngăn chặn hoàn toàn việc gọi lặp cùng 1 tin nhắn do React StrictMode hoặc vòng lặp frame
    if (
      lastDialogueRef.current &&
      lastDialogueRef.current.sender === senderName &&
      lastDialogueRef.current.message === message &&
      nowMs - lastDialogueRef.current.time < 2500
    ) {
      return;
    }
    lastDialogueRef.current = { sender: senderName, message, time: nowMs };

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setDialogueLogs((prev) => [
      ...prev.slice(-6),
      {
        id: `dlg_${nowMs}_${Math.random()}`,
        timestamp: timeStr,
        senderName,
        senderColor,
        message,
        icon
      }
    ]);

    // Tìm Agent phát biểu để gắn lời thoại trực tiếp trên đầu
    const currentAgents = agentsRef.current;
    const speaker = currentAgents.find((a) => {
      if (targetAgentId) return a.id === targetAgentId;
      return (a.codename && senderName.includes(a.codename)) || senderName.includes(a.name);
    });

    if (speaker) {
      setAgents((prev) =>
        prev.map((a) => (a.id === speaker.id ? { ...a, speechText: message } : a))
      );

      // Hẹn giờ thu hồi bong bóng thoại sau 5.5s (lên lịch độc lập bên ngoài setState)
      setTimeout(() => {
        setAgents((curr) =>
          curr.map((a) => (a.id === speaker.id && a.speechText === message ? { ...a, speechText: null } : a))
        );
      }, 5500);
    }
  }, []);

  /**
   * Chọn Agent để theo dõi hoặc điều khiển
   */
  const selectAgent = useCallback((id: string | null) => {
    setSelectedAgentId(id);
  }, []);

  /**
   * Cập nhật điểm đến khi người dùng click tự do trên sàn nhà
   */
  const setAgentTarget = useCallback(
    (id: string, target: [number, number, number]) => {
      // Khi click trên sàn, đích đến luôn ở mặt sàn Y = 0
      const floorTarget: [number, number, number] = [target[0], 0, target[2]];
      const targetAgent = agentsRef.current.find((a) => a.id === id);

      if (targetAgent) {
        addDialogue(
          targetAgent.codename || targetAgent.name,
          targetAgent.color,
          `Đang bước tới sàn [${target[0].toFixed(1)}, ${target[2].toFixed(1)}]`,
          '🏃',
          targetAgent.id
        );
      }

      setAgents((prev) =>
        prev.map((agent) => {
          if (agent.id === id) {
            return {
              ...agent,
              targetPosition: floorTarget,
              targetRotation: null,
              isSeated: false,
              currentStationId: null,
              pendingStationId: null,
              status: 'moving',
              thoughtIcon: '🏃',
              thoughtText: 'Đang di chuyển trên sàn...',
              currentTask: `Di chuyển đến [${target[0].toFixed(1)}, ${target[2].toFixed(1)}]...`
            };
          }
          return agent;
        })
      );
      setClickTarget(floorTarget);
    },
    [addDialogue]
  );

  /**
   * Cập nhật trạng thái trực tiếp của Agent
   */
  const setAgentStatus = useCallback((id: string, status: AgentStatus, taskName?: string) => {
    setAgents((prev) =>
      prev.map((agent) => {
        if (agent.id === id) {
          return {
            ...agent,
            status,
            currentTask: taskName || agent.currentTask,
            progress: status === 'working' ? Math.floor(Math.random() * 40) + 10 : status === 'idle' ? 0 : agent.progress
          };
        }
        return agent;
      })
    );
  }, []);

  /**
   * Điều phối Agent đến một trạm làm việc cụ thể.
   * QUY TẮC CỐT LÕI: Nếu chưa bái Phật, Agent phải ghé Đài Sen bái Phật trước khi vào bàn làm việc!
   */
  const dispatchToWorkstation = useCallback(
    (agentId: string, stationId: string, requirePrayer: boolean = true) => {
      const station = workstations.find((s) => s.id === stationId);
      if (!station) return;

      const currentAgent = agentsRef.current.find((a) => a.id === agentId);
      if (!currentAgent) return;

      // Nếu mục tiêu chính là Đài Sen Bái Phật, Bàn Thờ Chúa, Sinh hoạt văn phòng, hoặc requirePrayer = false (đã bái rồi)
      const isRoutineStation =
        stationId === 'station_coffee' || stationId === 'station_cat' || stationId === 'station_restroom';

      if (stationId === 'station_buddha' || stationId === 'station_cross' || isRoutineStation || !requirePrayer) {
        const transform = getWorkstationSeatTransform(station);

        let routineSpeech = '';
        let routineIcon = '🚶';
        if (stationId === 'station_coffee') {
          routineSpeech = OFFICE_ROUTINE_SCRIPTS.coffee.startSpeech;
          routineIcon = '☕';
        } else if (stationId === 'station_cat') {
          routineSpeech = OFFICE_ROUTINE_SCRIPTS.cat.startSpeech;
          routineIcon = '🐱';
        } else if (stationId === 'station_restroom') {
          routineSpeech = OFFICE_ROUTINE_SCRIPTS.restroom.startSpeech;
          routineIcon = '🚻';
        }

        // Gọi addDialogue ĐÚNG 1 LẦN DUY NHẤT BÊN NGOÀI setAgents
        addDialogue(
          currentAgent.codename || currentAgent.name,
          currentAgent.color,
          routineSpeech || `Đang di chuyển đến ${station.name}...`,
          routineIcon,
          currentAgent.id
        );

        setAgents((prev) =>
          prev.map((agent) => {
            if (agent.id === agentId) {
              return {
                ...agent,
                targetPosition: transform.worldPosition,
                targetRotation: transform.worldRotation,
                isSeated: transform.isSeated,
                currentStationId: stationId,
                pendingStationId: isRoutineStation ? (agent.currentStationId || HOME_STATIONS[agent.id]) : null,
                status: 'moving',
                thoughtIcon: routineIcon,
                thoughtText: routineSpeech || `Đi tới ${station.name}...`,
                currentTask: routineSpeech || `Di chuyển đến ${station.name}...`
              };
            }
            return agent;
          })
        );

        setWorkstations((prev) =>
          prev.map((s) => {
            if (s.id === stationId) return { ...s, occupiedBy: agentId };
            if (s.occupiedBy === agentId) return { ...s, occupiedBy: null };
            return s;
          })
        );

        setClickTarget(transform.worldPosition);
        return;
      }

      // NẾU CHƯA BÁI PHẬT: Tự động ghé Đài Sen Bái Phật trước khi bắt đầu công việc!
      const buddhaStation = workstations.find((s) => s.id === 'station_buddha');
      if (buddhaStation) {
        const buddhaTransform = getWorkstationSeatTransform(buddhaStation);

        addDialogue(
          currentAgent.codename || currentAgent.name,
          currentAgent.color,
          `Trước khi vào làm việc tại ${station.name}, mình phải ghé Đài Sen bái Phật cầu bình an, 0% Bug! 🙏`,
          '🙏'
        );

        setAgents((prev) =>
          prev.map((agent) => {
            if (agent.id === agentId) {
              return {
                ...agent,
                targetPosition: buddhaTransform.worldPosition,
                targetRotation: buddhaTransform.worldRotation,
                isSeated: false,
                currentStationId: 'station_buddha',
                pendingStationId: stationId, // Lưu lại trạm đích để sau khi bái Phật xong sẽ đi tiếp
                status: 'moving',
                thoughtIcon: '🙏',
                thoughtText: 'Ghé Đài Sen bái Phật trước...',
                currentTask: `Bái Phật cầu an trước khi nhận nhiệm vụ tại ${station.name}...`
              };
            }
            return agent;
          })
        );

        setClickTarget(buddhaTransform.worldPosition);
      }
    },
    [workstations, agents, addDialogue]
  );

  // Cập nhật ref cho hàm dispatchToWorkstation
  useEffect(() => {
    dispatchRef.current = dispatchToWorkstation;
  }, [dispatchToWorkstation]);

  /**
   * Cập nhật vị trí hiện tại khi Agent di chuyển hoàn tất
   */
  const completeMovement = useCallback(
    (id: string, finalPosition: [number, number, number]) => {
      const targetAgent = agentsRef.current.find((a) => a.id === id);
      if (!targetAgent || !targetAgent.targetPosition) return;

      const stationId = targetAgent.currentStationId;

      // 1. Xử lý các side-effect (Hội thoại & Lên lịch di chuyển tiếp theo) HOÀN TOÀN NGOÀI setAgents
      if (stationId === 'station_buddha') {
        addDialogue(
          targetAgent.codename || targetAgent.name,
          targetAgent.color,
          '🙏 Đã thành tâm cúi lạy 3 lạy trước tượng Phật: Cầu giải trừ mọi lỗi bug, deploy suôn sẻ êm đềm!',
          '🙏',
          id
        );
        const destStationId = targetAgent.pendingStationId || HOME_STATIONS[id] || 'station_director';
        setTimeout(() => {
          dispatchRef.current(id, destStationId, false);
        }, 2800);
      } else if (stationId === 'station_cross') {
        addDialogue(
          targetAgent.codename || targetAgent.name,
          targetAgent.color,
          '✝️ Đã thành kính cầu nguyện trước Thánh Giá Chúa: Cầu bình an, sáng suốt, hệ thống ổn định 100%!',
          '✝️',
          id
        );
        const destStationId = targetAgent.pendingStationId || HOME_STATIONS[id] || 'station_director';
        setTimeout(() => {
          dispatchRef.current(id, destStationId, false);
        }, 2800);
      } else if (stationId === 'station_coffee') {
        addDialogue(
          targetAgent.codename || targetAgent.name,
          targetAgent.color,
          OFFICE_ROUTINE_SCRIPTS.coffee.endSpeech,
          '☕',
          id
        );
        const returnStationId = targetAgent.pendingStationId || HOME_STATIONS[id] || 'station_director';
        setTimeout(() => {
          dispatchRef.current(id, returnStationId, false);
        }, 3500);
      } else if (stationId === 'station_cat') {
        addDialogue(
          targetAgent.codename || targetAgent.name,
          targetAgent.color,
          OFFICE_ROUTINE_SCRIPTS.cat.endSpeech,
          '🐱',
          id
        );
        const returnStationId = targetAgent.pendingStationId || HOME_STATIONS[id] || 'station_director';
        setTimeout(() => {
          dispatchRef.current(id, returnStationId, false);
        }, 3500);
      } else if (stationId === 'station_restroom') {
        addDialogue(
          targetAgent.codename || targetAgent.name,
          targetAgent.color,
          OFFICE_ROUTINE_SCRIPTS.restroom.endSpeech,
          '🚻',
          id
        );
        const returnStationId = targetAgent.pendingStationId || HOME_STATIONS[id] || 'station_director';
        setTimeout(() => {
          dispatchRef.current(id, returnStationId, false);
        }, 3500);
      }

      // 2. Cập nhật state thuần túy (Pure State Updates, không side-effect)
      setAgents((prev) =>
        prev.map((agent) => {
          if (agent.id !== id) return agent;

          // 1. Đài Sen Bái Phật
          if (stationId === 'station_buddha') {
            return {
              ...agent,
              position: [finalPosition[0], 0, finalPosition[2]],
              targetPosition: null,
              isSeated: false,
              status: 'praying',
              blessed: true,
              thoughtIcon: '🙏',
              thoughtText: '🙏 Nam Mô A Di Đà Phật • Cầu code không bug!',
              currentTask: 'Đang thành tâm chắp tay vái lạy bái Phật...'
            };
          }

          // 1.5. Bàn Thờ Chúa
          if (stationId === 'station_cross') {
            return {
              ...agent,
              position: [finalPosition[0], 0, finalPosition[2]],
              targetPosition: null,
              isSeated: false,
              status: 'praying',
              blessed: true,
              thoughtIcon: '✝️',
              thoughtText: '✝️ Cầu Chúa ban phước • Bình an & Vững bền!',
              currentTask: 'Đang thành tâm cầu nguyện trước Thánh Giá Chúa...'
            };
          }

          // 1.6. Quầy Cà Phê
          if (stationId === 'station_coffee') {
            return {
              ...agent,
              position: [finalPosition[0], 0, finalPosition[2]],
              targetPosition: null,
              isSeated: false,
              status: 'idle',
              thoughtIcon: '☕',
              thoughtText: OFFICE_ROUTINE_SCRIPTS.coffee.endThought,
              currentTask: 'Đang pha và thưởng thức Americano tại quầy Bar...'
            };
          }

          // 1.7. Cho Mèo GitCat Ăn
          if (stationId === 'station_cat') {
            return {
              ...agent,
              position: [finalPosition[0], 0, finalPosition[2]],
              targetPosition: null,
              isSeated: false,
              status: 'idle',
              thoughtIcon: '🐱',
              thoughtText: OFFICE_ROUTINE_SCRIPTS.cat.endThought,
              currentTask: 'Đang cho mèo GitCat ăn súp thưởng và vuốt ve...'
            };
          }

          // 1.8. Restroom
          if (stationId === 'station_restroom') {
            return {
              ...agent,
              position: [finalPosition[0], 0, finalPosition[2]],
              targetPosition: null,
              isSeated: false,
              status: 'idle',
              thoughtIcon: '🚻',
              thoughtText: OFFICE_ROUTINE_SCRIPTS.restroom.endThought,
              currentTask: 'Đang rửa mặt refresh tinh thần trong Restroom...'
            };
          }

          // 2. Trạm làm việc chính thức (ghế Giám đốc, bàn họp, sofa)
          const currentStation = stationId ? workstations.find((s) => s.id === stationId) : null;
          if (currentStation) {
            const newIcon =
              agent.id === 'agent_1'
                ? '🔍'
                : agent.id === 'agent_2'
                ? '💻'
                : agent.id === 'agent_3'
                ? '🛡️'
                : '⚡';

            const newThought = agent.blessed
              ? '✨ Được Đức Phật phù hộ: 0% Bug, 100% Green Test!'
              : 'Đang tập trung làm việc tại trạm...';

            return {
              ...agent,
              position: finalPosition,
              targetPosition: null,
              isSeated: currentStation.isSeated,
              status: 'working',
              thoughtIcon: newIcon,
              thoughtText: newThought,
              currentTask: agent.blessed
                ? 'Đang thực thi tác vụ (Có phước lành Phật hộ trì)...'
                : 'Đang thực thi tác vụ tại trạm...'
            };
          }

          // 3. Vị trí tự do trên sàn nhà
          return {
            ...agent,
            position: [finalPosition[0], 0, finalPosition[2]],
            targetPosition: null,
            isSeated: false,
            status: 'idle',
            thoughtIcon: '☕',
            thoughtText: 'Dạo quanh văn phòng ngắm cảnh...',
            currentTask: 'Nghỉ ngơi, ngắm cảnh văn phòng'
          };
        })
      );
      setClickTarget(null);
    },
    [addDialogue, workstations]
  );

  /**
   * Toàn thể đội ngũ AI Agent cùng nhau xếp hàng trang nghiêm trước đài sen bái Phật
   */
  const teamPrayer = useCallback(() => {
    addDialogue(
      'Cả Đội Ngũ AI',
      '#fbbf24',
      'Toàn đội tạm gác mọi tác vụ, cùng xếp hàng trang nghiêm trước Đài Sen dâng hương bái Phật!',
      '🙏'
    );

    // 4 vị trí xếp hàng ngay ngắn trước bàn thờ Phật [-2.4, 0, -4.8], hoàn toàn thoáng đãng, không vướng bàn ghế
    const prayerLine: [number, number, number][] = [
      [-2.8, 0, -3.6],
      [-2.0, 0, -3.6],
      [-2.8, 0, -2.8],
      [-2.0, 0, -2.8]
    ];

    setAgents((prev) =>
      prev.map((agent, idx) => {
        const pos = prayerLine[idx % prayerLine.length];
        return {
          ...agent,
          targetPosition: pos,
          targetRotation: Math.PI, // Quay mặt 180 độ nhìn thẳng vào tượng Phật (-Z)
          isSeated: false,
          currentStationId: 'station_buddha',
          pendingStationId: agent.currentStationId || HOME_STATIONS[agent.id] || 'station_director',
          status: 'moving',
          thoughtIcon: '🙏',
          thoughtText: 'Cùng cả đội đi dâng hương bái Phật...',
          currentTask: 'Xếp hàng dâng hương trước tượng Phật...'
        };
      })
    );
  }, [addDialogue]);

  /**
   * Toàn thể đội ngũ AI Agent cùng nhau xếp hàng trang nghiêm trước Bàn Thờ Chúa & Thánh Giá cầu nguyện
   */
  const christianPrayer = useCallback(() => {
    addDialogue(
      'Cả Đội Ngũ AI',
      '#fde047',
      'Toàn đội tạm gác mọi tác vụ, cùng xếp hàng trang nghiêm trước Bàn Thờ Chúa & Thánh Giá cầu nguyện bình an!',
      '✝️'
    );

    // 4 vị trí xếp hàng ngay ngắn trước bàn thờ Chúa [2.4, 0, -4.8]
    const christianLine: [number, number, number][] = [
      [2.0, 0, -3.6],
      [2.8, 0, -3.6],
      [2.0, 0, -2.8],
      [2.8, 0, -2.8]
    ];

    setAgents((prev) =>
      prev.map((agent, idx) => {
        const pos = christianLine[idx % christianLine.length];
        return {
          ...agent,
          targetPosition: pos,
          targetRotation: Math.PI, // Quay mặt 180 độ nhìn thẳng vào Thánh Giá (-Z)
          isSeated: false,
          currentStationId: 'station_cross',
          pendingStationId: agent.currentStationId || HOME_STATIONS[agent.id] || 'station_director',
          status: 'moving',
          thoughtIcon: '✝️',
          thoughtText: 'Cùng cả đội đi cầu nguyện trước Thánh Giá Chúa...',
          currentTask: 'Xếp hàng cầu nguyện trước Thánh Giá Chúa...'
        };
      })
    );
  }, [addDialogue]);

  /**
   * 📿 Phật Phóng Tràng Hạt: Kích hoạt thần tích tượng Phật, hiện hình bóng Phật Tổ và phóng chuỗi tràng hạt bay xé gió
   */
  const castBuddhaMiracle = useCallback((customQuote?: string) => {
    const quote = customQuote || getRandomBuddhaMeme();
    setBuddhaSpeech(quote);
    setBuddhaMiracleActive(true);

    addDialogue(
      '🙏 Đức Phật Từ Bi',
      '#f59e0b',
      `"${quote}"`,
      '📿'
    );

    // Bắn 2 chuỗi tràng hạt bồ đề bay tỏa về phía phòng họp & bàn làm việc
    const now = Date.now();
    const newProjectiles: SpiritualProjectile[] = [
      {
        id: `bead_${now}_1`,
        type: 'bead',
        startPosition: [-2.4, 1.25, -4.8],
        targetPosition: [0, 0.75, -3.4], // Hướng về bàn Giám đốc Pé Ken
        currentPosition: [-2.4, 1.25, -4.8],
        progress: 0,
        speed: 0.55
      },
      {
        id: `bead_${now}_2`,
        type: 'bead',
        startPosition: [-2.4, 1.25, -4.8],
        targetPosition: [-1.15, 0.75, 1.0], // Hướng về bàn họp Pé Na & Lão Lục
        currentPosition: [-2.4, 1.25, -4.8],
        progress: 0,
        speed: 0.48
      }
    ];

    setProjectiles((prev) => [...prev, ...newProjectiles]);

    // Hiện thân Phật duy trì 3.2s rồi vụt mất, câu thoại biến mất sau 5s
    setTimeout(() => {
      setBuddhaMiracleActive(false);
    }, 3200);

    setTimeout(() => {
      setBuddhaSpeech(null);
    }, 5200);
  }, [addDialogue]);

  /**
   * 🔨 Chúa Ban Đinh: Kích hoạt thần tích Thánh Giá, hiện luồng sáng thiên thần và bắn đinh sắt xé gió
   */
  const castChristianMiracle = useCallback((customQuote?: string) => {
    const quote = customQuote || getRandomChristianMeme();
    setChristianSpeech(quote);
    setChristianMiracleActive(true);

    addDialogue(
      '✝️ Thánh Giá Uy Nghi',
      '#fbbf24',
      `"${quote}"`,
      '🔨'
    );

    // Bắn 3 chiếc Đinh Thánh xoay tít xé gió về phía phòng
    const now = Date.now();
    const newProjectiles: SpiritualProjectile[] = [
      {
        id: `nail_${now}_1`,
        type: 'nail',
        startPosition: [2.4, 1.35, -4.8],
        targetPosition: [0, 0.8, -3.4], // Hướng về bàn Giám đốc Pé Ken
        currentPosition: [2.4, 1.35, -4.8],
        progress: 0,
        speed: 0.65
      },
      {
        id: `nail_${now}_2`,
        type: 'nail',
        startPosition: [2.4, 1.35, -4.8],
        targetPosition: [1.15, 0.8, 0.8], // Hướng về Lão Cửu
        currentPosition: [2.4, 1.35, -4.8],
        progress: 0,
        speed: 0.58
      },
      {
        id: `nail_${now}_3`,
        type: 'nail',
        startPosition: [2.4, 1.35, -4.8],
        targetPosition: [-1.15, 0.8, 0.8], // Hướng về Pé Na
        currentPosition: [2.4, 1.35, -4.8],
        progress: 0,
        speed: 0.52
      }
    ];

    setProjectiles((prev) => [...prev, ...newProjectiles]);

    // Hiện thân thiên thần duy trì 3.2s rồi vụt mất, câu thoại biến mất sau 5s
    setTimeout(() => {
      setChristianMiracleActive(false);
    }, 3200);

    setTimeout(() => {
      setChristianSpeech(null);
    }, 5200);
  }, [addDialogue]);

  /**
   * 🏃 Kích hoạt phản ứng né tránh (Dodge Reaction) của Agent khi đạn đạo bay tới gần
   */
  const triggerAgentDodge = useCallback((agentId: string, threatType: 'nail' | 'bead') => {
    const targetAgent = agentsRef.current.find((a) => a.id === agentId);
    if (!targetAgent) return;

    const reaction = getRandomDodgeReaction(agentId);

    // 1. Gửi thoại né tránh ĐÚNG 1 LẦN bên ngoài setAgents
    addDialogue(
      targetAgent.codename || targetAgent.name,
      targetAgent.color,
      reaction,
      threatType === 'nail' ? '🔨' : '📿',
      targetAgent.id
    );

    const oldTask = targetAgent.currentTask;

    // 2. Lên lịch khôi phục trạng thái làm việc sau 2.2 giây (bên ngoài setAgents)
    setTimeout(() => {
      setAgents((curr) =>
        curr.map((a) =>
          a.id === agentId
            ? {
                ...a,
                status: a.isSeated ? 'working' : 'idle',
                thoughtIcon: '😌',
                thoughtText: 'Phù... may mà né kịp!',
                currentTask: oldTask
              }
            : a
        )
      );
    }, 2200);

    // 3. Cập nhật trạng thái né tránh (Pure state update)
    setAgents((prev) =>
      prev.map((a) =>
        a.id === agentId
          ? {
              ...a,
              status: 'dodging',
              thoughtIcon: '⚠️',
              thoughtText: reaction,
              currentTask: threatType === 'nail' ? 'Cúi rạp người né Đinh Thánh!' : 'Cúi đầu né Tràng Hạt!'
            }
          : a
      )
    );
  }, [addDialogue]);

  /**
   * ✈️ Vòng lặp cập nhật quỹ đạo bay của các đạn đạo tâm linh (Projectiles Interpolation Loop)
   */
  useEffect(() => {
    if (projectiles.length === 0) return;

    const interval = setInterval(() => {
      setProjectiles((prev) => {
        const next: SpiritualProjectile[] = [];

        prev.forEach((p) => {
          const newProgress = p.progress + 0.04 * (p.speed / 0.5);

          if (newProgress < 1.0) {
            // Nội suy vị trí bay từ startPosition -> targetPosition
            const [sx, sy, sz] = p.startPosition;
            const [tx, ty, tz] = p.targetPosition;
            const curX = sx + (tx - sx) * newProgress;
            // Đạn bay theo đường cong parabol nhẹ trong không trung
            const arcY = Math.sin(newProgress * Math.PI) * 0.45;
            const curY = sy + (ty - sy) * newProgress + arcY;
            const curZ = sz + (tz - sz) * newProgress;

            next.push({
              ...p,
              progress: newProgress,
              currentPosition: [curX, curY, curZ]
            });
          }
        });

        return next;
      });
    }, 32);

    return () => clearInterval(interval);
  }, [projectiles.length]);

  /**
   * ⏱️ Tự động kích hoạt Thần Tích định kỳ (mỗi 24 - 30 giây luân phiên Phật hoặc Chúa)
   */
  useEffect(() => {
    const timer = setInterval(() => {
      // 50% Phật phóng tràng hạt, 50% Chúa ban đinh
      if (Math.random() > 0.5) {
        castBuddhaMiracle();
      } else {
        castChristianMiracle();
      }
    }, 28000);

    return () => clearInterval(timer);
  }, [castBuddhaMiracle, castChristianMiracle]);

  /**
   * ⏱️ Ambient Office Chatter: Tự động phát sinh những mẩu tin tức công nghệ xác thực và chuyện phiếm dí dỏm.
   * Tần suất giãn cách 45 giây (giảm tần suất nói liên tục để không gây rối mắt).
   * Cơ chế chống lặp thông minh: Câu hài hước hạn chế lặp lại trong ngày, tin tức xác thực cho phép lặp lại bình thường.
   */
  useEffect(() => {
    const timer = setInterval(() => {
      const currentAgents = agentsRef.current;
      // Chỉ chọn các Agent đang rảnh rỗi hoặc làm việc, không bận bái Phật hay né đạn
      const candidates = currentAgents.filter(
        (a) => a.status !== 'praying' && a.status !== 'dodging' && a.status !== 'moving'
      );
      if (candidates.length === 0) return;

      const randomAgent = candidates[Math.floor(Math.random() * candidates.length)];
      const quote = getSmartAmbientQuote(randomAgent.id);

      // Gọi addDialogue ĐÚNG 1 LẦN bên ngoài setAgents
      addDialogue(
        randomAgent.codename || randomAgent.name,
        randomAgent.color,
        quote.chatMessage,
        quote.icon,
        randomAgent.id
      );

      setAgents((prev) =>
        prev.map((a) =>
          a.id === randomAgent.id
            ? {
                ...a,
                thoughtIcon: quote.icon,
                thoughtText: quote.thought
              }
            : a
        )
      );
    }, 45000);

    return () => clearInterval(timer);
  }, [addDialogue]);

  /**
   * 🚶 Sinh hoạt văn phòng đời thường tự động (Autonomous Living Routines):
   * Định kỳ mỗi 65 giây, 1 nhân sự đang ngồi làm việc sẽ tự động đứng dậy xin phép
   * đi pha cà phê nạp caffeine, cho mèo GitCat ăn súp thưởng, hoặc ghé Restroom rửa mặt,
   * sau đó tự động trở về bàn làm việc tiếp tục công việc.
   */
  useEffect(() => {
    const routineTimer = setInterval(() => {
      const currentAgents = agentsRef.current;
      const eligibleAgents = currentAgents.filter(
        (a) => a.status === 'working' && a.isSeated && !a.targetPosition
      );
      if (eligibleAgents.length === 0) return;

      const chosenAgent = eligibleAgents[Math.floor(Math.random() * eligibleAgents.length)];
      const routineStations = ['station_coffee', 'station_cat', 'station_restroom'];
      const chosenStation = routineStations[Math.floor(Math.random() * routineStations.length)];

      // Kích hoạt điều phối trực tiếp, KHÔNG GỌI setAgents bọc ngoài
      dispatchRef.current(chosenAgent.id, chosenStation, false);
    }, 65000);

    return () => clearInterval(routineTimer);
  }, []);

  /**
   * 💼 Giả lập tín hiệu công việc mới từ backend (Push Event):
   * Khi có công việc giao tới, cả 4 nhân sự hào hứng trao đổi thảo luận nhiệt tình theo chuỗi!
   */
  const simulateBackendEvent = useCallback(() => {
    WORK_COLLABORATION_DIALOGUES.forEach((item, index) => {
      setTimeout(() => {
        const currentAgents = agentsRef.current;
        const speaker = currentAgents.find((a) => a.id === item.speaker);
        if (!speaker) return;

        addDialogue(
          speaker.codename || speaker.name,
          speaker.color,
          item.text,
          item.icon,
          speaker.id
        );

        setAgents((prev) =>
          prev.map((a) =>
            a.id === speaker.id
              ? {
                  ...a,
                  status: 'working',
                  thoughtIcon: item.icon,
                  thoughtText: item.text,
                  progress: Math.floor(Math.random() * 40) + 35
                }
              : a
          )
        );
      }, index * 2000); // Cách nhau 2s cho người dùng đọc rõ từng tin nhắn trực tiếp trên đầu
    });
  }, [addDialogue]);

  const isPrayingAny = agents.some((a) => a.status === 'praying');

  return {
    agents,
    workstations,
    selectedAgentId,
    clickTarget,
    dialogueLogs,
    isPrayingAny,
    projectiles,
    buddhaSpeech,
    christianSpeech,
    buddhaMiracleActive,
    christianMiracleActive,
    selectAgent,
    setAgentTarget,
    setAgentStatus,
    completeMovement,
    dispatchToWorkstation,
    teamPrayer,
    christianPrayer,
    castBuddhaMiracle,
    castChristianMiracle,
    triggerAgentDodge,
    simulateBackendEvent,
    addDialogue
  };
}
