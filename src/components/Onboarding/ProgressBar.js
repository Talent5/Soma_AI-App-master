import React from 'react';
import './ProgressBar.css'; // Ensure this file contains your CSS styles

export const ProgressBar = ({ currentStep, totalSteps }) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="progress-bar">
      <div
        className="progress"
        style={{ width: `${progressPercentage}%` }}
      ></div>
    </div>
  );
};



