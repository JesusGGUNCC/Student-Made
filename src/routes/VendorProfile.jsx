// src/routes/VendorProfile.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Country, State } from 'country-state-city';

import { AuthContext } from './AuthContent';
import { API_URLS } from '../common/urls';
import VendorApplicationStatus from '../components/VendorApplicationStatus';
import PaymentCard from '../components/PaymentCard';
import ListingsCard from '../components/ListingsCard';
import ImageUploadComponent from '../components/ImageUploadComponent';

function VendorProfile() {
    const navigate = useNavigate();
    const { isLoggedIn, user, userRole } = useContext(AuthContext);

    // Redirect if not logged in or not a vendor
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login?redirect=vendor-profile');
            return;
        }

        // Check if user is a vendor or has a pending application
        // This will be handled by the VendorApplicationStatus component
    }, [isLoggedIn, navigate]);

    // State to track active tab
    const [activeTab, setActiveTab] = useState('profile');

    // State to control visibility of add listing form
    const [showAddForm, setShowAddForm] = useState(false);
    const [bulkImportMode, setBulkImportMode] = useState(false);
    const [bulkProductsText, setBulkProductsText] = useState('');

    // State to store listings data
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // State for new listing form data
    const [newListing, setNewListing] = useState({
        name: '',
        price: '',
        stock: 1,
        image: '',
        description: '',
        category: '',
        active: true
    });

    // State for editing profile
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileData, setProfileData] = useState({
        storeName: user ? `${user.username}'s Store` : '',
        phoneNumber: '',
        bio: '',
        contactEmail: user ? user.email : ''
    });

    // Fetch vendor's products when component mounts or when tab changes
    useEffect(() => {
        if (activeTab === 'listings' && isLoggedIn && user) {
            fetchVendorProducts();
        }
    }, [activeTab, isLoggedIn, user]);

    // Fetch vendor products from backend
    const fetchVendorProducts = async () => {
        try {
            setLoading(true);
            console.log("Fetching products for vendor:", user.username);

            const response = await axios.get(`${API_URLS.vendorProducts}?username=${user.username}`);

            // Process response data to ensure image field is properly handled
            const processedProducts = response.data.map(product => ({
                ...product,
                // Ensure image field is never null or undefined
                image: product.image_url || product.image || ''
            }));

            console.log("Received products:", processedProducts);
            setListings(processedProducts);
            setError(null);
        } catch (err) {
            console.error('Error fetching vendor products:', err);
            setError('Failed to load your products. Please try again.');
            // If backend request fails, use mock data
            setListings([
                { id: 1, name: "Handmade Bracelet", price: 29.99, stock: 5, image: "", description: "Beautiful handcrafted bracelet", category: "Jewelry", active: true },
                { id: 2, name: "Custom T-Shirt", price: 24.99, stock: 10, image: "", description: "UNCC themed custom t-shirt", category: "Clothing", active: true },
                { id: 3, name: "Digital Art Print", price: 15.99, stock: 0, image: "", description: "Digital art print - Charlotte skyline", category: "Prints", active: false }
            ]);
        } finally {
            setLoading(false);
        }
    };

    // ---- Profile Tab State Management ----
    const [deliveryOption, setDeliveryOption] = useState('shipping');
    const [billingAddressSameAsShipping, setBillingAddressSameAsShipping] = useState(true);

    const handleListingInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewListing({
            ...newListing,
            [name]: type === 'checkbox'
                ? checked
                : name === 'price' || name === 'stock'
                    ? parseFloat(value) || 0
                    : value
        });
    };

    // Handle profile data changes
    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData({
            ...profileData,
            [name]: value
        });
    };

    // Handle saving profile data
    const handleSaveProfile = () => {
        // In a real implementation, you would send profile data to the backend
        console.log("Saving profile data:", profileData);
        setIsEditingProfile(false);
    };

    // Handle image upload for new product
    const handleImageUploaded = (imageUrl) => {
        // Make sure to trim and validate the URL
        const validatedUrl = imageUrl && imageUrl.trim() !== '' ? imageUrl.trim() : '';
        setNewListing({
            ...newListing,
            image: validatedUrl
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validate form
            if (!newListing.name || !newListing.price || !newListing.description || !newListing.category) {
                throw new Error('Please fill in all required fields');
            }

            // Add vendor username
            const productData = {
                ...newListing,
                vendor_username: user.username,
                // Ensure image is a valid string, not null or undefined
                image: newListing.image || ''
            };

            // Send to backend
            const response = await axios.post(API_URLS.addProduct, productData);

            // Add to listings with the returned ID
            setListings([
                ...listings,
                {
                    ...newListing,
                    id: response.data.product_id
                }
            ]);

            // Reset form and hide it
            setNewListing({
                name: '',
                price: '',
                stock: 1,
                image: '',
                description: '',
                category: '',
                active: true
            });
            setShowAddForm(false);
            setError(null);
        } catch (err) {
            setError(err.message || 'Failed to add product. Please try again.');
            console.error('Error adding product:', err);

            // If no backend yet, just add to local state with mock ID
            if (!API_URLS.addProduct) {
                const mockId = Math.floor(Math.random() * 10000);
                setListings([
                    ...listings,
                    {
                        ...newListing,
                        id: mockId
                    }
                ]);
                setNewListing({
                    name: '',
                    price: '',
                    stock: 1,
                    image: '',
                    description: '',
                    category: '',
                    active: true
                });
                setShowAddForm(false);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleBulkImport = async () => {
        try {
            setLoading(true);

            // Parse the bulk import text (CSV or JSON format)
            let productsToAdd = [];
            try {
                // Attempt to parse as JSON
                productsToAdd = JSON.parse(bulkProductsText);
            } catch (parseError) {
                // If not JSON, try to parse as CSV
                const lines = bulkProductsText.split('\n');
                const headers = lines[0].split(',').map(h => h.trim());

                for (let i = 1; i < lines.length; i++) {
                    if (!lines[i].trim()) continue;

                    const values = lines[i].split(',').map(v => v.trim());
                    const product = {};

                    headers.forEach((header, index) => {
                        if (header === 'price' || header === 'stock') {
                            product[header] = parseFloat(values[index]) || 0;
                        } else if (header === 'active') {
                            product[header] = values[index].toLowerCase() === 'true';
                        } else {
                            product[header] = values[index];
                        }
                    });

                    productsToAdd.push(product);
                }
            }

            // Add vendor username to each product
            productsToAdd = productsToAdd.map(product => ({
                ...product,
                vendor_username: user.username
            }));

            // Send to backend
            const response = await axios.post(API_URLS.bulkAddProducts, { products: productsToAdd });

            // Update listings with new products
            fetchVendorProducts();

            // Reset form
            setBulkProductsText('');
            setBulkImportMode(false);
            setError(null);
        } catch (err) {
            setError('Failed to import products. Please check your data format and try again.');
            console.error('Error importing products:', err);
        } finally {
            setLoading(false);
        }
    };

    // Updated handleUpdateListing function with improved image handling
    const handleUpdateListing = async (id, updatedData) => {
        try {
            setLoading(true);

            // Make a copy of the data to avoid mutating the original
            const productData = {
                ...updatedData,
                vendor_username: user.username
            };

            // Log the image URL being sent
            console.log(`Updating product ${id} with image URL:`, productData.image);

            // Send update to backend
            const response = await axios.put(`${API_URLS.updateProduct}/${id}`, productData);

            // Update local state with the exact same data sent to server
            const updatedListings = listings.map(listing =>
                listing.id === id ? { ...listing, ...productData } : listing
            );

            setListings(updatedListings);
            setError(null);

            console.log('Product updated successfully:', response.data);
        } catch (err) {
            console.error('Error updating product:', err);

            // Detailed error logging
            if (err.response) {
                console.error('Response data:', err.response.data);
                console.error('Response status:', err.response.status);
                setError(`Failed to update product: ${err.response.data?.error || 'Server error'}`);
            } else if (err.request) {
                setError('Failed to update product: No response from server');
            } else {
                setError(`Failed to update product: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteListing = async (id) => {
        console.log('handleDeleteListing called with ID:', id);

        try {
            console.log('Setting loading state to true');
            setLoading(true);

            console.log('Making delete API call to:', `${API_URLS.deleteProduct}/${id}`);
            console.log('With username param:', user.username);

            // Try the request with different formats to see which works
            // Method 1: URL parameter
            await axios.delete(`${API_URLS.deleteProduct}/${id}?username=${user.username}`);

            console.log('Delete API call successful');

            // Update local state
            setListings(listings.filter(listing => listing.id !== id));
            setError(null);
            console.log('Updated listings in state');
        } catch (err) {
            console.error('Error details:', err);

            if (err.response) {
                console.error('Response status:', err.response.status);
                console.error('Response data:', err.response.data);
            } else if (err.request) {
                console.error('No response received from server');
            } else {
                console.error('Error message:', err.message);
            }

            setError('Failed to delete product. Please check console for details.');
        } finally {
            console.log('Setting loading state to false');
            setLoading(false);
        }
    };

    // Categories for the dropdown
    const productCategories = [
        "Jewelry", "Accessories", "Prints", "Technology",
        "School Spirit", "Crochet", "Art", "Clothing", "Other"
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Vendor Application Status */}
            <VendorApplicationStatus />

            {/* Tabs Navigation */}
            <div className="flex border-b mb-10">
                <button
                    className={`py-3 px-6 font-medium text-lg ${activeTab === 'profile' ? 'border-b-2 border-green-700 text-green-700' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('profile')}
                >
                    Profile
                </button>
                <button
                    className={`py-3 px-6 font-medium text-lg ${activeTab === 'listings' ? 'border-b-2 border-green-700 text-green-700' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('listings')}
                >
                    My Products
                </button>
                <button
                    className={`py-3 px-6 font-medium text-lg ${activeTab === 'orders' ? 'border-b-2 border-green-700 text-green-700' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('orders')}
                >
                    Orders
                </button>
            </div>

            {/* Profile Tab Content */}
            {activeTab === 'profile' && (
                <>
                    <h1 className="text-4xl font-bold mb-6">Vendor Profile</h1>
                    
                    {/* Profile Details Section */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        {isEditingProfile ? (
                            // Edit Profile Form
                            <form className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Store Name
                                        </label>
                                        <input
                                            type="text"
                                            name="storeName"
                                            value={profileData.storeName}
                                            onChange={handleProfileChange}
                                            className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-green-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Contact Email
                                        </label>
                                        <input
                                            type="email"
                                            name="contactEmail"
                                            value={profileData.contactEmail}
                                            onChange={handleProfileChange}
                                            className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-green-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            value={profileData.phoneNumber}
                                            onChange={handleProfileChange}
                                            className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-green-700"
                                            placeholder="(123) 456-7890"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Store/Vendor Bio
                                    </label>
                                    <textarea
                                        name="bio"
                                        value={profileData.bio}
                                        onChange={handleProfileChange}
                                        rows="4"
                                        className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-green-700"
                                        placeholder="Tell customers about yourself and your products..."
                                    ></textarea>
                                </div>
                                
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditingProfile(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSaveProfile}
                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        ) : (
                            // Profile Display
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Vendor Basic Information */}
                                <div>
                                    <h3 className="text-xl font-semibold mb-4 text-green-800 border-b pb-2">Basic Information</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-gray-600 font-medium">Vendor Name</p>
                                            <p className="text-gray-800">{user ? user.username : 'Loading...'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 font-medium">Email Address</p>
                                            <p className="text-gray-800">{user ? user.email : 'Loading...'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 font-medium">Account Status</p>
                                            <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                                                Active Vendor
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 font-medium">Member Since</p>
                                            <p className="text-gray-800">
                                                {user && user.created_at 
                                                    ? new Date(user.created_at).toLocaleDateString() 
                                                    : new Date().toLocaleDateString()}
                                            </p>
                                        </div>
                                        {profileData.phoneNumber && (
                                            <div>
                                                <p className="text-gray-600 font-medium">Phone Number</p>
                                                <p className="text-gray-800">{profileData.phoneNumber}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Store Information */}
                                <div>
                                    <h3 className="text-xl font-semibold mb-4 text-green-800 border-b pb-2">Store Information</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-gray-600 font-medium">Store Name</p>
                                            <p className="text-gray-800">{profileData.storeName || (user ? `${user.username}'s Store` : 'Loading...')}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 font-medium">Products Listed</p>
                                            <p className="text-gray-800">{listings ? listings.length : '0'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 font-medium">Product Categories</p>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {listings && listings.length > 0
                                                    ? [...new Set(listings.map(item => item.category))]
                                                        .filter(Boolean)
                                                        .map((category, index) => (
                                                            <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                                                {category}
                                                            </span>
                                                        ))
                                                    : <span className="text-gray-500">No categories yet</span>
                                                }
                                            </div>
                                        </div>
                                        {profileData.bio && (
                                            <div>
                                                <p className="text-gray-600 font-medium">Store Bio</p>
                                                <p className="text-gray-800">{profileData.bio}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action buttons */}
                        {!isEditingProfile && (
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        onClick={() => setActiveTab('listings')}
                                        className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition-colors"
                                    >
                                        Manage Products
                                    </button>
                                    <button
                                        onClick={() => setIsEditingProfile(true)}
                                        className="border border-green-700 text-green-700 px-4 py-2 rounded hover:bg-green-50 transition-colors"
                                    >
                                        Edit Profile
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Products Tab Content */}
            {activeTab === 'listings' && (
                <div>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
                        <p className="text-4xl font-bold mb-4 md:mb-0">My Products</p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                className="bg-green-600 rounded-md text-white py-2 px-4 text-base sm:text-lg hover:bg-green-700 transition-colors"
                                onClick={() => {
                                    setShowAddForm(true);
                                    setBulkImportMode(false);
                                }}
                            >
                                + Add New Product
                            </button>
                            <button
                                className="border border-green-600 text-green-700 rounded-md py-2 px-4 text-base sm:text-lg hover:bg-green-50 transition-colors"
                                onClick={() => {
                                    setShowAddForm(true);
                                    setBulkImportMode(true);
                                }}
                            >
                                Bulk Import
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
                            {error}
                        </div>
                    )}

                    {/* Add Product Form */}
                    {showAddForm && !bulkImportMode && (
                        <div className="bg-gray-50 p-6 mb-8 rounded-lg border">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-2xl font-semibold">Add New Product</h3>
                                <button
                                    className="text-gray-500 hover:text-gray-700"
                                    onClick={() => setShowAddForm(false)}
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Product Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={newListing.name}
                                            onChange={handleListingInputChange}
                                            className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-green-700"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Category <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="category"
                                            value={newListing.category}
                                            onChange={handleListingInputChange}
                                            className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-green-700"
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            {productCategories.map(category => (
                                                <option key={category} value={category}>{category}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Price ($) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={newListing.price}
                                            onChange={handleListingInputChange}
                                            step="0.01"
                                            min="0"
                                            className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-green-700"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Stock Quantity <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            name="stock"
                                            value={newListing.stock}
                                            onChange={handleListingInputChange}
                                            min="0"
                                            className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-green-700"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* New Image Upload Component */}
                                <ImageUploadComponent
                                    onImageUploaded={handleImageUploaded}
                                    currentImage={newListing.image}
                                />

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="description"
                                        value={newListing.description}
                                        onChange={handleListingInputChange}
                                        rows="3"
                                        className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-green-700"
                                        required
                                    ></textarea>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="active"
                                        name="active"
                                        checked={newListing.active}
                                        onChange={handleListingInputChange}
                                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                                        List as active (visible to customers)
                                    </label>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddForm(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-green-300"
                                        disabled={loading}
                                    >
                                        {loading ? 'Adding...' : 'Add Product'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Bulk Import Form */}
                    {showAddForm && bulkImportMode && (
                        <div className="bg-gray-50 p-6 mb-8 rounded-lg border">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-2xl font-semibold">Bulk Import Products</h3>
                                <button
                                    className="text-gray-500 hover:text-gray-700"
                                    onClick={() => setShowAddForm(false)}
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="mb-4">
                                <p className="text-gray-700 mb-2">
                                    Import multiple products at once by pasting JSON or CSV data.
                                </p>
                                <p className="text-sm text-gray-600 mb-4">
                                    Format should include: name, price, stock, description, category, and optionally image and active status.
                                </p>

                                <div className="bg-gray-100 p-3 rounded-md mb-4 text-xs font-mono overflow-x-auto">
                                    <p>Example JSON format:</p>
                                    <pre>
                                        {`[
  {
    "name": "Product Name",
    "price": 19.99,
    "stock": 10,
    "description": "Product description",
    "category": "Jewelry",
    "image": "https://example.com/image.jpg",
    "active": true
  },
  {...}
]`}
                                    </pre>
                                    <p className="mt-2">Example CSV format:</p>
                                    <pre>
                                        {`name,price,stock,description,category,image,active
Product Name,19.99,10,Product description,Jewelry,https://example.com/image.jpg,true
...`}
                                    </pre>
                                </div>

                                <textarea
                                    value={bulkProductsText}
                                    onChange={(e) => setBulkProductsText(e.target.value)}
                                    rows="10"
                                    className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-green-700 font-mono text-sm"
                                    placeholder="Paste your JSON or CSV data here..."
                                    required
                                ></textarea>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleBulkImport}
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-green-300"
                                    disabled={loading || !bulkProductsText.trim()}
                                >
                                    {loading ? 'Importing...' : 'Import Products'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Loading state */}
                    {loading && !showAddForm && (
                        <div className="text-center py-10">
                            <svg className="animate-spin h-10 w-10 text-green-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="mt-2 text-gray-600">Loading products...</p>
                        </div>
                    )}

                    {/* Container for Listings */}
                    {!loading && listings.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <p className="text-gray-500 mb-4">You don't have any products listed yet.</p>
                            <button
                                onClick={() => {
                                    setShowAddForm(true);
                                    setBulkImportMode(false);
                                }}
                                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                            >
                                Add Your First Product
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Map through listings and render enhanced ListingsCard component */}
                            {!loading && listings.map(listing => (
                                <ListingsCard
                                    key={listing.id}
                                    id={listing.id}
                                    name={listing.name}
                                    price={listing.price}
                                    stock={listing.stock}
                                    image={listing.image}
                                    description={listing.description}
                                    category={listing.category}
                                    active={listing.active}
                                    onUpdate={handleUpdateListing}
                                    onDelete={handleDeleteListing}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Orders Tab Content */}
            {activeTab === 'orders' && (
                <div className="text-center py-8">
                    <p className="text-xl text-gray-600 mb-4">Order management will be available in the next update.</p>
                    <p className="text-gray-500">You'll be able to view, process, and manage customer orders here.</p>
                </div>
            )}
        </div>
    );
}

export default VendorProfile;