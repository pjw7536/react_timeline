/*
  선택 EQP 기준 3종 타임라인 출력 (RUN / STEP / EVENT)
  – X축 공유 (TimelineProvider 가 자동 동기화)
*/
import React from "react";
import { useRunStatus } from "../../hooks/useRunStatus";
import { useStepStatus } from "../../hooks/useStepStatus";
import { useEventLog } from "../../hooks/useEventLog";
import RangeTimeline from "./RangeTimeline";
import PointTimeline from "./PointTimeline";
import LoadingSpinner from "../common/LoadingSpinner";
import { calcRange } from "../../utils/timelineUtils";

const TimelineBoard = ({ eqpId }) => {
  const { data: run = [], isLoading: l1 } = useRunStatus(eqpId);
  const { data: step = [], isLoading: l2 } = useStepStatus(eqpId);
  const { data: ev = [], isLoading: l3 } = useEventLog(eqpId);

  if (!eqpId) return null;
  if (l1 || l2 || l3) return <LoadingSpinner />;

  const range = calcRange(run, step, ev);

  return (
    <div className="mt-6">
      <RangeTimeline groupKey="RUN" data={run} range={range} />
      <RangeTimeline groupKey="STEP" data={step} range={range} />
      <PointTimeline groupKey="EVENT" data={ev} range={range} />
    </div>
  );
};

export default TimelineBoard;
