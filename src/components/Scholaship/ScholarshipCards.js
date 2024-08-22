import React from 'react';
import ScholarshipItem from './ScholarshipItem';

const ScholarshipCards = ({ scholarships }) => {
  return (
    <div className="bg-white p-2 rounded-lg max-w-full">
      {scholarships.length > 0 ? (
        scholarships.map((scholarship, index) => (
          <div key={scholarship.title + index}>
            <ScholarshipItem
              logo={scholarship.logo || '/placeholder-icon.png'}
              title={scholarship.title}
              amount={scholarship.amount}
              deadline={scholarship.deadline}
            />
            {index < scholarships.length - 1 && (
              <hr className="border-t border-gray-600 my-4" />
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-600">No scholarships found.</p>
      )}
    </div>
  );
};

export default ScholarshipCards;




