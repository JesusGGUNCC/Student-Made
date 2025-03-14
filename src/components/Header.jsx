import React from 'react'
import { ShoppingCart } from "lucide-react"

function Header() {
    return (
        <div className='px-10 flex justify-between items-center h-[10vh] bg-(--niner-green) text-white'>
            {/* Logo + Title */}
            <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Niner Mine Logo" className="h-8 w-8" />
                <h1 className="text-4xl font-bold">Niner Mine</h1>
            </div>

            {/* Navigation Links */}
        <div className="flex items-center gap-6 text-lg">
            <p className="hover:text-[#C49A6C] cursor-pointer">About</p>
            <p className="hover:text-[#C49A6C] cursor-pointer">Shop</p>
            <p className="hover:text-[#C49A6C] cursor-pointer">Join/Login</p>
        </div>

            {/* Shopping Cart with Counter */}
        <div className="flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-[#C49A6C]" />
            <span className="bg-red-500 text-white px-2 rounded-full text-sm">0</span>
        </div>
    </div>   
)


}

export default Header
