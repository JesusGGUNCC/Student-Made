import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
    return (
        <div className='min-h-[25vh] py-8 flex flex-col md:flex-row justify-evenly items-center px-4 sm:px-6 md:px-10 bg-gray-300 text-black'>
            <div className="mb-6 md:mb-0 text-center md:text-left">
                <h1 className='text-4xl md:text-5xl lg:text-6xl'>Niner Mine</h1>
            </div>

            <div className='text-base sm:text-lg w-full md:w-auto md:pl-4 lg:pl-10'>
                <div className='flex flex-col sm:flex-row justify-center md:justify-start p-2 sm:p-5 text-black'>
                    {/* First Section - Links */}
                    <div className='mb-4 sm:mb-0 sm:mx-4 md:mx-6 lg:mx-10'>
                        <p className='text-xl md:text-2xl font-bold text-center sm:text-left'>Explore</p>
                        <div className='text-base md:text-lg mt-2 space-y-1 text-center sm:text-left'>
                            <Link to="/shop-all" className="hover:underline block">Shop All</Link>
                            <p>Custom Orders</p>
                            <Link to="/becomevendor" className="hover:underline block">Become a Vendor</Link>
                        </div>
                    </div>

                    {/* Second Section - Portals */}
                    <div className='mb-4 sm:mb-0 sm:mx-4 md:mx-6 lg:mx-10'>
                        <p className='text-xl md:text-2xl font-bold text-center sm:text-left'>Portals</p>
                        <div className='text-base md:text-lg mt-2 space-y-1 text-center sm:text-left'>
                            <Link to="/vendor/portal" className="hover:underline block">Vendor Portal</Link>
                            <Link to="/admin/portal" className="hover:underline block">Admin Portal</Link>
                        </div>
                    </div>

                    {/* Third Section - Contact Us */}
                    <div className='text-center sm:text-left'>
                        <p className='text-xl md:text-2xl font-bold'>Contact Us</p>
                        <div className='text-base md:text-lg mt-2 space-y-1'>
                            <p>Email: <a href="mailto:support@example.com" className='text-blue-400'>support@example.com</a></p>
                            <p>Phone: <a href="tel:+1234567890" className='text-blue-400'>(123) 456-7890</a></p>
                            <p>Follow us: 
                                <a href="https://instagram.com/example" target="_blank" rel="noopener noreferrer" className='ml-2 text-blue-400'>Instagram</a> | 
                                <a href="https://twitter.com/example" target="_blank" rel="noopener noreferrer" className='ml-2 text-blue-400'>Twitter</a>
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* Copyright Section */}
                <div className="text-center mt-6 text-sm text-gray-600">
                    <p>© {new Date().getFullYear()} Niner Mine. All rights reserved.</p>
                </div>
            </div>
        </div>
    )
}

export default Footer