import { useRef } from "react";
import { useTimelineRenderer } from "./useTimelineRenderer";

/**
 * 타임라인을 만들기 위한 커스텀 훅입니다.
 * - containerRef: 타임라인이 표시될 DOM 참조(React의 useRef로 만든 div 등)
 * - groupKey: 데이터 그룹 식별자 (예: "EQP_STATUS", "TIP_STATUS" 등)
 * - data: 타임라인에 표시할 데이터
 * - range: 타임라인의 시간 범위({min, max})
 *
 * 실제 타임라인 생성/업데이트 로직은 useTimelineRenderer 훅에 위임합니다.
 */
export const useTimeline = (containerRef, groupKey, data, range) => {
  // useTimelineRenderer 내부에서 타임라인 인스턴스를 만들어서 관리합니다.
  const tl = useTimelineRenderer(containerRef, groupKey, data, range);
  return tl;
};
