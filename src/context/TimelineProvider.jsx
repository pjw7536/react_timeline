// src/context/TimelineProvider.jsx
import React from "react"; // React 라이브러리 임포트
import { createContext, useRef } from "react"; // React Context와 useRef 훅 임포트

// 1. TimelineContext 생성
// TimelineContext는 여러 타임라인 컴포넌트 간에 상태(여기서는 타임라인 인스턴스 목록)를 공유하고,
// 이들 간의 상호작용(여기서는 X축 동기화)을 가능하게 하는 메커니즘을 제공합니다.
// 초기값은 null로 설정하며, Provider를 통해 실제 값을 하위 컴포넌트에 전달합니다.
export const TimelineContext = createContext(null);

/*
  TimelineProvider 컴포넌트:
  애플리케이션 내의 모든 vis-timeline 인스턴스들을 관리하여
  X축(시간 범위, 확대/축소 상태)을 동기화하는 역할을 합니다.
  - poolRef: 모든 타임라인 인스턴스들을 저장하는 배열에 대한 참조입니다.
             useRef를 사용하여 컴포넌트 리렌더링 간에도 이 참조를 유지합니다.
  - register: 새로운 타임라인 인스턴스를 poolRef에 추가하는 함수입니다.
              타임라인 컴포넌트가 마운트될 때 호출됩니다.
  - unregister: 특정 타임라인 인스턴스를 poolRef에서 제거하는 함수입니다.
                타임라인 컴포넌트가 언마운트될 때 호출됩니다.
  이러한 값들은 Context의 value prop을 통해 하위 컴포넌트(주로 useTimelineRenderer 훅)에 전달됩니다.
*/
export const TimelineProvider = ({ children }) => {
  // 3. poolRef 생성
  // poolRef는 여러 타임라인 인스턴스(vis-timeline 객체들)를 저장하는 배열입니다.
  // useRef를 사용하여 이 배열의 참조값이 컴포넌트 리렌더링 시에도 유지되도록 합니다.
  // .current 프로퍼티를 통해 실제 배열에 접근합니다.
  // 각 타임라인은 생성될 때 이 pool에 자신을 등록하고, 파괴될 때 등록을 해제합니다.
  const poolRef = useRef([]);

  // 4. register 함수 정의
  // register 함수는 새로운 타임라인 인스턴스(tl)를 poolRef 배열에 추가합니다.
  // 전개 연산자(...)를 사용하여 기존 배열을 복사하고 새로운 타임라인을 추가함으로써
  // poolRef.current 배열을 불변성을 유지하며 업데이트합니다. (엄밀히는 ref 자체는 mutable 객체)
  // 이 함수는 각 타임라인 컴포넌트가 초기화될 때 호출되어,
  // TimelineProvider가 모든 활성 타임라인을 추적할 수 있도록 합니다.
  const register = (tl) => (poolRef.current = [...poolRef.current, tl]);

  // 5. unregister 함수 정의
  // unregister 함수는 특정 타임라인 인스턴스(tl)를 poolRef 배열에서 제거합니다.
  // filter 메서드를 사용하여 해당 인스턴스를 제외한 새 배열을 만들어 poolRef.current를 업데이트합니다.
  // 이 함수는 각 타임라인 컴포넌트가 소멸(destroy)되기 전에 호출되어,
  // 더 이상 존재하지 않는 타임라인에 대한 참조를 제거하고 메모리 누수를 방지합니다.
  const unregister = (tl) =>
    (poolRef.current = poolRef.current.filter((t) => t !== tl));

  // 6. TimelineContext.Provider 반환
  // TimelineContext.Provider를 통해 자식 컴포넌트들에게 value 객체를 제공합니다.
  // value 객체는 poolRef (모든 타임라인 인스턴스 목록에 대한 참조),
  // register 함수, unregister 함수를 포함합니다.
  // 자식 컴포넌트들은 useContext(TimelineContext)를 사용하여 이 값들에 접근할 수 있습니다.
  // 이를 통해 타임라인들은 서로의 존재를 인지하고 상호작용할 수 있게 됩니다 (예: X축 동기화).
  return (
    <TimelineContext.Provider value={{ poolRef, register, unregister }}>
      {/* {children}은 TimelineProvider 컴포넌트로 감싸진 모든 자식 컴포넌트들을 의미합니다.
          예: <TimelineProvider><App /></TimelineProvider> 라면 App 컴포넌트가 children이 됩니다.
          이 자식 컴포넌트들 내에서 useContext(TimelineContext)를 통해 제공된 값들을 사용할 수 있습니다.
      */}
      {children}
    </TimelineContext.Provider>
  );
};
