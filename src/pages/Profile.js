import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileScreen from '../components/Profile/ProfileScreen';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap icons

export const Profile = () => {
  const navigate = useNavigate(); // Initialize navigate function

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="p-4 space-y-3">
      <div className=" top-4 left-4">
          <i onClick={handleBackClick} className= "bi bi-arrow-left text-xl p5-4 px-">Profile</i>
        
      </div>
      <ProfileScreen />
    </div>
  );
};

