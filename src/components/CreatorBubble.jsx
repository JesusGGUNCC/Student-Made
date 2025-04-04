import React from 'react'


function CreatorBubble({ imgSrc, name}) {
    return (
        <div className='w-60 h-60 flex flex-col items-center'>
            <img src={imgSrc} alt="Vendor icon" className='rounded-full w-13/18'/>
            <p className='text-[1.25em] pt-3'>
                {name}
            </p>
        </div>
    )
}

export default CreatorBubble