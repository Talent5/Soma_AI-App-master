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
  cv: null, // CV is initially null
  userId: localStorage.getItem('userId') || '', // Get userId from localStorage if available
  graduationDate: '', // Added this field for graduation date
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
          userId: localStorage.getItem('userId') || parsedData.userId || '', // Ensure userId is set
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
    setFormData(prevData => ({
      ...prevData,
      ...newData,
    }));
  }, []);

  const submitFormData = useCallback(async () => {
    const storage = getStorage();
    let cvDownloadURL = null;

    try {
      // Ensure userId is available
      if (!formData.userId) {
        throw new Error('User ID is missing. Please try again.');
      }

      // If there's a CV file, upload it to Firebase Storage
      if (formData.cv) {
        const fileName = formData.cv.name || 'default_cv_name.pdf'; // Fallback to a default file name if `formData.cv.name` is undefined
        const cvRef = ref(storage, `cvs/${formData.userId}_${fileName}`);
        await uploadBytes(cvRef, formData.cv);

        // Get the download URL for the uploaded file
        cvDownloadURL = await getDownloadURL(cvRef);
      }

      // Prepare data for backend API, mapping fields to expected names
      const backendData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleName: formData.middleName || '', // If no middle name provided, set it to an empty string
        phoneNo: formData.phoneNumber || '',
        nationality: formData.countryName || '',
        level_of_education: formData.educationLevel || '',
        university: formData.universityName || '',
        high_school: formData.highSchoolName || '',
        course: formData.intendedFieldOfStudy || '',
        GPA: formData.gpa || '',
        graduation_date: formData.graduationDate || '', // Assuming you have a field for graduation date
        date_of_birth: formData.dateOfBirth || '',
        location: formData.countryName || '', // Assuming location is the same as country
        degree: formData.degreeType || '',
        funds_needed: formData.financialNeed || '',
        uploadedCV: cvDownloadURL || '', // URL of the uploaded CV
      };

      // Send form data to the Node.js backend API
      const response = await fetch('https://somaai.onrender.com/api/user/ai-model', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData),
      });

      if (!response.ok) {
        throw new Error('Failed to send data to backend API');
      }

      // Prepare data to store in Firestore, including the CV download URL if it exists
      const formDataToSave = {
        ...formData,
        cv: cvDownloadURL || '', // Save the download URL, or an empty string if no CV was uploaded
      };

      // Remove any fields that are explicitly null or undefined
      Object.keys(formDataToSave).forEach(key => {
        if (formDataToSave[key] === null || formDataToSave[key] === undefined) {
          delete formDataToSave[key];
        }
      });

      // Save form data to Firestore
      const docRef = doc(db, 'users', formData.userId);
      await setDoc(docRef, formDataToSave, { merge: true });

      console.log('Submission successful to both Firestore and backend');

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
    resetFormData,
  }), [formData, updateFormData, submitFormData, resetFormData]);

  return (
    <FormDataContext.Provider value={contextValue}>
      {children}
    </FormDataContext.Provider>
  );
};
