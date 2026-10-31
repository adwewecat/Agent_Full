/**
 * @file useAgentStore.ts
 * @description Hook quản lý trạng thái tập trung của đội ngũ AI Agent, điều phối di chuyển và mô phỏng sự kiện backend.
 */

import { useState, useCallback } from 'react';
import { AgentData, AgentStatus, WorkstationData } from '../types/agent';

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
    name: 'Core Dev Terminal',
    position: [2.5, 0, -2],
    rotation: -Math.PI / 4,
    type: 'coding',
    occupiedBy: null
  },
  {
    id: 'station_qa',
    name: 'QA & Review Bench',
    position: [3.5, 0, 2],
    rotation: -Math.PI * 0.75,
    type: 'coding',
    occupiedBy: null
  },
  {
    id: 'station_server',
    name: 'Neural Server Rack',
    position: [-3.5, 0, 2.5],
    rotation: Math.PI * 0.75,
    type: 'server',
    occupiedBy: null
  },
  {
    id: 'station_lounge',
    name: 'Agent Coffee Lounge',
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
    role: 'Deep Web & Data Crawler',
    position: [-3.5, 0, -2],
    targetPosition: null,
    status: 'working',
    currentTask: 'Thu thập tài liệu và phân tích mã nguồn mở...',
    progress: 74,
    color: '#06b6d4',
    modelUrl: '/models/agent.glb'
  },
  {
    id: 'agent_2',
    name: 'Coder',
    role: 'Core Systems Developer',
    position: [2, 0, -1],
    targetPosition: null,
    status: 'idle',
    currentTask: 'Đang chờ tác vụ mới từ điều phối viên...',
    progress: 0,
    color: '#3b82f6',
    modelUrl: '/models/agent.glb'
  },
  {
    id: 'agent_3',
    name: 'Reviewer',
    role: 'Quality & Security Auditor',
    position: [0, 0, 0],
    targetPosition: null,
    status: 'working',
    currentTask: 'Kiểm toán quy chuẩn Clean Code & TDD...',
    progress: 92,
    color: '#8b5cf6',
    modelUrl: '/models/agent.glb'
  }
];

export function useAgentStore() {
  const [agents, setAgents] = useState<AgentData[]>(INITIAL_AGENTS);
  const [workstations] = useState<WorkstationData[]>(INITIAL_WORKSTATIONS);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>('agent_2');
  const [clickTarget, setClickTarget] = useState<[number, number, number] | null>(null);

  /**
   * Chọn Agent để theo dõi hoặc điều khiển
   * @param id ID của Agent
   */
  const selectAgent = useCallback((id: string | null) => {
    setSelectedAgentId(id);
  }, []);

  /**
   * Cập nhật điểm đến di chuyển cho một Agent cụ thể
   * @param id ID của Agent
   * @param target Tọa độ Vector3 [X, Y, Z] đích đến
   */
  const setAgentTarget = useCallback((id: string, target: [number, number, number]) => {
    setAgents((prev) =>
      prev.map((agent) => {
        if (agent.id === id) {
          return {
            ...agent,
            targetPosition: target,
            status: 'moving',
            currentTask: `Di chuyển đến [${target[0].toFixed(1)}, ${target[2].toFixed(1)}]...`
          };
        }
        return agent;
      })
    );
    setClickTarget(target);
  }, []);

  /**
   * Cập nhật trạng thái trực tiếp của Agent (vd: nhận tín hiệu từ backend)
   * @param id ID Agent
   * @param status Trạng thái mới
   * @param taskName Tên tác vụ mới (tùy chọn)
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
   * @param id ID Agent
   * @param finalPosition Tọa độ kết thúc [X, Y, Z]
   * @param nextStatus Trạng thái kế tiếp khi dừng lại (mặc định 'idle' hoặc 'working' nếu tới bàn làm việc)
   */
  const completeMovement = useCallback(
    (id: string, finalPosition: [number, number, number], nextStatus: AgentStatus = 'idle') => {
      setAgents((prev) =>
        prev.map((agent) => {
          if (agent.id === id) {
            return {
              ...agent,
              position: finalPosition,
              targetPosition: null,
              status: nextStatus,
              currentTask: nextStatus === 'working' ? 'Đang thực thi tác vụ tại trạm...' : 'Đang ở trạng thái nghỉ (Idle)'
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
   * @param agentId ID Agent
   * @param stationId ID Trạm làm việc
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
   * Giúp kiểm thử khả năng tự động chuyển animation khi backend thay đổi state
   */
  const simulateBackendEvent = useCallback(() => {
    setAgents((prev) => {
      const randomIdx = Math.floor(Math.random() * prev.length);
      const targetAgent = prev[randomIdx];
      const newStatus: AgentStatus = targetAgent.status === 'idle' ? 'working' : 'idle';
      const tasks = [
        'Biên dịch module hệ thống...',
        'Chạy bộ kiểm thử tự động TDD...',
        'Tối ưu hóa bộ nhớ RAM...',
        'Gửi báo cáo telemetry về máy chủ...',
        'Đồng bộ hóa trạng thái Git...'
      ];
      const randomTask = tasks[Math.floor(Math.random() * tasks.length)];

      return prev.map((a, idx) =>
        idx === randomIdx
          ? {
              ...a,
              status: newStatus,
              currentTask: newStatus === 'working' ? randomTask : 'Hoàn thành tác vụ, chờ lệnh mới',
              progress: newStatus === 'working' ? 15 : 100
            }
          : a
      );
    });
  }, []);

  return {
    agents,
    workstations,
    selectedAgentId,
    clickTarget,
    selectAgent,
    setAgentTarget,
    setAgentStatus,
    completeMovement,
    dispatchToWorkstation,
    simulateBackendEvent
  };
}

