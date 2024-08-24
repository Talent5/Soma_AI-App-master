import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';
import { FormDataContext } from './FormDataContext';
import BackButton from './BackButton';
import Header from './Header';

export const Onboarding24 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useContext(FormDataContext);
  const [financialNeed, setFinancialNeed] = useState(formData.financialNeed || '');

  const handleInputChange = (e) => {
    setFinancialNeed(e.target.value);
  };

  const handleContinue = () => {
    updateFormData({ ...formData, financialNeed });
    navigate('/onboarding25');
  };

  return (
    <div className="onboarding-screen">
      <BackButton />
      <Header />
      <div className="progress-bar">
        <div className="progress" style={{ width: '75%' }}></div> {/* Adjust width as necessary */}
      </div>

      <p className="section-title">~ Financial information</p>
      <h2>Financial need status?</h2>

      <div className="radio-group">
        <label>
          <input
            type="radio"
            value="Requires full need-based aid"
            checked={financialNeed === 'Requires full need-based aid'}
            onChange={handleInputChange}
          />
          Requires full need-based aid
        </label>
        <label>
          <input
            type="radio"
            value="Requires partial need-based aid"
            checked={financialNeed === 'Requires partial need-based aid'}
            onChange={handleInputChange}
          />
          Requires partial need-based aid
        </label>
        <label>
          <input
            type="radio"
            value="No need-based aid required"
            checked={financialNeed === 'No need-based aid required'}
            onChange={handleInputChange}
          />
          No need-based aid required
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
