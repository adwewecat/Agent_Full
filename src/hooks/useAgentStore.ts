/**
 * @file useAgentStore.ts
 * @description Hook quản lý trạng thái tập trung của đội ngũ AI Agent, điều phối di chuyển,
 * cập nhật bong bóng suy nghĩ, hệ thống định vị chỗ ngồi chuẩn xác (Seating Anchor System)
 * và Nghi thức bái Phật trang nghiêm trước khi nhận nhiệm vụ (Buddha Blessing Workflow).
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { AgentData, AgentStatus, WorkstationData, DialogueLog, getWorkstationSeatTransform } from '../types/agent';

export const INITIAL_WORKSTATIONS: WorkstationData[] = [
  {
    id: 'station_buddha',
    name: 'Đài Sen Bái Phật',
    position: [-0.5, 0, -5.4],
    rotation: 0,
    type: 'shrine',
    seatOffset: [0, 0, 1.2], // Đứng trang nghiêm trên mặt sàn trước bàn thờ
    seatRotationOffset: Math.PI, // Quay mặt 180 độ hướng về phía tượng Phật (-Z)
    isSeated: false,
    occupiedBy: null
  },
  {
    id: 'station_research',
    name: 'Research Pod Alpha',
    position: [-4.2, 0, -2.5],
    rotation: Math.PI / 4,
    type: 'research',
    seatOffset: [0, 0.48, 0.52], // Ngồi trên ghế công thái học đằng sau bàn
    seatRotationOffset: Math.PI, // Quay mặt về phía trước hướng vào bàn làm việc
    isSeated: true,
    occupiedBy: 'agent_1'
  },
  {
    id: 'station_coding',
    name: 'Dev Terminal Axel',
    position: [4.2, 0, -2.5],
    rotation: -Math.PI / 4,
    type: 'coding',
    seatOffset: [0, 0.48, 0.52],
    seatRotationOffset: Math.PI,
    isSeated: true,
    occupiedBy: 'agent_2'
  },
  {
    id: 'station_qa',
    name: 'QA & Review Bench',
    position: [4.2, 0, 2.8],
    rotation: -Math.PI * 0.75,
    type: 'coding',
    seatOffset: [0, 0.48, 0.52],
    seatRotationOffset: Math.PI,
    isSeated: true,
    occupiedBy: 'agent_3'
  },
  {
    id: 'station_server',
    name: 'Neural Server Core',
    position: [-5.6, 0, 1.2],
    rotation: Math.PI / 2,
    type: 'server',
    seatOffset: [0, 0, 0.75], // Đứng nghiêm chỉnh trên sàn phía trước màn hình tủ server
    seatRotationOffset: Math.PI,
    isSeated: false,
    occupiedBy: 'agent_4'
  },
  {
    id: 'station_arcade',
    name: 'Retro Arcade Game',
    position: [6.2, 0, 0],
    rotation: -Math.PI / 2,
    type: 'arcade',
    seatOffset: [0, 0, 0.65], // Đứng phía trước máy chơi game arcade cầm joystick
    seatRotationOffset: Math.PI,
    isSeated: false,
    occupiedBy: null
  },
  {
    id: 'station_lounge',
    name: 'Coffee & Cat Lounge',
    position: [-1.2, 0, 3.8],
    rotation: Math.PI,
    type: 'lounge',
    seatOffset: [0.3, 0.42, 0.05], // Ngồi êm ái trên đệm Sofa
    seatRotationOffset: 0,
    isSeated: true,
    occupiedBy: null
  }
];

// Tính toán tọa độ ban đầu chuẩn xác cho từng Agent dựa trên trạm làm việc của họ
const initialNova = getWorkstationSeatTransform(INITIAL_WORKSTATIONS[1]);
const initialAxel = getWorkstationSeatTransform(INITIAL_WORKSTATIONS[2]);
const initialVesper = getWorkstationSeatTransform(INITIAL_WORKSTATIONS[3]);
const initialKip = getWorkstationSeatTransform(INITIAL_WORKSTATIONS[4]);

export const INITIAL_AGENTS: AgentData[] = [
  {
    id: 'agent_1',
    name: 'Researcher',
    codename: 'Nova',
    role: 'Deep Web & Data Crawler',
    position: initialNova.worldPosition,
    targetPosition: null,
    targetRotation: initialNova.worldRotation,
    isSeated: initialNova.isSeated,
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
    thoughtText: 'Đang crawl dữ liệu tài liệu API...',
    modelUrl: '/models/agent_researcher.glb'
  },
  {
    id: 'agent_2',
    name: 'Coder',
    codename: 'Axel',
    role: 'Core Systems Developer',
    position: initialAxel.worldPosition,
    targetPosition: null,
    targetRotation: initialAxel.worldRotation,
    isSeated: initialAxel.isSeated,
    status: 'working',
    currentStationId: 'station_coding',
    pendingStationId: null,
    blessed: false,
    currentTask: 'Biên dịch Core Engine & TDD modules...',
    progress: 45,
    color: '#f97316',
    accentColor: '#38bdf8',
    accessory: 'headphones',
    thoughtIcon: '💻',
    thoughtText: 'Biên dịch xong 42 test units!',
    modelUrl: '/models/agent_coder.glb'
  },
  {
    id: 'agent_3',
    name: 'Reviewer',
    codename: 'Vesper',
    role: 'Quality & Security Auditor',
    position: initialVesper.worldPosition,
    targetPosition: null,
    targetRotation: initialVesper.worldRotation,
    isSeated: initialVesper.isSeated,
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
    thoughtText: 'PR #42 đã pass 100% tiêu chí!',
    modelUrl: '/models/agent_reviewer.glb'
  },
  {
    id: 'agent_4',
    name: 'DevOps',
    codename: 'Kip',
    role: 'Infrastructure & Pod Deployment',
    position: initialKip.worldPosition,
    targetPosition: null,
    targetRotation: initialKip.worldRotation,
    isSeated: initialKip.isSeated,
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
    thoughtText: 'Deploy pod thành công trên node 01!',
    modelUrl: '/models/agent_devops.glb'
  }
];

export const INITIAL_DIALOGUES: DialogueLog[] = [
  {
    id: 'dlg_1',
    timestamp: '09:00',
    senderName: 'Axel',
    senderColor: '#f97316',
    message: 'Chào buổi sáng cả đội! Nhớ thắp hương bái Phật cầu code không bug trước khi deploy nhé!',
    icon: '🙏'
  },
  {
    id: 'dlg_2',
    timestamp: '09:05',
    senderName: 'Nova',
    senderColor: '#06b6d4',
    message: 'Đã bái Phật xong, tâm thanh tịnh, sẵn sàng crawl dữ liệu!',
    icon: '✨'
  },
  {
    id: 'dlg_3',
    timestamp: '09:10',
    senderName: 'Vesper',
    senderColor: '#ec4899',
    message: 'Bộ kiểm tra Clean Code đã kích hoạt. Nhờ Phật độ nên 0 bug, 100% test xanh!',
    icon: '🛡️'
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

      // Nếu mục tiêu chính là Đài Sen Bái Phật, hoặc requirePrayer = false (đã bái rồi)
      if (stationId === 'station_buddha' || !requirePrayer) {
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
    (id: string, finalPosition: [number, number, number], nextStatus: AgentStatus = 'idle') => {
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
          if (targetAgent.pendingStationId && targetAgent.pendingStationId !== 'station_buddha') {
            const destStationId = targetAgent.pendingStationId;
            setTimeout(() => {
              dispatchRef.current(id, destStationId, false);
            }, 2800);
          }

          return prev.map((agent) =>
            agent.id === id
              ? {
                  ...agent,
                  position: finalPosition,
                  targetPosition: null,
                  status: 'praying',
                  blessed: true,
                  thoughtIcon: '🙏',
                  thoughtText: '🙏 Nam Mô A Di Đà Phật • Cầu code không bug!',
                  currentTask: 'Đang thành tâm chắp tay vái lạy bái Phật...'
                }
              : agent
          );
        }

        // 2. Nếu Agent bước tới trạm làm việc thông thường
        const isAtStation = Boolean(targetAgent.currentStationId);
        const resolvedStatus = isAtStation ? 'working' : nextStatus;
        const isWorking = resolvedStatus === 'working';
        const newIcon = isWorking
          ? targetAgent.id === 'agent_1'
            ? '🔍'
            : targetAgent.id === 'agent_2'
            ? '💻'
            : targetAgent.id === 'agent_3'
            ? '🛡️'
            : '⚡'
          : '☕';
        const newThought = isWorking
          ? targetAgent.blessed
            ? '✨ Được Đức Phật phù hộ: 0% Bug, 100% Green Test!'
            : 'Đang tập trung làm việc tại trạm...'
          : 'Nghỉ ngơi, ngắm cảnh văn phòng...';

        return prev.map((agent) =>
          agent.id === id
            ? {
                ...agent,
                position: finalPosition,
                targetPosition: null,
                status: resolvedStatus,
                thoughtIcon: newIcon,
                thoughtText: newThought,
                currentTask: isWorking
                  ? targetAgent.blessed
                    ? 'Đang thực thi tác vụ (Có phước lành Phật hộ trì)...'
                    : 'Đang thực thi tác vụ tại trạm...'
                  : 'Đang ở trạng thái nghỉ (Idle)'
              }
            : agent
        );
      });
      setClickTarget(null);
    },
    [addDialogue]
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

    // 4 vị trí xếp hàng ngay ngắn trước bàn thờ Phật [-0.5, 0, -5.4]
    const prayerLine: [number, number, number][] = [
      [-1.8, 0, -4.1],
      [-0.6, 0, -4.1],
      [0.6, 0, -4.1],
      [1.8, 0, -4.1]
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
          pendingStationId: agent.currentStationId || 'station_coding',
          status: 'moving',
          thoughtIcon: '🙏',
          thoughtText: 'Cùng cả đội đi dâng hương bái Phật...',
          currentTask: 'Xếp hàng dâng hương trước tượng Phật...'
        };
      })
    );
  }, [addDialogue]);

  /**
   * Giả lập tín hiệu cập nhật trạng thái từ backend (Push Event)
   */
  const simulateBackendEvent = useCallback(() => {
    setAgents((prev) => {
      const randomIdx = Math.floor(Math.random() * prev.length);
      const targetAgent = prev[randomIdx];
      const newStatus: AgentStatus = targetAgent.status === 'idle' ? 'working' : 'idle';
      const events = [
        { icon: '💡', text: 'Vừa có ý tưởng tối ưu hóa thuật toán!', task: 'Refactor cấu trúc dữ liệu...' },
        { icon: '☕', text: 'Uống ngụm cà phê thơm ngon rồi code tiếp!', task: 'Nghỉ giữa hiệp ngắn...' },
        { icon: '🚀', text: 'Đã hoàn thành deploy nhánh main!', task: 'Kiểm tra telemetry...' },
        { icon: '🎮', text: 'Làm ván game arcade xả stress!', task: 'Chơi game giải trí...' },
        { icon: '✨', text: 'Nhờ Phật độ, Clean Code 100%, không còn warning nào!', task: 'Đồng bộ hóa Git repo...' }
      ];
      const randomEvt = events[Math.floor(Math.random() * events.length)];

      addDialogue(
        targetAgent.codename || targetAgent.name,
        targetAgent.color,
        randomEvt.text,
        randomEvt.icon
      );

      return prev.map((a, idx) =>
        idx === randomIdx
          ? {
              ...a,
              status: newStatus,
              thoughtIcon: randomEvt.icon,
              thoughtText: randomEvt.text,
              currentTask: randomEvt.task,
              progress: newStatus === 'working' ? 25 : 100
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
    simulateBackendEvent,
    addDialogue
  };
}
