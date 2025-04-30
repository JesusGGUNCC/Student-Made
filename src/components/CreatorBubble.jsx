import React from 'react'

function CreatorBubble({ imgSrc, name }) {
    return (
        <div className='flex flex-col items-center w-full transition-transform duration-300 hover:scale-105'>
            <div className='relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 overflow-hidden rounded-full mb-3 shadow-md'>
                <img 
                    src={imgSrc} 
                    alt={`${name} vendor`} 
                    className='w-full h-full object-cover'
                />
            </div>
            <p className='text-sm sm:text-base md:text-lg font-medium text-center truncate w-full'>
                {name}
            </p>
        </div>
    )
}

export default CreatorBubble