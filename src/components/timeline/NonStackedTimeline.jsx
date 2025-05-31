// src/components/timeline/NonStackedTimeline.jsx
import React, { useEffect, useRef, useContext } from "react";
import { Timeline, DataSet } from "vis-timeline/standalone";
import { processData } from "../../utils/timelineUtils";
import { TimelineContext } from "../../context/TimelineProvider";
import { useSelection } from "../../context/SelectionContext";
import { makeItemId } from "../../utils/timelineUtils";

const NonStackedTimeline = ({ dataMap, range }) => {
  const containerRef = useRef(null);
  const { register, unregister, poolRef } = useContext(TimelineContext);
  const { selectedRow, setSelectedRow } = useSelection();

  const groups = new DataSet([
    {
      id: "EQP_LOG",
      content: "EQP 상태",
      style: "width: 120px;",
      className: "custom-group-label",
    },
    {
      id: "TIP_LOG",
      content: "TIP 상태",
      style: "width: 120px;",
      className: "custom-group-label",
    },
  ]);

  useEffect(() => {
    const items = new DataSet(
      groups
        .get()
        .flatMap((g) => processData(g.id, dataMap[g.id] || [], range.max))
    );

    const timeline = new Timeline(containerRef.current, items, groups, {
      stack: false,
      min: range.min,
      max: range.max,
      margin: { item: 0, axis: 0 },
      verticalScroll: false,
      groupOrder: (a, b) =>
        groups.get().findIndex((g) => g.id === a.id) -
        groups.get().findIndex((g) => g.id === b.id),
    });

    timeline.setWindow(range.min, range.max);
    register(timeline);

    const sync = ({ start, end }) => {
      poolRef.current.forEach((tl) => {
        if (tl !== timeline) tl.setWindow(start, end, { animation: false });
      });
    };
    timeline.on("rangechange", sync);

    timeline.on("select", (props) => {
      if (props.items?.length) {
        const selectedItem = timeline.itemsData.get(props.items[0]);
        // For NonStackedTimeline (range items), always construct the ID
        // from its group and start time to ensure consistency with CombinedDataTable.
        if (selectedItem && selectedItem.start && selectedItem.group) {
          const matchedId = makeItemId(selectedItem.group, selectedItem.start);
          setSelectedRow(matchedId);
        } else {
          // If essential info (start or group) is missing, or item not found,
          // treat as a deselection or log an error if unexpected.
          // For now, if an item was supposedly selected but we can't form an ID,
          // we'll clear the selection to avoid inconsistent states.
          if (selectedRow !== null) setSelectedRow(null);
        }
      } else {
        // No items selected, clear the selection.
        //if (selectedRow !== null) setSelectedRow(null);
      }
    });

    return () => {
      unregister(timeline);
      timeline.off("rangechange", sync);
      timeline.destroy();
    };
  }, [dataMap, range]);

  useEffect(() => {
    if (!containerRef.current) return;
    const tl = poolRef.current.find(
      (t) => t.dom?.container === containerRef.current
    );
    if (!tl) return;
    const hasItem =
      tl.itemsData?.get instanceof Function && tl.itemsData.get(selectedRow);

    // 여기에선 setSelectedRow(null) 하지 말 것!
    if (selectedRow && hasItem) {
      tl.setSelection([selectedRow]);
    } else {
      tl.setSelection([]);
      // 이곳에 setSelectedRow(null) 호출 금지!!
    }
  }, [selectedRow, poolRef]);

  return (
    <div className="timeline-container">
      <h3 className="text-sm font-semibold mb-1 text-slate-600 dark:text-slate-300">
        ⛓ EQP + TIP 로그
      </h3>
      <div ref={containerRef} className="timeline" />
    </div>
  );
};

export default NonStackedTimeline;
