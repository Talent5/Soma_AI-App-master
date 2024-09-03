import React from 'react';
import image from "../assets/logo192.png";

const placeholderImage = {image}; // URL of the placeholder image

export const ScholarshipCards = ({ scholarships }) => {
  return (
    <div className="space-y-4">
      {scholarships.map((scholarship) => (
        <div key={scholarship.id} className="p-4 flex items-start">
          <img
            src={scholarship.logo || placeholderImage}
            alt={scholarship.title}
            className="w-24 h-24 object-cover rounded-full mr-4"
          />
          <div>
            <h2 className="text-lg font-semibold">{scholarship.title}</h2>
            <p className="text-gray-600">Amount: ${scholarship.amount}</p>
            <p className="text-gray-600">Deadline: {new Date(scholarship.deadline).toLocaleDateString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
};






