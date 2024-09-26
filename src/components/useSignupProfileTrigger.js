/* eslint-disable react-hooks/exhaustive-deps */
import { db } from './config/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useRef, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';

export const useSignupProfileTrigger = () => {
  const triggerRecommendationUpdate = useCallback(debounce(async (event) => {
    const userId = localStorage.getItem('userId');
    const authToken = localStorage.getItem('authToken');

    if (!navigator.onLine) {
      console.log('Offline: Recommendation update queued');
      // Implement offline queue logic here
      return;
    }

    try {
      const response = await fetch('https://somaai-ae50218ae5c5.herokuapp.com/trigger-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ event, userId }),
      });
      
      if (response.ok) {
        console.log(`Triggered recommendation update for ${event}`);
      } else {
        throw new Error(`Failed to trigger recommendation update for ${event}`);
      }
    } catch (error) {
      console.error('Error triggering recommendation update:', error);
      // Implement retry logic here
    }
  }, 1000), []); // Debounce for 1 second

  const signupFormRef = useRef(null);
  useEffect(() => {
    if (signupFormRef.current) {
      const handleSubmit = (e) => {
        e.preventDefault();
        triggerRecommendationUpdate('new-signup');
      };
      signupFormRef.current.addEventListener('submit', handleSubmit);
      return () => {
        signupFormRef.current?.removeEventListener('submit', handleSubmit);
      };
    }
  }, [triggerRecommendationUpdate]);

  const profileFormRefs = useRef([]);
  useEffect(() => {
    const handleSubmit = (e) => {
      e.preventDefault();
      triggerRecommendationUpdate('profile-update');
    };

    profileFormRefs.current.forEach((formRef) => {
      formRef.addEventListener('submit', handleSubmit);
    });

    return () => {
      profileFormRefs.current.forEach((formRef) => {
        formRef.removeEventListener('submit', handleSubmit);
      });
    };
  }, [triggerRecommendationUpdate]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      const userDocRef = doc(db, 'users', userId);
      const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
        if (snapshot.metadata.hasPendingWrites) {
          triggerRecommendationUpdate('profile-update');
        }
      });
      return () => unsubscribe();
    }
  }, [triggerRecommendationUpdate]);

  return { signupFormRef, profileFormRefs };
};