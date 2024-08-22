import React from 'react';

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center p-4 text-gray-600">
    <i className="bi bi-file-earmark-text h-12 w-12 text-gray-400"></i>
    <p className="text-lg mt-2">You have no documents here, click the button below to create one.</p>
  </div>
);

export default EmptyState;

