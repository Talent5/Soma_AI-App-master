import React from 'react';
import PropTypes from 'prop-types';

const ScholarshipItem = ({ logo, title, amount, deadline, applicationLink, description, eligibility, score }) => {
  return (
    <div className="p-4 mb-4 border border-gray-300 rounded-lg shadow-md">
      <div className="flex items-center space-x-4">
        <img
          src={logo || '/placeholder-icon.png'}
          alt={title}
          className="w-16 h-16 object-cover rounded-full"
        />
        <div className="flex-1">
          <div className="text-xl font-semibold truncate mb-2">{title}</div>
          <div className="text-gray-700 text-sm mb-2">
            <span className="font-medium">Amount:</span> {amount || 'N/A'}
            <span className="mx-2">·</span>
            <span className="font-medium">Deadline:</span> {deadline || 'N/A'}
          </div>
          {applicationLink && (
            <a
              href={applicationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Apply Here
            </a>
          )}
          <div className="text-gray-700 mt-2">
            <p><strong>Description:</strong> {description || 'No description available'}</p>
            <p><strong>Eligibility:</strong> {eligibility || 'No eligibility information available'}</p>
            <p><strong>Score:</strong> {score != null ? score.toFixed(2) : 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

ScholarshipItem.propTypes = {
  logo: PropTypes.string,
  title: PropTypes.string.isRequired,
  amount: PropTypes.string,
  deadline: PropTypes.string,
  applicationLink: PropTypes.string,
  description: PropTypes.string,
  eligibility: PropTypes.string,
  score: PropTypes.number,
};

ScholarshipItem.defaultProps = {
  logo: '/placeholder-icon.png',
  amount: 'N/A',
  deadline: 'No deadline provided',
  applicationLink: '',
  description: 'No description available',
  eligibility: 'No eligibility information available',
  score: 0,
};

export default ScholarshipItem;




