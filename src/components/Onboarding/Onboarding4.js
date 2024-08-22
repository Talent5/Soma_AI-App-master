import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';
import { FormDataContext } from './FormDataContext';
import Header from './Header';
import BackButton from './BackButton';

export const Onboarding4 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useContext(FormDataContext);

  useEffect(() => {
    // Update formData only if currentStep is not already 4
    if (formData.currentStep !== 4) {
      updateFormData({ currentStep: 4 });
    }
  }, [formData.currentStep, updateFormData]); // Add formData.currentStep as a dependency to handle updates properly

  const handleInputChange = (e) => {
    updateFormData({ lastName: e.target.value });
  };

  const handleContinue = () => {
    if (formData.lastName.trim()) {
      navigate('/onboarding5');
    } else {
      alert('Please fill out the form before continuing.');
    }
  };

  return (
    <div className="onboarding-screen">
      <BackButton />
      <Header />
      <div className="progress-bar">
        <div className="progress" style={{ width: '28%' }}></div>
      </div>
      <p className="section-title">~ Personal information</p>
      <h2 className='text-xl'>Your last name?</h2>
      <input
        type="text"
        className="input-field"
        placeholder="E.g. Parker"
        value={formData.lastName}
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
}
