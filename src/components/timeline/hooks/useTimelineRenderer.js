// src/components/timeline/hooks/useTimelineRenderer.js
import { useContext, useEffect, useRef } from "react"; // React 훅 임포트 (useContext, useEffect, useRef)
import { Timeline, DataSet } from "vis-timeline/standalone"; // vis-timeline 라이브러리에서 Timeline 클래스와 DataSet 클래스 임포트
import { TimelineContext } from "../../../context/TimelineProvider"; // Timeline 컨텍스트 임포트 (X축 동기화를 위해)
import { processData } from "../../../utils/timelineUtils"; // 데이터 처리 유틸리티 함수 임포트 (원본 데이터를 vis-timeline 아이템으로 변환)
import { groupConfig } from "../../../utils/timelineMeta"; // 그룹별 설정 정보 임포트 (타임라인 타입, 옵션, 색상 등)

/**
 * useTimelineRenderer 커스텀 훅:
 * 특정 DOM 컨테이너에 vis-timeline 인스턴스를 렌더링하고 관리합니다.
 * 또한, TimelineContext를 통해 다른 타임라인과의 X축 동기화를 처리합니다.
 *
 * @param {React.RefObject<HTMLDivElement>} containerRef - 타임라인이 렌더링될 DOM 요소에 대한 ref 객체입니다.
 * @param {string} groupKey - 현재 타임라인의 그룹 키 (예: "RUN", "STEP", "EVENT"). timelineMeta.js의 groupConfig와 매칭됩니다.
 * @param {Array<Object>} data - 타임라인에 표시될 원본 데이터 배열입니다.
 * @param {{ min: Date, max: Date }} range - 타임라인의 초기 표시 시간 범위 (최소 시간, 최대 시간) 객체입니다.
 * @returns {React.RefObject<Timeline>} 생성된 vis-timeline 인스턴스에 대한 ref 객체입니다.
 */
export const useTimelineRenderer = (containerRef, groupKey, data, range) => {
  // tlRef: 현재 훅에서 생성하고 관리하는 vis-timeline 인스턴스를 참조하기 위한 ref.
  // 이 ref는 PointTimeline 등에서 타임라인 인스턴스에 직접 접근해야 할 때 사용될 수 있습니다.
  const tlRef = useRef(null);

  // TimelineContext로부터 poolRef, register, unregister 함수를 가져옵니다.
  // - poolRef: 애플리케이션 내의 모든 활성 타임라인 인스턴스들을 담고 있는 배열에 대한 참조입니다.
  // - register: 현재 생성된 타임라인 인스턴스를 poolRef에 등록하는 함수입니다.
  // - unregister: 현재 타임라인 인스턴스를 poolRef에서 제거하는 함수입니다. (컴포넌트 언마운트 시)
  const { poolRef, register, unregister } = useContext(TimelineContext); //

  // useEffect 훅: data나 range props가 변경될 때마다 타임라인을 다시 그리거나 업데이트합니다.
  // 의존성 배열에 data와 range를 포함하여, 이 값들이 변경될 때만 이펙트 함수가 실행되도록 합니다.
  useEffect(() => {
    // Merge timeline options
    const groupOptions = groupConfig[groupKey]?.options ?? {};
    const mergedOptions = {
      stack: false,
      zoomMin: 1000 * 60 * 30,
      zoomMax: 1000 * 60 * 60 * 24 * 7,
      start: range.min,
      end: range.max,
      ...groupOptions,
    };

    // Prepare timeline items
    const items = new DataSet(processData(groupKey, data));

    // Create timeline instance
    tlRef.current = new Timeline(containerRef.current, items, mergedOptions);

    // Sync timeline range with others
    tlRef.current.on("rangechange", ({ start, end }) => {
      poolRef.current.forEach((tl) => {
        if (tl !== tlRef.current) {
          tl.setWindow(start, end, { animation: false });
        }
      });
    });

    // Register timeline instance
    register(tlRef.current);

    // Cleanup on unmount
    return () => {
      unregister(tlRef.current);
      tlRef.current.destroy();
    };
  }, [containerRef, groupKey, data, range, poolRef, register, unregister]); // 의존성 배열: 이 값들 중 하나라도 변경되면 useEffect 콜백이 다시 실행됩니다.

  // 생성된 타임라인 인스턴스에 대한 ref를 반환합니다.
  // 이 ref는 부모 컴포넌트(예: PointTimeline)에서 타임라인 인스턴스의 메서드를 직접 호출해야 할 때 유용합니다.
  return tlRef;
};
