import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className="fixed top-4 left z-10">
      <button
        className="bg-transparent border-none cursor-pointer"
        onClick={handleBack}
        aria-label="Go back"
      >
        <i className="bi bi-arrow-left text-black p-2 text-2xl"></i>
      </button>
    </div>
  );
};

export default BackButton;
