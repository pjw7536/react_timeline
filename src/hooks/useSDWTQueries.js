import { useQuery } from "@tanstack/react-query";
import * as api from "../api/historyAPI";

export const useSDWTQueries = (lineId) =>
  useQuery({
    queryKey: ["sdwt", lineId],
    queryFn: () => api.fetchSDWT(lineId),
    enabled: !!lineId,
    staleTime: 1000 * 60 * 30,
  });
