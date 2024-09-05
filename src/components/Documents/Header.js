import React from 'react';
import { useState } from 'react';


const Header = ({ title, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value); // Call the onSearch prop function with the new search term
  };

  return (
    <header>
      <div className="text-2xl font-bold text-[#000000] p-4">
        {title}
      </div>
      <div className="px-4">
        <div className="flex items-center border border-[#f8eff8] rounded-full p-2">
          <i className="bi bi-search h-5 w-5 text-gray-600"></i>
          <input
            className="w-full border-none bg-transparent text-gray-700 text-sm px-2 py-1 rounded ml-2"
            placeholder="Search document"
            type="text"
            value={searchTerm}
            onChange={handleChange}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
