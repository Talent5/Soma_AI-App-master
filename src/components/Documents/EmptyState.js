import React from 'react';

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-6 mt-6">
      <div className="text-3xl mb-4">📄</div>
      <p className="text-center text-gray-600">
        You have no documents here, click the button below to create one.
      </p>
    </div>
  );
};

export default EmptyState;



