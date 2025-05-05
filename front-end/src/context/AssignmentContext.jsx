import React, { createContext, useContext } from "react";
import { useAssignmentAPI } from "../hooks/useAssignmentAPI";

const AssignmentContext = createContext();

export const useAssignmentContext = () => useContext(AssignmentContext);

export const AssignmentProvider = ({ children }) => {
  const assignmentData = useAssignmentAPI();
  return (
    <AssignmentContext.Provider value={assignmentData}>
      {children}
    </AssignmentContext.Provider>
  );
};
