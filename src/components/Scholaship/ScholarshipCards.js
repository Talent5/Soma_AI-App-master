import React from 'react';
import placeholderImage from "../assets/logo192.png";

export const ScholarshipCards = ({ scholarships }) => {
  return (
    <div className="space-y-4">
      {scholarships.map((scholarship) => (
        <div key={scholarship.id} className="p-4 flex items-start border border-gray-300 rounded-lg shadow-md">
          <img
            src={scholarship.logo || placeholderImage}
            alt={scholarship.title}
            className="w-24 h-24 object-cover rounded-full mr-4"
          />
          <div>
            <h2 className="text-lg font-semibold mb-2">{scholarship.title}</h2>
            <p className="text-gray-600 mb-1">
              <span className="font-medium">Amount:</span> {scholarship.amount || 'N/A'}
            </p>
            <p className="text-gray-600 mb-1">
              <span className="font-medium">Deadline:</span> {scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString() : 'No deadline'}
            </p>
            {scholarship.application_link && (
              <a
                href={scholarship.application_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Apply Here
              </a>
            )}
            <p className="text-gray-600 mt-2">
              <strong>Description:</strong> {scholarship.description || 'No description available'}
            </p>
            <p className="text-gray-600">
              <strong>Eligibility:</strong> {scholarship.eligibility || 'No eligibility information available'}
            </p>
            <p className="text-gray-600">
              <strong>Score:</strong> {scholarship.score != null ? scholarship.score.toFixed(2) : 'N/A'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};






