import React, { createContext, useState, useContext } from "react";

// "선택된 테이블 행" 상태를 전역에서 공유할 수 있게 해주는 Context입니다.
const SelectionContext = createContext();

// 이 훅을 사용하면 하위 컴포넌트에서 쉽게 선택 상태에 접근/설정할 수 있습니다.
export const useSelection = () => useContext(SelectionContext);

/**
 * SelectionProvider로 감싸면, 하위 컴포넌트에서
 * { selectedRow, setSelectedRow }를 사용할 수 있습니다.
 */
export const SelectionProvider = ({ children }) => {
  const [selectedRow, setSelectedRow] = useState(null);

  return (
    <SelectionContext.Provider value={{ selectedRow, setSelectedRow }}>
      {children}
    </SelectionContext.Provider>
  );
};
