import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { db } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
  cv: null,
  userId: localStorage.getItem('userId'),
};

export const FormDataProvider = ({ children }) => {
  const [formData, setFormData] = useState(() => {
    const storedData = localStorage.getItem('formData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        return {
          ...initialFormState,
          ...parsedData,
          userId: localStorage.getItem('userId'),
        };
      } catch (error) {
        console.error('Error parsing stored form data:', error);
        return initialFormState;
      }
    }
    return initialFormState;
  });

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

  const submitFormData = useCallback(async () => {
    const storage = getStorage();
    let cvDownloadURL = null;

    try {
      if (!formData.userId) {
        throw new Error('User ID is missing. Please try again.');
      }

      // Upload CV if present
      if (formData.cv) {
        const fileName = formData.cv.name || 'default_cv_name.pdf';
        const cvRef = ref(storage, `cvs/${formData.userId}_${fileName}`);
        await uploadBytes(cvRef, formData.cv);
        cvDownloadURL = await getDownloadURL(cvRef);
      }

      // Prepare data to store in Firestore
      const formDataToSave = {
        ...formData,
        cv: cvDownloadURL || '',
      };

      // Remove null/undefined values
      Object.keys(formDataToSave).forEach((key) => {
        if (formDataToSave[key] === null || formDataToSave[key] === undefined) {
          delete formDataToSave[key];
        }
      });

      const docRef = doc(db, 'users', formData.userId);
      await setDoc(docRef, formDataToSave, { merge: true });

      console.log('Submission successful');
      localStorage.removeItem('formData');
      setFormData(initialFormState);

      return { success: true };
    } catch (error) {
      console.error('Error submitting form data:', error);
      return { success: false, error: error.message };
    }
  }, [formData]);

  const resetFormData = useCallback(() => {
    localStorage.removeItem('formData');
    setFormData(initialFormState);
  }, []);

  const contextValue = useMemo(
    () => ({
      formData,
      updateFormData,
      submitFormData,
      resetFormData,
    }),
    [formData, updateFormData, submitFormData, resetFormData]
  );

  return (
    <FormDataContext.Provider value={contextValue}>
      {children}
    </FormDataContext.Provider>
  );
};
