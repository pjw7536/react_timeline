import { Timeline, DataSet } from "vis-timeline/standalone";
import { useEffect, useRef } from "react";

export default function TimelineView({ items }) {
  const containerRef = useRef();

  useEffect(() => {
    if (!containerRef.current) return;

    const groups = new DataSet([
      { id: "EQP_LOG", content: "EQP 로그" },
      { id: "TIP_LOG", content: "TIP 로그" },
      { id: "RACB_LOG", content: "RACB 로그" },
      { id: "CTTTM_LOG", content: "CTTTM 로그" },
    ]);

    const timelineItems = items.map((log) => ({
      id: log.id,
      group: log.logType,
      start: log.eventTime,
      end: log.endTime || undefined,
      content: log.eventType,
      title: log.comment,
    }));

    const timeline = new Timeline(containerRef.current, timelineItems, groups, {
      stack: true,
      orientation: "top",
    });

    return () => timeline.destroy();
  }, [items]);

  return <div ref={containerRef} style={{ height: "400px" }} />;
}
