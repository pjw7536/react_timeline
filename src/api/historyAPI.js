const API_BASE_URL = "http://127.0.0.1:8000";

// 🔹 라인 목록 가져오기
export const fetchLines = async () => {
  const response = await fetch(`${API_BASE_URL}/lines`);
  if (!response.ok) throw new Error("Failed to fetch lines");
  return response.json(); // 👈 FastAPI는 JSON 바로 반환
};

// 🔹 SDWT 목록 가져오기 (lineId 필요)
export const fetchSDWT = async (lineId) => {
  const params = new URLSearchParams({ lineId });
  const response = await fetch(`${API_BASE_URL}/sdwts?${params}`);
  if (!response.ok) throw new Error("Failed to fetch SDWTs");
  return response.json();
};

// 🔹 설비 목록 가져오기 (lineId 필수, sdwtId 선택)
export const fetchEquipments = async (lineId, sdwtId) => {
  const params = new URLSearchParams({ lineId });
  if (sdwtId) params.append("sdwtId", sdwtId);
  const response = await fetch(`${API_BASE_URL}/equipments?${params}`);
  if (!response.ok) throw new Error("Failed to fetch equipments");
  return response.json();
};

// 🔹 통합 로그 목록 가져오기 (lineId · eqpId 필수, sdwtId 선택)
/* NOTE: eqpId는 백엔드에서 필수!  */
export const fetchLogs = async ({ lineId, sdwtId, eqpId }) => {
  if (!eqpId) throw new Error("eqpId is required");
  const params = new URLSearchParams({ lineId, eqpId });
  if (sdwtId) params.append("sdwtId", sdwtId);
  const response = await fetch(`${API_BASE_URL}/logs?${params}`);
  if (!response.ok) throw new Error("Failed to fetch logs");
  return response.json();
};
