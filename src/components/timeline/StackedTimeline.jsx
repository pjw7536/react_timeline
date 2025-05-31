// src/components/timeline/StackedTimeline.jsx
import React, { useEffect, useRef, useContext } from "react";
import { Timeline, DataSet } from "vis-timeline/standalone";
import { processData } from "../../utils/timelineUtils";
import { TimelineContext } from "../../context/TimelineProvider";
import { useSelection } from "../../context/SelectionContext";
import { makeItemId } from "../../utils/timelineUtils";

/**
 * 타임라인의 zoom/pan(확대/이동) 상태가 사용자가 조작해도 유지됩니다.
 * setWindow는 최초 마운트시에만 1회만 호출!
 */
const StackedTimeline = ({ dataMap, range }) => {
  const containerRef = useRef(null);
  const { register, unregister, poolRef } = useContext(TimelineContext);
  const {
    selectedRow,
    setSelectedRow,
    selectionSource = "timeline",
  } = useSelection();

  // 그룹 정의 (고정 너비/높이)
  const groups = new DataSet([
    {
      id: "CTTTM_LOG",
      content: "CTTTM 이벤트",
      height: 150,
      className: "custom-group-label",
    },
    {
      id: "RACB_LOG",
      content: "RACB 이벤트",
      height: 150,
      className: "custom-group-label",
    },
  ]);

  useEffect(() => {
    // 1️⃣ 타임라인 인스턴스 생성 (마운트) — 최초 1회만 setWindow!
    const items = new DataSet(
      groups
        .get()
        .flatMap((g) => processData(g.id, dataMap[g.id] || [], range.max))
    );
    const timeline = new Timeline(containerRef.current, items, groups, {
      height: "550px",
      stack: true,
      min: range.min,
      max: range.max,
      verticalScroll: false,
      margin: { item: 0, axis: 0 },
      groupHeightMode: "fixed",
      groupOrder: (a, b) =>
        groups.get().findIndex((g) => g.id === a.id) -
        groups.get().findIndex((g) => g.id === b.id),
    });

    timeline.setWindow(range.min, range.max); // ✅ 최초 1회만

    register(timeline);

    const sync = ({ start, end }) => {
      poolRef.current.forEach((tl) => {
        if (tl !== timeline) {
          tl.setWindow(start, end, { animation: false });
        }
      });
    };
    timeline.on("rangechange", sync);

    timeline.on("select", (props) => {
      const selectedId = props.items?.[0];
      if (selectedId && typeof selectedId === "string") {
        setSelectedRow(selectedId, "timeline");
      } else {
        setSelectedRow(null, "timeline");
      }
    });

    // 언마운트 시 해제
    return () => {
      unregister(timeline);
      timeline.off("rangechange", sync);
      timeline.destroy();
    };
    // eslint-disable-next-line
  }, [
    dataMap,
    range.min,
    range.max,
    poolRef,
    register,
    unregister,
    setSelectedRow,
  ]);

  // 2️⃣ 데이터가 바뀔 때 타임라인 항목만 갱신 (window 변경 X)
  useEffect(() => {
    const tl = poolRef.current.find(
      (t) => t.dom?.container === containerRef.current
    );
    if (!tl) return;

    // 데이터셋 갱신만 (window/zoom/pan은 그대로)
    tl.setItems(
      new DataSet(
        groups
          .get()
          .flatMap((g) => processData(g.id, dataMap[g.id] || [], range.max))
      )
    );
  }, [dataMap, range.max, poolRef, groups]);

  /**
   * selectedRow, selectionSource가 바뀔 때마다 타임라인에 반영
   * 테이블(row) 클릭이면 window도 ±24시간으로 이동!
   * 타임라인 직접 클릭이면 window/focus는 안 바꿈.
   */
  useEffect(() => {
    if (!containerRef.current || !selectedRow) return;

    // 타임라인 인스턴스
    const tl = poolRef.current.find(
      (t) => t.dom?.container === containerRef.current
    );
    if (!tl) return;

    // (1) 해당 아이템이 존재할 때만 focus
    const item = tl.itemsData.get(selectedRow);
    if (item) {
      // focus 호출 (focus는 setWindow보다 깔끔)
      tl.setSelection([selectedRow]);
      if (selectionSource === "table") {
        setTimeout(() => {
          try {
            tl.focus(selectedRow, { animation: { duration: 200 } });
          } catch {}
        }, 0); // ← 0~100ms 짧은 딜레이를 넣으면, 아이템 렌더 동기화에 도움됨
      }
    }
  }, [selectedRow, selectionSource, poolRef, dataMap, range.max]);

  return (
    <div className="timeline-container">
      <h3 className="text-sm font-semibold mb-1 text-slate-600 dark:text-slate-300">
        📍 CTTTM + RACB 로그
      </h3>
      <div
        ref={containerRef}
        className="timeline"
        style={{
          height: "550px",
          overflow: "hidden",
        }}
      />
    </div>
  );
};

export default StackedTimeline;
