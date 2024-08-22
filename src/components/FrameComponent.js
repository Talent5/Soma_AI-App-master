import PropTypes from 'prop-types';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useState } from 'react';

const FrameComponent = ({ searchValue, setSearchValue, filter, setFilter, className = '' }) => {
  return (
    <header className={`p-4 shadow-md rounded-lg ${className}`}>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Scholarships</h1>
      <div className="flex items-center justify-between mb-4">
        <div className="relative flex-1 max-w-xs">
          <input
            className="p-2 pl-8 border rounded-lg w-full"
            placeholder="Search scholarship"
            aria-label="Search scholarship"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          {searchValue === '' && (
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
              <i className="bi bi-search"></i>
            </span>
          )}
        </div>
        <div className="flex space-x-4 ml-4">
          <span
            className="p-2 rounded-full border border-gray-300 cursor-pointer hover:bg-gray-100"
            onClick={() => setFilter('filter1')} // Update filter logic as needed
          >
            <i className="bi bi-filter-left text-gray-600"></i>
          </span>
          <span
            className="p-2 rounded-full border border-gray-300 cursor-pointer hover:bg-gray-100"
            onClick={() => setFilter('sort')}
          >
            <i className="bi bi-sort-alpha-down text-gray-600"></i>
          </span>
          <span
            className="p-2 rounded-full border border-gray-300 cursor-pointer hover:bg-gray-100"
            onClick={() => setFilter('funnel')}
          >
            <i className="bi bi-funnel text-gray-600"></i>
          </span>
        </div>
      </div>
    </header>
  );
};

FrameComponent.propTypes = {
  searchValue: PropTypes.string.isRequired,
  setSearchValue: PropTypes.func.isRequired,
  filter: PropTypes.string.isRequired,
  setFilter: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default FrameComponent;









