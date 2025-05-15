import { useContext, useEffect, useRef } from "react";
import { Timeline, DataSet } from "vis-timeline/standalone";
import { TimelineContext } from "../../../context/TimelineProvider";
import { processData, baseOptions } from "../../../utils/timelineUtils";
import { groupConfig } from "../../../utils/timelineMeta";

export const useTimelineRenderer = (containerRef, groupKey, data, range) => {
  const tlRef = useRef(null);
  const { poolRef, register, unregister } = useContext(TimelineContext);

  useEffect(() => {
    const groupOptions = groupConfig[groupKey]?.options ?? {};

    const mergedOptions = {
      stack: false,
      zoomMin: 1000 * 60 * 30,
      zoomMax: 1000 * 60 * 60 * 24 * 7,
      min: range.min,
      max: range.max,
      ...groupOptions, // 그룹별 옵션 우선 적용
    };

    const items = new DataSet(processData(groupKey, data));
    tlRef.current = new Timeline(containerRef.current, items, mergedOptions);

    tlRef.current.on("rangechange", ({ start, end }) => {
      poolRef.current.forEach((tl) => {
        if (tl !== tlRef.current)
          tl.setWindow(start, end, { animation: false });
      });
    });

    register(tlRef.current);

    return () => {
      unregister(tlRef.current);
      tlRef.current.destroy();
    };
  }, [data, range]);

  return tlRef;
};
