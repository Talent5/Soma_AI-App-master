import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import IconImage from '../assets/Google.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const API_BASE_URL = 'https://somaai.onrender.com';

export const Onboarding1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleAuthResult = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const authResult = urlParams.get('auth');
      const errorMessage = urlParams.get('error');

      if (authResult === 'success') {
        try {
          const userResponse = await fetch(`${API_BASE_URL}/auth/user`, { credentials: 'include' });
          const userData = await userResponse.json();

          if (userData.user) {
            localStorage.setItem('userEmail', userData.user.email);
            localStorage.setItem('userId', userData.user.id);
            
            // Ensure user is created in our database
            const ensureUserResponse = await fetch(`${API_BASE_URL}/api/user/ensure-user`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ 
                userId: userData.user.id, 
                email: userData.user.email,
                name: userData.user.name // Assuming Google provides a name
              })
            });

            const ensureUserData = await ensureUserResponse.json();

            if (ensureUserData.success) {
              navigate('/onboarding2');
            } else {
              throw new Error(ensureUserData.message || 'Failed to create user profile');
            }
          } else {
            throw new Error('User data not found');
          }
        } catch (err) {
          console.error('Error:', err);
          setError(err.message || 'An unexpected error occurred');
        }
      } else if (authResult === 'failure' || errorMessage) {
        setError(errorMessage || 'Authentication failed');
      }
    };

    handleAuthResult();
  }, [navigate]);

  const initiateGoogleAuth = (action) => {
    const redirectUrl = encodeURIComponent(`${window.location.origin}${location.pathname}`);
    window.location.href = `${API_BASE_URL}/auth/google?action=${action}&redirect_url=${redirectUrl}`;
  };

  return (
    <section className="text-center mt-8">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button
        className="bg-[#1E1548] text-white rounded-full w-full px-16 py-2 flex items-center justify-center mb-4 transition-transform transform hover:bg-[#3a2d78] active:bg-[#1a1038] active:scale-95"
        onClick={() => initiateGoogleAuth('signup')}
        aria-label="Sign up with Google"
      >
        <img src={IconImage} alt="Google Icon" className="mr-2" />
        Sign up with Google
      </button>
      <p className="text-gray-500 mb-4">Already have an account?</p>
      <button
        className="text-[#1E1548] rounded-full px-16 py-3 flex items-center justify-center border border-blue-800 transition-transform transform hover:bg-[#e0e0e0] active:bg-[#d0d0d0] active:scale-95"
        onClick={() => initiateGoogleAuth('login')}
        aria-label="Log in with Google"
      >
        <img src={IconImage} alt="Google Icon" className="mr-2" />
        Log in with Google
      </button>
    </section>
  );
};