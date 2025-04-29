import React from 'react';

function ProductCard({ prodImg, prodName, prodRating, prodPrice }) {
    return (
        <div className='flex flex-col w-[38vh] h-[45vh] rounded-2xl m-2 shadow-md hover:shadow-xl items-center'>

            <img src={prodImg} alt={prodName} className='w-[80%] h-[60%] rounded-xl mt-3 mb-7'/>

            <p className='text-xl font-semibold text-center'>
                {prodName}
            </p>

            <p className='my-2 text-gray-500'>
                Rating: {prodRating ? prodRating.toFixed(1) : 'N/A'}
            </p>

            <p className='font-semibold text-green-600'>
                ${prodPrice ? prodPrice.toFixed(2) : '0.00'}
            </p>
        </div>
    );
}

export default ProductCard;