import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';
import { FormDataContext } from './FormDataContext';
import BackButton from './BackButton';
import Header from './Header';

export const Onboarding27 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useContext(FormDataContext);
  const [preferredLocation, setPreferredLocation] = useState(formData.preferredLocation || '');
  const [countries, setCountries] = useState([]);

  // Fetch the list of countries from the API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        const countryNames = data.map(country => country.name.common).sort(); // Get country names and sort alphabetically
        setCountries(countryNames);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  const handleSelectChange = (e) => {
    setPreferredLocation(e.target.value);
  };

  const handleContinue = () => {
    if (preferredLocation) {
      updateFormData({ ...formData, preferredLocation });
      navigate('/onboarding20'); // Ensure this route is properly configured
    } else {
      alert('Please select a location before continuing.');
    }
  };

  useEffect(() => {
    const storedFormData = localStorage.getItem('formData');
    if (storedFormData) {
      updateFormData(JSON.parse(storedFormData));
    }
  }, [updateFormData]);

  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  return (
    <div className="onboarding-screen">
      <BackButton />
      <Header />

      {/* Progress bar */}
      <div className="progress-bar">
        <div className="progress" style={{ width: '90%' }}></div> {/* Adjust width based on progress */}
      </div>

      <p className="section-title">~ Location Preference</p>
      <h2>Your preferred location of study?</h2>

      <select
        className="input-field"
        value={preferredLocation}
        onChange={handleSelectChange}
      >
        <option value="">Select option</option>
        {countries.map((country, index) => (
          <option key={index} value={country}>
            {country}
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

