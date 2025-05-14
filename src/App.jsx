//src/App.jsx

import React from "react";
import TimelineChart from "./components/TimelineChart";
import "./index.css";

function App() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        Unified Timeline for Groups A, B, C
      </h1>
      <TimelineChart />
    </div>
  );
}

export default App;
