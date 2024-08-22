import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';
import { FormDataContext } from './FormDataContext';
import BackButton from './BackButton';
import Header from './Header';

export const Onboarding14 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useContext(FormDataContext);
  const [gpa, setGpa] = useState(formData.gpa || '');

  useEffect(() => {
    const storedFormData = localStorage.getItem('formData');
    if (storedFormData) {
      updateFormData(JSON.parse(storedFormData));
    }
  }, [updateFormData]);

  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  const handleInputChange = (e) => {
    setGpa(e.target.value);
  };

  const handleContinue = () => {
    if (gpa.trim() === '' || !isNaN(gpa)) {
      updateFormData({ ...formData, gpa });
      navigate('/onboarding15'); // Navigate to the next step
    } else {
      alert('Please enter a valid GPA.');
    }
  };

  return (
    <div className="onboarding-screen">
      <BackButton />
      <Header />

      {/* Progress bar */}
      <div className="progress-bar">
        <div className="progress" style={{ width: '90%' }}></div> {/* Example progress */}
      </div>

      <p className="section-title">~ Educational background</p>
      <h2>Your GPA? (optional)</h2>

      <input
        type="text" // Or type="number" if only numbers are allowed
        className="input-field"
        placeholder="Enter your GPA (e.g., 3.5)"
        value={gpa}
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

