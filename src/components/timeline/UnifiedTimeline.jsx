// src/components/timeline/UnifiedTimeline.jsx
import React, { useEffect, useRef, useContext } from "react";
import { Timeline, DataSet } from "vis-timeline/standalone";
import { processData, makeItemId } from "../../utils/timelineUtils";
import { TimelineContext } from "../../context/TimelineProvider";
import { useSelection } from "../../context/SelectionContext";

const UnifiedTimeline = ({ dataMap, range }) => {
  const containerRef = useRef(null);
  const { poolRef, register, unregister } = useContext(TimelineContext);
  const { selectedRow, setSelectedRow } = useSelection();

  // 그룹 순서 정의
  const groupOrderList = ["EQP_LOG", "TIP_LOG", "CTTTM_LOG", "RACB_LOG"];

  // 그룹별 stack 여부 정의
  const groupStackMap = {
    EQP_LOG: false,
    TIP_LOG: false,
    CTTTM_LOG: true,
    RACB_LOG: true,
  };

  useEffect(() => {
    // 그룹 정의
    const groups = new DataSet(
      groupOrderList.map((key) => ({
        id: key,
        content: key,
      }))
    );

    // 데이터 가공 (id 생성시 makeItemId 활용 가능)
    const items = new DataSet(
      groupOrderList.flatMap(
        (key) =>
          (processData(key, dataMap[key] || []) || []).filter(
            (item) => !!item && !!item.id
          ) // id가 확실히 있을 때만
      )
    );

    const timeline = new Timeline(containerRef.current, items, groups, {
      zoomMin: 1000 * 60 * 30,
      zoomMax: 1000 * 60 * 60 * 24 * 30,
      min: range.min,
      max: range.max,
      stack: true,
      groupStack: (groupId) => groupStackMap[groupId] ?? false,
      groupOrder: (a, b) =>
        groupOrderList.indexOf(a.id) - groupOrderList.indexOf(b.id),
      verticalScroll: false,
      margin: { item: 0, axis: 0 },
      format: {
        minorLabels: {
          millisecond: "SSS",
          second: "s초",
          minute: "HH:mm",
          hour: "HH:mm",
          weekday: "MM/DD(ddd)",
          day: "DD(ddd)",
          week: "w주",
          month: "MM월",
          year: "YY년",
        },
        majorLabels: {
          millisecond: "HH:mm:ss",
          second: "DD일 HH:mm",
          minute: "MM/DD(ddd)",
          hour: "MM/DD(ddd)",
          weekday: "YYYY/MM",
          day: "YYYY/MM",
          week: "YYYY/MM",
          month: "YYYY년",
          year: "",
        },
      },
    });

    // ✅ select 이벤트: 오직 items가 있을 때만 setSelectedRow
    timeline.on("select", function (props) {
      if (props.items && props.items.length > 0) {
        const selectedItem = timeline.itemsData.get(props.items[0]);
        let matchedId = selectedItem?.id;
        // 혹시라도 id가 undefined일 때 group+start로 생성
        if (!matchedId && selectedItem?.start && selectedItem?.group) {
          matchedId = makeItemId(selectedItem.group, selectedItem.start);
        }
        if (matchedId) setSelectedRow(matchedId);
      }
      // 선택 해제(setSelectedRow(null))는 아예 하지 않음!
    });

    timeline.setWindow(range.min, range.max);
    register(timeline);

    const handleRangeChange = ({ start, end }) => {
      poolRef.current.forEach((tl) => {
        if (tl !== timeline) {
          tl.setWindow(start, end, { animation: false });
        }
      });
    };

    timeline.on("rangechange", handleRangeChange);

    // 클린업
    return () => {
      timeline.off("rangechange", handleRangeChange);
      unregister(timeline);
      timeline.destroy();
    };
  }, [dataMap, range, poolRef, register, unregister, setSelectedRow]);

  // selection 유지 (selectedRow가 null/undefined/빈값이면 selection을 유지)
  useEffect(() => {
    if (!containerRef.current) return;
    const tl = poolRef.current.find(
      (t) => t.dom?.container === containerRef.current
    );
    if (!tl) return;

    if (
      selectedRow &&
      typeof selectedRow === "string" &&
      tl.itemsData?.get instanceof Function &&
      tl.itemsData.get(selectedRow)
    ) {
      tl.setSelection([selectedRow]);
      // focus도 원한다면 아래 코드 추가 (선택)
      // try { tl.focus(selectedRow, { animation: { duration: 300 } }); } catch(e){}
    }
    // else: 해제는 아예 하지 않음
  }, [selectedRow, poolRef]);

  return (
    <div className="timeline-container unified-timeline">
      <div ref={containerRef} className="timeline" />
    </div>
  );
};

export default UnifiedTimeline;
