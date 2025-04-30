import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import axios from 'axios';
import { API_URLS } from '../common/urls';

import CategoryCard from '../components/CategoryCard';
import CreatorBubble from '../components/CreatorBubble';
import ProductCard from '../components/ProductCard';

function Home() {
    // State for data
    const [categories, setCategories] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Separate Embla carousel for categories
    const [catEmblaRef, catEmblaAPI] = useEmblaCarousel({
        loop: true,
        align: 'start',
        slidesToScroll: 1,
        breakpoints: {
            '(min-width: 768px)': { slidesToScroll: 2 },
            '(min-width: 1024px)': { slidesToScroll: 3 }
        }
    });

    // Separate Embla carousel for vendors
    const [venEmblaRef, venEmblaAPI] = useEmblaCarousel({
        loop: true,
        align: 'start',
        slidesToScroll: 1,
        breakpoints: {
            '(min-width: 768px)': { slidesToScroll: 2 },
            '(min-width: 1024px)': { slidesToScroll: 3 }
        }
    });

    const catScrollPrev = React.useCallback(() => {
        if (catEmblaAPI) catEmblaAPI.scrollPrev();
    }, [catEmblaAPI]);

    const catScrollNext = React.useCallback(() => {
        if (catEmblaAPI) catEmblaAPI.scrollNext();
    }, [catEmblaAPI]);

    const venScrollPrev = React.useCallback(() => {
        if (venEmblaAPI) venEmblaAPI.scrollPrev();
    }, [venEmblaAPI]);

    const venScrollNext = React.useCallback(() => {
        if (venEmblaAPI) venEmblaAPI.scrollNext();
    }, [venEmblaAPI]);

    // Fetch data on component mount
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch products
                const productsResponse = await axios.get(API_URLS.productsList);
                const products = productsResponse.data.filter(product => product.active !== false);

                // Get featured products (either the newest or highest rated)
                const sortedProducts = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0));
                setFeaturedProducts(sortedProducts.slice(0, 8)); // Get top 8 products

                // Extract unique categories from products
                const uniqueCategories = [...new Set(products.map(product => product.category).filter(Boolean))];
                const categoryData = uniqueCategories.map(category => {
                    // Find a product with this category to use as the category image
                    const productWithCategory = products.find(product => product.category === category && product.image_url);
                    return {
                        name: category,
                        img: productWithCategory?.image_url || '/assets/example-image.jpg',
                        link: `/shop-all?category=${encodeURIComponent(category)}`
                    };
                });
                setCategories(categoryData);

                // Fetch vendors
                const vendorsResponse = await axios.get(API_URLS.vendorAll);
                if (vendorsResponse.data && Array.isArray(vendorsResponse.data)) {
                    const vendorData = vendorsResponse.data.map(vendor => ({
                        name: vendor.name || `Vendor ${vendor.id}`,
                        img: '/assets/person-example.jpg', // Default vendor image
                        id: vendor.id,
                        link: `/vendor/${vendor.id}`
                    }));
                    setVendors(vendorData);
                }

                setError(null);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load content. Please try again later.');

                // Set empty arrays in case of error
                setCategories([]);
                setVendors([]);
                setFeaturedProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="flex flex-col w-full">
            {/* Hero/poster when user first opens the website */}
            <div className="w-full h-[50vh] md:h-[60vh] lg:h-[80vh] relative">
                <img
                    src="/assets/hero-image.jpg"
                    alt="Niner Mine Hero"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center px-4 md:px-8">
                    <div className="mb-6">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-white inline-block bg-green-800 bg-opacity-80 px-4 py-2 rounded">Welcome to Niner Mine</h1>
                    </div>
                    <div className="mb-8">
                        <p className="text-lg md:text-xl text-center text-white inline-block bg-green-800 bg-opacity-80 px-4 py-2 rounded">Discover unique products from UNCC student artisans and vendors</p>
                    </div>
                    <Link to="/shop-all" className="bg-white text-black hover:bg-gray-200 transition-colors px-6 py-3 rounded-md font-medium text-lg">
                        Shop Now
                    </Link>
                </div>
            </div>

            {/* Loading state */}
            {loading && (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
                </div>
            )}

            {/* Error state */}
            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg m-6 text-center">
                    {error}
                </div>
            )}

            {/* Category section */}
            {!loading && categories.length > 0 && (
                <div className="w-full py-12 md:py-16 px-4 md:px-8 bg-gray-50">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-8 md:mb-12">
                        Shop By Category
                    </h2>

                    {/* Embla Carousel Wrapper */}
                    <div className="relative max-w-7xl mx-auto">
                        <div ref={catEmblaRef} className="overflow-hidden w-full">
                            <div className="flex">
                                {categories.map((cat, index) => (
                                    <div key={index} className="flex-shrink-0 min-w-[250px] w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2 md:p-3">
                                        <Link to={cat.link} className="block h-full">
                                            <CategoryCard imgSrc={cat.img} category={cat.name} />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Left Arrow */}
                        <button
                            onClick={catScrollPrev}
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 transition-opacity text-white p-2 md:p-3 rounded-r-md focus:outline-none z-10">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        {/* Right Arrow */}
                        <button
                            onClick={catScrollNext}
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 transition-opacity text-white p-2 md:p-3 rounded-l-md focus:outline-none z-10">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Vendors section */}
            {!loading && vendors.length > 0 && (
                <div className="w-full py-12 md:py-16 px-4 md:px-8">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-8 md:mb-12">
                        Our Vendors
                    </h2>

                    {/* Embla Carousel Wrapper */}
                    <div className="relative max-w-7xl mx-auto">
                        <div ref={venEmblaRef} className="overflow-hidden w-full">
                            <div className="flex">
                                {vendors.map((vendor, index) => (
                                    <div key={index} className="flex-shrink-0 min-w-[200px] w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 p-2 md:p-3">
                                        <Link to={`/vendor/${vendor.id}`} className="block h-full">
                                            <CreatorBubble imgSrc={vendor.img} name={vendor.name} />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Left Arrow */}
                        <button
                            onClick={venScrollPrev}
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 transition-opacity text-white p-2 md:p-3 rounded-r-md focus:outline-none z-10">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        {/* Right Arrow */}
                        <button
                            onClick={venScrollNext}
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 transition-opacity text-white p-2 md:p-3 rounded-l-md focus:outline-none z-10">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Featured Products Section */}
            {!loading && featuredProducts.length > 0 && (
                <div className="w-full py-12 md:py-16 px-4 md:px-8 bg-gray-50">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-8 md:mb-12">
                        Featured Products
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                        {featuredProducts.map((product) => (
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
                </div>
            )}

            {/* No products state */}
            {!loading && featuredProducts.length === 0 && !error && (
                <div className="w-full py-12 text-center">
                    <p className="text-gray-500 mb-4">No products available yet. Check back soon!</p>
                </div>
            )}
        </div>
    );
}

export default Home;