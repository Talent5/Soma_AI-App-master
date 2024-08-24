import React, { useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';
import { FormDataContext } from './FormDataContext';
import BackButton from './BackButton';
import Header from './Header';
import ReviewScreen from './ReviewScreen';

export const Onboarding25 = () => {
  const navigate = useNavigate();
  const { formData, submitFormData } = useContext(FormDataContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showReview, setShowReview] = useState(false);

  const handleProfileUpdate = useCallback(async () => {
    setIsSubmitting(true);
    setError('');
    try {
      const success = await submitFormData();
      if (!success) {
        throw new Error('Failed to submit form data');
      }
      console.log('Form data submitted successfully');
      navigate('/home');
    } catch (error) {
      console.error('Error submitting form data:', error);
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }, [navigate, submitFormData]);

  const handleReview = () => {
    setShowReview(true);
  };

  const handleEdit = () => {
    setShowReview(false);
  };

  const handleConfirm = () => {
    setShowReview(false);
    handleProfileUpdate();
  };

  return (
    <div className="onboarding-screen">
      <BackButton />
      <Header />
      <div className="progress-bar">
        <div className="progress" style={{ width: '100%' }}></div>
      </div>
      <p className="section-title">~ Welcome To SomaAi</p>
      <h2>Review Your Information</h2>
      {error && <p className="error-message">{error}</p>}
      {showReview ? (
        <ReviewScreen
          formData={formData}
          onConfirm={handleConfirm}
          onEdit={handleEdit}
        />
      ) : (
        <>
          <button
            className="continue-button"
            onClick={handleReview}
            disabled={isSubmitting}
          >
            Review and Set Up Profile
          </button>
          <button className="later-button" onClick={() => navigate('/home')}>
            I will do this later
          </button>
        </>
      )}
    </div>
  );
};








