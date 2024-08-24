import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

const formatValue = (value) => {
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value, null, 2);  // Pretty print JSON for display
  }
  return value || 'Not Provided';
};

const ReviewScreen = ({ formData, onConfirm, onEdit }) => {
  const memoizedFormData = useMemo(() => (
    Object.entries(formData).map(([key, value]) => (
      <div key={key} className="mb-2">
        <strong className="font-semibold">{key}:</strong> {formatValue(value)}
      </div>
    ))
  ), [formData]);

  return (
    <div className="mt-8 py-3 space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-md">
        {memoizedFormData}
      </div>
      <div className="flex flex-col space-y-4">
        <button
          className="bg-[#1E1548] text-white py-2 px-4 rounded-full shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={onEdit}
          aria-label="Edit profile information"
        >
          Edit
        </button>
        <button
          className="bg-green-500 text-white py-2 px-4 rounded-full shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          onClick={onConfirm}
          aria-label="Confirm and set up profile"
        >
          Confirm and Set Up Profile
        </button>
      </div>
    </div>
  );
};

ReviewScreen.propTypes = {
  formData: PropTypes.object.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default ReviewScreen;



