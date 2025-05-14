import React, { useRef } from "react";
import { useTimeline } from "../hooks/useTimeline";
import "../styles/timeline.css";

const RangeTimeline = ({ groupKey, data, syncRef, globalMin, globalMax }) => {
  const containerRef = useRef(null);

  useTimeline(
    containerRef,
    groupKey,
    data,
    "range",
    syncRef,
    globalMin,
    globalMax
  );

  return (
    <div className="timeline-container range-timeline">
      <div ref={containerRef} className="timeline" />
    </div>
  );
};

export default RangeTimeline;
