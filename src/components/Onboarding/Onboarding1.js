import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import IconImage from '../assets/Google.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export const Onboarding1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [signupStatus, setSignupStatus] = useState(null);

  const handleGoogleAuthSuccess = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('data');
    
    if (email) {
      console.log('Google Auth Success. Email:', email);
      setUserEmail(email);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('isVerified', 'true');
      setSignupStatus('Signup successful');
      setTimeout(() => navigate('/onboarding2'), 2000);
    } else {
      console.error('No email found in Google Auth Success URL');
      setError('Authentication failed: No email received');
    }
  }, [navigate]);

  useEffect(() => {
    if (window.location.pathname === '/auth/google/success') {
      handleGoogleAuthSuccess();
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      const authResult = urlParams.get('auth');
      const errorMessage = urlParams.get('error');
      const action = urlParams.get('action');
      if (authResult || errorMessage || action) {
        handleAuthResult(authResult, errorMessage, action);
      }
    }
  }, [handleGoogleAuthSuccess, location]);

  const handleAuthResult = useCallback((authResult, errorMessage, action) => {
    if (authResult === 'success') {
      setSignupStatus('Signup successful');
      setTimeout(() => navigate('/onboarding2'), 2000);
    } else if (authResult === 'failure' || errorMessage) {
      setError(errorMessage || 'Authentication failed');
      setSignupStatus('Signup failed');
      console.log('Signup failed. Reason:', errorMessage || 'Unknown error');
    }
  }, [navigate]);

  const initiateGoogleAuth = (action) => {
    const redirectUrl = encodeURIComponent(`${window.location.origin}/onboarding1`);
    window.location.href = `https://somaai.onrender.com/auth/google?action=${action}&redirect_url=${redirectUrl}`;
  };

  return (
    <section className="text-center mt-8">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {signupStatus && (
        <p className={`mb-4 ${signupStatus.includes('successful') ? 'text-green-500' : 'text-red-500'}`}>
          {signupStatus}
        </p>
      )}
      {userEmail && <p className="text-blue-500 mb-4">Authenticated email: {userEmail}</p>}
      <button className="bg-[#1E1548] text-white rounded-full w-full px-16 py-2 flex items-center justify-center mb-4 transition-transform transform hover:bg-[#3a2d78] active:bg-[#1a1038] active:scale-95" onClick={() => initiateGoogleAuth('signup')} aria-label="Sign up with Google">
        <img src={IconImage} alt="Google Icon" className="mr-2" />
        Sign up with Google
      </button>
      <p className="text-gray-500 mb-4">Already have an account?</p>
      <button className="text-[#1E1548] rounded-full px-16 py-3 flex items-center justify-center border border-blue-800 transition-transform transform hover:bg-[#e0e0e0] active:bg-[#d0d0d0] active:scale-95" onClick={() => initiateGoogleAuth('login')} aria-label="Log in with Google">
        <img src={IconImage} alt="Google Icon" className="mr-2" />
        Log in with Google
      </button>
    </section>
  );
};
















