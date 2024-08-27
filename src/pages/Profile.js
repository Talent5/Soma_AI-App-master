import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import ProfileScreen from '../components/Profile/ProfileScreen';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap icons

export const Profile = () => {
  const navigate = useNavigate(); // Initialize navigate function

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="p-4">
      <div className="flex ">
        <button
          onClick={handleBackClick}
          className="bg-transparent border-none cursor-pointer text-xl"
        >
          <i className="bi bi-arrow-left text-xl font-semibold ml-2">Profile</i>
        </button>
      </div>
      <ProfileScreen />
    </div>
  );
};

