import React from "react";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TimelineProvider } from "./context/TimelineProvider";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { SelectionProvider } from "./context/SelectionContext";
import "./index.css";

// React Query의 전역 클라이언트(캐시 등)
const qc = new QueryClient();

/**
 * 프로젝트의 최상위 엔트리포인트입니다.
 * - StrictMode: React 개발용 경고/검사를 강화합니다.
 * - QueryClientProvider: React Query 전역 상태 제공
 * - TimelineProvider: 타임라인 동기화 컨텍스트 제공
 * - BrowserRouter: 라우팅 기능 제공
 * - App: 실제 앱 화면 (Navbar 및 각 페이지)
 */
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={qc}>
      <TimelineProvider>
        <SelectionProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </SelectionProvider>
      </TimelineProvider>
    </QueryClientProvider>
  </StrictMode>
);
