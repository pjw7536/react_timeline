import React from "react";
import { useLines } from "../../hooks/useLineQueries"; // 경로 확인
import LoadingSpinner from "../common/LoadingSpinner"; // 경로 확인

/* 라인 선택 드롭다운 */
const LineSelector = ({ lineId, setLineId }) => {
  const { data: lines = [], isLoading } = useLines();

  if (isLoading) return <LoadingSpinner />;

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
        // 기본 화살표를 숨기고 커스텀 화살표를 위한 패딩을 확보하려면 appearance-none과 pr-8 등이 필요할 수 있습니다.
        // 여기서는 Tailwind 기본 스타일링을 우선합니다.
      >
        <option value="" className="text-slate-500 dark:text-slate-400">
          라인 선택…
        </option>
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
      {/* 커스텀 드롭다운 화살표 (선택사항) */}
      {/* <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700 dark:text-slate-300">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div> */}
    </div>
  );
};

export default LineSelector;
