import React, { useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';
import { FormDataContext } from './FormDataContext';
import BackButton from './BackButton';
import Header from './Header';

export const Onboarding24 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData, submitFormData } = useContext(FormDataContext);
  const [financialNeed, setFinancialNeed] = useState(formData.financialNeed || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isContinueClicked, setIsContinueClicked] = useState(false);

  const handleInputChange = (e) => {
    setFinancialNeed(e.target.value);
  };

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    setError('');
    try {
      const { success, error } = await submitFormData();
      if (!success) {
        throw new Error(error || 'Failed to submit form data');
      }
      console.log('Form data submitted successfully');
      navigate('/home');
    } catch (err) {
      console.error('Error submitting form data:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }, [navigate, submitFormData]);

  const handleContinue = () => {
    updateFormData({ ...formData, financialNeed });
    setIsContinueClicked(true);
  };

  return (
    <div className="onboarding-screen">
      <BackButton />
      <Header />
      <div className="progress-bar">
        <div className="progress" style={{ width: '75%' }}></div>
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
      {error && <p className="error-message">{error}</p>}
      {isContinueClicked ? (
        <button
          className={`continue-button submit-button ${isSubmitting ? 'submitting' : ''}`}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="spinner-container">
              <div className="loading-spinner"></div>
              Submitting...
            </div>
          ) : (
            'Submit'
          )}
        </button>
      ) : (
        <button className="continue-button" onClick={handleContinue}>
          Continue
        </button>
      )}
      <button className="later-button" onClick={() => navigate('/home')}>
        I will do this later
      </button>
    </div>
  );
};