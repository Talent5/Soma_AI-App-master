import React from 'react';
import { useNavigate } from 'react-router-dom';

const ReviewScreen = ({ formData, onConfirm, onEdit }) => {
  useNavigate();

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div className="mt-8 py-3 space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-md">
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} className="mb-2">
            <strong className="font-semibold">{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : value || 'Not Provided'}
          </div>
        ))}
      </div>
      <div className="flex flex-col space-y-4">
        <button
          className="bg-[#1E1548] text-white py-2 px-4 rounded-full shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={onEdit}
        >
          Edit
        </button>
        <button
          className="bg-green-500 text-white py-2 px-4 rounded-full shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          onClick={handleConfirm}
        >
          Confirm and Set Up Profile
        </button>
      </div>
    </div>
  );
};

export default ReviewScreen;



