/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase'; // Import Firestore
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // Firestore functions
import { useNavigate } from 'react-router-dom';

const educationLevels = [
  "High School",
  "Undergraduate",
  "Graduate",
  "Postgraduate",
  "Other"
];

export const EducationalInfo = () => {
  const [userData, setUserData] = useState({
    currentLevelOfEducation: '',
    highSchoolName: '',
    universityName: '',
    gpa: '',
    expectedGraduationDate: ''
  });
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  // Fetch user's information from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData({
            currentLevelOfEducation: data.currentLevelOfEducation || '',
            highSchoolName: data.highSchoolName || '',
            universityName: data.universityName || '',
            gpa: data.gpa || '',
            expectedGraduationDate: data.expectedGraduationDate || ''
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // Handle input change
  const handleInputChange = (field, value) => {
    setUserData(prevData => ({ ...prevData, [field]: value }));
  };

  // Handle save button click
  const handleSave = async () => {
    setLoading(true);
    const userDocRef = doc(db, 'users', userId);
    try {
      await updateDoc(userDocRef, { ...userData });
      alert('Information updated successfully!');
    } catch (error) {
      console.error('Error updating information:', error);
      alert('Failed to update information.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <main className='gap-4 mx-4 mt-4'>
      <div className="top-4 left-4">
        <i onClick={handleBackClick} className="bi bi-arrow-left text-xl px-2">Educational Information</i>
      </div>
      <div className="bg-white mt-4 p-4 rounded-lg shadow-md max-w-md mx-auto">
        <form onSubmit={(e) => e.preventDefault()}>
          {/* Current Level of Education */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-normal mb-1">Current Level of Education</label>
            <select
              value={userData.currentLevelOfEducation}
              onChange={(e) => handleInputChange('currentLevelOfEducation', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
            >
              <option value="" disabled>Select your current level of education</option>
              {educationLevels.map(level => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          {/* High School Name */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-normal mb-1">High School Name</label>
            <input
              type="text"
              value={userData.highSchoolName}
              onChange={(e) => handleInputChange('highSchoolName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              placeholder="Enter your high school name"
            />
          </div>

          {/* University Name (Optional) */}
          <div className="mb-4 ">
            <label className="block text-gray-700 text-sm font-normal mb-1">University Name (Optional)</label>
            <input
              type="text"
              value={userData.universityName}
              onChange={(e) => handleInputChange('universityName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              placeholder="Enter your university name"
            />
          </div>

          {/* GPA (Optional) */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-normal mb-1">GPA (Optional)</label>
            <input
              type="number"
              value={userData.gpa}
              onChange={(e) => handleInputChange('gpa', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              placeholder="Enter your GPA"
              step="0.01"
              min="0"
              max="4"
            />
          </div>

          {/* Expected Graduation Date */}
          <div className="mb-4">
            <label className="block text-black text-m font-normal mb-1">Expected Graduation Date</label>
            <input
              type="date"
              value={userData.expectedGraduationDate}
              onChange={(e) => handleInputChange('expectedGraduationDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
            />
          </div>

          <div className="mt-6 mb-8">
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-[#1E1548] text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300"
            >
              {loading ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default EducationalInfo;