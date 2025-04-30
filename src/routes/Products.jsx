// src/routes/Products.jsx - With working filters
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { fetchMockProducts } from '../mock-data/product/mockProducts';
import { API_URLS } from '../common/urls';
import Utils from '../common/utils';

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('default');
  const [filtersApplied, setFiltersApplied] = useState(false);
  
  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let data;
        
        if (Utils.useMock()) {
          console.log("Using mock products data...");
          data = await fetchMockProducts();
        } else {
          const response = await axios.get(API_URLS.productsList);
          data = response.data;
        }
        
        // Filter out inactive products before setting the data
        const activeProducts = data.filter(product => product.active !== false);
        
        setProducts(activeProducts);
        setFilteredProducts(activeProducts); // Initial filtered set is all active products
        
        // Extract unique categories
        const uniqueCategories = [...new Set(activeProducts.map(product => product.category).filter(Boolean))];
        setCategories(uniqueCategories);
        
        setError(null);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, []);

  // Apply filters when filter states change
  useEffect(() => {
    if (products.length === 0) return;
    
    // Only apply filtering if user has interacted with filters
    if (!filtersApplied && !searchTerm && !selectedCategory && !priceRange.min && !priceRange.max && sortBy === 'default') {
      setFilteredProducts(products);
      return;
    }
    
    let filtered = [...products];
    
    // Apply search term filter
    if (searchTerm) {
      const lowercaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(lowercaseSearchTerm) ||
        (product.description && product.description.toLowerCase().includes(lowercaseSearchTerm))
      );
    }
    
    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    // Apply price range filter
    if (priceRange.min) {
      filtered = filtered.filter(product => product.price >= parseFloat(priceRange.min));
    }
    
    if (priceRange.max) {
      filtered = filtered.filter(product => product.price <= parseFloat(priceRange.max));
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        // Assuming newer products have higher IDs or a date field
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        // Default sorting (relevance) - no change
        break;
    }
    
    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, priceRange, sortBy, filtersApplied]);

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setFiltersApplied(true);
  };

  // Handle category selection
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setFiltersApplied(true);
  };

  // Handle price range changes
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange({
      ...priceRange,
      [name]: value
    });
    setFiltersApplied(true);
  };

  // Handle sort selection
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setFiltersApplied(true);
  };

  // Reset all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange({ min: '', max: '' });
    setSortBy('default');
    setFiltersApplied(false);
    setFilteredProducts(products);
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl md:text-4xl font-bold text-center mb-6'>Shop All Products</h1>
      
      {/* Filter Section */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        {/* Search Input */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-3 py-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-6">
          {/* Category Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Range
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                name="min"
                placeholder="Min"
                value={priceRange.min}
                onChange={handlePriceChange}
                className="w-1/2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                min="0"
              />
              <input
                type="number"
                name="max"
                placeholder="Max"
                value={priceRange.max}
                onChange={handlePriceChange}
                className="w-1/2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                min="0"
              />
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="default">Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Best Rating</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="py-2 px-4 border border-green-600 text-green-700 rounded-md hover:bg-green-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
      
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 text-center">
          {error}
        </div>
      )}
      
      {/* No Results */}
      {!loading && filtersApplied && filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No products found matching your criteria</p>
          <button 
            onClick={clearFilters}
            className="text-green-600 hover:text-green-800 font-medium"
          >
            Clear filters and show all products
          </button>
        </div>
      )}
      
      {/* Products Grid */}
      {!loading && filteredProducts.length > 0 && (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              id={product.id}
              prodImg={product.image_url || '/placeholder.jpg'}
              prodName={product.name}
              prodRating={product.rating}
              prodPrice={product.price}
              prodStock={product.stock || 0}
              prodDescription={product.description || ''}
              active={product.active !== false}
            />
          ))}
        </div>
      )}
      
      {/* Product Count */}
      {!loading && filteredProducts.length > 0 && (
        <div className="mt-6 text-gray-500 text-center">
          Showing {filteredProducts.length} out of {products.length} products
        </div>
      )}
    </div>
  );
}

export default Products;