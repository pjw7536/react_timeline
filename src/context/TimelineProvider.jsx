import React from "react"; // React 라이브러리 임포트
import { createContext, useRef } from "react"; // React Context와 useRef 훅 임포트

// 1. TimelineContext 생성
export const TimelineContext = createContext(null);
// TimelineContext는 Provider와 Consumer를 통해 데이터를 공유할 수 있게 해줍니다.
// 초기값은 null로 설정되어 있습니다.

/* 모든 타임라인 X축 동기화 */
// 2. TimelineProvider 컴포넌트 정의
export const TimelineProvider = ({ children }) => {
  // 3. poolRef 생성
  const poolRef = useRef([]);
  // poolRef는 여러 타임라인 인스턴스(vis-timeline 객체들)를 저장하는 배열입니다.
  // useRef를 사용하여 이 배열의 참조값이 컴포넌트 리렌더링 시에도 유지되도록 합니다.
  // .current 프로퍼티를 통해 실제 배열에 접근합니다.

  // 4. register 함수 정의
  const register = (tl) => (poolRef.current = [...poolRef.current, tl]);
  // register 함수는 새로운 타임라인 인스턴스(tl)를 poolRef 배열에 추가합니다.
  // 기존 배열을 복사하고 새로운 타임라인을 추가하여 불변성을 유지하려고 시도합니다.
  // (참고: useRef의 .current를 직접 수정하는 것은 리렌더링을 유발하지 않으므로,
  //  이 방식의 불변성 유지가 React 상태 관리 패턴과 정확히 일치하지는 않을 수 있지만,
  //  여기서는 참조 배열을 업데이트하는 데 사용됩니다.)

  // 5. unregister 함수 정의
  const unregister = (tl) =>
    (poolRef.current = poolRef.current.filter((t) => t !== tl));
  // unregister 함수는 특정 타임라인 인스턴스(tl)를 poolRef 배열에서 제거합니다.
  // filter 메서드를 사용하여 해당 인스턴스를 제외한 새 배열을 만듭니다.

  // 6. TimelineContext.Provider 반환
  return (
    <TimelineContext.Provider value={{ poolRef, register, unregister }}>
      {/* TimelineContext.Provider를 통해 자식 컴포넌트들에게 value 객체를 제공합니다.
        value 객체는 poolRef, register 함수, unregister 함수를 포함합니다.
        자식 컴포넌트들은 useContext(TimelineContext)를 사용하여 이 값들에 접근할 수 있습니다.
      */}
      {children}
      {/* {children}은 TimelineProvider 컴포넌트로 감싸진 모든 자식 컴포넌트들을 의미합니다.
        예: <TimelineProvider><App /></TimelineProvider> 라면 App 컴포넌트가 children이 됩니다.
      */}
    </TimelineContext.Provider>
  );
};
