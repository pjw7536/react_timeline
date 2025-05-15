import { useQuery } from "@tanstack/react-query";
import * as api from "../api/mockApi";

export const useStepStatus = (eqpId) =>
  useQuery({
    queryKey: ["step", eqpId],
    queryFn: () => api.fetchStepStatus(eqpId).then((r) => r.data),
    enabled: !!eqpId,
  });
