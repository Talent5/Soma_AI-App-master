import React from 'react';
import PropTypes from 'prop-types';

const ScholarshipItem = ({ logo, title, amount, deadline }) => {
  return (
    <div className="p-2 mb-2">
      <div className="flex items-center space-x-4">
        <img
          src={logo}
          alt={title}
          className="w-10 h-10 object-cover rounded-full"
        />
        <div className="flex-1">
          <div className="text-lg font-semibold truncate">{title}</div>
          <div className="text-gray-600 text-sm mt-1">
            <span className="font-medium">Amount:</span> ${amount}
            <span className="mx-2">·</span>
            <span className="font-medium">Deadline:</span> {deadline}
          </div>
        </div>
      </div>
    </div>
  );
};

ScholarshipItem.propTypes = {
  logo: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  deadline: PropTypes.string.isRequired,
};

export default ScholarshipItem;

