import React, { useState } from "react";
import LineSelector from "./components/selectors/LineSelector";
import EqpSelector from "./components/selectors/EqpSelector";
import TimelineBoard from "./components/timeline/TimelineBoard";

function App() {
  const [lineId, setLineId] = useState(null);
  const [eqpId, setEqpId] = useState(null);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📈 EQP 타임라인 뷰어</h1>

      <LineSelector lineId={lineId} setLineId={setLineId} />
      <EqpSelector lineId={lineId} eqpId={eqpId} setEqpId={setEqpId} />

      {/* 선택된 EQP 타임라인 */}
      <TimelineBoard eqpId={eqpId} />
    </div>
  );
}

export default App;
