// src/components/Applications/Completed.js
import React from 'react';
import placeholderImage from '../assets/logo192.png';

const Completed = ({ scholarships }) => {
  return (
    <div className="p-2 bg-white rounded-lg">
      {scholarships.length === 0 ? (
        <p className="text-gray-500">No completed scholarships available.</p>
      ) : (
        scholarships.map((scholarship) => (
          <div key={scholarship.id} className="p-2 border-b">
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

export default Completed;

