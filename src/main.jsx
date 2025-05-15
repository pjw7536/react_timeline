import React from "react";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TimelineProvider } from "./context/TimelineProvider";
import App from "./App";
import "./index.css";

const qc = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={qc}>
      <TimelineProvider>
        <App />
      </TimelineProvider>
    </QueryClientProvider>
  </StrictMode>
);
