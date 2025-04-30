// src/components/VendorApplicationStatus.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_URLS } from '../common/urls';
import { AuthContext } from '../routes/AuthContent';

function VendorApplicationStatus() {
  const [status, setStatus] = useState('none'); // none, pending, approved, rejected
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isLoggedIn, user } = useContext(AuthContext);

  useEffect(() => {
    if (isLoggedIn && user) {
      checkApplicationStatus();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, user]);

  const checkApplicationStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URLS.vendorApplicationStatus}?username=${user.username}`);
      setStatus(response.data.status);
      setError(null);
    } catch (error) {
      console.error('Error checking vendor application status:', error);
      setError('Failed to check application status. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Checking application status...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  // Always show something, even if there's no application
  if (status === 'none') {
    return (
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
        <h3 className="font-medium text-blue-800">Become a Vendor</h3>
        <p className="text-blue-700 text-sm mt-1">
          You haven't applied to be a vendor yet. 
          <Link to="/becomevendor" className="underline ml-1">Apply now</Link>
        </p>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-lg mb-6 ${
      status === 'pending' ? 'bg-yellow-50 border border-yellow-200' :
      status === 'approved' ? 'bg-green-50 border border-green-200' :
      'bg-red-50 border border-red-200'
    }`}>
      <h3 className={`font-medium ${
        status === 'pending' ? 'text-yellow-800' :
        status === 'approved' ? 'text-green-800' :
        'text-red-800'
      }`}>
        Vendor Application {status === 'pending' ? 'In Review' : status === 'approved' ? 'Approved' : 'Rejected'}
      </h3>
     
      {status === 'pending' && (
        <p className="text-yellow-700 text-sm mt-1">
          Your application is being reviewed. We'll notify you once a decision has been made.
        </p>
      )}
     
      {status === 'approved' && (
        <p className="text-green-700 text-sm mt-1">
          Congratulations! Your vendor application has been approved. You can now add products.
        </p>
      )}
     
      {status === 'rejected' && (
        <p className="text-red-700 text-sm mt-1">
          Unfortunately, your application was not approved at this time. You may apply again with updated information.
          <Link to="/becomevendor" className="underline ml-1">Apply again</Link>
        </p>
      )}
    </div>
  );
}

export default VendorApplicationStatus;