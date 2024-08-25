import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';

export const FormDataContext = createContext();

const initialFormState = {
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
};

export const FormDataProvider = ({ children }) => {
  const [formData, setFormData] = useState(() => {
    const storedData = localStorage.getItem('formData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        return { ...parsedData, userId: localStorage.getItem('userId') };
      } catch (error) {
        console.error('Error parsing stored form data:', error);
        return { ...initialFormState, userId: localStorage.getItem('userId') };
      }
    }
    return { ...initialFormState, userId: localStorage.getItem('userId') };
  });

  useEffect(() => {
    const saveData = () => {
      localStorage.setItem('formData', JSON.stringify(formData));
    };
    const timeoutId = setTimeout(saveData, 500);
    return () => clearTimeout(timeoutId);
  }, [formData]);

  const updateFormData = useCallback((newData) => {
    setFormData(prevData => ({
      ...prevData,
      ...newData
    }));
  }, []);

  const submitFormData = useCallback(async () => {
    try {
      const userId = formData.userId || localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found. Please log in again.');
      }

      console.log('Submitting form data:', { ...formData, userId });

      const response = await fetch('https://somaai.onrender.com/api/user/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin,
        },
        credentials: 'include',
        body: JSON.stringify({ ...formData, userId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Submission successful:', responseData);
      localStorage.removeItem('formData');
      setFormData(initialFormState);
      return { success: true, data: responseData };
    } catch (error) {
      console.error('Error submitting form data:', error);
      return { success: false, error: error.message };
    }
  }, [formData]);

  const resetFormData = useCallback(() => {
    localStorage.removeItem('formData');
    setFormData(initialFormState);
  }, []);

  const contextValue = useMemo(() => ({
    formData,
    updateFormData,
    submitFormData,
    resetFormData
  }), [formData, updateFormData, submitFormData, resetFormData]);

  return (
    <FormDataContext.Provider value={contextValue}>
      {children}
    </FormDataContext.Provider>
  );
};