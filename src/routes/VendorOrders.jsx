// src/routes/VendorOrders.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './AuthContent';
import { API_URLS } from '../common/urls';

function VendorOrders() {
  const navigate = useNavigate();
  const { isLoggedIn, user, userRole } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // all, pending, processing, shipped, delivered, cancelled

  // Check if user is logged in and is a vendor
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login?redirect=vendor/orders');
      return;
    }
    
    if (userRole !== 'vendor' && userRole !== 'admin') {
      navigate('/');
      return;
    }
  }, [isLoggedIn, userRole, navigate]);

  // Fetch vendor's orders
  useEffect(() => {
    const fetchVendorOrders = async () => {
      if (!isLoggedIn || !user || userRole !== 'vendor') return;

      try {
        setLoading(true);
        // Here we would typically call an endpoint like /api/vendor/orders
        // Since that's not implemented yet, we'll use the regular orders endpoint for now
        const response = await axios.get(`${API_URLS.orderGet}`);
        
        // In a real implementation, this would filter for orders containing products from this vendor
        setOrders(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching vendor orders:', err);
        setError('Failed to load orders. Please try again later.');
        
        // For development purposes, use mock data
        setOrders([
          {
            id: 101,
            username: 'customer1',
            status: 'Pending',
            total_amount: 125.75,
            created_at: new Date().toISOString(),
            product_count: 2,
            customer_name: 'John Doe'
          },
          {
            id: 102,
            username: 'customer2',
            status: 'Shipped',
            total_amount: 89.99,
            created_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
            product_count: 1,
            customer_name: 'Jane Smith'
          },
          {
            id: 103,
            username: 'customer3',
            status: 'Delivered',
            total_amount: 210.50,
            created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            product_count: 3,
            customer_name: 'Mike Johnson'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorOrders();
  }, [isLoggedIn, user, userRole]);

  // Filter orders based on active tab
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    return order.status.toLowerCase() === activeTab.toLowerCase();
  });

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle order status update
  const handleUpdateStatus = async (orderId, newStatus) => {
    if (!window.confirm(`Are you sure you want to mark this order as ${newStatus}?`)) {
      return;
    }

    try {
      // In a real implementation, this would call an endpoint like /api/vendor/order/update-status
      // await axios.put(`${API_URLS.vendorOrderUpdate}`, { order_id: orderId, status: newStatus });
      
      // For now, just update the local state
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus } 
          : order
      ));
      
      // Show success message (could use a toast notification here)
      alert(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status. Please try again.');
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Vendor Orders</h1>

      {/* Filter tabs */}
      <div className="flex flex-wrap border-b mb-6 overflow-x-auto">
        <button
          className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'all' 
            ? 'border-b-2 border-green-700 text-green-700' 
            : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('all')}
        >
          All Orders
        </button>
        <button
          className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'pending' 
            ? 'border-b-2 border-green-700 text-green-700' 
            : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending
        </button>
        <button
          className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'processing' 
            ? 'border-b-2 border-green-700 text-green-700' 
            : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('processing')}
        >
          Processing
        </button>
        <button
          className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'shipped' 
            ? 'border-b-2 border-green-700 text-green-700' 
            : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('shipped')}
        >
          Shipped
        </button>
        <button
          className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'delivered' 
            ? 'border-b-2 border-green-700 text-green-700' 
            : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('delivered')}
        >
          Delivered
        </button>
        <button
          className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'cancelled' 
            ? 'border-b-2 border-green-700 text-green-700' 
            : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('cancelled')}
        >
          Cancelled
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Empty state */}
      {filteredOrders.length === 0 && !loading && !error && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-500 mb-6">
            {activeTab === 'all' 
              ? "You don't have any orders yet." 
              : `You don't have any ${activeTab} orders.`}
          </p>
        </div>
      )}

      {/* Orders table */}
      {filteredOrders.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.customer_name || order.username}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(order.created_at)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                          order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'Shipped' ? 'bg-indigo-100 text-indigo-800' :
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${order.total_amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link to={`/order/${order.id}`} className="text-green-600 hover:text-green-900">
                          View
                        </Link>
                        
                        {order.status === 'Pending' && (
                          <button 
                            onClick={() => handleUpdateStatus(order.id, 'Processing')}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Process
                          </button>
                        )}
                        
                        {order.status === 'Processing' && (
                          <button 
                            onClick={() => handleUpdateStatus(order.id, 'Shipped')}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Ship
                          </button>
                        )}
                        
                        {order.status === 'Shipped' && (
                          <button 
                            onClick={() => handleUpdateStatus(order.id, 'Delivered')}
                            className="text-green-600 hover:text-green-900"
                          >
                            Mark Delivered
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default VendorOrders;