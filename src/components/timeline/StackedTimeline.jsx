// src/components/timeline/StackedTimeline.jsx

import React, { useEffect, useRef, useContext } from "react";
import { Timeline, DataSet } from "vis-timeline/standalone";
import { processData, calcRange, addBuffer } from "../../utils/timelineUtils";
import { TimelineContext } from "../../context/TimelineProvider";
import { useSelection } from "../../context/SelectionContext";

const StackedTimeline = ({ dataMap }) => {
  const containerRef = useRef(null);
  const { register, unregister, poolRef } = useContext(TimelineContext);
  const {
    selectedRow,
    setSelectedRow,
    selectionSource = "timeline",
  } = useSelection();

  // ─── 1. 그룹 정의 (height: 150px 로 고정)
  const groups = new DataSet([
    {
      id: "CTTTM_LOG",
      content: "CTTTM 이벤트",
      height: 100, // ← 그룹 높이를 150px로 고정
      className: "custom-group-label",
    },
    {
      id: "RACB_LOG",
      content: "RACB 이벤트",
      height: 150, // ← 그룹 높이를 150px로 고정
      className: "custom-group-label",
    },
  ]);

  // ─── 2. 전체 로그에서 범위 계산 (생략하셔도 됩니다)
  const allLogs = [...(dataMap.CTTTM_LOG || []), ...(dataMap.RACB_LOG || [])];
  const baseRange = calcRange(allLogs);
  const validRange = baseRange.min && baseRange.max;
  const fullRange = validRange
    ? addBuffer(baseRange.min.getTime(), baseRange.max.getTime())
    : {
        min: new Date(new Date().setHours(0, 0, 0, 0)),
        max: new Date(new Date().setHours(23, 59, 59, 999)),
      };

  useEffect(() => {
    if (!containerRef.current) return;

    // ─── 3. 아이템 생성
    const items = new DataSet(
      groups.get().flatMap((g) => processData(g.id, dataMap[g.id] || []))
    );

    // ─── 4. 타임라인 옵션
    const options = {
      /* 
       ── 핵심 변경점 ──
       groupHeightMode: "fixed"   // “height 필드가 최소 및 고정값” 으로 동작하게 함 
       verticalScroll: true       // 그룹 높이(150px)를 넘어가는 아이템이 있으면, 그룹 내부에서 스크롤이 생기도록 함 
      */
      //height: "550px",
      stack: true,
      min: fullRange.min,
      max: fullRange.max,
      /* ── 여기서 verticalScroll: true 추가 ── */
      verticalScroll: true,
      /* ── margin:item, axis 등은 기존대로 유지 ── */
      margin: { item: 0, axis: 0 },
      groupHeightMode: "fixed",
      groupOrder: (a, b) =>
        groups.get().findIndex((g) => g.id === a.id) -
        groups.get().findIndex((g) => g.id === b.id),
    };

    const timeline = new Timeline(containerRef.current, items, groups, options);

    // ─── 초기 윈도우 설정
    timeline.setWindow(fullRange.min, fullRange.max);

    // ─── 타임라인 동기화
    register(timeline);
    const sync = ({ start, end }) => {
      poolRef.current.forEach((tl) => {
        if (tl !== timeline) {
          tl.setWindow(start, end, { animation: false });
        }
      });
    };
    timeline.on("rangechange", sync);

    // ─── 선택 이벤트
    timeline.on("select", (props) => {
      const selectedId = props.items?.[0];
      if (selectedId && typeof selectedId === "string") {
        setSelectedRow(selectedId, "timeline");
      } else {
        setSelectedRow(null, "timeline");
      }
    });

    return () => {
      unregister(timeline);
      timeline.off("rangechange", sync);
      timeline.destroy();
    };
  }, [dataMap]);

  // ─── 5. selectedRow 변화 시, 선택 상태 동기화
  useEffect(() => {
    if (!containerRef.current) return;
    const tl = poolRef.current.find(
      (t) => t.dom?.container === containerRef.current
    );
    if (!tl) return;

    if (selectedRow) {
      const item = tl.itemsData.get(selectedRow);
      if (item) {
        tl.setSelection([selectedRow]);
        if (selectionSource === "table") {
          setTimeout(() => {
            try {
              //tl.focus(selectedRow, { animation: { duration: 200 } });
            } catch {}
          }, 0);
        }
      } else {
        tl.setSelection([]);
      }
    } else {
      tl.setSelection([]);
    }
  }, [selectedRow, selectionSource, poolRef, dataMap]);

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
          overflow: "hidden", // 타임라인 전체 높이를 고정하려면 overflow hidden 유지
        }}
      />
    </div>
  );
};

export default StackedTimeline;
