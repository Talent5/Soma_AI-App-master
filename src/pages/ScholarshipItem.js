import React from 'react';

const ScholarshipItem = ({ logo, title, amount, deadline }) => {
  return (
    <div className="flex items-center p-4 border border-gray-200 rounded-lg shadow-md bg-white space-x-4">
      <img src={logo} alt={title} className="w-16 h-16 object-cover rounded-lg" />
      <div className="flex-1">
        <div className="text-lg font-semibold">{title}</div>
        <div className="text-gray-600 text-sm mt-1">
          <span className="font-medium">Amount:</span> ${amount}
          <span className="mx-2">·</span>
          <span className="font-medium">Deadline:</span> {deadline}
        </div>
      </div>
    </div>
  );
};

export default ScholarshipItem;


