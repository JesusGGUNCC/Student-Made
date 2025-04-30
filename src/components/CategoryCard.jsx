import React from 'react'

function CategoryCard({ imgSrc, category }) {
    return (
        <div className='w-full h-48 sm:h-56 md:h-64 lg:h-72 relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer'>
            <img 
                src={imgSrc} 
                alt={`${category} category`} 
                className='w-full h-full object-cover transition-transform duration-300 hover:scale-105'
            />
            <div className='absolute inset-0 bg-opacity-30 hover:bg-opacity-40 transition-opacity duration-300'></div>
            <div className='absolute inset-0 flex items-center justify-center p-4'>
                <p className='text-white text-xl sm:text-2xl md:text-3xl font-bold text-center drop-shadow-lg'>
                    {category}
                </p>
            </div>
        </div>
    )
}

export default CategoryCard