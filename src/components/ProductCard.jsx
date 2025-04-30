import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

function ProductCard({ id, prodImg, prodName, prodRating, prodPrice, prodStock = 0, prodDescription = "", active = true }) {
    const { cartItems, setCartItems } = useCart();
    const { wishlistItems, toggleWishlistItem } = useWishlist();

    // Check if product is in cart
    const isInCart = cartItems.some(item => item.id === id);

    // Check if product is in wishlist
    const isInWishlist = wishlistItems.some(item => item.id === id);

    // If product is not active, don't render it
    if (active === false) {
        return null;
    }

    // Function to handle wishlist toggle
    const handleWishlistToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();

        toggleWishlistItem({
            id,
            name: prodName,
            price: prodPrice,
            image: prodImg,
            stock: prodStock,
            description: prodDescription
        });
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Don't add if out of stock
        if (prodStock <= 0) return;
        
        // Check if item already in cart
        const existingItem = cartItems.find(item => item.id === id);
        
        if (existingItem) {
          // Increase quantity up to available stock
          if (existingItem.quantity < prodStock) {
            setCartItems(cartItems.map(item => 
              item.id === id 
                ? { ...item, quantity: item.quantity + 1 } 
                : item
            ));
          }
        } else {
          // Add new item to cart
          setCartItems([...cartItems, { 
            id, 
            name: prodName, 
            price: prodPrice,
            image: prodImg,
            quantity: 1,
            stock: prodStock,
            description: prodDescription
          }]);
        }
    };

    // Force the prodStock to be a number if it's a string
    const stockValue = typeof prodStock === 'string' ? parseInt(prodStock, 10) : prodStock;
    // Default to 0 if it's NaN
    const normalizedStock = isNaN(stockValue) ? 0 : stockValue;

    return (
        <Link to={`/product/${id}`} className="block">
            <div className='flex flex-col w-full h-full rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300'>
                <div className="relative">
                    <img
                        src={prodImg}
                        alt={prodName}
                        className='w-full h-64 object-cover rounded-t-2xl'
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/placeholder.jpg";
                        }}
                    />

                    {/* Wishlist button */}
                    <button
                        onClick={handleWishlistToggle}
                        className={`absolute top-2 left-2 p-2 rounded-full ${isInWishlist ? 'bg-red-100 text-red-500' : 'bg-white text-gray-400 hover:text-red-500'
                            }`}
                        aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill={isInWishlist ? "currentColor" : "none"} stroke="currentColor" strokeWidth={isInWishlist ? "0" : "2"}>
                            <path fillRule="evenodd" d="M3.172 5.172a4.5 4.5 0 015.656 0L10 6.343l1.172-1.171a4.5 4.5 0 115.656 5.656L10 17.657l-6.828-6.829a4.5 4.5 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                    </button>

                    {/* Stock badge */}
                    {normalizedStock <= 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                            SOLD OUT
                        </div>
                    )}
                    {normalizedStock > 0 && normalizedStock <= 5 && (
                        <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                            LOW STOCK: {normalizedStock}
                        </div>
                    )}
                </div>

                <div className="p-4 flex-grow flex flex-col">
                    <h3 className='text-lg font-semibold line-clamp-2 mb-1'>
                        {prodName}
                    </h3>

                    {prodDescription && (
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                            {prodDescription}
                        </p>
                    )}

                    <div className="flex items-center justify-between mt-auto">
                        <div>
                            <p className='font-semibold text-green-600 text-lg'>
                                ${typeof prodPrice === 'number' ? prodPrice.toFixed(2) : parseFloat(prodPrice).toFixed(2)}
                            </p>
                            
                            {/* Only show stock info if product is in stock */}
                            {normalizedStock > 0 && (
                                <p className="text-xs text-gray-600">
                                    In stock: {normalizedStock} left
                                </p>
                            )}

                            {prodRating && (
                                <div className="flex items-center">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill={i < Math.floor(prodRating) ? "currentColor" : "none"}
                                                stroke="currentColor"
                                                className="h-4 w-4"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="text-gray-500 text-xs ml-1">
                                        {prodRating.toFixed(1)}
                                    </span>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={normalizedStock <= 0 || isInCart}
                            className={`px-3 py-1 rounded-full text-sm font-medium ${normalizedStock <= 0
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : isInCart
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-green-500 text-white hover:bg-green-600'
                                }`}
                        >
                            {normalizedStock <= 0
                                ? 'Sold Out'
                                : isInCart
                                    ? 'In Cart'
                                    : 'Add to Cart'
                            }
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default ProductCard;