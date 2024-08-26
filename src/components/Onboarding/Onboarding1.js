import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Onboarding1 = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('https://somaai.onrender.com/auth/user', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to retrieve user information');
        }

        const userData = await response.json();

        if (userData.user && userData.user.id && userData.user.email) {
          localStorage.setItem('userId', userData.user.id);
          localStorage.setItem('userEmail', userData.user.email);
          navigate('/onboarding2');
        } else {
          throw new Error('Incomplete user information retrieved');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Optionally, you can handle errors more gracefully here, like showing a message to the user
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Welcome to Soma AI!</h1>
      <p className="text-lg mb-4">Setting up your account...</p>
      {/* Optionally, you could add a loading spinner here */}
    </div>
  );
};














