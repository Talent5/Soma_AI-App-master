import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';
import { FormDataContext } from './FormDataContext';
import BackButton from './BackButton';
import Header from './Header';

export const Onboarding26 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useContext(FormDataContext);
  const [cv, setCv] = useState(formData.cv || null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Ensure the current step is set to 26
    if (formData.currentStep !== 26) {
      updateFormData({ currentStep: 26 });
    }
  }, [formData.currentStep, updateFormData]);

  useEffect(() => {
    // Save form data to localStorage whenever formData or CV changes
    if (formData) {
      localStorage.setItem('formData', JSON.stringify({ ...formData, cv }));
    }
  }, [formData, cv]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // Limit file size to 5MB
        setError('File size exceeds 5MB. Please upload a smaller file.');
      } else if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
        // Validate file type
        setError('Invalid file type. Please upload a PDF, DOC, or DOCX file.');
      } else {
        setError('');
        setCv(file);
        updateFormData({ cv: file });
      }
    }
  };

  const handleContinue = () => {
    if (cv) {
      navigate('/onboarding10');
    } else {
      setError('Please upload your CV before continuing.');
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

      {error && <p className="error-message">{error}</p>}

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        className="file-input"
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



