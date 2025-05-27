/* 더미 API – setTimeout 으로 네트워크 지연 모사  */

const API_BASE_URL = "http://127.0.0.1:8000"; // 실제 API 엔드포인트로 변경

export const fetchLines = async () => {
  const response = await fetch(`${API_BASE_URL}/lines`);
  if (!response.ok) throw new Error("Failed to fetch lines");
  return response.json();
};

export const fetchEquipments = async (lineId) => {
  const response = await fetch(`${API_BASE_URL}/equipments?lineId=${lineId}`);
  if (!response.ok) throw new Error("Failed to fetch equipments");
  return response.json();
};

export const fetchRunStatus = async (eqpId) => {
  const response = await fetch(`${API_BASE_URL}/run-status?eqpId=${eqpId}`);
  if (!response.ok) throw new Error("Failed to fetch run status");
  return response.json();
};

export const fetchStepStatus = async (eqpId) => {
  const response = await fetch(`${API_BASE_URL}/step-status?eqpId=${eqpId}`);
  if (!response.ok) throw new Error("Failed to fetch step status");
  return response.json();
};

export const fetchEventLog = async (eqpId) => {
  const response = await fetch(`${API_BASE_URL}/event-log?eqpId=${eqpId}`);
  if (!response.ok) throw new Error("Failed to fetch event log");
  return response.json();
};
