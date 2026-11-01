/**
 * @file useAgentStore.ts
 * @description Hook quản lý trạng thái tập trung của đội ngũ AI Agent, điều phối di chuyển,
 * cập nhật bong bóng suy nghĩ, hệ thống định vị chỗ ngồi chuẩn xác (Seating Anchor System)
 * và Nghi thức bái Phật trang nghiêm trước khi nhận nhiệm vụ (Buddha Blessing Workflow).
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { AgentData, AgentStatus, WorkstationData, DialogueLog, getWorkstationSeatTransform } from '../types/agent';
import { getRandomAmbientQuote } from '../data/dialogueBank';

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
  }
];

// Bản đồ vị trí trạm làm việc mặc định cho từng nhân sự
export const HOME_STATIONS: Record<string, string> = {
  agent_1: 'station_research',
  agent_2: 'station_director',
  agent_3: 'station_qa',
  agent_4: 'station_server'
};

// Tính toán tọa độ ban đầu chuẩn xác cho từng Agent dựa trên trạm làm việc của họ
const initialKen = getWorkstationSeatTransform(INITIAL_WORKSTATIONS[1]);
const initialNa = getWorkstationSeatTransform(INITIAL_WORKSTATIONS[2]);
const initialLuc = getWorkstationSeatTransform(INITIAL_WORKSTATIONS[3]);
const initialCuu = getWorkstationSeatTransform(INITIAL_WORKSTATIONS[4]);

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

  // Ref lưu hàm dispatch để giải quyết gọi lồng nhau trong completeMovement
  const dispatchRef = useRef<(agentId: string, stationId: string, requirePrayer?: boolean) => void>(() => {});

  /**
   * Thêm log hội thoại mới vào feed
   */
  const addDialogue = useCallback((senderName: string, senderColor: string, message: string, icon: string) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setDialogueLogs((prev) => [
      ...prev.slice(-6),
      {
        id: `dlg_${Date.now()}`,
        timestamp: timeStr,
        senderName,
        senderColor,
        message,
        icon
      }
    ]);
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

      setAgents((prev) =>
        prev.map((agent) => {
          if (agent.id === id) {
            addDialogue(
              agent.codename || agent.name,
              agent.color,
              `Đang bước tới sàn [${target[0].toFixed(1)}, ${target[2].toFixed(1)}]`,
              '🏃'
            );
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

      const currentAgent = agents.find((a) => a.id === agentId);
      if (!currentAgent) return;

      // Nếu mục tiêu chính là Đài Sen Bái Phật, Bàn Thờ Chúa, hoặc requirePrayer = false (đã bái rồi)
      if (stationId === 'station_buddha' || stationId === 'station_cross' || !requirePrayer) {
        const transform = getWorkstationSeatTransform(station);

        setAgents((prev) =>
          prev.map((agent) => {
            if (agent.id === agentId) {
              addDialogue(
                agent.codename || agent.name,
                agent.color,
                `Đang di chuyển đến ${station.name}...`,
                '🚶'
              );
              return {
                ...agent,
                targetPosition: transform.worldPosition,
                targetRotation: transform.worldRotation,
                isSeated: transform.isSeated,
                currentStationId: stationId,
                pendingStationId: null,
                status: 'moving',
                thoughtIcon: '🚶',
                thoughtText: `Đi tới ${station.name}...`,
                currentTask: `Di chuyển đến ${station.name}...`
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
      setAgents((prev) => {
        const targetAgent = prev.find((a) => a.id === id);
        if (!targetAgent) return prev;

        // 1. Nếu Agent vừa bước tới trước bàn thờ Phật
        if (targetAgent.currentStationId === 'station_buddha') {
          addDialogue(
            targetAgent.codename || targetAgent.name,
            targetAgent.color,
            '🙏 Đã thành tâm cúi lạy 3 lạy trước tượng Phật: Cầu giải trừ mọi lỗi bug, deploy suôn sẻ êm đềm!',
            '🙏'
          );

          // Nếu có trạm đang chờ đến sau khi bái Phật, tự động chuyển sang trạm đó sau 2.8s
          const destStationId = targetAgent.pendingStationId || HOME_STATIONS[id] || 'station_director';
          setTimeout(() => {
            dispatchRef.current(id, destStationId, false);
          }, 2800);

          return prev.map((agent) =>
            agent.id === id
              ? {
                  ...agent,
                  position: [finalPosition[0], 0, finalPosition[2]],
                  targetPosition: null,
                  isSeated: false, // Đứng trang nghiêm trên mặt sàn, không ngồi
                  status: 'praying',
                  blessed: true,
                  thoughtIcon: '🙏',
                  thoughtText: '🙏 Nam Mô A Di Đà Phật • Cầu code không bug!',
                  currentTask: 'Đang thành tâm chắp tay vái lạy bái Phật...'
                }
              : agent
          );
        }

        // 1.5. Nếu Agent bước tới trước bàn thờ Chúa & Thánh Giá
        if (targetAgent.currentStationId === 'station_cross') {
          addDialogue(
            targetAgent.codename || targetAgent.name,
            targetAgent.color,
            '✝️ Đã thành kính cầu nguyện trước Thánh Giá Chúa: Cầu bình an, sáng suốt, hệ thống ổn định 100%!',
            '✝️'
          );

          // Tự động trở về trạm làm việc sau 2.8s
          const destStationId = targetAgent.pendingStationId || HOME_STATIONS[id] || 'station_director';
          setTimeout(() => {
            dispatchRef.current(id, destStationId, false);
          }, 2800);

          return prev.map((agent) =>
            agent.id === id
              ? {
                  ...agent,
                  position: [finalPosition[0], 0, finalPosition[2]],
                  targetPosition: null,
                  isSeated: false,
                  status: 'praying',
                  blessed: true,
                  thoughtIcon: '✝️',
                  thoughtText: '✝️ Cầu Chúa ban phước • Bình an & Vững bền!',
                  currentTask: 'Đang thành tâm cầu nguyện trước Thánh Giá Chúa...'
                }
              : agent
          );
        }

        // 2. Nếu Agent bước tới trạm làm việc (ghế Giám đốc, ghế hội nghị, sofa)
        const currentStation = targetAgent.currentStationId
          ? workstations.find((s) => s.id === targetAgent.currentStationId)
          : null;

        if (currentStation) {
          const newIcon =
            targetAgent.id === 'agent_1'
              ? '🔍'
              : targetAgent.id === 'agent_2'
              ? '💻'
              : targetAgent.id === 'agent_3'
              ? '🛡️'
              : '⚡';

          const newThought = targetAgent.blessed
            ? '✨ Được Đức Phật phù hộ: 0% Bug, 100% Green Test!'
            : 'Đang tập trung làm việc tại trạm...';

          return prev.map((agent) =>
            agent.id === id
              ? {
                  ...agent,
                  position: finalPosition,
                  targetPosition: null,
                  isSeated: currentStation.isSeated, // Ngồi ghế nếu trạm là ghế, đứng nếu là trạm đứng
                  status: 'working',
                  thoughtIcon: newIcon,
                  thoughtText: newThought,
                  currentTask: targetAgent.blessed
                    ? 'Đang thực thi tác vụ (Có phước lành Phật hộ trì)...'
                    : 'Đang thực thi tác vụ tại trạm...'
                }
              : agent
          );
        }

        // 3. Nếu Agent bước tới vị trí tự do trên sàn nhà (Click trên sàn)
        return prev.map((agent) =>
          agent.id === id
            ? {
                ...agent,
                position: [finalPosition[0], 0, finalPosition[2]], // Luôn tiếp xúc mặt sàn tại Y = 0
                targetPosition: null,
                isSeated: false, // Tuyệt đối không ngồi trên mặt sàn trần
                status: 'idle', // Đứng thẳng phong thái đĩnh đạc (idle)
                thoughtIcon: '☕',
                thoughtText: 'Dạo quanh văn phòng ngắm cảnh...',
                currentTask: 'Nghỉ ngơi, ngắm cảnh văn phòng'
              }
            : agent
        );
      });
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
   * ⏱️ Ambient Office Chatter: Tự động phát sinh những câu chuyện phiếm, thời tiết,
   * tin tức công nghệ hot và những khoảnh khắc vui vẻ ngẫu nhiên của các Agent.
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setAgents((prev) => {
        // Chỉ chọn các Agent không bận bái Phật để trò chuyện
        const candidates = prev.filter((a) => a.status !== 'praying');
        if (candidates.length === 0) return prev;

        const randomAgent = candidates[Math.floor(Math.random() * candidates.length)];
        const quote = getRandomAmbientQuote(randomAgent.id);

        addDialogue(
          randomAgent.codename || randomAgent.name,
          randomAgent.color,
          quote.chatMessage,
          quote.icon
        );

        return prev.map((a) =>
          a.id === randomAgent.id
            ? {
                ...a,
                thoughtIcon: quote.icon,
                thoughtText: quote.thought
              }
            : a
        );
      });
    }, 13000); // Cứ mỗi 13 giây ngẫu nhiên phát sinh 1 mẩu chuyện phiếm vui vẻ

    return () => clearInterval(timer);
  }, [addDialogue]);

  /**
   * Giả lập tín hiệu cập nhật trạng thái từ backend (Push Event)
   */
  const simulateBackendEvent = useCallback(() => {
    setAgents((prev) => {
      const randomIdx = Math.floor(Math.random() * prev.length);
      const targetAgent = prev[randomIdx];
      const newStatus: AgentStatus = targetAgent.status === 'idle' ? 'working' : 'idle';
      const quote = getRandomAmbientQuote(targetAgent.id);

      addDialogue(
        targetAgent.codename || targetAgent.name,
        targetAgent.color,
        quote.chatMessage,
        quote.icon
      );

      return prev.map((a, idx) =>
        idx === randomIdx
          ? {
              ...a,
              status: newStatus,
              thoughtIcon: quote.icon,
              thoughtText: quote.thought,
              progress: newStatus === 'working' ? Math.floor(Math.random() * 50) + 20 : 100
            }
          : a
      );
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
    selectAgent,
    setAgentTarget,
    setAgentStatus,
    completeMovement,
    dispatchToWorkstation,
    teamPrayer,
    christianPrayer,
    simulateBackendEvent,
    addDialogue
  };
}
