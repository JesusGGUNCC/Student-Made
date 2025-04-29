// src/routes/VendorPortal.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function VendorPortal() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full px-6 py-8 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Vendor Portal</h1>
        <p className="text-gray-600 text-center mb-8">
          Access your vendor dashboard to manage your products, orders, and profile.
        </p>
        <div className="flex flex-col gap-4">
          <Link 
            to="/vendor/login" 
            className="w-full bg-green-700 text-white py-3 rounded-md text-center font-medium hover:bg-green-800"
          >
            Login to Vendor Panel
          </Link>
          <div className="flex flex-col gap-2 text-center">
            <p className="text-gray-600 text-sm">Not a vendor yet?</p>
            <Link 
              to="/becomevendor" 
              className="text-green-700 hover:underline"
            >
              Apply to become a vendor
            </Link>
          </div>
          <div className="border-t border-gray-300 my-4"></div>
          <Link to="/" className="text-center text-green-700 hover:underline">
            Return to Main Site
          </Link>
        </div>
      </div>
    </div>
  );
}

export default VendorPortal;