// src/components/timeline/NonStackedTimeline.jsx
import React, { useEffect, useRef, useContext } from "react";
import { Timeline, DataSet } from "vis-timeline/standalone";
import { processData } from "../../utils/timelineUtils";
import { TimelineContext } from "../../context/TimelineProvider";
import { useSelection } from "../../context/SelectionContext";

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
        // vis-timeline의 id가 undefined일 가능성 방어 (range 타입 등)
        let matchedId = selectedItem?.id;
        // id가 없으면 group과 start로 직접 생성
        if (!matchedId && selectedItem?.start && selectedItem?.group) {
          matchedId = `${selectedItem.group}-${new Date(
            selectedItem.start
          ).toISOString()}`;
        }
        if (matchedId) {
          setSelectedRow(matchedId);
        }
      } else {
        // 진짜 해제가 필요한 경우에만!
        if (selectedRow !== null) setSelectedRow(null);
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

    // 로그 찍기!
    console.log("selectedRow:", selectedRow, "hasItem:", !!hasItem);

    if (selectedRow && hasItem) {
      tl.setSelection([selectedRow]);
    } else {
      tl.setSelection([]);
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
