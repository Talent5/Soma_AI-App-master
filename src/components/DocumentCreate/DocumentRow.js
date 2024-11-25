import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export const DocumentRow = ({ id, fileName, date }) => {
  return (
    <div className="flex items-center p-4 rounded-lg hover:bg-gray-100 text-gray-700 text-sm cursor-pointer">
      <i className="bi bi-file-earmark-text text-primary  me-3" style={{ fontSize: '24px' }}></i>
      <p className="mb-0 text-truncate" style={{ maxWidth: '200px' }}>{fileName || 'Untitled'}</p>
      <p className="mb-0 text-muted">
        {date && date.toDate ? 
          date.toDate().toLocaleDateString(undefined, { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          }) 
          : 'No date available'}
      </p>
    </div>
  );
};

