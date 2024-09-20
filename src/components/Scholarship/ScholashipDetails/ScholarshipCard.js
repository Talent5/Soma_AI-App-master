import React from 'react';
import ScholarshipDetailContent from './ScholarshipDetailContent';

const ScholarshipCard = ({ scholarship, handleApply }) => {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <div className="p-4">
        <ScholarshipDetailContent 
          scholarship={scholarship}
          handleApply={handleApply}
        />
      </div>
    </div>
  );
};

export default ScholarshipCard;