// src/components/timeline/StackedTimeline.jsx
import React, { useEffect, useRef, useContext } from "react";
import { Timeline, DataSet } from "vis-timeline/standalone";
import { processData } from "../../utils/timelineUtils";
import { TimelineContext } from "../../context/TimelineProvider";
import { useSelection } from "../../context/SelectionContext";

const StackedTimeline = ({ dataMap, range }) => {
  const containerRef = useRef(null);
  const { register, unregister, poolRef } = useContext(TimelineContext);
  const { selectedRow, setSelectedRow } = useSelection();

  // 그룹 정의 (고정 너비 설정)
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
    // items 구성 시 배열로 변환하여 flatMap 사용
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
      locale: "ko",
      verticalScroll: false,
      margin: { item: 0, axis: 0 },

      groupHeightMode: "fixed",

      groupOrder: (a, b) =>
        groups.get().findIndex((g) => g.id === a.id) -
        groups.get().findIndex((g) => g.id === b.id),
    });

    timeline.setWindow(range.min, range.max);
    register(timeline);

    const sync = ({ start, end }) => {
      poolRef.current.forEach((tl) => {
        if (tl !== timeline) {
          tl.setWindow(start, end, { animation: false });
        }
      });
    };
    timeline.on("rangechange", sync);

    // ✅ 선택 이벤트 연결
    timeline.on("select", (props) => {
      // 방어코드 추가
      const selectedId = props.items?.[0];
      if (selectedId && typeof selectedId === "string") {
        setSelectedRow(selectedId);
      } else {
        setSelectedRow(null);
      }
    });

    return () => {
      unregister(timeline);
      timeline.off("rangechange", sync);
      timeline.destroy();
    };
  }, [dataMap, range]);

  /* 🔄 2-way sync: 컨텍스트가 변하면 타임라인도 선택·포커스 */
  useEffect(() => {
    if (!containerRef.current) return;

    // 1) pool 에서 내 타임라인을 찾는다
    const tl = poolRef.current.find(
      (t) => t.dom?.container === containerRef.current
    );
    if (!tl) return;

    // 2) 현재 선택된 ID가 이 타임라인 안에 있는지 확인
    // 2-1) selectedRow가 없거나, string 타입이 아닌 경우 리턴
    if (!selectedRow || typeof selectedRow !== "string") {
      tl.setSelection([]);
      return;
    }

    // 2-2) itemsData에 실제로 존재하는 아이템인지 체크
    const hasItem =
      tl.itemsData?.get instanceof Function && tl.itemsData.get(selectedRow);

    if (hasItem) {
      tl.setSelection([selectedRow]);
      try {
        tl.focus(selectedRow, { animation: { duration: 300 } });
      } catch (e) {
        // 에러 발생 시(예: 아이템이 사라졌거나 애니메이션 불가 등) 안전하게 무시
        console.warn("Timeline focus error:", e);
      }
    } else {
      tl.setSelection([]);
      // 🚨🚨🚨 없는 selectedRow는 자동 초기화 (여기선 내부적으로만)
      if (selectedRow) setSelectedRow(null);
    }
  }, [selectedRow, poolRef, setSelectedRow]);

  return (
    <div className="timeline-container">
      <h3 className="text-sm font-semibold mb-1 text-slate-600 dark:text-slate-300">
        📍 CTTTM + RACB 로그
      </h3>
      <div
        ref={containerRef}
        className="timeline"
        style={{
          height: "550px", // ✅ 고정 높이
          overflow: "hidden", // ✅ 스크롤 방지
        }}
      />
    </div>
  );
};

export default StackedTimeline;
