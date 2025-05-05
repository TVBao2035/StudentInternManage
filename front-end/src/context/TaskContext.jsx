import React, { createContext, useContext } from "react";
import { useTaskAPI } from "../hooks/useTaskAPI";

const InternTaskContext = createContext();

export const useTaskAPIContext = () => useContext(InternTaskContext);

export const InternTaskProvider = ({ children, internId }) => {
  const internTaskData = useTaskAPI(internId);

  return (
    <InternTaskContext.Provider value={internTaskData}>
      {children}
    </InternTaskContext.Provider>
  );
};
