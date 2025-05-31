// src/context/SelectionContext.jsx

import React, { createContext, useState, useContext } from "react";
const SelectionContext = createContext();

export const useSelection = () => useContext(SelectionContext);

export const SelectionProvider = ({ children }) => {
  const [selectedRow, setSelectedRow] = useState(null);
  // ✅ 추가: 선택 출처 관리
  const [selectionSource, setSelectionSource] = useState(null); // "table" or "timeline"

  // 확장된 setter
  const selectRow = (rowId, source = null) => {
    setSelectedRow(rowId);
    setSelectionSource(source);
  };

  return (
    <SelectionContext.Provider
      value={{ selectedRow, setSelectedRow: selectRow, selectionSource }}
    >
      {children}
    </SelectionContext.Provider>
  );
};
