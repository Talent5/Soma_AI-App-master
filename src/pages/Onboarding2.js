import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Welcome/Header';

export const Onboarding2 = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkUserStatus = async () => {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        console.log('No user email found. Redirecting to signup page.');
        navigate('/');
        return;
      }

      setUserEmail(email);

      try {
        const response = await fetch('https://somaai.onrender.com/api/user', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });

        if (!response.ok) {
          throw new Error('Failed to check user profile');
        }

        const profileData = await response.json();
        console.log('Profile check response:', profileData);

        setIsNewUser(!profileData.profileExists);
      } catch (err) {
        console.error('Error checking user profile:', err);
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    checkUserStatus();
  }, [navigate]);

  const handleContinue = () => {
    if (isNewUser) {
      navigate('/onboarding3');
    } else {
      navigate('/home');
    }
  };

  const handleLater = () => {
    localStorage.setItem('onboardingSeen', 'true');
    navigate('/home');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}. Please try logging in again.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-transparent">
        <div className="max-w-2xl w-full bg-transparent p-8 rounded-lg ">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            {isNewUser 
              ? `Welcome, ${userEmail}! Let's get your profile set up.`
              : `Welcome back, ${userEmail}! Would you like to update your profile?`}
          </h1>
          {isNewUser && (
            <ul className="list-disc list-inside mb-6 text-gray-600">
              <li>Personal information</li>
              <li>Educational background</li>
              <li>Field of study</li>
              <li>Extracurricular activities</li>
              <li>Financial information</li>
            </ul>
          )}
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