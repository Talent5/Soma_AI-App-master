import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';
import { FormDataContext } from './FormDataContext';
import BackButton from './BackButton';
import Header from './Header';

export const Onboarding11 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useContext(FormDataContext);
  const [highSchoolName, setHighSchoolName] = useState(formData.highSchoolName || '');

  const memoizedUpdateFormData = useCallback(
    (data) => {
      updateFormData(data);
    },
    [updateFormData]
  );

  useEffect(() => {
    // Synchronize localStorage with formData on mount
    const storedFormData = localStorage.getItem('formData');
    if (storedFormData) {
      memoizedUpdateFormData(JSON.parse(storedFormData));
    }
  }, [memoizedUpdateFormData]);

  useEffect(() => {
    // Save formData to localStorage whenever formData or highSchoolName changes
    localStorage.setItem('formData', JSON.stringify({ ...formData, highSchoolName }));
  }, [formData, highSchoolName]);

  const handleInputChange = (e) => {
    setHighSchoolName(e.target.value);
  };

  const handleContinue = () => {
    if (highSchoolName.trim()) {
      memoizedUpdateFormData({ ...formData, highSchoolName });
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


