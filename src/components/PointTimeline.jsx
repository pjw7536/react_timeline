import React, { useRef } from "react";
import { useTimeline } from "../hooks/useTimeline";
import "../styles/timeline.css";

const PointTimeline = ({ groupKey, data, syncRef, globalMin, globalMax }) => {
  const containerRef = useRef(null);

  useTimeline(
    containerRef,
    groupKey,
    data,
    "point",
    syncRef,
    globalMin,
    globalMax
  );

  return (
    <div className="timeline-container point-timeline">
      <div ref={containerRef} className="timeline" />
    </div>
  );
};

export default PointTimeline;
