// src/components/DrillDownSelector.jsx
import React, { useState, useEffect } from "react";
import LineSelector from "./selectors/LineSelector";
import SDWTSelector from "./selectors/SDWTSelector";
import EqpSelector from "./selectors/EqpSelector";

/**
 * 드릴다운 선택 컴포넌트
 * - Line → SDWT → EQP 순으로 선택
 * - 선택 상태는 로컬에서 관리하고, onChange로 외부에 전달
 */
const DrillDownSelector = ({ onChange }) => {
  const [lineId, setLineId] = useState("");
  const [sdwtId, setSdwtId] = useState("");
  const [eqpId, setEqpId] = useState("");

  // 선택이 바뀔 때마다 상위 컴포넌트로 전달
  useEffect(() => {
    onChange({ lineId, sdwtId, eqpId });
  }, [lineId, sdwtId, eqpId]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <LineSelector
        lineId={lineId}
        setLineId={(id) => {
          setLineId(id);
          setSdwtId(""); // 하위 선택 초기화
          setEqpId("");
        }}
      />
      <SDWTSelector
        lineId={lineId}
        sdwtId={sdwtId}
        setSdwtId={(id) => {
          setSdwtId(id);
          setEqpId("");
        }}
      />
      <EqpSelector
        lineId={lineId}
        sdwtId={sdwtId}
        eqpId={eqpId}
        setEqpId={setEqpId}
      />
    </div>
  );
};

export default DrillDownSelector;
