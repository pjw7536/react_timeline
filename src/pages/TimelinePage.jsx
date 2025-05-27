// src/pages/TimelinePage.jsx
import React, { useState, useMemo } from "react";
import LineSelector from "../components/selectors/LineSelector";
import EqpSelector from "../components/selectors/EqpSelector";
import TimelineBoard from "../components/timeline/TimelineBoard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import CombinedDataTable from "../components/tables/CombinedDataTable";
import { useRunStatus } from "../hooks/useRunStatus";
import { useStepStatus } from "../hooks/useStepStatus";
import { useEventLog } from "../hooks/useEventLog";
import { ChartBarIcon } from "@heroicons/react/24/outline";

// 데이터 타입 상수 정의
const DATA_TYPES = {
  RUN: "EQP_STATUS", // 설비 실행 상태
  STEP: "TIP_STATUS", // 공정 단계
  EVENT: "EQP_INTERLOCK", // 이벤트 로그
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

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-6 overflow-hidden">
      <div className="h-full max-w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 h-full">
          {/* 왼쪽 컬럼: 설비 선택 및 타임라인 보드 */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-2 min-h-0">
            {/* 상단 제목 및 설비 선택 영역 */}
            <div className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-slate-200 dark:border-slate-700 flex-shrink-0">
              {/* 타이틀 영역 */}
              <div className="flex items-center mb-3">
                <div className="bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-xl mr-4">
                  <ChartBarIcon className="size-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
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
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-3">
            {/* 데이터 필터 카드 */}
            <div className="p-6 bg-white dark:bg-slate-800 shadow-lg rounded-xl">
              <h4 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-100">
                데이터 필터
              </h4>
              <div className="space-y-2">
                {Object.keys(DATA_TYPES).map((typeKey) => (
                  <label
                    key={typeKey}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name={DATA_TYPES[typeKey]}
                      checked={typeFilters[DATA_TYPES[typeKey]]}
                      onChange={handleFilterChange}
                      className="h-5 w-5 rounded border-slate-300 dark:border-slate-600 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-slate-700 dark:checked:bg-indigo-500 dark:focus:ring-offset-slate-800"
                    />
                    <span className="text-slate-700 dark:text-slate-300 select-none">
                      {typeKey}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* 통합 데이터 로그 카드 */}
            {/* eqpId가 선택되었고 로딩이 끝나야 테이블을 보여줍니다. */}
            {eqpId && !isLoading && (
              <div className="bg-white dark:bg-slate-800 shadow-lg rounded-xl overflow-hidden flex-grow min-h-[400px]">
                {" "}
                {/* 최소 높이 및 flex-grow */}
                <div className="overflow-auto max-h-96">
                  <CombinedDataTable data={filteredData} />
                </div>
              </div>
            )}
            {/* EQP 선택 안됐거나 로딩중일 때 오른쪽 패널에 플레이스홀더 역할 */}
            {(!eqpId || isLoading) && (
              <div className="bg-white dark:bg-slate-800 shadow-lg rounded-xl flex-grow min-h-[400px] flex items-center justify-center">
                {!eqpId && !isLoading && (
                  <p className="text-slate-600 dark:text-slate-400">
                    EQP 선택 시 데이터 표시
                  </p>
                )}
                {isLoading && <LoadingSpinner />}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelinePage;
