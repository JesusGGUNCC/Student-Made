import React, { useContext, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { AuthContext } from '../routes/AuthContent';
import { useWishlist } from '../context/WishlistContext';

function Header() {
    const { wishlistItems } = useWishlist();
    const wishlistItemCount = wishlistItems.length;
    const { cartItemCount } = useCart();
    const navigate = useNavigate();
    const { isLoggedIn, logout, userRole } = useContext(AuthContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/");
        setIsMobileMenuOpen(false);
    };

    const toggleDropdown = (e) => {
        e.stopPropagation();
        setIsDropdownOpen(!isDropdownOpen);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    useEffect(() => {
        const handleClickOutside = () => {
            if (isDropdownOpen) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isDropdownOpen]);

    return (
        <nav className='px-4 sm:px-6 md:px-10 flex flex-wrap justify-between items-center h-[10vh] bg-(--niner-green) text-white'>
            {/* ... existing code */}

            {/* Desktop menu */}
            <div className='hidden md:flex items-center justify-between w-full max-w-[500px] text-base lg:text-lg font-medium'>
                <Link to="/about" className="px-2 lg:px-3 hover:text-gray-300">About</Link>
                <Link to="/shop-all" className="px-2 lg:px-3 hover:text-gray-300">Shop</Link>

                {isLoggedIn ? (
                    <div className="relative px-2 lg:px-3">
                        <button
                            onClick={toggleDropdown}
                            className="hover:text-gray-300 rounded hover:bg-green-700 transition-colors"
                        >
                            My Profile
                        </button>

                        {isDropdownOpen && (
                            <div
                                className="absolute right-0 mt-1 w-44 bg-gray-200 rounded-md shadow-lg z-50 border border-gray-300 overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Link
                                    to="/buyerprofile"
                                    className="block px-4 py-2.5 text-gray-800 hover:bg-gray-300 text-[0.95rem] font-medium transition-colors"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    Profile
                                </Link>

                                {/* Add admin dashboard link for admin users */}
                                {userRole === 'admin' && (
                                    <>
                                        <div className="border-t border-gray-400 mx-2"></div>
                                        <Link
                                            to="/admin"
                                            className="block px-4 py-2.5 text-gray-800 hover:bg-gray-300 text-[0.95rem] font-medium transition-colors"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            Admin Dashboard
                                        </Link>
                                    </>
                                )}

                                <div className="border-t border-gray-400 mx-2"></div>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2.5 text-gray-800 hover:bg-gray-300 text-[0.95rem] font-medium transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/login" className="px-2 lg:px-3 hover:text-gray-300">Join/Login</Link>
                )}

                <Link to="/wishlist" className="flex items-center relative px-2 lg:px-3 hover:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {wishlistItemCount > 0 && (
                        <span className="absolute -top-2 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {wishlistItemCount}
                        </span>
                    )}
                </Link>
                <Link to="/cart" className="flex items-center relative px-2 lg:px-3 hover:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    {cartItemCount > 0 && (
                        <span className="absolute -top-2 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {cartItemCount}
                        </span>
                    )}
                </Link>
            </div>

            {/* Update mobile menu to include admin link */}
            {isMobileMenuOpen && (
                <div className="md:hidden w-full pt-2 pb-3 space-y-1">
                    {/* ... existing mobile menu links */}

                    {isLoggedIn && userRole === 'admin' && (
                        <Link
                            to="/admin"
                            className="block px-3 py-2 hover:bg-green-700 rounded-md"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Admin Dashboard
                        </Link>
                    )}

                    {/* ... rest of mobile menu */}
                </div>
            )}
        </nav>
    );
}

export default Header