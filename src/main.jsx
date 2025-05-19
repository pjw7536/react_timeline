import React from "react";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TimelineProvider } from "./context/TimelineProvider";
import { BrowserRouter } from "react-router-dom"; // 라우터 임포트
import App from "./App";
import "./index.css";

const qc = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={qc}>
      <TimelineProvider>
        <BrowserRouter>
          {" "}
          {/* App을 BrowserRouter로 감싸줍니다. */}
          <App />
        </BrowserRouter>
      </TimelineProvider>
    </QueryClientProvider>
  </StrictMode>
);
