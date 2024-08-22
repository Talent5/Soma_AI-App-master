import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';
import { FormDataContext } from './FormDataContext';
import BackButton from './BackButton';
import Header from './Header';

export const Onboarding11 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useContext(FormDataContext);
  const [highSchoolName, setHighSchoolName] = useState(formData.highSchoolName || '');

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
    setHighSchoolName(e.target.value);
  };

  const handleContinue = () => {
    if (highSchoolName.trim()) {
      updateFormData({ ...formData, highSchoolName });
      navigate('/onboarding12');
    } else {
      alert("Please fill out the form before continuing.");
    }
  };

  return (
    <div className="onboarding-screen">
      <BackButton />
      <Header />

      {/* Progress bar (optional) */}
      <div className="progress-bar">
        <div className="progress" style={{ width: '60%' }}></div> {/* Example progress */}
      </div>

      <p className="section-title">~ Educational background</p>
      <h2>Name of high school?</h2>

      <input
        type="text"
        className="input-field"
        placeholder="Enter high school name"
        value={highSchoolName}
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

