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

  // 그룹 정의 (EQP_LOG, TIP_LOG 순서)
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
    // 모든 그룹 데이터를 flatten → vis-timeline items 생성
    const items = new DataSet(
      groups.get().flatMap((g) => processData(g.id, dataMap[g.id] || []))
    );

    // 타임라인 인스턴스 생성 (stack: false)
    const timeline = new Timeline(containerRef.current, items, groups, {
      stack: false,
      min: range.min,
      max: range.max,
      margin: { item: 0, axis: 0 },
      verticalScroll: false,
      groupOrder: (a, b) =>
        groups.get().findIndex((g) => g.id === a.id) -
        groups.get().findIndex((g) => g.id === b.id),
      selectable: true, // 클릭으로 아이템을 선택 가능하게 함
      selectableOverlap: true, // 레인지 아이템(겹치는 구간)도 선택되도록 허용
    });

    // 초기 윈도우(뷰포트) 설정
    timeline.setWindow(range.min, range.max);
    register(timeline);

    // 다른 타임라인과 X축 동기화
    const sync = ({ start, end }) => {
      poolRef.current.forEach((tl) => {
        if (tl !== timeline) {
          tl.setWindow(start, end, { animation: false });
        }
      });
    };
    timeline.on("rangechange", sync);

    // (A) 선택 직후 props.items 출력해 보기
    timeline.on("select", (props) => {
      console.log("▶ NonStackedTimeline select event props:", props);
      if (props.items?.length) {
        const rawId = props.items[0];
        // (B) 실제 itemsData.get 결과까지 찍어 보기
        const itemObj = timeline.itemsData.get(rawId);
        console.log("    └ rawId:", rawId, " / details:", itemObj);
        if (itemObj && itemObj.id) {
          setSelectedRow(itemObj.id);
        } else {
          setSelectedRow(null);
        }
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

  // selectedRow가 바뀔 때마다, 이 타임라인에도 선택 상태 반영
  useEffect(() => {
    if (!containerRef.current) return;
    const tl = poolRef.current.find(
      (t) => t.dom?.container === containerRef.current
    );
    if (!tl) return;

    const hasItem =
      tl.itemsData?.get instanceof Function && tl.itemsData.get(selectedRow);

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
