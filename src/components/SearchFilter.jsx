// src/components/SearchFilter.jsx - Fixed version
import React, { useState, useEffect } from 'react';

function SearchFilter({ onSearch, categories, initialFilters = {} }) {
  const [searchTerm, setSearchTerm] = useState(initialFilters.searchTerm || '');
  const [selectedCategory, setSelectedCategory] = useState(initialFilters.category || '');
  const [priceRange, setPriceRange] = useState(initialFilters.priceRange || { min: '', max: '' });
  const [sortBy, setSortBy] = useState(initialFilters.sortBy || 'default');
  const [expanded, setExpanded] = useState(false);

  // Apply initial filters on component mount
  useEffect(() => {
    handleFilterChange();
  }, []);

  // Debounce search to avoid too many filter operations while typing
  useEffect(() => {
    const handler = setTimeout(() => {
      handleFilterChange();
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, selectedCategory, priceRange, sortBy]);

  const handleFilterChange = () => {
    onSearch({
      searchTerm,
      category: selectedCategory,
      priceRange,
      sortBy
    });
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange({
      ...priceRange,
      [name]: value
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange({ min: '', max: '' });
    setSortBy('default');
    onSearch({
      searchTerm: '',
      category: '',
      priceRange: { min: '', max: '' },
      sortBy: 'default'
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      {/* Search Input */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
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

      {/* Mobile toggle */}
      <div className="md:hidden mb-2">
        <button 
          onClick={() => setExpanded(!expanded)}
          className="w-full flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md text-gray-700"
        >
          <span>Filters & Sorting</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 transition-transform ${expanded ? 'transform rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Filter Options (hidden on mobile unless expanded) */}
      <div className={`flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-6 ${expanded ? 'block' : 'hidden md:flex'}`}>
        {/* Category Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
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
            onChange={(e) => setSortBy(e.target.value)}
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
  );
}

export default SearchFilter;