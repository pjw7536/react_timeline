import React, { useRef, useEffect } from "react";
import { useTimeline } from "./hooks/useTimeline";
import "../../styles/timeline.css";

/**
 * "포인트(점)" 타입 타임라인을 그리는 컴포넌트입니다.
 * - groupKey: "EQP_INTERLOCK" 등
 * - data: 표시할 이벤트 데이터 배열
 * - range: 타임라인 시간 범위
 *
 * 타임라인은 useTimeline 훅을 통해 생성/관리됩니다.
 */
const PointTimeline = ({ groupKey, data, range }) => {
  const containerRef = useRef(null);
  const timelineInstanceRef = useTimeline(containerRef, groupKey, data, range);

  useEffect(() => {
    // (특별한 클릭 이벤트 등 넣을 때 여기에 구현)
    const timeline = timelineInstanceRef.current;
    if (timeline) {
      // 예: timeline.on("select", ...) 등
      timeline.on("select", (props) => {
        console.log("POINT select", props);
      });
    }
  }, [timelineInstanceRef, data, groupKey]);

  return (
    <div className="timeline-container point-timeline">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">{groupKey}</h2>
        {/* 필요시 범례 등 추가 */}
        <div className="flex space-x-4"></div>
      </div>
      {/* 실제 타임라인이 그려질 영역 */}
      <div ref={containerRef} className="timeline" />
    </div>
  );
};

export default PointTimeline;
