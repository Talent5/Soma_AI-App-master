import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';
import { FormDataContext } from './FormDataContext';
import BackButton from './BackButton';
import Header from './Header';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

export const Onboarding8 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useContext(FormDataContext);
  const [phoneNumber, setPhoneNumber] = useState(formData.phoneNumber || '');

  const memoizedUpdateFormData = useCallback(
    (data) => {
      updateFormData(data);
    },
    [updateFormData]
  );

  useEffect(() => {
    // Only update the current step if it’s not already set to 8
    if (formData.currentStep !== 8) {
      memoizedUpdateFormData({ currentStep: 8 });
    }
  }, [formData.currentStep, memoizedUpdateFormData]);

  const handlePhoneNumberChange = (value) => {
    setPhoneNumber(value);
  };

  const handleContinue = () => {
    if (phoneNumber) {
      memoizedUpdateFormData({ phoneNumber });
      navigate('/onboarding9');
    } else {
      alert('Please enter your phone number.');
    }
  };

  return (
    <div className="onboarding-screen">
      <BackButton />
      <Header />

      <div className="progress-bar">
        <div className="progress" style={{ width: '80%' }}></div>
      </div>

      <p className="section-title">~ Personal information</p>
      <h2>Your phone number?</h2>

      <PhoneInput
        country={'us'}
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        inputClass="input-field"
        placeholder="Enter your phone number"
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


