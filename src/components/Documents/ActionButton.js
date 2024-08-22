import React from 'react';

const ActionButton = ({ onClick }) => (
  <div
    className="fixed bottom-16 right-4 rounded-full bg-[#5e2a8b] w-14 h-14 flex items-center justify-center shadow-lg cursor-pointer z-10"
    onClick={onClick}
  >
    <i className="bi bi-plus text-white h-6 w-6"></i>
  </div>
);

export default ActionButton;

