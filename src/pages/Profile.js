import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileScreen from '../components/Profile/ProfileScreen';
import { getAuth, signOut } from 'firebase/auth';
import 'bootstrap-icons/font/bootstrap-icons.css';

export const Profile = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  // Handle logout
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Clear user data from localStorage
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('onboardingSeen');
        
        // Redirect to the login page
        navigate('/singup');
      })
      .catch((error) => {
        console.error('Logout Error:', error);
      });
  };

  const handleChangeaccount = () => {
    navigate('/singup');
  }

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="p-4 space-y-3">
      <div className="top-4 left-4">
        <i onClick={handleBackClick} className="bi bi-arrow-left text-xl cursor-pointer"> Profile</i>
      </div>
      <ProfileScreen />
      {/* Logout button */}
      <button 
        onClick={handleChangeaccount} 
        className="mt-4 px-4 py-2 bg-[#1E1548] text-white rounded-full hover:bg-blue-600 transition-colors duration-300">
        Change Account
      </button>
      <button 
        onClick={handleLogout} 
        className="mt-4 px-4 py-2 bg-transparent border text-blue-950 rounded-full hover:bg-red-600 transition-colors duration-300">
        Delete Account
      </button>
    </div>
  );
};



