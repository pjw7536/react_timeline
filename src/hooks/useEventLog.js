import { useQuery } from "@tanstack/react-query";
import * as api from "../api/mockApi";

export const useEventLog = (eqpId) =>
  useQuery({
    queryKey: ["event", eqpId],
    queryFn: () => api.fetchEventLog(eqpId).then((r) => r.data),
    enabled: !!eqpId,
    staleTime: 1000 * 60 * 30,
  });
