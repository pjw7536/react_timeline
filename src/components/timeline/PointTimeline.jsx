// src/components/timeline/PointTimeline.jsx (예시 - 고유 로직 추가)
import React, { useRef, useEffect } from "react";
import { useTimeline } from "./hooks/useTimeline";
import "../../styles/timeline.css";

const PointTimeline = ({ groupKey, data, range }) => {
  const containerRef = useRef(null);
  const timelineInstanceRef = useTimeline(containerRef, groupKey, data, range); // useTimeline이 타임라인 인스턴스 ref를 반환한다고 가정

  // PointTimeline에만 적용되는 특별한 이벤트 핸들러
  useEffect(() => {
    const timeline = timelineInstanceRef.current; // 실제 타임라인 인스턴스
    if (timeline) {
      const handlePointClick = (properties) => {
        if (properties.item) {
          const clickedItemData = data.find(
            (d) => `${groupKey}-${data.indexOf(d)}` === properties.item
          );
          // Point 아이템 클릭 시 특별한 알림 표시 또는 상세 정보 팝업
          alert(`포인트 이벤트: ${clickedItemData?.comment}`);
        }
      };

      // 'click' 이벤트는 아이템, 빈 공간 등 어디든 클릭 시 발생
      // 'select' 이벤트는 아이템 선택 시 발생
      timeline.on("select", handlePointClick);

      return () => {
        timeline.off("select", handlePointClick);
      };
    }
  }, [timelineInstanceRef, data, groupKey]);

  return (
    <div className="timeline-container point-timeline">
      {/* PointTimeline 위에만 보이는 추가 UI 요소 */}
      <button className="text-xs bg-blue-100 p-1 mb-1">포인트 전용 필터</button>
      <div ref={containerRef} className="timeline" />
    </div>
  );
};

export default PointTimeline;
