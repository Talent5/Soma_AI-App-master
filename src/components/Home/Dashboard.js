import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Metrics } from './Metrics';
import { Applications } from './Applications';
import { db } from '../config/firebase'; // Import the Firestore configuration
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore functions

export const Dashboard = () => {
  const [userName, setUserName] = useState('James'); // Default to "James"
  const [profilePicture, setProfilePicture] = useState(null); // State for profile picture
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('userId'); // Retrieve userId from local storage
        if (userId) {
          const userDocRef = doc(db, 'users', userId);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserName(userData.firstName || 'James'); // Set the user's first name or default to "James"
            if (userData.profilePicture) {
              setProfilePicture(userData.profilePicture); // Set the profile picture from Firestore
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleProfileClick = () => {
    navigate('/profile'); // Navigate to the profile page
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 mb-4 max-w-sm mx-auto">
      <div className="flex justify-between items-center pb-2">
        <div className="flex items-center">
          {/* Clicking the profile picture now navigates to the profile page */}
          <div
            className="w-12 h-12 rounded-full cursor-pointer flex items-center justify-center overflow-hidden"
            onClick={handleProfileClick}
          >
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <i className="bi bi-person text-2xl"></i>
              </div>
            )}
          </div>
          <p className="text-lg font-medium ml-2 cursor-pointer" onClick={handleProfileClick}>
            Welcome! {userName}
          </p>
        </div>
        <i className="bi bi-bell text-2xl"></i>
      </div>

      <div className="border border-gray-200 rounded-lg ps-3">
        <div className="p-4 ps-2 space-y-4">
          <div>
            <Metrics type="matched" title="Matched scholarships" count={0} />
          </div>
          <div className="border-t border-gray-200"></div> {/* Divider */}
          <div>
            <Metrics type="deadline" title="Upcoming deadlines" count={0} />
          </div>
          <div className="border-t border-gray-200"></div> {/* Divider */}
          <div>
            <Metrics type="saved" title="Saved scholarships" count={0} />
          </div>
        </div>
      </div>

      <div className="pt-4">
        <h3 className="text-lg font-medium">Application progress</h3>
        <Applications />
      </div>
    </div>
  );
};











