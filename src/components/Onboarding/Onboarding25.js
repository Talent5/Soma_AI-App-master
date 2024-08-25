import React, { useState, useContext, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';
import { FormDataContext } from './FormDataContext';
import BackButton from './BackButton';
import Header from './Header';
import ReviewScreen from './ReviewScreen';

export const Onboarding25 = () => {
  const navigate = useNavigate();
  const { formData, submitFormData, updateFormData } = useContext(FormDataContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('User not found. Please log in again.');
      navigate('/');
    } else if (userId !== formData.userId) {
      updateFormData({ userId });
    }
  }, [navigate, updateFormData, formData.userId]);

  const handleProfileUpdate = useCallback(async () => {
    setIsSubmitting(true);
    setError('');
    try {
      const result = await submitFormData();
      if (!result.success) {
        throw new Error(result.error || 'Failed to submit form data');
      }
      console.log('Form data submitted successfully');
      navigate('/home');
    } catch (error) {
      console.error('Error submitting form data:', error);
      if (error.message.includes('user does not exist')) {
        setError('User not found. Please ensure you are logged in and try again.');
        navigate('/');
      } else {
        setError(error.message || 'An unexpected error occurred');
      }
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








