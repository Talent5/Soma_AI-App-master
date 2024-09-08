import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';
import { FormDataContext } from './FormDataContext';
import BackButton from './BackButton';
import Header from './Header';

export const Onboarding20 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useContext(FormDataContext);
  const [communityService, setCommunityService] = useState(formData.communityService || '');

  const handleInputChange = (e) => {
    setCommunityService(e.target.value);
  };

  const handleContinue = () => {
    updateFormData({ ...formData, communityService });
    navigate('/onboarding21'); // Ensure the route is properly configured
  };

  return (
    <div className="onboarding-screen p-4">
      <BackButton />
      <Header />

      <div className="progress-bar">
        <div className="progress" style={{ width: '100%' }}></div> {/* Adjusted to 100% for the last step */}
      </div>

      <p className="section-title">~ Extracurricular activities</p>
      <h2>Any volunteer or community service? (optional)</h2>

      <textarea
        className="input-field"
        placeholder="Enter details here"
        value={communityService}
        onChange={handleInputChange}
        aria-label="Community service details"
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

