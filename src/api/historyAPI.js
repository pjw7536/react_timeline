// API 요청을 위한 함수들 정의. 실제 백엔드 API와 통신할 때 사용합니다.

const API_BASE_URL = "http://127.0.0.1:8000"; // 서버 주소. 실제 운영시 변경 필요!

// "라인 목록"을 가져오는 API
export const fetchLines = async () => {
  const response = await fetch(`${API_BASE_URL}/lines`);
  if (!response.ok) throw new Error("Failed to fetch lines");
  return response.json();
};

// 선택한 라인의 "설비(EQP) 목록"을 가져오는 API
export const fetchEquipments = async (lineId) => {
  const response = await fetch(`${API_BASE_URL}/equipments?lineId=${lineId}`);
  if (!response.ok) throw new Error("Failed to fetch equipments");
  return response.json();
};

// 특정 설비의 "가동 상태(RUN)" 데이터를 가져오는 API
export const fetchEQPStatus = async (eqpId) => {
  const response = await fetch(`${API_BASE_URL}/run-status?eqpId=${eqpId}`);
  if (!response.ok) throw new Error("Failed to fetch run status");
  return response.json();
};

// 특정 설비의 "Tip 상태(TIP)" 데이터를 가져오는 API
export const fetchTIPLog = async (eqpId) => {
  const response = await fetch(`${API_BASE_URL}/step-status?eqpId=${eqpId}`);
  if (!response.ok) throw new Error("Failed to fetch step status");
  return response.json();
};

// 특정 설비의 "RACB 로그(변경점)" 데이터를 가져오는 API
export const fetchRACBLog = async (eqpId) => {
  const response = await fetch(`${API_BASE_URL}/event-log?eqpId=${eqpId}`);
  if (!response.ok) throw new Error("Failed to fetch event log");
  return response.json();
};

// 특정 설비의 "CTTTM 로그" 데이터를 가져오는 API
export const fetchCTTTMLog = async (eqpId) => {
  const response = await fetch(`${API_BASE_URL}/ctttm-log?eqpId=${eqpId}`);
  if (!response.ok) throw new Error("Failed to fetch CTTTM log");
  return response.json();
};
