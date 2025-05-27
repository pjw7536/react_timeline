import React, { createContext, useState, useContext } from "react";

const SelectionContext = createContext();

export const useSelection = () => useContext(SelectionContext);

export const SelectionProvider = ({ children }) => {
  const [selectedRow, setSelectedRow] = useState(null);

  return (
    <SelectionContext.Provider value={{ selectedRow, setSelectedRow }}>
      {children}
    </SelectionContext.Provider>
  );
};
