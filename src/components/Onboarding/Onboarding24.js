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
  const [isModelTraining, setIsModelTraining] = useState(false);

  const handleInputChange = (e) => {
    setFinancialNeed(e.target.value);
  };

  const triggerModelRun = async () => {
    try {
      // Make the GET request to trigger the model run
      const response = await fetch('https://somaai-ae50218ae5c5.herokuapp.com/run', { method: 'GET' });
      if (!response.ok) {
        throw new Error('Failed to trigger model run');
      }
      const result = await response.json();
      console.log('Model triggered successfully:', result);
    } catch (err) {
      console.error('Error triggering model:', err);
      setError('Error during model run');
    }
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

      // Trigger model run and display loading spinner for 5-10 seconds
      setIsModelTraining(true);
      await triggerModelRun();

      // Simulate model training for 5-10 seconds (set to 7 seconds in this case)
      setTimeout(() => {
        setIsModelTraining(false);
        navigate('/home');  // Navigate to the dashboard
      }, 7000);  // 7 seconds for simulation
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

      {isModelTraining ? (
        <div className="model-training-spinner">
          {/* Loading animation for model training */}
          <div className="loading-spinner"></div>
          <p>Model is training, please wait...</p>
        </div>
      ) : isContinueClicked ? (
        <button
          className={`continue-button submit-button ${isSubmitting ? 'submitting' : ''}`}
          onClick={handleSubmit}
          disabled={isSubmitting || isModelTraining}
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