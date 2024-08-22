import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';
import { FormDataContext } from './FormDataContext';
import BackButton from './BackButton';
import Header from './Header';

export const Onboarding12 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useContext(FormDataContext);
  const [universityName, setUniversityName] = useState(formData.universityName || '');

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
    setUniversityName(e.target.value);
  };

  const handleContinue = () => {
    updateFormData({ ...formData, universityName });
    navigate('/onboarding13');
  };

  return (
    <div className="onboarding-screen">
      <BackButton />
      <Header />

      {/* Progress bar (optional) */}
      <div className="progress-bar">
        <div className="progress" style={{ width: '70%' }}></div> {/* Example progress */}
      </div>

      <p className="section-title">~ Educational background</p>
      <h2>Name of university? (optional)</h2>

      <input
        type="text"
        className="input-field"
        placeholder="Enter university name"
        value={universityName}
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

