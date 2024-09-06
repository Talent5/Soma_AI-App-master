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
  userId: localStorage.getItem('userId') || '',
  graduationDate: '',
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
          userId: localStorage.getItem('userId') || parsedData.userId || '',
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
        const fileName = formData.cv.name || 'default_cv_name.pdf';
        const cvRef = ref(storage, `cvs/${formData.userId}_${fileName}`);
        await uploadBytes(cvRef, formData.cv);

        // Get the download URL for the uploaded file
        cvDownloadURL = await getDownloadURL(cvRef);
      }

      // Prepare data for backend API
      const backendData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleName: formData.middleName || '',
        phoneNo: formData.phoneNumber || '',
        nationality: formData.countryName || '',
        level_of_education: formData.educationLevel || '',
        university: formData.universityName || '',
        high_school: formData.highSchoolName || '',
        course: formData.intendedFieldOfStudy || '',
        GPA: formData.gpa || '',
        graduation_date: formData.graduationDate || '',
        date_of_birth: formData.dateOfBirth || '',
        location: formData.countryName || '',
        degree: formData.degreeType || '',
        funds_needed: formData.financialNeed || '',
        uploadedCV: cvDownloadURL || '',
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

      const signUpData = await response.json(); // Assuming API returns JSON data including userId

      // Fetch the model data from the user endpoint using the returned userId
      const userId = signUpData.userId;
      const modelResponse = await fetch(`https://somaai.onrender.com/api/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!modelResponse.ok) {
        throw new Error('Failed to fetch user model data from backend');
      }

      const scholarshipData = await modelResponse.json();

      // Now save the responseData (scholarship data) to Firestore
      const scholarshipDetails = {
        title: scholarshipData.Title || '',
        link: scholarshipData.Link || '',
        location: scholarshipData.Location || '',
        description: scholarshipData.Description || '',
        funds: scholarshipData.Funds || '',
        date_degree: scholarshipData.date_degree || '',
        match_score: scholarshipData.match_score || '',
      };

      const formDataToSave = {
        ...formData,
        cv: cvDownloadURL || '',
        scholarshipDetails, // Store the scholarship data in Firestore under the user's document
      };

      Object.keys(formDataToSave).forEach(key => {
        if (formDataToSave[key] === null || formDataToSave[key] === undefined) {
          delete formDataToSave[key];
        }
      });

      const docRef = doc(db, 'users', formData.userId);
      await setDoc(docRef, formDataToSave, { merge: true });

      console.log('Submission and model data fetch successful, saved to Firestore');

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

