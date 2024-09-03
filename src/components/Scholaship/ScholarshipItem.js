import React from 'react';
import PropTypes from 'prop-types';

const ScholarshipItem = ({ logo, title, amount, deadline }) => {
  return (
    <div className="p-2 mb-2 border-b-2">
      <div className="flex items-center space-x-4">
        <img
          src={logo || '/placeholder-icon.png'}
          alt={title}
          className="w-10 h-10 object-cover rounded-full"
        />
        <div className="flex-1">
          <div className="text-lg font-semibold truncate">{title}</div>
          <div className="text-black-600 text-sm mt-1">
            <span className="font-medium">Amount:</span> ${amount ? amount.toLocaleString() : 'N/A'}
            <span className="mx-2">·</span>
            <span className="font-medium">Deadline:</span> {deadline || 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
};

ScholarshipItem.propTypes = {
  logo: PropTypes.string,
  title: PropTypes.string.isRequired,
  amount: PropTypes.number,
  deadline: PropTypes.string,
};

ScholarshipItem.defaultProps = {
  amount: null,
  deadline: 'No deadline provided',
};

export default ScholarshipItem;




