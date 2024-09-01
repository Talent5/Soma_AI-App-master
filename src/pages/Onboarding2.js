import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Welcome/Header';

export const Onboarding2 = () => {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      console.log('User not verified. Redirecting to signup page.');
      navigate('/onboarding1');  // Assuming '/onboarding1' is your signup page route
    } else {
      console.log('User verified. Email:', userEmail);
      setIsVerified(true);
    }
  }, [navigate]);

  const handleContinue = () => {
    navigate('/onboarding3');
  };

  const handleLater = () => {
    navigate('/home');
  };

  if (!isVerified) {
    return null;  // Or you could return a loading spinner here
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-transparent">
        <div className="max-w-2xl w-full bg-transparent p-8 rounded-lg ">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            Account successfully created. To get your profile fully set up, you'll need to provide the following details:
          </h1>
          <p className="mb-4 text-gray-600">
          </p>
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