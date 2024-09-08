import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';
import { FormDataContext } from './FormDataContext';
import BackButton from './BackButton';
import Header from './Header';

export const Onboarding5 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useContext(FormDataContext);

  useEffect(() => {
    // Only update formData if currentStep is not already 5
    if (formData.currentStep !== 5) {
      updateFormData({ currentStep: 5 });
    }
  }, [formData.currentStep, updateFormData]); // Ensure useEffect only runs when currentStep changes

  const handleInputChange = (e) => {
    updateFormData({ middleName: e.target.value });
  };

  const handleContinue = () => {
    navigate('/onboarding6');
  };

  return (
    <div className="onboarding-screen p-4">
      <BackButton />
      <Header />
      <p className="section-title">~ Personal information</p>
      <h2>Your middle name? (optional)</h2>
      <input
        type="text"
        className="input-field"
        placeholder="E.g. Spiderman"
        value={formData.middleName || ''}
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