// 라인, EQP, 타임라인 시각화용 더미(임시) 데이터

export const lines = [
  { id: 1, name: "LINE-A" },
  { id: 2, name: "LINE-B" },
  { id: 3, name: "LINE-C" },
  { id: 4, name: "LINE-D" },
];

export const equipments = [
  { id: 101, lineId: 1, name: "EQP-101" },
  { id: 102, lineId: 1, name: "EQP-102" },
  { id: 201, lineId: 2, name: "EQP-201" },
  { id: 202, lineId: 2, name: "EQP-202" },
  { id: 301, lineId: 3, name: "EQP-301" },
  { id: 302, lineId: 3, name: "EQP-302" },
  { id: 401, lineId: 4, name: "EQP-401" },
];

// ① 설비 가동 상태 (RUN/IDLE/PM)
export const runStatusDB = [
  { eqpId: 101, timestamp: "2025-06-01T08:00:00Z", status: "RUN" },
  { eqpId: 101, timestamp: "2025-06-01T09:00:00Z", status: "IDLE" },
  { eqpId: 101, timestamp: "2025-06-01T10:00:00Z", status: "PM" },
  { eqpId: 101, timestamp: "2025-06-01T11:00:00Z", status: "RUN" },
  { eqpId: 102, timestamp: "2025-06-01T08:30:00Z", status: "RUN" },
  { eqpId: 102, timestamp: "2025-06-01T09:30:00Z", status: "IDLE" },
  { eqpId: 201, timestamp: "2025-06-01T08:15:00Z", status: "RUN" },
  { eqpId: 201, timestamp: "2025-06-01T09:45:00Z", status: "PM" },
];

// ② 공정 STEP/PPID별 OPEN·CLOSE 상태
export const stepStatusDB = [
  {
    eqpId: 101,
    start_time: "2025-06-01T08:00:00Z",
    step: "STEP-1",
    ppid: "PPID-A",
    state: "OPEN",
  },
  {
    eqpId: 101,
    start_time: "2025-06-01T09:30:00Z",
    step: "STEP-1",
    ppid: "PPID-A",
    state: "CLOSE",
  },
  {
    eqpId: 101,
    start_time: "2025-06-01T09:30:00Z",
    step: "STEP-2",
    ppid: "PPID-B",
    state: "OPEN",
  },
  {
    eqpId: 101,
    start_time: "2025-06-01T11:00:00Z",
    step: "STEP-2",
    ppid: "PPID-B",
    state: "CLOSE",
  },
  {
    eqpId: 102,
    start_time: "2025-06-01T08:15:00Z",
    step: "STEP-3",
    ppid: "PPID-C",
    state: "OPEN",
  },
  {
    eqpId: 102,
    start_time: "2025-06-01T09:45:00Z",
    step: "STEP-3",
    ppid: "PPID-C",
    state: "CLOSE",
  },
];

// ③ 각종 이벤트/알람 이력 (POINT 데이터)
export const eventLogDB = [
  {
    eqpId: 101,
    occurred_at: "2025-06-01T08:45:00Z",
    event_type: "ALARM",
    comment: "Temp High",
  },
  {
    eqpId: 101,
    occurred_at: "2025-06-01T10:15:00Z",
    event_type: "WARN",
    comment: "Pressure Low",
  },
  {
    eqpId: 102,
    occurred_at: "2025-06-01T09:00:00Z",
    event_type: "ALARM",
    comment: "Voltage Drop",
  },
  {
    eqpId: 201,
    occurred_at: "2025-06-01T09:30:00Z",
    event_type: "WARN",
    comment: "Overheat",
  },
];
