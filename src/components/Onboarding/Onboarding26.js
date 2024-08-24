import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';
import { FormDataContext } from './FormDataContext';
import BackButton from './BackButton';
import Header from './Header';

export const Onboarding26 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useContext(FormDataContext);
  const [cv, setCv] = useState(formData.cv || null);

  const memoizedUpdateFormData = useCallback(
    (data) => {
      updateFormData(data);
    },
    [updateFormData]
  );

  useEffect(() => {
    // Ensure the current step is set to 26
    if (formData.currentStep !== 26) {
      memoizedUpdateFormData({ currentStep: 26 });
    }
  }, [formData.currentStep, memoizedUpdateFormData]);

  useEffect(() => {
    // Save form data to localStorage whenever formData or CV changes
    if (formData) {
      localStorage.setItem('formData', JSON.stringify({ ...formData, cv }));
    }
  }, [formData, cv]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCv(file);
    }
  };

  const handleContinue = () => {
    if (cv) {
      // Update formData with the new CV file
      memoizedUpdateFormData({ cv });
      navigate('/onboarding10');
    } else {
      alert('Please upload your CV before continuing.');
    }
  };

  return (
    <div className="onboarding-screen">
      <BackButton />
      <Header />

      <div className="progress-bar">
        <div className="progress" style={{ width: '100%' }}></div>
      </div>

      <p className="section-title">~ Personal Information</p>
      <h2>Upload your CV</h2>

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        className="file-input" // Apply your custom styling
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

