import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URLS } from '../common/urls';
import ImageUploadComponent from './ImageUploadComponent';

function ListingsCard({
    id,
    name = "Product Name",
    price = 99.99,
    stock = 0,
    image = "",
    active = true,
    description = "",
    category = "",
    onUpdate,
    onDelete
}) {
    // State to track if edit form is visible
    const [editTab, setEditTab] = useState(false);
    
    // State to track product data with proper initialization
    const [editProduct, setEditProduct] = useState({
        name,
        price,
        image: image || '',
        active,
        stock,
        description,
        category
    });

    // Update edit product state when props change
    useEffect(() => {
        if (!editTab) {
            setEditProduct({
                name,
                price,
                image: image || '',
                active,
                stock,
                description,
                category
            });
        }
    }, [name, price, image, active, stock, description, category, editTab]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditProduct({
            ...editProduct,
            [name]: type === 'checkbox' ? checked :
                (name === 'price' || name === 'stock') ?
                    parseFloat(value) || 0 : value
        });
    };

    // Handle image upload for product editing
    const handleImageUploaded = (imageUrl) => {
        console.log("Image uploaded in ListingsCard:", imageUrl);
        setEditProduct({
            ...editProduct,
            image: imageUrl
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Ensure image is a string (not null/undefined)
        const updatedProduct = {
            ...editProduct,
            image: editProduct.image || '' 
        };

        console.log("Submitting updated product with image:", updatedProduct.image);
        
        if (onUpdate) {
            onUpdate(id, updatedProduct);
        }

        // Close edit mode
        setEditTab(false);
    };

    // Categories for dropdown
    const productCategories = [
        "Jewelry", "Accessories", "Prints", "Technology",
        "School Spirit", "Crochet", "Art", "Clothing", "Other"
    ];

    // Handler for delete button
    const handleDelete = () => {
        onDelete(id);
    };

    // Force the stock to be a number if it's a string
    const stockValue = typeof stock === 'string' ? parseInt(stock, 10) : stock;
    // Default to 0 if it's NaN
    const normalizedStock = isNaN(stockValue) ? 0 : stockValue;

    // Render edit form
    if (editTab) {
        return (
            <div className="border rounded-lg overflow-hidden shadow-md w-full sm:max-w-sm lg:max-w-md">
                <div className="p-3 sm:p-4">
                    {/* Form to edit changes */}
                    <form className='space-y-2' onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                            <input
                                type="text"
                                name='name'
                                value={editProduct.name}
                                onChange={handleInputChange}
                                className='w-full px-3 py-1 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-green-700'
                                placeholder="Product Name"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Price ($)
                                </label>
                                <input
                                    type="number"
                                    name='price'
                                    value={editProduct.price}
                                    onChange={handleInputChange}
                                    step="0.01"
                                    min="0"
                                    className='w-full px-3 py-1 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-green-700'
                                    placeholder="Price"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Stock
                                </label>
                                <input
                                    type="number"
                                    name='stock'
                                    value={editProduct.stock}
                                    onChange={handleInputChange}
                                    min="0"
                                    className='w-full px-3 py-1 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-green-700'
                                    placeholder="Quantity"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            <select
                                name="category"
                                value={editProduct.category}
                                onChange={handleInputChange}
                                className='w-full px-3 py-1 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-green-700'
                                required
                            >
                                <option value="">Select Category</option>
                                {productCategories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Image Upload Component */}
                        <ImageUploadComponent
                            onImageUploaded={handleImageUploaded}
                            currentImage={editProduct.image || ''}
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                name='description'
                                value={editProduct.description}
                                onChange={handleInputChange}
                                rows={3}
                                className='w-full px-3 py-1 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-green-700'
                                placeholder="Product description"
                                required
                            />
                        </div>

                        <div className='flex items-center pl-1'>
                            <input
                                type="checkbox"
                                id='active'
                                name='active'
                                checked={editProduct.active}
                                onChange={handleInputChange}
                                className='h-4 w-4 rounded'
                            />
                            <label htmlFor="active" className='ml-2 block text-sm text-gray-700'>
                                List as active (visible to customers)
                            </label>
                        </div>

                        <div className="flex justify-between mt-3">
                            <div className='space-x-2'>
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white rounded-md text-base px-3 py-1 border hover:bg-green-700"
                                >
                                    Update
                                </button>

                                <button
                                    type="button"
                                    className='text-gray-600 hover:text-gray-800'
                                    onClick={() => setEditTab(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="text-red-600 hover:text-red-800"
                            >
                                Delete
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    // Listing Component - When not in edit mode
    return (
        <div className="border rounded-lg overflow-hidden shadow-md w-full sm:max-w-sm lg:max-w-md hover:shadow-lg transition-shadow">
            {/* Fixed height image container */}
            <div className="h-40 sm:h-48 bg-white relative">
                {image && image.trim() !== "" ? (
                    <img
                        src={image}
                        alt={name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                            // On error, replace with "No Image" text
                            const parent = e.target.parentNode;
                            e.target.style.display = 'none';
                            
                            // Check if we already added the no-image div
                            if (!parent.querySelector('.no-image-text')) {
                                const noImageDiv = document.createElement('div');
                                noImageDiv.className = 'flex items-center justify-center h-full w-full bg-white no-image-text';
                                noImageDiv.innerHTML = '<span class="text-gray-500 text-lg font-medium">No Image</span>';
                                parent.appendChild(noImageDiv);
                            }
                        }}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full w-full bg-white no-image-text">
                        <span className="text-gray-500 text-lg font-medium">No Image</span>
                    </div>
                )}

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

            <div className="p-3 sm:p-4">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-lg sm:text-xl mb-1 truncate">{name}</h3>
                    <span className="text-sm bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                        {category}
                    </span>
                </div>

                <p className="text-gray-500 text-sm mb-2 line-clamp-2">{description}</p>

                <div className="flex justify-between items-center">
                    <p className="text-gray-800 font-medium">${typeof price === 'number' ? price.toFixed(2) : price}</p>

                    <div className="flex items-center">
                        <span className="text-sm mr-3">
                            {normalizedStock > 0 ? `In stock: ${normalizedStock}` : 'Out of stock'}
                        </span>

                        {/* Status indicator */}
                        <span className={`h-3 w-3 rounded-full ${active ? 'bg-green-500' : 'bg-gray-400'} mr-2`}></span>
                        <span className="text-xs">{active ? 'Active' : 'Inactive'}</span>
                    </div>
                </div>

                <div className="flex justify-between mt-3 pt-3 border-t">
                    <button
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        onClick={() => setEditTab(true)}
                    >
                        Edit
                    </button>

                    <button
                        onClick={handleDelete}
                        className="text-red-600 hover:text-red-800 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ListingsCard;