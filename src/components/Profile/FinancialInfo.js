// src/components/FinancialInfo.js
import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase'; // Import Firestore
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // Firestore functions
import { useNavigate } from 'react-router-dom';

const incomeBrackets = [
  "Below $20,000",
  "$20,000 - $40,000",
  "$40,000 - $60,000",
  "$60,000 - $80,000",
  "Above $80,000"
];

const financialNeedStatuses = [
  "Requires full need-based aid",
  "Requires partial need-based aid",
  "Does not require need-based aid"
];

const FinancialInfo = () => {
  const [financialData, setFinancialData] = useState({
    householdIncomeBracket: '',
    financialNeedStatus: ''
  });
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  // Fetch user's financial information from Firestore
  useEffect(() => {
    const fetchFinancialData = async () => {
      setLoading(true);
      try {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setFinancialData({
            householdIncomeBracket: data.householdIncomeBracket || '',
            financialNeedStatus: data.financialNeedStatus || ''
          });
        }
      } catch (error) {
        console.error('Error fetching financial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, [userId]);

  // Handle input change
  const handleInputChange = (field, value) => {
    setFinancialData(prevData => ({ ...prevData, [field]: value }));
  };

  // Handle save button click
  const handleSave = async () => {
    setLoading(true);
    const userDocRef = doc(db, 'users', userId);
    try {
      await updateDoc(userDocRef, { ...financialData });
      alert('Financial information updated successfully!');
    } catch (error) {
      console.error('Error updating financial information:', error);
      alert('Failed to update financial information.');
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
        <i onClick={handleBackClick} className="bi bi-arrow-left text-2xl px-2 font-normal">Financial Information</i>
      </div>
      <div className="bg-white mt-4 p-4 rounded-lg shadow-md max-w-md mx-auto">
        <form onSubmit={(e) => e.preventDefault()}>
          {/* Household Income Bracket */}
          <div className="mb-4">
            <label className="block text-black text-sm font-normal mb-1">Household Income Bracket?</label>
            <select
              value={financialData.householdIncomeBracket}
              onChange={(e) => handleInputChange('householdIncomeBracket', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
            >
              <option value="" disabled>Select your household income bracket</option>
              {incomeBrackets.map(bracket => (
                <option key={bracket} value={bracket}>
                  {bracket}
                </option>
              ))}
            </select>
          </div>

          {/* Financial Need Status */}
          <div className="mb-4">
            <label className="block text-black text-sm font-normal mb-1">Financial Need Status?</label>
            {financialNeedStatuses.map(status => (
              <div key={status} className="flex items-center mb-2">
                <input
                  type="radio"
                  id={status}
                  name="financialNeedStatus"
                  value={status}
                  checked={financialData.financialNeedStatus === status}
                  onChange={(e) => handleInputChange('financialNeedStatus', e.target.value)}
                  className="mr-2"
                />
                <label htmlFor={status} className="text-gray-700 text-sm">{status}</label>
              </div>
            ))}
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

export default FinancialInfo;

