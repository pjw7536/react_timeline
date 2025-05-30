import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import TimelinePage from "./pages/TimelinePage";

/**
 * 앱의 메인 컴포넌트입니다.
 * - 항상 상단에 Navbar(네비게이션 바)를 보여줍니다.
 * - / (홈) 및 /timeline (타임라인 페이지) 라우팅을 지원합니다.
 */
const HomePage = () => (
  <div className="p-6 text-center">
    <h1 className="text-2xl font-bold">홈페이지에 오신 것을 환영합니다!</h1>
    <p>네비게이션 바에서 타임라인 탭을 선택하여 EQP 타임라인을 확인하세요.</p>
  </div>
);

function App() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* 항상 상단에 표시되는 네비게이션 바 */}
      <Navbar />
      {/* 아래쪽 영역(페이지 본문) */}
      <div className="flex-1 overflow-hidden px-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/timeline" element={<TimelinePage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
