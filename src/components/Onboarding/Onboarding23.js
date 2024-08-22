import React, { useState, useContext, useEffect } from 'react';
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

  useEffect(() => {
    const storedFormData = localStorage.getItem('formData');
    if (storedFormData) {
      updateFormData(JSON.parse(storedFormData));
    }
  }, [updateFormData]);

  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

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
        <label>
          <input
            type="radio"
            value="Less than $5,000"
            checked={incomeBracket === 'Less than $5,000'}
            onChange={handleInputChange}
          />
          Less than $5,000
        </label>
        <label>
          <input
            type="radio"
            value="$5,000 - $10,000"
            checked={incomeBracket === '$5,000 - $10,000'}
            onChange={handleInputChange}
          />
          $5,000 - $10,000
        </label>
        <label>
          <input
            type="radio"
            value="$10,000 - $20,000"
            checked={incomeBracket === '$10,000 - $20,000'}
            onChange={handleInputChange}
          />
          $10,000 - $20,000
        </label>
        <label>
          <input
            type="radio"
            value="$20,000 - $30,000"
            checked={incomeBracket === '$20,000 - $30,000'}
            onChange={handleInputChange}
          />
          $20,000 - $30,000
        </label>
        <label>
          <input
            type="radio"
            value="Over $30,000"
            checked={incomeBracket === 'Over $30,000'}
            onChange={handleInputChange}
          />
          Over $30,000
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

