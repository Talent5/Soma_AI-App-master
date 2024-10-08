import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';
import { FormDataContext } from './FormDataContext';
import BackButton from './BackButton';
import Header from './Header';

export const Onboarding17 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useContext(FormDataContext);
  const [degreeType, setDegreeType] = useState(formData.degreeType || '');

  const handleInputChange = (e) => {
    setDegreeType(e.target.value);
  };

  const handleContinue = () => {
    if (degreeType) {
      updateFormData({ degreeType });
      navigate('/onboarding18'); // Ensure this route is configured
    } else {
      alert('Please select a degree type before continuing.');
    }
  };

  return (
    <div className="onboarding-screen p-4">
      <BackButton />
      <Header />

      {/* Progress bar */}
      <div className="progress-bar">
        <div className="progress" style={{ width: '85%' }}></div> {/* Example width */}
      </div>

      <p className="section-title">~ Degree Type</p>
      <h2>Your preferred degree type?</h2>

      <div className="radio-group">
        <label>
          <input
            type="radio"
            name="degreeType"
            value="Bachelors"
            checked={degreeType === 'Bachelors'}
            onChange={handleInputChange}
          />
          Bachelors
        </label>
      </div>
      <div className="radio-group">
        <label>
          <input
            type="radio"
            name="degreeType"
            value="Masters"
            checked={degreeType === 'Masters'}
            onChange={handleInputChange}
          />
          Masters
        </label>
      </div>
      <div className="radio-group">
        <label>
          <input
            type="radio"
            name="degreeType"
            value="PhD"
            checked={degreeType === 'PhD'}
            onChange={handleInputChange}
          />
          PhD
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

