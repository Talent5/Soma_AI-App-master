import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';
import { FormDataContext } from './FormDataContext';
import BackButton from './BackButton';
import Header from './Header';

export const Onboarding16 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useContext(FormDataContext);
  const [intendedFieldOfStudy, setIntendedFieldOfStudy] = useState(formData.intendedFieldOfStudy || '');

  // List of faculties (academic disciplines)
  const faculties = [
    "Agriculture and Forestry",
    "Architecture and Planning",
    "Arts and Humanities",
    "Business and Management",
    "Computer Science and IT",
    "Economics",
    "Education",
    "Engineering",
    "Environmental Science",
    "Health and Medicine",
    "Law",
    "Life Sciences",
    "Mathematics",
    "Physical Sciences",
    "Social Sciences",
    "Veterinary Science",
    "Other"
    // You can add more faculties as needed
  ];

  const handleSelectChange = (e) => {
    setIntendedFieldOfStudy(e.target.value);
  };

  const handleContinue = () => {
    if (intendedFieldOfStudy) {
      updateFormData({ intendedFieldOfStudy });
      navigate('/onboarding17'); // Ensure this route is properly configured
    } else {
      alert('Please select a field of study before continuing.');
    }
  };

  return (
    <div className="onboarding-screen">
      <BackButton />
      <Header />

      {/* Progress bar */}
      <div className="progress-bar">
        <div className="progress" style={{ width: '80%' }}></div> {/* Adjust width based on progress */}
      </div>

      <p className="section-title">~ Field of study</p>
      <h2>Your intended field of study?</h2>

      <select
        className="input-field"
        value={intendedFieldOfStudy}
        onChange={handleSelectChange}
      >
        <option value="">Select option</option>
        {faculties.map((faculty, index) => (
          <option key={index} value={faculty}>
            {faculty}
          </option>
        ))}
      </select>

      <button className="continue-button" onClick={handleContinue}>
        Continue
      </button>
      <button className="later-button" onClick={() => navigate('/home')}>
        I will do this later
      </button>
    </div>
  );
};
