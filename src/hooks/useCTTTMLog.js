import { useQuery } from "@tanstack/react-query";
import * as api from "../api/historyAPI";

/**
 * 선택된 EQP의 CTTTM 로그 데이터를 불러오는 훅.
 * - eqpId가 있을 때만 동작
 * - 캐시 유지 시간: 30분
 */
export const useCtttmLog = (eqpId) =>
  useQuery({
    queryKey: ["ctttm", eqpId],
    queryFn: () => api.fetchCTTTMLog(eqpId).then((r) => r.data),
    enabled: !!eqpId,
    staleTime: 1000 * 60 * 30,
  });
