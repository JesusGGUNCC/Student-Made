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
    
    // State to track product data
    const [editProduct, setEditProduct] = useState({
        name: name,
        price: price,
        image: image,
        active: active,
        stock: stock,
        description: description,
        category: category
    });

    useEffect(() => {
        setEditProduct({
            name: name,
            price: price,
            image: image,
            active: active,
            stock: stock,
            description: description,
            category: category
        });

    }, [name, price, image, active, stock, description, category]);

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
        setEditProduct({
            ...editProduct,
            image: imageUrl
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Make sure image is a string and not null/undefined
        const updatedProduct = {
            ...editProduct,
            image: editProduct.image || '' // Ensure image is at least an empty string
        };

        if(onUpdate){
            onUpdate(id, updatedProduct);
        }

        setEditTab(false);
    };

    // Categories for dropdown
    const productCategories = [
        "Jewelry", "Accessories", "Prints", "Technology", 
        "School Spirit", "Crochet", "Art", "Clothing", "Other"
    ];

    // Handler for delete button
    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            onDelete(id);
        }
    };

    // Force the stock to be a number if it's a string
    const stockValue = typeof stock === 'string' ? parseInt(stock, 10) : stock;
    // Default to 0 if it's NaN
    const normalizedStock = isNaN(stockValue) ? 0 : stockValue;

    // Use a placeholder image if no image is available
    const placeholderImage = "/placeholder.jpg";
    const displayImage = image || placeholderImage;

    // Conditional Rendering that shows form to edit changes for the listing component
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
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
                            currentImage={editProduct.image}
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
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
            <div className="h-40 sm:h-48 bg-gray-200 relative">
                <img 
                    src={displayImage} 
                    alt={name} 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = placeholderImage;
                    }}
                />
                
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