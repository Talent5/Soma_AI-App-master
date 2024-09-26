import React from 'react';

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 flex items-center w-screen bg-white shadow-md z-10 p-2 overflow-x-auto whitespace-nowrap">
      {/* Menu Button */}
      <button
        type="button"
        aria-label="Menu"
        className="text-blue-700 hover:bg-blue-100 p-2 rounded mr-4"
      >
        <i className="bi bi-list" style={{ fontSize: '20px' }}></i>
      </button>

      {/* Docs Button */}
      <button
        type="button"
        aria-label="Docs"
        className="text-blue-700 p-2 rounded"
      >
        <i className="bi bi-file-earmark-text" style={{ fontSize: '20px' }}></i>
      </button>

      <h1 className="ml-2 text-gray-700 text-xl">Docs</h1>

      {/* Search Bar */}
      <div className="ml-auto flex items-center h-10 px-2 bg-gray-100 text-gray-700 rounded-lg focus-within:text-gray-600 focus-within:shadow-md">
        {/* Search Icon */}
        <button
          type="button"
          aria-label="Search"
          className="text-gray-700"
        >
          <i className="bi bi-search" style={{ fontSize: '20px' }}></i>
        </button>
        <input
          type="text"
          placeholder='Search'
          className='flex-grow px-2 text-base bg-transparent outline-none'
        />
      </div>

      {/* Grid Button */}
      <button
        type="button"
        aria-label="Grid"
        className="text-blue-700 hover:bg-blue-100 p-2 rounded ml-4"
      >
        <i className="bi bi-grid" style={{ fontSize: '20px' }}></i>
      </button>
    </header>
  );
};









