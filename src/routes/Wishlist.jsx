import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { cartItems, setCartItems } = useCart();
  
  // Track quantities for each wishlist item
  const [quantities, setQuantities] = useState(
    wishlistItems.reduce((acc, item) => ({ ...acc, [item.id]: 1 }), {})
  );

  // Check if item is already in cart
  const isItemInCart = (itemId) => {
    return cartItems.some(cartItem => cartItem.id === itemId);
  };

  // Get existing item quantity in cart
  const getCartItemQuantity = (itemId) => {
    const cartItem = cartItems.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  // Handle quantity change
  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity >= 1) {
      setQuantities({
        ...quantities,
        [itemId]: newQuantity
      });
    }
  };

  // Add to cart with controlled quantity
  const addToCart = (item) => {
    const quantity = quantities[item.id] || 1;
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      // Update existing item quantity
      setCartItems(cartItems.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + quantity }
          : cartItem
      ));
    } else {
      // Add new item with specified quantity
      setCartItems([...cartItems, { ...item, quantity }]);
    }
    
    // Reset quantity to 1 after adding to cart
    setQuantities({
      ...quantities,
      [item.id]: 1
    });
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">My Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <p className="text-gray-500 text-lg mb-6">Your wishlist is empty</p>
          <Link to="/shop-all" className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition-colors font-medium inline-block">
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlistItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {/* Image section */}
              <div className="relative h-56 overflow-hidden">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const parent = e.target.parentNode;
                      if (!parent.querySelector('.no-image-text')) {
                        const noImageDiv = document.createElement('div');
                        noImageDiv.className = 'w-full h-full flex items-center justify-center bg-white no-image-text';
                        noImageDiv.innerHTML = '<span class="text-gray-500 text-lg font-medium">No Image</span>';
                        parent.appendChild(noImageDiv);
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white">
                    <span className="text-gray-500 text-lg font-medium">No Image</span>
                  </div>
                )}
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {/* Content section */}
              <div className="p-5">
                <h3 className="font-semibold text-xl mb-2 text-gray-800">{item.name}</h3>
                {item.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                )}
                <div className="font-bold text-green-700 text-xl mb-4">
                  ${typeof item.price === 'number' ? item.price.toFixed(2) : parseFloat(item.price).toFixed(2)}
                </div>
                
                {/* Actions section */}
                <div className="mt-4 space-y-3">
                  <Link 
                    to={`/product/${item.id}`}
                    className="text-green-700 hover:text-green-900 hover:underline flex items-center font-medium"
                  >
                    <span>View Details</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </Link>
                  
                  {isItemInCart(item.id) ? (
                    <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-100">
                      <span className="text-green-700 font-medium">
                        In Cart: {getCartItemQuantity(item.id)}
                      </span>
                      <Link 
                        to="/cart" 
                        className="text-green-700 hover:text-green-900 hover:underline flex items-center"
                      >
                        <span>View Cart</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </Link>
                    </div>
                  ) : (
                    <div className="flex items-center mt-2 h-10">
                      <div className="flex border border-gray-300 rounded-l-lg overflow-hidden">
                        <button 
                          onClick={() => handleQuantityChange(item.id, (quantities[item.id] || 1) - 1)}
                          className="w-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                          disabled={(quantities[item.id] || 1) <= 1}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <div className="w-10 flex items-center justify-center border-l border-r border-gray-300">
                          {quantities[item.id] || 1}
                        </div>
                        <button 
                          onClick={() => handleQuantityChange(item.id, (quantities[item.id] || 1) + 1)}
                          className="w-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                      <button 
                        onClick={() => addToCart(item)}
                        className="flex-1 h-full bg-green-700 text-white rounded-r-lg hover:bg-green-800 transition-colors flex items-center justify-center font-medium"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Add to Cart
                      </button>
                    </div>
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

export default Wishlist;