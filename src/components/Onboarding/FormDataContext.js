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
  cv: {}, // This will hold the file object initially
  userId: '',
};

export const FormDataProvider = ({ children }) => {
  const [formData, setFormData] = useState(() => {
    const storedData = localStorage.getItem('formData');
    if (storedData) {
      try {
        return JSON.parse(storedData);
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
    setFormData(prevData => ({
      ...prevData,
      ...newData
    }));
  }, []);

  const submitFormData = useCallback(async () => {
    const storage = getStorage();
    let cvDownloadURL = null;

    try {
      // If there's a CV file, upload it to Firebase Storage
      if (formData.cv && formData.cv.name) {
        const cvRef = ref(storage, `cvs/${formData.userId}_${formData.cv.name}`);
        const uploadResult = await uploadBytes(cvRef, formData.cv);

        // Get the download URL for the uploaded file
        cvDownloadURL = await getDownloadURL(uploadResult.ref);
      }

      // Prepare data to store in Firestore, including the CV download URL if it exists
      const formDataToSave = {
        ...formData,
        cv: cvDownloadURL || '', // Save the download URL, or an empty string if no CV was uploaded
      };

      // Save form data to Firestore
      const docRef = doc(db, 'users', formData.userId);
      await setDoc(docRef, formDataToSave);

      console.log('Submission successful');

      // Clear local storage and reset form data after successful submission
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
