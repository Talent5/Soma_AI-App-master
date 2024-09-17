/* eslint-disable no-unused-vars */
// src/components/MobileCheckMessage.js
import React, { useState, useEffect } from 'react';

function MobileCheckMessage() {
  const [isMobile, setIsMobile] = useState(true);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const isMobileDevice = /Mobi|Android/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
      if (!isMobileDevice) {
        setShowMessage(true);
      } else {
        setShowMessage(false);
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return showMessage ? (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800 p-4">
      <h1 className="text-2xl font-semibold mb-4">Not Supported</h1>
      <p className="text-base">
        This app is best viewed on a mobile device using the latest version of Google Chrome or Safari.
      </p>
    </div>
  ) : null;
}

export default MobileCheckMessage;