// Create a new file: src/components/AdminHeader.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function AdminHeader() {
  return (
    <nav className='px-4 sm:px-6 md:px-10 flex justify-between items-center h-[10vh] bg-gray-800 text-white'>
      <div className='flex items-center'>
        <Link to="/admin" className="text-2xl font-bold">Admin Dashboard</Link>
      </div>
      <div className='flex items-center gap-4'>
        <Link to="/" className="hover:text-gray-300">
          Return to Site
        </Link>
        <button className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default AdminHeader;