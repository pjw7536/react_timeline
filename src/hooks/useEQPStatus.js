import { useQuery } from "@tanstack/react-query";
import * as api from "../api/historyAPI";

/**
 * 선택된 EQP의 가동 상태(RUN) 데이터를 불러오는 훅.
 * - eqpId가 있을 때만 동작
 * - 캐시 유지 시간: 30분
 */
export const useEqpStatus = (eqpId) =>
  useQuery({
    queryKey: ["run", eqpId],
    queryFn: () => api.fetchEQPStatus(eqpId).then((r) => r.data),
    enabled: !!eqpId,
    staleTime: 1000 * 60 * 30,
  });
