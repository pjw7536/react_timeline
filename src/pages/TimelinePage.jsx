// src/pages/TimelinePage.jsx
import React, { useState, useMemo } from "react";
import LineSelector from "../components/selectors/LineSelector";
import EqpSelector from "../components/selectors/EqpSelector";
import TimelineBoard from "../components/timeline/TimelineBoard";
import CombinedDataTable from "../components/tables/CombinedDataTable";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useEqpStatusLog } from "../hooks/useEqpStatusLog";
import { useTipLog } from "../hooks/useTIPLog";
import { useRacbLog } from "../hooks/useRacbLog";
import { useCtttmLog } from "../hooks/useCTTTMLog";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import SDWTSelector from "../components/selectors/SDWTSelector";
import { makeItemId } from "../utils/timelineUtils"; // 파일 위치에 따라 경로 조정

const DATA_TYPES = {
  EQP: "EQP_LOG",
  TIP: "TIP_LOG",
  RACB: "RACB_LOG",
  CTTTM: "CTTTM_LOG",
};

const TimelinePage = () => {
  const [lineId, setLineId] = useState(null);
  const [eqpId, setEqpId] = useState(null);
  const [sdwtId, setSdwtId] = useState(null);
  const [typeFilters, setTypeFilters] = useState({
    [DATA_TYPES.EQP]: true,
    [DATA_TYPES.TIP]: true,
    [DATA_TYPES.RACB]: true,
    [DATA_TYPES.CTTTM]: true,
  });

  const { data: runData = [], isLoading: l1 } = useEqpStatusLog(eqpId);
  const { data: stepData = [], isLoading: l2 } = useTipLog(eqpId);
  const { data: eventData = [], isLoading: l3 } = useRacbLog(eqpId);
  const { data: ctttmData = [], isLoading: l4 } = useCtttmLog(eqpId); // ⬅️ 추가
  const isLoading = l1 || l2 || l3 || l4;

  const combinedAndSortedData = useMemo(() => {
    if (isLoading || !eqpId) return [];

    const transformedRun = runData.map((item) => ({
      id: makeItemId(DATA_TYPES.EQP, item.timestamp),
      originalTimestamp: new Date(item.timestamp),
      displayTimestamp: new Date(item.timestamp).toLocaleString(),
      type: DATA_TYPES.EQP,
      info1: item.status,
      info2: "",
      info3: "",
    }));

    const transformedStep = stepData.map((item) => ({
      id: makeItemId(DATA_TYPES.TIP, item.start_time),
      originalTimestamp: new Date(item.start_time),
      displayTimestamp: new Date(item.start_time).toLocaleString(),
      type: DATA_TYPES.TIP,
      info1: item.step,
      info2: item.ppid,
      info3: item.state,
    }));

    const transformedEvent = eventData.map((item) => ({
      id: makeItemId(DATA_TYPES.RACB, item.occurred_at),
      originalTimestamp: new Date(item.occurred_at),
      displayTimestamp: new Date(item.occurred_at).toLocaleString(),
      type: DATA_TYPES.RACB,
      info1: item.event_type,
      info2: item.comment,
      info3: "",
    }));

    const transformedCTTTM = ctttmData.map((item) => ({
      id: makeItemId(DATA_TYPES.CTTTM, item.occurred_at),
      originalTimestamp: new Date(item.occurred_at),
      displayTimestamp: new Date(item.occurred_at).toLocaleString(),
      type: DATA_TYPES.CTTTM,
      info1: item.event_type,
      info2: item.comment,
      info3: "",
    }));

    const allData = [
      ...transformedRun,
      ...transformedStep,
      ...transformedEvent,
      ...transformedCTTTM, // ✅ 추가
    ];

    allData.sort((a, b) => b.originalTimestamp - a.originalTimestamp);
    return allData;
  }, [runData, stepData, eventData, isLoading, eqpId]);

  const filteredData = useMemo(() => {
    return combinedAndSortedData.filter((item) => typeFilters[item.type]);
  }, [combinedAndSortedData, typeFilters]);

  const handleFilterChange = (event) => {
    const { name, checked } = event.target;
    setTypeFilters((prev) => ({ ...prev, [name]: checked }));
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-120px)] gap-4 mt-4">
      {/* 좌측: 필터/선택/테이블 포함 */}
      <div className="lg:w-[40%] flex flex-col gap-4 h-full">
        {/* 상단 UI (타이틀 + 선택기 + 체크박스) */}
        <div className="p-4 bg-white dark:bg-slate-800 shadow rounded-xl">
          <h2 className="text-lg font-bold mb-3 text-slate-900 dark:text-white">
            📊 EQP 타임라인 뷰어
          </h2>
          <div className="grid grid-cols-3 gap-2 mb-2">
            <LineSelector lineId={lineId} setLineId={setLineId} />
            <SDWTSelector
              lineId={lineId}
              sdwtId={sdwtId}
              setSdwtId={setSdwtId}
            />
            <EqpSelector
              lineId={lineId}
              sdwtId={sdwtId}
              eqpId={eqpId}
              setEqpId={setEqpId}
            />
          </div>
          <div className="flex gap-3 flex-wrap">
            {Object.keys(DATA_TYPES).map((typeKey) => (
              <label
                key={typeKey}
                className="flex items-center gap-1 text-sm text-slate-700 dark:text-slate-300"
              >
                <input
                  type="checkbox"
                  name={DATA_TYPES[typeKey]}
                  checked={typeFilters[DATA_TYPES[typeKey]]}
                  onChange={handleFilterChange}
                  className="rounded border-gray-300 dark:border-slate-600"
                />
                {typeKey}
              </label>
            ))}
          </div>
        </div>

        {/* 통합 로그 테이블 */}
        <div className="flex-1 overflow-auto bg-white dark:bg-slate-800 shadow rounded-xl p-3">
          {eqpId && !isLoading ? (
            <CombinedDataTable data={filteredData} />
          ) : !eqpId ? (
            <p className="text-center text-slate-600 dark:text-slate-400">
              EQP를 선택하세요.
            </p>
          ) : (
            <LoadingSpinner />
          )}
        </div>
      </div>

      {/* 우측: 타임라인 전체 사용 */}
      <div className="lg:w-[60%] h-full overflow-auto bg-white dark:bg-slate-800 shadow rounded-xl p-4">
        {eqpId && !isLoading ? (
          <TimelineBoard eqpId={eqpId} />
        ) : !eqpId ? (
          <p className="text-center text-slate-600 dark:text-slate-400 py-20">
            타임라인을 표시하려면 EQP를 선택하세요.
          </p>
        ) : (
          <LoadingSpinner />
        )}
      </div>
    </div>
  );
};

export default TimelinePage;
