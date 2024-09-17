// src/components/Header.js
import React from 'react';

const Header = ({ activeTab, setActiveTab }) => {
  return (
    <div className="text-left mb-4">
      <h1 className="text-2xl font-bold">Application</h1>
      <nav className="flex flex-row gap-0 space-x-2 mt-4">
        <button
          className={`p-2 pb-3 ${activeTab === 'in_progress' ? 'border-b border-blue-950 text-blue-500' : 'text-black'}`}
          onClick={() => setActiveTab('in_progress')}
        >
          In Progress
        </button>
        <button
          className={`p-2 pb-3 ${activeTab === 'completed' ? 'border-b-4 border-blue-950 text-blue-500' : 'text-black'}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed
        </button>
      </nav>
    </div>
  );
};

export default Header;

