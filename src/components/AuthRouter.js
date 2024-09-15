// src/components/AuthRouter.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { SplashScreen } from './SplashScreen';

export const AuthRouter = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid;
        localStorage.setItem('userId', userId);
        
        // Check if onboarding has been completed
        const onboardingSeen = localStorage.getItem('onboardingSeen');
        if (onboardingSeen === 'true') {
          navigate('/home');
        } else {
          navigate('/onboarding2');
        }
      } else {
        navigate('/singup'); // Redirect to login page when user logs out
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return null;
};

// Logout function (can be used in any component)
export const handleLogout = () => {
  const auth = getAuth();
  signOut(auth).then(() => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('onboardingSeen');
    window.location.href = '/'; // Redirect to the main login page
  }).catch((error) => {
    console.error('Error signing out:', error);
  });
};
