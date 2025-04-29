// src/routes/OrderDetail.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './AuthContent';
import { API_URLS } from '../common/urls';

function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate(`/login?redirect=order/${orderId}`);
    }
  }, [isLoggedIn, navigate, orderId]);

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!isLoggedIn || !user || !orderId) return;

      try {
        setLoading(true);
        const response = await axios.get(`${API_URLS.orderGet}?order_id=${orderId}&username=${user.username}`);
        setOrder(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError(err.response?.data?.error || 'Failed to load order details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [isLoggedIn, user, orderId]);

  // Handle order cancellation
  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      await axios.put(`${API_URLS.orderCancel}?order_id=${orderId}&username=${user.username}`);
      
      // Update local state
      setOrder({
        ...order,
        status: 'Cancelled'
      });
      
      // Show success message (could use a toast notification here)
      alert('Order cancelled successfully');
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert(err.response?.data?.error || 'Failed to cancel order. Please try again.');
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge color
  const getStatusBadgeClasses = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 p-6 rounded-lg text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link 
            to="/my-orders" 
            className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800"
          >
            Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  // Render if no order found
  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 p-6 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
          <Link 
            to="/my-orders" 
            className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800"
          >
            View My Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Order Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Order #{order.id}</h1>
          <p className="text-gray-600">Placed on {formatDate(order.created_at)}</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeClasses(order.status)}`}>
            {order.status}
          </span>
          
          <Link to="/my-orders" className="text-green-700 hover:underline px-3 py-1">
            Back to Orders
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details & Items (Left/Center) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="text-xl font-semibold">Order Items</h2>
            </div>
            
            <div className="divide-y">
              {order.products.map((item) => (
                <div key={item.product_id} className="p-4 flex items-center">
                  <div className="flex-shrink-0 mr-4">
                    {item.product_image ? (
                      <img 
                        src={item.product_image} 
                        alt={item.product_name}
                        className="h-20 w-20 object-cover rounded"
                      />
                    ) : (
                      <div className="h-20 w-20 bg-gray-200 flex items-center justify-center rounded">
                        <span className="text-gray-400 text-xs">No image</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="font-medium">{item.product_name}</h3>
                    <div className="flex flex-col sm:flex-row sm:justify-between mt-1">
                      <div className="text-sm text-gray-500">
                        Qty: {item.quantity} × ${item.unit_price.toFixed(2)}
                      </div>
                      <div className="font-medium">
                        ${(item.quantity * item.unit_price).toFixed(2)}
                      </div>
                    </div>
                    <div className="mt-2">
                      <Link to={`/product/${item.product_id}`} className="text-green-700 hover:underline text-sm">
                        View Product
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="text-xl font-semibold">Shipping Information</h2>
            </div>
            
            <div className="p-4">
              <address className="not-italic">
                <p className="font-medium">{order.first_name} {order.last_name}</p>
                <p>{order.address1}</p>
                {order.address2 && <p>{order.address2}</p>}
                <p>{order.city}, {order.state} {order.zip_code}</p>
                <p>{order.country}</p>
                <p className="mt-2">Phone: {order.phone_number}</p>
              </address>
            </div>
          </div>
          
          {/* Order Actions */}
          <div className="flex flex-wrap gap-4">
            {order.status === 'Pending' && (
              <button 
                onClick={handleCancelOrder}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Cancel Order
              </button>
            )}
            
            <Link 
              to="/my-orders" 
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Back to Orders
            </Link>
            
            <Link 
              to="/shop-all" 
              className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
        
        {/* Order Summary (Right) */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-6">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="text-xl font-semibold">Order Summary</h2>
            </div>
            
            <div className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${order.subtotal_amount.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>${order.sales_tax_amount.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>${order.shipping_fee.toFixed(2)}</span>
                </div>
                
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${order.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              {/* Payment Method */}
              <div className="mt-6">
                <h3 className="font-medium mb-2">Payment Method</h3>
                <div className="flex items-center bg-gray-50 p-3 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span>Credit Card ending in {order.payment_id}</span>
                </div>
              </div>
              
              {/* Order Status Timeline */}
              <div className="mt-6">
                <h3 className="font-medium mb-2">Order Status</h3>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <div className={`mt-0.5 h-4 w-4 rounded-full ${order.status === 'Pending' || order.status === 'Processing' || order.status === 'Shipped' || order.status === 'Delivered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div className="ml-3">
                      <p className="font-medium">Order Placed</p>
                      <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className={`mt-0.5 h-4 w-4 rounded-full ${order.status === 'Processing' || order.status === 'Shipped' || order.status === 'Delivered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div className="ml-3">
                      <p className="font-medium">Processing</p>
                      <p className="text-sm text-gray-500">
                        {order.status === 'Processing' || order.status === 'Shipped' || order.status === 'Delivered' 
                          ? 'Your order is being processed' 
                          : order.status === 'Cancelled' 
                            ? 'Order cancelled' 
                            : 'Waiting to be processed'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className={`mt-0.5 h-4 w-4 rounded-full ${order.status === 'Shipped' || order.status === 'Delivered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div className="ml-3">
                      <p className="font-medium">Shipped</p>
                      <p className="text-sm text-gray-500">
                        {order.status === 'Shipped' || order.status === 'Delivered' 
                          ? 'Your order has been shipped' 
                          : order.status === 'Cancelled' 
                            ? 'Order cancelled' 
                            : 'Not yet shipped'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className={`mt-0.5 h-4 w-4 rounded-full ${order.status === 'Delivered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div className="ml-3">
                      <p className="font-medium">Delivered</p>
                      <p className="text-sm text-gray-500">
                        {order.status === 'Delivered' 
                          ? 'Your order has been delivered' 
                          : order.status === 'Cancelled' 
                            ? 'Order cancelled' 
                            : 'Not yet delivered'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;