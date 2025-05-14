import { useRef, useEffect } from "react";
import { Timeline, DataSet } from "vis-timeline/standalone";
import {
  processData,
  adjustTimeRange,
  generateOptions,
} from "../utils/timelineUtils";

export const useTimeline = (
  containerRef,
  groupKey,
  data,
  renderType,
  syncRef,
  globalMin,
  globalMax
) => {
  const timelineRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const items = new DataSet(processData(groupKey, data, renderType));

    const { adjustedMin, adjustedMax } = adjustTimeRange(globalMin, globalMax);

    // ✅ 그룹별 stack 옵션 설정
    const stackOption = groupKey === "C";

    const options = {
      ...generateOptions(adjustedMin, adjustedMax),
      stack: stackOption,
    };

    timelineRef.current = new Timeline(containerRef.current, items, options);

    timelineRef.current.on("rangechange", (props) => {
      syncRef.current.forEach((tl) => {
        if (tl !== timelineRef.current) {
          tl.setWindow(props.start, props.end, { animation: false });
        }
      });
    });

    syncRef.current.push(timelineRef.current);

    return () => {
      syncRef.current = syncRef.current.filter(
        (tl) => tl !== timelineRef.current
      );
      timelineRef.current.destroy();
    };
  }, [data, renderType, globalMin, globalMax]);

  return timelineRef;
};
