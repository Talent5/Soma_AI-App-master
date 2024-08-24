import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';
import { FormDataContext } from './FormDataContext';
import BackButton from './BackButton';
import Header from './Header';

export const Onboarding22 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useContext(FormDataContext);
  const [awards, setAwards] = useState(formData.awards || []);
  const [newAward, setNewAward] = useState('');

  const handleInputChange = (e) => {
    setNewAward(e.target.value);
  };

  const handleAddAward = () => {
    if (newAward.trim() !== '') {
      setAwards((prevAwards) => [...prevAwards, newAward.trim()]);
      setNewAward('');
    }
  };

  const handleRemoveAward = (index) => {
    setAwards((prevAwards) => prevAwards.filter((_, i) => i !== index));
  };

  const handleContinue = () => {
    updateFormData({ ...formData, awards });
    navigate('/onboarding23');
  };

  return (
    <div className="onboarding-screen">
      <BackButton />
      <Header />

      <div className="progress-bar">
        <div className="progress" style={{ width: '45%' }}></div> {/* Adjust based on step */}
      </div>

      <p className="section-title">~ Achievements</p>
      <h2>Awards and honors? (optional)</h2>

      <div className="addable-input-container">
        <input
          type="text"
          className="input-field"
          placeholder="E.g. National Science Award"
          value={newAward}
          onChange={handleInputChange}
          aria-label="Award input"
        />
        <button className="add-button" onClick={handleAddAward} aria-label="Add award">Add</button>
      </div>

      <ul className="added-items-list">
        {awards.map((award, index) => (
          <li key={index} className="added-item">
            {award}
            <button className="remove-button" onClick={() => handleRemoveAward(index)} aria-label={`Remove ${award}`}>
              ×
            </button>
          </li>
        ))}
      </ul>

      <button className="continue-button" onClick={handleContinue}>
        Continue
      </button>
      <button className="later-button" onClick={() => navigate('/home')}>
        I will do this later
      </button>
    </div>
  );
};

