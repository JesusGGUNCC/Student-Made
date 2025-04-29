// src/routes/OrderConfirmation.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URLS } from '../common/urls';

function OrderConfirmation() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch order details
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URLS.orderGet}?order_id=${orderId}`);
        setOrder(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Failed to load order details. Please check your order history.');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    } else {
      setError('No order ID provided');
      setLoading(false);
    }
  }, [orderId]);

  // Render loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-700 mb-4"></div>
          <p className="text-lg text-gray-600">Loading your order details...</p>
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => navigate('/my-orders')}
              className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800"
            >
              View My Orders
            </button>
            <button 
              onClick={() => navigate('/')}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If no order data
  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-yellow-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find the order information you're looking for.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => navigate('/my-orders')}
              className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800"
            >
              View My Orders
            </button>
            <button 
              onClick={() => navigate('/')}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Success Banner */}
      <div className="bg-green-50 p-6 rounded-lg mb-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
        <p className="text-lg text-gray-600 mb-4">Thank you for your purchase.</p>
        <p className="text-gray-600">
          Your order confirmation number is: <span className="font-bold">{orderId}</span>
        </p>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Order Details */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Order Details</h3>
            <dl className="grid grid-cols-3 gap-2 text-sm">
              <dt className="text-gray-600">Order Date:</dt>
              <dd className="col-span-2">{new Date(order.created_at).toLocaleDateString()}</dd>
              
              <dt className="text-gray-600">Order Status:</dt>
              <dd className="col-span-2">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold 
                  ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'}`}>
                  {order.status}
                </span>
              </dd>
              
              <dt className="text-gray-600">Payment Method:</dt>
              <dd className="col-span-2">Credit Card (ending in {order.payment_id})</dd>
            </dl>
          </div>
          
          {/* Shipping Address */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Shipping Address</h3>
            <address className="not-italic text-sm">
              <p>{order.first_name} {order.last_name}</p>
              <p>{order.address1}</p>
              {order.address2 && <p>{order.address2}</p>}
              <p>{order.city}, {order.state} {order.zip_code}</p>
              <p>{order.country}</p>
              <p className="mt-2">Phone: {order.phone_number}</p>
            </address>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6">Order Items</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Product</th>
                <th className="px-4 py-2 text-center">Quantity</th>
                <th className="px-4 py-2 text-right">Price</th>
                <th className="px-4 py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {order.products.map((item) => (
                <tr key={item.product_id}>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      {item.product_image && (
                        <img 
                          src={item.product_image} 
                          alt={item.product_name}
                          className="h-16 w-16 object-cover rounded mr-4"
                        />
                      )}
                      <div>
                        <p className="font-medium">{item.product_name}</p>
                        <Link to={`/product/${item.product_id}`} className="text-green-600 hover:underline text-xs">
                          View product
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">{item.quantity}</td>
                  <td className="px-4 py-4 text-right">${item.unit_price.toFixed(2)}</td>
                  <td className="px-4 py-4 text-right font-medium">${(item.quantity * item.unit_price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 border-gray-200">
              <tr>
                <td colSpan="3" className="px-4 py-2 text-right font-medium">Subtotal</td>
                <td className="px-4 py-2 text-right">${order.subtotal_amount.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan="3" className="px-4 py-2 text-right font-medium">Tax</td>
                <td className="px-4 py-2 text-right">${order.sales_tax_amount.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan="3" className="px-4 py-2 text-right font-medium">Shipping</td>
                <td className="px-4 py-2 text-right">${order.shipping_fee.toFixed(2)}</td>
              </tr>
              <tr className="font-bold">
                <td colSpan="3" className="px-4 py-2 text-right">Total</td>
                <td className="px-4 py-2 text-right">${order.total_amount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          onClick={() => navigate('/my-orders')}
          className="px-6 py-3 bg-green-700 text-white rounded-md hover:bg-green-800"
        >
          View All Orders
        </button>
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-3 border border-green-700 text-green-800 rounded-md hover:bg-green-50"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default OrderConfirmation;