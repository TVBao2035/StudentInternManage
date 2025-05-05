import React, { createContext, useContext } from "react";
import { useInternAPI } from "../hooks/useInternAPI";

const InternContext = createContext();

export const useInternContext = () => useContext(InternContext);

export const InternProvider = ({ children }) => {
  const internData = useInternAPI();

  return (
    <InternContext.Provider value={internData}>
      {children}
    </InternContext.Provider>
  );
};
