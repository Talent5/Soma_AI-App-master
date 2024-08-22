import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';
import { FormDataContext } from './FormDataContext';
import BackButton from './BackButton';
import Header from './Header';

export const Onboarding6 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useContext(FormDataContext);

  useEffect(() => {
    // Only update formData if currentStep is not already 6
    if (formData.currentStep !== 6) {
      updateFormData({ currentStep: 6 });
    }
  }, [formData.currentStep, updateFormData]); // Ensure useEffect only runs when currentStep changes

  const handleInputChange = (e) => {
    updateFormData({ dateOfBirth: e.target.value });
  };

  const handleContinue = () => {
    if (formData.dateOfBirth) {
      navigate('/onboarding7');
    } else {
      alert('Please enter your date of birth before continuing.');
    }
  };

  return (
    <div className="onboarding-screen">
      <BackButton />
      <Header />
      <p className="section-title">~ Personal information</p>
      <h2>Your date of birth?</h2>
      <input
        type="date"
        className="input-field"
        value={formData.dateOfBirth || ''}
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

