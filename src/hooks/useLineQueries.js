import { useQuery } from "@tanstack/react-query";
import * as api from "../api/mockApi";

/* 라인 목록 */
export const useLines = () =>
  useQuery({
    queryKey: ["lines"],
    queryFn: () => api.fetchLines().then((r) => r.data),
    staleTime: 1000 * 60 * 30,
  });

/* 선택 라인의 EQP 목록 */
export const useEquipments = (lineId, enabled) =>
  useQuery({
    queryKey: ["equipments", lineId],
    queryFn: () => api.fetchEquipments(lineId).then((r) => r.data),
    enabled,
    staleTime: 1000 * 60 * 30,
  });
