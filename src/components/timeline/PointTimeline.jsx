// src/components/timeline/PointTimeline.jsx (예시 - 고유 로직 추가)
import React, { useRef, useEffect } from "react";
import { useTimeline } from "./hooks/useTimeline";
import "../../styles/timeline.css";

const PointTimeline = ({ groupKey, data, range }) => {
  const containerRef = useRef(null);
  const timelineInstanceRef = useTimeline(containerRef, groupKey, data, range);

  // PointTimeline에만 적용되는 특별한 이벤트 핸들러
  useEffect(() => {
    const timeline = timelineInstanceRef.current; // 실제 타임라인 인스턴스
    if (timeline) {
      const handlePointClick = (properties) => {
        if (properties.item) {
          const itemId = properties.item; // e.g., "EQP_STATUS-5"
          const parts = itemId.split('-');
          const itemIndex = parseInt(parts[parts.length - 1], 10);
          const clickedItemData = data[itemIndex];

          // Point 아이템 클릭 시 특별한 알림 표시 또는 상세 정보 팝업
          if (clickedItemData) {
            alert(`포인트 이벤트: ${clickedItemData.comment}`);
          } else {
            console.warn(`No data found for item ID: ${properties.item}`);
          }
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
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">{groupKey}</h2> {/* 타임라인 이름 */}
        <div className="flex space-x-4"> {/* 범례 */}</div>
      </div>
      <div ref={containerRef} className="timeline" />
    </div>
  );
};

export default PointTimeline;
