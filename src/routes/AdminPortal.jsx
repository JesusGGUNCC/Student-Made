// src/routes/AdminPortal.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function AdminPortal() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full px-6 py-8 bg-white shadow-md rounded-lg">
        <div className="flex justify-center mb-4">
          <div className="bg-green-700 text-white px-4 py-2 rounded-md">
            <span className="font-bold">ADMIN PORTAL</span>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-center mb-6">Admin Portal</h1>
        <p className="text-gray-600 text-center mb-8">
          Access the administrative dashboard to manage vendors, products, and site content.
        </p>
        <div className="flex flex-col gap-4">
          <Link 
            to="/admin/login" 
            className="w-full bg-green-700 text-white py-3 rounded-md text-center font-medium hover:bg-green-800"
          >
            Login to Admin Panel
          </Link>
          <Link to="/" className="text-center text-green-700 hover:underline">
            Return to Main Site
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminPortal;