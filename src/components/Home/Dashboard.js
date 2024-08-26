import React, { useEffect, useState } from 'react';
import { Metrics } from './Metrics';
import { Applications } from './Applications';

export const Dashboard = () => {
  const [userName, setUserName] = useState('James'); // Default to "James"
  const [profilePicture, setProfilePicture] = useState(null); // State for profile picture

  useEffect(() => {
    // Retrieve the name and profile picture from local storage
    const storedName = localStorage.getItem('firstName');
    const storedProfilePic = localStorage.getItem('profilePicture');
    if (storedName) {
      setUserName(storedName);
    }
    if (storedProfilePic) {
      setProfilePicture(storedProfilePic);
    }
  }, []);

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
        localStorage.setItem('profilePicture', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 mb-4 max-w-sm mx-auto">
      <div className="flex justify-between items-center pb-2 ">
        <div className="flex items-center">
          {profilePicture ? (
            <img
              src={profilePicture}
              alt="Profile"
              className="w-12 h-12 rounded-full mr-2"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 mr-2 flex items-center justify-center">
              <i className="bi bi-person text-2xl"></i>
            </div>
          )}
          <p className="text-lg font-medium">Welcome! {userName}</p>
        </div>
        <i className="bi bi-bell text-2xl"></i>
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleProfilePicChange}
        className="hidden"
        id="profilePicInput"
      />
      <label htmlFor="profilePicInput" className="cursor-pointer text-blue-500">
        Change Profile Picture
      </label>

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








