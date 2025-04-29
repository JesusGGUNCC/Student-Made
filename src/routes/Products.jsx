import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { fetchMockProducts } from '../mock-data/product/mockProducts';
import { API_URLS } from '../common/urls';
import  utils from '../common/utils';

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (utils.useMock()) {
          console.log("Using mock products data...");
          const data = await fetchMockProducts();
          setProducts(data);
        } else {
          const response = await fetch(API_URLS.productsList);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className='pt-10 flex flex-col items-center'>
      <p className='text-4xl font-bold'>Shop</p>

      <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-10 w-full'>
        {products.map(product => (
          <ProductCard
            key={product.id}
            prodImg={product.image_url}
            prodName={product.name}
            prodRating={product.rating}
            prodPrice={product.price}
          />
        ))}
      </div>
    </div>
  );
}



export default Products;