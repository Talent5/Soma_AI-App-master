import React from 'react';

export const Metrics = ({ type, title, count, icon }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
          <i className={`bi ${icon} text-gray-600`}></i>
        </div>
        <div>
          <h3 className="text-sm text-gray-600">{title}</h3>
          <p className="text-xl font-semibold">{count}</p>
        </div>
      </div>
      <i className="bi bi-chevron-right text-gray-400"></i>
    </div>
  );
};





