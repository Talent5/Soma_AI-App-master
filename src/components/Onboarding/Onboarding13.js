import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';
import { FormDataContext } from './FormDataContext';
import BackButton from './BackButton';
import Header from './Header';

export const Onboarding13 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useContext(FormDataContext);
  const [courseOfStudy, setCourseOfStudy] = useState(formData.courseOfStudy || '');

  const handleInputChange = (e) => {
    setCourseOfStudy(e.target.value);
  };

  const handleContinue = () => {
    updateFormData({ ...formData, courseOfStudy });
    // Log the complete form data for debugging
    console.log('Form Data:', { ...formData, courseOfStudy });
    navigate('/onboarding14'); // Navigate to the next step
  };

  return (
    <div className="onboarding-screen">
      <BackButton />
      <Header />

      {/* Progress bar (optional) */}
      <div className="progress-bar">
        <div className="progress" style={{ width: '80%' }}></div> {/* Example progress */}
      </div>

      <p className="section-title">~ Educational background</p>
      <h2>Your current course of study? (optional)</h2>

      <input
        type="text"
        className="input-field"
        placeholder="Enter course of study"
        value={courseOfStudy}
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
