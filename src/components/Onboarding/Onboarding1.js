import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../config/firebase';
import { signInWithPopup } from 'firebase/auth';
import IconImage from '../assets/Google.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export const Onboarding1 = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleAuth = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Store user email and user ID in local storage
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userId', user.uid);

      navigate('/onboarding2');
    } catch (err) {
      console.error('Error during Firebase authentication:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="text-center mt-4">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      {isLoading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Authenticating...</p>
        </div>
      ) : (
        <>
          <button
            className="bg-[#1E1548] text-white rounded-full w-full px-2 py-3 flex items-center justify-center mb-4 transition-transform transform hover:bg-[#3a2d78] active:bg-[#1a1038] active:scale-95"
            onClick={handleGoogleAuth}
            aria-label="Sign up with Google"
          >
            <img src={IconImage} alt="Google Icon" className="mr-2" />
            Sign up with Google
          </button>
          
          <p className="text-gray-500 mb-4 px-6">Already have an account, then</p>
          
          <button
            className="text-[#1E1548] border border-[#1E1548] rounded-full px-4 py-3 flex items-center justify-center transition-transform transform hover:bg-[#f0f0f0] active:bg-[#e0e0e0] active:scale-95"
            onClick={handleGoogleAuth}
            aria-label="Log in with Google"
          >
            <img src={IconImage} alt="Google Icon" className="mr-2" />
            Log in with Google
          </button>
        </>
      )}
    </section>
  );
};














