import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';
import { FormDataContext } from './FormDataContext';
import BackButton from './BackButton';
import Header from './Header';

export const Onboarding26 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useContext(FormDataContext);
  const [cv, setCv] = useState(null);

  useEffect(() => {
    // Load form data from localStorage once on mount
    const storedFormData = localStorage.getItem('formData');
    if (storedFormData) {
      updateFormData(JSON.parse(storedFormData));
    }
    // Dependency array is empty to run only once on mount
  }, [updateFormData]);

  useEffect(() => {
    // Save form data to localStorage whenever formData changes
    if (formData) {
      localStorage.setItem('formData', JSON.stringify(formData));
    }
    // Dependency array contains formData to update only when formData changes
  }, [formData]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCv(file);
    }
  };

  const handleContinue = () => {
    if (cv) {
      updateFormData({ ...formData, cv }); // Merge CV with existing formData
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