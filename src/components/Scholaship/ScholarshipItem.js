import React from 'react';
import PropTypes from 'prop-types';
import placeholderImage from '../assets/logo192.png';

const ScholarshipItem = ({ logo, title, amount, deadline, applicationLink, description, eligibility, score }) => {
  return (
    <div className="p-4 mb-4 border-b border-gray-300">
      <div className="flex items-start space-x-4">
        <img
          src={logo || placeholderImage}
          alt={title}
          className="w-16 h-16 object-cover rounded-full flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="text-xl font-semibold mb-2 break-words">{title}</div>
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
};

export default ScholarshipItem;





