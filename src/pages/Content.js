import React from 'react';
import Header from '../components/Welcome/Header';
import WelcomeCard from '../components/Welcome/WelcomeCard';
import {Onboarding1} from '../components/Onboarding/Onboarding1';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import 'bootstrap-icons/font/bootstrap-icons.css'; // Bootstrap Icons

export const Content = () => {
  return (
    <div className="bg-gradient-to-b from-pink-100 to-pink-300 min-h-screen flex flex-col items-center justify-center p-4">
      <Header />
      <WelcomeCard />
      <Onboarding1 />
    </div>
  );
};


