/* eslint-disable no-unused-vars */
// src/App.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Routes,
  Route,
  useNavigationType,
  useLocation,
} from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { FormDataProvider } from './components/Onboarding/FormDataContext';
import { AudioProvider } from './components/Welcome/AudioContext';
import { ProgressProvider } from './components/Onboarding/ProgressContext';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { SplashScreen } from './components/SplashScreen';
import {Root} from './pages/Root'
import { Content } from './pages/Content';
import { AuthRouter } from './components/AuthRouter'; // New import
import { Onboarding1 } from './components/Onboarding/Onboarding1';
import { Onboarding2 } from './pages/Onboarding2';
import { Onboarding3 } from './components/Onboarding/Onboarding3';
import { Onboarding4 } from './components/Onboarding/Onboarding4';
import { Onboarding5 } from './components/Onboarding/Onboarding5';
import { Onboarding6 } from './components/Onboarding/Onboarding6';
import { Onboarding7 } from './components/Onboarding/Onboarding7';
import { Onboarding8 } from './components/Onboarding/Onboarding8';
import { Onboarding9 } from './components/Onboarding/Onboarding9';
import { Onboarding10 } from './components/Onboarding/Onboarding10';
import { Onboarding11 } from './components/Onboarding/Onboarding11';
import { Onboarding12 } from './components/Onboarding/Onboarding12';
import { Onboarding13 } from './components/Onboarding/Onboarding13';
import { Onboarding14 } from './components/Onboarding/Onboarding14';
import { Onboarding15 } from './components/Onboarding/Onboarding15';
import { Onboarding16 } from './components/Onboarding/Onboarding16';
import { Onboarding17 } from './components/Onboarding/Onboarding17';
import { Onboarding18 } from './components/Onboarding/Onboarding18';
import { Onboarding19 } from './components/Onboarding/Onboarding19';
import { Onboarding20 } from './components/Onboarding/Onboarding20';
import { Onboarding21 } from './components/Onboarding/Onboarding21';
import { Onboarding22 } from './components/Onboarding/Onboarding22';
import { Onboarding23 } from './components/Onboarding/Onboarding23';
import { Onboarding24 } from './components/Onboarding/Onboarding24';
import { Onboarding25 } from './components/Onboarding/Onboarding25';
import { Onboarding26 } from './components/Onboarding/Onboarding26';
import { Onboarding27 } from './components/Onboarding/Onboarding27';
import { ReviewAndEdit } from './components/Onboarding/ReviewAndEdit';
import DocumentCreate from './components/Documents/DocumentCreate';
import {ApplicationsPage} from './pages/ApplicationsPage';
import { NavBar } from './components/NavBar';
import { ScholarshipsPage } from './pages/ScholarshipsPage'
import ScholarshipDetail  from './pages/ScholarshipDetail';
// import MobileCheckMessage from './MobileCheckMessage';
import { DocumentPage } from './pages/DocumentPage';
import AllRoutes from './routes/AllRoutes';
import './global.css';
import './styleguide.css';
import './App.css';

