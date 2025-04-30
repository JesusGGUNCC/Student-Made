import React from 'react'

function FeaturedProdCard({ name = "Product Name", price = "$99.99", image = "" }) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-64 bg-gray-200">
                {image && <img src={image} alt={name} className="w-full h-full object-cover" />}
            </div>
            <div className="p-4">
                <h3 className="font-medium text-lg">{name}</h3>
                <p className="text-gray-600">${typeof price === 'number' ? price.toFixed(2) : price}</p>
            </div>
        </div>
    )
}

export default FeaturedProdCard