// src/pages/TimelinePage.jsx
import React, { useState, useMemo } from "react";
import { useLogs } from "../hooks/useLogQueries";
import LineSelector from "../components/selectors/LineSelector";
import SDWTSelector from "../components/selectors/SDWTSelector";
import EqpSelector from "../components/selectors/EqpSelector";
import TimelineBoard from "../components/timeline/TimelineBoard";
import CombinedDataTable from "../components/tables/CombinedDataTable";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { makeItemId } from "../utils/timelineUtils";

const DATA_TYPES = {
  EQP: "EQP_LOG",
  TIP: "TIP_LOG",
  RACB: "RACB_LOG",
  CTTTM: "CTTTM_LOG",
};

export default function TimelinePage() {
  // ─── 1) 드릴다운 선택 상태
  const [lineId, setLineId] = useState(""); // ex) "L001"
  const [sdwtId, setSdwtId] = useState(""); // ex) "S001"
  const [eqpId, setEqpId] = useState(""); // ex) "E001"

  // ─── 2) 각 로그 타입별 필터 체크박스 상태
  const [typeFilters, setTypeFilters] = useState({
    [DATA_TYPES.EQP]: true,
    [DATA_TYPES.TIP]: true,
    [DATA_TYPES.RACB]: true,
    [DATA_TYPES.CTTTM]: true,
  });

  // ─── 3) useLogs 훅으로 한번에 모든 로그를 가져옴
  //     /logs?lineId=...&sdwtId=...&eqpId=...
  const enabled = Boolean(lineId && eqpId); // eqpId 선택 시에만 fetch
  const {
    data: logs = [],
    isLoading: logsLoading,
    isError: logsError,
  } = useLogs({ lineId, sdwtId, eqpId }, enabled);

  // ─── 4) 로딩/오류 처리
  if (logsError) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <p className="text-red-500">로그를 불러오는 중 오류가 발생했습니다.</p>
      </div>
    );
  }

  // ─── 5) “원본 로그 배열”을 logType별로 분리
  //      logs: Array<BaseLog>
  const logsByType = useMemo(() => {
    const grouped = {
      EQP_LOG: [],
      TIP_LOG: [],
      RACB_LOG: [],
      CTTTM_LOG: [],
    };
    for (const log of logs) {
      if (grouped[log.logType]) {
        grouped[log.logType].push(log);
      }
    }
    return grouped;
  }, [logs]);

  // ─── 6) 테이블용 “가공된 데이터 배열” 생성
  //     CombinedDataTable에 넘겨줄 shape:
  //     { id, displayTimestamp, logType, info1, info2, info3 }
  const tableData = useMemo(() => {
    if (!enabled || logsLoading) return [];
    return (
      logs
        .map((log) => {
          // id는 이미 백엔드가 “TIP_LOG-0, EQP_LOG-0, …” 형태로 내려줬으므로 그대로 사용 가능합니다.
          // displayTimestamp만 보기 좋게 포맷
          const ts = new Date(log.eventTime);
          return {
            id: log.id,
            displayTimestamp: ts.toLocaleString("ko-KR", { hour12: false }),
            logType: log.logType,
            info1: log.eventType,
            info2: log.operator || "-",
            info3: log.comment || "",
          };
        })
        //  최신순으로 정렬 (원한다면 오름차순/내림차순 바꿔주세요)
        .sort((a, b) => {
          return new Date(b.displayTimestamp) - new Date(a.displayTimestamp);
        })
        //  체크박스 필터링
        .filter((row) => typeFilters[row.logType])
    );
  }, [logs, logsLoading, enabled, typeFilters]);

  // ─── 7) 필터 체크박스 변경 핸들러
  const handleFilterChange = (e) => {
    const { name, checked } = e.target;
    setTypeFilters((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-120px)] gap-4 mt-4">
      {/* ──────────────────────────────────────────────────────────────────
          🟢 왼쪽 40% 영역: 선택기 + 체크박스 + 통합 로그 테이블
      ─────────────────────────────────────────────────────────────────── */}
      <div className="lg:w-[40%] flex flex-col gap-4 h-full">
        {/* ——— 상단: 타이틀 / Line→SDWT→EQP 드릴다운 / 체크박스 */}
        <div className="p-4 bg-white dark:bg-slate-800 shadow rounded-xl">
          <h2 className="text-lg font-bold mb-3 text-slate-900 dark:text-white">
            📊 EQP 타임라인 뷰어
          </h2>
          <div className="grid grid-cols-3 gap-2 mb-2">
            <LineSelector lineId={lineId} setLineId={setLineId} />
            <SDWTSelector
              lineId={lineId}
              sdwtId={sdwtId}
              setSdwtId={(id) => {
                setSdwtId(id);
                setEqpId(""); // SDWT 바뀌면 하위 EQP 초기화
              }}
            />
            <EqpSelector
              lineId={lineId}
              sdwtId={sdwtId}
              eqpId={eqpId}
              setEqpId={setEqpId}
            />
          </div>
          <div className="flex gap-3 flex-wrap">
            {Object.entries(DATA_TYPES).map(([key, val]) => (
              <label
                key={val}
                className="flex items-center gap-1 text-sm text-slate-700 dark:text-slate-300"
              >
                <input
                  type="checkbox"
                  name={val}
                  checked={typeFilters[val]}
                  onChange={handleFilterChange}
                  className="rounded border-gray-300 dark:border-slate-600"
                />
                {key}
              </label>
            ))}
          </div>
        </div>

        {/* ——— 중간: “통합 로그 테이블” */}
        <div className="flex-1 overflow-auto bg-white dark:bg-slate-800 shadow rounded-xl p-3">
          {!eqpId && !logsLoading ? (
            <p className="text-center text-slate-600 dark:text-slate-400">
              먼저 EQP를 선택해주세요.
            </p>
          ) : logsLoading ? (
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner />
            </div>
          ) : tableData.length === 0 ? (
            <p className="text-center text-slate-600 dark:text-slate-400">
              표시할 로그가 없습니다.
            </p>
          ) : (
            <CombinedDataTable data={tableData} />
          )}
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────
          🟢 오른쪽 60% 영역: 타임라인 전체 사용
      ─────────────────────────────────────────────────────────────────── */}
      <div className="lg:w-[60%] h-full overflow-auto bg-white dark:bg-slate-800 shadow rounded-xl p-4">
        {!eqpId && !logsLoading ? (
          <p className="text-center text-slate-600 dark:text-slate-400 py-20">
            타임라인을 표시하려면 EQP를 선택하세요.
          </p>
        ) : logsLoading ? (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner />
          </div>
        ) : (
          // logsByType를 통째로 TimelineBoard에 넘겨줍니다.
          <TimelineBoard dataMap={logsByType} />
        )}
      </div>
    </div>
  );
}
