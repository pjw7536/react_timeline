/* 선택 라인의 EQP 드롭다운 */
import React from "react";
import { useEquipments } from "../../hooks/useLineQueries";
import LoadingSpinner from "../common/LoadingSpinner";

const EqpSelector = ({ lineId, eqpId, setEqpId }) => {
  const { data: eqps = [], isLoading } = useEquipments(lineId, !!lineId);

  if (!lineId) return null;
  if (isLoading) return <LoadingSpinner />;

  return (
    <select
      value={eqpId ?? ""}
      onChange={(e) => setEqpId(Number(e.target.value))}
      className="border p-2 rounded w-full mt-2"
    >
      <option value="">EQP 선택…</option>
      {eqps.map((e) => (
        <option key={e.id} value={e.id}>
          {e.name}
        </option>
      ))}
    </select>
  );
};

export default EqpSelector;
