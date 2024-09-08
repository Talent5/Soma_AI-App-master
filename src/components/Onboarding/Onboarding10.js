import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';
import { FormDataContext } from './FormDataContext';
import BackButton from './BackButton';
import Header from './Header';

export const Onboarding10 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useContext(FormDataContext);
  const [educationLevel, setEducationLevel] = useState(formData.educationLevel || '');

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
    // Save formData to localStorage whenever formData or educationLevel changes
    localStorage.setItem('formData', JSON.stringify({ ...formData, educationLevel }));
  }, [formData, educationLevel]);

  const handleInputChange = (e) => {
    setEducationLevel(e.target.value);
  };

  const handleContinue = () => {
    if (educationLevel) {
      memoizedUpdateFormData({ educationLevel });
      navigate('/onboarding11');
    } else {
      alert('Please select your current level of education.');
    }
  };

  return (
    <div className="onboarding-screen p-4">
      <BackButton />
      <Header />

      <div className="progress-bar">
        <div className="progress" style={{ width: '50%' }}></div>
      </div>

      <p className="section-title">~ Educational background</p>
      <h2>Your current level of education?</h2>

      <div>
        <label>
          <input
            type="radio"
            value="High school"
            checked={educationLevel === 'High school'}
            onChange={handleInputChange}
          />
          High school
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            value="Undergraduate"
            checked={educationLevel === 'Undergraduate'}
            onChange={handleInputChange}
          />
          Undergraduate
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            value="Graduate"
            checked={educationLevel === 'Graduate'}
            onChange={handleInputChange}
          />
          Graduate
        </label>
      </div>

      <button className="continue-button" onClick={handleContinue}>
        Continue
      </button>
      <button className="later-button" onClick={() => navigate('/home')}>
        I will do this later
      </button>
    </div>
  );
};
