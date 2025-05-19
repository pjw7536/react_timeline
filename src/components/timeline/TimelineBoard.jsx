/*
  선택 EQP 기준 3종 타임라인 출력 (RUN / STEP / EVENT)
  – X축 공유 (TimelineProvider 가 자동 동기화)
*/
import React from "react"; // React 라이브러리 임포트
// 커스텀 훅 임포트: 각 타임라인에 필요한 데이터를 비동기적으로 가져옵니다.
import { useRunStatus } from "../../hooks/useRunStatus"; // 장비 가동 상태 데이터 훅
import { useStepStatus } from "../../hooks/useStepStatus"; // 공정 단계 상태 데이터 훅
import { useEventLog } from "../../hooks/useEventLog"; // 이벤트 로그 데이터 훅
// 타임라인 컴포넌트 임포트
import RangeTimeline from "./RangeTimeline"; // 범위(Range)를 표시하는 타임라인 컴포넌트
import PointTimeline from "./PointTimeline"; // 특정 시점(Point)을 표시하는 타임라인 컴포넌트
// 로딩 상태 표시 컴포넌트 임포트
import LoadingSpinner from "../common/LoadingSpinner";
// 유틸리티 함수 임포트: 모든 타임라인 데이터의 시간 범위를 계산합니다.
import { calcRange } from "../../utils/timelineUtils";

// TimelineBoard 컴포넌트 정의, eqpId를 props로 받습니다.
const TimelineBoard = ({ eqpId }) => {
  // 1. 데이터 가져오기 (React Query 훅 사용)
  // useRunStatus 훅을 사용하여 선택된 eqpId에 대한 가동 상태(run) 데이터를 가져옵니다.
  // 데이터는 run 변수에, 로딩 상태는 l1 변수에 저장됩니다. 데이터가 없으면 빈 배열([])을 기본값으로 사용합니다.
  const { data: run = [], isLoading: l1 } = useRunStatus(eqpId);
  // useStepStatus 훅을 사용하여 선택된 eqpId에 대한 공정 단계(step) 데이터를 가져옵니다.
  const { data: step = [], isLoading: l2 } = useStepStatus(eqpId);
  // useEventLog 훅을 사용하여 선택된 eqpId에 대한 이벤트(ev) 데이터를 가져옵니다.
  const { data: ev = [], isLoading: l3 } = useEventLog(eqpId);

  // 2. eqpId 유효성 검사 및 로딩 상태 처리
  // eqpId가 없으면 (선택되지 않았으면) 아무것도 렌더링하지 않습니다.
  if (!eqpId) return null;
  // 세 가지 데이터 중 하나라도 로딩 중이면 LoadingSpinner 컴포넌트를 보여줍니다.
  if (l1 || l2 || l3) return <LoadingSpinner />;

  // 3. 전체 시간 범위 계산
  // calcRange 유틸리티 함수를 사용하여 가져온 run, step, ev 데이터의 모든 시간 정보를 바탕으로
  // 세 타임라인이 공유할 최소(min) 및 최대(max) 시간 범위를 계산합니다.
  const range = calcRange(run, step, ev);

  // 4. 타임라인 렌더링
  // 계산된 range와 각 데이터를 props로 전달하여 3개의 타임라인 컴포넌트를 렌더링합니다.
  return (
    <div className="mt-6">
      {" "}
      {/* Tailwind CSS 클래스로 위쪽 마진을 줍니다. */}
      {/* RUN 상태를 표시하는 RangeTimeline */}
      <RangeTimeline groupKey="RUN" data={run} range={range} />
      {/* STEP 상태를 표시하는 RangeTimeline */}
      <RangeTimeline groupKey="STEP" data={step} range={range} />
      {/* EVENT 발생을 표시하는 PointTimeline */}
      <PointTimeline groupKey="EVENT" data={ev} range={range} />
    </div>
  );
};

export default TimelineBoard;
