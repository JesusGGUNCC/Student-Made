import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const { cartItems, setCartItems } = useCart();
  const navigate = useNavigate();

  // Increase item quantity with stock checking
  const increaseQuantity = (itemId) => {
    // Find the current item to check its stock
    const currentItem = cartItems.find(item => item.id === itemId);
    
    // Only allow increasing if quantity is below stock
    if (currentItem && currentItem.quantity < currentItem.stock) {
      setCartItems(cartItems.map(item => 
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      ));
    }
    // If already at max stock, do nothing
  };

  // Decrease item quantity
  const decreaseQuantity = (itemId) => {
    setCartItems(cartItems.map(item => 
      item.id === itemId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

  // Remove item from cart
  const removeItem = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const salesTax = calculateSubtotal() * 0.1; // 10% tax rate
  const deliveryFee = 5.99;
  const total = calculateSubtotal() + salesTax + deliveryFee;

  // Handle checkout button click
  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
        {/* Left Side - Bag */}
        <div className="w-full lg:w-2/3">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Bag</h1>
          <div className="space-y-4 sm:space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-4 sm:gap-6 pb-4 border-b">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full sm:w-24 md:w-32 h-48 sm:h-24 md:h-32 object-cover rounded"
                />
                <div className="flex-grow">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                    <div>
                      <h3 className="text-lg font-medium">{item.name}</h3>
                      <p className="text-gray-500 text-sm">{item.description}</p>
                      <p className="text-gray-500 text-sm">{item.size}</p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0">
                      <p className="font-medium">${item.price.toFixed(2)}</p>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="inline-flex items-center border border-gray-300 rounded-full overflow-hidden">
                      <button 
                        onClick={() => decreaseQuantity(item.id)}
                        className="px-3 py-1 hover:bg-gray-100 border-r border-gray-300 focus:outline-none"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="px-4 select-none">{item.quantity}</span>
                      <button 
                        onClick={() => increaseQuantity(item.id)}
                        className="px-3 py-1 hover:bg-gray-100 border-l border-gray-300 focus:outline-none"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    {/* Optional: Display stock info/warning */}
                    {item.stock > 0 && item.quantity >= item.stock && (
                      <p className="text-red-500 text-xs mt-1">
                        Maximum available quantity ({item.stock}) reached
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Empty cart message */}
          {cartItems.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">Your bag is empty</p>
            </div>
          )}
        </div>

        {/* Right Side - Summary */}
        <div className="w-full lg:w-1/3 mt-6 lg:mt-0">
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Summary</h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Sales Tax</span>
                <span>${salesTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-4 border-t font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button 
                onClick={handleCheckout}
                className="w-full bg-black text-white py-3 rounded-full mt-6 hover:bg-gray-800 transition-colors"
                disabled={cartItems.length === 0}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;