import React from 'react';

export const Metrics = ({ type, title, count }) => {
  const iconClass = {
    matched: 'bi bi-check-square-fill text-green-500',
    deadline: 'bi bi-clock text-blue-500',
    saved: 'bi bi-folder text-yellow-500',
  }[type];

  return (
    <div className="flex items-center space-x-4 py-2">
      <i className={`${iconClass} text-3xl`}></i>
      <div className="flex-1">
        <div className="flex flex-col items-start">
          <span className="text-gray-800 font-medium">{title}</span>
          <div className="text-xl font-semibold mt-1">{count}</div>
        </div>
      </div>
    </div>
  );
};





