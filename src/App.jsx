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
    <>
      {" "}
      {/* BrowserRouter는 main.jsx에서 이미 적용되었습니다. */}
      <Navbar /> {/* Navbar를 모든 페이지 상단에 렌더링합니다. */}
      <div className="mx-auto w-full">
        <Routes>
          {" "}
          {/* Routes로 Route들을 감싸줍니다. */}
          <Route path="/" element={<HomePage />} /> {/* 기본 경로 설정 */}
          <Route path="/timeline" element={<TimelinePage />} />{" "}
          {/* /timeline 경로에 TimelinePage를 연결합니다. */}
          {/* 다른 라우트들을 이곳에 추가할 수 있습니다. */}
        </Routes>
      </div>
    </>
  );
}

export default App;
