// ✅ 커스텀 훅 내보내기
import { createContext, useState, useContext } from "react";

const SelectionContext = createContext();

export const useSelection = () => useContext(SelectionContext);

export const SelectionProvider = ({ children }) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectionSource, setSelectionSource] = useState(null);

  const [selectedLineId, setSelectedLineId] = useState("");
  const [selectedSDWTId, setSelectedSDWTId] = useState("");
  const [selectedEQPId, setSelectedEQPId] = useState("");

  const selectRow = (rowId, source = null) => {
    setSelectedRow(rowId);
    setSelectionSource(source);
  };

  return (
    <SelectionContext.Provider
      value={{
        selectedRow,
        setSelectedRow: selectRow,
        selectionSource,
        selectedLineId,
        setSelectedLineId,
        selectedSDWTId,
        setSelectedSDWTId,
        selectedEQPId,
        setSelectedEQPId,
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
};
