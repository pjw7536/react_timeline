// src/components/selectors/SDWTSelector.jsx
import React from "react";
import { useSDWTQueries } from "../../hooks/useSDWTQueries";
import LoadingSpinner from "../common/LoadingSpinner";

const SDWTSelector = ({ lineId, sdwtId, setSdwtId }) => {
  const { data: sdwts = [], isLoading } = useSDWTQueries(lineId);

  if (!lineId)
    return (
      <select
        disabled
        className={
          "w-full appearance-none block px-3 py-1.5 border border-slate-300 dark:border-slate-600 " +
          "rounded-lg shadow-sm placeholder-slate-400 dark:placeholder-slate-500 " +
          "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 " +
          "text-sm text-slate-500 dark:text-slate-400 " +
          "bg-slate-100 dark:bg-slate-800 cursor-not-allowed " +
          "transition duration-150 ease-in-out"
        }
      >
        <option>SDWT 선택…</option>
      </select>
    );

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="relative">
      <select
        value={sdwtId ?? ""}
        onChange={(e) => setSdwtId(e.target.value)}
        className={
          "w-full appearance-none block px-3 py-1.5 border border-slate-300 dark:border-slate-600 " +
          "rounded-lg shadow-sm placeholder-slate-400 dark:placeholder-slate-500 " +
          "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 " +
          "text-sm text-slate-900 dark:text-slate-100 " +
          "bg-white dark:bg-slate-700 " +
          "transition duration-150 ease-in-out"
        }
      >
        <option value="">SDWT 선택…</option>
        {sdwts.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SDWTSelector;
