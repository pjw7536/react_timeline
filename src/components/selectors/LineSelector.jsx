import React from "react";
import { useLines } from "../../hooks/useLineQueries";
import LoadingSpinner from "../common/LoadingSpinner";

/**
 * 라인(line) 목록을 드롭다운으로 표시하고,
 * 선택된 라인 ID를 setLineId로 상위에 전달합니다.
 */
const LineSelector = ({ lineId, setLineId }) => {
  // 라인 목록 데이터와 로딩상태 가져오기
  const { data: lines = [], isLoading } = useLines();

  // 로딩 중엔 스피너 표시
  if (isLoading) return <LoadingSpinner />;

  // 드롭다운 표시
  return (
    <div className="relative">
      <select
        value={lineId ?? ""}
        onChange={(e) => setLineId(Number(e.target.value))}
        className={
          "w-full appearance-none block px-3 py-2.5 border border-slate-300 dark:border-slate-600 " +
          "rounded-lg shadow-sm placeholder-slate-400 dark:placeholder-slate-500 " +
          "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 " +
          "text-sm text-slate-900 dark:text-slate-100 " +
          "bg-white dark:bg-slate-700 " +
          "transition duration-150 ease-in-out"
        }
      >
        {/* 기본 안내 옵션 */}
        <option value="" className="text-slate-500 dark:text-slate-400">
          라인 선택…
        </option>
        {/* 라인 목록을 옵션으로 표시 */}
        {lines.map((l) => (
          <option
            key={l.id}
            value={l.id}
            className="dark:bg-slate-700 dark:text-slate-100 text-slate-500 bg-white"
          >
            {l.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LineSelector;
