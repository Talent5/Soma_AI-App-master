/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase'; // Import Firestore
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // Firestore functions
import { useNavigate } from 'react-router-dom';

const faculties = [
  "Agriculture and Forestry",
  "Architecture and Planning",
  "Arts and Humanities",
  "Business and Management",
  "Computer Science and IT",
  "Economics",
  "Education",
  "Engineering",
  "Environmental Science",
  "Health and Medicine",
  "Law",
  "Life Sciences",
  "Mathematics",
  "Physical Sciences",
  "Social Sciences",
  "Veterinary Science",
  "Other"
  // You can add more faculties as needed
];

export const FieldOfStudy = () => {
  const [userData, setUserData] = useState({
    intendedFieldOfStudy: '',
    degreeType: '',
  });
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate(); // Initialize navigate function

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
            intendedFieldOfStudy: data.intendedFieldOfStudy || '',
            degreeType: data.degreeType || '',
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
    <main className='gap-4 mx-2 mt-4'>
      <div className="top-4 left-4">
        <i onClick={handleBackClick} className="bi bi-arrow-left text-xl px-2">Field of Study</i>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md max-w-md mx-auto my-2">
        <form onSubmit={(e) => e.preventDefault()}>
          {/* Intended Field of Study */}
          <div className="mb-4">
            <label className="block text-black text-m font-normal mb-1">Intended Field of Study</label>
            <select
              value={userData.intendedFieldOfStudy}
              onChange={(e) => handleInputChange('intendedFieldOfStudy', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none bg-transparent"
            >
              <option value="" disabled>Select your field of study</option>
              {faculties.map(faculty => (
                <option key={faculty} value={faculty}>
                  {faculty}
                </option>
              ))}
            </select>
          </div>

          {/* Degree Type */}
          <div className="mb-4">
            <label className="block text-black text-m font-normal mb-1">Degree Type</label>
            <div className="radio-group mb-2">
              <label>
                <input
                  type="radio"
                  name="degreeType"
                  value="Bachelors"
                  checked={userData.degreeType === 'Bachelors'}
                  onChange={(e) => handleInputChange('degreeType', e.target.value)}
                  disabled
                />
                Bachelors
              </label>
            </div>
            <div className="radio-group mb-2">
              <label>
                <input
                  type="radio"
                  name="degreeType"
                  value="Masters"
                  checked={userData.degreeType === 'Masters'}
                  onChange={(e) => handleInputChange('degreeType', e.target.value)}
                  disabled
                />
                Masters
              </label>
            </div>
            <div className="radio-group mb-2">
              <label>
                <input
                  type="radio"
                  name="degreeType"
                  value="PhD"
                  checked={userData.degreeType === 'PhD'}
                  onChange={(e) => handleInputChange('degreeType', e.target.value)}
                  disabled
                />
                PhD
              </label>
            </div>
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

export default FieldOfStudy;
