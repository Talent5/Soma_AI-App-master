// src/components/ApplicationCard.js
import React from 'react';

const ApplicationCard = ({ scholarship }) => {
  const deadline = scholarship.deadline ? (
    scholarship.deadline.toDate ? (
      scholarship.deadline.toDate().toLocaleDateString()
    ) : (
      new Date(scholarship.deadline).toLocaleDateString()
    )
  ) : 'No deadline';

  return (
    <div className="p-4 bg-white shadow rounded-lg flex items-center space-x-4">
      <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0">
        {scholarship.logo ? (
          <img src={scholarship.logo} alt="Logo" className="w-full h-full object-cover rounded-full" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">Logo</div>
        )}
      </div>
      <div className="flex-grow">
        <h2 className="text-lg font-semibold">{scholarship.title}</h2>
        <p className="text-sm text-gray-500">Amount: ${scholarship.amount?.toLocaleString()}</p>
        <p className="text-sm text-gray-500">Deadline: {deadline}</p>
      </div>
    </div>
  );
};

export default ApplicationCard;

