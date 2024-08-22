import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';
import { FormDataContext } from './FormDataContext';
import BackButton from './BackButton';
import Header from './Header';

export const Onboarding7 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useContext(FormDataContext);
  const [error, setError] = useState('');

  useEffect(() => {
    // Ensure currentStep is set correctly, only update if it’s not already 7
    if (formData.currentStep !== 7) {
      updateFormData({ currentStep: 7 });
    }
  }, [formData.currentStep, updateFormData]); // Add formData.currentStep to the dependency array

  const handleInputChange = (e) => {
    updateFormData({ emailAddress: e.target.value });
    setError(''); // Clear error when input changes
  };

  const handleContinue = () => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(formData.emailAddress)) {
      navigate('/onboarding8');
    } else {
      setError('Please enter a valid email address');
    }
  };

  return (
    <div className="onboarding-screen">
      <BackButton />
      <Header />
      <div className="progress-bar">
        <div className="progress" style={{ width: '70%' }}></div>
      </div>
      <p className="section-title">~ Personal information</p>
      <h2>Your email address?</h2>
      <input
        type="email"
        className="input-field"
        placeholder="abc@xyz.com"
        value={formData.emailAddress || ''}
        onChange={handleInputChange}
      />
      {error && <p className="error-message">{error}</p>}
      <button className="continue-button" onClick={handleContinue}>
        Continue
      </button>
      <button className="later-button" onClick={() => navigate('/home')}>
        I will do this later
      </button>
    </div>
  );
};

