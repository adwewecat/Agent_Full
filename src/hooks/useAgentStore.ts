/**
 * @file useAgentStore.ts
 * @description Hook quản lý trạng thái tập trung của Hội Đồng Lãnh Đạo C-Suite F&B & Xuất Nhập Khẩu
 * (COO Bác Nam, CFO Bác Thắng, CRO Bác Hoàng với hơn 40 năm kinh nghiệm).
 * Quản lý điều phối di chuyển, họp tranh luận phản biện 3 vòng độc lập, tra cứu số liệu mạng,
 * tổng hợp Báo Cáo Thống Nhất Chiến Lược (Consensus Report) và lưu trữ lịch sử trong localStorage.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  AgentData,
  WorkstationData,
  DialogueLog,
  SpiritualProjectile,
  getWorkstationSeatTransform
} from '../types/agent';
import {
  ExecutiveRole,
  DebateMessage,
  ConsensusReport,
  DebateSession
} from '../types/executive';
import {
  EXECUTIVE_DIRECTORS,
  executeDirectorTurn,
  compileConsensusReport,
  loadSessionHistory,
  saveSessionHistory
} from '../services/geminiExecutiveService';
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
    seatOffset: [0, 0, 1.2],
    seatRotationOffset: Math.PI,
    isSeated: false,
    occupiedBy: null
  },
  {
    id: 'station_director',
    name: 'Bàn Giám Đốc (COO Bác Nam)',
    position: [0, 0, -3.4],
    rotation: 0,
    type: 'coding',
    seatOffset: [0, 0.66, -0.75], // Ngồi trên ghế Giám đốc phía sau bàn (Y = 0.66 bù trừ độ võng)
    seatRotationOffset: 0,
    isSeated: true,
    occupiedBy: 'agent_coo'
  },
  {
    id: 'station_meet_coo',
    name: 'Ghế Họp COO Bác Nam',
    position: [-1.15, 0, 0.8],
    rotation: Math.PI / 2,
    type: 'research',
    seatOffset: [0, 0.625, 0], // Ghế hội nghị bên trái bàn họp
    seatRotationOffset: 0,
    isSeated: true,
    occupiedBy: null
  },
  {
    id: 'station_meet_cfo',
    name: 'Ghế Họp CFO Bác Thắng',
    position: [-1.15, 0, 1.8],
    rotation: Math.PI / 2,
    type: 'coding',
    seatOffset: [0, 0.625, 0],
    seatRotationOffset: 0,
    isSeated: true,
    occupiedBy: 'agent_cfo'
  },
  {
    id: 'station_meet_cro',
    name: 'Ghế Họp CRO Bác Hoàng',
    position: [1.15, 0, 0.8],
    rotation: -Math.PI / 2,
    type: 'server',
    seatOffset: [0, 0.625, 0], // Ghế hội nghị đối diện bên phải bàn họp
    seatRotationOffset: 0,
    isSeated: true,
    occupiedBy: 'agent_cro'
  },
  {
    id: 'station_lounge_left',
    name: 'Sofa Tiếp Khách VIP Trái',
    position: [-4.6, 0, 0.6],
    rotation: Math.PI / 2,
    type: 'lounge',
    seatOffset: [0, 0.55, 0],
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

// Bản đồ vị trí trạm làm việc mặc định cho từng Giám Đốc
export const HOME_STATIONS: Record<string, string> = {
  agent_coo: 'station_director',
  agent_cfo: 'station_meet_cfo',
  agent_cro: 'station_meet_cro'
};

const directorStation = INITIAL_WORKSTATIONS.find((s) => s.id === 'station_director')!;
const cfoStation = INITIAL_WORKSTATIONS.find((s) => s.id === 'station_meet_cfo')!;
const croStation = INITIAL_WORKSTATIONS.find((s) => s.id === 'station_meet_cro')!;

const initialCoo = getWorkstationSeatTransform(directorStation);
const initialCfo = getWorkstationSeatTransform(cfoStation);
const initialCro = getWorkstationSeatTransform(croStation);

export const INITIAL_AGENTS: AgentData[] = [
  {
    id: 'agent_coo',
    name: 'Bác Nam',
    codename: 'Bác Nam',
    role: 'Giám đốc Vận hành (COO) • 40+ năm F&B & XNK',
    position: initialCoo.worldPosition,
    targetPosition: null,
    targetRotation: initialCoo.worldRotation,
    isSeated: initialCoo.isSeated,
    status: 'working',
    currentStationId: 'station_director',
    pendingStationId: null,
    blessed: false,
    currentTask: 'Theo dõi hệ thống Cold Chain & Cảng biển XNK...',
    progress: 88,
    color: '#0284c7', // Xanh dương lãnh đạo vận hành
    accentColor: '#38bdf8',
    accessory: 'headphones',
    thoughtIcon: '🚢',
    thoughtText: 'Bác Nam đang kiểm tra seal tàu hàng cập cảng Cát Lái...',
    modelUrl: '/models/agent_coder.glb'
  },
  {
    id: 'agent_cfo',
    name: 'Bác Thắng',
    codename: 'Bác Thắng',
    role: 'Giám đốc Tài chính (CFO) • 40+ năm F&B & XNK',
    position: initialCfo.worldPosition,
    targetPosition: null,
    targetRotation: initialCfo.worldRotation,
    isSeated: initialCfo.isSeated,
    status: 'working',
    currentStationId: 'station_meet_cfo',
    pendingStationId: null,
    blessed: false,
    currentTask: 'Tối ưu dòng tiền, thanh toán L/C & Tỷ giá FX...',
    progress: 94,
    color: '#10b981', // Xanh ngọc tài chính
    accentColor: '#34d399',
    accessory: 'cat-ears',
    thoughtIcon: '💼',
    thoughtText: 'Bác Thắng đang rà soát hợp đồng L/C và tỷ giá USD...',
    modelUrl: '/models/agent_researcher.glb'
  },
  {
    id: 'agent_cro',
    name: 'Bác Hoàng',
    codename: 'Bác Hoàng',
    role: 'Giám đốc Quản trị Rủi ro (CRO) • 40+ năm F&B & XNK',
    position: initialCro.worldPosition,
    targetPosition: null,
    targetRotation: initialCro.worldRotation,
    isSeated: initialCro.isSeated,
    status: 'working',
    currentStationId: 'station_meet_cro',
    pendingStationId: null,
    blessed: false,
    currentTask: 'Kiểm soát tiêu chuẩn ATVSTP, FDA & Incoterms 2020...',
    progress: 79,
    color: '#f59e0b', // Vàng hổ phách cảnh báo rủi ro
    accentColor: '#fbbf24',
    accessory: 'cap',
    thoughtIcon: '⚖️',
    thoughtText: 'Bác Hoàng đang thẩm định rủi ro pháp lý hợp đồng...',
    modelUrl: '/models/agent_reviewer.glb'
  }
];

export const INITIAL_DIALOGUES: DialogueLog[] = [
  {
    id: 'dlg_init_1',
    timestamp: '08:30',
    senderName: 'Bác Nam (COO)',
    senderColor: '#0284c7',
    message: 'Chào buổi sáng Ban Giám Đốc! Vừa bái Phật xin vía, hôm nay quyết tâm vận hành chuỗi cung ứng lạnh chuẩn chỉ, 0% hư hỏng! 🙏',
    icon: '🚢',
    category: 'work'
  },
  {
    id: 'dlg_init_2',
    timestamp: '08:35',
    senderName: 'Bác Thắng (CFO)',
    senderColor: '#10b981',
    message: 'Bác Thắng đã chốt xong dự toán dòng tiền tuần này. Biên lợi nhuận ròng EBITDA toàn chuỗi giữ vững 18.5%! 💼',
    icon: '💼',
    category: 'work'
  },
  {
    id: 'dlg_init_3',
    timestamp: '08:40',
    senderName: 'Bác Hoàng (CRO)',
    senderColor: '#f59e0b',
    message: 'Hồ sơ kiểm định FDA cho 5 container xuất Mỹ đã đóng dấu hợp chuẩn. Sẵn sàng cho mọi phiên tranh luận chiến lược! ⚖️',
    icon: '⚖️',
    category: 'work'
  }
];

export function useAgentStore() {
  const [agents, setAgents] = useState<AgentData[]>(INITIAL_AGENTS);
  const [workstations, setWorkstations] = useState<WorkstationData[]>(INITIAL_WORKSTATIONS);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>('agent_coo');
  const [clickTarget, setClickTarget] = useState<[number, number, number] | null>(null);
  const [dialogueLogs, setDialogueLogs] = useState<DialogueLog[]>(INITIAL_DIALOGUES);

  // Trạng thái Tranh Luận & Hội Đồng Lãnh Đạo C-Suite
  const [isDebating, setIsDebating] = useState<boolean>(false);
  const isDebatingRef = useRef<boolean>(false);
  const [activeDebateSession, setActiveDebateSession] = useState<DebateSession | null>(null);
  const [pastSessions, setPastSessions] = useState<DebateSession[]>(() => loadSessionHistory());
  const [consensusModalReport, setConsensusModalReport] = useState<ConsensusReport | null>(null);

  // Ref lưu trạng thái agents mới nhất để đọc đồng bộ
  const agentsRef = useRef<AgentData[]>(INITIAL_AGENTS);
  agentsRef.current = agents;

  // Ref chống trùng lặp tin nhắn liên tiếp trong 2.5s
  const lastDialogueRef = useRef<{ sender: string; message: string; time: number } | null>(null);

  // Trạng thái hiệu ứng tâm linh & đạn đạo
  const [projectiles, setProjectiles] = useState<SpiritualProjectile[]>([]);
  const [buddhaSpeech, setBuddhaSpeech] = useState<string | null>(null);
  const [christianSpeech, setChristianSpeech] = useState<string | null>(null);
  const [buddhaMiracleActive, setBuddhaMiracleActive] = useState<boolean>(false);
  const [christianMiracleActive, setChristianMiracleActive] = useState<boolean>(false);

  // Ref lưu hàm dispatch
  const dispatchRef = useRef<(agentId: string, stationId: string, requirePrayer?: boolean) => void>(() => {});

  /**
   * Thêm log hội thoại mới vào feed và hiển thị bong bóng chat trên đầu nhân vật.
   */
  const addDialogue = useCallback(
    (
      senderName: string,
      senderColor: string,
      message: string,
      icon: string,
      targetAgentId?: string,
      category: 'work' | 'casual' = 'casual',
      citations?: string[],
      predictions?: string[],
      round?: number
    ) => {
      const nowMs = Date.now();

      // 🛡️ BỘ LỌC CHỐNG TRÙNG LẶP LIÊN TIẾP
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
        ...prev.slice(-40),
        {
          id: `dlg_${nowMs}_${Math.random()}`,
          timestamp: timeStr,
          senderName,
          senderColor,
          message,
          icon,
          category,
          citations,
          predictions,
          round
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

        // Hẹn giờ thu hồi bong bóng thoại sau 5.5s
        setTimeout(() => {
          setAgents((curr) =>
            curr.map((a) => (a.id === speaker.id && a.speechText === message ? { ...a, speechText: null } : a))
          );
        }, 5500);
      }
    },
    []
  );

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
      const floorTarget: [number, number, number] = [target[0], 0, target[2]];
      const targetAgent = agentsRef.current.find((a) => a.id === id);

      if (targetAgent) {
        addDialogue(
          targetAgent.codename || targetAgent.name,
          targetAgent.color,
          `Đang bước tới sàn [${target[0].toFixed(1)}, ${target[2].toFixed(1)}]`,
          '🏃',
          targetAgent.id,
          'casual'
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
   * Điều phối Agent đến một trạm làm việc cụ thể.
   */
  const dispatchToWorkstation = useCallback(
    (agentId: string, stationId: string, requirePrayer: boolean = true) => {
      const station = workstations.find((s) => s.id === stationId);
      if (!station) return;

      const currentAgent = agentsRef.current.find((a) => a.id === agentId);
      if (!currentAgent) return;

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

        addDialogue(
          currentAgent.codename || currentAgent.name,
          currentAgent.color,
          routineSpeech || `Đang di chuyển đến ${station.name}...`,
          routineIcon,
          currentAgent.id,
          'casual'
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
          `Trước khi vào làm việc tại ${station.name}, bác phải ghé Đài Sen bái Phật cầu bình an, 0% rủi ro! 🙏`,
          '🙏',
          currentAgent.id,
          'casual'
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
                pendingStationId: stationId,
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
    [workstations, addDialogue]
  );

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

      if (stationId === 'station_buddha') {
        addDialogue(
          targetAgent.codename || targetAgent.name,
          targetAgent.color,
          '🙏 Đã thành tâm cúi lạy 3 lạy trước tượng Phật: Cầu giải trừ mọi rủi ro chuỗi cung ứng, xuất hàng suôn sẻ!',
          '🙏',
          id,
          'casual'
        );
        const destStationId = targetAgent.pendingStationId || HOME_STATIONS[id] || 'station_director';
        setTimeout(() => {
          dispatchRef.current(id, destStationId, false);
        }, 2800);
      } else if (stationId === 'station_cross') {
        addDialogue(
          targetAgent.codename || targetAgent.name,
          targetAgent.color,
          '✝️ Đã thành kính cầu nguyện trước Thánh Giá Chúa: Cầu bình an, sáng suốt, thanh toán L/C đúng hạn!',
          '✝️',
          id,
          'casual'
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
          id,
          'casual'
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
          id,
          'casual'
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
          id,
          'casual'
        );
        const returnStationId = targetAgent.pendingStationId || HOME_STATIONS[id] || 'station_director';
        setTimeout(() => {
          dispatchRef.current(id, returnStationId, false);
        }, 3500);
      }

      setAgents((prev) =>
        prev.map((agent) => {
          if (agent.id !== id) return agent;

          if (stationId === 'station_buddha') {
            return {
              ...agent,
              position: [finalPosition[0], 0, finalPosition[2]],
              targetPosition: null,
              isSeated: false,
              status: 'praying',
              blessed: true,
              thoughtIcon: '🙏',
              thoughtText: '🙏 Cầu bình an & 0% rủi ro XNK!',
              currentTask: 'Đang thành tâm bái Phật trước đài sen...'
            };
          }

          if (stationId === 'station_cross') {
            return {
              ...agent,
              position: [finalPosition[0], 0, finalPosition[2]],
              targetPosition: null,
              isSeated: false,
              status: 'praying',
              blessed: true,
              thoughtIcon: '✝️',
              thoughtText: '✝️ Cầu Chúa ban phước bình an & vững bền!',
              currentTask: 'Đang thành tâm cầu nguyện trước Thánh Giá Chúa...'
            };
          }

          if (stationId === 'station_coffee') {
            return {
              ...agent,
              position: [finalPosition[0], 0, finalPosition[2]],
              targetPosition: null,
              isSeated: false,
              status: 'idle',
              thoughtIcon: '☕',
              thoughtText: OFFICE_ROUTINE_SCRIPTS.coffee.endThought,
              currentTask: 'Đang pha và thưởng thức cà phê tại quầy Bar...'
            };
          }

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

          if (stationId === 'station_restroom') {
            return {
              ...agent,
              position: [finalPosition[0], 0, finalPosition[2]],
              targetPosition: null,
              isSeated: false,
              status: 'idle',
              thoughtIcon: '🚻',
              thoughtText: OFFICE_ROUTINE_SCRIPTS.restroom.endThought,
              currentTask: 'Đang rửa mặt giải lao trong Restroom...'
            };
          }

          const currentStation = stationId ? workstations.find((s) => s.id === stationId) : null;
          if (currentStation) {
            const newIcon =
              agent.id === 'agent_coo' ? '🚢' : agent.id === 'agent_cfo' ? '💼' : '⚖️';

            return {
              ...agent,
              position: finalPosition,
              targetPosition: null,
              isSeated: currentStation.isSeated,
              status: 'working',
              thoughtIcon: newIcon,
              thoughtText: agent.blessed
                ? '✨ Có phước lành Phật & Chúa hộ trì, vững tâm điều hành!'
                : 'Đang tập trung làm việc tại trạm...',
              currentTask: agent.blessed
                ? 'Đang thực thi nhiệm vụ lãnh đạo (Được bảo hộ)...'
                : 'Đang phân tích dữ liệu tại vị trí...'
            };
          }

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
   * 🚀 BẮT ĐẦU PHIÊN TRANH LUẬN CHIẾN LƯỢC CỦA BAN GIÁM ĐỐC C-SUITE
   * 1. Cả 3 Giám đốc đứng dậy, chạy lại ngồi cùng nhau tại bàn họp trung tâm.
   * 2. Từng người độc lập gọi Gemini API (kèm Search Grounding) để tranh luận 3 vòng:
   *    - Vòng 1: Đánh giá ban đầu
   *    - Vòng 2: Phản biện kịch liệt & Dẫn chứng số liệu thực tế
   *    - Vòng 3: Thống nhất tiêu chí
   * 3. Tổng hợp Báo Cáo Thống Nhất Chiến Lược (Pros/Cons/Risks/Consensus), phân định Dẫn chứng vs Dự đoán.
   * 4. Tự động bật Modal Popup và lưu trữ vào localStorage.
   */
  const startExecutiveDebate = useCallback(
    async (problem: string) => {
      if (isDebatingRef.current || !problem.trim()) return;

      setIsDebating(true);
      isDebatingRef.current = true;

      const sessionId = `session_${Date.now()}`;
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      // 1. Điều phối cả 3 Giám đốc chạy lại bàn họp trung tâm
      const meetCooStation = workstations.find((s) => s.id === 'station_meet_coo') || directorStation;
      const meetCfoStation = workstations.find((s) => s.id === 'station_meet_cfo')!;
      const meetCroStation = workstations.find((s) => s.id === 'station_meet_cro')!;

      const cooTrans = getWorkstationSeatTransform(meetCooStation);
      const cfoTrans = getWorkstationSeatTransform(meetCfoStation);
      const croTrans = getWorkstationSeatTransform(meetCroStation);

      setAgents((prev) =>
        prev.map((a) => {
          if (a.id === 'agent_coo') {
            return {
              ...a,
              targetPosition: cooTrans.worldPosition,
              targetRotation: cooTrans.worldRotation,
              isSeated: cooTrans.isSeated,
              currentStationId: 'station_meet_coo',
              status: 'moving',
              thoughtIcon: '🏃',
              thoughtText: 'Chạy lại bàn họp trung tâm...',
              currentTask: `Tham gia phiên họp: "${problem.slice(0, 32)}..."`
            };
          }
          if (a.id === 'agent_cfo') {
            return {
              ...a,
              targetPosition: cfoTrans.worldPosition,
              targetRotation: cfoTrans.worldRotation,
              isSeated: cfoTrans.isSeated,
              currentStationId: 'station_meet_cfo',
              status: 'moving',
              thoughtIcon: '🏃',
              thoughtText: 'Chạy lại bàn họp trung tâm...',
              currentTask: `Tham gia phiên họp: "${problem.slice(0, 32)}..."`
            };
          }
          if (a.id === 'agent_cro') {
            return {
              ...a,
              targetPosition: croTrans.worldPosition,
              targetRotation: croTrans.worldRotation,
              isSeated: croTrans.isSeated,
              currentStationId: 'station_meet_cro',
              status: 'moving',
              thoughtIcon: '🏃',
              thoughtText: 'Chạy lại bàn họp trung tâm...',
              currentTask: `Tham gia phiên họp: "${problem.slice(0, 32)}..."`
            };
          }
          return a;
        })
      );

      // Thông báo khởi động phiên họp trong kênh Công Việc
      addDialogue(
        'Hội Đồng Quản Trị',
        '#38bdf8',
        `📢 BẮT ĐẦU PHIÊN HỌP CHIẾN LƯỢC: "${problem}". Cả 3 Giám Đốc đang chạy lại bàn họp để trao đổi phản biện!`,
        '🏛️',
        undefined,
        'work'
      );

      // Chờ các Giám đốc di chuyển vào ghế ngồi (~2.2s)
      await new Promise((r) => setTimeout(r, 2200));

      // Đặt cả 3 vào trạng thái ngồi họp
      setAgents((prev) =>
        prev.map((a) => ({
          ...a,
          status: 'working',
          isSeated: true,
          thoughtIcon: '💬',
          thoughtText: 'Đang tranh luận phản biện chiến lược...'
        }))
      );

      const sessionMessages: DebateMessage[] = [];
      const currentSession: DebateSession = {
        id: sessionId,
        title: problem.slice(0, 48) + (problem.length > 48 ? '...' : ''),
        problem,
        status: 'debating',
        currentRound: 1,
        messages: [],
        consensusReport: null,
        createdAt: `${timeStr} ${now.toLocaleDateString('vi-VN')}`
      };
      setActiveDebateSession(currentSession);

      // Tiến hành 3 vòng tranh luận
      const rounds: (1 | 2 | 3)[] = [1, 2, 3];
      const directorsOrder: ExecutiveRole[] = ['COO', 'CFO', 'CRO'];

      for (const round of rounds) {
        setActiveDebateSession((curr) => (curr ? { ...curr, currentRound: round } : null));

        for (const role of directorsOrder) {
          const directorConfig = EXECUTIVE_DIRECTORS[role];
          const result = await executeDirectorTurn(role, round, problem, sessionMessages);

          const debateMsg: DebateMessage = {
            id: `msg_${Date.now()}_${Math.random()}`,
            round,
            senderId: directorConfig.id,
            senderName: directorConfig.name,
            senderRole: role,
            senderColor: directorConfig.color,
            text: result.text,
            citations: result.citations,
            predictions: result.predictions,
            timestamp: `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`
          };

          sessionMessages.push(debateMsg);

          // Đẩy vào nhật ký Công Việc bên trái và hiển thị bong bóng chat trên đầu
          addDialogue(
            `${directorConfig.name} (${role})`,
            directorConfig.color,
            result.text,
            directorConfig.avatarIcon,
            directorConfig.id,
            'work',
            result.citations,
            result.predictions,
            round
          );

          setActiveDebateSession((curr) => (curr ? { ...curr, messages: [...sessionMessages] } : null));

          // Giãn cách thời gian tự nhiên giữa các lượt phát biểu (2.5 giây)
          await new Promise((r) => setTimeout(r, 2500));
        }
      }

      // Tổng hợp Báo Cáo Thống Nhất Chiến Lược
      const report = await compileConsensusReport(problem, sessionMessages);
      const completedSession: DebateSession = {
        ...currentSession,
        status: 'completed',
        messages: sessionMessages,
        consensusReport: report
      };

      saveSessionHistory(completedSession);
      setActiveDebateSession(completedSession);
      setPastSessions(loadSessionHistory());

      // Tự động bật Modal Popup hiển thị Báo Cáo Thống Nhất
      setConsensusModalReport(report);

      addDialogue(
        'Hội Đồng C-Suite',
        '#10b981',
        `🏆 BAN GIÁM ĐỐC ĐÃ ĐẠT ĐỒNG THUẬN 100%: "${report.finalDecision}". Báo cáo chiến lược đã xuất thành công!`,
        '📋',
        undefined,
        'work'
      );

      setIsDebating(false);
      isDebatingRef.current = false;
    },
    [workstations, addDialogue]
  );

  const refreshPastSessions = useCallback(() => {
    setPastSessions(loadSessionHistory());
  }, []);

  /**
   * Toàn thể Ban Giám Đốc cùng dâng hương bái Phật
   */
  const teamPrayer = useCallback(() => {
    addDialogue(
      'Hội Đồng Lãnh Đạo',
      '#fbbf24',
      'Cả 3 Giám Đốc tạm gác mọi hồ sơ, cùng xếp hàng trang nghiêm trước Đài Sen dâng hương bái Phật cầu an lạc!',
      '🙏',
      undefined,
      'work'
    );

    const prayerLine: [number, number, number][] = [
      [-2.8, 0, -3.6],
      [-2.4, 0, -3.6],
      [-2.0, 0, -3.6]
    ];

    setAgents((prev) =>
      prev.map((agent, idx) => {
        const pos = prayerLine[idx % prayerLine.length];
        return {
          ...agent,
          targetPosition: pos,
          targetRotation: Math.PI,
          isSeated: false,
          currentStationId: 'station_buddha',
          pendingStationId: agent.currentStationId || HOME_STATIONS[agent.id] || 'station_director',
          status: 'moving',
          thoughtIcon: '🙏',
          thoughtText: 'Cùng Ban Giám Đốc dâng hương bái Phật...',
          currentTask: 'Xếp hàng dâng hương trước tượng Phật...'
        };
      })
    );
  }, [addDialogue]);

  /**
   * Toàn thể Ban Giám Đốc cùng cầu nguyện trước Thánh Giá Chúa
   */
  const christianPrayer = useCallback(() => {
    addDialogue(
      'Hội Đồng Lãnh Đạo',
      '#fde047',
      'Cả 3 Giám Đốc cùng đến trước Thánh Giá Chúa thành tâm cầu nguyện bình an & vững bền!',
      '✝️',
      undefined,
      'work'
    );

    const christianLine: [number, number, number][] = [
      [2.0, 0, -3.6],
      [2.4, 0, -3.6],
      [2.8, 0, -3.6]
    ];

    setAgents((prev) =>
      prev.map((agent, idx) => {
        const pos = christianLine[idx % christianLine.length];
        return {
          ...agent,
          targetPosition: pos,
          targetRotation: Math.PI,
          isSeated: false,
          currentStationId: 'station_cross',
          pendingStationId: agent.currentStationId || HOME_STATIONS[agent.id] || 'station_director',
          status: 'moving',
          thoughtIcon: '✝️',
          thoughtText: 'Cùng cầu nguyện trước Thánh Giá Chúa...',
          currentTask: 'Xếp hàng cầu nguyện trước Thánh Giá Chúa...'
        };
      })
    );
  }, [addDialogue]);

  /**
   * Thần tích Phật phóng hạt
   */
  const castBuddhaMiracle = useCallback(
    (customQuote?: string) => {
      const quote = customQuote || getRandomBuddhaMeme();
      setBuddhaSpeech(quote);
      setBuddhaMiracleActive(true);

      addDialogue('🙏 Đức Phật Từ Bi', '#f59e0b', `"${quote}"`, '📿', undefined, 'casual');

      const now = Date.now();
      const newProjectiles: SpiritualProjectile[] = [
        {
          id: `bead_${now}_1`,
          type: 'bead',
          startPosition: [-2.4, 1.25, -4.8],
          targetPosition: [0, 0.75, -3.4], // Hướng về bàn Giám đốc Bác Nam
          currentPosition: [-2.4, 1.25, -4.8],
          progress: 0,
          speed: 0.55
        },
        {
          id: `bead_${now}_2`,
          type: 'bead',
          startPosition: [-2.4, 1.25, -4.8],
          targetPosition: [-1.15, 0.75, 1.0], // Hướng về bàn họp
          currentPosition: [-2.4, 1.25, -4.8],
          progress: 0,
          speed: 0.48
        }
      ];

      setProjectiles((prev) => [...prev, ...newProjectiles]);

      setTimeout(() => {
        setBuddhaMiracleActive(false);
      }, 3200);

      setTimeout(() => {
        setBuddhaSpeech(null);
      }, 5200);
    },
    [addDialogue]
  );

  /**
   * Thần tích Chúa ban đinh
   */
  const castChristianMiracle = useCallback(
    (customQuote?: string) => {
      const quote = customQuote || getRandomChristianMeme();
      setChristianSpeech(quote);
      setChristianMiracleActive(true);

      addDialogue('✝️ Thánh Giá Uy Nghi', '#fbbf24', `"${quote}"`, '🔨', undefined, 'casual');

      const now = Date.now();
      const newProjectiles: SpiritualProjectile[] = [
        {
          id: `nail_${now}_1`,
          type: 'nail',
          startPosition: [2.4, 1.35, -4.8],
          targetPosition: [0, 0.8, -3.4], // Hướng về bàn Giám đốc
          currentPosition: [2.4, 1.35, -4.8],
          progress: 0,
          speed: 0.65
        },
        {
          id: `nail_${now}_2`,
          type: 'nail',
          startPosition: [2.4, 1.35, -4.8],
          targetPosition: [-1.15, 0.8, 1.5], // Hướng về Bác Thắng
          currentPosition: [2.4, 1.35, -4.8],
          progress: 0,
          speed: 0.58
        },
        {
          id: `nail_${now}_3`,
          type: 'nail',
          startPosition: [2.4, 1.35, -4.8],
          targetPosition: [1.15, 0.8, 0.8], // Hướng về Bác Hoàng
          currentPosition: [2.4, 1.35, -4.8],
          progress: 0,
          speed: 0.52
        }
      ];

      setProjectiles((prev) => [...prev, ...newProjectiles]);

      setTimeout(() => {
        setChristianMiracleActive(false);
      }, 3200);

      setTimeout(() => {
        setChristianSpeech(null);
      }, 5200);
    },
    [addDialogue]
  );

  /**
   * Phản ứng né tránh của Agent
   */
  const triggerAgentDodge = useCallback(
    (agentId: string, threatType: 'nail' | 'bead') => {
      const targetAgent = agentsRef.current.find((a) => a.id === agentId);
      if (!targetAgent) return;

      const reaction = getRandomDodgeReaction(agentId);

      addDialogue(
        targetAgent.codename || targetAgent.name,
        targetAgent.color,
        reaction,
        threatType === 'nail' ? '🔨' : '📿',
        targetAgent.id,
        'casual'
      );

      const oldTask = targetAgent.currentTask;

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
    },
    [addDialogue]
  );

  /**
   * Quỹ đạo bay đạn đạo
   */
  useEffect(() => {
    if (projectiles.length === 0) return;

    const interval = setInterval(() => {
      setProjectiles((prev) => {
        const next: SpiritualProjectile[] = [];

        prev.forEach((p) => {
          const newProgress = p.progress + 0.04 * (p.speed / 0.5);

          if (newProgress < 1.0) {
            const [sx, sy, sz] = p.startPosition;
            const [tx, ty, tz] = p.targetPosition;
            const curX = sx + (tx - sx) * newProgress;
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
   * Tự động kích hoạt Thần Tích định kỳ (mỗi 28 giây)
   */
  useEffect(() => {
    const timer = setInterval(() => {
      if (Math.random() > 0.5) {
        castBuddhaMiracle();
      } else {
        castChristianMiracle();
      }
    }, 28000);

    return () => clearInterval(timer);
  }, [castBuddhaMiracle, castChristianMiracle]);

  /**
   * Ambient Chatter giãn cách 45s (chống lặp)
   */
  useEffect(() => {
    const timer = setInterval(() => {
      // Khi đang họp tranh luận thì không phát Ambient Chatter để tập trung công việc
      if (isDebatingRef.current) return;

      const currentAgents = agentsRef.current;
      const candidates = currentAgents.filter(
        (a) => a.status !== 'praying' && a.status !== 'dodging' && a.status !== 'moving'
      );
      if (candidates.length === 0) return;

      const randomAgent = candidates[Math.floor(Math.random() * candidates.length)];
      const quote = getSmartAmbientQuote(randomAgent.id);

      addDialogue(
        randomAgent.codename || randomAgent.name,
        randomAgent.color,
        quote.chatMessage,
        quote.icon,
        randomAgent.id,
        'casual'
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
   * Sinh hoạt văn phòng đời thường tự động (mỗi 75 giây nếu không họp)
   */
  useEffect(() => {
    const routineTimer = setInterval(() => {
      if (isDebatingRef.current) return;

      const currentAgents = agentsRef.current;
      const eligibleAgents = currentAgents.filter(
        (a) => a.status === 'working' && a.isSeated && !a.targetPosition
      );
      if (eligibleAgents.length === 0) return;

      const chosenAgent = eligibleAgents[Math.floor(Math.random() * eligibleAgents.length)];
      const routineStations = ['station_coffee', 'station_cat', 'station_restroom'];
      const chosenStation = routineStations[Math.floor(Math.random() * routineStations.length)];

      dispatchRef.current(chosenAgent.id, chosenStation, false);
    }, 75000);

    return () => clearInterval(routineTimer);
  }, []);

  /**
   * Giả lập tín hiệu trao đổi công việc
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
          speaker.id,
          'work'
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
      }, index * 2000);
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
    isDebating,
    activeDebateSession,
    pastSessions,
    consensusModalReport,
    setConsensusModalReport,
    startExecutiveDebate,
    refreshPastSessions,
    selectAgent,
    setAgentTarget,
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
