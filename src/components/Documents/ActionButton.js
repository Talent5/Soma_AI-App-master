import React, { useState } from 'react';

const ActionButton = ({ onUploadClick, onCreateClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <div className="relative">
      <button
        className="fixed bottom-20 w-4  right-4 bg-[#1E1548] text-white p-4 rounded-lg shadow-lg"
        onClick={toggleDropdown}
      >
        <i className="bi bi-plus h-6 w-6"></i>
      </button>
      {isDropdownOpen && (
        <div className="absolute bottom-16 right-4 bg-white shadow-lg rounded-lg border border-gray-300 w-48">
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={onUploadClick}
          >
            <i className="bi bi-upload mr-2"></i> Upload Document
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={onCreateClick}
          >
            <i className="bi bi-file-earmark-text mr-2"></i> Create Document
          </button>
        </div>
      )}
    </div>
  );
};

export default ActionButton;




