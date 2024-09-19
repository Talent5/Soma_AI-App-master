/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { db } from '../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

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
  userId: null,
};

export const FormDataProvider = ({ children }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserData(currentUser.uid);
      } else {
        setUser(null);
        setFormData(initialFormState);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = useCallback(async (userId) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setFormData((prevData) => ({
          ...prevData,
          ...userData,
          userId: userId,
        }));
      } else {
        // If the user document doesn't exist, just set the userId
        setFormData((prevData) => ({
          ...prevData,
          userId: userId,
        }));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, []);

  useEffect(() => {
    if (formData.userId) {
      localStorage.setItem('formData', JSON.stringify(formData));
    }
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
        throw new Error('User ID is missing. Please sign in and try again.');
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
      return { success: true };
    } catch (error) {
      console.error('Error submitting form data:', error);
      return { success: false, error: error.message };
    }
  }, [formData]);

  const resetFormData = useCallback(() => {
    if (user) {
      setFormData((prevData) => ({
        ...initialFormState,
        userId: user.uid,
        emailAddress: user.email || '',
      }));
    } else {
      setFormData(initialFormState);
    }
    localStorage.removeItem('formData');
  }, [user]);

  const signInWithGoogle = useCallback(async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user);
      await fetchUserData(user.uid);
      return { success: true };
    } catch (error) {
      console.error('Error signing in with Google:', error);
      return { success: false, error: error.message };
    }
  }, [fetchUserData]);

  const contextValue = useMemo(
    () => ({
      formData,
      updateFormData,
      submitFormData,
      resetFormData,
      signInWithGoogle,
      user,
    }),
    [formData, updateFormData, submitFormData, resetFormData, signInWithGoogle, user]
  );

  return (
    <FormDataContext.Provider value={contextValue}>
      {children}
    </FormDataContext.Provider>
  );
};
