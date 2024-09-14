/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { db, storage } from '../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

export const PersonalInformation = () => {
  const [userName, setUserName] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [userData, setUserData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    phoneNumber: '',
    nationality: '',
    cv: null,
  });
  const fileInputRef = useRef(null);
  const cvInputRef = useRef(null);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData.firstName || '');
          setProfilePicture(userData.profilePicture || null);
          setUserData({
            firstName: userData.firstName || '',
            middleName: userData.middleName || '',
            lastName: userData.lastName || '',
            dateOfBirth: userData.dateOfBirth || '',
            email: userData.email || '',
            phoneNumber: userData.phoneNumber || '',
            nationality: userData.nationality || '',
            cv: userData.cv || null,
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleProfilePicChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const storageRef = ref(storage, `profilePictures/${userId}`);
      try {
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        const userDocRef = doc(db, 'users', userId);
        await updateDoc(userDocRef, { profilePicture: downloadURL });
        setProfilePicture(downloadURL);
        alert('Profile picture updated successfully!');
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        alert('Failed to upload profile picture.');
      }
    }
  };

  const handleProfilePicClick = () => {
    fileInputRef.current?.click();
  };

  const handleCvChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const storageRef = ref(storage, `cv/${userId}`);
      try {
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        const userDocRef = doc(db, 'users', userId);
        await updateDoc(userDocRef, { cv: downloadURL });
        setUserData((prevData) => ({ ...prevData, cv: downloadURL }));
        alert('CV uploaded successfully!');
      } catch (error) {
        console.error('Error uploading CV:', error);
        alert('Failed to upload CV.');
      }
    }
  };

  const handleInputChange = (field, value) => {
    setUserData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleSave = async () => {
    const userDocRef = doc(db, 'users', userId);
    try {
      await updateDoc(userDocRef, { ...userData });
      alert('Personal information updated successfully!');
    } catch (error) {
      console.error('Error updating personal information:', error);
      alert('Failed to update personal information.');
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <main className='p-4'>
      <div className="mb-4">
        <i onClick={handleBackClick} className="bi bi-arrow-left text-xl text-gray-700"> Personal Information</i>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
        <div className="flex items-center mb-6">
          <div
            className="w-16 h-16 rounded-full overflow-hidden cursor-pointer"
            onClick={handleProfilePicClick}
          >
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <i className="bi bi-person text-4xl text-gray-500"></i>
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleProfilePicChange}
            className="hidden"
          />
        </div>

        {['firstName', 'middleName', 'lastName', 'email', 'dateOfBirth', 'phoneNumber', 'nationality'].map((field) => (
          <div key={field} className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2 capitalize">
              {field.replace(/([A-Z])/g, ' $1').toLowerCase()}
            </label>
            <input
              type={field === 'dateOfBirth' ? 'date' : field === 'email' ? 'email' : 'text'}
              value={userData[field]}
              onChange={(e) => handleInputChange(field, e.target.value)}
              readOnly={field === 'email'}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        ))}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">Upload CV</label>
          <div
            className="w-full px-4 py-2 border border-gray-300 rounded-md cursor-pointer"
            onClick={() => cvInputRef.current?.click()}
          >
            {userData.cv ? (
              <a href={userData.cv} target="_blank" rel="noopener noreferrer" className="text-indigo-600">View CV</a>
            ) : (
              <span className="text-gray-500">Click to upload CV</span>
            )}
          </div>
          <input
            type="file"
            ref={cvInputRef}
            onChange={handleCvChange}
            className="hidden"
          />
        </div>

        <div className="mt-6">
          <button
            onClick={handleSave}
            className="w-full py-2 bg-[#1E1548] text-white rounded-full hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </main>
  );
};

export default PersonalInformation;