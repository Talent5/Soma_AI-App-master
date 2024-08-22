import React, { createContext, useState, useContext } from 'react';

const ProgressContext = createContext();

export const ProgressProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1); // Initialize with the first step

  return (
    <ProgressContext.Provider value={{ currentStep, setCurrentStep }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => useContext(ProgressContext);
