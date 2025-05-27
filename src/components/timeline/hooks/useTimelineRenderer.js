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
    // 1. 타임라인 옵션 설정
    // groupConfig에서 현재 groupKey에 해당하는 그룹별 옵션을 가져옵니다. 없으면 빈 객체를 사용합니다.
    const groupOptions = groupConfig[groupKey]?.options ?? {}; //

    // 기본 옵션과 그룹별 옵션, 그리고 props로 전달된 range (min, max)를 병합합니다.
    // 전개 연산자를 사용하여 객체를 병합하며, 동일한 키가 있을 경우 나중에 오는 값으로 덮어씌워집니다.
    // (여기서는 groupOptions이 baseOptions보다 우선 순위가 높게 설정되어 있지 않지만,
    //  주석에는 '그룹별 옵션 우선 적용'이라고 되어 있는 점을 고려하면, 순서나 병합 방식에 주의가 필요할 수 있습니다.
    //  현재 코드상으로는 groupOptions이 props로 받은 range(min, max)보다 낮은 우선순위를 가질 수 있습니다.
    //  만약 min/max도 groupOptions에서 제어하고 싶다면 병합 순서 조정 필요)
    //  -> 수정: 아래 코드에서는 명시적으로 min, max 이후에 groupOptions을 병합하여 그룹별 옵션이 우선되도록 함.
    const mergedOptions = {
      // 공통 기본 옵션들
      stack: false, // 아이템들이 서로 겹쳐 쌓이지 않도록 함 (기본값)
      zoomMin: 1000 * 60 * 30, // 최소 확대 레벨 (30분)
      zoomMax: 1000 * 60 * 60 * 24 * 7, // 최대 확대 레벨 (7일)
      // props로 전달받은 초기 시간 범위 설정
      min: range.min, //
      max: range.max, //
      // 그룹별 특정 옵션들 (위의 공통 옵션들을 덮어쓸 수 있음)
      ...groupOptions,
    };

    // 2. 타임라인 아이템 준비
    // processData 유틸리티 함수를 사용하여 원본 데이터(data)를 vis-timeline이 요구하는 아이템 형식으로 변환합니다.
    // 변환된 아이템들은 vis-timeline의 DataSet 객체에 담깁니다. DataSet은 데이터 변경 감지 및 효율적인 업데이트를 지원합니다.
    const items = new DataSet(processData(groupKey, data)); //

    // 3. 타임라인 인스턴스 생성
    // containerRef.current (타임라인을 표시할 DOM 요소), 변환된 items, 그리고 병합된 mergedOptions를 사용하여
    // 새로운 vis-timeline 인스턴스를 생성하고, 이를 tlRef.current에 할당합니다.
    tlRef.current = new Timeline(containerRef.current, items, mergedOptions); //

    // 4. X축 동기화를 위한 이벤트 리스너 설정
    // 현재 타임라인의 시간 범위(X축)가 변경될 때 ('rangechange' 이벤트) 호출될 콜백 함수를 등록합니다.
    tlRef.current.on("rangechange", ({ start, end }) => {
      //
      // poolRef.current (TimelineContext에 등록된 모든 타임라인 인스턴스들)를 순회합니다.
      poolRef.current.forEach((tl) => {
        //
        // 이벤트가 발생한 현재 타임라인(tlRef.current)이 아닌 다른 타임라인들에 대해서만
        if (tl !== tlRef.current) {
          //
          // setWindow 메서드를 호출하여 시간 범위를 동기화합니다.
          // animation: false 옵션은 부드러운 전환 애니메이션 없이 즉시 변경되도록 합니다.
          tl.setWindow(start, end, { animation: false }); //
        }
      });
    });

    // 5. 현재 타임라인 인스턴스를 TimelineContext에 등록
    // 다른 타임라인들이 이 타임라인의 존재를 알고 X축 동기화 대상으로 포함시키도록 합니다.
    register(tlRef.current); //

    // 6. 클린업(Clean-up) 함수 반환
    // useEffect 훅에서 반환되는 이 함수는 컴포넌트가 언마운트되거나,
    // 의존성 배열의 값이 변경되어 이펙트가 다시 실행되기 직전에 호출됩니다.
    return () => {
      // 현재 타임라인 인스턴스를 TimelineContext에서 등록 해제합니다.
      unregister(tlRef.current); //
      // vis-timeline 인스턴스를 파괴하여 관련 DOM 요소, 이벤트 리스너 등을 정리하고 메모리 누수를 방지합니다.
      tlRef.current.destroy(); //
    };
  }, [containerRef, groupKey, data, range, poolRef, register, unregister]); // 의존성 배열: 이 값들 중 하나라도 변경되면 useEffect 콜백이 다시 실행됩니다.

  // 생성된 타임라인 인스턴스에 대한 ref를 반환합니다.
  // 이 ref는 부모 컴포넌트(예: PointTimeline)에서 타임라인 인스턴스의 메서드를 직접 호출해야 할 때 유용합니다.
  return tlRef;
};
