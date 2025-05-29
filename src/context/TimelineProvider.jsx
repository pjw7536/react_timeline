import React, { createContext, useRef } from "react";

/**
 * TimelineProvider: 여러 타임라인 인스턴스(vis-timeline 객체)를 공유 관리하는 컨텍스트입니다.
 * - poolRef: 타임라인 인스턴스(객체)들의 배열을 참조 (동기화, 해제 등에서 사용)
 * - register: 타임라인 생성 시 pool에 추가
 * - unregister: 타임라인 파괴 시 pool에서 제거
 */
export const TimelineContext = createContext(null);

export const TimelineProvider = ({ children }) => {
  // 타임라인 인스턴스(객체)들의 배열 (리렌더에도 값 유지)
  const poolRef = useRef([]);

  // 타임라인 인스턴스 추가
  const register = (tl) => (poolRef.current = [...poolRef.current, tl]);
  // 타임라인 인스턴스 제거
  const unregister = (tl) =>
    (poolRef.current = poolRef.current.filter((t) => t !== tl));

  return (
    <TimelineContext.Provider value={{ poolRef, register, unregister }}>
      {children}
    </TimelineContext.Provider>
  );
};
