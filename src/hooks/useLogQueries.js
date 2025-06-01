import { useQuery } from "@tanstack/react-query";
import { fetchLogs } from "../api/historyAPI";

export const useLogs = ({ lineId, sdwtId, eqpId }, enabled) =>
  useQuery({
    queryKey: ["logs", lineId, sdwtId, eqpId],
    queryFn: () => fetchLogs({ lineId, sdwtId, eqpId }),
    enabled,
    staleTime: 1000 * 60 * 5, // 5분 캐시 유지
  });
