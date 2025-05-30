import React from "react";
import { useEqpStatusLog } from "../../hooks/useEqpStatusLog";
import { useTipLog } from "../../hooks/useTIPLog";
import { useRacbLog } from "../../hooks/useRacbLog";
import { useCtttmLog } from "../../hooks/useCTTTMLog";
import RangeTimeline from "./RangeTimeline";
import PointTimeline from "./PointTimeline";
import LoadingSpinner from "../common/LoadingSpinner";
import { calcRange, addBuffer } from "../../utils/timelineUtils";

/**
 * 하나의 EQP에 대해 EQP_LOG, TIP_LOG, RACB_LOG, CTTTM_LOG 타임라인을 모두 표시하는 컴포넌트입니다.
 * (X축 범위는 자동 동기화)
 * - eqpId: 장비 ID
 */
const TimelineBoard = ({ eqpId }) => {
  // 각 데이터 fetch (React Query 사용)
  const { data: eqp_log = [], isLoading: l1 } = useEqpStatusLog(eqpId);
  const { data: tip_log = [], isLoading: l2 } = useTipLog(eqpId);
  const { data: racb_log = [], isLoading: l3 } = useRacbLog(eqpId);
  const { data: ctttm_log = [], isLoading: l4 } = useCtttmLog(eqpId);

  // 선택된 장비 없으면 아무것도 렌더링 안 함
  if (!eqpId) return null;
  // 데이터 로딩 중일 때 스피너 표시
  if (l1 || l2 || l3 || l4) return <LoadingSpinner />;

  // 데이터 전체 시간 범위 계산 (최소~최대)
  const range = calcRange(eqp_log, tip_log, racb_log, ctttm_log);

  // 3일 여유 범위 더하기 (양쪽 ±3일)
  const fullRange = addBuffer(range.min.getTime(), range.max.getTime());

  // 세 개의 타임라인 출력 (범위 공유)
  return (
    <div className="w-full">
      <RangeTimeline groupKey="EQP_LOG" data={eqp_log} range={fullRange} />
      <RangeTimeline groupKey="TIP_LOG" data={tip_log} range={fullRange} />
      <RangeTimeline groupKey="RACB_LOG" data={racb_log} range={fullRange} />
      <RangeTimeline groupKey="CTTTM_LOG" data={ctttm_log} range={fullRange} />
    </div>
  );
};

export default TimelineBoard;
