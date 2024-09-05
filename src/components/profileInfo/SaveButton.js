import React from 'react';

const SaveButton = ({ onClick }) => (
  <button
    className="w-full bg-indigo-900 text-white py-3 px-4 rounded-md hover:bg-indigo-800 transition duration-300 ease-in-out text-lg font-semibold"
    onClick={onClick}
  >
    Save changes
  </button>
);

export default SaveButton;
