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

const DATA_TYPES = {
  RUN: "RUN",
  STEP: "STEP",
  EVENT: "EVENT",
};

const TimelinePage = () => {
  const [lineId, setLineId] = useState(null);
  const [eqpId, setEqpId] = useState(null);
  const [typeFilters, setTypeFilters] = useState({
    [DATA_TYPES.RUN]: true,
    [DATA_TYPES.STEP]: true,
    [DATA_TYPES.EVENT]: true,
  });

  const { data: runData = [], isLoading: l1 } = useRunStatus(eqpId);
  const { data: stepData = [], isLoading: l2 } = useStepStatus(eqpId);
  const { data: eventData = [], isLoading: l3 } = useEventLog(eqpId);

  const isLoading = l1 || l2 || l3;

  // 데이터 변환 로직 (이전과 동일)
  const combinedAndSortedData = useMemo(() => {
    if (isLoading || !eqpId) return [];
    const transformedRun = runData.map((item) => ({
      originalTimestamp: new Date(item.timestamp),
      displayTimestamp: new Date(item.timestamp).toLocaleString(),
      type: DATA_TYPES.RUN,
      info1: item.status,
      info2: "",
      info3: "",
    }));
    const transformedStep = stepData.map((item) => ({
      originalTimestamp: new Date(item.start_time),
      displayTimestamp: new Date(item.start_time).toLocaleString(),
      type: DATA_TYPES.STEP,
      info1: item.step,
      info2: item.ppid,
      info3: item.state,
    }));
    const transformedEvent = eventData.map((item) => ({
      originalTimestamp: new Date(item.occurred_at),
      displayTimestamp: new Date(item.occurred_at).toLocaleString(),
      type: DATA_TYPES.EVENT,
      info1: item.event_type,
      info2: item.comment,
      info3: "",
    }));
    const allData = [
      ...transformedRun,
      ...transformedStep,
      ...transformedEvent,
    ];
    allData.sort((a, b) => b.originalTimestamp - a.originalTimestamp);
    return allData;
  }, [runData, stepData, eventData, isLoading, eqpId]);

  // 필터링된 데이터 (이전과 동일)
  const filteredData = useMemo(() => {
    return combinedAndSortedData.filter((item) => typeFilters[item.type]);
  }, [combinedAndSortedData, typeFilters]);

  // 체크박스 핸들러 (이전과 동일)
  const handleFilterChange = (event) => {
    const { name, checked } = event.target;
    setTypeFilters((prevFilters) => ({ ...prevFilters, [name]: checked }));
  };

  // 타임라인 Range 계산 (이전과 동일)
  const range = useMemo(() => {
    if (isLoading || !eqpId) {
      const now = new Date();
      return { min: now, max: new Date(now.getTime() + 1000 * 60 * 60) };
    }
    if (
      runData.length === 0 &&
      stepData.length === 0 &&
      eventData.length === 0 &&
      !isLoading
    ) {
      const now = new Date();
      return { min: now, max: new Date(now.getTime() + 1000 * 60 * 60) };
    }
    return calcRange(runData, stepData, eventData);
  }, [runData, stepData, eventData, isLoading, eqpId]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 md:p-6">
      <div className="max-w-full mx-auto">
        {" "}
        {/* 페이지 전체 너비 사용 */}
        {/* 메인 컨텐츠 영역: 좌(설비 선택 + 타임라인), 우(필터 + 테이블) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* 왼쪽 컬럼: 설비 선택 및 타임라인 보드 */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-3">
            {/* 상단 제목 및 설비 선택 영역 */}
            <div className="p-6 bg-white dark:bg-slate-800 shadow-lg rounded-xl">
              <div className="flex items-center mb-5">
                <ChartBarIcon className="size-8 text-indigo-600 dark:text-indigo-400 dark:fill-current mr-3" />
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                  EQP 타임라인 뷰어
                </h1>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <LineSelector lineId={lineId} setLineId={setLineId} />
                <EqpSelector
                  lineId={lineId}
                  eqpId={eqpId}
                  setEqpId={setEqpId}
                />
              </div>
            </div>

            {/* 타임라인 보드 영역 */}
            {/* eqpId가 선택되었고 로딩이 끝나야 타임라인 보드를 보여줍니다. */}
            {eqpId && !isLoading && (
              <div className="bg-white dark:bg-slate-800 shadow-lg rounded-xl p-1 md:p-2 flex-grow">
                {" "}
                {/* flex-grow 추가 */}
                <TimelineBoard eqpId={eqpId} />
              </div>
            )}
            {/* eqpId 미선택 또는 초기 로딩 시 메시지 (왼쪽 컬럼 하단에 표시될 수 있음) */}
            {!eqpId && !isLoading && (
              <div className="text-center p-10 bg-white dark:bg-slate-800 shadow-lg rounded-xl flex-grow flex items-center justify-center">
                <p className="text-xl text-slate-600 dark:text-slate-400">
                  라인과 EQP를 선택하여 타임라인을 조회하세요.
                </p>
              </div>
            )}
            {isLoading && (
              <div className="flex-grow flex items-center justify-center">
                <LoadingSpinner />
              </div>
            )}
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
                <CombinedDataTable data={filteredData} />
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
