import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Header from '../components/Welcome/Header';

export const Onboarding2 = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const email = user.email;
        const userId = user.uid; // Get user ID from Firebase Authentication
        setUserEmail(email);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userId', userId); // Store user ID in local storage
        const metadata = user.metadata;
        const isUserNew = metadata.creationTime === metadata.lastSignInTime;
        setIsNewUser(isUserNew);
        setIsLoading(false);
      } else {
        setError('User not signed in');
        navigate('/onboarding1'); // Redirect to onboarding1 if not signed in
      }
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [navigate]);

  const handleContinue = () => {
    navigate('/onboarding3'); // Always navigate to onboarding3
  };

  const handleLater = () => {
    localStorage.setItem('onboardingSeen', 'true');
    localStorage.removeItem('userId'); // Remove user ID from local storage
    navigate('/home'); // Navigate to home if "I'll do this later" is clicked
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}. Please try logging in again.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-transparent">
        <div className="max-w-2xl w-full p-8">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            {isNewUser
              ? `Account successfully created. To get your profile fully set up, you'll need to provide the following details:`
              : `Welcome back, ${userEmail}! Let's update your profile information:`}
          </h1>
          <ul className="list-disc list-inside mb-6 text-gray-700">
            <li>Personal information</li>
            <li>Educational background</li>
            <li>Field of study</li>
            <li>Extracurricular activities</li>
            <li>Financial information</li>
          </ul>
          <div className="flex flex-col space-y-4">
            <button
              onClick={handleContinue}
              className="bg-[#1E1548] rounded-full hover:bg-blue-600 text-white font-bold py-2 px-4 w-full"
            >
              {isNewUser ? "Continue" : "Update Profile"}
            </button>
            <button
              onClick={handleLater}
              className="bg-transparent hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded w-full"
            >
              I'll do this later
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};



