// src/routes/VendorPublicProfile.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URLS } from '../common/urls';
import ProductCard from '../components/ProductCard';

function VendorPublicProfile() {
  const { vendorId } = useParams();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch vendor details and products
  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        setLoading(true);
        
        // Fetch vendor details
        const vendorResponse = await axios.get(`${API_URLS.vendorDetails}/${vendorId}`);
        setVendor(vendorResponse.data);
        
        // Fetch vendor products
        const productsResponse = await axios.get(`${API_URLS.productsList}?vendor_id=${vendorId}`);
        const activeProducts = productsResponse.data.filter(product => product.active !== false);
        setProducts(activeProducts);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching vendor data:', err);
        setError('Failed to load vendor information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (vendorId) {
      fetchVendorData();
    }
  }, [vendorId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
        </div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-700 p-6 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-2">Vendor Not Found</h2>
          <p className="mb-4">{error || "Unable to find vendor information"}</p>
          <Link 
            to="/" 
            className="inline-block bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Vendor Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold mb-6">{vendor.company_name || vendor.name}'s Shop</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vendor Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-green-800 border-b pb-2">Vendor Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-gray-600 font-medium">Vendor Name</p>
                <p className="text-gray-800">{vendor.name}</p>
              </div>
              
              {vendor.email && (
                <div>
                  <p className="text-gray-600 font-medium">Contact Email</p>
                  <p className="text-gray-800">{vendor.email}</p>
                </div>
              )}
              
              {vendor.phone && (
                <div>
                  <p className="text-gray-600 font-medium">Phone</p>
                  <p className="text-gray-800">{vendor.phone}</p>
                </div>
              )}
              
              {vendor.registered_at && (
                <div>
                  <p className="text-gray-600 font-medium">Vendor Since</p>
                  <p className="text-gray-800">{new Date(vendor.registered_at).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Store Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-green-800 border-b pb-2">Store Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-gray-600 font-medium">Store Name</p>
                <p className="text-gray-800">{vendor.company_name || `${vendor.name}'s Store`}</p>
              </div>
              
              {vendor.description && (
                <div>
                  <p className="text-gray-600 font-medium">About the Store</p>
                  <p className="text-gray-800">{vendor.description}</p>
                </div>
              )}
              
              <div>
                <p className="text-gray-600 font-medium">Products Available</p>
                <p className="text-gray-800">{products.length}</p>
              </div>
              
              {products.length > 0 && (
                <div>
                  <p className="text-gray-600 font-medium">Product Categories</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {[...new Set(products.map(item => item.category))]
                      .filter(Boolean)
                      .map((category, index) => (
                        <span key={index} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                          {category}
                        </span>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Products Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Products Available</h2>
        
        {products.length === 0 ? (
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <p className="text-gray-500">This vendor doesn't have any products listed yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
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
      </div>
    </div>
  );
}

export default VendorPublicProfile;