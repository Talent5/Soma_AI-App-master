import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';
import { FormDataContext } from './FormDataContext';
import BackButton from './BackButton';
import Header from './Header';

export const Onboarding15 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useContext(FormDataContext);
  const [graduationDate, setGraduationDate] = useState(formData.graduationDate || '');

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
    // Save form data to localStorage whenever formData or graduationDate changes
    localStorage.setItem('formData', JSON.stringify({ ...formData, graduationDate }));
  }, [formData, graduationDate]);

  const handleInputChange = (e) => {
    setGraduationDate(e.target.value);
  };

  const handleContinue = () => {
    if (graduationDate) {
      memoizedUpdateFormData({ ...formData, graduationDate });
      navigate('/onboarding16'); // Ensure this route is configured correctly
    } else {
      alert('Please select a graduation date before continuing.');
    }
  };

  return (
    <div className="onboarding-screen">
      <BackButton />
      <Header />

      {/* Progress bar */}
      <div className="progress-bar">
        <div className="progress" style={{ width: '100%' }}></div> {/* Adjust width as needed */}
      </div>

      <p className="section-title">~ Educational background</p>
      <h2>Your expected graduation date?</h2>

      <input
        type="date"
        className="input-field"
        value={graduationDate}
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
