// SearchBar.js
import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="flex items-center border rounded-full p-2 bg-white shadow-md mx-auto max-w-md"> {/* Centered and max-width for better alignment */}
      <i className="bi bi-search h-5 w-5 text-gray-500"></i>
      <input
        className="w-full border-none bg-transparent text-gray-700 text-sm px-2 py-1 rounded ml-2 focus:outline-none"
        placeholder="Search documents"
        type="text"
        value={searchTerm}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchBar;



