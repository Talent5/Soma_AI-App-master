// src/components/Applications/InProgress.js
import React from 'react';
import placeholderImage from '../assets/logo192.png';

const InProgress = ({ scholarships }) => {
  return (
    <div className="p-4">
      {scholarships.length === 0 ? (
        <p className="text-gray-500">No in-progress scholarships available.</p>
      ) : (
        scholarships.map((scholarship) => (
          <div key={scholarship.id} className="bg-white p-4 rounded-lg shadow-md mb-4">
            <div className="flex items-center">
              <img
                src={scholarship.logo || placeholderImage}
                alt={scholarship.title}
                className="w-12 h-12 mr-4"
              />
              <div>
                <h2 className="text-lg font-semibold">{scholarship.title}</h2>
                <p className="text-gray-600">Amount: {scholarship.amount}</p>
                <p className="text-gray-600">Deadline: {scholarship.deadline}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div> 
  );
};

export default InProgress;
