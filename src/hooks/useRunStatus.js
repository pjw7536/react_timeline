import { useQuery } from "@tanstack/react-query";
import * as api from "../api/mockApi";

export const useRunStatus = (eqpId) =>
  useQuery({
    queryKey: ["run", eqpId],
    queryFn: () => api.fetchRunStatus(eqpId).then((r) => r.data),
    enabled: !!eqpId,
    staleTime: 1000 * 60 * 30,
  });
