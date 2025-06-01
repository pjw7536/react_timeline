// src/components/timeline/TimelineBoard.jsx
import React, { useMemo } from "react";
import NonStackedTimeline from "./NonStackedTimeline";
import StackedTimeline from "./StackedTimeline";
import { calcRange, addBuffer } from "../../utils/timelineUtils";

export default function TimelineBoard({ dataMap }) {
  // dataMap = { EQP_LOG: [...], TIP_LOG: [...], RACB_LOG: [...], CTTTM_LOG: [...] }

  // 1) "EQP_LOG + TIP_LOG" 을 NonStackedTimeline에 넘길 것
  const eqpLogArr = dataMap.EQP_LOG || [];
  const tipLogArr = dataMap.TIP_LOG || [];

  // 2) "CTTTM_LOG + RACB_LOG" 을 StackedTimeline에 넘길 것
  const ctttmLogArr = dataMap.CTTTM_LOG || [];
  const racbLogArr = dataMap.RACB_LOG || [];

  // 3) 전체 로그 배열을 합쳐서 시간 범위 계산 (NonStacked에 사용할 range)
  const allLogs = useMemo(
    () => [...eqpLogArr, ...tipLogArr, ...ctttmLogArr, ...racbLogArr],
    [eqpLogArr, tipLogArr, ctttmLogArr, racbLogArr]
  );

  const fullRange = useMemo(() => {
    const r = calcRange(allLogs);
    if (r.min && r.max) {
      return addBuffer(r.min.getTime(), r.max.getTime());
    } else {
      // 기본: 오늘 날짜 전체
      const now = new Date();
      return {
        min: new Date(now.setHours(0, 0, 0, 0)),
        max: new Date(now.setHours(23, 59, 59, 999)),
      };
    }
  }, [allLogs]);

  return (
    <div className="w-full space-y-4">
      {/* 🟡 EQP_LOG + TIP_LOG 는 point/range 구분 없이 stack 없이 나란히 보여주는 NonStackedTimeline */}
      <NonStackedTimeline
        dataMap={{
          EQP_LOG: eqpLogArr,
          TIP_LOG: tipLogArr,
        }}
        range={fullRange}
      />

      {/* 🟡 CTTTM_LOG + RACB_LOG 은 point 형(logType 별로 stack) 보여주는 StackedTimeline */}
      <StackedTimeline
        dataMap={{
          CTTTM_LOG: ctttmLogArr,
          RACB_LOG: racbLogArr,
        }}
      />
    </div>
  );
}
