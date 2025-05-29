import React from "react";
import { useEquipments } from "../../hooks/useLineQueries";
import LoadingSpinner from "../common/LoadingSpinner";

/**
 * 선택된 라인(lineId)에 연결된 설비(EQP) 목록을 드롭다운으로 보여주는 컴포넌트입니다.
 * - lineId가 없으면 드롭다운이 비활성화됩니다.
 * - 장비 선택 시 setEqpId를 통해 상위 컴포넌트로 선택값이 전달됩니다.
 */
const EqpSelector = ({ lineId, eqpId, setEqpId }) => {
  // lineId가 있을 때만 해당 라인의 EQP 목록을 가져옵니다.
  // data: EQP 배열, isLoading: 로딩중 여부
  const { data: eqps = [], isLoading } = useEquipments(lineId, !!lineId);

  // 라인이 선택되지 않은 경우: 비활성화된 드롭다운만 표시
  if (!lineId)
    return (
      <select
        disabled
        className={
          "w-full appearance-none block px-3 py-2.5 border border-slate-300 dark:border-slate-600 " +
          "rounded-lg shadow-sm placeholder-slate-400 dark:placeholder-slate-500 " +
          "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 " +
          "text-sm text-slate-500 dark:text-slate-400 " +
          "bg-slate-100 dark:bg-slate-800 cursor-not-allowed " +
          "transition duration-150 ease-in-out"
        }
      >
        <option value="">EQP 선택…</option>
      </select>
    );

  // 로딩 중일 때: 스피너 표시
  if (isLoading) return <LoadingSpinner />;

  // 정상 데이터 표시
  return (
    <div className="relative">
      <select
        value={eqpId ?? ""}
        onChange={(e) => setEqpId(Number(e.target.value))}
        disabled={!lineId || eqps.length === 0}
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
          }`
        }
      >
        {/* 기본 옵션 */}
        <option value="" className="text-slate-500 dark:text-slate-400">
          EQP 선택…
        </option>
        {/* 해당 라인에 EQP가 없을 때 안내 메시지 */}
        {eqps.length === 0 && lineId && (
          <option
            value=""
            disabled
            className="text-slate-500 dark:text-slate-400"
          >
            해당 라인에 EQP가 없습니다.
          </option>
        )}
        {/* EQP 목록을 옵션으로 렌더링 */}
        {eqps.map((e) => (
          <option
            key={e.id}
            value={e.id}
            className="dark:bg-slate-700 dark:text-slate-100 text-slate-500 bg-white"
          >
            {e.name}
          </option>
        ))}
      </select>
      {/* (추후 커스텀 드롭다운 화살표 아이콘을 추가할 수 있습니다.) */}
    </div>
  );
};

export default EqpSelector;
