// src/components/VendorHeader.jsx - New component for vendor dashboard header
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../routes/AuthContent';

function VendorHeader() {
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const businessName = user?.company_name || `${user?.username}'s Store`;

  return (
    <nav className='px-4 sm:px-6 md:px-10 flex justify-between items-center h-[10vh] bg-green-800 text-white'>
      <div className='flex items-center'>
        <Link to="/vendor-profile" className="text-2xl font-bold">
          {businessName}
          <span className="ml-2 text-sm bg-green-700 px-2 py-1 rounded-md">Vendor Portal</span>
        </Link>
      </div>
      
      <div className='flex items-center gap-4'>
        <Link to="/vendor/orders" className="hover:text-gray-300">
          Orders
        </Link>
        <Link to="/" className="hover:text-gray-300">
          View Store
        </Link>
        <button 
          onClick={handleLogout}
          className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default VendorHeader;