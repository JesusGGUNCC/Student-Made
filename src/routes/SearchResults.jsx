// src/routes/SearchResults.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import SearchFilter from '../components/SearchFilter';
import { API_URLS } from '../common/urls';
import Utils from '../common/utils';
import { fetchMockProducts } from '../mock-data/product/mockProducts';

function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialSearchTerm = queryParams.get('q') || '';
  const initialCategory = queryParams.get('category') || '';
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  
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
        
        setProducts(data);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(data.map(product => product.category).filter(Boolean))];
        setCategories(uniqueCategories);
        
        // Apply initial filters from URL
        applyFilters(data, {
          searchTerm: initialSearchTerm,
          category: initialCategory,
          priceRange: { 
            min: queryParams.get('min_price') || '', 
            max: queryParams.get('max_price') || '' 
          },
          sortBy: queryParams.get('sort') || 'default'
        });
        
        setError(null);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [initialSearchTerm, initialCategory]);

  const applyFilters = (productsToFilter, filters) => {
    const { searchTerm, category, priceRange, sortBy } = filters;
    
    let filtered = [...productsToFilter];
    
    // Apply search term filter
    if (searchTerm) {
      const lowercaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(lowercaseSearchTerm) ||
        (product.description && product.description.toLowerCase().includes(lowercaseSearchTerm))
      );
    }
    
    // Apply category filter
    if (category) {
      filtered = filtered.filter(product => product.category === category);
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
  };

  const handleSearch = (filters) => {
    // Update URL with filter parameters
    const newParams = new URLSearchParams();
    if (filters.searchTerm) newParams.set('q', filters.searchTerm);
    if (filters.category) newParams.set('category', filters.category);
    if (filters.priceRange.min) newParams.set('min_price', filters.priceRange.min);
    if (filters.priceRange.max) newParams.set('max_price', filters.priceRange.max);
    if (filters.sortBy && filters.sortBy !== 'default') newParams.set('sort', filters.sortBy);
    
    navigate(`/search?${newParams.toString()}`);
    
    // Apply filters to products
    applyFilters(products, filters);
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl md:text-4xl font-bold text-center mb-6'>
        {initialSearchTerm ? 
          `Search Results for "${initialSearchTerm}"` : 
          (initialCategory ? `${initialCategory} Products` : 'All Products')}
      </h1>
      
      {/* Search and Filter Component */}
      <SearchFilter 
        onSearch={handleSearch} 
        categories={categories} 
        initialFilters={{
          searchTerm: initialSearchTerm,
          category: initialCategory,
          priceRange: { 
            min: queryParams.get('min_price') || '', 
            max: queryParams.get('max_price') || '' 
          },
          sortBy: queryParams.get('sort') || 'default'
        }}
      />
      
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
      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No products found matching your criteria</p>
          <button 
            onClick={() => navigate('/shop-all')}
            className="text-green-600 hover:text-green-800 font-medium"
          >
            Browse all products
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
              prodStock={product.stock}
              prodDescription={product.description}
            />
          ))}
        </div>
      )}
      
      {/* Product Count */}
      {!loading && filteredProducts.length > 0 && (
        <div className="mt-6 text-gray-500 text-center">
          Showing {filteredProducts.length} results
        </div>
      )}
    </div>
  );
}

export default SearchResults;