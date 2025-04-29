// src/routes/AdminDashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_URLS } from '../common/urls';
import { AuthContext } from './AuthContent';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isLoggedIn, userRole } = useContext(AuthContext);
  const navigate = useNavigate();

  // Check if user is admin
  useEffect(() => {
    if (!isLoggedIn || userRole !== 'admin') {
      navigate('/login');
    }
  }, [isLoggedIn, userRole, navigate]);

  // Fetch vendor applications
  useEffect(() => {
    if (activeTab === 'applications') {
      fetchApplications();
    }
  }, [activeTab]);

  const fetchApplications = async (status = '') => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URLS.adminVendorApplications}${status ? `?status=${status}` : ''}`);
      setApplications(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError('Failed to load vendor applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Process vendor application
  const processApplication = async (applicationId, status) => {
    try {
      await axios.put(`${API_URLS.adminVendorApplication}/${applicationId}`, { status });
      // Refresh the list
      fetchApplications();
    } catch (error) {
      console.error('Error processing application:', error);
      setError('Failed to process the application. Please try again.');
    }
  };

  // Filter applications by status
  const handleStatusFilter = (status) => {
    fetchApplications(status);
  };

  // Render application status badge
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">Pending</span>;
      case 'approved':
        return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Approved</span>;
      case 'rejected':
        return <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'applications' ? 'border-b-2 border-green-700 text-green-700' : 'text-gray-500'}`}
          onClick={() => setActiveTab('applications')}
        >
          Vendor Applications
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'products' ? 'border-b-2 border-green-700 text-green-700' : 'text-gray-500'}`}
          onClick={() => setActiveTab('products')}
        >
          Manage Products
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'users' ? 'border-b-2 border-green-700 text-green-700' : 'text-gray-500'}`}
          onClick={() => setActiveTab('users')}
        >
          Manage Users
        </button>
      </div>

      {/* Applications Tab Content */}
      {activeTab === 'applications' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Vendor Applications</h2>
            <div className="flex gap-2">
              <button
                onClick={() => handleStatusFilter('')}
                className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
              >
                All
              </button>
              <button
                onClick={() => handleStatusFilter('pending')}
                className="px-3 py-1 text-sm border rounded hover:bg-gray-50 text-yellow-700"
              >
                Pending
              </button>
              <button
                onClick={() => handleStatusFilter('approved')}
                className="px-3 py-1 text-sm border rounded hover:bg-gray-50 text-green-700"
              >
                Approved
              </button>
              <button
                onClick={() => handleStatusFilter('rejected')}
                className="px-3 py-1 text-sm border rounded hover:bg-gray-50 text-red-700"
              >
                Rejected
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p>Loading applications...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
              {error}
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No applications found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product Types
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {applications.map((app) => (
                    <tr key={app.id}>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{app.name}</div>
                        {app.company_name && (
                          <div className="text-sm text-gray-500">{app.company_name}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">{app.email}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex flex-wrap gap-1">
                          {app.product_types.map((type) => (
                            <span
                              key={type}
                              className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded"
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">{renderStatusBadge(app.status)}</td>
                      <td className="px-4 py-3 text-sm">
                        {new Date(app.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        {app.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => processApplication(app.id, 'approved')}
                              className="bg-green-600 hover:bg-green-700 text-white text-xs py-1 px-2 rounded"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => processApplication(app.id, 'rejected')}
                              className="bg-red-600 hover:bg-red-700 text-white text-xs py-1 px-2 rounded"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        <button
                          className="text-blue-600 hover:text-blue-800 text-sm mt-1"
                          onClick={() => {
                            // Open modal with application details
                            // This will be implemented in a future step
                          }}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Products Tab Content */}
      {activeTab === 'products' && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Product management will be implemented in a future step</p>
        </div>
      )}

      {/* Users Tab Content */}
      {activeTab === 'users' && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">User management will be implemented in a future step</p>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;