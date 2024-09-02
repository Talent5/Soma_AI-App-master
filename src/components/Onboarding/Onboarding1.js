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
  const [authStatus, setAuthStatus] = useState(null);
  const [isSigningUp, setIsSigningUp] = useState(false);

  const fetchUserData = useCallback(async () => {
    try {
      const userResponse = await fetch('https://somaai.onrender.com/auth/user', { 
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await userResponse.json();
      console.log('User data received:', userData);

      if (!userData.user) {
        throw new Error('User data not found in response');
      }

      const email = userData.user.email;
      setUserEmail(email);
      localStorage.setItem('userEmail', email);
      console.log('User email stored in localStorage:', email);

      return email;
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err.message || 'An unexpected error occurred while fetching user data');
      return null;
    }
  }, []);

  const handleAuthResult = useCallback(async (authResult, errorMessage, action) => {
    if (authResult === 'success') {
      try {
        const email = await fetchUserData();
        if (!email) {
          throw new Error('Failed to fetch user email');
        }

        const profileCheckResponse = await fetch('https://somaai.onrender.com/api/user', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        
        if (!profileCheckResponse.ok) {
          throw new Error('Failed to check user profile');
        }

        const profileData = await profileCheckResponse.json();
        console.log('Profile check response:', profileData);

        if (profileData.profileExists) {
          setAuthStatus('Profile exists');
          console.log('Profile exists for:', email);
          localStorage.setItem('isOnboarded', 'true');
          setTimeout(() => navigate('/home'), 2000);
        } else if (action === 'signup') {
          setAuthStatus('Signup successful');
          console.log('Signup successful for:', email);
          localStorage.setItem('isVerified', 'true');
          localStorage.setItem('isSigningUp', 'true');
          localStorage.setItem('isOnboarded', 'false');
          setIsSigningUp(true);
          setTimeout(() => navigate('/onboarding2'), 2000);
        } else if (action === 'login') {
          setAuthStatus('Login successful');
          console.log('Login successful for:', email);
          // Check if user has completed onboarding
          if (localStorage.getItem('isOnboarded') === 'true') {
            setTimeout(() => navigate('/home'), 2000);
          } else {
            setTimeout(() => navigate('/onboarding2'), 2000);
          }
        } else {
          throw new Error('Invalid action');
        }
      } catch (err) {
        console.error('Error during authentication process:', err);
        setError(err.message || 'An unexpected error occurred during authentication');
        setAuthStatus('Authentication failed');
      }
    } else if (authResult === 'failure' || errorMessage) {
      setError(errorMessage || 'Authentication failed');
      setAuthStatus('Authentication failed');
      console.log('Authentication failed. Reason:', errorMessage || 'Unknown error');
    }
  }, [navigate, fetchUserData]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authResult = urlParams.get('auth');
    const errorMessage = urlParams.get('error');
    const action = urlParams.get('action');
    handleAuthResult(authResult, errorMessage, action);
  }, [handleAuthResult, location]);

  useEffect(() => {
    // Check if user is in the signup process
    const isSigningUp = localStorage.getItem('isSigningUp') === 'true';
    setIsSigningUp(isSigningUp);
  }, []);

  const initiateGoogleAuth = (action) => {
    const redirectUrl = encodeURIComponent(`${window.location.origin}${location.pathname}`);
    window.location.href = `https://somaai.onrender.com/auth/google?action=${action}&redirect_url=${redirectUrl}`;
  };

  return (
    <section className="text-center mt-8">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {authStatus && (
        <p className={`mb-4 ${authStatus.includes('successful') || authStatus === 'Profile exists' ? 'text-green-500' : 'text-red-500'}`}>
          {authStatus}
        </p>
      )}
      {userEmail && <p className="text-blue-500 mb-4">Authenticated email: {userEmail}</p>}
      {!isSigningUp && !userEmail && (
        <>
          <button className="bg-[#1E1548] text-white rounded-full w-full px-16 py-2 flex items-center justify-center mb-4 transition-transform transform hover:bg-[#3a2d78] active:bg-[#1a1038] active:scale-95" onClick={() => initiateGoogleAuth('signup')} aria-label="Sign up with Google">
            <img src={IconImage} alt="Google Icon" className="mr-2" />
            Sign up with Google
          </button>
          <p className="text-gray-500 mb-4">Already have an account?</p>
          <button className="text-[#1E1548] rounded-full px-16 py-3 flex items-center justify-center border border-blue-800 transition-transform transform hover:bg-[#e0e0e0] active:bg-[#d0d0d0] active:scale-95" onClick={() => initiateGoogleAuth('login')} aria-label="Log in with Google">
            <img src={IconImage} alt="Google Icon" className="mr-2" />
            Log in with Google
          </button>
        </>
      )}
      {isSigningUp && (
        <p className="text-green-500 mb-4">
          You're in the signup process. Please complete the onboarding steps.
        </p>
      )}
    </section>
  );
};















