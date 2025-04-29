import React from 'react'
import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react'

import categoryData from '../mock-data/home/categories.json';
import VendorData from '../mock-data/home/creators.json'

import CategoryCard from '../components/CategoryCard'
import CreatorBubble from '../components/CreatorBubble';

function Home() {
    // Separate Embla carousel for categories
    const [catEmblaRef, catEmblaAPI] = useEmblaCarousel({ loop: true });

    // Separate Embla carousel for vendors
    const [venEmblaRef, venEmblaAPI] = useEmblaCarousel({ loop: true });

    const catScrollPrev = () => catEmblaAPI.scrollPrev();
    const catScrollNext = () => catEmblaAPI.scrollNext();

    const venScrollPrev = () => venEmblaAPI.scrollPrev();
    const venScrollNext = () => venEmblaAPI.scrollNext();

    return (
        <div className='flex flex-col'>
            
            {/* Hero/poster when user first opens the website */}
            <div className='w-screen h-[80vh] bg-black text-white flex items-center justify-center'>  
                {/* Buttons that can lead to shopping page */}
            </div>
        


            {/* Category section, will contain category cards. horizontal scroll */}
            <div className='w-screen h-[60vh] flex flex-col'>

                <p className='py-15 text-6xl text-black place-self-center'>
                    Shop By Category
                </p>

                {/* Embla Carousel Wrapper */}
                <div className='relative'>
                    <div ref={catEmblaRef} className='overflow-hidden w-full'>
                        <div className='flex'>

                            {categoryData.categories.map((cat, index) => (
                                <div key={index} className='flex-shrink-0 min-w-[250px] mx-2'>
                                    <Link to={cat.link}>
                                        <CategoryCard imgSrc={cat.img} category={cat.name} />
                                    </Link>
                                </div>
                            ))}

                        </div>
                    </div>

                    {/* Left Arrow */}
                    <button 
                        onClick={catScrollPrev} 
                        className='absolute left-0 top-1/2 transform -translate-y-1/2 bg-black text-white p-2'>
                        &lt;
                    </button>

                    {/* Right Arrow */}
                    <button 
                        onClick={catScrollNext} 
                        className='absolute right-0 top-1/2 transform -translate-y-1/2 bg-black text-white p-2'>
                        &gt;
                    </button>

                </div>
            </div>



            {/* Featured items that are being sold. Could use the creator bubble for this */}
            <div className='w-screen h-[60vh] flex flex-col'>

                <p className='py-15 text-6xl text-black place-self-center'>
                    Our Vendors
                </p>

                {/* Embla Carousel Wrapper */}
                <div className='relative'>
                    <div ref={venEmblaRef} className='overflow-hidden w-full'>
                        <div className='flex'>

                            {VendorData.creators.map((ven, index) => (
                                <div key={index} className='flex-shrink-0 min-w-[250px] mx-2'>
                                    <Link to={ven.link}>
                                        <CreatorBubble imgSrc={ven.img} name={ven.name} />
                                    </Link>
                                </div>
                            ))}

                        </div>
                    </div>

                    {/* Left Arrow */}
                    <button 
                        onClick={venScrollPrev} 
                        className='absolute left-0 top-1/2 transform -translate-y-1/2 bg-black text-white p-2'>
                        &lt;
                    </button>

                    {/* Right Arrow */}
                    <button 
                        onClick={venScrollNext} 
                        className='absolute right-0 top-1/2 transform -translate-y-1/2 bg-black text-white p-2'>
                        &gt;
                    </button>

                </div>
            </div>



            {/* Vendors sections. Horizontal scroll that includes all the vendors available */}
            <div className=''>

            </div>

        </div>
    )
}

export default Home