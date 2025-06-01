import { useQuery } from "@tanstack/react-query";
import * as api from "../api/historyAPI";

/**
 * 전체 "라인 목록"을 불러오는 훅.
 * - 캐시 유지 시간: 30분
 */
export const useLines = () =>
  useQuery({
    queryKey: ["lines"],
    queryFn: () => api.fetchLines(),
    staleTime: 1000 * 60 * 30,
  });
/**
 * 선택된 라인의 "설비(EQP) 목록"을 불러오는 훅.
 * - enabled: 라인ID가 있을 때만 동작
 * - 캐시 유지 시간: 30분
 */
export const useEquipments = (lineId, sdwtId, enabled) =>
  useQuery({
    queryKey: ["equipments", lineId, sdwtId],
    queryFn: () => api.fetchEquipments(lineId, sdwtId),
    enabled,
    staleTime: 1000 * 60 * 30,
  });
