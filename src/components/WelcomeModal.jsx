// src/components/WelcomeModal.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if this is the first visit
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    if (!hasVisitedBefore) {
      setIsOpen(true);
      localStorage.setItem('hasVisitedBefore', 'true');
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-4">Welcome to Niner Mine!</h2>
        <p className="text-gray-600 mb-6 text-center">
          Discover unique products created by UNC Charlotte students and support local talent.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/signup"
            className="bg-green-600 text-white py-2 px-6 rounded-md font-medium text-center hover:bg-green-700 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="border border-green-600 text-green-700 py-2 px-6 rounded-md font-medium text-center hover:bg-green-50 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Log In
          </Link>
          <button
            className="text-gray-500 py-2 px-6 rounded-md font-medium hover:bg-gray-100 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}

export default WelcomeModal;