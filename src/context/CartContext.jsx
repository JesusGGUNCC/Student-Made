import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URLS } from '../common/urls';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error parsing saved cart:', e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Calculate total number of items in cart
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Calculate cart subtotal
  const cartSubtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Add an item to cart
  const addToCart = (product, quantity = 1) => {
    // Check if product has enough stock
    if (product.stock < quantity) {
      setError('Not enough inventory available');
      return false;
    }

    setCartItems(prevItems => {
      // Check if item already in cart
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
      
      if (existingItemIndex !== -1) {
        // Item exists, update quantity if enough stock available
        const newQuantity = prevItems[existingItemIndex].quantity + quantity;
        
        if (newQuantity > product.stock) {
          setError('Not enough inventory available');
          return prevItems;
        }
        
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: newQuantity
        };
        return updatedItems;
      } else {
        // Add new item
        return [...prevItems, {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image_url || product.image,
          quantity,
          stock: product.stock,
          description: product.description || ''
        }];
      }
    });
    
    return true;
  };

  // Update item quantity in cart
  const updateCartItemQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    
    setCartItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === productId) {
          // Check if quantity is valid
          if (quantity > item.stock) {
            setError('Not enough inventory available');
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Verify cart items are in stock before checkout
  const verifyCartInventory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const productIds = cartItems.map(item => item.id);
      
      // Skip verification if cart is empty
      if (productIds.length === 0) {
        return true;
      }
      
      // Fetch latest product details to check stock
      const response = await axios.post(`${API_URLS.productsList}/verify`, { productIds });
      const currentProducts = response.data;
      
      // Check if any items are out of stock or have insufficient quantity
      let inventoryValid = true;
      const updatedCart = cartItems.map(item => {
        const currentProduct = currentProducts.find(p => p.id === item.id);
        
        // If product not found or inactive, mark for removal
        if (!currentProduct || !currentProduct.active) {
          inventoryValid = false;
          return { ...item, invalidReason: 'no_longer_available' };
        }
        
        // If not enough stock, update available stock and mark as invalid
        if (currentProduct.stock < item.quantity) {
          inventoryValid = false;
          return { 
            ...item, 
            stock: currentProduct.stock,
            invalidReason: currentProduct.stock > 0 ? 'insufficient_stock' : 'out_of_stock'
          };
        }
        
        // Product is valid, update with latest stock
        return { ...item, stock: currentProduct.stock };
      });
      
      // Update cart with latest stock information
      setCartItems(updatedCart);
      
      return inventoryValid;
    } catch (err) {
      console.error('Error verifying cart inventory:', err);
      setError('Unable to verify product availability. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      setCartItems, 
      cartItemCount,
      cartSubtotal,
      loading,
      error,
      addToCart,
      updateCartItemQuantity,
      removeFromCart,
      clearCart,
      verifyCartInventory
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}