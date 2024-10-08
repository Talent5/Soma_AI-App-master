import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';
import { FormDataContext } from './FormDataContext';
import BackButton from './BackButton';
import Header from './Header';

export const Onboarding21 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useContext(FormDataContext);
  const [leadershipRoles, setLeadershipRoles] = useState(formData.leadershipRoles || []);
  const [newRole, setNewRole] = useState('');

  const handleInputChange = (e) => {
    setNewRole(e.target.value);
  };

  const handleAddRole = () => {
    if (newRole.trim() !== '') {
      setLeadershipRoles((prevRoles) => [...prevRoles, newRole.trim()]);
      setNewRole('');
    }
  };

  const handleRemoveRole = (index) => {
    setLeadershipRoles((prevRoles) => prevRoles.filter((_, i) => i !== index));
  };

  const handleContinue = () => {
    updateFormData({ ...formData, leadershipRoles });
    navigate('/onboarding22'); // Ensure the route is correctly configured
  };

  return (
    <div className="onboarding-screen">
      <BackButton />
      <Header />

      <div className="progress-bar">
        <div className="progress" style={{ width: '30%' }}></div> {/* Adjust according to the step */}
      </div>

      <p className="section-title">~ Extracurricular activities</p>
      <h2>Leadership roles? (optional)</h2>

      <div className="addable-input-container">
        <input
          type="text"
          className="input-field"
          placeholder="E.g President of the Student Council"
          value={newRole}
          onChange={handleInputChange}
          aria-label="Leadership role"
        />
        <button className="add-button" onClick={handleAddRole} aria-label="Add leadership role">Add</button>
      </div>

      {/* Display added leadership roles */}
      <ul className="added-items-list">
        {leadershipRoles.map((role, index) => (
          <li key={index} className="added-item">
            {role}
            <button className="remove-button" onClick={() => handleRemoveRole(index)} aria-label={`Remove ${role}`}>
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
