import React from 'react';

export const ApplicationItem = ({ title, count }) => (
  <div className="flex items-center space-x-4 py-2">
    <div className="flex-1">
      <div className="flex flex-col items-start">
        <span className="text-gray-800 font-medium">{title}</span>
        <div className="text-xl font-semibold mt-1">{count}</div>
      </div>
    </div>
  </div>
);


