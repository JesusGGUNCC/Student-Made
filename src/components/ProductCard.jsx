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

    // In the handleAddToCart function in ProductCard.jsx
    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Don't add if out of stock
        if (normalizedStock <= 0) return;

        // Check if item already in cart
        const existingItem = cartItems.find(item => item.id === id);

        if (existingItem) {
            // Only allow increasing quantity if it doesn't exceed available stock
            if (existingItem.quantity < normalizedStock) {
                setCartItems(cartItems.map(item =>
                    item.id === id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                ));
            }
            // If already at max stock, don't increase (do nothing)
        } else {
            // Add new item to cart
            setCartItems([...cartItems, {
                id,
                name: prodName,
                price: prodPrice,
                image: prodImg,
                quantity: 1,
                stock: normalizedStock,
                description: prodDescription
            }]);
        }
    };

    // Ensure stock is a number
    const stockValue = typeof prodStock === 'string' ? parseInt(prodStock, 10) : prodStock;
    // Default to 0 if it's NaN
    const normalizedStock = isNaN(stockValue) ? 0 : stockValue;

    // Use a placeholder image if no image is provided
    const placeholderImage = "/placeholder.jpg";
    const displayImage = prodImg || placeholderImage;

    return (
        <Link to={`/product/${id}`} className="block">
            <div className='flex flex-col w-full h-full rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300'>
                <div className="relative">
                    {/* Fixed height image container */}
                    <div className="w-full h-64 overflow-hidden">
                        <img
                            src={displayImage}
                            alt={prodName}
                            className='w-full h-full object-cover rounded-t-2xl'
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = placeholderImage;
                            }}
                        />
                    </div>

                    {/* Wishlist button */}
                    <button
                        onClick={handleWishlistToggle}
                        className={`absolute top-2 left-2 p-2 rounded-full ${isInWishlist ? 'bg-red-100 text-red-500' : 'bg-white text-gray-400 hover:text-red-500'
                            }`}
                        aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill={isInWishlist ? "currentColor" : "none"} stroke="currentColor" strokeWidth={isInWishlist ? "0" : "1.5"}>
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
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
                    {/* Fixed height title container to prevent shifting */}
                    <div className="h-14">
                        <h3 className='text-lg font-semibold line-clamp-2'>
                            {prodName}
                        </h3>
                    </div>

                    {/* Fixed height description container */}
                    {prodDescription && (
                        <div className="h-10 mb-2">
                            <p className="text-gray-600 text-sm line-clamp-2">
                                {prodDescription}
                            </p>
                        </div>
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