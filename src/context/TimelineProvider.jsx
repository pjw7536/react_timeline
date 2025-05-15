import React from "react";
import { createContext, useRef } from "react";

export const TimelineContext = createContext(null);

/* 모든 타임라인 X축 동기화 */
export const TimelineProvider = ({ children }) => {
  const poolRef = useRef([]);

  const register = (tl) => (poolRef.current = [...poolRef.current, tl]);
  const unregister = (tl) =>
    (poolRef.current = poolRef.current.filter((t) => t !== tl));

  return (
    <TimelineContext.Provider value={{ poolRef, register, unregister }}>
      {children}
    </TimelineContext.Provider>
  );
};
