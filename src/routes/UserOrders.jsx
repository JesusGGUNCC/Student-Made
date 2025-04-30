// src/routes/UserOrders.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './AuthContent';
import { API_URLS } from '../common/urls';

function UserOrders() {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // all, pending, shipped, delivered, cancelled

  // Check if user is logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login?redirect=my-orders');
    }
  }, [isLoggedIn, navigate]);

  // Fetch user's orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isLoggedIn || !user) return;

      try {
        setLoading(true);
        const response = await axios.get(`${API_URLS.orderGet}?username=${user.username}`);
        setOrders(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load your orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isLoggedIn, user]);

  // Filter orders based on active tab
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    return order.status.toLowerCase() === activeTab;
  });

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle order cancellation
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      const response = await axios.put(`${API_URLS.orderCancel}?order_id=${orderId}&username=${user.username}`);
      
      // Update local state to reflect cancellation
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: 'Cancelled' } 
          : order
      ));
      
      // Show success message (could use a toast notification here)
      alert('Order cancelled successfully');
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert(err.response?.data?.error || 'Failed to cancel order. Please try again.');
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
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {/* Filter tabs */}
      <div className="flex flex-wrap border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'all' 
            ? 'border-b-2 border-green-700 text-green-700' 
            : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('all')}
        >
          All Orders
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'pending' 
            ? 'border-b-2 border-green-700 text-green-700' 
            : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'shipped' 
            ? 'border-b-2 border-green-700 text-green-700' 
            : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('shipped')}
        >
          Shipped
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'delivered' 
            ? 'border-b-2 border-green-700 text-green-700' 
            : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('delivered')}
        >
          Delivered
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'cancelled' 
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
              ? "You haven't placed any orders yet." 
              : `You don't have any ${activeTab} orders.`}
          </p>
          <Link 
            to="/shop-all" 
            className="inline-block px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800"
          >
            Start Shopping
          </Link>
        </div>
      )}

      {/* Orders list */}
      {filteredOrders.length > 0 && (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Order header */}
              <div className="bg-gray-50 p-4 border-b">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div>
                    <h3 className="text-lg font-medium">
                      Order #{order.id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Placed on {formatDate(order.created_at)}
                    </p>
                  </div>
                  
                  <div className="flex items-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold 
                      ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Order content */}
              <div className="p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <h4 className="font-medium mb-1">Shipping to:</h4>
                    <p className="text-sm text-gray-600">
                      {order.first_name} {order.last_name}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <h4 className="font-medium mb-1">Total:</h4>
                    <p className="text-xl font-semibold text-green-700">
                      ${order.total_amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.product_count} {order.product_count === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                </div>
                
                {/* Order actions */}
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                  <Link 
                    to={`/order/${order.id}`}
                    className="px-3 py-1 bg-green-700 text-white text-sm rounded hover:bg-green-800"
                  >
                    View Details
                  </Link>
                  
                  {order.status === 'Pending' && (
                    <button 
                      onClick={() => handleCancelOrder(order.id)}
                      className="px-3 py-1 border border-red-600 text-red-600 text-sm rounded hover:bg-red-50"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserOrders;