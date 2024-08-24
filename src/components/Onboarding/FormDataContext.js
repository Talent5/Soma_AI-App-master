import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';

export const FormDataContext = createContext();

export const FormDataProvider = ({ children }) => {
  const [formData, setFormData] = useState(() => {
    const storedData = localStorage.getItem('formData');
    if (storedData) {
      try {
        return JSON.parse(storedData);
      } catch (error) {
        console.error('Error parsing stored form data:', error);
      }
    }
    return {
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
      cv: null, // Assuming this is a File or Blob object
      userId: '',
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
    const formDataToSend = new FormData();

    // Append each field from formData
    for (const [key, value] of Object.entries(formData)) {
      if (key === 'cv' && value) {
        // Handle file separately if cv is a file object
        formDataToSend.append(key, value);
      } else {
        formDataToSend.append(key, value);
      }
    }

    try {
      const response = await fetch('https://somaai.onrender.com/api/user/update', {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include',
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
        cv: null,
        userId: '',
      });

      return true; // Indicates successful submission
    } catch (error) {
      console.error('Error submitting form data:', error);
      return false; // Indicates failed submission
    }
  }, [formData]);

  const contextValue = useMemo(() => ({
    formData,
    updateFormData,
    submitFormData
  }), [formData, updateFormData, submitFormData]);

  return (
    <FormDataContext.Provider value={contextValue}>
      {children}
    </FormDataContext.Provider>
  );
};

