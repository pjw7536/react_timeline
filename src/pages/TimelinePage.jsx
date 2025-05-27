// src/pages/TimelinePage.jsx
import React, { useState, useEffect, useMemo } from "react";
import LineSelector from "../components/selectors/LineSelector";
import EqpSelector from "../components/selectors/EqpSelector";
import TimelineBoard from "../components/timeline/TimelineBoard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import CombinedDataTable from "../components/tables/CombinedDataTable";
import { useRunStatus } from "../hooks/useRunStatus";
import { useStepStatus } from "../hooks/useStepStatus";
import { useEventLog } from "../hooks/useEventLog";
import { calcRange } from "../utils/timelineUtils";
import { ChartBarIcon } from "@heroicons/react/24/outline";

// 데이터 타입 상수 정의
const DATA_TYPES = {
  RUN: "RUN", // 설비 실행 상태
  STEP: "STEP", // 공정 단계
  EVENT: "EVENT", // 이벤트 로그
};

const TimelinePage = () => {
  // 상태 관리
  const [lineId, setLineId] = useState(null); // 선택된 라인 ID
  const [eqpId, setEqpId] = useState(null); // 선택된 설비 ID
  const [typeFilters, setTypeFilters] = useState({
    // 데이터 타입별 필터 상태
    [DATA_TYPES.RUN]: true,
    [DATA_TYPES.STEP]: true,
    [DATA_TYPES.EVENT]: true,
  });

  // 각 데이터 타입별 API 호출 및 로딩 상태
  const { data: runData = [], isLoading: l1 } = useRunStatus(eqpId);
  const { data: stepData = [], isLoading: l2 } = useStepStatus(eqpId);
  const { data: eventData = [], isLoading: l3 } = useEventLog(eqpId);

  const isLoading = l1 || l2 || l3; // 전체 로딩 상태

  // 데이터 변환 및 통합 로직
  const combinedAndSortedData = useMemo(() => {
    if (isLoading || !eqpId) return [];

    // RUN 데이터 변환
    const transformedRun = runData.map((item) => ({
      originalTimestamp: new Date(item.timestamp),
      displayTimestamp: new Date(item.timestamp).toLocaleString(),
      type: DATA_TYPES.RUN,
      info1: item.status,
      info2: "",
      info3: "",
    }));

    // STEP 데이터 변환
    const transformedStep = stepData.map((item) => ({
      originalTimestamp: new Date(item.start_time),
      displayTimestamp: new Date(item.start_time).toLocaleString(),
      type: DATA_TYPES.STEP,
      info1: item.step,
      info2: item.ppid,
      info3: item.state,
    }));

    // EVENT 데이터 변환
    const transformedEvent = eventData.map((item) => ({
      originalTimestamp: new Date(item.occurred_at),
      displayTimestamp: new Date(item.occurred_at).toLocaleString(),
      type: DATA_TYPES.EVENT,
      info1: item.event_type,
      info2: item.comment,
      info3: "",
    }));

    // 모든 데이터 통합 및 시간순 정렬
    const allData = [
      ...transformedRun,
      ...transformedStep,
      ...transformedEvent,
    ];
    allData.sort((a, b) => b.originalTimestamp - a.originalTimestamp);
    return allData;
  }, [runData, stepData, eventData, isLoading, eqpId]);

  // 필터링된 데이터 계산
  const filteredData = useMemo(() => {
    return combinedAndSortedData.filter((item) => typeFilters[item.type]);
  }, [combinedAndSortedData, typeFilters]);

  // 필터 체크박스 변경 핸들러
  const handleFilterChange = (event) => {
    const { name, checked } = event.target;
    setTypeFilters((prevFilters) => ({ ...prevFilters, [name]: checked }));
  };

  // 타임라인 시간 범위 계산
  const range = useMemo(() => {
    // 로딩 중이거나 설비가 선택되지 않은 경우 기본 범위 반환
    if (isLoading || !eqpId) {
      const now = new Date();
      return { min: now, max: new Date(now.getTime() + 1000 * 60 * 60) };
    }

    // 데이터가 없는 경우 기본 범위 반환
    if (
      runData.length === 0 &&
      stepData.length === 0 &&
      eventData.length === 0 &&
      !isLoading
    ) {
      const now = new Date();
      return { min: now, max: new Date(now.getTime() + 1000 * 60 * 60) };
    }

    // 실제 데이터 기반 범위 계산
    return calcRange(runData, stepData, eventData);
  }, [runData, stepData, eventData, isLoading, eqpId]);

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-6 overflow-hidden">
      <div className="h-full max-w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 h-full">
          {/* 왼쪽 컬럼: 설비 선택 및 타임라인 보드 */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4 min-h-0">
            {/* 상단 제목 및 설비 선택 영역 */}
            <div className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-slate-200 dark:border-slate-700 flex-shrink-0">
              {/* 타이틀 영역 */}
              <div className="flex items-center mb-6">
                <div className="bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-xl mr-4">
                  <ChartBarIcon className="size-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                  EQP 타임라인 뷰어
                </h1>
              </div>
              {/* 라인/설비 선택기 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <LineSelector lineId={lineId} setLineId={setLineId} />
                <EqpSelector
                  lineId={lineId}
                  eqpId={eqpId}
                  setEqpId={setEqpId}
                />
              </div>
            </div>

            {/* 타임라인 보드 영역 - overflow-auto 적용 */}
            <div className="flex-1 min-h-0 overflow-auto">
              {eqpId && !isLoading ? (
                <div className="h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl rounded-2xl p-3 md:p-4 border border-slate-200 dark:border-slate-700">
                  <TimelineBoard eqpId={eqpId} />
                </div>
              ) : !eqpId && !isLoading ? (
                <div className="h-full text-center p-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl rounded-2xl flex items-center justify-center border border-slate-200 dark:border-slate-700">
                  <div className="max-w-md">
                    <ChartBarIcon className="size-16 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
                    <p className="text-xl text-slate-600 dark:text-slate-400">
                      라인과 EQP를 선택하여 타임라인을 조회하세요.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl rounded-2xl">
                  <LoadingSpinner />
                </div>
              )}
            </div>
          </div>

          {/* 오른쪽 컬럼: 필터 및 통합 데이터 로그 */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4 min-h-0">
            {/* 데이터 타입 필터 카드 */}
            <div className="p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-slate-200 dark:border-slate-700 flex-shrink-0">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  데이터 필터
                </h4>
              </div>
              {/* 필터 체크박스 그룹을 수평으로 배치 */}
              <div className="flex flex-wrap gap-3">
                {Object.keys(DATA_TYPES).map((typeKey) => (
                  <label
                    key={typeKey}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      name={DATA_TYPES[typeKey]}
                      checked={typeFilters[DATA_TYPES[typeKey]]}
                      onChange={handleFilterChange}
                      className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-slate-700 dark:checked:bg-indigo-500 dark:focus:ring-offset-slate-800"
                    />
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300 select-none group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {typeKey}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* 통합 데이터 테이블 - overflow-auto 적용 */}
            <div className="flex-1 min-h-0 overflow-auto">
              {eqpId && !isLoading ? (
                <div className="h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden">
                  <CombinedDataTable data={filteredData} />
                </div>
              ) : (
                <div className="h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl rounded-2xl flex items-center justify-center">
                  {!eqpId && !isLoading ? (
                    <p className="text-slate-600 dark:text-slate-400">
                      EQP 선택 시 데이터 표시
                    </p>
                  ) : (
                    <LoadingSpinner />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelinePage;
