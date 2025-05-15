/* 라인 선택 드롭다운 */
import React from "react";
import { useLines } from "../../hooks/useLineQueries";
import LoadingSpinner from "../common/LoadingSpinner";

const LineSelector = ({ lineId, setLineId }) => {
  const { data: lines = [], isLoading } = useLines();

  if (isLoading) return <LoadingSpinner />;

  return (
    <select
      value={lineId ?? ""}
      onChange={(e) => setLineId(Number(e.target.value))}
      className="border p-2 rounded w-full"
    >
      <option value="">라인 선택…</option>
      {lines.map((l) => (
        <option key={l.id} value={l.id}>
          {l.name}
        </option>
      ))}
    </select>
  );
};

export default LineSelector;
