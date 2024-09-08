import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';
import { FormDataContext } from './FormDataContext';
import BackButton from './BackButton';
import Header from './Header';

export const Onboarding6 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useContext(FormDataContext);
  const [dateOfBirth, setDateOfBirth] = useState(formData.dateOfBirth || '');

  const memoizedUpdateFormData = useCallback(
    (data) => {
      updateFormData(data);
    },
    [updateFormData]
  );

  useEffect(() => {
    // Load form data from localStorage on mount
    const storedFormData = localStorage.getItem('formData');
    if (storedFormData) {
      memoizedUpdateFormData(JSON.parse(storedFormData));
    }
  }, [memoizedUpdateFormData]);

  useEffect(() => {
    // Save form data to localStorage whenever formData or dateOfBirth changes
    localStorage.setItem('formData', JSON.stringify({ ...formData, dateOfBirth }));
  }, [formData, dateOfBirth]);

  const handleInputChange = (e) => {
    setDateOfBirth(e.target.value);
  };

  const handleContinue = () => {
    memoizedUpdateFormData({ ...formData, dateOfBirth });
    navigate('/onboarding7'); // Ensure this route is configured correctly
  };

  return (
    <div className="onboarding-screen p-4">
      <BackButton />
      <Header />

      {/* Progress bar */}
      <div className="progress-bar">
        <div className="progress" style={{ width: '40%' }}></div> {/* Adjust width as needed */}
      </div>

      <p className="section-title">~ Personal Information</p>
      <h2>When is your date of birth?</h2>

      <input
        type="date"
        className="input-field"
        value={dateOfBirth}
        onChange={handleInputChange}
      />

      <button className="continue-button" onClick={handleContinue}>
        Continue
      </button>
      <button className="later-button" onClick={() => navigate('/home')}>
        I will do this later
      </button>
    </div>
  );
};
