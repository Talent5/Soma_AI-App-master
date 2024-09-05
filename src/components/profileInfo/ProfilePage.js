import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import SaveButton from './SaveButton';

export const ProfilePage = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    phoneNumber: '',
    nationality: '',
    photoURL: '/api/placeholder/80/80',
  });
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData({...docSnap.data(), photoURL: docSnap.data().photoURL || '/api/placeholder/80/80'});
        } else {
          console.log("No user data found");
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, [auth, db]);

  const handleInputChange = (field, value) => {
    setUserData(prevState => ({ ...prevState, [field]: value }));
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setUserData(prevState => ({ ...prevState, photoURL: e.target.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, userData);
      alert("Changes saved!");
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="bg-purple-50 min-h-screen">
      <div className="max-w-md mx-auto pt-8 px-4">
        <div className="flex items-center mb-6">
          <button className="text-blue-600 font-semibold">← Personal information</button>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <img src={userData.photoURL} alt="Profile" className="w-20 h-20 rounded-full" />
            <button 
              className="px-4 py-2 border border-indigo-900 text-indigo-900 rounded-full hover:bg-indigo-50 transition duration-300 ease-in-out"
              onClick={() => document.getElementById('photoUpload').click()}
            >
              Upload photo
            </button>
            <input
              id="photoUpload"
              type="file"
              hidden
              onChange={handlePhotoChange}
              accept="image/*"
            />
          </div>
          
          {/* Input Fields */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-normal mb-1">First name</label>
            <input
              type="text"
              value={userData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-normal mb-1">Middle name (optional)</label>
            <input
              type="text"
              value={userData.middleName}
              onChange={(e) => handleInputChange('middleName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-normal mb-1">Last name</label>
            <input
              type="text"
              value={userData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-normal mb-1">Date of birth</label>
            <input
              type="date"
              value={userData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-normal mb-1">Email address</label>
            <input
              type="email"
              value={userData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-100"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-normal mb-1">Phone number (include country code)</label>
            <input
              type="tel"
              value={userData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-normal mb-1">Nationality</label>
            <input
              type="text"
              value={userData.nationality}
              onChange={(e) => handleInputChange('nationality', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mt-6 mb-8">
          <SaveButton onClick={handleSave} />
        </div>
      </div>
    </div>
  );
};