function RouteEffects() {
  const action = useNavigationType();
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  // useEffect(() => {
  //   const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  //   if (!isMobile) {
  //     // Redirect non-mobile users
  //     navigate('/not-supported');
  //   }
  // }, [navigate]);

  useEffect(() => {
    if (action !== 'POP') {
      window.scrollTo(0, 0);
    }
  }, [action, pathname]);

  useEffect(() => {
    let title = '';
    let metaDescription = '';

    switch (pathname) {
      case '/':
        title = 'Welcome';
        metaDescription = 'Description of the Home Page';
        break;
      default:
        title = '';
        metaDescription = '';
        break;
    }

    if (title) {
      document.title = title;
    }

    if (metaDescription) {
      const metaDescriptionTag = document.querySelector(
        'head > meta[name="description"]'
      );
      if (metaDescriptionTag) {
        metaDescriptionTag.content = metaDescription;
      }
    }
  }, [pathname]);

  return null;
}

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  const shouldShowNavbar = ![
    '/onboarding1',
    '/onboarding2',
    '/onboarding3',
    '/onboarding4',
    '/onboarding5',
    '/onboarding6',
    '/onboarding7',
    '/onboarding8',
    '/onboarding9',
    '/onboarding10',
    '/onboarding11',
    '/onboarding12',
    '/onboarding13',
    '/onboarding14',
    '/onboarding15',
    '/onboarding16',
    '/onboarding17',
    '/onboarding18',
    '/onboarding19',
    '/onboarding20',
    '/onboarding21',
    '/onboarding22',
    '/onboarding23',
    '/onboarding24',
    '/onboarding25',
    '/onboarding26',
    '/onboarding27',
    '/create',
    '/profile',
    '/personal-information',
    '/',
    '/singup',
    '/educational-information',
    '/field-of-study',
    '/extracurricular-activities',
    '/financial-information',
    '/not-supported'
  ].includes(location.pathname);

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <AudioProvider>
        <ProgressProvider>
          {/* <MobileCheckMessage /> */}
          {showSplash ? (
            <SplashScreen />
          ) : (
            <FormDataProvider>
              <RouteEffects />
              {shouldShowNavbar && <NavBar location={location} />}
              <Routes>
                <Route path="/" element={<Content />} />
                <Route path="/singup" element={<Content />} />
                <Route path="/onboarding1" element={<Onboarding1 />} />
                <Route path="/onboarding2" element={<Onboarding2 />} />
                <Route path="/onboarding3" element={<Onboarding3 />} />
                <Route path="/onboarding4" element={<Onboarding4 />} />
                <Route path="/onboarding5" element={<Onboarding5 />} />
                <Route path="/onboarding6" element={<Onboarding6 />} />
                <Route path="/onboarding7" element={<Onboarding7 />} />
                <Route path="/onboarding8" element={<Onboarding8 />} />
                <Route path="/onboarding9" element={<Onboarding9 />} />
                <Route path="/onboarding10" element={<Onboarding10 />} />
                <Route path="/onboarding11" element={<Onboarding11 />} />
                <Route path="/onboarding12" element={<Onboarding12 />} />
                <Route path="/onboarding13" element={<Onboarding13 />} />
                <Route path="/onboarding14" element={<Onboarding14 />} />
                <Route path="/onboarding15" element={<Onboarding15 />} />
                <Route path="/onboarding16" element={<Onboarding16 />} />
                <Route path="/onboarding17" element={<Onboarding17 />} />
                <Route path="/onboarding18" element={<Onboarding18 />} />
                <Route path="/onboarding19" element={<Onboarding19 />} />
                <Route path="/onboarding20" element={<Onboarding20 />} />
                <Route path="/onboarding21" element={<Onboarding21 />} />
                <Route path="/onboarding22" element={<Onboarding22 />} />
                <Route path="/onboarding23" element={<Onboarding23 />} />
                <Route path="/onboarding24" element={<Onboarding24 />} />
                <Route path="/onboarding25" element={<Onboarding25 />} />
                <Route path="/onboarding26" element={<Onboarding26 />} />
                <Route path="/onboarding27" element={<Onboarding27 />} />
                <Route path="/review-edit" element={<ReviewAndEdit />} />
                <Route path="/home" element={<Root />} />
                <Route path="/Scholarships" element={<ScholarshipsPage />} />
                <Route path="/scholarship/:id" element={<ScholarshipDetail />} /> 
                <Route path="/documents" element={<DocumentPage />} />
                <Route path="/applications" element={<ApplicationsPage />} />
                <Route path="/create" element={<DocumentCreate />} />
                <Route path="*" element={<AllRoutes />} />

              </Routes>
            </FormDataProvider>
          )}
        </ProgressProvider>
      </AudioProvider>
    </GoogleOAuthProvider>
  );
}

export default App;