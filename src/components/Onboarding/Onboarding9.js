import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';
import { FormDataContext } from './FormDataContext';
import BackButton from './BackButton';
import Header from './Header';

export const Onboarding9 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useContext(FormDataContext);
  const [countryName, setCountryName] = useState(formData.countryName || '');

  const memoizedUpdateFormData = useCallback(
    (data) => {
      updateFormData(data);
    },
    [updateFormData]
  );

  // Effect to set the current step when the component mounts
  useEffect(() => {
    if (formData.currentStep !== 9) {
      memoizedUpdateFormData({ currentStep: 9 });
    }
  }, [formData.currentStep, memoizedUpdateFormData]);

  // Effect to synchronize form data with local storage
  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify({ ...formData, countryName }));
  }, [formData, countryName]);

  const handleChange = (event) => {
    setCountryName(event.target.value);
  };

  const handleContinue = () => {
    if (countryName) {
      memoizedUpdateFormData({ countryName });
      navigate('/onboarding26'); // Navigate to the next step
    } else {
      alert('Please enter your nationality.');
    }
  };

  return (
    <div className="onboarding-screen">
      <BackButton />
      <Header />

      <div className="progress-bar">
        <div className="progress" style={{ width: '90%' }}></div>
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






