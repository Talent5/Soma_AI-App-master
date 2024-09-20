import React from 'react';

const ErrorDisplay = ({ error, onRetry }) => {
  return (
    <div className="max-w-2xl mx-auto mt-8 p-4">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
      <button 
        onClick={onRetry} 
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Retry
      </button>
      <p className="mt-4 text-sm text-gray-600">
        If the problem persists, please try the following:
        <ul className="list-disc list-inside mt-2">
          <li>Check your internet connection</li>
          <li>Clear your browser cache and cookies</li>
          <li>Try accessing the page in an incognito/private browsing window</li>
          <li>If none of the above work, the server might be temporarily unavailable. Please try again later.</li>
        </ul>
      </p>
    </div>
  );
};

export default ErrorDisplay;