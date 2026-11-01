/**
 * @file useAgentStore.ts
 * @description Hook quản lý trạng thái tập trung của đội ngũ AI Agent, điều phối di chuyển,
 * cập nhật bong bóng suy nghĩ và nhật ký hội thoại thời gian thực (Real-time Dialogue Feed).
 */

import { useState, useCallback } from 'react';
import { AgentData, AgentStatus, WorkstationData, DialogueLog } from '../types/agent';

export const INITIAL_WORKSTATIONS: WorkstationData[] = [
  {
    id: 'station_research',
    name: 'Research Pod Alpha',
    position: [-3.5, 0, -2],
    rotation: Math.PI / 4,
    type: 'research',
    occupiedBy: 'agent_1'
  },
  {
    id: 'station_coding',
    name: 'Dev Terminal Axel',
    position: [2.5, 0, -2],
    rotation: -Math.PI / 4,
    type: 'coding',
    occupiedBy: 'agent_2'
  },
  {
    id: 'station_qa',
    name: 'QA & Review Bench',
    position: [3.5, 0, 2],
    rotation: -Math.PI * 0.75,
    type: 'coding',
    occupiedBy: 'agent_3'
  },
  {
    id: 'station_server',
    name: 'Neural Server Rack',
    position: [-3.5, 0, 2.5],
    rotation: Math.PI * 0.75,
    type: 'server',
    occupiedBy: 'agent_4'
  },
  {
    id: 'station_arcade',
    name: 'Retro Arcade Game',
    position: [5.2, 0, -4.5],
    rotation: -Math.PI / 2,
    type: 'arcade',
    occupiedBy: null
  },
  {
    id: 'station_lounge',
    name: 'Coffee & Cat Lounge',
    position: [0, 0, 3],
    rotation: Math.PI,
    type: 'lounge',
    occupiedBy: null
  }
];

export const INITIAL_AGENTS: AgentData[] = [
  {
    id: 'agent_1',
    name: 'Researcher',
    codename: 'Nova',
    role: 'Deep Web & Data Crawler',
    position: [-3.5, 0, -2],
    targetPosition: null,
    status: 'working',
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
    position: [2.5, 0, -2],
    targetPosition: null,
    status: 'working',
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
    position: [3.5, 0, 2],
    targetPosition: null,
    status: 'working',
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
    position: [-3.5, 0, 2.5],
    targetPosition: null,
    status: 'working',
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
    senderName: 'Nova',
    senderColor: '#06b6d4',
    message: 'Chào buổi sáng cả đội! Đang bắt đầu quét dữ liệu dự án mới.',
    icon: '🔍'
  },
  {
    id: 'dlg_2',
    timestamp: '09:05',
    senderName: 'Axel',
    senderColor: '#f97316',
    message: 'Engine 3D đã sẵn sàng! Đang viết code module di chuyển.',
    icon: '💻'
  },
  {
    id: 'dlg_3',
    timestamp: '09:10',
    senderName: 'Vesper',
    senderColor: '#ec4899',
    message: 'Bộ kiểm tra Clean Code đã kích hoạt. Không có dead code!',
    icon: '🛡️'
  }
];

export function useAgentStore() {
  const [agents, setAgents] = useState<AgentData[]>(INITIAL_AGENTS);
  const [workstations] = useState<WorkstationData[]>(INITIAL_WORKSTATIONS);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>('agent_2');
  const [clickTarget, setClickTarget] = useState<[number, number, number] | null>(null);
  const [dialogueLogs, setDialogueLogs] = useState<DialogueLog[]>(INITIAL_DIALOGUES);

  /**
   * Thêm log hội thoại mới vào feed
   */
  const addDialogue = useCallback((senderName: string, senderColor: string, message: string, icon: string) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setDialogueLogs((prev) => [
      ...prev.slice(-6), // Giữ tối đa 7 tin nhắn gần nhất
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
   * Cập nhật điểm đến di chuyển cho một Agent cụ thể
   */
  const setAgentTarget = useCallback(
    (id: string, target: [number, number, number]) => {
      setAgents((prev) =>
        prev.map((agent) => {
          if (agent.id === id) {
            addDialogue(
              agent.codename || agent.name,
              agent.color,
              `Đang di chuyển tới tọa độ [${target[0].toFixed(1)}, ${target[2].toFixed(1)}]`,
              '🏃'
            );
            return {
              ...agent,
              targetPosition: target,
              status: 'moving',
              thoughtIcon: '🏃',
              thoughtText: 'Đang di chuyển...',
              currentTask: `Di chuyển đến [${target[0].toFixed(1)}, ${target[2].toFixed(1)}]...`
            };
          }
          return agent;
        })
      );
      setClickTarget(target);
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
   * Cập nhật vị trí hiện tại khi Agent di chuyển hoàn tất
   */
  const completeMovement = useCallback(
    (id: string, finalPosition: [number, number, number], nextStatus: AgentStatus = 'idle') => {
      setAgents((prev) =>
        prev.map((agent) => {
          if (agent.id === id) {
            const isWorking = nextStatus === 'working';
            const newIcon = isWorking ? (agent.id === 'agent_1' ? '🔍' : agent.id === 'agent_2' ? '💻' : agent.id === 'agent_3' ? '🛡️' : '⚡') : '☕';
            const newThought = isWorking ? 'Đang tập trung làm việc tại trạm...' : 'Nghỉ ngơi, ngắm cảnh văn phòng...';

            return {
              ...agent,
              position: finalPosition,
              targetPosition: null,
              status: nextStatus,
              thoughtIcon: newIcon,
              thoughtText: newThought,
              currentTask: isWorking ? 'Đang thực thi tác vụ tại trạm...' : 'Đang ở trạng thái nghỉ (Idle)'
            };
          }
          return agent;
        })
      );
      setClickTarget(null);
    },
    []
  );

  /**
   * Điều hướng Agent đến một trạm làm việc cụ thể
   */
  const dispatchToWorkstation = useCallback(
    (agentId: string, stationId: string) => {
      const station = workstations.find((s) => s.id === stationId);
      if (!station) return;
      setAgentTarget(agentId, station.position);
    },
    [workstations, setAgentTarget]
  );

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
        { icon: '✨', text: 'Clean Code 100%, không còn warning nào!', task: 'Đồng bộ hóa Git repo...' }
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

  return {
    agents,
    workstations,
    selectedAgentId,
    clickTarget,
    dialogueLogs,
    selectAgent,
    setAgentTarget,
    setAgentStatus,
    completeMovement,
    dispatchToWorkstation,
    simulateBackendEvent,
    addDialogue
  };
}
