// src/routes/Product.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { AuthContext } from './AuthContent';
import { API_URLS } from '../common/urls';
import utils from '../common/utils';

// Mock data for testing without backend
const mockProductDetail = {
  id: 1,
  name: "Premium Leather Jacket",
  description: "Handcrafted premium leather jacket made with genuine leather and custom stitching. Features two internal pockets and three external pockets with high-quality zippers.",
  price: 199.99,
  stock: 8,
  rating: 4.7,
  image_url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8amFja2V0fGVufDB8fDB8fHww",
  category: "Clothing",
  vendor: {
    name: "Artisan Leatherworks",
    id: 3
  }
};

// Mock related products
const mockRelatedProducts = [
  {
    id: 2,
    name: "Canvas Backpack",
    price: 89.99,
    rating: 4.5,
    image_url: "/assets/example-backpack.jpg",
    stock: 12
  },
  {
    id: 3,
    name: "Leather Wallet",
    price: 49.99,
    rating: 4.8,
    image_url: "/assets/example-wallet.jpg",
    stock: 5
  },
  {
    id: 4,
    name: "Leather Belt",
    price: 39.99,
    rating: 4.6,
    image_url: "/assets/example-belt.jpg",
    stock: 15
  }
];

function Product() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { cartItems, setCartItems } = useCart();
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
  const { isLoggedIn } = useContext(AuthContext);
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);

  // Check if product is in cart
  const isInCart = cartItems.some(item => item.id === parseInt(productId));
  
  // Fetch product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        
        if (utils.useMock()) {
          // Use mock data for testing
          setTimeout(() => {
            setProduct(mockProductDetail);
            // Filter out current product from related products
            setRelatedProducts(
              mockRelatedProducts.filter(p => p.id !== parseInt(productId))
            );
            setLoading(false);
          }, 500);
        } else {
          // Fetch from backend
          const response = await axios.get(`${API_URLS.productDetails}?productId=${productId}`);
          setProduct(response.data);
          
          // Fetch related products based on category
          const relatedResponse = await axios.get(
            `${API_URLS.productsList}?category=${response.data.category}&exclude=${productId}`
          );
          
          // Filter out current product from related products
          setRelatedProducts(
            relatedResponse.data
              .filter(p => p.id !== parseInt(productId))
              .slice(0, 4)
          );
          
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
        setError('Failed to load product details. Please try again.');
        setLoading(false);
      }
    };
    
    fetchProductDetails();
  }, [productId]);
  
  // Check if product is in wishlist
  useEffect(() => {
    if (product) {
      setIsInWishlist(wishlistItems.some(item => item.id === product.id));
    }
  }, [product, wishlistItems]);
  
  // Handle wishlist toggle
  const toggleWishlist = () => {
    if (!product) return;
    
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image_url,
        description: product.description
      });
    }
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      // Increase quantity up to available stock
      const newQuantity = Math.min(existingItem.quantity + quantity, product.stock);
      
      setCartItems(cartItems.map(item => 
        item.id === product.id 
          ? { ...item, quantity: newQuantity } 
          : item
      ));
    } else {
      // Add new item to cart
      setCartItems([...cartItems, { 
        id: product.id, 
        name: product.name, 
        price: product.price,
        image: product.image_url,
        quantity: quantity,
        description: product.description,
        stock: product.stock
      }]);
    }
  };
  
  // Handle buy now
  const handleBuyNow = () => {
    if (!product || product.stock <= 0) return;
    
    handleAddToCart();
    
    if (isLoggedIn) {
      navigate('/checkout');
    } else {
      // Save cart state to localStorage to persist it through login
      localStorage.setItem('pendingCart', JSON.stringify([...cartItems, { 
        id: product.id, 
        name: product.name, 
        price: product.price,
        image: product.image_url,
        quantity: quantity,
        description: product.description,
        stock: product.stock
      }]));
      navigate('/login?redirect=checkout');
    }
  };
  
  // Increase quantity
  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };
  
  // Decrease quantity
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-700"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="bg-red-50 p-4 rounded-lg text-red-700">
          {error}
        </div>
        <button 
          onClick={() => navigate('/shop-all')}
          className="mt-4 px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800"
        >
          Back to Shop
        </button>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="bg-yellow-50 p-4 rounded-lg text-yellow-700">
          Product not found
        </div>
        <button 
          onClick={() => navigate('/shop-all')}
          className="mt-4 px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800"
        >
          Back to Shop
        </button>
      </div>
    );
  }
  
  // Create product images array with just the main image to avoid random placeholders
  const productImages = product.image_url ? [product.image_url] : ["/placeholder.jpg"];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <button onClick={() => navigate('/shop-all')} className="hover:text-green-700">
          Shop
        </button>
        <span className="mx-2">/</span>
        <button onClick={() => navigate(`/shop-all?category=${product.category}`)} className="hover:text-green-700">
          {product.category}
        </button>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{product.name}</span>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Images */}
        <div className="md:w-1/2">
          {/* Main Image */}
          <div className="mb-4 h-80 md:h-96 overflow-hidden rounded-lg bg-gray-100">
            <img
              src={productImages[selectedImage]}
              alt={product.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/placeholder.jpg";
              }}
            />
          </div>
          
          {/* Thumbnail Images - Only show if we have multiple images */}
          {productImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`h-20 w-20 flex-shrink-0 rounded border-2 overflow-hidden ${
                    selectedImage === index ? 'border-green-700' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} - view ${index + 1}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder.jpg";
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="md:w-1/2">
          <div className="flex flex-col h-full">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            
            {/* Price and Rating */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-green-700">${product.price.toFixed(2)}</span>
              
              {product.rating && (
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i}
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 20 20" 
                        fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                        stroke="currentColor"
                        className="h-5 w-5"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-600 ml-2">
                    {product.rating.toFixed(1)} ({Math.floor(product.rating * 10)} reviews)
                  </span>
                </div>
              )}
            </div>
            
            {/* Stock Information */}
            <div className="mb-4 bg-gray-100 p-3 rounded-lg border border-gray-200">
              {product.stock > 0 ? (
                <div className="flex items-center text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium">Quantity Available: {product.stock} left</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="font-medium">Currently Out of Stock</span>
                </div>
              )}
            </div>
            
            {/* Vendor */}
            {product.vendor && (
              <div className="mb-4">
                <span className="text-gray-600">Vendor: </span>
                <button 
                  onClick={() => navigate(`/vendor/${product.vendor.id}`)}
                  className="text-green-700 hover:underline font-medium"
                >
                  {product.vendor.name}
                </button>
              </div>
            )}
            
            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700">{product.description || "No description available for this product. Please contact the vendor for more information."}</p>
            </div>
            
            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Quantity</h3>
                <div className="flex items-center">
                  <button 
                    onClick={decreaseQuantity}
                    className="p-2 border rounded-l-md hover:bg-gray-100"
                    disabled={quantity <= 1}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value >= 1 && value <= product.stock) {
                        setQuantity(value);
                      }
                    }}
                    className="w-12 text-center py-2 border-t border-b focus:outline-none"
                  />
                  <button 
                    onClick={increaseQuantity}
                    className="p-2 border rounded-r-md hover:bg-gray-100"
                    disabled={quantity >= product.stock}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="mt-auto flex flex-col sm:flex-row gap-3">
              {/* Add to Cart Button */}
              <button 
                onClick={handleAddToCart}
                disabled={product.stock <= 0 || isInCart}
                className={`flex-1 py-3 rounded-lg font-medium flex items-center justify-center ${
                  product.stock <= 0 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : isInCart
                      ? 'bg-green-100 text-green-800 border border-green-600'
                      : 'bg-green-700 text-white hover:bg-green-800'
                }`}
              >
                {product.stock <= 0 
                  ? 'Out of Stock' 
                  : isInCart 
                    ? 'Added to Cart'
                    : 'Add to Cart'
                }
              </button>
              
              {/* Buy Now Button */}
              <button 
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className={`flex-1 py-3 rounded-lg font-medium ${
                  product.stock <= 0 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                Buy Now
              </button>
              
              {/* Wishlist Button */}
              <button 
                onClick={toggleWishlist}
                className={`p-3 rounded-lg ${
                  isInWishlist 
                    ? 'bg-red-100 text-red-600 border border-red-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6" 
                  viewBox="0 0 20 20" 
                  fill={isInWishlist ? "currentColor" : "none"} 
                  stroke="currentColor" 
                  strokeWidth={isInWishlist ? "0" : "2"}
                >
                  <path 
                    fillRule="evenodd" 
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map(relatedProduct => (
              <div 
                key={relatedProduct.id}
                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/product/${relatedProduct.id}`)}
              >
                <div className="h-48 bg-gray-100">
                  <img
                    src={relatedProduct.image_url}
                    alt={relatedProduct.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder.jpg";
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1">{relatedProduct.name}</h3>
                  <div className="flex justify-between items-end">
                    <p className="text-green-700 font-bold">${relatedProduct.price.toFixed(2)}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${relatedProduct.id}`)
                      }}
                      className="text-sm text-green-700 hover:underline"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Product;