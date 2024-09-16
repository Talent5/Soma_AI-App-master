import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'; // Import Link
import placeholderImage from '../assets/logo192.png';

const ScholarshipItem = ({ id, logo, title, amount, deadline }) => {
  // Debugging line to check values

  if (!id) {
    console.error('ScholarshipItem is missing id:', { id, logo, title, amount, deadline });
    return null;
  }

  return (
    <Link to={`/scholarship/${id}`} className="block p-4 mb-4 border-b border-gray-300 hover:bg-gray-100">
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
        </div>
      </div>
    </Link>
  );
};

ScholarshipItem.propTypes = {
  id: PropTypes.string.isRequired, // Add the id prop for linking
  logo: PropTypes.string,
  title: PropTypes.string.isRequired,
  amount: PropTypes.string,
  deadline: PropTypes.string,
};

ScholarshipItem.defaultProps = {
  logo: '/placeholder-icon.png',
  amount: 'N/A',
  deadline: 'No deadline provided',
};

export default ScholarshipItem;


