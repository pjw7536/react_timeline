import React from "react";
import { Routes, Route } from "react-router-dom"; // Routes와 Route를 임포트합니다.
import Navbar from "./components/common/Navbar"; // Navbar 컴포넌트를 임포트합니다.
import TimelinePage from "./pages/TimelinePage"; // TimelinePage 컴포넌트를 임포트합니다.
// 홈페이지용 간단한 컴포넌트 (필요에 따라 수정하거나 별도 파일로 분리)
const HomePage = () => (
  <div className="p-6 text-center">
    <h1 className="text-2xl font-bold">홈페이지에 오신 것을 환영합니다!</h1>
    <p>네비게이션 바에서 타임라인 탭을 선택하여 EQP 타임라인을 확인하세요.</p>
  </div>
);

function App() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/timeline" element={<TimelinePage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
