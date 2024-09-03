import React from 'react';
import PropTypes from 'prop-types';
import 'bootstrap-icons/font/bootstrap-icons.css';

export const SearchFilters = ({ searchValue, setSearchValue, filter, setFilter }) => {
  return (
    <header className="bg-transparent">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Scholarships</h1>
      <div className="flex items-center ">
        <div className="flex items-center border border-{#A6AEB2} rounded-full p-2 shadow-sm">
          <i className="bi bi-search h-5 w-5 text-{#838F94}"></i>
          <input
            className="w-full border-none bg-transparent text-gray-700 text-sm px-2 py-1 rounded ml-2 focus:outline-none"
            placeholder="Search scholarship"
            aria-label="Search scholarship"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            type="text"
          />
        </div>
        <div className="flex space-x-4 ml-4">
          <span
            className="p-2 rounded-full border-0 cursor-pointer hover:bg-gray-100"
            onClick={() => setFilter('filter1')} // Example filter logic
          >
            <i className="bi bi-filter-left text-gray-600"></i>
          </span>
          <span
            className="p-2 rounded-full border-0 cursor-pointer hover:bg-gray-100"
            onClick={() => setFilter('funnel')}
          >
            <i className="bi bi-funnel text-gray-600"></i>
          </span>
        </div>
      </div>
    </header>
  );
};

SearchFilters.propTypes = {
  searchValue: PropTypes.string.isRequired,
  setSearchValue: PropTypes.func.isRequired,
  filter: PropTypes.string.isRequired,
  setFilter: PropTypes.func.isRequired,
};


