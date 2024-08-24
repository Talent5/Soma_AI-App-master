import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';
import { FormDataContext } from './FormDataContext';
import BackButton from './BackButton';
import Header from './Header';

export const Onboarding23 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useContext(FormDataContext);
  const [incomeBracket, setIncomeBracket] = useState(formData.incomeBracket || '');

  const handleInputChange = (e) => {
    setIncomeBracket(e.target.value);
  };

  const handleContinue = () => {
    updateFormData({ ...formData, incomeBracket });
    navigate('/onboarding24');
  };

  return (
    <div className="onboarding-screen">
      <BackButton />
      <Header />
      <div className="progress-bar">
        <div className="progress" style={{ width: '60%' }}></div> {/* Adjust width as necessary */}
      </div>

      <p className="section-title">~ Financial information</p>
      <h2>Household income bracket?</h2>

      <div className="radio-group">
        {[
          "Less than $5,000",
          "$5,000 - $10,000",
          "$10,000 - $20,000",
          "$20,000 - $30,000",
          "Over $30,000"
        ].map((bracket) => (
          <label key={bracket}>
            <input
              type="radio"
              value={bracket}
              checked={incomeBracket === bracket}
              onChange={handleInputChange}
            />
            {bracket}
          </label>
        ))}
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
