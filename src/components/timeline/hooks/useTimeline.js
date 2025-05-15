/* Range/Point 공통 래퍼 */
import { useRef } from "react";
import { useTimelineRenderer } from "./useTimelineRenderer";

export const useTimeline = (containerRef, groupKey, data, range) => {
  // eslint-disable-next-line
  const tl = useTimelineRenderer(containerRef, groupKey, data, range);
  return tl;
};
