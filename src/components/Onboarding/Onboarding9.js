import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';
import { FormDataContext } from './FormDataContext';
import BackButton from './BackButton';
import Header from './Header';

export const Onboarding9 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useContext(FormDataContext);
  const [countryName, setCountryName] = useState(formData.nationality || '');

  // Effect to handle form data update on mount
  useEffect(() => {
    if (formData.currentStep !== 9) {
      updateFormData((prev) => ({ ...prev, currentStep: 9 }));
    }
  }, [formData.currentStep, updateFormData]);

  // Effect to synchronize form data with local storage
  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  const handleChange = (event) => {
    setCountryName(event.target.value);
  };

  const handleContinue = () => {
    if (countryName) {
      updateFormData((prev) => ({ ...prev, nationality: countryName }));
      navigate('/onboarding26'); // Navigate to the next step
    } else {
      alert('Please enter your nationality.');
    }
  };

  return (
    <div className="onboarding-screen">
      <BackButton />
      <Header />

      {/* Progress bar */}
      <div className="progress-bar">
        <div className="progress" style={{ width: '90%' }}></div> {/* Adjust width based on progress */}
      </div>

      <p className="section-title">~ Personal information</p>
      <h2>Your nationality?</h2>

      <input
        type="text"
        value={countryName}
        onChange={handleChange}
        placeholder="Enter your nationality"
        className="input-field"
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





