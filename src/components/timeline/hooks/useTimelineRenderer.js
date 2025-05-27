// src/components/timeline/hooks/useTimelineRenderer.js
import { useContext, useEffect, useRef, useMemo } from "react"; // Added useMemo
import { Timeline, DataSet } from "vis-timeline/standalone";
import { TimelineContext } from "../../../context/TimelineProvider";
import { processData } from "../../../utils/timelineUtils";
import { groupConfig } from "../../../utils/timelineMeta";

export const useTimelineRenderer = (containerRef, groupKey, data, range) => {
  const tlRef = useRef(null);
  const { poolRef, register, unregister } = useContext(TimelineContext);

  // Memoize groupOptions to prevent unnecessary option updates
  const groupOptions = useMemo(() => {
    return groupConfig[groupKey]?.options ?? {};
  }, [groupKey]);

  // Effect for Timeline Initialization and Destruction
  useEffect(() => {
    if (!containerRef.current) return;

    // Initial options - excluding start/end which are set by setWindow
    const initialMergedOptions = {
      stack: false,
      zoomMin: 1000 * 60 * 30,
      zoomMax: 1000 * 60 * 60 * 24 * 7,
      ...groupOptions, // group specific options
      // Do not set start/end here if you want setWindow to control it initially
    };

    const items = new DataSet(processData(groupKey, data, range.max));
    tlRef.current = new Timeline(containerRef.current, items, initialMergedOptions);
    tlRef.current.setWindow(range.min, range.max); // Set initial window

    register(tlRef.current);

    const currentTl = tlRef.current; // Capture for cleanup
    const handleRangeChange = ({ start, end }) => {
      poolRef.current.forEach((tl) => {
        if (tl !== currentTl) {
          tl.setWindow(start, end, { animation: false });
        }
      });
    };
    currentTl.on("rangechange", handleRangeChange);

    return () => {
      unregister(currentTl);
      currentTl.off("rangechange", handleRangeChange);
      currentTl.destroy();
      tlRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, groupKey, poolRef, register, unregister]); // Removed data, range, groupOptions from here

  // Effect for Data Updates
  useEffect(() => {
    if (tlRef.current) {
      tlRef.current.setItems(new DataSet(processData(groupKey, data, range.max)));
    }
  }, [data, groupKey, range.max]); // Add range.max because processData uses it

  // Effect for Range (window) and Options Updates
  useEffect(() => {
    if (tlRef.current) {
      // Options that might change based on groupKey
      const updatedMergedOptions = {
        stack: false, // Base options
        zoomMin: 1000 * 60 * 30,
        zoomMax: 1000 * 60 * 60 * 24 * 7,
        ...groupOptions, // group specific options from memoized value
      };
      tlRef.current.setOptions(updatedMergedOptions);
      tlRef.current.setWindow(range.min, range.max);
    }
  }, [range, groupOptions]); // groupOptions is memoized

  return tlRef;
};
