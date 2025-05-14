// src/data/groupData.js

// ✅ 공통 시작 시간 (2025-06-01 08:00:00 UTC)
const BASE_TIME = "2025-06-01T08:00:00Z";

// ✅ A 그룹 (Range 타입, 30분 간격)
export const groupAData = [
  {
    timestamp: "2025-06-01T08:00:00Z",
    status: "running",
    comment: "A Event 1 - Running",
  },
  {
    timestamp: "2025-06-01T08:30:00Z",
    status: "error",
    comment: "A Event 2 - Error",
  },
  {
    timestamp: "2025-06-01T09:00:00Z",
    status: "success",
    comment: "A Event 3 - Success",
  },
  {
    timestamp: "2025-06-01T09:30:00Z",
    status: "running",
    comment: "A Event 4 - Running",
  },
  {
    timestamp: "2025-06-01T10:00:00Z",
    status: "error",
    comment: "A Event 5 - Error",
  },
  {
    timestamp: "2025-06-01T10:30:00Z",
    status: "success",
    comment: "A Event 6 - Success",
  },
  {
    timestamp: "2025-06-01T11:00:00Z",
    status: "running",
    comment: "A Event 7 - Running",
  },
  {
    timestamp: "2025-06-01T11:30:00Z",
    status: "error",
    comment: "A Event 8 - Error",
  },
  {
    timestamp: "2025-06-01T12:00:00Z",
    status: "success",
    comment: "A Event 9 - Success",
  },
  {
    timestamp: "2025-06-01T12:30:00Z",
    status: "running",
    comment: "A Event 10 - Running",
  },
];

// ✅ B 그룹 (Range 타입, 30분 간격, 15분 시차 추가)
export const groupBData = [
  {
    event_time: "2025-06-01T08:15:00Z",
    action: "maintenance",
    comment: "B Event 1 - Maintenance",
  },
  {
    event_time: "2025-06-01T08:45:00Z",
    action: "offline",
    comment: "B Event 2 - Offline",
  },
  {
    event_time: "2025-06-01T09:15:00Z",
    action: "unknown",
    comment: "B Event 3 - Unknown",
  },
  {
    event_time: "2025-06-01T09:45:00Z",
    action: "maintenance",
    comment: "B Event 4 - Maintenance",
  },
  {
    event_time: "2025-06-01T10:15:00Z",
    action: "offline",
    comment: "B Event 5 - Offline",
  },
  {
    event_time: "2025-06-01T10:45:00Z",
    action: "unknown",
    comment: "B Event 6 - Unknown",
  },
  {
    event_time: "2025-06-01T11:15:00Z",
    action: "maintenance",
    comment: "B Event 7 - Maintenance",
  },
  {
    event_time: "2025-06-01T11:45:00Z",
    action: "offline",
    comment: "B Event 8 - Offline",
  },
  {
    event_time: "2025-06-01T12:15:00Z",
    action: "unknown",
    comment: "B Event 9 - Unknown",
  },
  {
    event_time: "2025-06-01T12:45:00Z",
    action: "maintenance",
    comment: "B Event 10 - Maintenance",
  },
];

// ✅ C 그룹 (Point 타입, 15분 간격)
export const groupCData = [
  {
    occurred_at: "2025-06-01T08:00:00Z",
    event_type: "alert",
    comment: "C Event 1 - Alert",
  },
  {
    occurred_at: "2025-06-01T08:15:00Z",
    event_type: "stable",
    comment: "C Event 2 - Stable",
  },
  {
    occurred_at: "2025-06-01T08:30:00Z",
    event_type: "alert",
    comment: "C Event 3 - Alert",
  },
  {
    occurred_at: "2025-06-01T08:45:00Z",
    event_type: "stable",
    comment: "C Event 4 - Stable",
  },
  {
    occurred_at: "2025-06-01T09:00:00Z",
    event_type: "alert",
    comment: "C Event 5 - Alert",
  },
  {
    occurred_at: "2025-06-01T09:15:00Z",
    event_type: "stable",
    comment: "C Event 6 - Stable",
  },
  {
    occurred_at: "2025-06-01T09:30:00Z",
    event_type: "alert",
    comment: "C Event 7 - Alert",
  },
  {
    occurred_at: "2025-06-01T09:45:00Z",
    event_type: "stable",
    comment: "C Event 8 - Stable",
  },
  {
    occurred_at: "2025-06-01T10:00:00Z",
    event_type: "alert",
    comment: "C Event 9 - Alert",
  },
  {
    occurred_at: "2025-06-01T10:15:00Z",
    event_type: "stable",
    comment: "C Event 10 - Stable",
  },
];

// ✅ 전체 그룹 데이터
export const groupData = {
  A: groupAData,
  B: groupBData,
  C: groupCData,
};
