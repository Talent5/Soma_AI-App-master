import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Welcome/Header';

export const Onboarding2 = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const userEmail = localStorage.getItem('userEmail');

        if (!userId || !userEmail) {
          throw new Error('User information not found in local storage');
        }

        const response = await fetch('https://somaai.onrender.com/api/user/info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, email: userEmail }),
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user information');
        }

        const data = await response.json();
        setUserInfo(data);
      } catch (err) {
        console.error('Error fetching user info:', err);
        setError(err.message);
      }
    };

    fetchUserInfo();
  }, []);

  const handleContinue = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch('https://somaai.onrender.com/api/user/confirm-onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, step: 'onboarding2' }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to confirm onboarding step');
      }

      navigate('/onboarding3');
    } catch (err) {
      console.error('Error confirming onboarding step:', err);
      setError(err.message);
    }
  };

  const handleLater = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch('https://somaai.onrender.com/api/user/skip-onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to skip onboarding');
      }

      navigate('/home');
    } catch (err) {
      console.error('Error skipping onboarding:', err);
      setError(err.message);
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-transparent">
        <div className="max-w-2xl w-full bg-transparent p-8 rounded-lg">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            Welcome, {userInfo.name}! To get your profile fully set up, you'll need to provide the following details:
          </h1>
          <ul className="list-disc list-inside mb-6 text-gray-600">
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
              Continue
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