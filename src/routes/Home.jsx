import React from 'react'
import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react'

import categoryData from '../mock-data/home/categories.json';
import VendorData from '../mock-data/home/creators.json'

import CategoryCard from '../components/CategoryCard'
import CreatorBubble from '../components/CreatorBubble';
import FeaturedProdCard from '../components/FeaturedProdCard';

function Home() {
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

    // Mock featured products data (this could come from an API or data file)
    const featuredProducts = [
        { id: 1, name: "Handcrafted Vase", price: 79.99 },
        { id: 2, name: "Natural Soap Set", price: 24.99 },
        { id: 3, name: "Ceramic Mug", price: 19.99 },
        { id: 4, name: "Woven Basket", price: 49.99 }
    ];

    return (
        <div className="flex flex-col w-full">
            
            {/* Hero/poster when user first opens the website */}
            <div className="w-full h-[50vh] md:h-[60vh] lg:h-[80vh] bg-black text-white flex flex-col items-center justify-center px-4 md:px-8">  
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6">Welcome to Our Marketplace</h1>
                <p className="text-lg md:text-xl text-center mb-8 max-w-2xl">Discover unique products from local artisans and vendors</p>
                <Link to="/shop-all" className="bg-white text-black hover:bg-gray-200 transition-colors px-6 py-3 rounded-md font-medium text-lg">
                    Shop Now
                </Link>
            </div>
        

            {/* Category section, will contain category cards. horizontal scroll */}
            <div className="w-full py-12 md:py-16 px-4 md:px-8 bg-gray-50">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-8 md:mb-12">
                    Shop By Category
                </h2>

                {/* Embla Carousel Wrapper */}
                <div className="relative max-w-7xl mx-auto">
                    <div ref={catEmblaRef} className="overflow-hidden w-full">
                        <div className="flex">
                            {categoryData.categories.map((cat, index) => (
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

            {/* Vendors section */}
            <div className="w-full py-12 md:py-16 px-4 md:px-8">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-8 md:mb-12">
                    Our Vendors
                </h2>

                {/* Embla Carousel Wrapper */}
                <div className="relative max-w-7xl mx-auto">
                    <div ref={venEmblaRef} className="overflow-hidden w-full">
                        <div className="flex">
                            {VendorData.creators.map((ven, index) => (
                                <div key={index} className="flex-shrink-0 min-w-[200px] w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 p-2 md:p-3">
                                    <Link to={ven.link} className="block h-full">
                                        <CreatorBubble imgSrc={ven.img} name={ven.name} />
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

            {/* Featured Products Section */}
            <div className="w-full py-12 md:py-16 px-4 md:px-8 bg-gray-50">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-8 md:mb-12">
                    Featured Products
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {/* Map through featured products using the FeaturedProdCard component */}
                    {featuredProducts.map((product) => (
                        <FeaturedProdCard key={product.id} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Home