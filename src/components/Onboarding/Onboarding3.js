import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { FormDataContext } from './FormDataContext';
import Header from './Header';
import { ProgressBar } from './ProgressBar';
import BackButton from './BackButton';

export const Onboarding3 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useContext(FormDataContext);

  const handleInputChange = (e) => {
    updateFormData({ firstName: e.target.value });
  };

  const handleContinue = () => {
    if (formData.firstName.trim()) {
      navigate('/onboarding4');
    } else {
      alert('Please fill out the form before continuing.');
    }
  };

  const handleLater = () => {
    navigate('/home');
  };

  return (
    <div className="onboarding-screen p-4">
      <BackButton />
      <Header />
      <ProgressBar />
      <p className="section-title">~ Personal information</p>
      <h2>Your first name?</h2>
      <input
        type="text"
        className="input-field bg-transparent border-b"
        placeholder="E.g. Peter"
        value={formData.firstName || ''} // Ensure controlled input
        onChange={handleInputChange}
        aria-label="First name"
      />
      <button className="continue-button" onClick={handleContinue}>
        Continue
      </button>
      <button className="later-button bg-transparent" onClick={handleLater}>
        I will do this later
      </button>
    </div>
  );
};


