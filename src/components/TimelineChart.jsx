import React, { useRef } from "react";
import RangeTimeline from "./RangeTimeline";
import PointTimeline from "./PointTimeline";
import { groupData } from "../data/groupData";
import { calculateGlobalRange } from "../utils/timelineUtils";

const TimelineChart = () => {
  const syncRef = useRef([]);

  // ✅ 공통 범위 계산
  const { minTime, maxTime } = calculateGlobalRange(groupData);

  return (
    <div className="timeline-chart">
      <RangeTimeline
        groupKey="A"
        data={groupData.A}
        syncRef={syncRef}
        globalMin={minTime}
        globalMax={maxTime}
      />
      <RangeTimeline
        groupKey="B"
        data={groupData.B}
        syncRef={syncRef}
        globalMin={minTime}
        globalMax={maxTime}
      />
      <PointTimeline
        groupKey="C"
        data={groupData.C}
        syncRef={syncRef}
        globalMin={minTime}
        globalMax={maxTime}
      />
    </div>
  );
};

export default TimelineChart;
