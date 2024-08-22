import React, { createContext, useState, useEffect, useCallback } from 'react';

export const FormDataContext = createContext();

export const FormDataProvider = ({ children }) => {
  const [formData, setFormData] = useState(() => {
    const storedData = localStorage.getItem('formData');
    return storedData ? JSON.parse(storedData) : {
      firstName: '',
      lastName: '',
      middleName: '',
      dateOfBirth: '',
      emailAddress: '',
      phoneNumber: '',
      countryName: '',
      intendedFieldOfStudy: '',
      degreeType: '',
      sports: [],
      clubs: [],
      communityService: '',
      leadershipRoles: [],
      awards: [],
      incomeBracket: '',
      financialNeed: '',
      universityName: '',
      highSchoolName: '',
      gpa: '',
      educationLevel: '',
      cv: {}, // For storing CV metadata if needed
      userId: '', // Assuming you'll need userId for some operations
    };
  });

  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  const updateFormData = useCallback((newData) => {
    setFormData(prevData => ({
      ...prevData,
      ...newData
    }));
  }, []);

  const submitFormData = useCallback(async () => {
    try {
      const response = await fetch('https://somaai.onrender.com/api/user/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin,
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit form data');
      }

      const responseData = await response.json();
      console.log('Submission successful:', responseData);

      // Clear local storage and reset form data after successful submission
      localStorage.removeItem('formData');
      setFormData({
        firstName: '',
        lastName: '',
        middleName: '',
        dateOfBirth: '',
        emailAddress: '',
        phoneNumber: '',
        countryName: '',
        intendedFieldOfStudy: '',
        degreeType: '',
        sports: [],
        clubs: [],
        communityService: '',
        leadershipRoles: [],
        awards: [],
        incomeBracket: '',
        financialNeed: '',
        universityName: '',
        highSchoolName: '',
        gpa: '',
        educationLevel: '',
        cv: {},
        userId: '',
      });

      return true; // Indicates successful submission
    } catch (error) {
      console.error('Error submitting form data:', error);
      return false; // Indicates failed submission
    }
  }, [formData]);

  return (
    <FormDataContext.Provider value={{ formData, updateFormData, submitFormData }}>
      {children}
    </FormDataContext.Provider>
  );
};
