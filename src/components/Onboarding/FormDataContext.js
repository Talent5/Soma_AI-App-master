/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { db } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useSignupProfileTrigger } from '../useSignupProfileTrigger'; // Make sure you have this hook

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
  preferredLocation: '',
  cv: null, 
};

export const FormDataProvider = ({ children }) => {
  const [formData, setFormData] = useState(() => {
    const storedData = localStorage.getItem('formData');
    const userId = localStorage.getItem('userId');

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        return {
          ...initialFormState,
          ...parsedData,
          userId: userId || '',
        };
      } catch (error) {
        console.error('Error parsing stored form data:', error);
        return { ...initialFormState, userId: userId || '' };
      }
    }

    return { ...initialFormState, userId: userId || '' };
  });

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId && storedUserId !== formData.userId) {
      setFormData((prevData) => ({
        ...prevData,
        userId: storedUserId,
      }));
    }
  }, []);

  useEffect(() => {
    const saveData = () => {
      localStorage.setItem('formData', JSON.stringify(formData));
    };

    const timeoutId = setTimeout(saveData, 500);
    return () => clearTimeout(timeoutId);
  }, [formData]);

  const updateFormData = useCallback((newData) => {
    setFormData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  }, []);

  const { signupFormRef, profileFormRefs } = useSignupProfileTrigger();

  const triggerModelRun = async () => {
          try {
              const response = await fetch('https://somaai-ae50218ae5c5.herokuapp.com/run', {
                  method: 'GET',
              });

              if (!response.ok) {
                  throw new Error('Failed to trigger model run');
              }

              const result = await response.json();
              console.log("Model triggered successfully:", result);
          } catch (error) {
              console.error('Error triggering model:', error);
          }
      };


  const submitFormData = useCallback(async () => {
    const storage = getStorage();
    let cvDownloadURL = null;

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID is missing. Please try again.');
      }

      if (formData.cv) {
        const fileName = formData.cv.name || 'default_cv_name.pdf';
        const cvRef = ref(storage, `cvs/${userId}_${fileName}`);
        await uploadBytes(cvRef, formData.cv);
        cvDownloadURL = await getDownloadURL(cvRef);
      }

      const formDataToSave = {
        ...formData,
        userId,
        cv: cvDownloadURL || '',
      };

      Object.keys(formDataToSave).forEach((key) => {
        if (formDataToSave[key] === null || formDataToSave[key] === undefined) {
          delete formDataToSave[key];
        }
      });

      const docRef = doc(db, 'users', userId);
      await setDoc(docRef, formDataToSave, { merge: true });


      console.log('Submission successful');
      setFormData({ ...initialFormState, userId });

      return { success: true }; 
    } catch (error) {
      console.error('Error submitting form data:', error);
      return { success: false, error: error.message }; 
    }
  }, [formData]);


  const resetFormData = useCallback(() => {
    const userId = localStorage.getItem('userId');
    setFormData({ ...initialFormState, userId });
  }, []);

  const contextValue = useMemo(
    () => ({
      formData,
      updateFormData,
      submitFormData,
      resetFormData,
      isOnline,
    }),
    [formData, updateFormData, submitFormData, resetFormData, isOnline]
  );

  return (
    <FormDataContext.Provider value={contextValue}>
      {children}
      {isLoading && <div>Generating Recommendations...</div>} 
    </FormDataContext.Provider>
  );
};