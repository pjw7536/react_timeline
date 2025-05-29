import { useQuery } from "@tanstack/react-query";
import * as api from "../api/historyAPI";

/**
 * 선택된 EQP의 EVENT 로그 데이터를 불러오는 커스텀 훅.
 * - eqpId가 있을 때만 동작 (enabled: !!eqpId)
 * - 캐시 유지 시간: 30분
 */
export const useRacbLog = (eqpId) =>
  useQuery({
    queryKey: ["event", eqpId],
    queryFn: () => api.fetchRACBLog(eqpId).then((r) => r.data),
    enabled: !!eqpId,
    staleTime: 1000 * 60 * 30,
  });
