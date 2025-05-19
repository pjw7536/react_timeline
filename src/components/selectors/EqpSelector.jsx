import React from "react";
import { useEquipments } from "../../hooks/useLineQueries"; // 경로 확인
import LoadingSpinner from "../common/LoadingSpinner"; // 경로 확인

/* 선택 라인의 EQP 드롭다운 */
const EqpSelector = ({ lineId, eqpId, setEqpId }) => {
  const { data: eqps = [], isLoading } = useEquipments(lineId, !!lineId);

  // lineId가 선택되지 않았을 때 표시하지 않음 (TimelinePage.jsx에서 이미 처리 중일 수 있음)
  // 여기서는 로딩 상태만 처리하고, lineId가 없을 때 메시지를 띄우는 로직은 TimelinePage에 위임합니다.
  if (!lineId)
    return (
      <select
        disabled
        className={
          "w-full appearance-none block px-3 py-2.5 border border-slate-300 dark:border-slate-600 " +
          "rounded-lg shadow-sm placeholder-slate-400 dark:placeholder-slate-500 " +
          "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 " +
          "text-sm text-slate-500 dark:text-slate-400 " + // 비활성화 시 텍스트 색상
          "bg-slate-100 dark:bg-slate-800 cursor-not-allowed " + // 비활성화 시 배경 및 커서
          "transition duration-150 ease-in-out"
        }
      >
        <option value="">EQP 선택…</option>
      </select>
    );

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="relative">
      <select
        value={eqpId ?? ""}
        onChange={(e) => setEqpId(Number(e.target.value))}
        disabled={!lineId || eqps.length === 0} // 라인이 선택되지 않았거나 EQP 목록이 없으면 비활성화
        className={
          "w-full appearance-none block px-3 py-2.5 border border-slate-300 dark:border-slate-600 " +
          "rounded-lg shadow-sm placeholder-slate-400 dark:placeholder-slate-500 " +
          "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 " +
          "text-sm text-slate-900 dark:text-slate-100 " +
          "bg-white dark:bg-slate-700 " +
          "transition duration-150 ease-in-out " +
          `${
            !lineId || eqps.length === 0
              ? "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed"
              : ""
          }` // 비활성화 스타일
        }
      >
        <option value="" className="text-slate-500 dark:text-slate-400">
          EQP 선택…
        </option>
        {eqps.length === 0 && lineId && (
          <option
            value=""
            disabled
            className="text-slate-500 dark:text-slate-400"
          >
            해당 라인에 EQP가 없습니다.
          </option>
        )}
        {eqps.map((e) => (
          <option
            key={e.id}
            value={e.id}
            className="dark:bg-slate-700 dark:text-slate-100"
          >
            {e.name}
          </option>
        ))}
      </select>
      {/* 커스텀 드롭다운 화살표 (선택사항, 위 LineSelector와 동일한 SVG 사용 가능) */}
    </div>
  );
};

export default EqpSelector;
