import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  // Load wishlist from localStorage on initial render
  const [wishlistItems, setWishlistItems] = useState(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Add item to wishlist
  const addToWishlist = (item) => {
    // Don't add if already in wishlist
    if (wishlistItems.some(wishlistItem => wishlistItem.id === item.id)) {
      return;
    }
    
    setWishlistItems([...wishlistItems, item]);
  };

  // Remove item from wishlist
  const removeFromWishlist = (itemId) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== itemId));
  };

  // Toggle item in wishlist (add if not present, remove if present)
  const toggleWishlistItem = (item) => {
    if (wishlistItems.some(wishlistItem => wishlistItem.id === item.id)) {
      removeFromWishlist(item.id);
    } else {
      addToWishlist(item);
    }
  };

  return (
    <WishlistContext.Provider value={{ 
      wishlistItems, 
      addToWishlist,
      removeFromWishlist,
      toggleWishlistItem
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}