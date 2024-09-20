import React from 'react';
import PropTypes from 'prop-types';
import 'bootstrap-icons/font/bootstrap-icons.css';

export const SearchFilters = ({ searchValue, setSearchValue, openFilterModal }) => {
  return (
    <header className="bg-transparent mb-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Scholarships</h1>
      <div className="flex items-center space-x-4">
        <div className="flex items-center border border-gray-300 rounded-full p-2 shadow-sm">
          <i className="bi bi-search h-5 w-5 text-gray-500"></i>
          <input
            className="w-full border-none bg-transparent text-gray-700 text-sm px-2 py-1 rounded ml-2 focus:outline-none"
            placeholder="Search scholarship"
            aria-label="Search scholarship"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            type="text"
          />
        </div>
        <div className="flex space-x-4">
          <span
            className="p-2 rounded-full border-0 cursor-pointer hover:bg-gray-100"
            onClick={openFilterModal}  // Call openFilterModal when clicked
          >
            <i className="bi bi-sort-down text-gray-600"></i>
          </span>
          <span className="p-2 rounded-full border-0 cursor-pointer hover:bg-gray-100">
            <i className="bi bi-filter-left text-gray-600"></i>
          </span>
        </div>
      </div>
    </header>
  );
};

SearchFilters.propTypes = {
  searchValue: PropTypes.string.isRequired,
  setSearchValue: PropTypes.func.isRequired,
  openFilterModal: PropTypes.func.isRequired, // Marked as required
};




